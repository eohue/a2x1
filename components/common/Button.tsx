'use client';

import React, { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   */
  variant?: ButtonVariant;
  
  /**
   * Size of the button
   */
  size?: ButtonSize;
  
  /**
   * Whether the button should take full width
   */
  fullWidth?: boolean;
  
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;
  
  /**
   * Custom loading text (falls back to i18n translation)
   */
  loadingText?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Button content
   */
  children: React.ReactNode;
}

// Variant styles
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white shadow-sm',
  secondary: 'bg-secondary-100 hover:bg-secondary-200 focus:ring-secondary-500 text-secondary-900 border border-secondary-300',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 bg-white',
  danger: 'bg-error-600 hover:bg-error-700 focus:ring-error-500 text-white shadow-sm',
};

// Size styles
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
  xl: 'px-6 py-3 text-base',
};

// Loading spinner component
const LoadingSpinner = ({ size, ariaLabel }: { size: ButtonSize; ariaLabel: string }) => {
  const spinnerSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-4 w-4',
    xl: 'h-5 w-5',
  };

  return (
    <svg
      className={twMerge('animate-spin -ml-1 mr-2', spinnerSizes[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label={ariaLabel}
      role="img"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  );
};

/**
 * Generic Button component with support for variants, sizes, loading states, and i18n
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      loadingText,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const t = useTranslations('button');

    // Determine if button should be disabled
    const isDisabled = disabled || loading;

    // Get loading text from props or translations
    const displayLoadingText = loadingText || t('loading');

    // Combine all classes
    const buttonClasses = twMerge(
      clsx(
        // Base styles
        'inline-flex items-center justify-center border font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        
        // Variant styles
        variantStyles[variant],
        
        // Size styles
        sizeStyles[size],
        
        // Full width
        fullWidth && 'w-full',
        
        // Disabled state
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        
        // Loading state adjustments
        loading && 'relative',
        
        // Custom classes
        className
      )
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <LoadingSpinner 
            size={size} 
            ariaLabel={t('loadingSpinner')} 
          />
        )}
        {loading ? displayLoadingText : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
