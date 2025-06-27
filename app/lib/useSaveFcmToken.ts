import { useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export function useSaveFcmToken() {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const saveFcmToken = useCallback(async (fcmToken: string) => {
    if (!isAuthenticated || !token) {
      setError('로그인이 필요합니다.');
      setSuccess(false);
      return;
    }
    if (!fcmToken) {
      setError('FCM 토큰이 유효하지 않습니다.');
      setSuccess(false);
      return;
    }
    if (lastSaved === fcmToken) {
      setSuccess(true);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/users/fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: fcmToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'FCM 토큰 저장에 실패했습니다.');
      }
      setSuccess(true);
      setLastSaved(fcmToken);
    } catch (e: any) {
      setError(e?.message || 'FCM 토큰 저장 중 오류가 발생했습니다.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, lastSaved]);

  return { saveFcmToken, loading, success, error };
} 