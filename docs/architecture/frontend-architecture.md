# 前端架构与模块边界

- 状态：前端阶段架构基线
- 技术栈：React + TypeScript + Vite + IBM Carbon
- 范围：前端应用组织、模块依赖和未来服务集成边界
- 后端、数据库、认证和生产拓扑仍须依据单独确认的需求决定

## 1. 目标

- 让业务模块可独立理解、测试和演进。
- 让全局应用框架、通用 UI 和领域业务职责分离。
- 第一阶段可用 Mock 独立演示，不依赖真实后端。
- 未来接入真实服务时，尽量替换服务实现而不是重写页面。

## 2. 建议目录

```text
src/
├── app/                 # 入口、路由、全局 Provider
├── shell/               # Header、导航、全局布局
├── modules/
│   ├── dashboard/
│   ├── discovery/       # 买家搜索与发现
│   ├── buyers/          # 买家档案
│   ├── crm/             # 客户关系管理
│   ├── integrations/    # 服务商/API 配置界面
│   └── settings/
├── components/          # 跨模块、领域无关的复用组件
├── design-system/       # 经审查的 Carbon 组合/主题入口
├── services/            # 全局服务契约和 Mock 实现
├── hooks/               # 通用 Hooks
├── types/               # 跨模块类型
├── utils/               # 通用纯函数
└── styles/              # 全局样式入口
```

不是每个模块都必须创建所有子目录。只有在职责、复杂度或测试需求支持时才拆分。

## 3. 模块内部

```text
modules/<module>/
├── pages/
├── components/
├── hooks/
├── services/
├── types/
├── utils/
├── __tests__/
└── index.ts
```

- `pages/`：路由页面和页面级组合。
- `components/`：仅此模块使用的 UI。
- `hooks/`：模块状态与可复用交互逻辑。
- `services/`：该领域的数据访问契约及 Mock 实现。
- `types/`：领域实体、输入输出、筛选条件和状态类型。
- `utils/`：模块内部纯函数。
- `index.ts`：模块对外公开的最小 API。

## 4. 依赖规则

1. `app` 装配路由和全局 Provider，不承载业务规则。
2. `shell` 管理导航和应用布局，不直接处理买家搜索或 CRM 业务。
3. 一个模块不能直接导入另一个模块的内部文件；只能使用对方的公开入口。
4. `components/` 只放真正跨模块、领域无关的组件；业务组件留在所属模块。
5. 领域类型默认属于领域模块；只有共享契约才上移至全局 `types/`。
6. 业务规则放在 Hooks、服务或纯函数中，不全部放在页面 JSX。
7. 避免循环依赖。共享代码不应反向依赖业务模块。
8. 不为“架构看起来整齐”而创建空目录或过度抽象。

## 5. 数据访问与 Mock

页面通过类型化服务契约读取数据；不直接导入 fixtures。服务接口表达用户任务，不暴露供应商 SDK 细节。

示例：

```ts
export interface BuyerSearchService {
  search(query: BuyerSearchQuery): Promise<BuyerSearchResult>;
}
```

第一阶段使用 Mock 实现同一契约。Mock fixtures 必须明确标注为示例数据，并可覆盖空结果、延迟、部分失败和错误状态。未来接入真实服务时，通过统一装配点替换实现。

真实网络请求、身份认证、密钥存储、数据库和生产部署不在前端阶段默认范围内，必须另行确认与审查。

## 6. 路由和全局状态

- 路由以业务模块为边界，路由名称和页面职责保持稳定。
- 局部 UI 状态优先留在组件/模块内；只有确实需要跨页面共享的状态才提升到全局。
- 不在全局状态中复制可以从 URL 或服务结果推导的数据。
- 查询条件若需分享、刷新恢复或导航回退，应明确哪些字段进入 URL，避免把敏感信息放入 URL。
- 任何新增状态管理库都要说明现有 React 能力为何不足。

## 7. 质量门禁

- TypeScript strict、Lint、测试和生产构建。
- 模块公开 API 与依赖边界审查。
- 关键交互与错误/空/加载状态测试。
- 重要页面进行响应式与键盘操作检查。
- 例外按 `docs/design/carbon-standards.md` 记录并人工审查。

## 8. 与产品方案的关系

本文件定义前端架构边界，不替代产品需求。搜索与买家发现的业务规则以 `docs/product/search-and-buyer-discovery.md` 为准；如需求与架构冲突，应先更新决策文档，不应在实现中暗自假设。
