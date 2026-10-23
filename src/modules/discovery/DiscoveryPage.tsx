import { Add, Play, Reset, Search, SettingsAdjust } from '@carbon/icons-react';
import {
  Button, Checkbox, Column, Grid, InlineNotification, NumberInput, Select, SelectItem,
  Stack, Tag, TextArea, TextInput, Tile
} from '@carbon/react';
import { useMemo, useState } from 'react';
import type { DiscoveryChannel } from '../../App';

type ProductType = 'mixed' | 'sorted' | 'both';
type Props = { channel: DiscoveryChannel; description: string };

const markets = [
  { value: '英国', label: '英国' }, { value: '波兰', label: '波兰' }, { value: '加纳', label: '加纳' },
  { value: '肯尼亚', label: '肯尼亚' }, { value: '巴基斯坦', label: '巴基斯坦' },
  { value: '阿联酋', label: '阿联酋' }, { value: '德国', label: '德国' }, { value: '荷兰', label: '荷兰' },
  { value: '美国', label: '美国' }, { value: '南非', label: '南非' }, { value: '中国大陆', label: '中国大陆' },
  { value: '中国香港', label: '中国香港' }, { value: '中国台湾', label: '中国台湾' }, { value: '中国澳门', label: '中国澳门' },
];

const channelTitles: Record<DiscoveryChannel, string> = {
  search: '搜索引擎发现',
  directories: '企业黄页发现',
  customs: '海关数据线索',
  social: '社交媒体线索',
  import: '导入潜客名单',
  providers: '搜索服务设置',
};

