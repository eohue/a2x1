"use client";
import React, { useEffect, useState } from 'react';
import { usePollStore, Poll, PollOption } from '@/stores/usePollStore';

export default function AdminPollPage() {
  const {
    polls, currentPoll, loading, error,
    fetchPolls, fetchPoll, createPoll, getResults, results, _initSocket
  } = usePollStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<{ title: string; options: PollOption[] }>({ title: '', options: [{ id: '', text: '' }, { id: '', text: '' }] });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => { fetchPolls(); _initSocket(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.title || form.options.some(opt => !opt.text)) {
      setFormError('질문과 모든 선택지를 입력하세요.');
      return;
    }
    const options = form.options.map(opt => ({ ...opt, id: opt.id || crypto.randomUUID() }));
    await createPoll({ title: form.title, description: '', options });
    setShowCreate(false);
    setForm({ title: '', options: [{ id: '', text: '' }, { id: '', text: '' }] });
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">투표 관리</h1>
      <div className="flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={() => setShowCreate(v => !v)}>
          {showCreate ? '목록으로' : '투표 생성'}
        </button>
      </div>
      {showCreate ? (
        <form className="bg-white rounded shadow p-4 mb-6" onSubmit={handleCreate}>
          <h2 className="text-lg font-semibold mb-2">투표 생성</h2>
          <div className="mb-2">
            <label className="block mb-1">질문</label>
            <input className="input input-bordered w-full" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="mb-2">
            <label className="block mb-1">선택지</label>
            {form.options.map((opt, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input className="input input-bordered flex-1" value={opt.text} onChange={e => setForm(f => ({ ...f, options: f.options.map((o, idx) => idx === i ? { ...o, text: e.target.value } : o) }))} required />
                {form.options.length > 2 && (
                  <button type="button" className="btn btn-xs btn-outline" onClick={() => setForm(f => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }))}>-</button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-xs btn-secondary mt-1" onClick={() => setForm(f => ({ ...f, options: [...f.options, { id: '', text: '' }] }))}>+ 선택지 추가</button>
          </div>
          {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
          <button className="btn btn-primary w-full mt-2" type="submit" disabled={loading}>생성</button>
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
  if (loading) return <div className="py-8 text-center">로딩 중...</div>;
  if (error) return <div className="py-8 text-red-500">{error}</div>;
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
  const { currentPoll, fetchPoll, loading, error, getResults, results } = usePollStore();
  useEffect(() => { fetchPoll(id); getResults(id); }, [id]);
  if (loading || !currentPoll) return <div className="py-8 text-center">로딩 중...</div>;
  if (error) return <div className="py-8 text-red-500">{error}</div>;
  return (
    <article className="bg-white rounded shadow p-4">
      <button className="mb-2 text-primary-600 underline" onClick={onBack}>← 목록으로</button>
      <h2 className="text-xl font-bold mb-2">{currentPoll.title}</h2>
      <div className="mb-2 text-xs text-gray-500">생성일: {new Date(currentPoll.created_at).toLocaleString()}</div>
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