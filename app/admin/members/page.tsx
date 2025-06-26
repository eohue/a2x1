"use client";
import React, { useEffect, useState } from "react";
import { useMemberStore, UserRole, UserStatus } from '@/stores/useMemberStore';
import { AdminStatusMessage } from '@/components/admin/common/AdminStatusMessage';

const ROLE_LABELS: Record<UserRole, string> = {
  resident: '입주민',
  admin: '관리자',
  manager: '매니저',
  super: '최고관리자',
};
const STATUS_LABELS: Record<UserStatus, string> = {
  pending: '승인대기',
  approved: '승인됨',
  rejected: '거절됨',
  expelled: '퇴거',
};

export default function AdminMembersPage() {
  const {
    members, loading, error, q, status, role,
    setQ, setStatus, setRole, fetchMembers,
    approve, reject, expel, changeRole
  } = useMemberStore();
  const [roleEditId, setRoleEditId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('resident');

  useEffect(() => { fetchMembers(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMembers();
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8" aria-label="회원 관리">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" tabIndex={0} aria-label="회원 관리">회원 관리</h1>
        <p className="text-gray-600 mt-2" tabIndex={0} aria-label="회원 승인, 권한, 퇴거 등">회원 승인, 권한 변경, 퇴거 처리를 할 수 있습니다.</p>
      </header>
      <form className="mb-6 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-end" onSubmit={handleSearch}>
        <label htmlFor="search" className="text-sm font-medium">검색</label>
        <input id="search" name="search" type="text" className="border rounded px-3 py-2 w-full md:w-64" placeholder="이름, 이메일 등" aria-label="회원 검색" value={q} onChange={e => setQ(e.target.value)} />
        <select className="border rounded px-2 py-2" aria-label="상태 필터" value={status} onChange={e => setStatus(e.target.value as UserStatus | '')}>
          <option value="">전체 상태</option>
          <option value="pending">승인대기</option>
          <option value="approved">승인됨</option>
          <option value="rejected">거절됨</option>
          <option value="expelled">퇴거</option>
        </select>
        <select className="border rounded px-2 py-2" aria-label="권한 필터" value={role} onChange={e => setRole(e.target.value as UserRole | '')}>
          <option value="">전체 권한</option>
          <option value="resident">입주민</option>
          <option value="admin">관리자</option>
          <option value="manager">매니저</option>
          <option value="super">최고관리자</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="검색" disabled={loading}>검색</button>
      </form>
      <AdminStatusMessage loading={loading} error={error} empty={members.length === 0 ? '회원이 없습니다.' : undefined}>
        <section aria-label="회원 목록">
          <div className="overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">이름</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">이메일</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">권한</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">상태</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">가입일</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">액션</th>
                </tr>
              </thead>
              <tbody>
                {members.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {roleEditId === user.id ? (
                        <span className="flex gap-1 items-center">
                          <select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className="border rounded px-2 py-1 text-xs">
                            {Object.keys(ROLE_LABELS).map(r => <option key={r} value={r}>{ROLE_LABELS[r as UserRole]}</option>)}
                          </select>
                          <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs" onClick={async () => { await changeRole(user.id, newRole); setRoleEditId(null); }}>저장</button>
                          <button className="px-2 py-1 bg-gray-400 text-white rounded text-xs" onClick={() => setRoleEditId(null)}>취소</button>
                        </span>
                      ) : (
                        <span className="flex gap-1 items-center">
                          {ROLE_LABELS[user.role]}
                          <button className="ml-1 px-1 py-0.5 bg-yellow-500 text-white rounded text-xs" aria-label="권한 변경" onClick={() => { setRoleEditId(user.id); setNewRole(user.role); }}>변경</button>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">{STATUS_LABELS[user.status]}</td>
                    <td className="px-4 py-2">{user.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-2 flex gap-2 flex-wrap">
                      {user.status === 'pending' && <>
                        <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" aria-label="승인" onClick={() => approve(user.id)}>승인</button>
                        <button className="px-2 py-1 bg-red-600 text-white rounded text-xs" aria-label="거절" onClick={() => reject(user.id)}>거절</button>
                      </>}
                      {user.status !== 'expelled' && <button className="px-2 py-1 bg-gray-500 text-white rounded text-xs" aria-label="퇴거" onClick={() => expel(user.id)}>퇴거</button>}
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