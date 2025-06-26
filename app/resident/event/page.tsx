"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useEventStore, Event } from '@/stores/useEventStore';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Loading } from '@/components/common/Loading';

const MAX_TITLE_LENGTH = 100;
const MAX_DESC_LENGTH = 500;

export default function ResidentEventPage() {
  const {
    events, currentEvent, loading, error,
    fetchEvents, fetchEvent, createEvent, joinEvent, _initSocket
  } = useEventStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', start_at: '', end_at: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchEvents(); _initSocket(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    if (!form.title.trim() || !form.start_at || !form.end_at) {
      setFormError('제목, 시작일, 종료일을 입력하세요.');
      return;
    }
    if (form.title.length > MAX_TITLE_LENGTH) {
      setFormError('제목은 100자 이내여야 합니다.');
      return;
    }
    if (form.description.length > MAX_DESC_LENGTH) {
      setFormError('설명은 500자 이내여야 합니다.');
      return;
    }
    await createEvent(form);
    setShowCreate(false);
    setForm({ title: '', description: '', start_at: '', end_at: '' });
    setSuccessMsg('이벤트 생성 완료!');
    setTimeout(() => setSuccessMsg(null), 2000);
    setTimeout(() => titleRef.current?.focus(), 100);
  };

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">이벤트/모임</h1>
      <div className="flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={() => setShowCreate(v => !v)}>
          {showCreate ? '목록으로' : '이벤트 생성'}
        </button>
      </div>
      {showCreate ? (
        <form className="bg-white rounded shadow p-4 mb-6" onSubmit={handleCreate} aria-label="이벤트 생성 폼">
          <h2 className="text-lg font-semibold mb-2">이벤트 생성</h2>
          <div className="mb-2">
            <label className="block mb-1" htmlFor="event-title">제목</label>
            <input
              id="event-title"
              ref={titleRef}
              className="input input-bordered w-full"
              value={form.title}
              maxLength={MAX_TITLE_LENGTH}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              aria-label="이벤트 제목 입력"
            />
            <div className="text-xs text-gray-400 text-right" aria-live="polite">{form.title.length} / {MAX_TITLE_LENGTH}자</div>
          </div>
          <div className="mb-2">
            <label className="block mb-1" htmlFor="event-desc">설명</label>
            <textarea
              id="event-desc"
              className="input input-bordered w-full"
              value={form.description}
              maxLength={MAX_DESC_LENGTH}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              aria-label="이벤트 설명 입력"
            />
            <div className="text-xs text-gray-400 text-right" aria-live="polite">{form.description.length} / {MAX_DESC_LENGTH}자</div>
          </div>
          <div className="mb-2 flex gap-2">
            <div className="flex-1">
              <label className="block mb-1" htmlFor="event-start">시작일</label>
              <input type="datetime-local" id="event-start" className="input input-bordered w-full" value={form.start_at} onChange={e => setForm(f => ({ ...f, start_at: e.target.value }))} required aria-label="이벤트 시작일 입력" />
            </div>
            <div className="flex-1">
              <label className="block mb-1" htmlFor="event-end">종료일</label>
              <input type="datetime-local" id="event-end" className="input input-bordered w-full" value={form.end_at} onChange={e => setForm(f => ({ ...f, end_at: e.target.value }))} required aria-label="이벤트 종료일 입력" />
            </div>
          </div>
          <ErrorMessage message={formError || ''} />
          <div aria-live="polite" className="text-green-600 text-sm h-5">{successMsg}</div>
          <button
            className="btn btn-primary w-full mt-2"
            type="submit"
            disabled={loading || !form.title.trim() || !form.start_at || !form.end_at}
            aria-label="이벤트 생성하기"
          >
            {loading ? '생성 중...' : '생성'}
          </button>
        </form>
      ) : selectedId ? (
        <EventDetail id={selectedId} onBack={() => setSelectedId(null)} />
      ) : (
        <EventList events={events} loading={loading} error={error} onSelect={setSelectedId} />
      )}
    </main>
  );
}

function EventList({ events, loading, error, onSelect }: { events: Event[]; loading: boolean; error: string | null; onSelect: (id: string) => void }) {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (events.length === 0) return <div className="py-8 text-gray-500 text-center">진행중인 이벤트가 없습니다.</div>;
  return (
    <ul className="space-y-3">
      {events.map(ev => (
        <li key={ev.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-2 cursor-pointer hover:bg-blue-50" onClick={() => onSelect(ev.id)} tabIndex={0} aria-label={ev.title}>
          <div className="flex-1">
            <div className="font-semibold text-lg">{ev.title}</div>
            <div className="text-gray-500 text-sm line-clamp-1">{ev.description}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(ev.start_at).toLocaleString()} ~ {new Date(ev.end_at).toLocaleString()}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-500">참여자 {ev.participants.length}명</span>
            <span className={`text-xs rounded px-2 py-0.5 ${new Date(ev.end_at) < new Date() ? 'bg-gray-300' : 'bg-green-200'}`}>{new Date(ev.end_at) < new Date() ? '종료' : '진행중'}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function EventDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { currentEvent, fetchEvent, joinEvent, loading, error } = useEventStore();
  useEffect(() => { fetchEvent(id); }, [id]);
  if (loading || !currentEvent) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  const isEnded = new Date(currentEvent.end_at) < new Date();
  return (
    <article className="bg-white rounded shadow p-4">
      <button className="mb-2 text-primary-600 underline" onClick={onBack}>← 목록으로</button>
      <h2 className="text-xl font-bold mb-2">{currentEvent.title}</h2>
      <div className="mb-2 text-gray-600">{currentEvent.description}</div>
      <div className="mb-2 text-xs text-gray-400">{new Date(currentEvent.start_at).toLocaleString()} ~ {new Date(currentEvent.end_at).toLocaleString()}</div>
      <div className="mb-2 text-sm">참여자: {currentEvent.participants.map(p => p.name || p.id).join(', ') || '없음'}</div>
      <button
        className="btn btn-primary mt-2"
        onClick={() => joinEvent(currentEvent.id)}
        disabled={isEnded || loading}
      >
        {isEnded ? '종료됨' : '참여하기'}
      </button>
    </article>
  );
} 