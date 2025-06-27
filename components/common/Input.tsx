'use client';

import React, { forwardRef, useState, useId } from 'react';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Types
export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Input type
   */
  type?: InputType;
  
  /**
   * Size of the input
   */
  size?: InputSize;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Success message to display
   */
  success?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Label for the input
   */
  label?: string;
  
  /**
   * Whether the label should be hidden (still accessible to screen readers)
   */
  hideLabel?: boolean;
  
  /**
   * Left icon element
   */
  iconLeft?: React.ReactNode;
  
  /**
   * Right icon element
   */
  iconRight?: React.ReactNode;
  
  /**
   * Additional CSS classes for the input container
   */
  className?: string;
  
  /**
   * Additional CSS classes for the input element itself
   */
  inputClassName?: string;
  
  /**
   * Additional CSS classes for the label
   */
  labelClassName?: string;
  
  /**
   * Controlled value
   */
  value?: string;
  
  /**
   * Default value for uncontrolled usage
   */
  defaultValue?: string;
  
  /**
   * Change handler
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  
  /**
   * Whether the input is required
   */
  required?: boolean;
  
  /**
   * Whether to show the required indicator
   */
  showRequired?: boolean;
  
  /**
   * Custom validation function
   */
  validate?: (value: string) => string | null;
  
  /**
   * Whether to validate on blur
   */
  validateOnBlur?: boolean;
  
  /**
   * Whether to validate on change
   */
  validateOnChange?: boolean;
}

// Size styles
const sizeStyles: Record<InputSize, { input: string; text: string; icon: string }> = {
  sm: {
    input: 'px-3 py-1.5 text-sm',
    text: 'text-xs',
    icon: 'h-4 w-4',
  },
  md: {
    input: 'px-3 py-2 text-sm',
    text: 'text-sm',
    icon: 'h-5 w-5',
  },
  lg: {
    input: 'px-4 py-3 text-base',
    text: 'text-sm',
    icon: 'h-6 w-6',
  },
};

// Base input styles
const baseInputStyles = 'block w-full border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 placeholder:text-gray-400';

// State styles
const stateStyles = {
  default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
  error: 'border-error-300 focus:border-error-500 focus:ring-error-500 bg-error-50',
  success: 'border-success-300 focus:border-success-500 focus:ring-success-500 bg-success-50',
  disabled: 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed',
};

// Hover styles
const hoverStyles = {
  default: 'hover:border-gray-400',
  error: 'hover:border-error-400',
  success: 'hover:border-success-400',
  disabled: '',
};

/**
 * Flexible Input component with support for controlled/uncontrolled modes,
 * validation, icons, and comprehensive accessibility features
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      size = 'md',
      error,
      success,
      helperText,
      label,
      hideLabel = false,
      iconLeft,
      iconRight,
      className,
      inputClassName,
      labelClassName,
      value,
      defaultValue,
      onChange,
      required = false,
      showRequired = true,
      validate,
      validateOnBlur = true,
      validateOnChange = false,
      disabled = false,
      placeholder,
      id,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const t = useTranslations('input');
    const generatedId = useId();
    const inputId = id || generatedId;
    
    // Internal state for validation
    const [internalError, setInternalError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);
    
    // Determine the current state
    const currentError = error || internalError;
    const hasError = Boolean(currentError);
    const hasSuccess = Boolean(success && !hasError);
    
    // Get current input state
    const getInputState = () => {
      if (disabled) return 'disabled';
      if (hasError) return 'error';
      if (hasSuccess) return 'success';
      return 'default';
    };
    
    const inputState = getInputState();
    
    // Validation function
    const runValidation = (inputValue: string) => {
      if (!validate) return null;
      return validate(inputValue);
    };
    
    // Handle validation on blur
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      
      if (validateOnBlur && validate) {
        const validationError = runValidation(event.target.value);
        setInternalError(validationError);
      }
      
      props.onBlur?.(event);
    };
    
    // Handle validation on change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (validateOnChange && validate && touched) {
        const validationError = runValidation(event.target.value);
        setInternalError(validationError);
      }
      
      onChange?.(event);
    };
    
    // Build aria-describedby
    const describedByIds = [];
    if (currentError) describedByIds.push(`${inputId}-error`);
    if (success) describedByIds.push(`${inputId}-success`);
    if (helperText) describedByIds.push(`${inputId}-helper`);
    if (ariaDescribedBy) describedByIds.push(ariaDescribedBy);
    
    const finalAriaDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;
    
    // Generate placeholder with i18n support
    const getPlaceholder = () => {
      if (placeholder) return placeholder;
      
      // Try to get translated placeholder
      try {
        return t('placeholder');
      } catch {
        return undefined;
      }
    };
    
    // Build input classes
    const inputClasses = twMerge(
      clsx(
        baseInputStyles,
        sizeStyles[size].input,
        stateStyles[inputState],
        !disabled && hoverStyles[inputState],
        
        // Icon spacing
        iconLeft && 'pl-10',
        iconRight && 'pr-10',
        
        // Custom input classes
        inputClassName
      )
    );
    
    // Build container classes
    const containerClasses = twMerge(
      clsx(
        'relative',
        className
      )
    );
    
    // Build label classes
    const labelClasses = twMerge(
      clsx(
        'block font-medium text-gray-700 mb-1',
        sizeStyles[size].text,
        hideLabel && 'sr-only',
        disabled && 'text-gray-500',
        labelClassName
      )
    );
    
    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && showRequired && (
              <span className="text-error-500 ml-1" aria-label={t('required', { defaultValue: 'required' })}>
                *
              </span>
            )}
          </label>
        )}
        
        <div className="relative">
          {/* Left Icon */}
          {iconLeft && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className={clsx('text-gray-400', sizeStyles[size].icon)}>
                {iconLeft}
              </div>
            </div>
          )}
          
          {/* Input Element */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={inputClasses}
            disabled={disabled}
            required={required}
            placeholder={getPlaceholder()}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={hasError}
            aria-describedby={finalAriaDescribedBy}
            {...props}
          />
          
          {/* Right Icon */}
          {iconRight && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className={clsx('text-gray-400', sizeStyles[size].icon)}>
                {iconRight}
              </div>
            </div>
          )}
        </div>
        
        {/* Messages */}
        <div className="mt-1 space-y-1">
          {/* Error Message */}
          {currentError && (
            <p
              id={`${inputId}-error`}
              className={clsx('text-error-600', sizeStyles[size].text)}
              role="alert"
              aria-live="polite"
            >
              {currentError}
            </p>
          )}
          
          {/* Success Message */}
          {success && !hasError && (
            <p
              id={`${inputId}-success`}
              className={clsx('text-success-600', sizeStyles[size].text)}
              role="status"
              aria-live="polite"
            >
              {success}
            </p>
          )}
          
          {/* Helper Text */}
          {helperText && !hasError && !success && (
            <p
              id={`${inputId}-helper`}
              className={clsx('text-gray-500', sizeStyles[size].text)}
            >
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
