// MS Learn doc URLs per AZ-104 domain
const MS_LEARN_DOCS = {
  identity: [
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/overview',
    'https://learn.microsoft.com/en-us/azure/active-directory/authentication/concept-sspr-howitworks',
    'https://learn.microsoft.com/en-us/azure/governance/policy/overview',
    'https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/overview',
    'https://learn.microsoft.com/en-us/azure/governance/management-groups/overview',
    'https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets',
  ],
  storage: [
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/soft-delete-blob-overview',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview',
  ],
  compute: [
    'https://learn.microsoft.com/en-us/azure/virtual-machines/availability-set-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview',
    'https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots',
    'https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/overview',
    'https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro',
    'https://learn.microsoft.com/en-us/azure/container-apps/overview',
  ],
  networking: [
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview',
    'https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview',
    'https://learn.microsoft.com/en-us/azure/bastion/bastion-overview',
    'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview',
    'https://learn.microsoft.com/en-us/azure/dns/dns-overview',
  ],
  monitoring: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/overview',
    'https://learn.microsoft.com/en-us/azure/backup/backup-overview',
    'https://learn.microsoft.com/en-us/azure/site-recovery/site-recovery-overview',
    'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview',
    'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview',
  ],
};

// Fetch a single MS Learn page server-side (no CORS restrictions)
async function fetchDoc(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AZ104Trainer/1.0)', 'Accept': 'text/html' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    return (main ? main[1] : html)
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);
  } catch (e) {
    return null;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const domain = body.domain || 'all';

    // ── Server-side doc fetching (no CORS issues here)
    let docContext = '';
    try {
      const allDocs = domain === 'all'
        ? Object.values(MS_LEARN_DOCS).flat().sort(() => Math.random() - 0.5).slice(0, 5)
        : (MS_LEARN_DOCS[domain] || []).sort(() => Math.random() - 0.5).slice(0, 4);

      // Fetch docs in parallel with a combined 8s budget
      const results = await Promise.allSettled(allDocs.map(url => fetchDoc(url)));
      const docs = results
        .filter(r => r.status === 'fulfilled' && r.value)
        .map((r, i) => `--- MS LEARN DOC ${i + 1}: ${allDocs[i]} ---\n${r.value}`)
        .join('\n\n');
      docContext = docs;
    } catch (e) {
      console.log('Doc fetch failed:', e.message);
    }

    // ── Build system prompt — grounded in docs if available
    const systemPrompt = docContext
      ? `You are a Microsoft AZ-104 exam question writer. Use the following official Microsoft Learn documentation as your PRIMARY and ONLY source of truth for facts, behaviors, and limits. Do not invent behaviors not described here. If unsure, choose the most conservative well-documented answer.\n\nOFFICIAL MICROSOFT LEARN REFERENCE:\n${docContext}`
      : `You are a Microsoft AZ-104 exam question writer. Every fact must be accurate for Microsoft Azure as of 2025. When uncertain about a specific limit or behavior, choose the safer well-documented answer rather than guessing.`;

    const payload = {
      model: body.model || 'claude-sonnet-4-5',
      max_tokens: body.max_tokens || 7000,
      system: systemPrompt,
      messages: [{ role: 'user', content: body.prompt || '' }],
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
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
