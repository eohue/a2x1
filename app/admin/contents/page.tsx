"use client";
import React, { useEffect, useState } from "react";
import { useContentStore, ContentStatus, Content } from '@/stores/useContentStore';
import { AdminStatusMessage } from '@/components/admin/common/AdminStatusMessage';

const STATUS_LABELS: Record<ContentStatus, string> = {
  pending: '승인대기',
  approved: '승인됨',
  rejected: '거절됨',
  deleted: '삭제됨',
};

const CHANNELS = [
  { value: '', label: '전체 채널' },
  { value: '일반', label: '일반' },
  { value: '이벤트', label: '이벤트' },
  { value: '공지', label: '공지' },
  { value: '뉴스', label: '뉴스' },
];

export default function AdminContentsPage() {
  const {
    contents, loading, error, q, status, channel,
    setQ, setStatus, setChannel, fetchContents,
    createContent, updateContent, updateStatus, removeContent
  } = useContentStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Content>>({ title: '', content: '', channel: '일반' });
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchContents(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContents();
  };

  const handleEdit = (content: Content) => {
    setEditId(content.id);
    setForm(content);
    setIsNew(false);
  };

  const handleNew = () => {
    setEditId(null);
    setForm({ title: '', content: '', channel: '일반' });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (isNew) {
      await createContent(form);
    } else if (editId) {
      await updateContent(editId, form);
    }
    setEditId(null);
    setIsNew(false);
    setForm({ title: '', content: '', channel: '일반' });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8" aria-label="콘텐츠 관리">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" tabIndex={0} aria-label="콘텐츠 관리">콘텐츠 관리</h1>
        <p className="text-gray-600 mt-2" tabIndex={0} aria-label="프로젝트, 뉴스, 공지, 모더레이션">프로젝트, 뉴스, 공지, 커뮤니티 게시물 관리</p>
      </header>
      <form className="mb-6 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-end" onSubmit={handleSearch}>
        <label htmlFor="search" className="text-sm font-medium">검색</label>
        <input id="search" name="search" type="text" className="border rounded px-3 py-2 w-full md:w-64" placeholder="제목, 내용 등" aria-label="콘텐츠 검색" value={q} onChange={e => setQ(e.target.value)} />
        <select className="border rounded px-2 py-2" aria-label="상태 필터" value={status} onChange={e => setStatus(e.target.value as ContentStatus | '')}>
          <option value="">전체 상태</option>
          <option value="pending">승인대기</option>
          <option value="approved">승인됨</option>
          <option value="rejected">거절됨</option>
          <option value="deleted">삭제됨</option>
        </select>
        <select className="border rounded px-2 py-2" aria-label="채널 필터" value={channel} onChange={e => setChannel(e.target.value)}>
          {CHANNELS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="검색" disabled={loading}>검색</button>
        <button type="button" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500" onClick={handleNew}>신규 등록</button>
      </form>
      {(editId !== null || isNew) && (
        <section className="mb-6 bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">{isNew ? '콘텐츠 등록' : '콘텐츠 수정'}</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">제목</label>
            <input className="border rounded px-3 py-2 w-full" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">채널</label>
            <select className="border rounded px-2 py-2 w-full" value={form.channel || '일반'} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}>
              {CHANNELS.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">내용</label>
            <textarea className="border rounded px-3 py-2 w-full min-h-[100px]" value={form.content || ''} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleSave} type="button">저장</button>
            <button className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500" onClick={() => { setEditId(null); setIsNew(false); setForm({ title: '', content: '', channel: '일반' }); }} type="button">취소</button>
          </div>
        </section>
      )}
      <AdminStatusMessage loading={loading} error={error} empty={contents.length === 0 ? '콘텐츠가 없습니다.' : undefined}>
        <section aria-label="콘텐츠 목록">
          <div className="overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">제목</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">채널</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">상태</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">작성일</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">액션</th>
                </tr>
              </thead>
              <tbody>
                {contents.map(content => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{content.title}</td>
                    <td className="px-4 py-2">{content.channel}</td>
                    <td className="px-4 py-2">{STATUS_LABELS[content.status]}</td>
                    <td className="px-4 py-2">{content.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-2 flex gap-2 flex-wrap">
                      <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs" aria-label="수정" onClick={() => handleEdit(content)}>수정</button>
                      {content.status !== 'approved' && <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" aria-label="승인" onClick={() => updateStatus(content.id, 'approved')}>승인</button>}
                      {content.status !== 'rejected' && <button className="px-2 py-1 bg-red-600 text-white rounded text-xs" aria-label="거절" onClick={() => updateStatus(content.id, 'rejected')}>거절</button>}
                      {content.status !== 'deleted' && <button className="px-2 py-1 bg-gray-500 text-white rounded text-xs" aria-label="삭제" onClick={() => removeContent(content.id)}>삭제</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </AdminStatusMessage>
    </main>
  );
} 