"use client";
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';
import { ProjectDetail } from '@/components/projects/ProjectDetail';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { selectedProject, loading, error, setSelectedProject, setLoading, setError } = useProjectStore();

  useEffect(() => {
    let ignore = false;
    if (!id) return;
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/projects/${id}`);
        if (!res.ok) throw new Error('프로젝트 상세 정보를 불러오지 못했습니다.');
        const { data } = await res.json();
        if (!ignore) setSelectedProject(data);
      } catch (e: any) {
        if (!ignore) setError(e.message || '알 수 없는 오류');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchDetail();
    return () => { ignore = true; };
  }, [id, setSelectedProject, setLoading, setError]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">프로젝트 상세</h1>
      {loading && <div className="text-gray-400">로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && <ProjectDetail />}
    </main>
  );
} 