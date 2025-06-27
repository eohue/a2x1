import Link from 'next/link';
import { useProjectStore } from '@/stores/useProjectStore';
import { useState } from 'react';

export function ProjectList() {
  const { projects } = useProjectStore();
  const [search, setSearch] = useState('');
  const filtered = search
    ? projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    : projects;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          className="border px-3 py-2 rounded w-full max-w-xs"
          placeholder="프로젝트명/설명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* TODO: 추가 필터 UI (예: 카테고리, 상태 등) */}
      </div>
      {filtered.length === 0 ? (
        <div className="text-gray-400">검색 결과가 없습니다.</div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((project) => (
            <li key={project.id} className="border p-4 rounded hover:bg-gray-50 transition">
              <Link href={`/projects/${project.id}`} className="block">
                <div className="font-semibold text-lg">{project.title}</div>
                <div className="text-gray-500 text-sm line-clamp-2">{project.description}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 