import { useEffect, useState, useCallback } from 'react';
import { getFirebaseMessaging } from './firebase';
import { getToken, onMessage, isSupported } from 'firebase/messaging';

export function useFcmToken() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [message, setMessage] = useState<any>(null);

  const requestPermissionAndToken = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) {
      setError('이 브라우저는 푸시 알림을 지원하지 않습니다.');
      return;
    }
    setPermission(Notification.permission);
    if (Notification.permission === 'default') {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
      } catch (e) {
        setError('알림 권한 요청에 실패했습니다.');
        return;
      }
    }
    if (Notification.permission !== 'granted') {
      setError('알림 권한이 허용되지 않았습니다.');
      return;
    }
    if (!(await isSupported())) {
      setError('이 브라우저는 FCM을 지원하지 않습니다.');
      return;
    }
    try {
      const messaging = getFirebaseMessaging();
      if (!messaging) {
        setError('FCM 초기화에 실패했습니다.');
        return;
      }
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      setToken(fcmToken);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'FCM 토큰 발급에 실패했습니다.');
    }
  }, []);

  useEffect(() => {
    requestPermissionAndToken();
    // Foreground 메시지 수신 핸들러
    let unsubscribe: (() => void) | undefined;
    isSupported().then((supported) => {
      if (supported) {
        const messaging = getFirebaseMessaging();
        if (messaging) {
          unsubscribe = onMessage(messaging, (payload) => {
            setMessage(payload);
          });
        }
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { token, error, permission, message, refresh: requestPermissionAndToken };
} 