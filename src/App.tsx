import {
  Activity,
  Api,
  ArrowRight,
  CheckmarkFilled,
  ChevronDown,
  Dashboard,
  Help,
  Search,
  Settings,
  UserMultiple,
} from '@carbon/icons-react';
import { Button, Tag } from '@carbon/react';
import { useState } from 'react';
import { DashboardPage } from './modules/dashboard';
import { DiscoveryPage } from './modules/discovery';
import './styles.css';

type PageId = 'dashboard' | 'discovery' | 'buyers' | 'crm' | 'integrations' | 'settings';

const navigation: Array<{ id: PageId; label: string; icon: typeof Dashboard }> = [
  { id: 'dashboard', label: 'Overview', icon: Dashboard },
  { id: 'discovery', label: 'Buyer discovery', icon: Search },
  { id: 'buyers', label: 'Buyer profiles', icon: UserMultiple },
  { id: 'crm', label: 'CRM pipeline', icon: Activity },
  { id: 'integrations', label: 'API providers', icon: Api },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const pageTitles: Record<PageId, string> = {
  dashboard: 'Overview',
  discovery: 'Buyer discovery',
  buyers: 'Buyer profiles',
  crm: 'CRM pipeline',
  integrations: 'API providers',
  settings: 'Settings',
};

function ComingSoonPage({ page }: { page: Exclude<PageId, 'dashboard' | 'discovery'> }) {
  const descriptions: Record<typeof page, string> = {
    buyers: 'Review qualified companies, evidence, public contact details, and buyer-fit signals.',
    crm: 'Organize reviewed prospects into a clear follow-up workflow.',
    integrations: 'Configure search providers and manage connection status in a future secure backend.',
    settings: 'Manage workspace preferences and application behavior.',
  };

  return (
    <section className="placeholder-page" aria-labelledby="placeholder-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">WORKSPACE</p>
          <h1 id="placeholder-title">{pageTitles[page]}</h1>
          <p className="page-description">{descriptions[page]}</p>
        </div>
        <Tag type="cool-gray">Frontend prototype</Tag>
      </div>
      <Tile className="placeholder-tile">
        <div className="placeholder-tile__icon"><CheckmarkFilled size={20} aria-hidden="true" /></div>
        <h2>Designed for the next implementation phase</h2>
        <p>This area is a documented placeholder. No real services, credentials, or production data are connected.</p>
      </Tile>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activeLabel = pageTitles[activePage];

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="app-header">
        <div className="app-header__brand">
          <span className="brand-mark" aria-hidden="true">U</span>
          <span className="brand-name">URANUS <strong>CORTEX</strong></span>
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-workspace">Buyer intelligence</span>
        </div>
        <div className="app-header__actions">
          <Tag type="blue">Prototype</Tag>
          <Button kind="ghost" size="md" renderIcon={Help} iconDescription="Help" hasIconOnly aria-label="Help" />
          <Button kind="ghost" size="md" renderIcon={ChevronDown} onClick={() => setMobileNavOpen((open) => !open)} className="mobile-menu-trigger">
            Menu
          </Button>
        </div>
      </header>

      <div className="app-frame">
        <aside className={`app-sidebar ${mobileNavOpen ? 'app-sidebar--open' : ''}`} aria-label="Main navigation">
          <p className="sidebar-label">WORKSPACE</p>
          <nav>
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`nav-item ${activePage === id ? 'nav-item--active' : ''}`}
                aria-current={activePage === id ? 'page' : undefined}
                onClick={() => {
                  setActivePage(id);
                  setMobileNavOpen(false);
                }}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
                {id === 'discovery' && <span className="nav-item__dot" aria-label="Primary workflow" />}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="environment-indicator"><span aria-hidden="true" /> Mock environment</div>
            <p>Frontend phase · No live services</p>
          </div>
        </aside>

        <main id="main-content" className="main-content" aria-label={`Uranus Cortex application`}>
          <div className="content-topline">
            <span>Workspace</span><span aria-hidden="true">/</span><strong>{activeLabel}</strong>
          </div>
          {activePage === 'dashboard' && <DashboardPage onOpenDiscovery={() => setActivePage('discovery')} />}
          {activePage === 'discovery' && <DiscoveryPage />}
          {(['buyers', 'crm', 'integrations', 'settings'] as const).includes(activePage as 'buyers' | 'crm' | 'integrations' | 'settings') && (
            <ComingSoonPage page={activePage as 'buyers' | 'crm' | 'integrations' | 'settings'} />
          )}
          <footer className="app-footer">
            <span>Uranus Cortex</span><span>Carbon-first frontend prototype</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
