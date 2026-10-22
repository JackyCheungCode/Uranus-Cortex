import { Add, Play, Reset, Search, SettingsAdjust, TrashCan } from '@carbon/icons-react';
import {
  Button, Checkbox, Column, Grid, InlineNotification, NumberInput, Select, SelectItem,
  Stack, Tag, TextArea, TextInput, Tile
} from '@carbon/react';
import { useMemo, useState } from 'react';

type ProductType = 'mixed' | 'sorted' | 'both';
type SearchResult = { title: string; domain: string; country: string; status: string; evidence: string };
const markets = [
  'United Kingdom', 'Poland', 'Ghana', 'Kenya', 'Pakistan', 'United Arab Emirates',
  'Germany', 'Netherlands', 'United States', 'South Africa', 'China Mainland',
  'Hong Kong', 'Taiwan', 'Macao'
];
const sampleResults: SearchResult[] = [
  { title: 'Example wholesale clothing importer', domain: 'example-importer.invalid', country: 'United Kingdom', status: 'Discovered', evidence: 'Illustrative wholesale sourcing signal' },
  { title: 'Sample textile recovery business', domain: 'sample-recycler.invalid', country: 'Ghana', status: 'Needs review', evidence: 'Illustrative bulk textile intake signal' },
  { title: 'Demo second-hand distributor', domain: 'demo-distributor.invalid', country: 'Poland', status: 'Discovered', evidence: 'Illustrative used-clothing distribution signal' },
];

