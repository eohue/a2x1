import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { LanguageSwitcher, LanguageSwitcherDropdown, LanguageSwitcherPills } from '../common/LanguageSwitcher';

// Use the global axe mock from jest.setup.js
const axe = global.axe;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock next-intl hooks
jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useLocale: () => 'en',
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

const mockPush = jest.fn();
const mockReplace = jest.fn();

// Mock translations
const messages = {
  common: {
    language: 'Language'
  }
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (usePathname as jest.Mock).mockReturnValue('/en/test');
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  describe('Dropdown Mode (Default)', () => {
    it('renders dropdown by default', () => {
      renderWithIntl(<LanguageSwitcher />);
      
      expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
      expect(screen.getByText('🇺🇸 English')).toBeInTheDocument();
    });

    it('opens dropdown when clicked', () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /한국어/ })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /English/ })).toBeInTheDocument();
    });

    it('closes dropdown when backdrop is clicked', () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      const backdrop = document.querySelector('.fixed.inset-0.z-40');
      expect(backdrop).toBeInTheDocument();
      
      fireEvent.click(backdrop!);
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('changes locale when option is selected', async () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      const koreanOption = screen.getByRole('option', { name: /한국어/ });
      fireEvent.click(koreanOption);
      
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/ko/test');
      });
    });

    it('persists locale selection to localStorage and cookie', async () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      const koreanOption = screen.getByRole('option', { name: /한국어/ });
      fireEvent.click(koreanOption);
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('preferred-locale', 'ko');
        expect(document.cookie).toContain('preferred-locale=ko');
      });
    });

    it('shows loading state when transitioning', () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      const koreanOption = screen.getByRole('option', { name: /한국어/ });
      fireEvent.click(koreanOption);
      
      // Should show loading/pulse animation
      expect(screen.getByText('🇰🇷 한국어').closest('span')).toHaveClass('animate-pulse');
    });
  });

  describe('Pills Mode', () => {
    it('renders pills mode correctly', () => {
      renderWithIntl(<LanguageSwitcher mode="pills" />);
      
      expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('shows active state for current locale', () => {
      renderWithIntl(<LanguageSwitcher mode="pills" />);
      
      const englishButton = screen.getByRole('button', { pressed: true });
      expect(englishButton).toHaveClass('ring-2', 'ring-primary-500');
    });

    it('changes locale when pill is clicked', async () => {
      renderWithIntl(<LanguageSwitcher mode="pills" />);
      
      const koreanButton = screen.getByRole('button', { name: /Language.*한국어/ });
      fireEvent.click(koreanButton);
      
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/ko/test');
      });
    });
  });

  describe('Display Options', () => {
    it('shows flags by default', () => {
      renderWithIntl(<LanguageSwitcher />);
      expect(screen.getByText('🇺🇸 English')).toBeInTheDocument();
    });

    it('hides flags when showFlags is false', () => {
      renderWithIntl(<LanguageSwitcher showFlags={false} />);
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.queryByText('🇺🇸')).not.toBeInTheDocument();
    });

    it('shows codes only when showCodesOnly is true', () => {
      renderWithIntl(<LanguageSwitcher showCodesOnly />);
      expect(screen.getByText('🇺🇸 EN')).toBeInTheDocument();
    });

    it('shows codes only without flags', () => {
      renderWithIntl(<LanguageSwitcher showCodesOnly showFlags={false} />);
      expect(screen.getByText('EN')).toBeInTheDocument();
      expect(screen.queryByText('🇺🇸')).not.toBeInTheDocument();
    });
  });

  describe('Custom Classes', () => {
    it('applies custom className', () => {
      renderWithIntl(<LanguageSwitcher className="custom-class" />);
      const container = screen.getByRole('button').closest('.relative');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Convenience Components', () => {
    it('renders LanguageSwitcherDropdown correctly', () => {
      renderWithIntl(<LanguageSwitcherDropdown />);
      expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
    });

    it('renders LanguageSwitcherPills correctly', () => {
      renderWithIntl(<LanguageSwitcherPills />);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation in dropdown mode', () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      
      // Focus and open with Enter
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'Enter' });
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('supports keyboard navigation in pills mode', () => {
      renderWithIntl(<LanguageSwitcher mode="pills" />);
      
      const koreanButton = screen.getByRole('button', { name: /Language.*한국어/ });
      
      // Focus and activate with Enter
      koreanButton.focus();
      expect(koreanButton).toHaveFocus();
      
      fireEvent.keyDown(koreanButton, { key: 'Enter' });
      expect(mockReplace).toHaveBeenCalledWith('/ko/test');
    });
  });

  describe('Edge Cases', () => {
    it('handles same locale selection gracefully', () => {
      renderWithIntl(<LanguageSwitcher mode="pills" />);
      
      const englishButton = screen.getByRole('button', { pressed: true });
      fireEvent.click(englishButton);
      
      // Should not trigger navigation for same locale
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('handles missing window object gracefully', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      const koreanOption = screen.getByRole('option', { name: /한국어/ });
      
      // Should not throw error
      expect(() => fireEvent.click(koreanOption)).not.toThrow();
      
      global.window = originalWindow;
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations - dropdown mode', async () => {
      const { container } = renderWithIntl(<LanguageSwitcher />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - pills mode', async () => {
      const { container } = renderWithIntl(<LanguageSwitcher mode="pills" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - dropdown open state', async () => {
      const { container } = renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA attributes for dropdown', () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-label', expect.stringContaining('Language'));
    });

    it('has proper ARIA attributes for pills', () => {
      renderWithIntl(<LanguageSwitcher mode="pills" />);
      
      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-label', 'Language');
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed');
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('has proper ARIA attributes for dropdown options', () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-label', 'Language');
      
      const options = screen.getAllByRole('option');
      options.forEach(option => {
        expect(option).toHaveAttribute('aria-selected');
      });
    });

    it('updates aria-expanded when dropdown opens/closes', () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      
      const backdrop = document.querySelector('.fixed.inset-0.z-40');
      fireEvent.click(backdrop!);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Responsive Design', () => {
    it('has responsive design classes', () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('transition-transform', 'duration-200');
    });
  });

  describe('Loading States', () => {
    it('shows loading animation during transition', () => {
      renderWithIntl(<LanguageSwitcher />);
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      const koreanOption = screen.getByRole('option', { name: /한국어/ });
      fireEvent.click(koreanOption);
      
      // Check for loading/pulse animation
      expect(screen.getByText('🇰🇷 한국어').closest('span')).toHaveClass('animate-pulse');
    });

    it('disables buttons during loading in pills mode', () => {
      renderWithIntl(<LanguageSwitcher mode="pills" />);
      
      const koreanButton = screen.getByRole('button', { name: /Language.*한국어/ });
      fireEvent.click(koreanButton);
      
      // All buttons should be disabled during transition
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });
});
