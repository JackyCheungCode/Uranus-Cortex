import { ArrowRight, ChartLine, Search, UserMultiple } from '@carbon/icons-react';
import { Button, Column, Grid, Tag, Tile } from '@carbon/react';

const metrics = [
  { label: 'Qualified buyers', value: '—', note: 'Awaiting real search data', icon: UserMultiple },
  { label: 'Discovery runs', value: '—', note: 'No live providers connected', icon: Search },
  { label: 'Cost per qualified buyer', value: '—', note: 'Tracking planned for a later phase', icon: ChartLine },
];

const activity = [
  { title: 'Frontend foundation', detail: 'Carbon layout and navigation', status: 'Ready for review' },
  { title: 'Buyer discovery workflow', detail: 'Search builder and mock results', status: 'Prototype' },
  { title: 'Provider connections', detail: 'Secure backend integration not started', status: 'Not connected' },
];

export function DashboardPage({ onOpenDiscovery }: { onOpenDiscovery: () => void }) {
  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">BUYER INTELLIGENCE WORKSPACE</p>
          <h1 id="dashboard-title">Find the right buyers.</h1>
          <p className="page-description">A focused workspace to discover overseas buyers for used-clothing exports, review evidence, and build a qualified pipeline.</p>
        </div>
        <Button renderIcon={ArrowRight} onClick={onOpenDiscovery}>Start buyer discovery</Button>
      </div>

      <div className="prototype-notice" role="status">
        <span className="prototype-notice__mark" aria-hidden="true">i</span>
        <p><strong>Prototype mode.</strong> Metrics and activity are intentionally shown as placeholders. Live search, saved records, and provider connections are not enabled.</p>
        <Tag type="cool-gray">Mock data only</Tag>
      </div>

      <section className="metrics-section" aria-labelledby="metrics-title">
        <div className="section-heading">
          <div><p className="eyebrow">WORKSPACE SNAPSHOT</p><h2 id="metrics-title">At a glance</h2></div>
          <span className="section-caption">Live metrics will appear after backend integration</span>
        </div>
        <Grid className="metric-grid">
          {metrics.map(({ label, value, note, icon: Icon }) => (
            <Column key={label} sm={4} md={4} lg={4}>
              <Tile className="metric-tile">
                <div className="metric-tile__top"><span>{label}</span><Icon size={20} aria-hidden="true" /></div>
                <p className="metric-value">{value}</p>
                <p className="metric-note">{note}</p>
              </Tile>
            </Column>
          ))}
        </Grid>
      </section>

      <Grid className="dashboard-lower-grid">
        <Column sm={4} md={8} lg={8}>
          <section className="activity-panel" aria-labelledby="activity-title">
            <div className="section-heading">
              <div><p className="eyebrow">IMPLEMENTATION STATUS</p><h2 id="activity-title">Workspace readiness</h2></div>
            </div>
            <div className="activity-list">
              {activity.map((item) => (
                <div className="activity-row" key={item.title}>
                  <span className="activity-marker" aria-hidden="true" />
                  <div className="activity-row__body"><strong>{item.title}</strong><span>{item.detail}</span></div>
                  <Tag type={item.status === 'Ready for review' ? 'green' : 'cool-gray'}>{item.status}</Tag>
                </div>
              ))}
            </div>
          </section>
        </Column>
        <Column sm={4} md={8} lg={4}>
          <Tile className="next-action-tile">
            <div className="next-action-tile__icon"><Search size={22} aria-hidden="true" /></div>
            <p className="eyebrow">RECOMMENDED NEXT STEP</p>
            <h2>Build your first search</h2>
            <p>Combine product terms, target markets, and purchase signals in a structured search workspace.</p>
            <Button kind="tertiary" renderIcon={ArrowRight} onClick={onOpenDiscovery}>Open discovery</Button>
          </Tile>
        </Column>
      </Grid>
    </section>
  );
}
