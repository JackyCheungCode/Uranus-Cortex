import { Add, Search, TrashCan } from '@carbon/icons-react';
import { Button, Checkbox, Column, Grid, InlineNotification, Select, SelectItem, Stack, Tag, TextInput, Tile } from '@carbon/react';
import { useMemo, useState } from 'react';

type ProductType = 'mixed' | 'sorted';
const countries = ['United Kingdom', 'Poland', 'Ghana', 'Kenya', 'Pakistan', 'United Arab Emirates'];

export function DiscoveryPage() {
  const [keywords, setKeywords] = useState('used clothing importer');
  const [productType, setProductType] = useState<ProductType>('mixed');
  const [country, setCountry] = useState('United Kingdom');
  const [purchaseSignals, setPurchaseSignals] = useState(true);
  const [excludeRetailers, setExcludeRetailers] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [extraTerms, setExtraTerms] = useState<string[]>([]);
  const [termInput, setTermInput] = useState('');

  const query = useMemo(() => {
    const parts = [keywords.trim() ? `"${keywords.trim()}"` : ''];
    if (productType === 'mixed') parts.push('("mixed used clothing" OR "unsorted clothing bales")');
    else parts.push('("sorted used clothing" OR "graded second hand clothing")');
    parts.push(`"${country}"`);
    if (purchaseSignals) parts.push('("buying" OR "import" OR "wholesale" OR "supplier")');
    if (excludeRetailers) parts.push('-retail -fashion');
    extraTerms.forEach((term) => parts.push(`"${term}"`));
    return parts.filter(Boolean).join(' AND ');
  }, [keywords, productType, country, purchaseSignals, excludeRetailers, extraTerms]);

  function addTerm() {
    const value = termInput.trim();
    if (value && !extraTerms.includes(value)) setExtraTerms((terms) => [...terms, value]);
    setTermInput('');
  }

  return (
    <section className="discovery-page" aria-labelledby="discovery-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">BUYER INTELLIGENCE</p>
          <h1 id="discovery-title">Buyer discovery</h1>
          <p className="page-description">Build a focused search around product type, target market, and signals of actual purchasing demand.</p>
        </div>
      </div>
      <InlineNotification kind="info" lowContrast title="Demo search only" subtitle="This builder updates the query locally. It does not call a search provider or fetch live websites." hideCloseButton />
      <Grid className="discovery-layout">
        <Column sm={4} md={8} lg={7}>
          <Tile className="builder-tile">
            <Stack gap={5}>
              <div className="section-heading section-heading--compact">
                <div><p className="eyebrow">SEARCH CONFIGURATION</p><h2>Build your query</h2></div>
              </div>
              <TextInput id="search-keywords" labelText="Core keywords" value={keywords} onChange={(event) => setKeywords(event.currentTarget.value)} helperText="Describe the company or buyer intent you want to find." placeholder="e.g. used clothing importer" />
              <Select id="product-type" labelText="Product type" value={productType} onChange={(event) => setProductType(event.currentTarget.value as ProductType)}>
                <SelectItem value="mixed" text="Mixed / unsorted bales" />
                <SelectItem value="sorted" text="Sorted / graded used clothing" />
              </Select>
              <Select id="target-country" labelText="Target market" value={country} onChange={(event) => setCountry(event.currentTarget.value)}>
                {countries.map((item) => <SelectItem key={item} value={item} text={item} />)}
              </Select>
              <div className="filter-options">
                <Checkbox id="purchase-signals" labelText="Prioritize purchase-intent signals" checked={purchaseSignals} onChange={(_, data) => setPurchaseSignals(data.checked)} />
                <Checkbox id="exclude-retailers" labelText="Exclude retail and fashion-only results" checked={excludeRetailers} onChange={(_, data) => setExcludeRetailers(data.checked)} />
              </div>
              <div className="extra-terms">
                <div className="extra-terms__input">
                  <TextInput id="extra-term" labelText="Additional required phrase" hideLabel value={termInput} onChange={(event) => setTermInput(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addTerm(); } }} placeholder="e.g. import license" />
                  <Button kind="secondary" hasIconOnly renderIcon={Add} iconDescription="Add required phrase" aria-label="Add required phrase" onClick={addTerm} />
                </div>
                {extraTerms.length > 0 && <div className="term-tags">{extraTerms.map((term) => <Tag key={term} type="cool-gray" filter onClose={() => setExtraTerms((terms) => terms.filter((item) => item !== term))}>{term}</Tag>)}</div>}
              </div>
              <Button renderIcon={Search} onClick={() => setShowResults(true)}>Preview mock results</Button>
            </Stack>
          </Tile>
        </Column>
        <Column sm={4} md={8} lg={5}>
          <Stack gap={4}>
            <Tile className="query-preview">
              <p className="eyebrow">GENERATED QUERY</p>
              <h2>Search syntax</h2>
              <pre>{query}</pre>
              <Button kind="ghost" size="sm" onClick={() => { setKeywords(''); setProductType('mixed'); setCountry('United Kingdom'); setPurchaseSignals(true); setExcludeRetailers(false); setExtraTerms([]); setShowResults(false); setTermInput(''); }} renderIcon={TrashCan}>Reset conditions</Button>
            </Tile>
            <Tile className="search-hint">
              <p className="eyebrow">SEARCH STRATEGY</p>
              <h2>Look for buying evidence</h2>
              <p>Prioritize import records, wholesale catalogues, sourcing pages, supplier requests, and explicit used-clothing purchasing language. Treat each result as a lead until evidence is reviewed.</p>
            </Tile>
          </Stack>
        </Column>
      </Grid>
      {showResults && (
        <section className="mock-results" aria-labelledby="mock-results-title">
          <div className="section-heading"><div><p className="eyebrow">SAMPLE DATA</p><h2 id="mock-results-title">Preview results</h2></div><span className="section-caption">Illustrative only · not real companies</span></div>
          <InlineNotification kind="warning" lowContrast title="Mock results are not verified leads" subtitle="These example rows are for layout and interaction testing only. No live search was performed." hideCloseButton />
          <Grid>
            <Column sm={4} md={4} lg={4}><Tile className="result-tile"><span className="result-index">01</span><h3>Example wholesale importer</h3><p>Example company profile · {country}</p><span className="result-signal">Sample signal: wholesale sourcing</span></Tile></Column>
            <Column sm={4} md={4} lg={4}><Tile className="result-tile"><span className="result-index">02</span><h3>Illustrative textile recycler</h3><p>Example company profile · {country}</p><span className="result-signal">Sample signal: bulk material intake</span></Tile></Column>
            <Column sm={4} md={4} lg={4}><Tile className="result-tile"><span className="result-index">03</span><h3>Demo second-hand distributor</h3><p>Example company profile · {country}</p><span className="result-signal">Sample signal: second-hand wholesale</span></Tile></Column>
          </Grid>
        </section>
      )}
    </section>
  );
}
