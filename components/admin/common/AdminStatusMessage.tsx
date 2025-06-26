import React from 'react';

interface AdminStatusMessageProps {
  loading?: boolean;
  error?: string | null;
  empty?: string;
  children?: React.ReactNode;
}

export function AdminStatusMessage({ loading, error, empty, children }: AdminStatusMessageProps) {
  if (loading) return <div className="py-8 text-center text-gray-400">로딩 중...</div>;
  if (error) return <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center" role="alert">{error}</div>;
  if (empty) return <div className="py-8 text-center text-gray-400">{empty}</div>;
  return <>{children}</>;
} 