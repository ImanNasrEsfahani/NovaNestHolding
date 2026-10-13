import { render, screen } from '@testing-library/react';

import Navbar from '@/components/common/Navbar';

describe('Navbar', () => {
  it('links the logo to the English home page', () => {
    render(<Navbar lang="en" />);

    expect(screen.getByRole('link', { name: 'NovaNest Holding' })).toHaveAttribute('href', '/en');
  });

  it('links the logo to the Persian home page', () => {
    render(<Navbar lang="fa" />);

    expect(screen.getByRole('link', { name: 'NovaNest Holding' })).toHaveAttribute('href', '/fa');
  });

  it('renders the localized About us links', () => {
    render(<Navbar lang="en" />);

    const links = screen.getAllByRole('link', { name: 'About us' });

    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => expect(link).toHaveAttribute('href', '/en/about-us'));
  });
});
