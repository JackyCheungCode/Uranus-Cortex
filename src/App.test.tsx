import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App shell', () => {
  it('renders the application navigation and dashboard', () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Find the right buyers.' })).toBeInTheDocument();
    expect(screen.getByText(/Mock data only/)).toBeInTheDocument();
  });

  it('navigates to the interactive buyer discovery prototype', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Buyer discovery' }));
    expect(screen.getByRole('heading', { name: 'Buyer discovery' })).toBeInTheDocument();
    expect(screen.getByLabelText('Core keywords')).toHaveValue('used clothing importer');
  });

  it('shows a clear placeholder for future modules', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'API providers' }));
    expect(screen.getByRole('heading', { name: 'API providers' })).toBeInTheDocument();
    expect(screen.getByText(/No real services, credentials, or production data are connected/)).toBeInTheDocument();
  });
});
