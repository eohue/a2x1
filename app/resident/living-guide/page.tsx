"use client";
import React, { useEffect, useState } from 'react';
import { useLivingGuideStore, LivingGuide } from '../../../stores/useLivingGuideStore';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function LivingGuidePage() {
  const { guides, fetchGuides, loading, error, editingGuide } = useLivingGuideStore();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchGuides({ onlyApproved: true });
  }, [fetchGuides]);

  if (loading && !editingGuide) return <div className="p-8 text-center" role="status" aria-live="polite">{t('loading')}</div>;
  if (error) return <div className="p-8 text-red-500" role="alert">{t(error)}</div>;
  if (guides.length === 0) return <div className="p-8 text-center text-gray-500">{t('no_approved_guides')}</div>;

  // 섹션(목차) 리스트: title 가나다순 정렬
  const sortedGuides = [...guides].sort((a, b) => a.title.localeCompare(b.title, 'ko'));

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4" tabIndex={0}>{t('living_guide')}</h1>
      <nav aria-label={t('guide_toc')} className="mb-6 sticky top-0 z-10 bg-white/90 backdrop-blur border-b pb-2">
        <ul className="flex flex-wrap gap-2">
          {sortedGuides.map((g: LivingGuide) => (
            <li key={g.id}>
              <button
                className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${selectedGuide === g.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100'}`}
                onClick={() => setSelectedGuide(g.id)}
                aria-current={selectedGuide === g.id ? 'page' : undefined}
              >
                {g.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <section aria-live="polite">
        {selectedGuide ? (
          <GuideDetail id={selectedGuide} />
        ) : (
          <div className="text-gray-500">{t('select_section')}</div>
        )}
      </section>
    </main>
  );
}

function GuideDetail({ id }: { id: string }) {
  const {
    guides,
    editingGuide,
    editGuide,
    setEditingContent,
    saveGuide,
    submitForApproval,
    loading,
  } = useLivingGuideStore();
  const guide = guides.find((g: LivingGuide) => g.id === id);
  const [localContent, setLocalContent] = useState('');

  React.useEffect(() => {
    if (editingGuide && editingGuide.id === id) {
      setLocalContent(editingGuide.content);
    } else if (guide) {
      setLocalContent(guide.content);
    }
  }, [editingGuide, guide, id]);

  if (!guide) return <div>문서를 찾을 수 없습니다.</div>;

  const isEditing = !!editingGuide && editingGuide.id === id;

  return (
    <article className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-2">{guide.title}</h2>
      {isEditing ? (
        <>
          <div className="mb-2" data-color-mode="light">
            <MDEditor
              value={localContent}
              onChange={v => {
                setLocalContent(v || '');
                setEditingContent(v || '');
              }}
              height={300}
              preview="edit"
              textareaProps={{ 'aria-label': '생활백서 내용 편집' }}
              disabled={loading}
            />
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-secondary"
              aria-label={t('save')}
              onClick={saveGuide}
              disabled={loading || localContent === guide.content}
            >
              {t('save')}
            </button>
            <button
              className="btn btn-accent"
              aria-label={t('submit_for_approval')}
              onClick={submitForApproval}
              disabled={loading || guide.status === 'pending' || guide.status === 'approved'}
            >
              {t('submit_for_approval')}
            </button>
            <button
              className="btn btn-outline"
              aria-label={t('cancel')}
              onClick={() => setEditingContent(guide.content)}
              disabled={loading || localContent === guide.content}
            >
              {t('cancel')}
            </button>
            <span className="ml-auto text-xs text-gray-400">{t('status')}: {t(guide.status)}</span>
          </div>
        </>
      ) : (
        <>
          <div className="prose prose-sm max-w-none mb-4">
            <ReactMarkdown>{guide.content}</ReactMarkdown>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              aria-label={t('edit')}
              onClick={() => editGuide(id)}
              disabled={guide.status === 'pending' || guide.status === 'approved'}
            >
              {t('edit')}
            </button>
            <span className="ml-auto text-xs text-gray-400">{t('status')}: {t(guide.status)}</span>
          </div>
        </>
      )}
    </article>
  );
} 