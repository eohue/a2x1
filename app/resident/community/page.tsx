"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../../../../../components/Button';
import { Input } from '../../../../../components/Input';
import { FeedList } from './FeedList';
import { useFeedStore } from '@/stores/useFeedStore';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Loading } from '@/components/common/Loading';
import { useTranslations } from 'next-intl';

const MAX_CONTENT_LENGTH = 500;
const MAX_MEDIA_SIZE = 5 * 1024 * 1024; // 5MB

export default function CommunityFeedPage() {
  const t = useTranslations();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { feed, loading, error, fetchFeed, addPost } = useFeedStore();

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaError(null);
    const file = e.target.files?.[0] || null;
    if (file && file.size > MAX_MEDIA_SIZE) {
      setMediaError('파일 크기는 5MB 이하만 업로드할 수 있습니다.');
      setMedia(null);
      setMediaPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setMedia(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    } else {
      setMediaPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    // TODO: 실제 업로드/전송 API 연동
    addPost({
      author: '홍길동', // TODO: 실제 사용자 정보로 대체
      channel: '이벤트', // TODO: 실제 채널 선택값
      content,
      imageUrl: mediaPreview || undefined,
      videoUrl: undefined, // TODO: 실제 업로드 결과로 대체
    });
    setContent('');
    setMedia(null);
    setMediaPreview(null);
    setSuccessMsg('게시 완료!');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setSuccessMsg(null), 2000);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  return (
    <main className="max-w-2xl mx-auto py-8 px-2 sm:px-4 md:px-0">
      <h1 className="text-2xl font-bold mb-6" tabIndex={0} aria-label={t('community.feed')}>{t('community.feed')}</h1>
      {/* 소모임 채널 영역 */}
      <nav aria-label={t('community.channelNav')} className="mb-6 flex gap-2 overflow-x-auto">
        <button className="px-5 py-3 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring text-base md:text-lg min-w-[96px]" aria-label={t('community.channel.all')}>{t('community.channel.all')}</button>
        <button className="px-5 py-3 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring text-base md:text-lg min-w-[96px]" aria-label={t('community.channel.notice')}>{t('community.channel.notice')}</button>
        <button className="px-5 py-3 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring text-base md:text-lg min-w-[96px]" aria-label={t('community.channel.event')}>{t('community.channel.event')}</button>
        <button className="px-5 py-3 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring text-base md:text-lg min-w-[96px]" aria-label={t('community.channel.group')}>{t('community.channel.group')}</button>
      </nav>
      {/* 작성 폼 */}
      <section aria-label={t('community.writeSection')} className="mb-8 p-3 sm:p-4 border rounded bg-white shadow">
        <form className="flex flex-col gap-3" aria-label={t('community.writeForm')} onSubmit={handleSubmit}>
          <label htmlFor="feed-content" className="block text-sm font-medium mb-1">{t('community.content')} <span className="text-red-500">*</span></label>
          <textarea
            id="feed-content"
            ref={textareaRef}
            className="w-full min-h-[60px] p-2 border rounded focus:outline-none focus:ring text-base md:text-lg"
            placeholder={t('community.contentPlaceholder')}
            aria-label={t('community.contentInput')}
            required
            maxLength={MAX_CONTENT_LENGTH}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className="text-xs text-gray-400 text-right" aria-live="polite">
            {content.length} / {MAX_CONTENT_LENGTH}{t('common.chars')}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <label className="cursor-pointer text-sm text-blue-600 underline">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                aria-label={t('community.mediaUpload')}
                onChange={handleMediaChange}
              />
              {t('community.attachMedia')}
            </label>
            {mediaPreview && (
              <span className="ml-2">
                {media?.type.startsWith('image') ? (
                  <img src={mediaPreview} alt={t('community.previewImage')} className="w-16 h-12 object-cover rounded inline-block" />
                ) : (
                  <video src={mediaPreview} controls className="w-16 h-12 rounded inline-block" aria-label={t('community.previewMedia')} />
                )}
              </span>
            )}
            <Button type="submit" className="ml-auto" aria-label={t('common.submit')} disabled={!content.trim() || loading}>
              {loading ? t('common.submitting') : t('common.submit')}
            </Button>
          </div>
          <ErrorMessage message={mediaError || ''} />
          <div aria-live="polite" className="text-green-600 text-sm h-5">{successMsg}</div>
        </form>
      </section>
      {/* 피드 리스트 */}
      {loading && <Loading message={t('community.loadingFeed')} />}
      {error && <ErrorMessage message={error} />}
      <FeedList items={feed} />
    </main>
  );
} 