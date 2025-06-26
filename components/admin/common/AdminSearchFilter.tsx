import React from 'react';

export type AdminSearchField =
  | { type: 'text'; key: string; label: string; placeholder?: string }
  | { type: 'select'; key: string; label: string; options: { value: string; label: string }[] };

interface AdminSearchFilterProps {
  fields: AdminSearchField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export function AdminSearchFilter({ fields, values, onChange, onSubmit, loading, children }: AdminSearchFilterProps) {
  return (
    <form className="mb-6 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-end" onSubmit={onSubmit}>
      {fields.map(field =>
        field.type === 'text' ? (
          <>
            <label key={field.key + '-label'} htmlFor={field.key} className="text-sm font-medium">{field.label}</label>
            <input
              key={field.key}
              id={field.key}
              name={field.key}
              type="text"
              className="border rounded px-3 py-2 w-full md:w-64"
              placeholder={field.placeholder}
              aria-label={field.label}
              value={values[field.key] || ''}
              onChange={e => onChange(field.key, e.target.value)}
            />
          </>
        ) : (
          <>
            <label key={field.key + '-label'} htmlFor={field.key} className="text-sm font-medium">{field.label}</label>
            <select
              key={field.key}
              id={field.key}
              name={field.key}
              className="border rounded px-2 py-2"
              aria-label={field.label}
              value={values[field.key] || ''}
              onChange={e => onChange(field.key, e.target.value)}
            >
              {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </>
        )
      )}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="검색" disabled={loading}>검색</button>
      {children}
    </form>
  );
} 