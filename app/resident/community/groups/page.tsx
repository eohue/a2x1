"use client";
import React, { useEffect, useState } from 'react';
import { useGroupStore } from '@/stores/useGroupStore';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Loading } from '@/components/common/Loading';

export default function GroupListPage() {
  const {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    updateGroup,
    fetchMembers,
    members,
    removeMember,
    currentGroup,
    fetchGroup,
  } = useGroupStore();

  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', thumbnail_url: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editGroup, setEditGroup] = useState({ name: '', description: '', thumbnail_url: '' });

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // 그룹 생성 핸들러
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createGroup(newGroup);
    setShowCreate(false);
    setNewGroup({ name: '', description: '', thumbnail_url: '' });
  };

  // 그룹 수정 핸들러
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateGroup(editId, editGroup);
      setEditId(null);
    }
  };

  // 그룹 상세/멤버 보기
  const handleShowMembers = async (id: string) => {
    await fetchGroup(id);
    await fetchMembers(id);
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4" aria-label="소모임 목록">소모임(그룹) 목록</h1>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      <section aria-label="소모임 생성" className="mb-6">
        <Button onClick={() => setShowCreate((v) => !v)} aria-expanded={showCreate} aria-controls="create-group-form">
          {showCreate ? '취소' : '새 소모임 만들기'}
        </Button>
        {showCreate && (
          <form id="create-group-form" className="mt-2 flex flex-col gap-2" onSubmit={handleCreate}>
            <Input
              required
              aria-label="그룹명"
              placeholder="그룹명"
              value={newGroup.name}
              onChange={e => setNewGroup(g => ({ ...g, name: e.target.value }))}
            />
            <Input
              aria-label="설명"
              placeholder="설명"
              value={newGroup.description}
              onChange={e => setNewGroup(g => ({ ...g, description: e.target.value }))}
            />
            <Input
              aria-label="썸네일 URL"
              placeholder="썸네일 URL"
              value={newGroup.thumbnail_url}
              onChange={e => setNewGroup(g => ({ ...g, thumbnail_url: e.target.value }))}
            />
            <Button type="submit">생성</Button>
          </form>
        )}
      </section>

      <section aria-label="소모임 리스트">
        <ul className="divide-y">
          {groups.map((group) => (
            <li key={group.id} className="py-3 flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex-1">
                <span className="font-semibold">{group.name}</span>
                {group.description && <span className="ml-2 text-gray-500">{group.description}</span>}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => handleShowMembers(group.id)} aria-label="멤버 보기">멤버</Button>
                <Button onClick={() => joinGroup(group.id)} aria-label="참여">참여</Button>
                <Button onClick={() => leaveGroup(group.id)} aria-label="탈퇴">탈퇴</Button>
                <Button onClick={() => { setEditId(group.id); setEditGroup({ name: group.name, description: group.description || '', thumbnail_url: group.thumbnail_url || '' }); }} aria-label="수정">수정</Button>
                <Button onClick={() => deleteGroup(group.id)} aria-label="삭제" variant="danger">삭제</Button>
              </div>
              {editId === group.id && (
                <form className="mt-2 flex flex-col gap-2" onSubmit={handleEdit}>
                  <Input
                    required
                    aria-label="그룹명"
                    placeholder="그룹명"
                    value={editGroup.name}
                    onChange={e => setEditGroup(g => ({ ...g, name: e.target.value }))}
                  />
                  <Input
                    aria-label="설명"
                    placeholder="설명"
                    value={editGroup.description}
                    onChange={e => setEditGroup(g => ({ ...g, description: e.target.value }))}
                  />
                  <Input
                    aria-label="썸네일 URL"
                    placeholder="썸네일 URL"
                    value={editGroup.thumbnail_url}
                    onChange={e => setEditGroup(g => ({ ...g, thumbnail_url: e.target.value }))}
                  />
                  <Button type="submit">저장</Button>
                  <Button type="button" onClick={() => setEditId(null)} variant="secondary">취소</Button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 멤버 리스트/관리 */}
      {currentGroup && members.length > 0 && (
        <section aria-label="멤버 관리" className="mt-8">
          <h2 className="text-xl font-bold mb-2">{currentGroup.name} 멤버</h2>
          <ul className="divide-y">
            {members.map((m) => (
              <li key={m.id} className="py-2 flex items-center justify-between">
                <span>{m.name || m.id}</span>
                <Button onClick={() => removeMember(currentGroup.id, m.id)} aria-label="강퇴" variant="danger">강퇴</Button>
              </li>
            ))}
          </ul>
          <Button className="mt-2" onClick={() => { setEditId(null); setShowCreate(false); }} aria-label="닫기">닫기</Button>
        </section>
      )}
    </main>
  );
} 