export function DiscoveryPage({ channel, description }: Props) {
  const [keywords, setKeywords] = useState('二手服装 进口商');
  const [productType, setProductType] = useState<ProductType>('mixed');
  const [country, setCountry] = useState('英国');
  const [language, setLanguage] = useState('不限');
  const [purchaseSignals, setPurchaseSignals] = useState(true);
  const [excludeRetailers, setExcludeRetailers] = useState(true);
  const [extractPageText, setExtractPageText] = useState(true);
  const [requiredTerms, setRequiredTerms] = useState<string[]>(['批发']);
  const [termInput, setTermInput] = useState('');
  const [excludedDomains, setExcludedDomains] = useState('');
  const [resultLimit, setResultLimit] = useState(50);
  const [budget, setBudget] = useState(5);
  const [timeRange, setTimeRange] = useState('不限时间');
  const [previewReady, setPreviewReady] = useState(false);

  const query = useMemo(() => {
    const parts = [keywords.trim() ? `"${keywords.trim()}"` : ''];
    if (productType === 'mixed' || productType === 'both') parts.push('("混装旧衣" OR "未分拣旧衣")');
    if (productType === 'sorted' || productType === 'both') parts.push('("分拣旧衣" OR "分级二手服装")');
    if (country) parts.push(`"${country}"`);
    if (language !== '不限') parts.push(`language:${({ 英语: 'en', 阿拉伯语: 'ar', 法语: 'fr', 德语: 'de', 波兰语: 'pl', 西班牙语: 'es', 中文: 'zh' } as Record<string, string>)[language] ?? language}`);
    if (timeRange !== '不限时间') parts.push(`时间范围：${timeRange}`);
    if (purchaseSignals) parts.push('("采购" OR "进口" OR "批发" OR "采购需求")');
    if (excludeRetailers) parts.push('-零售 -时尚品牌');
    requiredTerms.forEach((term) => parts.push(`"${term}"`));
    if (excludedDomains.trim()) parts.push(`-site:${excludedDomains.trim().split(/[ ,\\n]+/).filter(Boolean).join(' -site:')}`);
    return parts.filter(Boolean).join(' AND ');
  }, [keywords, productType, country, language, timeRange, purchaseSignals, excludeRetailers, requiredTerms, excludedDomains]);

  const reset = () => {
    setKeywords('二手服装 进口商'); setProductType('mixed'); setCountry('英国');
    setLanguage('不限'); setPurchaseSignals(true); setExcludeRetailers(true); setExtractPageText(true);
    setRequiredTerms(['批发']); setTermInput(''); setExcludedDomains(''); setResultLimit(50);
    setBudget(5); setTimeRange('不限时间'); setPreviewReady(false);
  };
  const addTerm = () => {
    const term = termInput.trim();
    if (term && !requiredTerms.includes(term)) setRequiredTerms((current) => [...current, term]);
    setTermInput('');
  };

  return (
    <section className="discovery-page" aria-labelledby="discovery-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">URANUS CORTEX / 潜客发现</p>
          <h1 id="discovery-title">{channelTitles[channel]}</h1>
          <p className="page-description">{description} 从可解释的条件开始，先检查查询和预算，再决定是否执行。搜索线索不等于已验证的采购事实。</p>
        </div>
        <Tag type="cool-gray">前端原型</Tag>
      </div>

      <InlineNotification kind="info" lowContrast title="原型环境" subtitle="当前页面使用本地模拟状态，不会调用真实搜索服务、抓取网站、保存数据或创建 CRM 记录。" hideCloseButton />

      {channel !== 'search' && (
        <InlineNotification kind="warning" lowContrast title="该渠道尚未接入" subtitle="此渠道目前仅提供需求入口与界面框架。真实数据源、API 许可、成本与安全方案须经评审后再接入。" hideCloseButton />
      )}

      <Grid className="discovery-layout">
        <Column sm={4} md={8} lg={7}>
          <Tile className="builder-tile">
            <Stack gap={5}>
              <div className="section-heading section-heading--compact">
                <div><p className="eyebrow">步骤 1</p><h2>定义目标买家</h2><p className="section-caption">先描述产品、市场和可能的采购行为。</p></div>
                <Tag type="blue">条件构建器</Tag>
              </div>
              <TextInput id="search-keywords" labelText="核心关键词" value={keywords} onChange={(event) => setKeywords(event.currentTarget.value)} helperText="输入企业类型、产品或采购意向关键词。" placeholder="例如：二手服装进口商" />
              <Select id="product-type" labelText="产品类别" value={productType} onChange={(event) => setProductType(event.currentTarget.value as ProductType)}>
                <SelectItem value="mixed" text="混装 / 未分拣旧衣" />
                <SelectItem value="sorted" text="分拣 / 分级二手服装" />
                <SelectItem value="both" text="两类产品都包含" />
              </Select>
              <Select id="target-country" labelText="目标国家 / 地区" value={country} onChange={(event) => setCountry(event.currentTarget.value)}>
                {markets.map((market) => <SelectItem key={market.value} value={market.value} text={market.label} />)}
              </Select>
              <Select id="search-language" labelText="搜索语言" value={language} onChange={(event) => setLanguage(event.currentTarget.value)}>
                {['不限', '英语', '阿拉伯语', '法语', '德语', '波兰语', '西班牙语', '中文'].map((value) => <SelectItem key={value} value={value} text={value} />)}
              </Select>
              <div className="filter-options">
                <Checkbox id="purchase-signals" labelText="优先匹配明确采购信号" checked={purchaseSignals} onChange={(_, data) => setPurchaseSignals(data.checked)} />
                <Checkbox id="exclude-retailers" labelText="排除纯零售 / 时尚品牌结果" checked={excludeRetailers} onChange={(_, data) => setExcludeRetailers(data.checked)} />
                <Checkbox id="extract-page-text" labelText="将网页正文提取纳入计划" checked={extractPageText} onChange={(_, data) => setExtractPageText(data.checked)} />
              </div>
              <div className="extra-terms">
                <TextInput id="extra-term" labelText="必须包含的词组" value={termInput} onChange={(event) => setTermInput(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addTerm(); } }} placeholder="例如：进口资质" />
                <Button kind="secondary" renderIcon={Add} onClick={addTerm} disabled={!termInput.trim()}>添加词组</Button>
                {requiredTerms.length > 0 && <div className="term-tags" aria-label="必须包含的词组">{requiredTerms.map((term) => <Tag key={term} type="cool-gray" filter onClose={() => setRequiredTerms((current) => current.filter((item) => item !== term))}>{term}</Tag>)}</div>}
              </div>
              <TextArea id="excluded-domains" labelText="排除域名（可选）" value={excludedDomains} onChange={(event) => setExcludedDomains(event.currentTarget.value)} placeholder="example.com, directory.example" rows={2} helperText="多个域名请用逗号或空格分隔；实际支持情况取决于服务商。" />
              <Grid>
                <Column sm={4} md={4} lg={8}>
                  <NumberInput id="result-limit" label="结果数量上限" min={1} max={500} value={resultLimit} onChange={(_, data) => setResultLimit(Number(data.value) || 1)} />
                </Column>
                <Column sm={4} md={4} lg={8}>
                  <NumberInput id="budget-limit" label="预计预算上限（美元）" min={0} max={1000} step={1} value={budget} onChange={(_, data) => setBudget(Number(data.value) || 0)} />
                </Column>
              </Grid>
              <Select id="time-range" labelText="网页发布时间" value={timeRange} onChange={(event) => setTimeRange(event.currentTarget.value)}>
                {['不限时间', '最近一周', '最近一个月', '最近三个月', '最近一年'].map((value) => <SelectItem key={value} value={value} text={value} />)}
              </Select>
              <div className="builder-actions">
                <Button renderIcon={Search} onClick={() => setPreviewReady(true)}>预览搜索方案</Button>
                <Button kind="ghost" renderIcon={Reset} onClick={reset}>重置条件</Button>
              </div>
            </Stack>
          </Tile>
        </Column>
        <Column sm={4} md={8} lg={5}>
          <Stack gap={4}>
            <Tile className="query-preview">
              <p className="eyebrow">步骤 2</p>
              <h2>检查查询表达式</h2>
              <pre>{query || '添加关键词或条件后，将在此生成查询表达式。'}</pre>
              <div className="term-tags">
                <Tag type="blue">市场：{country || '未设置'}</Tag>
                <Tag type="cool-gray">语言：{language}</Tag>
                <Tag type="cool-gray">时间：{timeRange}</Tag>
              </div>
              <p className="section-caption">这是统一查询预览，不代表每个服务商都支持所有语法或过滤条件。</p>
            </Tile>
            <Tile className="search-hint">
              <p className="eyebrow">步骤 3</p>
              <h2>预算与执行边界</h2>
              <dl className="plan-summary">
                <div><dt>结果数量上限</dt><dd>{resultLimit}</dd></div>
                <div><dt>预算上限</dt><dd>${budget.toFixed(2)} 美元</dd></div>
                <div><dt>网页正文提取</dt><dd>{extractPageText ? '纳入计划' : '仅使用搜索摘要'}</dd></div>
                <div><dt>自动切换付费备用服务</dt><dd>已禁用</dd></div>
              </dl>
              <InlineNotification kind="warning" lowContrast title="避免意外费用" subtitle="付费服务必须先明确预算上限与回退策略，达到预算后停止新增付费调用。" hideCloseButton />
              <Button kind="secondary" renderIcon={SettingsAdjust} onClick={() => setPreviewReady(true)}>查看执行计划</Button>
            </Tile>
          </Stack>
        </Column>
      </Grid>

      {previewReady && (
        <section className="mock-results" aria-labelledby="search-plan-title">
          <div className="section-heading">
            <div><p className="eyebrow">执行前审核</p><h2 id="search-plan-title">本次任务摘要</h2></div>
            <Tag type="cool-gray">尚未执行</Tag>
          </div>
          <InlineNotification kind="warning" lowContrast title="尚未连接服务商" subtitle="当前没有已配置并通过连接测试的服务商。以下计划仅供预览，不会发出 API 请求或产生费用。" hideCloseButton />
          <Tile className="result-tile">
            <Stack gap={4}>
              <div className="plan-summary">
                <div><dt>查询表达式</dt><dd>{query || '尚未设置查询条件'}</dd></div>
                <div><dt>结果数量上限</dt><dd>{resultLimit} 条</dd></div>
                <div><dt>预算保护</dt><dd>${budget.toFixed(2)} 美元</dd></div>
                <div><dt>时间范围</dt><dd>{timeRange}</dd></div>
              </div>
              <Button renderIcon={Play} disabled onClick={() => undefined}>开始搜索（需先连接服务商）</Button>
              <p className="section-caption">完成安全的服务端适配器与凭据配置前，搜索执行保持禁用。</p>
            </Stack>
          </Tile>
        </section>
      )}
    </section>
  );
}
