import { useMemo, useState } from 'react';
import {
  ArrowUpRight, Checkmark, Close, Cloud, Document, Globe, Launch, Renew, Search, WarningAlt, WatsonHealthAiResults,
} from '@carbon/icons-react';
import {
  Button, Checkbox, InlineNotification, NumberInput, Select, SelectItem, Tab, TabList,
  TabPanel, TabPanels, Tabs, Tag, TextInput, Tile, Toggle, Tooltip,
} from '@carbon/react';
import './search-discovery.css';

type Provider = { id: string; name: string; kind: string; description: string; env: string; costEnv: string; configured: boolean; enabled: boolean; status: string };
type Result = { title: string; url: string; domain: string; snippet: string; source: string; country: string; score: number; state: string };
const initialProviders: Provider[] = [
  { id: 'tavily', name: 'Tavily', kind: 'AI search', description: '面向研究工作流的网页搜索与摘要', env: 'TAVILY_API_KEY', costEnv: 'TAVILY_COST_PER_CALL_USD', configured: false, enabled: true, status: '待配置' },
  { id: 'brave', name: 'Brave Search API', kind: 'Web / SERP', description: '独立网页索引与搜索结果', env: 'BRAVE_SEARCH_API_KEY', costEnv: 'BRAVE_COST_PER_CALL_USD', configured: false, enabled: true, status: '待配置' },
  { id: 'serper', name: 'Serper.dev', kind: 'SERP API', description: 'Google 搜索结果 API 适配器', env: 'SERPER_API_KEY', costEnv: 'SERPER_COST_PER_CALL_USD', configured: false, enabled: false, status: '待配置' },
  { id: 'exa', name: 'Exa', kind: 'Semantic search', description: '语义检索与网页发现', env: 'EXA_API_KEY', costEnv: 'EXA_COST_PER_CALL_USD', configured: false, enabled: false, status: '待配置' },
];
const countries = [
  ['US','美国','🇺🇸'],['GB','英国','🇬🇧'],['DE','德国','🇩🇪'],['FR','法国','🇫🇷'],['NL','荷兰','🇳🇱'],
  ['IT','意大利','🇮🇹'],['ES','西班牙','🇪🇸'],['PL','波兰','🇵🇱'],['JP','日本','🇯🇵'],['KR','韩国','🇰🇷'],
  ['AU','澳大利亚','🇦🇺'],['CA','加拿大','🇨🇦'],['HK','中国香港','🇭🇰'],['TW','中国台湾','🇹🇼'],['MO','中国澳门','🇲🇴'],['CN-MAINLAND','中国大陆','🇨🇳'],
];
const providersToRun = (providers: Provider[]) => providers.filter(p => p.enabled && p.status === '连接成功');

