exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

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
- Monitor & Backup: Azure Monitor, Log Analytics, alerts, action groups, VM Insights, Network Watcher, Azure Backup, Site Recovery`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: body.model || 'claude-sonnet-4-5',
        max_tokens: body.max_tokens || 4000,
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
