"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

interface Report {
  id: string;
  type: string;
  content: string;
  status: string;
  created_at: string;
}
interface History {
  id: string;
  status: string;
  comment?: string;
  user: { email: string };
  created_at: string;
}

export default function ResidentReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !token) return;
    setLoading(true);
    Promise.all([
      fetch(`/reports/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (!res.ok) throw new Error('민원 정보를 불러올 수 없습니다.');
          return res.json();
        }),
      fetch(`/reports/${id}/history`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (!res.ok) throw new Error('이력 정보를 불러올 수 없습니다.');
          return res.json();
        })
    ])
      .then(([report, history]) => {
        setReport(report);
        setHistory(history);
        setError(null);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (!id) return <div>잘못된 접근입니다.</div>;

  return (
    <main className="max-w-xl mx-auto py-8 px-4">
      <button onClick={() => router.back()} className="mb-4 text-primary-600 underline">← 목록으로</button>
      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {report && (
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-2">민원 상세</h1>
          <div className="mb-2"><b>유형:</b> {report.type}</div>
          <div className="mb-2"><b>상태:</b> {report.status}</div>
          <div className="mb-2"><b>등록일:</b> {new Date(report.created_at).toLocaleString()}</div>
          <div className="mb-2"><b>내용:</b></div>
          <div className="border rounded p-3 bg-gray-50 whitespace-pre-line">{report.content}</div>
        </div>
      )}
      <h2 className="text-lg font-semibold mb-2">처리 이력</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-2">상태</th>
            <th className="py-2 px-2">처리자</th>
            <th className="py-2 px-2">코멘트</th>
            <th className="py-2 px-2">일시</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 && !loading && (
            <tr><td colSpan={4} className="text-center py-4">이력 정보가 없습니다.</td></tr>
          )}
          {history.map(h => (
            <tr key={h.id} className="border-t">
              <td className="py-2 px-2">{h.status}</td>
              <td className="py-2 px-2">{h.user?.email || '-'}</td>
              <td className="py-2 px-2">{h.comment || '-'}</td>
              <td className="py-2 px-2">{new Date(h.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
