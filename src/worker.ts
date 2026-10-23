interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  TAVILY_API_KEY?: string;
  BRAVE_SEARCH_API_KEY?: string;
  SERPER_API_KEY?: string;
  EXA_API_KEY?: string;
  DATAFORSEO_LOGIN?: string;
  DATAFORSEO_PASSWORD?: string;
}
type ProviderId = 'tavily' | 'brave' | 'serper' | 'exa';
type SearchResult = { title: string; url: string; domain: string; snippet: string; source: string; country: string; score: number; state: string };
type SecretKey = Exclude<keyof Env, 'ASSETS'>;
const providerEnv: Record<ProviderId, SecretKey> = {
  tavily: 'TAVILY_API_KEY',
  brave: 'BRAVE_SEARCH_API_KEY',
  serper: 'SERPER_API_KEY',
  exa: 'EXA_API_KEY',
};
const providerName: Record<ProviderId, string> = {
  tavily: 'Tavily', brave: 'Brave Search API', serper: 'Serper.dev', exa: 'Exa',
};
const jsonHeaders = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: jsonHeaders });
}
function isProviderId(value: string): value is ProviderId {
  return value in providerEnv;
}
function isConfigured(env: Env, id: ProviderId) {
  return Boolean(env[providerEnv[id]]);
}
async function callProvider(env: Env, id: ProviderId, query: string, count: number): Promise<unknown[]> {
  const key = env[providerEnv[id]];
  if (!key) throw new Error(`${providerName[id]} API key is not configured.`);
  const boundedCount = Math.max(1, Math.min(100, count));
  if (id === 'tavily') {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ api_key: key, query, search_depth: 'basic', max_results: Math.min(20, boundedCount), include_answer: false }),
    });
    if (!response.ok) throw new Error(`Tavily returned HTTP ${response.status}`);
    const data = await response.json() as { results?: Array<{ title?: string; url?: string; content?: string; score?: number }> };
    return (data.results ?? []).map(item => ({ title: item.title, url: item.url, snippet: item.content, score: item.score }));
  }
  if (id === 'brave') {
    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.set('q', query);
    url.searchParams.set('count', String(Math.min(20, boundedCount)));
    const response = await fetch(url, { headers: { 'X-Subscription-Token': key, Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Brave Search API returned HTTP ${response.status}`);
    const data = await response.json() as { web?: { results?: Array<{ title?: string; url?: string; description?: string; page_age?: string }> } };
    return (data.web?.results ?? []).map(item => ({ title: item.title, url: item.url, snippet: item.description }));
  }
  if (id === 'serper') {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST', headers: { 'X-API-KEY': key, 'content-type': 'application/json' },
      body: JSON.stringify({ q: query, num: Math.min(20, boundedCount) }),
    });
    if (!response.ok) throw new Error(`Serper.dev returned HTTP ${response.status}`);
    const data = await response.json() as { organic?: Array<{ title?: string; link?: string; snippet?: string; position?: number }> };
    return (data.organic ?? []).map(item => ({ title: item.title, url: item.link, snippet: item.snippet, score: item.position ? 1 / item.position : undefined }));
  }
  const response = await fetch('https://api.exa.ai/search', {
    method: 'POST', headers: { 'x-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({ query, type: 'auto', numResults: Math.min(20, boundedCount), contents: { text: { maxCharacters: 1000 } } }),
  });
  if (!response.ok) throw new Error(`Exa returned HTTP ${response.status}`);
  const data = await response.json() as { results?: Array<{ title?: string; url?: string; text?: string; score?: number }> };
  return (data.results ?? []).map(item => ({ title: item.title, url: item.url, snippet: item.text, score: item.score }));
}
function normalizeResults(items: unknown[], source: string, country: string): SearchResult[] {
  return items.flatMap(item => {
    if (!item || typeof item !== 'object') return [];
    const value = item as { title?: unknown; url?: unknown; snippet?: unknown; score?: unknown };
    if (typeof value.url !== 'string' || !/^https?:\/\//i.test(value.url)) return [];
    let domain = '';
    try { domain = new URL(value.url).hostname.replace(/^www\./, ''); } catch { return []; }
    const score = typeof value.score === 'number' ? Math.max(0, Math.min(100, Math.round(value.score <= 1 ? value.score * 100 : value.score))) : 0;
    return [{ title: typeof value.title === 'string' && value.title ? value.title : domain, url: value.url, domain, snippet: typeof value.snippet === 'string' ? value.snippet : '', source, country, score, state: '待审核' }];
  });
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      return json({ status: 'ok', service: 'cortex', timestamp: new Date().toISOString() });
    }
    if (url.pathname === '/api/discovery/providers' && request.method === 'GET') {
      return json({ providers: (Object.keys(providerEnv) as ProviderId[]).map(id => ({ id, name: providerName[id], configured: isConfigured(env, id), enabled: isConfigured(env, id) })) });
    }
    const providerTest = url.pathname.match(/^\/api\/discovery\/providers\/([a-z-]+)\/test$/);
    if (providerTest && request.method === 'POST') {
      const id = providerTest[1];
      if (!isProviderId(id)) return json({ configured: false, ok: false, message: '不支持的搜索服务商。' }, 404);
      if (!isConfigured(env, id)) return json({ configured: false, ok: false, message: `尚未在 Cloudflare Worker Secrets 中配置 ${providerEnv[id]}。` }, 400);
      try {
        await callProvider(env, id, 'test search query', 1);
        return json({ configured: true, ok: true, message: `${providerName[id]} API 连接成功。` });
      } catch (error) {
        return json({ configured: true, ok: false, message: error instanceof Error ? error.message : '服务商连接失败。' }, 502);
      }
    }
    if (url.pathname === '/api/discovery/search' && request.method === 'POST') {
      let body: { query?: unknown; providers?: unknown; limit?: unknown; countries?: unknown; budget?: unknown };
      try { body = await request.json() as typeof body; } catch { return json({ message: '请求体不是有效 JSON。' }, 400); }
      const query = typeof body.query === 'string' ? body.query.trim() : '';
      if (!query) return json({ message: '搜索表达式不能为空。' }, 400);
      const requested = Array.isArray(body.providers) ? body.providers.filter((v): v is ProviderId => typeof v === 'string' && isProviderId(v)) : [];
      const available = [...new Set(requested)].filter(id => isConfigured(env, id));
      if (!available.length) return json({ message: '没有可用的已配置搜索服务商。请在 Cloudflare Worker Secrets 中配置 Tavily、Brave、Serper 或 Exa API Key。' }, 400);
      const limit = typeof body.limit === 'number' && Number.isFinite(body.limit) ? Math.max(1, Math.min(100, Math.floor(body.limit))) : 20;
      const countries = Array.isArray(body.countries) ? body.countries : [];
      const country = countries.length ? String(countries[0]) : '未指定';
      const settled = await Promise.allSettled(available.map(async id => ({ id, items: await callProvider(env, id, query, Math.ceil(limit / available.length)) })));
      const results: SearchResult[] = [];
      const errors: string[] = [];
      for (const result of settled) {
        if (result.status === 'rejected') { errors.push(result.reason instanceof Error ? result.reason.message : '搜索服务调用失败'); continue; }
        results.push(...normalizeResults(result.value.items, providerName[result.value.id], country));
      }
      const unique = [...new Map(results.map(result => [result.url, result])).values()].slice(0, limit);
      if (!unique.length && errors.length) return json({ message: errors.join('；'), taskId: crypto.randomUUID(), results: [] }, 502);
      return json({ taskId: crypto.randomUUID(), results: unique, message: errors.length ? `已返回部分结果；部分服务失败：${errors.join('；')}` : `已完成 ${available.length} 个搜索服务的实时检索，返回 ${unique.length} 条去重网页结果。未将结果自动写入 CRM。`, warnings: errors });
    }
    return env.ASSETS.fetch(request);
  },
};
