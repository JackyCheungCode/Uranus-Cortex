import {
  ArrowRight,
  CheckmarkFilled,
  Globe,
  Search,
  UserMultiple,
} from '@carbon/icons-react';
import {
  Button,
  Checkbox,
  Column,
  Grid,
  InlineNotification,
  Link,
  PasswordInput,
  Stack,
  Tag,
  TextInput,
  Theme,
} from '@carbon/react';
import { useState, type FormEvent } from 'react';

type LoginPageProps = {
  onLogin: () => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [notice, setNotice] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Prototype only: deliberately bypass authentication and accept any input.
    onLogin();
  };

  const showPrototypeNotice = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setNotice('此功能尚未接入。当前版本仅演示登录界面，不会验证或保存账户信息。');
  };

  return (
    <main className="login-page" aria-labelledby="login-title">
      <Theme theme="g100">
        <section className="login-brand" aria-label="Uranus-Cortex 产品介绍">
          <a className="login-brand__wordmark" href="#login-title" aria-label="Uranus-Cortex 首页">
            <span className="login-brand__mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>Uranus-Cortex</span>
          </a>

          <div className="login-brand__content">
            <Tag type="blue">潜客发现工作台</Tag>
            <h1>把全球市场洞察，转化为下一步行动。</h1>
            <p className="login-brand__description">
              在一个工作区中发现潜在买家、整理企业证据，并规划后续跟进。
            </p>

            <div className="login-capabilities" aria-label="工作台核心能力">
              <div className="login-capability">
                <span className="login-capability__icon"><Search size={20} /></span>
                <div>
                  <h2>多渠道潜客发现</h2>
                  <p>集中整理搜索、企业目录与导入名单。</p>
                </div>
              </div>
              <div className="login-capability">
                <span className="login-capability__icon"><Globe size={20} /></span>
                <div>
                  <h2>证据驱动的研究</h2>
                  <p>区分可追溯证据、置信度与未知信息。</p>
                </div>
              </div>
              <div className="login-capability">
                <span className="login-capability__icon"><UserMultiple size={20} /></span>
                <div>
                  <h2>面向行动的跟进</h2>
                  <p>把研究发现整理成清晰的下一步任务。</p>
                </div>
              </div>
            </div>
          </div>

          <div className="login-brand__footer">
            <span>Uranus-Cortex</span>
            <span>外贸潜客发现与研究工作区</span>
          </div>
        </section>
      </Theme>

      <section className="login-panel" aria-label="登录表单">
        <div className="login-panel__inner">
          <div className="login-panel__mobile-brand">
            <span className="login-brand__mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>Uranus-Cortex</span>
          </div>

          <div className="login-panel__heading">
            <p className="login-eyebrow">欢迎回来</p>
            <h2 id="login-title">登录工作区</h2>
            <p>输入任意内容即可进入当前原型。</p>
          </div>

          {notice && (
            <InlineNotification
              kind="info"
              lowContrast
              title="原型功能提示"
              subtitle={notice}
              onCloseButtonClick={() => setNotice('')}
              className="login-notice"
            />
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <Stack gap={5}>
              <TextInput
                id="login-account"
                labelText="工作邮箱或用户名"
                autoComplete="username"
                value={account}
                onChange={(event) => setAccount(event.currentTarget.value)}
                placeholder="请输入工作邮箱或用户名"
              />
              <PasswordInput
                id="login-password"
                labelText="密码"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                placeholder="请输入密码"
              />
              <div className="login-form__options">
                <Checkbox
                  id="login-remember"
                  labelText="记住我"
                  checked={rememberMe}
                  onChange={(_, data) => setRememberMe(data.checked)}
                />
                <Link href="#forgot-password" onClick={showPrototypeNotice}>忘记密码？</Link>
              </div>
              <Button type="submit" className="login-submit" renderIcon={ArrowRight}>
                登录
              </Button>
            </Stack>
          </form>

          <div className="login-divider" aria-hidden="true"><span>或</span></div>
          <Button kind="tertiary" className="login-sso" onClick={() => setNotice('单点登录（SSO）尚未接入；此页面不会连接身份提供商。')}>
            使用企业单点登录
          </Button>

          <p className="login-register">
            还没有工作区？ <Link href="#register" onClick={showPrototypeNotice}>联系管理员开通</Link>
          </p>

          <div className="login-prototype-note">
            <CheckmarkFilled size={16} aria-hidden="true" />
            <p>开发原型模式：登录按钮不会验证身份，任意输入或留空均可继续。请勿输入真实密码。</p>
          </div>

          <footer className="login-panel__footer">
            <span>© Uranus-Cortex</span>
            <span>开发原型 · 未启用身份验证</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
