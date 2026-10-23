import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('Carbon application shell', () => {
  it('renders a Chinese single-purpose discovery workspace', () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: '潜客发现渠道' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '搜索引擎发现' })).toBeInTheDocument();
    expect(screen.getByText(/不會调用真实搜索服务|不会调用真实搜索服务/)).toBeInTheDocument();
  });

  it('switches between secondary discovery channels', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: '企业黄页' }));
    expect(screen.getByRole('heading', { name: '企业黄页发现' })).toBeInTheDocument();
    expect(screen.getByText(/该渠道尚未接入/)).toBeInTheDocument();
  });

  it('updates the structured query preview', () => {
    render(<App />);
    expect(screen.getByLabelText('核心关键词')).toHaveValue('二手服装 进口商');
    fireEvent.change(screen.getByLabelText('核心关键词'), { target: { value: '服装批发商' } });
    expect(screen.getByText(/服装批发商/)).toBeInTheDocument();
  });
});
