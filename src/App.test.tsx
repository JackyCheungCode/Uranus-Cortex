import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the product heading and foundation status', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Uranus Cortex', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Foundation status', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Carbon-first component policy documented')).toBeInTheDocument();
  });

  it('provides semantic main content and a review note', () => {
    const { container } = render(<App />);
    expect(container.querySelector('main.app-shell[aria-label="Uranus Cortex application"]')).toBeInTheDocument();
    expect(container.querySelector('.next-steps h2')?.textContent).toBe('Built to be reviewed');
  });
});
