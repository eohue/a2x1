"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './Button';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type DisplayMode = 'dropdown' | 'pills';

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

const LANGS: LanguageOption[] = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

interface LanguageSwitcherProps {
  /**
   * Display mode: dropdown or pill buttons
   */
  mode?: DisplayMode;
  /**
   * Show flags alongside text
   */
  showFlags?: boolean;
  /**
   * Show only locale codes (e.g., KO, EN)
   */
  showCodesOnly?: boolean;
  /**
   * Custom CSS classes
   */
  className?: string;
}

export function LanguageSwitcher({ 
  mode = 'dropdown', 
  showFlags = true, 
  showCodesOnly = false,
  className = '' 
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('common');
  const [pending, startTransition] = useTransition();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentLang = LANGS.find(lang => lang.code === locale) || LANGS[0];

  // Persist locale selection
  const persistLocale = (localeCode: string) => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', localeCode);
    }
    
    // Save to cookie
    document.cookie = `preferred-locale=${localeCode}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  };

  const handleLocaleChange = (nextLocale: string) => {
    if (nextLocale === locale) return;
    
    persistLocale(nextLocale);
    
    startTransition(() => {
      // Update URL with new locale prefix
      const newPath = pathname.replace(/^\/[a-z]{2}/, `/${nextLocale}`);
      router.replace(newPath);
    });
    
    setIsDropdownOpen(false);
  };

  const formatLabel = (lang: LanguageOption) => {
    if (showCodesOnly) {
      return showFlags ? `${lang.flag} ${lang.code.toUpperCase()}` : lang.code.toUpperCase();
    }
    return showFlags ? `${lang.flag} ${lang.label}` : lang.label;
  };

  // Pill buttons mode
  if (mode === 'pills') {
    return (
      <div className={`flex items-center space-x-1 ${className}`} role="group" aria-label={t('language')}>
        {LANGS.map((lang) => (
          <Button
            key={lang.code}
            variant={locale === lang.code ? 'primary' : 'outline'}
            size="sm"
            disabled={pending}
            className={`${locale === lang.code ? 'ring-2 ring-primary-500' : ''} transition-all duration-200`}
            aria-pressed={locale === lang.code}
            aria-label={`${t('language')}: ${lang.label}`}
            onClick={() => handleLocaleChange(lang.code)}
          >
            {pending && locale === lang.code ? (
              <span className="animate-pulse">{formatLabel(lang)}</span>
            ) : (
              formatLabel(lang)
            )}
          </Button>
        ))}
      </div>
    );
  }

  // Dropdown mode
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        className="flex items-center space-x-2"
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
        aria-label={`${t('language')}: ${currentLang.label}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span>{formatLabel(currentLang)}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isDropdownOpen && (
        <div 
          className="absolute right-0 mt-2 py-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-max"
          role="listbox"
          aria-label={t('language')}
        >
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLocaleChange(lang.code)}
              disabled={pending}
              className={`
                w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150
                ${locale === lang.code ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'}
                ${pending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              role="option"
              aria-selected={locale === lang.code}
            >
              {pending && locale === lang.code ? (
                <span className="animate-pulse">{formatLabel(lang)}</span>
              ) : (
                formatLabel(lang)
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Convenience exports for specific modes
export const LanguageSwitcherDropdown = (props: Omit<LanguageSwitcherProps, 'mode'>) => (
  <LanguageSwitcher {...props} mode="dropdown" />
);

export const LanguageSwitcherPills = (props: Omit<LanguageSwitcherProps, 'mode'>) => (
  <LanguageSwitcher {...props} mode="pills" />
);
