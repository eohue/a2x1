"use client";
import React, { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/stores/useDashboardStore';

export default function AdminDashboardPage() {
  const { summary, loading, error, fetchSummary } = useDashboardStore();
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => { fetchSummary(); }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8" aria-label="Admin Dashboard">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" tabIndex={0} aria-label="통합 대시보드">통합 대시보드</h1>
        <p className="text-gray-600 mt-2" tabIndex={0} aria-label="관리자 주요 현황">회원, 활성도, 민원, 콘텐츠 현황을 한눈에 확인</p>
      </header>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded" role="alert" aria-live="assertive" tabIndex={-1} ref={errorRef}>{error}</div>
      )}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" aria-label="대시보드 위젯 영역">
        {/* 회원 현황 위젯 */}
        <article className="bg-white rounded-lg shadow p-6 flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" tabIndex={0} aria-label="회원 현황 카드" role="region" onClick={() => window.location.href='/admin/members'}>
          <h2 className="text-lg font-semibold mb-2">회원 현황</h2>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-blue-600">{loading ? '...' : summary?.users.total ?? '--'}</span>
            <span className="text-gray-500">명</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">총 회원 수</p>
        </article>
        {/* 활성도 위젯 */}
        <article className="bg-white rounded-lg shadow p-6 flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} aria-label="활성도" role="region">
          <h2 className="text-lg font-semibold mb-2">활성도</h2>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-green-600">{loading ? '...' : summary?.users.dau ?? '--'}</span>
            <span className="text-gray-500">DAU</span>
          </div>
          <div className="flex items-end space-x-2 mt-1">
            <span className="text-xl font-bold text-green-500">{loading ? '...' : summary?.users.mau ?? '--'}</span>
            <span className="text-gray-500">MAU</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">일/월간 활성 사용자</p>
        </article>
        {/* 민원 위젯 */}
        <article className="bg-white rounded-lg shadow p-6 flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" tabIndex={0} aria-label="민원 현황 카드" role="region" onClick={() => window.location.href='/admin/reports'}>
          <h2 className="text-lg font-semibold mb-2">민원 현황</h2>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-red-600">{loading ? '...' : summary?.reports.total ?? '--'}</span>
            <span className="text-gray-500">건</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">총 민원 수</p>
        </article>
        {/* 콘텐츠 현황 위젯 */}
        <article className="bg-white rounded-lg shadow p-6 flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" tabIndex={0} aria-label="콘텐츠 현황 카드" role="region" onClick={() => window.location.href='/admin/contents'}>
          <h2 className="text-lg font-semibold mb-2">콘텐츠 현황</h2>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-purple-600">{loading ? '...' : summary?.posts.total ?? '--'}</span>
            <span className="text-gray-500">개</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">게시물, 공지, 뉴스 등</p>
        </article>
      </section>
      <div className="mt-6 flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => fetchSummary()} disabled={loading} aria-label="대시보드 새로고침">새로고침</button>
      </div>
      <nav className="mt-8" aria-label="대시보드 내비게이션">
        <ul className="flex flex-wrap gap-4">
          <li><a href="/admin/members" className="underline text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0}>회원 관리 바로가기</a></li>
          <li><a href="/admin/reports" className="underline text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0}>민원 관리 바로가기</a></li>
          <li><a href="/admin/contents" className="underline text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0}>콘텐츠 관리 바로가기</a></li>
        </ul>
      </nav>
    </main>
  );
} 