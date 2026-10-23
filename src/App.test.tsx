import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

function enterWorkspace() {
  fireEvent.click(screen.getByRole('button', { name: /登录/ }));
}

describe('Carbon mock login', () => {
  it('shows the Chinese login page and accepts any input without authentication', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '登录工作区' })).toBeInTheDocument();
    expect(screen.getByLabelText('工作邮箱或用户名')).toHaveValue('');
    expect(screen.getByLabelText('密码')).toHaveValue('');

    fireEvent.change(screen.getByLabelText('工作邮箱或用户名'), { target: { value: '任意用户名' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '任意内容' } });
    enterWorkspace();

    expect(screen.getByRole('navigation', { name: '潜客发现渠道' })).toBeInTheDocument();
  });

  it('allows entering the prototype with both fields empty', () => {
    render(<App />);
    enterWorkspace();
    expect(screen.getByRole('heading', { name: '搜索引擎发现' })).toBeInTheDocument();
  });
});

describe('Carbon application shell', () => {
  it('renders a Chinese single-purpose discovery workspace', () => {
    render(<App />);
    enterWorkspace();
    expect(screen.getByRole('navigation', { name: '潜客发现渠道' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '搜索引擎发现' })).toBeInTheDocument();
    expect(screen.getByText(/不會调用真实搜索服务|不会调用真实搜索服务/)).toBeInTheDocument();
  });

  it('switches between secondary discovery channels', () => {
    render(<App />);
    enterWorkspace();
    fireEvent.click(screen.getByRole('link', { name: '企业黄页' }));
    expect(screen.getByRole('heading', { name: '企业黄页发现' })).toBeInTheDocument();
    expect(screen.getByText(/该渠道尚未接入/)).toBeInTheDocument();
  });

  it('updates the structured query preview', () => {
    render(<App />);
    enterWorkspace();
    expect(screen.getByLabelText('核心关键词')).toHaveValue('二手服装 进口商');
    fireEvent.change(screen.getByLabelText('核心关键词'), { target: { value: '服装批发商' } });
    expect(screen.getByText(/服装批发商/)).toBeInTheDocument();
  });
});
