"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/stores/useReportStore';
import { AdminStatusMessage } from '@/components/admin/common/AdminStatusMessage';

const STATUS_LABELS: Record<string, string> = {
  submitted: '접수',
  in_progress: '처리중',
  resolved: '완료',
  rejected: '반려',
};

function useReportSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const fetchSummary = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/reports/summary');
      if (!res.ok) throw new Error('요약 데이터 로딩 실패');
      setSummary(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { fetchSummary(); }, [fetchSummary]);
  return { summary, loading, error, refetch: fetchSummary };
}

export default function AdminReportListPage() {
  const {
    reports, loading, error, filter,
    fetchReports, updateStatus, remove, exportReports, setFilter
  } = useReportStore();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const router = useRouter();
  const summaryState = useReportSummary();

  useEffect(() => { fetchReports(); }, [filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ q, status, type });
  };

  return (
    <main className="max-w-6xl mx-auto py-8 px-2 md:px-6">
      <h1 className="text-xl font-bold mb-6">전체 민원 관리</h1>
      {/* 리포트 요약 카드 */}
      <section className="mb-6">
        {summaryState.loading ? (
          <div className="py-4">요약 데이터 로딩 중...</div>
        ) : summaryState.error ? (
          <div className="text-red-500 py-2">{summaryState.error}</div>
        ) : summaryState.summary ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded shadow p-4 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">월간 활성 사용자(MAU)</div>
              <div className="text-2xl font-bold">{summaryState.summary.mau ?? '-'}</div>
            </div>
            <div className="bg-white rounded shadow p-4 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">게시물 수</div>
              <div className="text-2xl font-bold">{summaryState.summary.posts ?? '-'}</div>
            </div>
            <div className="bg-white rounded shadow p-4 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">민원 수</div>
              <div className="text-2xl font-bold">{summaryState.summary.reports ?? '-'}</div>
            </div>
            <div className="bg-white rounded shadow p-4 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">다운로드</div>
              <button className="mt-2 bg-primary-600 text-white rounded px-3 py-1 text-sm" onClick={() => exportReports('csv')}>CSV 다운로드</button>
              <button className="mt-2 bg-gray-600 text-white rounded px-3 py-1 text-sm" onClick={() => exportReports('pdf')}>PDF 다운로드</button>
            </div>
          </div>
        ) : null}
      </section>
      <form className="flex flex-wrap gap-2 mb-4 items-center" onSubmit={handleSearch}>
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="검색어(내용/유저)"
          value={q} onChange={e => setQ(e.target.value)}
        />
        <select className="border rounded px-2 py-1 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">상태 전체</option>
          <option value="submitted">접수</option>
          <option value="in_progress">처리중</option>
          <option value="resolved">완료</option>
          <option value="rejected">반려</option>
        </select>
        <select className="border rounded px-2 py-1 text-sm" value={type} onChange={e => setType(e.target.value)}>
          <option value="">유형 전체</option>
          <option value="abuse">욕설/비방</option>
          <option value="spam">스팸</option>
          <option value="etc">기타</option>
        </select>
        <button type="submit" className="bg-primary-600 text-white rounded px-3 py-1 text-sm">검색</button>
      </form>
      <AdminStatusMessage loading={loading} error={error} empty={reports.length === 0 ? '등록된 민원이 없습니다.' : undefined}>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2">ID</th>
                <th className="py-2 px-2">유형</th>
                <th className="py-2 px-2">내용</th>
                <th className="py-2 px-2">상태</th>
                <th className="py-2 px-2">신고자</th>
                <th className="py-2 px-2">등록일</th>
                <th className="py-2 px-2">액션</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-2 text-xs text-gray-400">{r.id.slice(0, 8)}</td>
                  <td className="py-2 px-2">{r.type}</td>
                  <td className="py-2 px-2 line-clamp-1 max-w-xs">{r.content}</td>
                  <td className="py-2 px-2">
                    <select
                      className="border rounded px-1 py-0.5 text-xs"
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value)}
                    >
                      <option value="submitted">접수</option>
                      <option value="in_progress">처리중</option>
                      <option value="resolved">완료</option>
                      <option value="rejected">반려</option>
                    </select>
                  </td>
                  <td className="py-2 px-2">{r.user?.id || '-'}</td>
                  <td className="py-2 px-2">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-2 flex gap-2">
                    <button
                      className="text-blue-600 underline text-xs"
                      onClick={() => router.push(`/admin/reports/${r.id}`)}
                    >상세</button>
                    <button
                      className="text-red-500 underline text-xs"
                      onClick={() => setDeleteId(r.id)}
                    >삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminStatusMessage>
      {/* 삭제 확인 모달 */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-80">
            <div className="mb-4">정말로 이 민원을 삭제하시겠습니까?</div>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setDeleteId(null)}>취소</button>
              <button
                className="px-3 py-1 rounded bg-red-600 text-white"
                onClick={async () => { await remove(deleteId); setDeleteId(null); }}
              >삭제</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
