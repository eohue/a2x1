'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './common/Button';

/**
 * ApplicationCTA Component
 * 
 * A full-width, visually distinct call-to-action section that encourages users 
 * to apply for housing. Features:
 * - Responsive design with Tailwind utilities
 * - Background gradient/image styling per design system
 * - Internationalized text content from translation files
 * - Accessible markup with proper ARIA labels
 * - Smooth scroll interaction to application section
 */
export function ApplicationCTA() {
  const t = useTranslations('cta');

  const handleApplyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const applicationSection = document.getElementById('application');
    if (applicationSection) {
      applicationSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      applicationSection.focus({ preventScroll: true });
    }
  };

  return (
    <section
      className="relative w-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-16 sm:py-20 lg:py-24 overflow-hidden"
      aria-label={t('title')}
    >
      {/* Background pattern overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-primary-600/80 to-primary-800/80"
        aria-hidden="true"
      />
      
      {/* Decorative background elements */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl transform translate-y-1/2" />
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            {t('title')}
          </h2>

          {/* Brief copy */}
          <p className="max-w-4xl mx-auto text-lg sm:text-xl lg:text-2xl text-primary-100 leading-relaxed mb-10">
            {t('subtitle')}
          </p>

          {/* Primary CTA button */}
          <div className="flex justify-center">
            <Button
              onClick={handleApplyClick}
              variant="secondary"
              size="xl"
              className="bg-white text-primary-700 hover:bg-primary-50 focus:ring-white focus:ring-offset-primary-600 shadow-xl transform transition-all duration-200 hover:scale-105 px-8 py-4 text-lg font-semibold"
              aria-describedby="cta-description"
            >
              {t('button')}
            </Button>
          </div>

          {/* Screen reader description */}
          <div id="cta-description" className="sr-only">
            {t('subtitle')}
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 lg:h-24" aria-hidden="true">
        <svg
          className="absolute bottom-0 w-full h-full text-white fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 1440 54"
        >
          <path d="M0,22 C120,36 240,36 360,22 C480,8 600,8 720,22 C840,36 960,36 1080,22 C1200,8 1320,8 1440,22 L1440,54 L0,54 Z" />
        </svg>
      </div>
    </section>
  );
}

export default ApplicationCTA;
