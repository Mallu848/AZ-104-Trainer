// Comprehensive MS Learn doc pool per AZ-104 domain
// Each session randomly picks a subset for variety
const DOCS = {
  identity: [
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/overview',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles',
    'https://learn.microsoft.com/en-us/azure/active-directory/authentication/concept-sspr-howitworks',
    'https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/overview',
    'https://learn.microsoft.com/en-us/azure/governance/policy/overview',
    'https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources',
    'https://learn.microsoft.com/en-us/azure/governance/management-groups/overview',
    'https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets',
    'https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/concept-group-based-licensing',
    'https://learn.microsoft.com/en-us/azure/active-directory/external-identities/what-is-b2b',
  ],
  storage: [
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/soft-delete-blob-overview',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-stored-access-policy-define',
    'https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-overview',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/object-replication-overview',
    'https://learn.microsoft.com/en-us/azure/storage/common/customer-managed-keys-overview',
  ],
  compute: [
    'https://learn.microsoft.com/en-us/azure/virtual-machines/availability-set-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview',
    'https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview',
    'https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots',
    'https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/overview',
    'https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview',
    'https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro',
    'https://learn.microsoft.com/en-us/azure/container-apps/overview',
    'https://learn.microsoft.com/en-us/azure/container-instances/container-instances-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-machines/extensions/overview',
  ],
  networking: [
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview',
    'https://learn.microsoft.com/en-us/azure/bastion/bastion-overview',
    'https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview',
    'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview',
    'https://learn.microsoft.com/en-us/azure/dns/dns-overview',
    'https://learn.microsoft.com/en-us/azure/dns/private-dns-overview',
    'https://learn.microsoft.com/en-us/azure/application-gateway/overview',
  ],
  monitoring: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/overview',
    'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview',
    'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview',
    'https://learn.microsoft.com/en-us/azure/backup/backup-overview',
    'https://learn.microsoft.com/en-us/azure/site-recovery/site-recovery-overview',
    'https://learn.microsoft.com/en-us/azure/azure-monitor/vm/vminsights-overview',
    'https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-overview',
    'https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings',
  ],
};

async function fetchDoc(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' },
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
      .slice(0, 2500);
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

    // Pick 5 docs — shuffle for variety each session, cover different sub-topics
    const pool = domain === 'all'
      ? Object.values(DOCS).flat().sort(() => Math.random() - 0.5).slice(0, 5)
      : (DOCS[domain] || []).sort(() => Math.random() - 0.5).slice(0, 5);

    // Fetch all 5 in parallel — Pro tier gives us 26s, plenty of time
    const results = await Promise.allSettled(pool.map(url => fetchDoc(url)));
    const fetched = results
      .map((r, i) => r.status === 'fulfilled' && r.value
        ? `--- MS LEARN: ${pool[i]} ---\n${r.value}`
        : null)
      .filter(Boolean);

    const docContext = fetched.join('\n\n');
    console.log(`Fetched ${fetched.length}/${pool.length} docs successfully`);

    const systemPrompt = fetched.length > 0
      ? `You are a Microsoft AZ-104 exam question writer. The following official Microsoft Learn documentation is your PRIMARY source of truth. Every fact, behavior, and limit in your questions MUST be consistent with these docs. Do not invent behaviors not described here.\n\nFor topics not covered by these specific docs, use your accurate knowledge of Azure as of 2025. When uncertain, choose the most conservative well-documented answer.\n\nOFFICIAL MICROSOFT LEARN REFERENCE DOCS (${fetched.length} pages):\n${docContext}`
      : `You are a Microsoft AZ-104 exam question writer. Every fact must be accurate for Azure as of 2025. When uncertain about a specific limit or behavior, choose the safer well-documented answer.`;

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
