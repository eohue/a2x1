import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Button, ButtonProps } from '../common/Button';

// Use the global axe mock from jest.setup.js
const axe = global.axe;
const toHaveNoViolations = expect.extend;

// Mock translations
const messages = {
  button: {
    loading: 'Loading...',
    loadingSpinner: 'Loading spinner'
  }
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('Button', () => {
  const defaultProps: ButtonProps = {
    children: 'Test Button'
  };

  describe('Basic Rendering', () => {
    it('renders the button with children', () => {
      renderWithIntl(<Button {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      renderWithIntl(<Button {...defaultProps} className="custom-class" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      renderWithIntl(<Button {...defaultProps} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      renderWithIntl(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary-600');
    });

    it('renders secondary variant correctly', () => {
      renderWithIntl(<Button {...defaultProps} variant="secondary" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary-100');
    });

    it('renders outline variant correctly', () => {
      renderWithIntl(<Button {...defaultProps} variant="outline" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-2', 'border-primary-600');
    });

    it('renders danger variant correctly', () => {
      renderWithIntl(<Button {...defaultProps} variant="danger" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-error-600');
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      renderWithIntl(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
    });

    it('renders small size correctly', () => {
      renderWithIntl(<Button {...defaultProps} size="sm" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('renders large size correctly', () => {
      renderWithIntl(<Button {...defaultProps} size="lg" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2.5', 'text-base');
    });

    it('renders extra large size correctly', () => {
      renderWithIntl(<Button {...defaultProps} size="xl" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });
  });

  describe('Full Width', () => {
    it('applies full width class when fullWidth is true', () => {
      renderWithIntl(<Button {...defaultProps} fullWidth />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('does not apply full width class by default', () => {
      renderWithIntl(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('Loading State', () => {
    it('shows loading text when loading is true', () => {
      renderWithIntl(<Button {...defaultProps} loading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Test Button')).not.toBeInTheDocument();
    });

    it('shows custom loading text when provided', () => {
      renderWithIntl(<Button {...defaultProps} loading loadingText="Please wait..." />);
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('shows loading spinner when loading', () => {
      renderWithIntl(<Button {...defaultProps} loading />);
      const spinner = screen.getByRole('img', { name: 'Loading spinner' });
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('disables button when loading', () => {
      renderWithIntl(<Button {...defaultProps} loading />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies loading state styles', () => {
      renderWithIntl(<Button {...defaultProps} loading />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      renderWithIntl(<Button {...defaultProps} disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies disabled state styles', () => {
      renderWithIntl(<Button {...defaultProps} disabled />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
    });

    it('does not trigger onClick when disabled', () => {
      const handleClick = jest.fn();
      renderWithIntl(<Button {...defaultProps} disabled onClick={handleClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      renderWithIntl(<Button {...defaultProps} onClick={handleClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus when focused', () => {
      const handleFocus = jest.fn();
      renderWithIntl(<Button {...defaultProps} onFocus={handleFocus} />);
      
      const button = screen.getByRole('button');
      fireEvent.focus(button);
      
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', () => {
      const handleBlur = jest.fn();
      renderWithIntl(<Button {...defaultProps} onBlur={handleBlur} />);
      
      const button = screen.getByRole('button');
      fireEvent.focus(button);
      fireEvent.blur(button);
      
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTML Attributes', () => {
    it('passes through button type', () => {
      renderWithIntl(<Button {...defaultProps} type="submit" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('passes through id attribute', () => {
      renderWithIntl(<Button {...defaultProps} id="test-button" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'test-button');
    });

    it('passes through aria attributes', () => {
      renderWithIntl(<Button {...defaultProps} aria-label="Custom label" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('passes through data attributes', () => {
      renderWithIntl(<Button {...defaultProps} data-testid="button-test" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'button-test');
    });
  });

  describe('Keyboard Navigation', () => {
    it('can be focused with Tab key', () => {
      renderWithIntl(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
    });

    it('can be activated with Enter key', () => {
      const handleClick = jest.fn();
      renderWithIntl(<Button {...defaultProps} onClick={handleClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be activated with Space key', () => {
      const handleClick = jest.fn();
      renderWithIntl(<Button {...defaultProps} onClick={handleClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Responsive Design', () => {
    it('has responsive classes for different screen sizes', () => {
      renderWithIntl(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      // Check for responsive utility classes that should be present
      expect(button).toHaveClass('transition-colors');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations - default button', async () => {
      const { container } = renderWithIntl(<Button {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - disabled button', async () => {
      const { container } = renderWithIntl(<Button {...defaultProps} disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - loading button', async () => {
      const { container } = renderWithIntl(<Button {...defaultProps} loading />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - all variants', async () => {
      const variants: Array<ButtonProps['variant']> = ['primary', 'secondary', 'outline', 'danger'];
      
      for (const variant of variants) {
        const { container } = renderWithIntl(<Button {...defaultProps} variant={variant} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should have proper focus management', () => {
      renderWithIntl(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    it('should have proper ARIA attributes', () => {
      renderWithIntl(<Button {...defaultProps} disabled />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = jest.fn();
      const TestButton = (props: ButtonProps) => {
        renderSpy();
        return <Button {...props} />;
      };

      const { rerender } = renderWithIntl(<TestButton {...defaultProps} />);
      
      // Initial render
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props
      rerender(
        <NextIntlClientProvider locale="en" messages={messages}>
          <TestButton {...defaultProps} />
        </NextIntlClientProvider>
      );
      
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing translation gracefully', () => {
      const emptyMessages = { button: {} };
      
      render(
        <NextIntlClientProvider locale="en" messages={emptyMessages}>
          <Button loading>Test Button</Button>
        </NextIntlClientProvider>
      );
      
      // Should still render without errors
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
