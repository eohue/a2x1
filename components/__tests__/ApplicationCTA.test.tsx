import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ApplicationCTA } from '../ApplicationCTA';

// Mock translations
const messages = {
  cta: {
    title: 'Ready to Join Our Community?',
    subtitle: 'Take the first step towards better living. Apply for social housing and become part of a vibrant, supportive community.',
    button: 'Apply for Housing'
  }
};

// Mock scroll behavior
const mockScrollIntoView = jest.fn();
const mockFocus = jest.fn();

beforeEach(() => {
  Element.prototype.scrollIntoView = mockScrollIntoView;
  Element.prototype.focus = mockFocus;
});

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('ApplicationCTA', () => {
  beforeEach(() => {
    mockScrollIntoView.mockClear();
    mockFocus.mockClear();
  });

  it('renders the CTA component with translated content', () => {
    renderWithIntl(<ApplicationCTA />);

    expect(screen.getByText('Ready to Join Our Community?')).toBeInTheDocument();
    expect(screen.getByText(/Take the first step towards better living/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply for Housing' })).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithIntl(<ApplicationCTA />);

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-label', 'Ready to Join Our Community?');

    const button = screen.getByRole('button', { name: 'Apply for Housing' });
    expect(button).toHaveAttribute('aria-describedby', 'cta-description');
  });

  it('scrolls to application section when button is clicked', () => {
    // Mock getElementById to return a mock element
    const mockElement = document.createElement('div');
    mockElement.id = 'application';
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    renderWithIntl(<ApplicationCTA />);

    const button = screen.getByRole('button', { name: 'Apply for Housing' });
    fireEvent.click(button);

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
    expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('handles missing application section gracefully', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    renderWithIntl(<ApplicationCTA />);

    const button = screen.getByRole('button', { name: 'Apply for Housing' });
    
    // Should not throw an error
    expect(() => fireEvent.click(button)).not.toThrow();
    expect(mockScrollIntoView).not.toHaveBeenCalled();
    expect(mockFocus).not.toHaveBeenCalled();
  });

  it('has responsive design classes', () => {
    renderWithIntl(<ApplicationCTA />);

    const section = screen.getByRole('region');
    expect(section).toHaveClass('py-16', 'sm:py-20', 'lg:py-24');

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'lg:text-5xl');
  });

  it('includes decorative elements that are hidden from screen readers', () => {
    renderWithIntl(<ApplicationCTA />);

    const decorativeElements = screen.getAllByText('', { 
      selector: '[aria-hidden="true"]' 
    });
    
    expect(decorativeElements.length).toBeGreaterThan(0);
  });
});
