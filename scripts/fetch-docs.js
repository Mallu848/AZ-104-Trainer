#!/usr/bin/env node
// fetch-docs.js
// Fetches Microsoft Learn documentation for each AZ-104 exam topic,
// extracts key facts, and writes JSON files to netlify/functions/docs/{domain}/{slug}.json
//
// Usage: node scripts/fetch-docs.js
// Do NOT run in CI — this makes ~75-100 HTTP requests to learn.microsoft.com.

'use strict';

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const topicMap = require('./topic-urls');

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a topic string into a URL-safe slug. */
function slugify(topic) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetch a URL and return the raw HTML body as a string.
 * Follows up to 5 redirects. Rejects on HTTP >= 400.
 */
function fetchUrl(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft === 0) {
      return reject(new Error(`Too many redirects for ${url}`));
    }

    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (AZ-104-RAG-Builder/1.0; +https://github.com)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 20000,
    }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        let redirectUrl = res.headers.location;
        // Resolve relative redirects
        if (redirectUrl.startsWith('/')) {
          const parsed = new URL(url);
          redirectUrl = `${parsed.protocol}//${parsed.host}${redirectUrl}`;
        }
        return resolve(fetchUrl(redirectUrl, redirectsLeft - 1));
      }

      if (res.statusCode >= 400) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

/**
 * Strip HTML tags and collapse whitespace.
 * Removes <script>, <style>, <nav>, <header>, <footer>, <aside> blocks entirely.
 */
function stripHtml(html) {
  // Remove entire blocks we don't want
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<aside[\s\S]*?<\/aside>/gi, ' ')
    .replace(/<form[\s\S]*?<\/form>/gi, ' ');

  // Convert block-level elements to newlines for readability
  text = text.replace(/<\/(p|div|li|h[1-6]|tr|td|th)>/gi, '\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');

  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Collapse whitespace
  text = text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return text;
}

/**
 * Extract the main article / content area from raw HTML.
 * Tries <article>, <main>, then falls back to <body>.
 */
function extractArticle(html) {
  // Try <article> first
  const articleMatch = html.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
  if (articleMatch) return stripHtml(articleMatch[1]);

  // Try <main>
  const mainMatch = html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
  if (mainMatch) return stripHtml(mainMatch[1]);

  // Try id="main-content"
  const mainContentMatch = html.match(/id="main-content"[^>]*>([\s\S]*?)<\/div>/i);
  if (mainContentMatch) return stripHtml(mainContentMatch[1]);

  // Fall back to body
  const bodyMatch = html.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return stripHtml(bodyMatch[1]);

  return stripHtml(html);
}

/**
 * Extract 5-8 key facts from plain text content that are most likely
 * to appear on an AZ-104 exam question.
 *
 * Heuristic: prefer sentences containing numbers, limits, specific Azure
 * service names, keywords like "must", "cannot", "required", "maximum",
 * "minimum", "default", "support", "only", "not supported".
 */
function extractKeyFacts(text, topic, maxFacts = 7) {
  // Split into sentences
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 400);

  // Scoring keywords that suggest exam-relevant content
  const highValueTerms = [
    /\b\d+\b/,                              // numbers (limits, counts, timeouts)
    /maximum|minimum|limit|quota/i,
    /must|cannot|required|not supported/i,
    /default|automatically|by default/i,
    /support|supports|supported/i,
    /only|cannot be|will not|does not/i,
    /role|permission|access|policy/i,
    /replicated|redundan|failover|recover/i,
    /encrypt|secure|firewall|endpoint/i,
    /tier|sku|plan|level/i,
    /subscription|resource group|management group/i,
    /portal|cli|powershell|api/i,
  ];

  // Score each sentence
  const scored = sentences.map(s => {
    let score = 0;
    for (const re of highValueTerms) {
      if (re.test(s)) score++;
    }
    // Penalize very short or very long sentences
    if (s.length < 60) score -= 1;
    if (s.length > 300) score -= 2;
    return { sentence: s, score };
  });

  // Sort by score descending, take top maxFacts
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, maxFacts).map(s => s.sentence);

  // If we couldn't extract enough, add a fallback
  if (top.length < 3) {
    // Take first few sentences of the article as fallback
    const fallback = sentences.slice(0, 5).filter(s => !top.includes(s));
    top.push(...fallback.slice(0, 3 - top.length));
  }

  return top;
}

/**
 * Process one topic entry: fetch URL, extract facts, write JSON file.
 */
async function processTopic(entry) {
  const { topic, url, domain } = entry;
  const slug = slugify(topic);
  const outDir = path.join(__dirname, '..', 'netlify', 'functions', 'docs', domain);
  const outPath = path.join(outDir, `${slug}.json`);

  console.log(`  [${domain}] ${topic}`);
  console.log(`         → ${url}`);

  try {
    const html = await fetchUrl(url);
    const articleText = extractArticle(html);
    const keyFacts = extractKeyFacts(articleText, topic);

    const output = {
      topic,
      domain,
      url,
      fetched_at: new Date().toISOString(),
      key_facts: keyFacts,
    };

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`         ✓ wrote ${keyFacts.length} facts → ${path.relative(process.cwd(), outPath)}`);
    return { ok: true, topic };
  } catch (err) {
    console.error(`         ✗ FAILED: ${err.message}`);
    return { ok: false, topic, error: err.message };
  }
}

/**
 * Process topics with a concurrency limit to avoid hammering the server.
 */
async function processWithConcurrency(entries, concurrency = 3) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < entries.length) {
      const current = index++;
      const result = await processTopic(entries[current]);
      results[current] = result;
      // Polite delay between requests
      await new Promise(r => setTimeout(r, 500));
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('AZ-104 RAG Doc Fetcher');
  console.log('======================');
  console.log('Source: topic-urls.js');
  console.log('Output: netlify/functions/docs/{domain}/{slug}.json\n');

  const domains = Object.keys(topicMap);
  let allEntries = [];
  for (const domain of domains) {
    allEntries = allEntries.concat(topicMap[domain]);
  }

  console.log(`Total topics to fetch: ${allEntries.length}`);
  console.log('Concurrency: 3 requests at a time, 500ms delay between each.\n');

  const results = await processWithConcurrency(allEntries, 3);

  const succeeded = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok);

  console.log(`\n══════════════════════════════`);
  console.log(`Done. ${succeeded}/${results.length} topics succeeded.`);

  if (failed.length > 0) {
    console.log(`\nFailed topics (${failed.length}):`);
    failed.forEach(f => console.log(`  - ${f.topic}: ${f.error}`));
    console.log('\nRe-run the script to retry failed topics, or update their URLs in scripts/topic-urls.js');
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
