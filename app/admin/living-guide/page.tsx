"use client";
import React, { useEffect, useState } from "react";
import { useLivingGuideStore, LivingGuide } from '../../../stores/useLivingGuideStore';
import { useNotificationStore } from '../../../stores/useNotificationStore';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useTranslations } from 'next-intl';

const STATUS_LABELS: Record<LivingGuide["status"], string> = {
  draft: '작성중',
  pending: '승인대기',
  approved: '승인됨',
  rejected: '거절됨',
};

export default function AdminLivingGuidePage() {
  const { guides, fetchGuides, loading, error } = useLivingGuideStore();
  const { notifications, fetchNotifications, loading: notifLoading, error: notifError, markAsRead } = useNotificationStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newLoading, setNewLoading] = useState(false);
  const [newError, setNewError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('common');

  useEffect(() => { fetchGuides(); }, [fetchGuides]);
  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // 섹션(목차) 리스트: title 가나다순 정렬
  const sortedGuides = [...guides].sort((a, b) => a.title.localeCompare(b.title, 'ko'));

  const handleApprove = async (id: string) => {
    setActionLoading(true); setActionError(null);
    try {
      const res = await fetch(`/api/living-guide/${id}/approve`, { method: 'PATCH' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      await fetchGuides();
    } catch (e: any) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  };
  const handleReject = async (id: string) => {
    setActionLoading(true); setActionError(null);
    try {
      const res = await fetch(`/api/living-guide/${id}/reject`, { method: 'PATCH' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      await fetchGuides();
    } catch (e: any) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  };
  const handleCreate = async () => {
    setNewLoading(true); setNewError(null);
    try {
      const res = await fetch('/api/living-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setShowNew(false); setNewTitle(''); setNewContent('');
      await fetchGuides();
    } catch (e: any) {
      setNewError(e.message);
    } finally {
      setNewLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 이 섹션(문서)을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    setActionLoading(true); setActionError(null);
    try {
      const res = await fetch(`/api/living-guide/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setSelectedId(null);
      await fetchGuides();
    } catch (e: any) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4" tabIndex={0}>{t('admin_living_guide_approval')}</h1>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">{t('notifications')}</h2>
        {notifLoading ? <div>알림 불러오는 중...</div> : notifError ? <div className="text-red-500">{notifError}</div> : notifications.length === 0 ? <div className="text-gray-500">알림이 없습니다.</div> : (
          <ul className="divide-y divide-gray-200 bg-white rounded shadow" aria-live="polite" role="list">
            {notifications.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)).map(n => (
              <li key={n.id} className={`p-3 flex items-center gap-2 ${n.is_read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <span className={`w-2 h-2 rounded-full ${n.is_read ? 'bg-gray-300' : 'bg-blue-500'}`} aria-label={n.is_read ? '읽음' : '안읽음'}></span>
                <button
                  className="text-left flex-1 hover:underline"
                  onClick={async () => {
                    if (!n.is_read) await markAsRead(n.id);
                    if (n.link) router.push(n.link);
                  }}
                  aria-label={n.content}
                >
                  {n.content}
                </button>
                <span className="text-xs text-gray-400 ml-2">{n.created_at.slice(0, 16).replace('T', ' ')}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <nav aria-label={t('guide_toc')} className="mb-6 sticky top-0 z-10 bg-white/90 backdrop-blur border-b pb-2 flex flex-wrap gap-2 items-center">
        <ul className="flex flex-wrap gap-2">
          {sortedGuides.map((g: LivingGuide) => (
            <li key={g.id}>
              <button
                className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${selectedId === g.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100'}`}
                onClick={() => setSelectedId(g.id)}
                aria-current={selectedId === g.id ? 'page' : undefined}
              >
                {g.title}
              </button>
            </li>
          ))}
        </ul>
        <button className="ml-4 px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium" onClick={() => setShowNew(v => !v)} aria-label={t('add_section')}>
          + {t('add_section')}
        </button>
      </nav>
      {showNew && (
        <section className="mb-6 bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">{t('add_section')}</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">{t('section_title')}</label>
            <input className="border rounded px-3 py-2 w-full" value={newTitle} onChange={e => setNewTitle(e.target.value)} aria-label={t('section_title')} />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">{t('section_content')}</label>
            <textarea className="border rounded px-3 py-2 w-full min-h-[100px]" value={newContent} onChange={e => setNewContent(e.target.value)} aria-label={t('section_content')} />
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleCreate} type="button" disabled={newLoading || !newTitle.trim()} aria-label={t('save')}>{t('save')}</button>
            <button className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500" onClick={() => { setShowNew(false); setNewTitle(''); setNewContent(''); }} type="button" aria-label={t('cancel')}>{t('cancel')}</button>
          </div>
          {newError && <div className="text-red-500 mt-2">{newError}</div>}
        </section>
      )}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded" role="alert">{error}</div>}
      {actionError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded" role="alert">{actionError}</div>}
      <section className="mb-8">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded shadow" aria-label={t('guide_list_table')}>
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">제목</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">상태</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">작성자</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">수정일</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">로딩 중...</td></tr>
            ) : guides.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">생활백서 문서가 없습니다.</td></tr>
            ) : guides.map(g => (
              <tr key={g.id} className={selectedId === g.id ? 'bg-blue-50' : ''}>
                <td className="px-4 py-2 cursor-pointer" onClick={() => setSelectedId(g.id)}>{g.title}</td>
                <td className="px-4 py-2">{STATUS_LABELS[g.status]}</td>
                <td className="px-4 py-2">{g.created_by?.name || g.created_by?.id}</td>
                <td className="px-4 py-2">{g.updated_at?.slice(0, 10)}</td>
                <td className="px-4 py-2 flex gap-2 flex-wrap">
                  {g.status === 'pending' && <>
                    <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" disabled={actionLoading} onClick={() => handleApprove(g.id)} aria-label={t('approve')}>{t('approve')}</button>
                    <button className="px-2 py-1 bg-red-600 text-white rounded text-xs" disabled={actionLoading} onClick={() => handleReject(g.id)} aria-label={t('reject')}>{t('reject')}</button>
                  </>}
                  <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs" onClick={() => setSelectedId(g.id)} aria-label={t('detail')}>{t('detail')}</button>
                  <button className="px-2 py-1 bg-gray-500 text-white rounded text-xs" onClick={() => handleDelete(g.id)} disabled={actionLoading} aria-label={t('delete')}>{t('delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section aria-label={t('guide_detail')}>
        {selectedId && <GuideDetail id={selectedId} />}
      </section>
    </main>
  );
}

function GuideDetail({ id }: { id: string }) {
  const t = useTranslations('common');
  const { guides } = useLivingGuideStore();
  const guide = guides.find((g: LivingGuide) => g.id === id);
  const [history, setHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [rollbackLoading, setRollbackLoading] = React.useState(false);
  const [rollbackError, setRollbackError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true); setError(null);
    fetch(`/api/living-guide/${id}/history`)
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setHistory(json.data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRollback = async (version: number) => {
    setRollbackLoading(true); setRollbackError(null);
    try {
      const res = await fetch(`/api/living-guide/${id}/rollback/${version}`, { method: 'PATCH' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      window.location.reload();
    } catch (e: any) {
      setRollbackError(e.message);
    } finally {
      setRollbackLoading(false);
    }
  };

  if (!guide) return <div>문서를 찾을 수 없습니다.</div>;
  return (
    <article className="bg-white rounded shadow p-4 mb-8">
      <h2 className="text-xl font-semibold mb-2">{guide.title}</h2>
      <div className="prose prose-sm max-w-none mb-4">
        <ReactMarkdown>{guide.content}</ReactMarkdown>
      </div>
      <div className="flex gap-2 text-xs text-gray-500 mb-4">
        <span>상태: {STATUS_LABELS[guide.status]}</span>
        <span>버전: {guide.version}</span>
        <span>작성자: {guide.created_by?.name || guide.created_by?.id}</span>
        {guide.approved_by && <span>승인자: {guide.approved_by?.name || guide.approved_by?.id}</span>}
        {guide.approved_at && <span>승인일: {guide.approved_at?.slice(0, 10)}</span>}
      </div>
      <section className="mt-6">
        <h3 className="text-lg font-semibold mb-2">{t('change_history')}</h3>
        {loading ? <div>이력 로딩 중...</div> : error ? <div className="text-red-500">{error}</div> : history.length === 0 ? <div>이력이 없습니다.</div> : (
          <table className="min-w-full text-xs border" aria-label={t('history_table')}>
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1">버전</th>
                <th className="px-2 py-1">유형</th>
                <th className="px-2 py-1">상태</th>
                <th className="px-2 py-1">변경자</th>
                <th className="px-2 py-1">변경일</th>
                <th className="px-2 py-1">내용</th>
                <th className="px-2 py-1">액션</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={h.id} className={h.version === guide.version ? 'bg-blue-50' : ''}>
                  <td className="px-2 py-1 text-center">{h.version}</td>
                  <td className="px-2 py-1 text-center">{h.change_type}</td>
                  <td className="px-2 py-1 text-center">{h.status}</td>
                  <td className="px-2 py-1 text-center">{h.changed_by?.name || h.changed_by?.id}</td>
                  <td className="px-2 py-1 text-center">{h.changed_at?.slice(0, 19).replace('T', ' ')}</td>
                  <td className="px-2 py-1 max-w-xs truncate" title={h.content}>{h.content.slice(0, 40)}{h.content.length > 40 ? '...' : ''}</td>
                  <td className="px-2 py-1 text-center">
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
                      disabled={rollbackLoading || h.version === guide.version}
                      onClick={() => handleRollback(h.version)}
                      aria-label={t('rollback')}
                    >
                      {t('rollback')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {rollbackError && <div className="text-red-500 mt-2">{rollbackError}</div>}
      </section>
    </article>
  );
} 