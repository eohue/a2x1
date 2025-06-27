"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useReportStore } from '@/stores/useReportStore';

const STATUS_LABELS: Record<string, string> = {
  submitted: '접수',
  in_progress: '처리중',
  resolved: '완료',
  rejected: '반려',
};

export default function AdminReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    report, history, loading, error,
    fetchReport, fetchHistory, updateStatus, remove, exportReports
  } = useReportStore();
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReport(id);
      fetchHistory(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (report) setStatus(report.status);
  }, [report]);

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    await updateStatus(id, status, comment);
    setComment('');
    setSaving(false);
  };

  if (!id) return <div>잘못된 접근입니다.</div>;

  return (
    <main className="max-w-xl mx-auto py-8 px-4">
      <button onClick={() => router.back()} className="mb-4 text-primary-600 underline">← 목록으로</button>
      <div className="flex gap-2 mb-4">
        <button className="bg-gray-200 rounded px-3 py-1 text-sm" onClick={() => exportReports('csv')}>CSV 다운로드</button>
        <button className="bg-gray-200 rounded px-3 py-1 text-sm" onClick={() => exportReports('pdf')}>PDF 다운로드</button>
        <button className="bg-red-600 text-white rounded px-3 py-1 text-sm ml-auto" onClick={() => setDeleteOpen(true)}>삭제</button>
      </div>
      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {report && (
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-2">민원 상세</h1>
          <div className="mb-2"><b>ID:</b> <span className="text-xs text-gray-400">{report.id}</span></div>
          <div className="mb-2"><b>유형:</b> {report.type}</div>
          <div className="mb-2"><b>상태:</b> {STATUS_LABELS[report.status] || report.status}</div>
          <div className="mb-2"><b>신고자:</b> {report.user?.id || '-'}</div>
          <div className="mb-2"><b>등록일:</b> {new Date(report.created_at).toLocaleString()}</div>
          <div className="mb-2"><b>내용:</b></div>
          <div className="border rounded p-3 bg-gray-50 whitespace-pre-line">{report.content}</div>
        </div>
      )}
      <h2 className="text-lg font-semibold mb-2">상태 변경</h2>
      <form className="flex flex-col gap-2 mb-8" onSubmit={handleStatusChange}>
        <div>
          <label htmlFor="status" className="block font-medium mb-1">상태</label>
          <select
            id="status"
            name="status"
            className="w-full border rounded px-3 py-2"
            value={status}
            onChange={e => setStatus(e.target.value)}
            disabled={saving}
            required
          >
            <option value="submitted">접수</option>
            <option value="in_progress">처리중</option>
            <option value="resolved">완료</option>
            <option value="rejected">반려</option>
          </select>
        </div>
        <div>
          <label htmlFor="comment" className="block font-medium mb-1">코멘트(선택)</label>
          <input
            id="comment"
            name="comment"
            className="w-full border rounded px-3 py-2"
            value={comment}
            onChange={e => setComment(e.target.value)}
            disabled={saving}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:bg-gray-300"
          disabled={saving}
        >
          {saving ? '변경 중...' : '상태 변경'}
        </button>
      </form>
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
              <td className="py-2 px-2">{STATUS_LABELS[h.status] || h.status}</td>
              <td className="py-2 px-2">{h.user?.id || '-'}</td>
              <td className="py-2 px-2">{h.comment || '-'}</td>
              <td className="py-2 px-2">{new Date(h.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 삭제 확인 모달 */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-80">
            <div className="mb-4">정말로 이 민원을 삭제하시겠습니까?</div>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setDeleteOpen(false)}>취소</button>
              <button
                className="px-3 py-1 rounded bg-red-600 text-white"
                onClick={async () => { await remove(id); setDeleteOpen(false); router.push('/admin/reports'); }}
              >삭제</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
