"use client";
import React, { useEffect } from 'react';
import { useFcmToken } from '@/app/lib/useFcmToken';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export default function ResidentDashboardPage() {
  const { token, error, permission } = useFcmToken();
  const {
    notifications,
    loading: notifLoading,
    error: notifError,
    fetchNotifications,
    markAsRead,
    subscribeRealtime,
  } = useNotificationStore();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (user?.email) {
      subscribeRealtime(user.email);
    }
  }, [user, subscribeRealtime]);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">알림</h2>
        {notifLoading ? <div>알림 불러오는 중...</div> : notifError ? <div className="text-red-500">{notifError}</div> : notifications.length === 0 ? <div className="text-gray-500">알림이 없습니다.</div> : (
          <ul className="divide-y divide-gray-200 bg-white rounded shadow">
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
      <section className="max-w-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">입주민 대시보드</h1>
        <section className="mb-8 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">푸시 알림 구독</h2>
          <p className="text-sm mb-2">공지, 승인, 이벤트 등 주요 소식을 실시간으로 받아보세요.</p>
          <div className="flex gap-4 mb-2">
            {token ? (
              <span className="text-green-700">알림 구독 중</span>
            ) : (
              <span className="text-gray-500">알림 미구독</span>
            )}
          </div>
          <div className="text-xs text-gray-600">
            <div>권한 상태: <b>{permission}</b></div>
            {token && <div className="break-all">FCM 토큰: <span className="text-green-700">{token}</span></div>}
            {error && <div className="text-red-600">오류: {error}</div>}
            {!token && permission === 'denied' && <div className="text-red-600">브라우저 알림 권한이 거부되어 있습니다. 설정에서 허용해 주세요.</div>}
          </div>
        </section>
        <section className="mt-8">
          <h2 className="font-semibold mb-2">실시간 알림 테스트</h2>
          <p className="text-sm text-gray-600">푸시 알림이 오면 콘솔에 메시지가 출력됩니다.</p>
        </section>
      </section>
    </main>
  );
} 