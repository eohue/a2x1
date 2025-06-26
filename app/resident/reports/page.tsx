"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';

interface Report {
  id: string;
  type: string;
  content: string;
  status: string;
  created_at: string;
}

export default function ResidentReportListPage() {
  const token = useAuthStore((s) => s.token);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('/reports', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('민원 목록을 불러오지 못했습니다.');
        return res.json();
      })
      .then(setReports)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">내 민원 목록</h1>
        <Link href="/resident/reports/new" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">민원 등록</Link>
      </div>
      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-2">유형</th>
            <th className="py-2 px-2">내용</th>
            <th className="py-2 px-2">상태</th>
            <th className="py-2 px-2">등록일</th>
            <th className="py-2 px-2">상세</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 && !loading && (
            <tr><td colSpan={5} className="text-center py-4">등록된 민원이 없습니다.</td></tr>
          )}
          {reports.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-2 px-2">{r.type}</td>
              <td className="py-2 px-2 line-clamp-1 max-w-xs">{r.content}</td>
              <td className="py-2 px-2">{r.status}</td>
              <td className="py-2 px-2">{new Date(r.created_at).toLocaleDateString()}</td>
              <td className="py-2 px-2">
                <Link href={`/resident/reports/${r.id}`} className="text-primary-600 underline">상세</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
