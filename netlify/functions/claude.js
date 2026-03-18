// Microsoft Learn doc URLs per AZ-104 domain
const MS_LEARN_DOCS = {
  identity: [
    'https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/users-default-permissions',
    'https://learn.microsoft.com/en-us/azure/active-directory/enterprise-users/licensing-groups-assign',
    'https://learn.microsoft.com/en-us/azure/active-directory/authentication/concept-sspr-howitworks',
    'https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/overview',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/overview',
    'https://learn.microsoft.com/en-us/azure/governance/policy/overview',
    'https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources',
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
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-stored-access-policy-define',
    'https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-overview',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-encryption-key-model-get',
  ],
  compute: [
    'https://learn.microsoft.com/en-us/azure/virtual-machines/availability-set-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview',
    'https://learn.microsoft.com/en-us/azure/virtual-machines/extensions/overview',
    'https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/overview',
    'https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview',
    'https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro',
    'https://learn.microsoft.com/en-us/azure/container-instances/container-instances-overview',
    'https://learn.microsoft.com/en-us/azure/container-apps/overview',
    'https://learn.microsoft.com/en-us/azure/app-service/overview',
    'https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots',
    'https://learn.microsoft.com/en-us/azure/virtual-machines/windows/disk-encryption-overview',
  ],
  networking: [
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview',
    'https://learn.microsoft.com/en-us/azure/bastion/bastion-overview',
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview',
    'https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview',
    'https://learn.microsoft.com/en-us/azure/dns/dns-overview',
    'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview',
    'https://learn.microsoft.com/en-us/azure/application-gateway/overview',
  ],
  monitoring: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/overview',
    'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview',
    'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview',
    'https://learn.microsoft.com/en-us/azure/azure-monitor/vm/vminsights-overview',
    'https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-overview',
    'https://learn.microsoft.com/en-us/azure/backup/backup-overview',
    'https://learn.microsoft.com/en-us/azure/site-recovery/site-recovery-overview',
    'https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings',
  ],
};

// Fetch a single MS Learn page and extract the main text content
async function fetchMSLearnPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AZ104Trainer/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Extract main content between <main> tags, strip HTML tags
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const raw = mainMatch ? mainMatch[1] : html;
    const text = raw
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000); // cap per page
    return text || null;
  } catch (e) {
    return null;
  }
}

// Fetch 3-4 docs for the selected topics and return combined reference text
async function fetchDocsForTopics(topics, domain) {
  const allDomainDocs = domain === 'all'
    ? Object.values(MS_LEARN_DOCS).flat()
    : (MS_LEARN_DOCS[domain] || Object.values(MS_LEARN_DOCS).flat());

  // Pick up to 4 docs, shuffle for variety
  const shuffled = allDomainDocs.sort(() => Math.random() - 0.5).slice(0, 4);

  const results = await Promise.allSettled(shuffled.map(url => fetchMSLearnPage(url)));
  const docs = results
    .filter(r => r.status === 'fulfilled' && r.value)
    .map((r, i) => `--- SOURCE ${i+1}: ${shuffled[i]} ---\n${r.value}`)
    .join('\n\n');

  return docs || null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const mode = body.mode || 'explain';

    // ── MODE: generate — fetch docs then generate verified questions
    if (mode === 'generate') {
      const { domain, topics, prompt: userPrompt } = body;

      // Fetch MS Learn reference docs in parallel with a timeout
      let docContext = '';
      try {
        const raw = await Promise.race([
          fetchDocsForTopics(topics || [], domain || 'all'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('doc fetch timeout')), 15000))
        ]);
        docContext = raw || '';
      } catch (e) {
        console.log('Doc fetch failed or timed out, proceeding without docs:', e.message);
      }

      const systemPrompt = docContext
        ? `You are a Microsoft AZ-104 exam question writer. Use the following official Microsoft Learn documentation as your PRIMARY source of truth. Every fact, behavior, and limitation you write must be verifiable in these docs. Do not invent behaviors not described here.\n\nOFFICIAL MICROSOFT LEARN REFERENCE DOCS:\n${docContext}`
        : `You are a Microsoft AZ-104 exam question writer. Every fact must be accurate for Microsoft Azure as of 2025. When uncertain about a specific limit or behavior, choose the safer/more conservative answer.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: body.model || 'claude-sonnet-4-5',
          max_tokens: body.max_tokens || 7000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });

      const data = await response.json();
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      };
    }

    // ── MODE: explain — standard passthrough (existing behavior)
    const payload = {
      model: body.model || 'claude-haiku-4-5',
      max_tokens: body.max_tokens || 1200,
      messages: body.messages,
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
