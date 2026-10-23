import { useMemo, useState } from 'react';
import './crm.css';
import {
  Add, ArrowDown, ArrowRight, ArrowUp, Calendar, Checkmark, ChevronDown, ChevronLeft,
  ChevronRight, Close, 电子邮箱, 筛选, Grid as GridIcon, Home, Menu, More, 电话,
  Search, 设置, UserMultiple, User, 视图,
} from '@carbon/icons-react';

type Contact = {
  id: string; name: string; initials: string; role: string; company: string; email: string;
  owner: string; source: string; amount: number; status: 'Qualified' | 'Working' | 'New';
  color: string; phone: string; location: string; last活动记录: string;
};
type 活动记录 = { id: string; type: 'note' | 'email' | 'call'; title: string; body: string; date: string; author: string };
type Deal = { id: string; name: string; company: string; amount: number; owner: string; initials: string; color: string; closeDate: string; stage: Stage };
type Stage = '初步沟通' | '演示' | '方案' | '谈判' | '已成交';

const contactsSeed: Contact[] = [
  { id:'c1',name:'Olivia Rhye',initials:'OR',role:'VP / Operations',company:'Acme Inc.',email:'olivia@acme.com',owner:'Alex Morgan',source:'Website',amount:48000,status:'Qualified',color:'violet',phone:'+1 (415) 555-0138',location:'San Francisco, CA',last活动记录:'2 hours ago' },
  { id:'c2',name:'Phoenix Baker',initials:'PB',role:'Head / Growth',company:'Catalog',email:'phoenix@catalog.com',owner:'Jamie Chen',source:'Referral',amount:32000,status:'Working',color:'amber',phone:'+1 (212) 555-0194',location:'New York, NY',last活动记录:'Yesterday' },
  { id:'c3',name:'Lana Steiner',initials:'LS',role:'Product Manager',company:'Circooles',email:'lana@circooles.com',owner:'Alex Morgan',source:'LinkedIn',amount:26500,status:'Qualified',color:'rose',phone:'+1 (650) 555-0175',location:'Palo Alto, CA',last活动记录:'Yesterday' },
  { id:'c4',name:'Demi Wilkinson',initials:'DW',role:'Director / Sales',company:'Hourglass',email:'demi@hourglass.com',owner:'Morgan Lee',source:'Outbound',amount:18500,status:'New',color:'blue',phone:'+1 (312) 555-0160',location:'Chicago, IL',last活动记录:'2 days ago' },
  { id:'c5',name:'Candice Wu',initials:'CW',role:'Marketing Lead',company:'Layers',email:'candice@layers.com',owner:'Jamie Chen',source:'Website',amount:52000,status:'Qualified',color:'green',phone:'+1 (206) 555-0129',location:'Seattle, WA',last活动记录:'3 days ago' },
  { id:'c6',name:'Natali Craig',initials:'NC',role:'Founder',company:'Quotient',email:'natali@quotient.com',owner:'Morgan Lee',source:'Referral',amount:22000,status:'Working',color:'cyan',phone:'+1 (512) 555-0117',location:'Austin, TX',last活动记录:'4 days ago' },
  { id:'c7',name:'Drew Cano',initials:'DC',role:'Finance Director',company:'Sisyphus',email:'drew@sisyphus.com',owner:'Alex Morgan',source:'Event',amount:39500,status:'New',color:'orange',phone:'+1 (617) 555-0183',location:'Boston, MA',last活动记录:'5 days ago' },
];
const stages: Stage[] = ['初步沟通','演示','方案','谈判','已成交'];
const dealsSeed: Deal[] = [
  {id:'d1',name:'Enterprise plan',company:'Acme Inc.',amount:48000,owner:'Alex Morgan',initials:'AM',color:'violet',closeDate:'11月14日',stage:'初步沟通'},
  {id:'d2',name:'Annual subscription',company:'Catalog',amount:32000,owner:'Jamie Chen',initials:'JC',color:'amber',closeDate:'11月8日',stage:'初步沟通'},
  {id:'d3',name:'Growth package',company:'Circooles',amount:26500,owner:'Alex Morgan',initials:'AM',color:'blue',closeDate:'11月12日',stage:'演示'},
  {id:'d4',name:'Team workspace',company:'Hourglass',amount:18500,owner:'Morgan Lee',initials:'ML',color:'rose',closeDate:'11月21日',stage:'方案'},
  {id:'d5',name:'平台 rollout',company:'Layers',amount:52000,owner:'Jamie Chen',initials:'JC',color:'green',closeDate:'11月4日',stage:'谈判'},
  {id:'d6',name:'Pro plan renewal',company:'Quotient',amount:22000,owner:'Morgan Lee',initials:'ML',color:'cyan',closeDate:'10月30日',stage:'已成交'},
  {id:'d7',name:'Data services',company:'Sisyphus',amount:39500,owner:'Alex Morgan',initials:'AM',color:'orange',closeDate:'11月27日',stage:'演示'},
];
const activityByContact: Record<string, 活动记录[]> = {
  c1: [
    {id:'a1',type:'email',title:'已发送跟进邮件',body:'已分享企业版介绍，并建议安排技术需求沟通。',date:'今天 10:42',author:'Alex Morgan'},
    {id:'a2',type:'call',title:'已完成需求沟通电话',body:'Olivia 希望整合三个区域的工作流程，本季度预算已确认。',date:'昨天 15:15',author:'Alex Morgan'},
    {id:'a3',type:'note',title:'初步调研',body:'Team / 85 across operations. Current workflow relies on spreadsheets and manual handoffs.',date:'2026年10月19日',author:'Jamie Chen'},
  ],
  c2: [{id:'a4',type:'note',title:'推荐背景',body:'合作伙伴团队在其他项目成功实施后引荐。',date:'昨天 11:20',author:'Jamie Chen'}],
};
const statusLabel = (status: Contact['status']) => ({ Qualified: '合格', Working: '跟进中', New: '新建' }[status]);
const stageLabel = (stage: Stage) => ({ Discovery: '初步沟通', Demo: '产品演示', Proposal: '方案报价', Negotiation: '商务谈判', 'Closed Won': '已成交' }[stage]);
const money = (n:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const navItems = [{id:'contacts',label:'联系人',icon:UserMultiple},{id:'deals',label:'交易',icon:GridIcon},{id:'companies',label:'公司',icon:Home}];

export default function CRMApp() {
  const [page,setPage] = useState<'contacts'|'deals'|'companies'|'foundation'>('contacts');
  const [contacts,set联系人] = useState(contactsSeed);
  const [deals,set交易] = useState(dealsSeed);
  const [selectedId,setSelectedId] = useState<string|null>(null);
  const [query,setQuery] = useState('');
  const [status筛选,setStatus筛选] = useState('全部状态');
  const [sortAsc,set排序Asc] = useState(true);
  const [mobileNav,setMobileNav] = useState(false);
  const [dragId,setDragId] = useState<string|null>(null);
  const [notice,setNotice] = useState('');
  const [showAdd,setShowAdd] = useState(false);
  const selected = contacts.find(c=>c.id===selectedId) ?? null;
  const filtered = useMemo(()=>contacts.filter(c=>{
    const text=[c.name,c.company,c.email,c.owner,c.source].join(' ').toLowerCase();
    return text.includes(query.toLowerCase()) && (status筛选==='全部状态'||c.status===status筛选);
  }).sort((a,b)=>sortAsc?a.name.localeCompare(b.name):b.name.localeCompare(a.name)),[contacts,query,status筛选,sortAsc]);
  const totalPipeline = deals.filter(d=>d.stage!=='已成交').reduce((s,d)=>s+d.amount,0);
  const go = (next: typeof page) => { setPage(next); setSelectedId(null); setMobileNav(false); setNotice(''); };
  const addContact = () => {
    const id='c'+Date.now();
    const c:Contact={id,name:'新联系人',initials:'NC',role:'New role',company:'新公司',email:'hello@example.com',owner:'Alex Morgan',source:'Manual entry',amount:0,status:'New',color:'blue',phone:'—',location:'—',last活动记录:'Just now'};
    set联系人(prev=>[c,...prev]);setSelectedId(id);setPage('contacts');setShowAdd(false);setNotice('Mock contact created locally.');
  };
  const moveDeal=(id:string,stage:Stage)=>{set交易(prev=>prev.map(d=>d.id===id?{...d,stage}:d));setDragId(null);setNotice('Deal stage updated in this demo.');};

  return <div className="crm-root">
    <aside className={`crm-sidebar ${mobileNav?'is-open':''}`}>
      <div className="crm-brand"><div className="crm-brand-symbol">u</div><div><strong>uranus</strong><span>客户工作空间</span></div><button className="crm-icon-button crm-mobile-close" aria-label="关闭导航" onClick={()=>setMobileNav(false)}><Close size={18}/></button></div>
      <button className="crm-workspace-switch"><span className="crm-workspace-avatar">U</span><span><strong>Uranus 工作空间</strong><small>免费工作空间</small></span><ChevronDown size={16}/></button>
      <div className="crm-side-label">工作空间</div>
      <nav aria-label="Main navigation" className="crm-nav">
        {navItems.map(item=>{const Icon=item.icon;return <button key={item.id} className={`crm-nav-item ${page===item.id?'active':''}`} onClick={()=>go(item.id as typeof page)}><Icon size={18}/><span>{item.label}</span>{item.id==='contacts'&&<span className="crm-nav-count">{contacts.length}</span>}</button>})}
      </nav>
      <div className="crm-side-label crm-side-label-spaced">团队</div>
      <button className="crm-nav-item" onClick={()=>setNotice('Team settings 是演示占位功能。')}><User size={18}/><span>团队成员</span></button>
      <button className="crm-nav-item" onClick={()=>setNotice('设置 是演示占位功能。')}><设置 size={18}/><span>设置</span></button>
      <div className="crm-sidebar-bottom"><div className="crm-help-card"><div className="crm-help-icon">✦</div><strong>Make work flow.</strong><p>Your customer relationships, all in one place.</p><button onClick={()=>setNotice('Help center is not connected in this demo.')}>Visit help center <ArrowRight size={14}/></button></div><div className="crm-user"><div className="crm-avatar avatar-violet">YU</div><div><strong>Yoo Justin</strong><span>工作空间 admin</span></div><More size={18}/></div></div>
    </aside>
    {mobileNav&&<button className="crm-scrim" aria-label="关闭导航 overlay" onClick={()=>setMobileNav(false)}/>}
    <main className="crm-main">
      <header className="crm-topbar"><button className="crm-icon-button crm-mobile-menu" aria-label="打开导航" onClick={()=>setMobileNav(true)}><Menu size={20}/></button><div className="crm-breadcrumb"><span>工作空间</span><ChevronRight size={14}/><strong>{page==='contacts'?(selected?'联系人详情':'联系人'):page==='deals'?'交易':page==='companies'?'公司':'平台状态'}</strong></div><div className="crm-top-actions"><span className="crm-demo-label"><span/>演示数据</span><button className="crm-icon-button" aria-label="搜索联系人" onClick={()=>document.getElementById('crm-search')?.focus()}><Search size={18}/></button><button className="crm-icon-button" aria-label="通知" onClick={()=>setNotice('You are all caught up.')}>◌</button><div className="crm-avatar avatar-violet">YU</div></div></header>
      <div className="crm-page">
        {notice&&<div className="crm-notice" role="status">{notice}<button aria-label="Dismiss notice" onClick={()=>setNotice('')}><Close size={14}/></button></div>}
        {page==='contacts'&&!selected&&<section>
          <div className="crm-page-heading"><div><div className="crm-overline">客户关系</div><h1>联系人</h1><p>管理联系人，让每一次沟通持续推进。</p></div><button className="crm-primary-button" onClick={()=>setShowAdd(true)}><Add size={17}/> 添加联系人</button></div>
          <div className="crm-stats-row"><div className="crm-stat"><span>联系人总数</span><strong>{contacts.length}</strong><small><span className="crm-trend">↗ 12%</span> vs. last month</small></div><div className="crm-stat"><span>合格线索</span><strong>{contacts.filter(c=>c.status==='Qualified').length}</strong><small>可进入跟进</small></div><div className="crm-stat"><span>销售管道金额</span><strong>{money(totalPipeline)}</strong><small>所有未结商机</small></div><div className="crm-stat"><span>活跃负责人</span><strong>3</strong><small>团队成员</small></div></div>
          <div className="crm-table-panel"><div className="crm-table-toolbar"><div className="crm-search-wrap"><Search size={17}/><input id="crm-search" aria-label="搜索联系人" placeholder="搜索联系人…" value={query} onChange={e=>setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><div className="crm-toolbar-actions"><label className="crm-select-wrap"><筛选 size={16}/><select aria-label="筛选 by status" value={status筛选} onChange={e=>setStatus筛选(e.target.value)}><option>全部状态</option><option>Qualified</option><option>Working</option><option>New</option></select><ChevronDown size={14}/></label><button className="crm-secondary-button" onClick={()=>set排序Asc(v=>!v)}>{sortAsc?<ArrowDown size={15}/>:<ArrowUp size={15}/>} 排序</button><button className="crm-secondary-button crm-view-button" onClick={()=>setNotice('Table view is the only enabled view in this prototype.')}><视图 size={16}/><span>视图</span></button></div></div>
          <div className="crm-table-scroll"><table className="crm-table"><thead><tr><th><input type="checkbox" aria-label="Select all visible contacts" onChange={e=>setNotice(e.target.checked?'Bulk selection is a visual demo only.':'Selection cleared.')}/></th><th>姓名</th><th>公司</th><th>负责人</th><th>来源</th><th>预计商机金额</th><th>状态</th><th aria-label="Actions"/></tr></thead><tbody>{filtered.map(c=><tr key={c.id} onClick={()=>setSelectedId(c.id)} tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedId(c.id)}}}><td onClick={e=>e.stopPropagation()}><input type="checkbox" aria-label={`Select ${c.name}`} onChange={e=>setNotice(e.target.checked?`${c.name} selected.`:`${c.name} unselected.`)}/></td><td><div className="crm-person-cell"><div className={`crm-avatar avatar-${c.color}`}>{c.initials}</div><div><strong>{c.name}</strong><span>{c.email}</span></div></div></td><td><span className="crm-company-name">{c.company}</span><span className="crm-cell-sub">{c.role}</span></td><td><div className="crm-owner-cell"><span className={`crm-avatar crm-avatar-small avatar-${c.owner==='Jamie Chen'?'amber':c.owner==='Morgan Lee'?'rose':'violet'}`}>{c.owner.split(' ').map(s=>s[0]).join('')}</span>{c.owner}</div></td><td><span className="crm-source-pill">{c.source}</span></td><td className="crm-money-cell">{money(c.amount)}</td><td><span className={`crm-status status-${c.status.toLowerCase()}`}><span/>{statusLabel(c.status)}</span></td><td><button className="crm-row-more" aria-label={`More actions for ${c.name}`} onClick={e=>{e.stopPropagation();setNotice(`操作：${c.name} 将在后续版本提供。`)}}><More size={18}/></button></td></tr>)}</tbody></table>{filtered.length===0&&<div className="crm-empty"><Search size={24}/><strong>未找到联系人</strong><span>请尝试其他姓名、公司或状态。</span><button onClick={()=>{setQuery('');setStatus筛选('全部状态')}}>清除筛选</button></div>}</div>
          <div className="crm-table-footer"><span>显示 <strong>{filtered.length}</strong> / <strong>{contacts.length}</strong> contacts</span><div><button disabled aria-label="Previous page"><ChevronLeft size={16}/></button><button className="current">1</button><button disabled aria-label="Next page"><ChevronRight size={16}/></button></div></div></div>
        </section>}
        {page==='contacts'&&selected&&<section className="crm-detail-view"><button className="crm-back-link" onClick={()=>setSelectedId(null)}><ChevronLeft size={16}/> 返回联系人</button><div className="crm-detail-layout"><div className="crm-detail-primary"><div className="crm-detail-heading"><div className={`crm-avatar crm-avatar-xl avatar-${selected.color}`}>{selected.initials}</div><div className="crm-detail-name"><h1>{selected.name}</h1><p>{selected.role} <span>at</span> <strong>{selected.company}</strong></p><div className="crm-detail-tags"><span className={`crm-status status-${selected.status.toLowerCase()}`}><span/>{statusLabel(selected.status)}</span><span className="crm-source-pill">{selected.source}</span></div></div><button className="crm-secondary-button" onClick={()=>setNotice('Edit form is not connected in this prototype.')}><设置 size={15}/> 编辑联系人</button></div>
          <div className="crm-detail-section"><div className="crm-section-title"><h2>活动记录</h2><button className="crm-secondary-button" onClick={()=>setNotice('活动记录 filters are not connected yet.')}><筛选 size={15}/> 筛选</button></div><div className="crm-activity-composer"><textarea aria-label="Add a note" placeholder="写下备注或更新…" rows={2}/><div><span>团队可见</span><button className="crm-primary-button crm-small-button" onClick={()=>setNotice('Notes are mock-only and are not persisted.')}>添加备注 <ArrowRight size={14}/></button></div></div><div className="crm-timeline">{(activityByContact[selected.id]??[{id:'fallback',type:'note' as const,title:'Contact added',body:'此联系人已添加到工作空间。可添加备注或通话记录以保持档案更新。',date:'2026年10月20日',author:selected.owner}]).map(a=><article className="crm-timeline-item" key={a.id}><div className={`crm-timeline-icon timeline-${a.type}`}>{a.type==='email'?<电子邮箱 size={16}/>:a.type==='call'?<电话 size={16}/>:<Calendar size={16}/>}</div><div className="crm-timeline-body"><div className="crm-timeline-top"><strong>{a.title}</strong><time>{a.date}</time></div><p>{a.body}</p><span>By {a.author}</span></div></article>)}</div></div></div>
          <aside className="crm-detail-aside"><div className="crm-aside-card"><div className="crm-aside-title"><h3>联系人信息</h3><button className="crm-icon-button" aria-label="编辑联系人 information" onClick={()=>setNotice('Contact editing is not connected.')}>⋯</button></div><div className="crm-info-field"><span>电子邮箱</span><a href={`mailto:${selected.email}`}>{selected.email}</a></div><div className="crm-info-field"><span>电话</span><a href={`tel:${selected.phone.replace(/[^+0-9]/g,'')}`}>{selected.phone}</a></div><div className="crm-info-field"><span>所在地</span><strong>{selected.location}</strong></div><div className="crm-info-field"><span>联系人负责人</span><strong>{selected.owner}</strong></div><div className="crm-info-field"><span>线索来源</span><strong>{selected.source}</strong></div></div><div className="crm-aside-card"><div className="crm-aside-title"><h3>未结商机</h3><button className="crm-icon-button" aria-label="More opportunity actions" onClick={()=>setNotice('Opportunity actions are a demo placeholder.')}><More size={18}/></button></div><div className="crm-opportunity"><div className="crm-company-logo">{selected.company.slice(0,1)}</div><div><strong>{selected.company}</strong><span>潜在交易</span></div></div><div className="crm-opportunity-value">{money(selected.amount)}<span>预计金额</span></div><div className="crm-opportunity-footer"><span>预计成交</span><strong>11月14日, 2026</strong></div><button className="crm-full-secondary" onClick={()=>{setPage('deals');setSelectedId(null)}}>视图 all deals <ArrowRight size={15}/></button></div><div className="crm-aside-card crm-related-card"><h3>关联公司</h3><p>{selected.company} <span>· 公司档案</span></p><button onClick={()=>{setPage('companies');setSelectedId(null)}}>打开公司 <ArrowRight size={14}/></button></div></aside></div></section>}
        {page==='deals'&&<section><div className="crm-page-heading"><div><div className="crm-overline">销售运营</div><h1>交易</h1><p>持续推进每个商机直至成交。</p></div><button className="crm-primary-button" onClick={()=>setNotice('New deal creation will be added in a future iteration.')}><Add size={17}/> 添加交易</button></div><div className="crm-deal-summary"><div><span>未结销售管道</span><strong>{money(totalPipeline)}</strong><small>共 {deals.filter(d=>d.stage!=='已成交').length} 个商机</small></div><div><span>已成交</span><strong>{money(deals.filter(d=>d.stage==='已成交').reduce((s,d)=>s+d.amount,0))}</strong><small>本季度</small></div><div><span>平均交易金额</span><strong>{money(Math.round(deals.reduce((s,d)=>s+d.amount,0)/deals.length))}</strong><small>All 个商机</small></div></div><div className="crm-board-intro"><div><strong>销售管道</strong><span>拖动卡片即可更新交易阶段。</span></div><button className="crm-secondary-button" onClick={()=>setNotice('Pipeline filters are not connected yet.')}><筛选 size={15}/> 筛选</button></div><div className="crm-kanban">{stages.map(stage=>{const list=deals.filter(d=>d.stage===stage);const sum=list.reduce((s,d)=>s+d.amount,0);return <div className="crm-kanban-column" key={stage} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(dragId)moveDeal(dragId,stage)}}><div className="crm-kanban-heading"><div><span className={`crm-stage-dot stage-${stages.indexOf(stage)}`}/><strong>{stageLabel(stage)}</strong><span className="crm-stage-count">{list.length}</span></div><button className="crm-icon-button" aria-label={`More actions for ${stage}`} onClick={()=>setNotice(`${stage} stage actions are a demo placeholder.`)}><More size={17}/></button></div><div className="crm-stage-total">{money(sum)}</div><div className="crm-deal-cards">{list.map(d=><article key={d.id} className={`crm-deal-card ${dragId===d.id?'is-dragging':''}`} draggable onDragStart={()=>setDragId(d.id)} onDragEnd={()=>setDragId(null)} tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowRight'){const i=stages.indexOf(d.stage);if(i<stages.length-1)moveDeal(d.id,stages[i+1])}if(e.key==='ArrowLeft'){const i=stages.indexOf(d.stage);if(i>0)moveDeal(d.id,stages[i-1])}}}><div className="crm-deal-card-top"><span className="crm-deal-company">{d.company}</span><button className="crm-row-more" aria-label={`操作：${d.name}`} onClick={e=>{e.stopPropagation();setNotice(`操作：${d.name} are a demo placeholder.`)}}><More size={16}/></button></div><strong className="crm-deal-name">{d.name}</strong><div className="crm-deal-amount">{money(d.amount)}</div><div className="crm-deal-card-footer"><span className="crm-deal-owner"><span className={`crm-avatar crm-avatar-small avatar-${d.color}`}>{d.initials}</span>{d.owner}</span><span className="crm-close-date"><Calendar size={13}/>{d.closeDate}</span></div></article>)}</div><button className="crm-add-card" onClick={()=>setNotice('Create a deal from the 添加交易 action.')}><Add size={15}/> 添加交易</button></div>})}</div><p className="crm-board-hint">提示：选中交易卡片后按 ← / → 可切换阶段。修改仅保存在当前浏览器会话。</p></section>}
        {page==='companies'&&<section><div className="crm-page-heading"><div><div className="crm-overline">客户管理</div><h1>公司</h1><p>与客户关系关联的组织。</p></div><button className="crm-primary-button" onClick={()=>setNotice('Company creation is not connected in this demo.')}><Add size={17}/> 添加公司</button></div><div className="crm-company-grid">{Array.from(new Map(contacts.map(c=>[c.company,c] as const)).values()).map(c=><button className="crm-company-card" key={c.company} onClick={()=>{setPage('contacts');setSelectedId(c.id)}}><div className={`crm-company-card-logo avatar-${c.color}`}>{c.company.slice(0,1)}</div><strong>{c.company}</strong><span>{c.role}</span><div><User size={14}/>{c.name}<ArrowRight size={15}/></div></button>)}</div></section>}
        {page==='foundation'&&<section><div className="crm-page-heading"><div><div className="crm-overline">PLATFORM</div><h1>平台状态</h1><p>The original Uranus-Cortex health dashboard remains available.</p></div></div><FoundationLink/></section>}
      </div>
      <footer className="crm-footer"><span>URANUS CORTEX <i/> CUSTOMER 工作空间</span><span>原型 · 仅使用本地模拟数据</span></footer>
    </main>
    {showAdd&&<div className="crm-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowAdd(false)}}><section className="crm-modal" role="dialog" aria-modal="true" aria-labelledby="crm-add-title"><div className="crm-modal-heading"><h2 id="crm-add-title">添加联系人</h2><button className="crm-icon-button" aria-label="Close dialog" onClick={()=>setShowAdd(false)}><Close size={18}/></button></div><p>这会在本地状态中创建一个示例联系人。</p><label>联系人姓名<input defaultValue="新联系人" /></label><label>Company<input defaultValue="新公司" /></label><div className="crm-modal-actions"><button className="crm-secondary-button" onClick={()=>setShowAdd(false)}>取消</button><button className="crm-primary-button" onClick={addContact}><Checkmark size={16}/> 创建联系人</button></div></section></div>}
  </div>;
}

function FoundationLink() {
  return <div className="crm-foundation-panel"><strong>Foundation health check</strong><p>To preserve the original dashboard implementation, its source is kept at <code>src/modules/platform/FoundationStatus.tsx</code>. The app-shell link will be connected in a follow-up once the module routing is formalized.</p></div>;
}
