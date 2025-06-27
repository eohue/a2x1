import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { Input, InputProps } from './Input';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const messages = {
  input: {
    required: 'required',
    placeholder: 'Enter text...'
  }
};

// Wrapper component to provide i18n context
const I18nWrapper = ({ children }: { children: React.ReactNode }) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <div className="p-4 max-w-md">
      {children}
    </div>
  </NextIntlClientProvider>
);

export default {
  title: 'Common/Input',
  component: Input,
  decorators: [
    (Story) => (
      <I18nWrapper>
        <Story />
      </I18nWrapper>
    ),
  ],
  args: {
    label: 'Input Label',
    placeholder: 'Enter text...',
    type: 'text',
    size: 'md',
    required: false,
    disabled: false,
    hideLabel: false,
    showRequired: true,
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
      },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'md', 'lg'],
    },
    error: {
      control: {
        type: 'text',
      },
    },
    success: {
      control: {
        type: 'text',
      },
    },
    helperText: {
      control: {
        type: 'text',
      },
    },
    required: {
      control: {
        type: 'boolean',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    hideLabel: {
      control: {
        type: 'boolean',
      },
    },
    showRequired: {
      control: {
        type: 'boolean',
      },
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
  },
  parameters: {
    docs: {
      description: {
        component: `
The Input component is a flexible, accessible form input with support for:
- Multiple input types (text, email, password, number, etc.)
- Validation states (error, success)
- Various sizes and styling options
- Icons (left and right)
- Helper text and error messages
- Full accessibility support
- Custom validation functions
- Controlled and uncontrolled modes
        `,
      },
    },
  },
} as Meta<InputProps>;

export const Default: StoryObj<InputProps> = {};

export const WithPlaceholder: StoryObj<InputProps> = {
  args: {
    placeholder: 'Enter your name...',
  },
};

export const Required: StoryObj<InputProps> = {
  args: {
    required: true,
  },
};

export const WithHelperText: StoryObj<InputProps> = {
  args: {
    helperText: 'This is some helpful information about the input.',
  },
};

export const ErrorState: StoryObj<InputProps> = {
  args: {
    error: 'This field is required',
    value: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input in error state with error message displayed below.',
      },
    },
  },
};

export const SuccessState: StoryObj<InputProps> = {
  args: {
    success: 'Looks good!',
    value: 'john.doe@example.com',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input in success state with success message displayed below.',
      },
    },
  },
};

export const Disabled: StoryObj<InputProps> = {
  args: {
    disabled: true,
    value: 'Disabled input',
  },
};

export const HiddenLabel: StoryObj<InputProps> = {
  args: {
    hideLabel: true,
    placeholder: 'Search...',
    'aria-label': 'Search',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with visually hidden label, useful for search boxes and compact forms.',
      },
    },
  },
};

// Size variations
export const SmallSize: StoryObj<InputProps> = {
  args: {
    size: 'sm',
    label: 'Small Input',
  },
};

export const LargeSize: StoryObj<InputProps> = {
  args: {
    size: 'lg',
    label: 'Large Input',
  },
};

// Type variations
export const EmailInput: StoryObj<InputProps> = {
  args: {
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
  },
};

export const PasswordInput: StoryObj<InputProps> = {
  args: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
  },
};

export const NumberInput: StoryObj<InputProps> = {
  args: {
    type: 'number',
    label: 'Age',
    placeholder: '25',
  },
};

export const SearchInput: StoryObj<InputProps> = {
  args: {
    type: 'search',
    label: 'Search',
    placeholder: 'Search products...',
  },
};

// Icon examples
export const WithLeftIcon: StoryObj<InputProps> = {
  args: {
    label: 'Email Address',
    type: 'email',
    iconLeft: <EnvelopeIcon className="h-5 w-5" />,
    placeholder: 'your@email.com',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with an icon on the left side.',
      },
    },
  },
};

export const WithRightIcon: StoryObj<InputProps> = {
  args: {
    label: 'Search',
    type: 'search',
    iconRight: <MagnifyingGlassIcon className="h-5 w-5" />,
    placeholder: 'Search...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with an icon on the right side.',
      },
    },
  },
};

export const WithBothIcons: StoryObj<InputProps> = {
  args: {
    label: 'Search Email',
    type: 'email',
    iconLeft: <EnvelopeIcon className="h-5 w-5" />,
    iconRight: <MagnifyingGlassIcon className="h-5 w-5" />,
    placeholder: 'Search emails...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with icons on both sides.',
      },
    },
  },
};

// Password with toggle visibility
export const PasswordWithToggle: StoryObj<InputProps> = {
  render: (args) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    return (
      <Input
        {...args}
        type={showPassword ? 'text' : 'password'}
        iconRight={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        }
      />
    );
  },
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input with toggle visibility functionality.',
      },
    },
  },
};

// Validation example
export const WithValidation: StoryObj<InputProps> = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    
    const validateEmail = (email: string) => {
      if (!email) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address';
      return null;
    };
    
    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        validate={validateEmail}
        validateOnBlur
        validateOnChange
      />
    );
  },
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'your@email.com',
    iconLeft: <EnvelopeIcon className="h-5 w-5" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with custom validation that runs on blur and change events.',
      },
    },
  },
};

// Form example
export const FormExample: StoryObj<InputProps> = {
  render: () => (
    <form className="space-y-4">
      <Input
        label="First Name"
        required
        placeholder="John"
      />
      <Input
        label="Last Name"
        required
        placeholder="Doe"
      />
      <Input
        label="Email Address"
        type="email"
        required
        placeholder="john.doe@example.com"
        iconLeft={<EnvelopeIcon className="h-5 w-5" />}
      />
      <Input
        label="Password"
        type="password"
        required
        helperText="Must be at least 8 characters long"
        placeholder="Enter your password"
      />
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple inputs used in a form layout.',
      },
    },
  },
};

// Different states showcase
export const AllStates: StoryObj<InputProps> = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Normal State</h3>
        <Input label="Normal Input" placeholder="Enter text..." />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Error State</h3>
        <Input 
          label="Input with Error" 
          error="This field is required" 
          value=""
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Success State</h3>
        <Input 
          label="Input with Success" 
          success="Looks good!" 
          value="Valid input"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Disabled State</h3>
        <Input 
          label="Disabled Input" 
          disabled 
          value="Disabled value"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">With Helper Text</h3>
        <Input 
          label="Input with Helper" 
          helperText="This is some helpful information"
          placeholder="Enter text..."
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all different input states and variations.',
      },
    },
  },
};

// Accessibility demonstration
export const AccessibilityFeatures: StoryObj<InputProps> = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Required Field</h3>
        <Input 
          label="Required Field" 
          required 
          placeholder="This field is required"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">With Error Message</h3>
        <Input 
          label="Field with Error" 
          error="Please provide a valid value"
          aria-describedby="custom-error"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Custom ARIA Labels</h3>
        <Input 
          label="Search Products" 
          hideLabel
          placeholder="Search..."
          aria-label="Search products"
          role="searchbox"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including ARIA attributes, screen reader support, and keyboard navigation.',
      },
    },
  },
};