export default function SearchDiscoveryPage() {
  const [tab, setTab] = useState(0);
  const [providers, setProviders] = useState(initialProviders);
  const [keywords, setKeywords] = useState('("used clothing" OR "second hand clothes" OR "wiping rags") (importer OR wholesaler OR distributor OR buyer)');
  const [product, setProduct] = useState('混装 / 未分拣二手服装');
  const [buyerType, setBuyerType] = useState('进口商、批发商、分销商');
  const [selectedCountries, setSelectedCountries] = useState(['US','GB','DE','FR','NL']);
  const [language, setLanguage] = useState('en');
  const [limit, setLimit] = useState(50);
  const [budget, setBudget] = useState(10);
  const [maxPages, setMaxPages] = useState(100);
  const [exclude, setExclude] = useState('job, careers, consumer marketplace, retail shop');
  const [includeDomains, setIncludeDomains] = useState('');
  const [timeRange, setTimeRange] = useState('any');
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState<Result[]>([]);
  const [message, setMessage] = useState('');
  const [queryMode, setQueryMode] = useState(false);
  const [rawQuery, setRawQuery] = useState('');
  const [showEvidence, setShowEvidence] = useState(true);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [searchName, setSearchName] = useState('二手服装进口商 - 英语市场');
  const [showSave, setShowSave] = useState(false);
  const [filterStatus, setFilterStatus] = useState('全部状态');
  const [settingsStatus, setSettingsStatus] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const readyProviders = useMemo(() => providersToRun(providers), [providers]);


  const selectedCountryNames = countries.filter(c => selectedCountries.includes(c[0])).map(c => c[1]);
  const normalizedQuery = queryMode ? rawQuery : [keywords, product, buyerType, selectedCountryNames.join(' '), language !== 'any' ? 'lang:' + language : '', exclude ? '-(' + exclude + ')' : '', includeDomains ? 'site:' + includeDomains : ''].filter(Boolean).join(' ');
  const eligibleResults = results.filter(r => filterStatus === '全部状态' || r.state === filterStatus);

  const toggleCountry = (id: string) => setSelectedCountries(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const toggleProvider = (id: string, enabled: boolean) => setProviders(prev => prev.map(p => p.id === id ? { ...p, enabled } : p));
  const saveSearch = () => {
    const name = searchName.trim();
    if (!name) return;
    setSavedSearches(prev => [name, ...prev.filter(n => n !== name)]);
    setShowSave(false);
    setMessage('搜索方案已保存到当前会话。连接持久化存储后可跨设备复用。');
  };
  async function runSearch() {
    if (!keywords.trim() && !rawQuery.trim()) { setMessage('请先填写关键词或搜索表达式。'); return; }
    if (!selectedCountries.length) { setMessage('请至少选择一个目标国家或地区。'); return; }
    if (!readyProviders.length) { setTab(1); setMessage('当前没有已配置且启用的搜索服务。请先在“服务商设置”中配置后端密钥并完成连接测试。'); return; }
    setStatus('running'); setMessage('正在提交搜索任务…');
    try {
      const response = await fetch('/api/discovery/search', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: 'Bearer ' + accessToken }, body: JSON.stringify({
        query: normalizedQuery, keywords, product, buyerType, countries: selectedCountries, language, limit, budget,
        maxPages, exclude, includeDomains, timeRange, providers: readyProviders.map(p => p.id), captureEvidence: showEvidence,
      }) });
      const data = await response.json() as { results?: Result[]; message?: string; taskId?: string; estimatedCostUsd?: number };
      if (!response.ok) throw new Error(data.message || '搜索服务请求失败。');
      setResults(prev => [...(data.results ?? []), ...prev]);
      setEstimatedCost(data.estimatedCostUsd ?? null);
      setStatus('completed'); setMessage(data.message || `搜索任务 ${data.taskId ?? ''} 已提交。`);
    } catch (error) {
      setStatus('failed');
      setMessage(error instanceof Error ? error.message : '无法连接搜索服务。请确认 Worker API 和服务商密钥已配置。');
    }
  }
  async function testProvider(provider: Provider) {
    setSettingsStatus(`正在检查 ${provider.name}…`);
    try {
      const response = await fetch('/api/discovery/providers/' + provider.id + '/test', { method: 'POST', headers: { Authorization: 'Bearer ' + accessToken } });
      const data = await response.json() as { configured?: boolean; ok?: boolean; message?: string };
      setProviders(prev => prev.map(p => p.id === provider.id ? { ...p, configured: Boolean(data.configured), status: data.ok ? '连接成功' : data.configured ? '连接失败' : '未配置' } : p));
      setSettingsStatus(data.message || (data.ok ? `${provider.name} 连接成功` : `${provider.name} 尚不可用`));
    } catch {
      setSettingsStatus('无法连接后端服务。当前部署尚未提供服务商 API 接口，不能把演示状态当作真实连接。');
    }
  }
  function updateResultState(result: Result, state: string) {
    setResults(prev => prev.map(r => r.url === result.url ? { ...r, state } : r));
    setSelectedResult({ ...result, state });
  }

  return <div className="sd-page">
    <div className="sd-heading">
      <div><div className="sd-eyebrow">潜客发现 / 搜索引擎</div><h1>搜索与采购商发现</h1><p>从公开网页发现海外企业，核实采购证据，再将合格潜客交给 CRM 审核。</p></div>
      <div className="sd-heading-actions"><Tag type="cool-gray">证据优先</Tag><Button kind="secondary" renderIcon={Document} onClick={() => setShowSave(v => !v)}>保存搜索方案</Button><Button renderIcon={Search} onClick={() => void runSearch()} disabled={status === 'running'}>{status === 'running' ? '任务提交中…' : '开始搜索'}</Button></div>
    </div>
    {message && <InlineNotification lowContrast kind={status === 'failed' ? 'error' : status === 'completed' ? 'success' : 'info'} title={status === 'failed' ? '搜索未完成' : status === 'completed' ? '任务状态' : '提示'} subtitle={message} onCloseButtonClick={() => setMessage('')} />}
    {showSave && <Tile className="sd-save-panel"><TextInput id="sd-search-name" labelText="方案名称" value={searchName} onChange={e => setSearchName(e.target.value)} /><Button size="sm" onClick={saveSearch}>保存方案</Button><Button kind="ghost" size="sm" onClick={() => setShowSave(false)}>取消</Button></Tile>}
    <div className="sd-stat-grid">
      <Tile><span className="sd-stat-label">发现网页</span><strong>{results.length}</strong><small>仅计入本次页面会话</small></Tile>
      <Tile><span className="sd-stat-label">待审核企业</span><strong>{results.filter(r => r.state === '待审核').length}</strong><small>需验证企业身份与采购信号</small></Tile>
      <Tile><span className="sd-stat-label">已确认潜客</span><strong>{results.filter(r => r.state === '已确认').length}</strong><small>人工确认后再进入 CRM</small></Tile>
      <Tile><span className="sd-stat-label">本次估算成本</span><strong>{estimatedCost === null ? '—' : '$' + estimatedCost.toFixed(4)}</strong><small>本次搜索估算调用成本，不是供应商最终账单</small></Tile>
    </div>
    <Tabs selectedIndex={tab} onChange={({ selectedIndex }) => setTab(selectedIndex)}>
      <TabList aria-label="潜客发现模块导航" contained>
        <Tab>搜索构建器</Tab><Tab>服务商设置</Tab><Tab>网页结果与审核</Tab><Tab>成本与规则</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <div className="sd-workspace-grid">
            <section className="sd-panel">
              <div className="sd-panel-heading"><div><h2>搜索条件</h2><p>结构化条件会转换为统一查询表达式。</p></div><Toggle id="sd-raw-toggle" labelText="直接编辑表达式" labelA="关闭" labelB="开启" toggled={queryMode} onToggle={setQueryMode} /></div>
              {queryMode ? <TextInput id="sd-raw-query" labelText="原始查询表达式" helperText="无法解析的表达式会保留；供应商不支持的语法需要在执行前检查。" value={rawQuery} onChange={e => setRawQuery(e.target.value)} /> : <>
                <TextInput id="sd-keywords" labelText="关键词 / 搜索表达式" helperText="支持短语、AND / OR / NOT 逻辑组；不同供应商语法能力可能不同。" value={keywords} onChange={e => setKeywords(e.target.value)} />
                <div className="sd-form-row"><TextInput id="sd-product" labelText="产品范围" value={product} onChange={e => setProduct(e.target.value)} /><TextInput id="sd-buyer-type" labelText="目标企业类型" value={buyerType} onChange={e => setBuyerType(e.target.value)} /></div>
                <TextInput id="sd-exclude" labelText="排除词" helperText="降低招聘、零售和消费者页面噪声。" value={exclude} onChange={e => setExclude(e.target.value)} />
                <TextInput id="sd-domains" labelText="限定域名（可选）" placeholder="例如 kompass.com, europages.com" value={includeDomains} onChange={e => setIncludeDomains(e.target.value)} />
                <div className="sd-form-row"><div><label className="cds--label" htmlFor="sd-language">搜索语言</label><Select id="sd-language" labelText="" value={language} onChange={e => setLanguage(e.target.value)}><SelectItem value="en" text="英语" /><SelectItem value="de" text="德语" /><SelectItem value="fr" text="法语" /><SelectItem value="es" text="西班牙语" /><SelectItem value="it" text="意大利语" /><SelectItem value="any" text="不限" /></Select></div><div><label className="cds--label" htmlFor="sd-time">发布时间</label><Select id="sd-time" labelText="" value={timeRange} onChange={e => setTimeRange(e.target.value)}><SelectItem value="any" text="不限时间" /><SelectItem value="7d" text="最近 7 天" /><SelectItem value="30d" text="最近 30 天" /><SelectItem value="365d" text="最近一年" /></Select></div></div>
              </>}
              <div className="sd-section-subhead"><h3>目标国家 / 地区</h3><span>{selectedCountries.length} 个已选</span></div>
              <div className="sd-country-grid">{countries.map(([id,name,flag]) => <label key={id} className={`sd-country ${selectedCountries.includes(id) ? 'is-selected' : ''}`}><Checkbox id={'country-' + id} labelText="" checked={selectedCountries.includes(id)} onChange={() => toggleCountry(id)} /><span className="sd-flag" aria-hidden="true">{flag}</span><span>{name}</span></label>)}</div>
              <div className="sd-section-subhead"><h3>结果限制与预算</h3><span>预算显示为用户设定值；实际强制停止需完成成本计量后启用</span></div>
              <div className="sd-form-row sd-limit-row"><NumberInput id="sd-limit" label="最多结果数" min={1} max={500} value={limit} onChange={(_, state) => setLimit(Number(state.value))} /><NumberInput id="sd-budget" label="任务预算上限（美元）" min={0} max={1000} step={1} value={budget} onChange={(_, state) => setBudget(Number(state.value))} /><NumberInput id="sd-pages" label="最大抓取页数" min={1} max={5000} value={maxPages} onChange={(_, state) => setMaxPages(Number(state.value))} /></div>
              <Checkbox id="sd-evidence" labelText="为关键字段保存来源 URL、引用片段、抓取时间与可信状态" checked={showEvidence} onChange={(_, data) => setShowEvidence(data.checked)} />
              <div className="sd-query-preview"><div><span>统一查询预览</span><Tooltip label="执行时将根据供应商能力转换表达式。"><WarningAlt size={16} /></Tooltip></div><code>{normalizedQuery}</code><Button kind="ghost" size="sm" renderIcon={ArrowUpRight} onClick={() => { setRawQuery(normalizedQuery); setQueryMode(true); }}>转为原始表达式</Button></div>
              {savedSearches.length > 0 && <div className="sd-saved-list"><strong>已保存方案</strong>{savedSearches.map(s => <Tag key={s} type="blue">{s}</Tag>)}</div>}
            </section>
            <aside className="sd-side-stack">
              <Tile className="sd-info-tile"><div className="sd-panel-heading"><Globe size={20}/><h2>执行前检查</h2></div><div className="sd-check-row"><span>已启用且连接成功的服务商</span><strong>{readyProviders.length}</strong></div><div className="sd-check-row"><span>目标地区</span><strong>{selectedCountries.length}</strong></div><div className="sd-check-row"><span>结果上限</span><strong>{limit}</strong></div><div className="sd-check-row"><span>预算上限</span><strong>${budget}</strong></div>{readyProviders.length === 0 && <InlineNotification kind="warning" lowContrast hideCloseButton title="暂无可用服务" subtitle="先配置 API 密钥并从服务商设置页测试连接。" />}</Tile>
              <Tile className="sd-info-tile"><div className="sd-panel-heading"><WatsonHealthAiResults size={20}/><h2>发现策略</h2></div><ul className="sd-policy-list"><li>采购意向与行业相关性分开评分。</li><li>AI 推断不会标记为已核实事实。</li><li>每个重要判断都应能追溯到来源证据。</li><li>未人工审核的企业不会自动成为 CRM 客户。</li></ul></Tile>
              <Tile className="sd-info-tile"><div className="sd-panel-heading"><Cloud size={20}/><h2>搜索执行状态</h2></div><div className="sd-status-line"><span className={`sd-status-dot ${status === 'completed' ? 'is-good' : status === 'running' ? 'is-running' : status === 'failed' ? 'is-error' : ''}`}/>{status === 'running' ? '正在提交任务' : status === 'completed' ? '任务已提交' : status === 'failed' ? '任务失败' : '尚未执行'}</div><Button kind="tertiary" size="sm" renderIcon={Renew} onClick={() => { setStatus('idle'); setMessage('已重置页面任务状态；不会删除已保存的后端数据。'); }}>重置状态</Button></Tile>
            </aside>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="sd-panel sd-provider-panel"><div className="sd-panel-heading"><div><h2>搜索服务商</h2><p>供应商 API Key 仅存于 Worker Secret；页面只输入临时访问令牌，且仅保留在当前页面内存。</p></div><Tag type="cool-gray">适配器架构</Tag></div>
            <div className="sd-access-token"><TextInput id="sd-access-token" type="password" labelText="潜客发现 API 访问令牌" helperText="输入 Cloudflare Worker Secret DISCOVERY_API_TOKEN 的值。令牌只保存在当前页面内存，不写入 localStorage。" value={accessToken} onChange={e => setAccessToken(e.target.value)} /><Button kind="secondary" size="sm" onClick={() => { setProviders(prev => prev.map(p => ({ ...p, status: '待配置', configured: false }))); setSettingsStatus('已清除本页面服务商状态；令牌仅保留在当前页面内存。'); }}>重置连接状态</Button></div>
            <InlineNotification kind="warning" lowContrast title="需要部署端配置密钥" subtitle="在 Cloudflare Worker 中设置相应环境变量后，使用连接测试验证。前端不会显示或保存完整密钥。" />
            <div className="sd-provider-list">{providers.map(provider => <article className="sd-provider-row" key={provider.id}><div className="sd-provider-icon"><Globe size={21}/></div><div className="sd-provider-main"><div className="sd-provider-title"><strong>{provider.name}</strong><Tag type={provider.configured ? 'green' : 'cool-gray'}>{provider.status}</Tag><Tag type="blue">{provider.kind}</Tag></div><p>{provider.description}</p><code>{provider.env}</code><div className="sd-provider-cost">成本估算变量：<code>{provider.costEnv}</code></div></div><div className="sd-provider-actions"><Toggle id={'provider-' + provider.id} labelText="启用" labelA="关闭" labelB="开启" toggled={provider.enabled} onToggle={v => toggleProvider(provider.id, v)} /><Button kind="tertiary" size="sm" onClick={() => void testProvider(provider)}>测试连接（API 调用可能计费）</Button></div></article>)}</div>
            {settingsStatus && <InlineNotification kind="info" lowContrast title="连接测试结果" subtitle={settingsStatus} onCloseButtonClick={() => setSettingsStatus('')} />}
            <div className="sd-provider-note"><WarningAlt size={18}/><div><strong>供应商能力必须透明</strong><p>当前接口完成基础网页搜索与 URL 去重；国家、语言、时间、域名、精确词组、排除词等供应商级能力尚未全部适配。完成能力矩阵和逐项测试前，不应假设这些筛选均在搜索引擎侧生效。</p></div></div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="sd-panel"><div className="sd-panel-heading"><div><h2>网页结果与人工审核</h2><p>搜索结果只是候选线索，不等同于已验证企业或真实采购需求。</p></div><div className="sd-inline-actions"><Select id="sd-result-filter" labelText="" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><SelectItem value="全部状态" text="全部状态" /><SelectItem value="待审核" text="待审核" /><SelectItem value="已确认" text="已确认" /><SelectItem value="已排除" text="已排除" /></Select><Button kind="tertiary" renderIcon={Renew} onClick={() => setMessage('刷新需要已部署的任务查询 API。')}>刷新任务</Button></div></div>
            {eligibleResults.length === 0 ? <div className="sd-empty"><Search size={30}/><strong>暂无网页结果</strong><p>运行搜索任务后，网页会按批次出现在这里。演示数据不会冒充真实搜索结果。</p><Button kind="secondary" onClick={() => setTab(0)}>配置搜索条件</Button></div> : <div className="sd-results-layout"><div className="sd-results-list">{eligibleResults.map(result => <button key={result.url} className={`sd-result-card ${selectedResult?.url === result.url ? 'is-active' : ''}`} onClick={() => setSelectedResult(result)}><div className="sd-result-top"><span>{result.domain}</span><Tag type={result.state === '已确认' ? 'green' : result.state === '已排除' ? 'red' : 'warm-gray'}>{result.state}</Tag></div><strong>{result.title}</strong><p>{result.snippet}</p><div className="sd-result-foot"><span>{result.country} · {result.source}</span><span>匹配度 {result.score}</span></div></button>)}</div>{selectedResult && <aside className="sd-evidence-panel"><div className="sd-panel-heading"><h3>审核与证据</h3><Button kind="ghost" size="sm" hasIconOnly renderIcon={Close} iconDescription="关闭详情" onClick={() => setSelectedResult(null)} /></div><h4>{selectedResult.title}</h4><a href={selectedResult.url} target="_blank" rel="noreferrer">{selectedResult.url} <Launch size={12}/></a><p>{selectedResult.snippet}</p><div className="sd-evidence-item"><span>来源状态</span><strong>示例/待后端证据验证</strong></div><div className="sd-evidence-item"><span>业务匹配度</span><strong>{selectedResult.score}/100（待证据校准）</strong></div><div className="sd-evidence-item"><span>采购意向</span><strong>未知，不能仅凭行业判断</strong></div><div className="sd-review-actions"><Button size="sm" renderIcon={Checkmark} onClick={() => updateResultState(selectedResult, '已确认')}>确认潜客</Button><Button size="sm" kind="secondary" onClick={() => updateResultState(selectedResult, '已排除')}>排除</Button></div><Button kind="tertiary" size="sm" onClick={() => setMessage('入库需要 CRM 后端 API、权限检查和证据校验，当前不会写入正式客户。')}>提交至 CRM 审核</Button></aside>}</div>}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="sd-workspace-grid"><section className="sd-panel"><div className="sd-panel-heading"><div><h2>预算与停止规则</h2><p>未接入官方计价和用量账单前，不会虚报实际成本；生产付费任务需要服务端成本闸门。</p></div></div><div className="sd-rule-row"><div><strong>单任务预算上限</strong><p>触达上限后停止新的付费调用。</p></div><strong>${budget}</strong></div><div className="sd-rule-row"><div><strong>搜索结果数量</strong><p>限制单个任务保留的候选网页数。</p></div><strong>{limit}</strong></div><div className="sd-rule-row"><div><strong>最大抓取页数</strong><p>防止网页提取阶段无限扩张。</p></div><strong>{maxPages}</strong></div><div className="sd-rule-row"><div><strong>连续无新增时停止</strong><p>建议默认三批无新增合格企业后停止，可按任务调整。</p></div><Tag type="blue">建议值</Tag></div><div className="sd-rule-row"><div><strong>重试与错误率阈值</strong><p>需要在 Worker 队列 / 任务执行层实现。</p></div><Tag type="cool-gray">待接入后端</Tag></div></section><aside className="sd-side-stack"><Tile><h3>成本计量</h3><p className="sd-muted">供应商实际账单需以官方账单为准。当前界面不会虚构调用量、免费额度或费用。</p><div className="sd-rule-row"><span>搜索调用</span><strong>—</strong></div><div className="sd-rule-row"><span>网页抓取</span><strong>—</strong></div><div className="sd-rule-row"><span>AI 分析</span><strong>—</strong></div><div className="sd-rule-row"><span>缓存命中率</span><strong>—</strong></div></Tile><Tile><h3>保留与审计</h3><p className="sd-muted">正式实现需要记录任务、供应商、输入条件版本、成本快照、证据版本、审核操作和禁止联系记录。</p></Tile></aside></div>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <footer className="sd-footer"><span>URANUS CORTEX · SEARCH & BUYER DISCOVERY</span><span>遵循来源证据、成本上限与人工审核原则</span></footer>
  </div>;
}
