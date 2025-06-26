import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { LanguageSwitcher, LanguageSwitcherDropdown, LanguageSwitcherPills } from './LanguageSwitcher';

// Mock next/navigation
const mockRouter = {
  push: () => {},
  replace: () => {},
};

const mockPathname = '/en/example';

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
}));

jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useLocale: () => 'en',
}));

const messages = {
  common: {
    language: 'Language'
  }
};

// Wrapper component to provide i18n context
const I18nWrapper = ({ children }: { children: React.ReactNode }) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <div className="p-4">
      {children}
    </div>
  </NextIntlClientProvider>
);

export default {
  title: 'Common/LanguageSwitcher',
  component: LanguageSwitcher,
  decorators: [
    (Story) => (
      <I18nWrapper>
        <Story />
      </I18nWrapper>
    ),
  ],
  args: {
    mode: 'dropdown',
    showFlags: true,
    showCodesOnly: false,
  },
  argTypes: {
    mode: {
      control: {
        type: 'select',
      },
      options: ['dropdown', 'pills'],
      description: 'Display mode for the language switcher',
    },
    showFlags: {
      control: {
        type: 'boolean',
      },
      description: 'Show flag emojis alongside language names',
    },
    showCodesOnly: {
      control: {
        type: 'boolean',
      },
      description: 'Show only language codes (e.g., EN, KO) instead of full names',
    },
    className: {
      control: {
        type: 'text',
      },
      description: 'Custom CSS classes to apply',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
The LanguageSwitcher component provides internationalization support with two display modes:
- **Dropdown mode**: Shows current language with a dropdown for selection
- **Pills mode**: Shows all languages as pill buttons

Features:
- Accessible keyboard navigation
- Loading states during language transitions
- Persistent locale selection (localStorage + cookies)
- Customizable display options (flags, codes)
- Responsive design
- Full internationalization support
        `,
      },
    },
  },
} as Meta<typeof LanguageSwitcher>;

export const Default: StoryObj<typeof LanguageSwitcher> = {};

export const Dropdown: StoryObj<typeof LanguageSwitcher> = {
  args: {
    mode: 'dropdown',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default dropdown mode showing current language with expandable options.',
      },
    },
  },
};

export const Pills: StoryObj<typeof LanguageSwitcher> = {
  args: {
    mode: 'pills',
  },
  parameters: {
    docs: {
      description: {
        story: 'Pills mode showing all languages as individual buttons.',
      },
    },
  },
};

export const WithoutFlags: StoryObj<typeof LanguageSwitcher> = {
  args: {
    showFlags: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Language switcher without flag emojis.',
      },
    },
  },
};

export const CodesOnly: StoryObj<typeof LanguageSwitcher> = {
  args: {
    showCodesOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact view showing only language codes (EN, KO).',
      },
    },
  },
};

export const CodesOnlyWithoutFlags: StoryObj<typeof LanguageSwitcher> = {
  args: {
    showCodesOnly: true,
    showFlags: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Most compact view with only language codes and no flags.',
      },
    },
  },
};

export const PillsWithoutFlags: StoryObj<typeof LanguageSwitcher> = {
  args: {
    mode: 'pills',
    showFlags: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pills mode without flag emojis for a cleaner look.',
      },
    },
  },
};

export const PillsCodesOnly: StoryObj<typeof LanguageSwitcher> = {
  args: {
    mode: 'pills',
    showCodesOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pills mode with language codes only.',
      },
    },
  },
};

export const CustomStyles: StoryObj<typeof LanguageSwitcher> = {
  args: {
    className: 'bg-gray-100 p-2 rounded-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Language switcher with custom styling applied.',
      },
    },
  },
};

// Convenience component stories
export const DropdownConvenience: StoryObj<typeof LanguageSwitcherDropdown> = {
  render: (args) => <LanguageSwitcherDropdown {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Using the convenience LanguageSwitcherDropdown component.',
      },
    },
  },
};

export const PillsConvenience: StoryObj<typeof LanguageSwitcherPills> = {
  render: (args) => <LanguageSwitcherPills {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Using the convenience LanguageSwitcherPills component.',
      },
    },
  },
};

// Responsive demonstration
export const ResponsiveDemo: StoryObj<typeof LanguageSwitcher> = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Desktop Dropdown</h3>
        <div className="hidden lg:block">
          <LanguageSwitcher mode="dropdown" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Mobile Pills</h3>
        <div className="lg:hidden">
          <LanguageSwitcher mode="pills" showCodesOnly />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of responsive usage - dropdown for desktop, pills for mobile.',
      },
    },
  },
};

// Accessibility demonstration
export const AccessibilityFeatures: StoryObj<typeof LanguageSwitcher> = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Keyboard Navigation</h3>
        <p className="text-sm text-gray-600 mb-2">
          Use Tab to focus, Enter/Space to activate, Arrow keys to navigate options
        </p>
        <LanguageSwitcher />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Screen Reader Friendly</h3>
        <p className="text-sm text-gray-600 mb-2">
          Proper ARIA labels, roles, and live regions for assistive technology
        </p>
        <LanguageSwitcher mode="pills" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including keyboard navigation and screen reader support.',
      },
    },
  },
};
