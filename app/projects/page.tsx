"use client";
import { useEffect } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { ProjectList } from '@/components/projects/ProjectList';

export default function ProjectsPage() {
  const { projects, loading, error, setProjects, setLoading, setError } = useProjectStore();

  useEffect(() => {
    let ignore = false;
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/v1/projects');
        if (!res.ok) throw new Error('프로젝트 목록을 불러오지 못했습니다.');
        const { data } = await res.json();
        if (!ignore) setProjects(data);
      } catch (e: any) {
        if (!ignore) setError(e.message || '알 수 없는 오류');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchProjects();
    return () => { ignore = true; };
  }, [setProjects, setLoading, setError]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">프로젝트 목록</h1>
      {loading && <div className="text-gray-400">로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && <ProjectList />}
    </main>
  );
} 