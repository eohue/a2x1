import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Input, InputProps } from '../common/Input';

// Use the global axe mock from jest.setup.js
const axe = global.axe;

// Mock translations
const messages = {
  input: {
    required: 'required',
    placeholder: 'Enter text...'
  }
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('Input', () => {
  const defaultProps: Partial<InputProps> = {
    label: 'Test Input'
  };

  describe('Basic Rendering', () => {
    it('renders input with label', () => {
      renderWithIntl(<Input {...defaultProps} />);
      
      expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      renderWithIntl(<Input />);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.queryByText('Test Input')).not.toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      renderWithIntl(<Input {...defaultProps} ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('generates unique id when not provided', () => {
      renderWithIntl(<Input {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id');
      expect(input.id).toBeTruthy();
    });

    it('uses provided id', () => {
      renderWithIntl(<Input {...defaultProps} id="custom-id" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Input Types', () => {
    it('renders text input by default', () => {
      renderWithIntl(<Input {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders email input correctly', () => {
      renderWithIntl(<Input {...defaultProps} type="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders password input correctly', () => {
      renderWithIntl(<Input {...defaultProps} type="password" />);
      
      const input = screen.getByLabelText('Test Input'); // Password inputs don't have role="textbox"
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders number input correctly', () => {
      renderWithIntl(<Input {...defaultProps} type="number" />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      renderWithIntl(<Input {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-2', 'text-sm');
    });

    it('renders small size correctly', () => {
      renderWithIntl(<Input {...defaultProps} size="sm" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('renders large size correctly', () => {
      renderWithIntl(<Input {...defaultProps} size="lg" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-3', 'text-base');
    });
  });

  describe('States', () => {
    it('renders normal state by default', () => {
      renderWithIntl(<Input {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-gray-300', 'focus:border-primary-500');
    });

    it('renders error state correctly', () => {
      renderWithIntl(<Input {...defaultProps} error="Error message" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-error-300', 'focus:border-error-500', 'bg-error-50');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('renders success state correctly', () => {
      renderWithIntl(<Input {...defaultProps} success="Success message" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-success-300', 'focus:border-success-500', 'bg-success-50');
    });

    it('renders disabled state correctly', () => {
      renderWithIntl(<Input {...defaultProps} disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('bg-gray-50', 'border-gray-200', 'text-gray-500');
    });
  });

  describe('Messages', () => {
    it('displays error message', () => {
      renderWithIntl(<Input {...defaultProps} error="This field is required" />);
      
      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    });

    it('displays success message', () => {
      renderWithIntl(<Input {...defaultProps} success="Valid input" />);
      
      expect(screen.getByRole('status')).toHaveTextContent('Valid input');
    });

    it('displays helper text', () => {
      renderWithIntl(<Input {...defaultProps} helperText="Enter your full name" />);
      
      expect(screen.getByText('Enter your full name')).toBeInTheDocument();
    });

    it('prioritizes error over success message', () => {
      renderWithIntl(
        <Input {...defaultProps} error="Error message" success="Success message" />
      );
      
      expect(screen.getByRole('alert')).toHaveTextContent('Error message');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('hides helper text when error is shown', () => {
      renderWithIntl(
        <Input {...defaultProps} error="Error message" helperText="Helper text" />
      );
      
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Required Field', () => {
    it('shows required indicator by default when required', () => {
      renderWithIntl(<Input {...defaultProps} required />);
      
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('hides required indicator when showRequired is false', () => {
      renderWithIntl(<Input {...defaultProps} required showRequired={false} />);
      
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('does not show required indicator when not required', () => {
      renderWithIntl(<Input {...defaultProps} />);
      
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    const LeftIcon = () => <span data-testid="left-icon">📧</span>;
    const RightIcon = () => <span data-testid="right-icon">👁</span>;

    it('renders left icon correctly', () => {
      renderWithIntl(<Input {...defaultProps} iconLeft={<LeftIcon />} />);
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-10');
    });

    it('renders right icon correctly', () => {
      renderWithIntl(<Input {...defaultProps} iconRight={<RightIcon />} />);
      
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-10');
    });

    it('renders both icons correctly', () => {
      renderWithIntl(
        <Input {...defaultProps} iconLeft={<LeftIcon />} iconRight={<RightIcon />} />
      );
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-10', 'pr-10');
    });
  });

  describe('Label Options', () => {
    it('shows label by default', () => {
      renderWithIntl(<Input {...defaultProps} />);
      
      const label = screen.getByText('Test Input');
      expect(label).toBeVisible();
    });

    it('hides label visually when hideLabel is true', () => {
      renderWithIntl(<Input {...defaultProps} hideLabel />);
      
      const label = screen.getByText('Test Input');
      expect(label).toHaveClass('sr-only');
    });

    it('applies custom label classes', () => {
      renderWithIntl(<Input {...defaultProps} labelClassName="custom-label" />);
      
      const label = screen.getByText('Test Input');
      expect(label).toHaveClass('custom-label');
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', () => {
      const handleChange = jest.fn();
      renderWithIntl(<Input {...defaultProps} value="controlled" onChange={handleChange} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('controlled');
      
      fireEvent.change(input, { target: { value: 'new value' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('works as uncontrolled component', () => {
      renderWithIntl(<Input {...defaultProps} defaultValue="uncontrolled" />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('uncontrolled');
      
      fireEvent.change(input, { target: { value: 'new value' } });
      expect(input.value).toBe('new value');
    });
  });

  describe('Validation', () => {
    const mockValidate = jest.fn();

    beforeEach(() => {
      mockValidate.mockClear();
    });

    it('runs validation on blur when validateOnBlur is true', () => {
      mockValidate.mockReturnValue('Validation error');
      
      renderWithIntl(
        <Input {...defaultProps} validate={mockValidate} validateOnBlur />
      );
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.blur(input);
      
      expect(mockValidate).toHaveBeenCalledWith('test');
      expect(screen.getByRole('alert')).toHaveTextContent('Validation error');
    });

    it('runs validation on change after touch when validateOnChange is true', () => {
      mockValidate.mockReturnValue('Validation error');
      
      renderWithIntl(
        <Input {...defaultProps} validate={mockValidate} validateOnChange />
      );
      
      const input = screen.getByRole('textbox');
      
      // First, input needs to be touched (blurred)
      fireEvent.change(input, { target: { value: 'test1' } });
      fireEvent.blur(input);
      
      // Then validation should run on subsequent changes
      fireEvent.change(input, { target: { value: 'test2' } });
      
      expect(mockValidate).toHaveBeenCalledWith('test2');
    });

    it('does not run validation before touch', () => {
      mockValidate.mockReturnValue('Validation error');
      
      renderWithIntl(
        <Input {...defaultProps} validate={mockValidate} validateOnChange />
      );
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(mockValidate).not.toHaveBeenCalled();
    });

    it('clears validation error when valid', () => {
      mockValidate.mockReturnValueOnce('Validation error').mockReturnValueOnce(null);
      
      renderWithIntl(
        <Input {...defaultProps} validate={mockValidate} validateOnBlur />
      );
      
      const input = screen.getByRole('textbox');
      
      // Trigger error
      fireEvent.change(input, { target: { value: 'invalid' } });
      fireEvent.blur(input);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      
      // Clear error
      fireEvent.change(input, { target: { value: 'valid' } });
      fireEvent.blur(input);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('calls onChange when input changes', () => {
      const handleChange = jest.fn();
      renderWithIntl(<Input {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when input loses focus', () => {
      const handleBlur = jest.fn();
      renderWithIntl(<Input {...defaultProps} onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      fireEvent.blur(input);
      
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus when input gains focus', () => {
      const handleFocus = jest.fn();
      renderWithIntl(<Input {...defaultProps} onFocus={handleFocus} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe('Placeholder', () => {
    it('uses provided placeholder', () => {
      renderWithIntl(<Input {...defaultProps} placeholder="Custom placeholder" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Custom placeholder');
    });

    it('uses translated placeholder when no placeholder provided', () => {
      renderWithIntl(<Input {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Enter text...');
    });
  });

  describe('Custom Classes', () => {
    it('applies custom container classes', () => {
      renderWithIntl(<Input {...defaultProps} className="custom-container" />);
      
      const container = screen.getByRole('textbox').closest('.relative');
      expect(container).toHaveClass('custom-container');
    });

    it('applies custom input classes', () => {
      renderWithIntl(<Input {...defaultProps} inputClassName="custom-input" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations - basic input', async () => {
      const { container } = renderWithIntl(<Input {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with error', async () => {
      const { container } = renderWithIntl(
        <Input {...defaultProps} error="Error message" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with success', async () => {
      const { container } = renderWithIntl(
        <Input {...defaultProps} success="Success message" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - disabled', async () => {
      const { container } = renderWithIntl(<Input {...defaultProps} disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with icons', async () => {
      const { container } = renderWithIntl(
        <Input 
          {...defaultProps} 
          iconLeft={<span>📧</span>} 
          iconRight={<span>👁</span>} 
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper label association', () => {
      renderWithIntl(<Input {...defaultProps} id="test-input" />);
      
      const label = screen.getByText('Test Input');
      const input = screen.getByRole('textbox');
      
      expect(label).toHaveAttribute('for', 'test-input');
      expect(input).toHaveAttribute('id', 'test-input');
    });

    it('has proper aria-describedby associations', () => {
      renderWithIntl(
        <Input 
          {...defaultProps} 
          id="test-input"
          error="Error message"
          helperText="Helper text"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
    });

    it('has proper aria-invalid when error exists', () => {
      renderWithIntl(<Input {...defaultProps} error="Error message" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('has proper role and aria-live for messages', () => {
      renderWithIntl(
        <Input 
          {...defaultProps} 
          error="Error message" 
          success="Success message"
        />
      );
      
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('supports keyboard navigation', () => {
      renderWithIntl(<Input {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      
      input.focus();
      expect(input).toHaveFocus();
      
      fireEvent.keyDown(input, { key: 'Tab' });
      // Input should still have focus until Tab moves to next element
      expect(input).toHaveFocus();
    });
  });

  describe('Responsive Design', () => {
    it('has responsive design classes', () => {
      renderWithIntl(<Input {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('transition-colors', 'duration-200');
    });
  });

  describe('Error Handling', () => {
    it('handles missing translations gracefully', () => {
      const emptyMessages = { input: {} };
      
      render(
        <NextIntlClientProvider locale="en" messages={emptyMessages}>
          <Input {...defaultProps} />
        </NextIntlClientProvider>
      );
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('handles validation function that throws', () => {
      const throwingValidate = () => {
        throw new Error('Validation failed');
      };
      
      renderWithIntl(
        <Input {...defaultProps} validate={throwingValidate} validateOnBlur />
      );
      
      const input = screen.getByRole('textbox');
      
      expect(() => {
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.blur(input);
      }).not.toThrow();
    });
  });
});
