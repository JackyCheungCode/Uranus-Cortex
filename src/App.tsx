import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckmarkFilled,
  Cloud,
  Code,
  Renew,
  ServerProxy,
} from '@carbon/icons-react';
import {
  Button,
  Column,
  Grid,
  InlineNotification,
  Tag,
  Tile,
} from '@carbon/react';

type Health = {
  status: string;
  service: string;
  timestamp: string;
};

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function checkHealth() {
    setChecking(true);
    setError(null);
    try {
      const response = await fetch('/api/health', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Health check returned HTTP ${response.status}`);
      setHealth((await response.json()) as Health);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to reach the Cortex API.');
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    void checkHealth();
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true"><Cloud size={22} /></div>
        <div className="brand-copy">
          <span className="brand-eyebrow">URANUS PLATFORM</span>
          <strong>cortex</strong>
        </div>
        <div className="header-meta"><Tag type="blue">Environment · Production</Tag></div>
      </header>

      <main className="page-content">
        <div className="page-intro">
          <div>
            <p className="eyebrow">OPERATIONS / OVERVIEW</p>
            <h1>Cortex control plane</h1>
            <p className="intro-copy">A clean starting point for the Uranus Cortex platform, built with IBM Carbon and Cloudflare Workers.</p>
          </div>
          <Button kind="tertiary" renderIcon={Renew} onClick={() => void checkHealth()} disabled={checking}>
            Refresh status
          </Button>
        </div>

        {error && <InlineNotification kind="error" lowContrast title="API health check failed" subtitle={error} hideCloseButton />}

        <Grid className="status-grid">
          <Column sm={4} md={4} lg={5}>
            <Tile className="status-tile">
              <div className="tile-topline"><span className="tile-label">WORKER API</span><ServerProxy size={20} /></div>
              <div className="tile-value">{health?.status === 'ok' ? 'Operational' : checking ? 'Checking…' : 'Pending'}</div>
              <div className="tile-foot"><span className={`status-dot ${health?.status === 'ok' ? 'is-online' : ''}`} />{health?.service ?? 'cortex'} · /api/health</div>
            </Tile>
          </Column>
          <Column sm={4} md={4} lg={5}>
            <Tile className="status-tile">
              <div className="tile-topline"><span className="tile-label">FRONTEND</span><Code size={20} /></div>
              <div className="tile-value">React + Vite</div>
              <div className="tile-foot"><CheckmarkFilled size={14} className="icon-success" /> TypeScript enabled</div>
            </Tile>
          </Column>
          <Column sm={4} md={8} lg={6}>
            <Tile className="status-tile">
              <div className="tile-topline"><span className="tile-label">DESIGN SYSTEM</span><ArrowRight size={20} /></div>
              <div className="tile-value">IBM Carbon</div>
              <div className="tile-foot">Carbon React components and tokens</div>
            </Tile>
          </Column>
        </Grid>

        <section className="section-block">
          <div className="section-heading">
            <div><p className="eyebrow">FOUNDATION</p><h2>Project readiness</h2></div>
            <Tag type={health?.status === 'ok' ? 'green' : 'cool-gray'}>{health?.status === 'ok' ? 'API connected' : 'Awaiting API'}</Tag>
          </div>
          <Tile className="readiness-tile">
            <div className="readiness-row"><div className="readiness-icon"><CheckmarkFilled size={18} /></div><div className="readiness-copy"><strong>Carbon-based interface</strong><span>Accessible components, Carbon design tokens, and a responsive grid.</span></div><Tag type="green">Ready</Tag></div>
            <div className="readiness-row"><div className="readiness-icon"><CheckmarkFilled size={18} /></div><div className="readiness-copy"><strong>Cloudflare Worker entry point</strong><span>Worker serves the SPA assets and exposes a lightweight health endpoint.</span></div><Tag type="green">Ready</Tag></div>
            <div className="readiness-row"><div className="readiness-icon readiness-icon-muted"><Code size={18} /></div><div className="readiness-copy"><strong>Business modules</strong><span>Not added yet — this repository is the initial application foundation.</span></div><Tag type="cool-gray">Next step</Tag></div>
          </Tile>
        </section>

        <footer className="app-footer">
          <span>URANUS CORTEX · FOUNDATION BUILD</span>
          <span>{health?.timestamp ? `Last checked ${new Date(health.timestamp).toLocaleTimeString()}` : 'Health status will appear after API check'}</span>
        </footer>
      </main>
    </div>
  );
}
