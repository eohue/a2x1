import React from 'react';

interface AdminTableProps<T> {
  columns: { key: string; label: string }[];
  data: T[];
  renderRow: (item: T, idx: number) => React.ReactNode;
  empty?: string;
}

export function AdminTable<T>({ columns, data, renderRow, empty }: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white" role="region" aria-label="관리 테이블">
      <table className="min-w-full divide-y divide-gray-200" aria-label="데이터 테이블">
        <thead className="bg-gray-100">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-2 text-left text-xs font-semibold text-gray-700">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-8 text-gray-400">{empty || '데이터가 없습니다.'}</td></tr>
          ) : (
            data.map((item, idx) => renderRow(item, idx))
          )}
        </tbody>
      </table>
    </div>
  );
} 