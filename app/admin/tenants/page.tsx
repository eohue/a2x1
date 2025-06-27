"use client";
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface Tenant {
  id: string;
  name: string;
  description?: string;
  address?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Post {
  id: string;
  title: string;
  user?: { name: string };
  created_at: string;
}

interface Report {
  id: string;
  type: string;
  content: string;
  status: string;
  created_at: string;
}

export default function TenantAdminPage() {
  const t = useTranslations();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // 테넌트 목록 불러오기
  const fetchTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tenants');
      if (!res.ok) throw new Error('Failed to fetch tenants');
      const data = await res.json();
      setTenants(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // 테넌트 추가
  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, address }),
      });
      if (!res.ok) throw new Error('Failed to add tenant');
      setName('');
      setDescription('');
      setAddress('');
      fetchTenants();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 선택된 테넌트의 사용자 목록 불러오기
  const fetchUsers = async (tenantId: string) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const res = await fetch(`/api/users?tenant_id=${tenantId}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (e: any) {
      setUsersError(e.message);
    } finally {
      setUsersLoading(false);
    }
  };

  // 선택된 테넌트의 게시물 목록 불러오기
  const fetchPosts = async (tenantId: string) => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      const res = await fetch(`/api/posts?tenant_id=${tenantId}`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);
    } catch (e: any) {
      setPostsError(e.message);
    } finally {
      setPostsLoading(false);
    }
  };

  // 선택된 테넌트의 리포트 목록 불러오기
  const fetchReports = async (tenantId: string) => {
    setReportsLoading(true);
    setReportsError(null);
    try {
      const res = await fetch(`/api/reports?tenant_id=${tenantId}`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      setReports(data);
    } catch (e: any) {
      setReportsError(e.message);
    } finally {
      setReportsLoading(false);
    }
  };

  // 테넌트 클릭 시 사용자/게시물/리포트 목록 조회
  const handleTenantClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    fetchUsers(tenant.id);
    fetchPosts(tenant.id);
    fetchReports(tenant.id);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('admin.tenants.title', { defaultValue: '단지(테넌트) 관리' })}</h1>
      <form onSubmit={handleAddTenant} className="mb-6 space-y-2">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder={t('admin.tenants.name', { defaultValue: '단지명' })} required />
        <Input value={description} onChange={e => setDescription(e.target.value)} placeholder={t('admin.tenants.description', { defaultValue: '설명' })} />
        <Input value={address} onChange={e => setAddress(e.target.value)} placeholder={t('admin.tenants.address', { defaultValue: '주소' })} />
        <Button type="submit" disabled={loading}>{t('admin.tenants.add', { defaultValue: '단지 추가' })}</Button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div>
        <h2 className="font-semibold mb-2">{t('admin.tenants.list', { defaultValue: '단지 목록' })}</h2>
        {loading ? (
          <div>{t('common.loading', { defaultValue: '로딩 중...' })}</div>
        ) : (
          <ul className="space-y-2">
            {tenants.map(tenant => (
              <li
                key={tenant.id}
                className={`border p-2 rounded cursor-pointer ${selectedTenant?.id === tenant.id ? 'bg-blue-100' : ''}`}
                onClick={() => handleTenantClick(tenant)}
                aria-selected={selectedTenant?.id === tenant.id}
                tabIndex={0}
              >
                <div className="font-bold">{tenant.name}</div>
                <div className="text-sm text-gray-600">{tenant.description}</div>
                <div className="text-xs text-gray-400">{tenant.address}</div>
              </li>
            ))}
            {tenants.length === 0 && <div>{t('admin.tenants.empty', { defaultValue: '등록된 단지가 없습니다.' })}</div>}
          </ul>
        )}
      </div>
      {/* 선택된 테넌트의 사용자 목록 */}
      {selectedTenant && (
        <>
          <div className="mt-8">
            <h3 className="font-semibold mb-2">{t('admin.tenants.users', { defaultValue: '사용자 목록' })} - {selectedTenant.name}</h3>
            {usersLoading ? (
              <div>{t('common.loading', { defaultValue: '로딩 중...' })}</div>
            ) : usersError ? (
              <div className="text-red-500">{usersError}</div>
            ) : (
              <ul className="space-y-1">
                {users.map(user => (
                  <li key={user.id} className="border-b py-1">
                    <span className="font-medium">{user.name}</span> <span className="text-xs text-gray-500">({user.email})</span> <span className="text-xs">[{user.role}]</span> <span className="text-xs text-gray-400">{user.status}</span>
                  </li>
                ))}
                {users.length === 0 && <div>{t('admin.tenants.users.empty', { defaultValue: '등록된 사용자가 없습니다.' })}</div>}
              </ul>
            )}
          </div>
          {/* 게시물(콘텐츠) 목록 */}
          <div className="mt-8">
            <h3 className="font-semibold mb-2">{t('admin.tenants.posts', { defaultValue: '게시물 목록' })} - {selectedTenant.name}</h3>
            {postsLoading ? (
              <div>{t('common.loading', { defaultValue: '로딩 중...' })}</div>
            ) : postsError ? (
              <div className="text-red-500">{postsError}</div>
            ) : (
              <ul className="space-y-1">
                {posts.map(post => (
                  <li key={post.id} className="border-b py-1">
                    <span className="font-medium">{post.title}</span> <span className="text-xs text-gray-500">{post.user?.name && `by ${post.user.name}`}</span> <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
                {posts.length === 0 && <div>{t('admin.tenants.posts.empty', { defaultValue: '등록된 게시물이 없습니다.' })}</div>}
              </ul>
            )}
          </div>
          {/* 리포트(민원) 목록 */}
          <div className="mt-8">
            <h3 className="font-semibold mb-2">{t('admin.tenants.reports', { defaultValue: '민원 목록' })} - {selectedTenant.name}</h3>
            {reportsLoading ? (
              <div>{t('common.loading', { defaultValue: '로딩 중...' })}</div>
            ) : reportsError ? (
              <div className="text-red-500">{reportsError}</div>
            ) : (
              <ul className="space-y-1">
                {reports.map(report => (
                  <li key={report.id} className="border-b py-1">
                    <span className="font-medium">{report.type}</span> <span className="text-xs text-gray-500">{report.content}</span> <span className="text-xs text-gray-400">{report.status}</span> <span className="text-xs text-gray-400">{new Date(report.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
                {reports.length === 0 && <div>{t('admin.tenants.reports.empty', { defaultValue: '등록된 민원이 없습니다.' })}</div>}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
} 