export function DiscoveryPage() {
  const [keywords, setKeywords] = useState('used clothing importer');
  const [productType, setProductType] = useState<ProductType>('mixed');
  const [country, setCountry] = useState('United Kingdom');
  const [language, setLanguage] = useState('Any');
  const [purchaseSignals, setPurchaseSignals] = useState(true);
  const [excludeRetailers, setExcludeRetailers] = useState(true);
  const [extractPageText, setExtractPageText] = useState(true);
  const [requiredTerms, setRequiredTerms] = useState<string[]>(['wholesale']);
  const [termInput, setTermInput] = useState('');
  const [excludedDomains, setExcludedDomains] = useState('');
  const [resultLimit, setResultLimit] = useState(50);
  const [budget, setBudget] = useState(5);
  const [timeRange, setTimeRange] = useState('Any time');
  const [previewReady, setPreviewReady] = useState(false);

  const query = useMemo(() => {
    const parts = [keywords.trim() ? `"${keywords.trim()}"` : ''];
    if (productType === 'mixed' || productType === 'both') parts.push('("mixed used clothing" OR "unsorted clothing bales")');
    if (productType === 'sorted' || productType === 'both') parts.push('("sorted used clothing" OR "graded second hand clothing")');
    if (country) parts.push(`"${country}"`);
    if (purchaseSignals) parts.push('("buying" OR "import" OR "wholesale" OR "supplier request")');
    if (excludeRetailers) parts.push('-retail -fashion');
    requiredTerms.forEach((term) => parts.push(`"${term}"`));
    if (excludedDomains.trim()) parts.push(`-site:${excludedDomains.trim().split(/[ ,\\n]+/).filter(Boolean).join(' -site:')}`);
    return parts.filter(Boolean).join(' AND ');
  }, [keywords, productType, country, purchaseSignals, excludeRetailers, requiredTerms, excludedDomains]);

  const reset = () => {
    setKeywords('used clothing importer'); setProductType('mixed'); setCountry('United Kingdom');
    setLanguage('Any'); setPurchaseSignals(true); setExcludeRetailers(true); setExtractPageText(true);
    setRequiredTerms(['wholesale']); setTermInput(''); setExcludedDomains(''); setResultLimit(50);
    setBudget(5); setTimeRange('Any time'); setPreviewReady(false);
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
          <p className="eyebrow">BUYER INTELLIGENCE / SEARCH-TO-LEAD</p>
          <h1 id="discovery-title">Buyer discovery</h1>
          <p className="page-description">Find potential second-hand clothing buyers through public web evidence. Search results are leads to review—not verified purchasing facts.</p>
        </div>
        <Tag type="cool-gray">Frontend prototype</Tag>
      </div>

      <InlineNotification kind="info" lowContrast title="Preview environment" subtitle="This page currently uses local demo state only. It does not call search providers, crawl websites, save data, or create CRM records." hideCloseButton />

      <Grid className="discovery-layout">
        <Column sm={4} md={8} lg={7}>
          <Tile className="builder-tile">
            <Stack gap={5}>
              <div className="section-heading section-heading--compact">
                <div><p className="eyebrow">01 / SEARCH CONDITIONS</p><h2>Build your search</h2></div>
                <Tag type="blue">Structured query</Tag>
              </div>
              <TextInput id="search-keywords" labelText="Core keywords" value={keywords} onChange={(event) => setKeywords(event.currentTarget.value)} helperText="Describe the company, product, or buyer intent." placeholder="e.g. used clothing importer" />
              <Select id="product-type" labelText="Product category" value={productType} onChange={(event) => setProductType(event.currentTarget.value as ProductType)}>
                <SelectItem value="mixed" text="Mixed / unsorted bales" />
                <SelectItem value="sorted" text="Sorted / graded used clothing" />
                <SelectItem value="both" text="Both product categories" />
              </Select>
              <Select id="target-country" labelText="Target country / region" value={country} onChange={(event) => setCountry(event.currentTarget.value)}>
                {markets.map((market) => <SelectItem key={market} value={market} text={market} />)}
              </Select>
              <Select id="search-language" labelText="Search language" value={language} onChange={(event) => setLanguage(event.currentTarget.value)}>
                {['Any', 'English', 'Arabic', 'French', 'German', 'Polish', 'Spanish', 'Chinese'].map((value) => <SelectItem key={value} value={value} text={value} />)}
              </Select>
              <div className="filter-options">
                <Checkbox id="purchase-signals" labelText="Prioritize explicit purchasing signals" checked={purchaseSignals} onChange={(_, data) => setPurchaseSignals(data.checked)} />
                <Checkbox id="exclude-retailers" labelText="Exclude retail / fashion-only results" checked={excludeRetailers} onChange={(_, data) => setExcludeRetailers(data.checked)} />
                <Checkbox id="extract-page-text" labelText="Include page-text extraction in plan" checked={extractPageText} onChange={(_, data) => setExtractPageText(data.checked)} />
              </div>
              <div className="extra-terms">
                <TextInput id="extra-term" labelText="Required phrase" value={termInput} onChange={(event) => setTermInput(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addTerm(); } }} placeholder="e.g. import license" />
                <Button kind="secondary" renderIcon={Add} onClick={addTerm} disabled={!termInput.trim()}>Add phrase</Button>
                {requiredTerms.length > 0 && <div className="term-tags" aria-label="Required phrases">{requiredTerms.map((term) => <Tag key={term} type="cool-gray" filter onClose={() => setRequiredTerms((current) => current.filter((item) => item !== term))}>{term}</Tag>)}</div>}
              </div>
              <TextArea id="excluded-domains" labelText="Exclude domains (optional)" value={excludedDomains} onChange={(event) => setExcludedDomains(event.currentTarget.value)} placeholder="example.com, directory.example" rows={2} helperText="Separate domains with commas or spaces. Provider support may vary." />
              <Grid>
                <Column sm={4} md={4} lg={8}>
                  <NumberInput id="result-limit" label="Maximum results" min={1} max={500} value={resultLimit} onChange={(_, data) => setResultLimit(Number(data.value) || 1)} />
                </Column>
                <Column sm={4} md={4} lg={8}>
                  <NumberInput id="budget-limit" label="Estimated budget cap (USD)" min={0} max={1000} step={1} value={budget} onChange={(_, data) => setBudget(Number(data.value) || 0)} />
                </Column>
              </Grid>
              <Select id="time-range" labelText="Page publication date" value={timeRange} onChange={(event) => setTimeRange(event.currentTarget.value)}>
                {['Any time', 'Past week', 'Past month', 'Past 3 months', 'Past year'].map((value) => <SelectItem key={value} value={value} text={value} />)}
              </Select>
              <div className="builder-actions">
                <Button renderIcon={Search} onClick={() => { setPreviewReady(true); }}>Preview search plan</Button>
                <Button kind="ghost" renderIcon={Reset} onClick={reset}>Reset</Button>
              </div>
            </Stack>
          </Tile>
        </Column>
        <Column sm={4} md={8} lg={5}>
          <Stack gap={4}>
            <Tile className="query-preview">
              <p className="eyebrow">02 / QUERY TRANSLATION</p>
              <h2>Generated query</h2>
              <pre>{query || 'Add a keyword or condition to generate a query.'}</pre>
              <div className="term-tags">
                <Tag type="blue">Market: {country || 'Not set'}</Tag>
                <Tag type="cool-gray">Language: {language}</Tag>
                <Tag type="cool-gray">Date: {timeRange}</Tag>
              </div>
              <p className="section-caption">This is a normalized preview, not a guarantee that every provider supports every operator.</p>
            </Tile>
            <Tile className="search-hint">
              <p className="eyebrow">03 / COST & QUALITY GUARDRAILS</p>
              <h2>Review before execution</h2>
              <dl className="plan-summary">
                <div><dt>Maximum results</dt><dd>{resultLimit}</dd></div>
                <div><dt>Budget ceiling</dt><dd>${budget.toFixed(2)} USD</dd></div>
                <div><dt>Page extraction</dt><dd>{extractPageText ? 'Included in plan' : 'Search snippets only'}</dd></div>
                <div><dt>Automatic paid fallback</dt><dd>Disabled</dd></div>
              </dl>
              <InlineNotification kind="warning" lowContrast title="No surprise paid fallback" subtitle="The product specification requires explicit budget controls before any paid provider can run." hideCloseButton />
              <Button kind="secondary" renderIcon={SettingsAdjust} onClick={() => setPreviewReady(true)}>Review execution plan</Button>
            </Tile>
          </Stack>
        </Column>
      </Grid>

      {previewReady && (
        <section className="mock-results" aria-labelledby="search-plan-title">
          <div className="section-heading">
            <div><p className="eyebrow">04 / EXECUTION REVIEW</p><h2 id="search-plan-title">Search plan</h2></div>
            <Tag type="cool-gray">Not executed</Tag>
          </div>
          <InlineNotification kind="warning" lowContrast title="Provider not connected" subtitle="No provider has been configured or connection-tested in this prototype. The plan below is illustrative; no API calls or charges were made." hideCloseButton />
          <Tile className="result-tile">
            <Stack gap={4}>
              <div className="plan-summary">
                <div><dt>Query expression</dt><dd>{query || 'No query conditions'}</dd></div>
                <div><dt>Proposed result cap</dt><dd>{resultLimit} pages</dd></div>
                <div><dt>Budget guardrail</dt><dd>${budget.toFixed(2)} USD</dd></div>
                <div><dt>Freshness filter</dt><dd>{timeRange}</dd></div>
              </div>
              <Button renderIcon={Play} disabled onClick={() => undefined}>Start search (provider required)</Button>
              <p className="section-caption">Execution remains disabled until a secure server-side provider adapter and credentials are implemented.</p>
            </Stack>
          </Tile>
          <div className="section-heading"><div><p className="eyebrow">SAMPLE DATA</p><h2>Example discovery records</h2></div><span className="section-caption">Fictional records · not real companies</span></div>
          <Grid>
            {sampleResults.filter((result) => !country || result.country === country || country === 'United Kingdom').map((result) => (
              <Column key={result.domain} sm={4} md={4} lg={5}>
                <Tile className="result-tile">
                  <Tag type="cool-gray">{result.status}</Tag>
                  <h3>{result.title}</h3>
                  <p>{result.domain} · {result.country}</p>
                  <p>{result.evidence}</p>
                  <Button kind="ghost" size="sm" renderIcon={TrashCan} onClick={() => {}}>Dismiss sample</Button>
                </Tile>
              </Column>
            ))}
          </Grid>
        </section>
      )}
    </section>
  );
}
