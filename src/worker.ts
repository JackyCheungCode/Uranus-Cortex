interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  TAVILY_API_KEY?: string;
  BRAVE_SEARCH_API_KEY?: string;
  SERPER_API_KEY?: string;
  EXA_API_KEY?: string;
  DATAFORSEO_LOGIN?: string;
  DATAFORSEO_PASSWORD?: string;
  DISCOVERY_API_TOKEN?: string;
  TAVILY_COST_PER_CALL_USD?: string;
  BRAVE_COST_PER_CALL_USD?: string;
  SERPER_COST_PER_CALL_USD?: string;
  EXA_COST_PER_CALL_USD?: string;
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
const providerCostEnv: Record<ProviderId, keyof Env> = { tavily: 'TAVILY_COST_PER_CALL_USD', brave: 'BRAVE_COST_PER_CALL_USD', serper: 'SERPER_COST_PER_CALL_USD', exa: 'EXA_COST_PER_CALL_USD' };
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
function isAuthorized(request: Request, env: Env) {
  const configured = env.DISCOVERY_API_TOKEN;
  if (!configured) return false;
  const supplied = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const encoder = new TextEncoder();
  const expectedBytes = encoder.encode(configured);
  const suppliedBytes = encoder.encode(supplied);
  if (expectedBytes.length !== suppliedBytes.length) return false;
  let difference = 0;
  for (let i = 0; i < expectedBytes.length; i++) difference |= expectedBytes[i] ^ suppliedBytes[i];
  return difference === 0;
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
    if (url.pathname.startsWith('/api/discovery/') && !isAuthorized(request, env)) {
      return json({ message: env.DISCOVERY_API_TOKEN ? '需要有效的潜客发现访问令牌。' : '潜客发现 API 尚未启用：请先配置 DISCOVERY_API_TOKEN，并在页面中输入相同令牌。' }, env.DISCOVERY_API_TOKEN ? 401 : 503);
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
      const budget = typeof body.budget === 'number' && Number.isFinite(body.budget) ? Math.max(0, body.budget) : 0;
      if (budget <= 0) return json({ message: '请设置大于 0 的任务预算上限。' }, 400);
      const missingRates = available.filter(id => { const raw = env[providerCostEnv[id]]; return raw === undefined || raw.trim() === '' || !Number.isFinite(Number(raw)) || Number(raw) < 0; });
      if (missingRates.length) return json({ message: '为防止意外费用，必须先配置所选服务商的每次请求成本估算：' + missingRates.map(id => providerCostEnv[id]).join(', ') + '。请以当前服务商计费规则核实数值；填 0 表示明确确认该调用免费。' }, 503);
      const estimatedCostUsd = available.reduce((sum, id) => sum + Number(env[providerCostEnv[id]]), 0);
      if (estimatedCostUsd > budget) return json({ message: `预算不足：预计本次搜索至少需要 ${estimatedCostUsd.toFixed(4)}，任务预算为 ${budget.toFixed(2)}。未发起任何供应商调用。` }, 402);
      const countries = Array.isArray(body.countries) ? body.countries : [];
      const country = countries.length === 1 ? String(countries[0]) : countries.length > 1 ? '多地区（未逐条核实）' : '未指定';
      const settled = await Promise.allSettled(available.map(async id => ({ id, items: await callProvider(env, id, query, Math.ceil(limit / available.length)) })));
      const results: SearchResult[] = [];
      const errors: string[] = [];
      for (const result of settled) {
        if (result.status === 'rejected') { errors.push(result.reason instanceof Error ? result.reason.message : '搜索服务调用失败'); continue; }
        results.push(...normalizeResults(result.value.items, providerName[result.value.id], country));
      }
      const unique = [...new Map(results.map(result => [result.url, result])).values()].slice(0, limit);
      if (!unique.length && errors.length) return json({ message: errors.join('；'), taskId: crypto.randomUUID(), results: [] }, 502);
      return json({ taskId: crypto.randomUUID(), results: unique, estimatedCostUsd, message: errors.length ? `已返回部分结果；估算调用成本 ${estimatedCostUsd.toFixed(4)}；部分服务失败：${errors.join('；')}` : `已完成 ${available.length} 个搜索服务的实时检索，返回 ${unique.length} 条去重网页结果。估算调用成本 ${estimatedCostUsd.toFixed(4)}；结果尚未持久化，也未自动写入 CRM。`, warnings: errors });
    }
    return env.ASSETS.fetch(request);
  },
};
