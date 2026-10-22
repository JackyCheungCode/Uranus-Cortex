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
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Built to be reviewed' })).toBeInTheDocument();
  });
});
