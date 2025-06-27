"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ResidentReportNewPage() {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const [type, setType] = useState('complaint');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!type.trim() || !content.trim()) {
      setError('유형과 내용을 모두 입력해 주세요.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || '민원 등록에 실패했습니다.');
      }
      setSuccess(true);
      setTimeout(() => router.push('/resident/reports'), 1000);
    } catch (e: any) {
      setError(e?.message || '민원 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-8 px-4">
      <h1 className="text-xl font-bold mb-6">민원 등록</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="type" className="block font-medium mb-1">유형</label>
          <select
            id="type"
            name="type"
            className="w-full border rounded px-3 py-2"
            value={type}
            onChange={e => setType(e.target.value)}
            disabled={loading}
            required
          >
            <option value="complaint">불편/민원</option>
            <option value="suggestion">건의</option>
            <option value="inquiry">문의</option>
            <option value="other">기타</option>
          </select>
        </div>
        <div>
          <label htmlFor="content" className="block font-medium mb-1">내용</label>
          <textarea
            id="content"
            name="content"
            className="w-full border rounded px-3 py-2"
            rows={5}
            value={content}
            onChange={e => setContent(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">민원이 정상적으로 등록되었습니다.</div>}
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:bg-gray-300"
          disabled={loading}
        >
          {loading ? '등록 중...' : '민원 등록'}
        </button>
      </form>
    </main>
  );
}
