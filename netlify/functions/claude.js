const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

    // ── RAG: load doc chunks for the session topics ──────────────────────────
    const sessionTopics = Array.isArray(body.topics) ? body.topics : [];
    const docsDir = path.join(__dirname, 'docs');
    let ragContext = '';

    if (sessionTopics.length > 0) {
      const factBlocks = [];

      for (const topic of sessionTopics) {
        // Derive slug: lowercase + hyphens (must match fetch-docs.js slugify logic)
        const slug = topic
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Search all domain subdirectories for this slug
        const domains = ['identity', 'storage', 'compute', 'networking', 'monitoring'];
        let docData = null;

        for (const domain of domains) {
          const filePath = path.join(docsDir, domain, `${slug}.json`);
          try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            docData = JSON.parse(raw);
            break; // found it — stop searching domains
          } catch {
            // File not found for this domain — continue
          }
        }

        if (docData && Array.isArray(docData.key_facts) && docData.key_facts.length > 0) {
          // Use 3-4 key facts per topic to keep the context tight
          const facts = docData.key_facts.slice(0, 4);
          const block = [
            `### ${docData.topic}`,
            `Source: ${docData.url}`,
            facts.map(f => `- ${f}`).join('\n'),
          ].join('\n');
          factBlocks.push(block);
        }
        // If doc not found, silently skip — don't crash
      }

      if (factBlocks.length > 0) {
        ragContext = `\n\nREFERENCE DOCUMENTATION (use these facts to ground your questions in accurate, current Azure behavior):\n\n${factBlocks.join('\n\n')}`;
      }
    }

    // ── System prompt ────────────────────────────────────────────────────────
    const systemPrompt = `You are a Microsoft AZ-104 exam question writer and Azure subject matter expert. You have deep, accurate knowledge of all Azure services as of 2025.

ACCURACY RULES:
1. Every fact, limit, and behavior must be correct for Azure as of 2025
2. If you are not certain about a specific number or behavior, do not make it the crux of a question — use a concept you are certain about instead
3. Wrong answer options must be definitively incorrect, not ambiguous
4. The correct answer must be unambiguously right with no valid exceptions

You are an expert on all AZ-104 domains:
- Identity & Governance: Entra ID, RBAC, Conditional Access, Azure Policy, locks, management groups, cost management
- Storage: LRS/ZRS/GRS/RA-GRS/GZRS/RA-GZRS, blob tiers, lifecycle, SAS tokens, soft delete, versioning, AzCopy, Azure Files
- Compute: VMs, VMSS, availability sets/zones, ARM templates, Bicep, App Service slots, Container Apps, ACI, ACR
- Networking: VNets, peering, NSGs, UDRs, Bastion, private endpoints, service endpoints, DNS, Load Balancer, App Gateway
- Monitor & Backup: Azure Monitor, Log Analytics, alerts, action groups, VM Insights, Network Watcher, Azure Backup, Site Recovery${ragContext}`;

    // Use streaming so Netlify's gateway doesn't timeout waiting for the full response
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: body.model || 'claude-haiku-4-5',
        max_tokens: body.max_tokens || 4000,
        stream: false,
        system: systemPrompt,
        messages: [{ role: 'user', content: body.prompt || '' }],
      }),
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { type: 'function_error', message: err.message } }),
    };
  }
};
