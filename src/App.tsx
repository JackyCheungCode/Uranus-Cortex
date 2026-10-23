import {
  Api,
  DataBase,
  Globe,
  Help,
  Search,
  Settings,
  UserMultiple,
  Upload,
} from '@carbon/icons-react';
import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  SideNav,
  SideNavItems,
  SideNavLink,
  SkipToContent,
  Tag,
} from '@carbon/react';
import { useState } from 'react';
import { DiscoveryPage } from './modules/discovery';
import './styles.css';

export type DiscoveryChannel = 'search' | 'directories' | 'customs' | 'social' | 'import' | 'providers';

const channels: Array<{ id: DiscoveryChannel; label: string; icon: typeof Search }> = [
  { id: 'search', label: '搜索引擎', icon: Search },
  { id: 'directories', label: '企业黄页', icon: Globe },
  { id: 'customs', label: '海关数据', icon: DataBase },
  { id: 'social', label: '社交媒体', icon: UserMultiple },
  { id: 'import', label: '导入名单', icon: Upload },
  { id: 'providers', label: '搜索服务设置', icon: Api },
];

const channelDescriptions: Record<DiscoveryChannel, string> = {
  search: '通过公开网页与采购信号发现潜在采购商。',
  directories: '从企业目录、行业名录和商会目录整理候选企业。',
  customs: '为未来的合规海关数据连接预留工作区。',
  social: '整理公开商务主页和企业社交资料中的线索。',
  import: '导入 CSV / Excel 名单，映射字段并检查重复项。',
  providers: '管理搜索服务连接状态、预算与可用能力。',
};

export default function App() {
  const [activeChannel, setActiveChannel] = useState<DiscoveryChannel>('search');
  const [navExpanded, setNavExpanded] = useState(true);

  return (
    <div className="app-shell">
      <Header aria-label="Uranus Cortex 潜客发现">
        <SkipToContent />
        <HeaderMenuButton
          aria-label="切换导航"
          isActive={navExpanded}
          onClick={() => setNavExpanded((expanded) => !expanded)}
        />
        <HeaderName href="#main-content" prefix="Uranus">Cortex · 潜客发现</HeaderName>
        <HeaderGlobalBar>
          <Tag type="blue">原型环境</Tag>
          <HeaderGlobalAction aria-label="帮助" tooltipAlignment="end" onClick={() => setActiveChannel('providers')}>
            <Help size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="搜索服务设置" tooltipAlignment="end" onClick={() => setActiveChannel('providers')}>
            <Settings size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      <div className="app-frame">
        <SideNav aria-label="潜客发现渠道" expanded={navExpanded} className="app-sidebar">
          <div className="sidebar-product">
            <p className="sidebar-product__eyebrow">工作区</p>
            <p className="sidebar-product__title">潜客发现</p>
            <p className="sidebar-product__description">多渠道采购商线索研究</p>
          </div>
          <SideNavItems>
            {channels.map(({ id, label, icon: Icon }) => (
              <SideNavLink
                key={id}
                href={`#${id}`}
                renderIcon={Icon}
                isActive={activeChannel === id}
                aria-current={activeChannel === id ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveChannel(id);
                }}
              >
                {label}
              </SideNavLink>
            ))}
          </SideNavItems>
          <div className="sidebar-footer">
            <div className="environment-indicator"><span aria-hidden="true" /> 模拟数据环境</div>
            <p>尚未连接真实搜索服务</p>
          </div>
        </SideNav>

        <main id="main-content" className="main-content" aria-label="潜客发现工作区">
          <div className="content-topline">
            <span>工作区</span><span aria-hidden="true">/</span><strong>{channels.find((channel) => channel.id === activeChannel)?.label}</strong>
          </div>
          <DiscoveryPage channel={activeChannel} description={channelDescriptions[activeChannel]} />
          <footer className="app-footer">
            <span>Uranus Cortex</span><span>基于 IBM Carbon 的前端原型 · 未连接真实服务</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
