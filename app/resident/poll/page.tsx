"use client";
import React, { useEffect, useState, useRef } from 'react';
import { usePollStore, Poll, PollOption } from '@/stores/usePollStore';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Loading } from '@/components/common/Loading';

const MAX_TITLE_LENGTH = 100;
const MAX_OPTION_LENGTH = 100;

export default function ResidentPollPage() {
  const {
    polls, currentPoll, loading, error,
    fetchPolls, fetchPoll, createPoll, vote, getResults, _initSocket
  } = usePollStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<{ title: string; options: PollOption[] }>({ title: '', options: [{ id: '', text: '' }, { id: '', text: '' }] });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPolls(); _initSocket(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    if (!form.title.trim() || form.options.some(opt => !opt.text.trim())) {
      setFormError('질문과 모든 선택지를 입력하세요.');
      return;
    }
    if (form.title.length > MAX_TITLE_LENGTH) {
      setFormError('질문은 100자 이내여야 합니다.');
      return;
    }
    if (form.options.some(opt => opt.text.length > MAX_OPTION_LENGTH)) {
      setFormError('선택지는 100자 이내여야 합니다.');
      return;
    }
    // 각 옵션에 고유 id 부여
    const options = form.options.map(opt => ({ ...opt, id: opt.id || crypto.randomUUID() }));
    await createPoll({ title: form.title, description: '', options });
    setShowCreate(false);
    setForm({ title: '', options: [{ id: '', text: '' }, { id: '', text: '' }] });
    setSuccessMsg('투표 생성 완료!');
    setTimeout(() => setSuccessMsg(null), 2000);
    setTimeout(() => titleRef.current?.focus(), 100);
  };

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">투표</h1>
      <div className="flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={() => setShowCreate(v => !v)}>
          {showCreate ? '목록으로' : '투표 생성'}
        </button>
      </div>
      {showCreate ? (
        <form className="bg-white rounded shadow p-4 mb-6" onSubmit={handleCreate} aria-label="투표 생성 폼">
          <h2 className="text-lg font-semibold mb-2">투표 생성</h2>
          <div className="mb-2">
            <label className="block mb-1" htmlFor="poll-title">질문</label>
            <input
              id="poll-title"
              ref={titleRef}
              className="input input-bordered w-full"
              value={form.title}
              maxLength={MAX_TITLE_LENGTH}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              aria-label="투표 질문 입력"
            />
            <div className="text-xs text-gray-400 text-right" aria-live="polite">{form.title.length} / {MAX_TITLE_LENGTH}자</div>
          </div>
          <div className="mb-2">
            <label className="block mb-1">선택지</label>
            {form.options.map((opt, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input
                  className="input input-bordered flex-1"
                  value={opt.text}
                  maxLength={MAX_OPTION_LENGTH}
                  onChange={e => setForm(f => ({ ...f, options: f.options.map((o, idx) => idx === i ? { ...o, text: e.target.value } : o) }))}
                  required
                  aria-label={`선택지 ${i + 1} 입력`}
                />
                <div className="text-xs text-gray-400 w-16 text-right" aria-live="polite">{opt.text.length} / {MAX_OPTION_LENGTH}자</div>
                {form.options.length > 2 && (
                  <button type="button" className="btn btn-xs btn-outline" onClick={() => setForm(f => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }))}>-</button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-xs btn-secondary mt-1" onClick={() => setForm(f => ({ ...f, options: [...f.options, { id: '', text: '' }] }))}>+ 선택지 추가</button>
          </div>
          <ErrorMessage message={formError || ''} />
          <div aria-live="polite" className="text-green-600 text-sm h-5">{successMsg}</div>
          <button
            className="btn btn-primary w-full mt-2"
            type="submit"
            disabled={loading || !form.title.trim() || form.options.some(opt => !opt.text.trim())}
            aria-label="투표 생성하기"
          >
            {loading ? '생성 중...' : '생성'}
          </button>
        </form>
      ) : selectedId ? (
        <PollDetail id={selectedId} onBack={() => setSelectedId(null)} />
      ) : (
        <PollList polls={polls} loading={loading} error={error} onSelect={setSelectedId} />
      )}
    </main>
  );
}

function PollList({ polls, loading, error, onSelect }: { polls: Poll[]; loading: boolean; error: string | null; onSelect: (id: string) => void }) {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (polls.length === 0) return <div className="py-8 text-gray-500 text-center">진행중인 투표가 없습니다.</div>;
  return (
    <ul className="space-y-3">
      {polls.map(poll => (
        <li key={poll.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-2 cursor-pointer hover:bg-blue-50" onClick={() => onSelect(poll.id)} tabIndex={0} aria-label={poll.title}>
          <div className="flex-1">
            <div className="font-semibold text-lg">{poll.title}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(poll.created_at).toLocaleString()}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PollDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { currentPoll, fetchPoll, vote, loading, error, getResults, results } = usePollStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  useEffect(() => { fetchPoll(id); setVoted(false); getResults(id); }, [id]);
  if (loading || !currentPoll) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  const totalVotes = currentPoll.votes.length;
  const hasVoted = currentPoll.votes.some(v => v.userId === (typeof window !== 'undefined' ? localStorage.getItem('userId') : '')) || voted;
  return (
    <article className="bg-white rounded shadow p-4">
      <button className="mb-2 text-primary-600 underline" onClick={onBack}>← 목록으로</button>
      <h2 className="text-xl font-bold mb-2">{currentPoll.title}</h2>
      {hasVoted ? (
        <div className="mb-2 text-green-700 font-semibold">투표가 완료되었습니다.</div>
      ) : null}
      <form className="mb-4" onSubmit={async e => { e.preventDefault(); if (selected) { await vote(id, selected); setVoted(true); getResults(id); } }}>
        {currentPoll.options.map(opt => (
          <label key={opt.id} className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              name="option"
              value={opt.id}
              checked={selected === opt.id}
              onChange={() => setSelected(opt.id)}
              disabled={hasVoted}
            />
            <span>{opt.text}</span>
            <span className="text-xs text-gray-400">
              ({results?.results.find(r => r.optionId === opt.id)?.votes ?? 0}표)
            </span>
          </label>
        ))}
        {!hasVoted && (
          <button className="btn btn-primary w-full mt-2" type="submit" disabled={!selected || loading}>투표하기</button>
        )}
      </form>
      <div className="mb-2 text-xs text-gray-500">총 투표수: {results?.results.reduce((sum, r) => sum + r.votes, 0) ?? 0}</div>
      <div className="space-y-1">
        {currentPoll.options.map(opt => {
          const voteCount = results?.results.find(r => r.optionId === opt.id)?.votes ?? 0;
          const total = results?.results.reduce((sum, r) => sum + r.votes, 0) ?? 0;
          return (
            <div key={opt.id} className="flex items-center gap-2">
              <div className="w-24 truncate">{opt.text}</div>
              <div className="flex-1 bg-gray-100 rounded h-3">
                <div className="bg-blue-400 h-3 rounded" style={{ width: total ? `${(voteCount/total)*100}%` : '0%' }} />
              </div>
              <div className="w-8 text-right text-xs">{voteCount}표</div>
            </div>
          );
        })}
      </div>
    </article>
  );
} 