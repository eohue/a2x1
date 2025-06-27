import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { Navigation } from '../layout/Navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock LanguageSwitcher
jest.mock('../common/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Navigation', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  describe('Basic Rendering', () => {
    it('renders the navigation component', () => {
      render(<Navigation />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders the logo', () => {
      render(<Navigation />);
      
      expect(screen.getByText('ibookee')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /아이부키/i })).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
      render(<Navigation />);
      
      expect(screen.getByRole('link', { name: '홈' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '프로젝트' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '입주 신청' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '커뮤니티' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '관리자' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /입주민 로그인/i })).toBeInTheDocument();
    });

    it('renders language switcher', () => {
      render(<Navigation />);
      
      expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    });
  });

  describe('Mobile Menu', () => {
    it('does not show mobile menu by default', () => {
      render(<Navigation />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows mobile menu toggle button', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByRole('button', { name: /메뉴 열기/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('opens mobile menu when toggle button is clicked', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByRole('button', { name: /메뉴 열기/i });
      fireEvent.click(menuButton);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /메뉴 닫기/i })).toBeInTheDocument();
    });

    it('closes mobile menu when close button is clicked', () => {
      render(<Navigation />);
      
      // Open menu
      const openButton = screen.getByRole('button', { name: /메뉴 열기/i });
      fireEvent.click(openButton);
      
      // Close menu
      const closeButton = screen.getByRole('button', { name: /메뉴 닫기/i });
      fireEvent.click(closeButton);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes mobile menu when navigation link is clicked', () => {
      render(<Navigation />);
      
      // Open menu
      const openButton = screen.getByRole('button', { name: /메뉴 열기/i });
      fireEvent.click(openButton);
      
      // Click a navigation link in mobile menu
      const mobileLinks = screen.getAllByRole('link', { name: '홈' });
      const mobileLink = mobileLinks.find(link => 
        link.closest('[role="dialog"]') !== null
      );
      
      if (mobileLink) {
        fireEvent.click(mobileLink);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }
    });
  });

  describe('Active Link Highlighting', () => {
    it('highlights home link when on home page', () => {
      (usePathname as jest.Mock).mockReturnValue('/');
      render(<Navigation />);
      
      const homeLinks = screen.getAllByRole('link', { name: '홈' });
      homeLinks.forEach(link => {
        expect(link).toHaveClass('text-primary-600');
      });
    });

    it('highlights projects link when on projects page', () => {
      (usePathname as jest.Mock).mockReturnValue('/projects');
      render(<Navigation />);
      
      const projectLinks = screen.getAllByRole('link', { name: '프로젝트' });
      projectLinks.forEach(link => {
        expect(link).toHaveClass('text-primary-600');
      });
    });

    it('shows non-active links in gray', () => {
      (usePathname as jest.Mock).mockReturnValue('/');
      render(<Navigation />);
      
      const projectLinks = screen.getAllByRole('link', { name: '프로젝트' });
      projectLinks.forEach(link => {
        expect(link).toHaveClass('text-gray-900');
        expect(link).not.toHaveClass('text-primary-600');
      });
    });
  });

  describe('Responsive Design', () => {
    it('has responsive navigation classes', () => {
      render(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('mx-auto', 'flex', 'max-w-7xl', 'items-center', 'justify-between');
    });

    it('hides desktop menu on mobile', () => {
      render(<Navigation />);
      
      const desktopMenu = screen.getByRole('navigation').querySelector('.hidden.lg\\:flex');
      expect(desktopMenu).toBeInTheDocument();
    });

    it('hides mobile toggle on desktop', () => {
      render(<Navigation />);
      
      const mobileToggle = screen.getByRole('button', { name: /메뉴 열기/i });
      expect(mobileToggle.closest('div')).toHaveClass('flex', 'lg:hidden');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Global');
    });

    it('has proper ARIA attributes for mobile menu', () => {
      render(<Navigation />);
      
      // Open mobile menu
      const openButton = screen.getByRole('button', { name: /메뉴 열기/i });
      fireEvent.click(openButton);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('has accessible button labels', () => {
      render(<Navigation />);
      
      expect(screen.getByRole('button', { name: /메뉴 열기/i })).toBeInTheDocument();
      
      // Open menu to check close button
      const openButton = screen.getByRole('button', { name: /메뉴 열기/i });
      fireEvent.click(openButton);
      
      expect(screen.getByRole('button', { name: /메뉴 닫기/i })).toBeInTheDocument();
    });

    it('has screen reader only text for logo', () => {
      render(<Navigation />);
      
      const logoLinks = screen.getAllByRole('link', { name: /아이부키/i });
      logoLinks.forEach(link => {
        const srOnlyText = link.querySelector('.sr-only');
        expect(srOnlyText).toBeInTheDocument();
        expect(srOnlyText).toHaveTextContent('아이부키');
      });
    });

    it('has proper aria-hidden attributes for decorative elements', () => {
      render(<Navigation />);
      
      const decorativeElements = screen.getAllByText('→');
      decorativeElements.forEach(element => {
        expect(element).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Sticky Positioning', () => {
    it('has sticky positioning classes', () => {
      render(<Navigation />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('has background and shadow for visibility', () => {
      render(<Navigation />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-white', 'shadow-sm');
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation for menu toggle', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByRole('button', { name: /메뉴 열기/i });
      
      // Focus and activate with Enter
      menuButton.focus();
      expect(menuButton).toHaveFocus();
      
      fireEvent.keyDown(menuButton, { key: 'Enter' });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('supports keyboard navigation for all links', () => {
      render(<Navigation />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        link.focus();
        expect(link).toHaveFocus();
      });
    });
  });

  describe('Link Attributes', () => {
    it('has correct href attributes for all links', () => {
      render(<Navigation />);
      
      expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: '프로젝트' })).toHaveAttribute('href', '/projects');
      expect(screen.getByRole('link', { name: '입주 신청' })).toHaveAttribute('href', '/application');
      expect(screen.getByRole('link', { name: '커뮤니티' })).toHaveAttribute('href', '/community');
      expect(screen.getByRole('link', { name: '관리자' })).toHaveAttribute('href', '/admin');
      expect(screen.getByRole('link', { name: /입주민 로그인/i })).toHaveAttribute('href', '/resident/login');
    });

    it('has transition classes for hover effects', () => {
      render(<Navigation />);
      
      const links = screen.getAllByRole('link');
      const navigationLinks = links.filter(link => 
        link.textContent && 
        ['홈', '프로젝트', '입주 신청', '커뮤니티', '관리자'].includes(link.textContent)
      );
      
      navigationLinks.forEach(link => {
        expect(link).toHaveClass('transition-colors');
      });
    });
  });

  describe('Error Handling', () => {
    it('handles missing pathname gracefully', () => {
      (usePathname as jest.Mock).mockReturnValue(undefined);
      
      expect(() => render(<Navigation />)).not.toThrow();
    });

    it('handles null pathname gracefully', () => {
      (usePathname as jest.Mock).mockReturnValue(null);
      
      expect(() => render(<Navigation />)).not.toThrow();
    });
  });
});
