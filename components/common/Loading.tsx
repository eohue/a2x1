import React from 'react';

export function Loading({ message = '로딩 중...', className = '' }: { message?: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 text-gray-500 ${className}`} role="status" aria-live="polite">
      <svg className="animate-spin h-5 w-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      {message}
    </div>
  );
} 