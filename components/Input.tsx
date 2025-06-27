import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <input
          id={id}
          ref={ref}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-red-500 text-xs mt-1" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input'; 