import React from 'react';

export function ErrorMessage({ message, className = '' }: { message: string; className?: string }) {
  if (!message) return null;
  return (
    <div className={`text-red-500 text-sm py-2 ${className}`} role="alert" aria-live="assertive">
      {message}
    </div>
  );
} 