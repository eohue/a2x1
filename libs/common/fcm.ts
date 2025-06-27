import axios from 'axios';

const FCM_ENDPOINT = 'https://fcm.googleapis.com/fcm/send';
const FCM_SERVER_KEY = process.env.FIREBASE_SERVER_KEY;

if (!FCM_SERVER_KEY) {
  // eslint-disable-next-line no-console
  console.warn('FCM 서버키(FIREBASE_SERVER_KEY)가 환경변수에 설정되어 있지 않습니다.');
}

export async function sendFcmNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, any>
) {
  if (!FCM_SERVER_KEY) throw new Error('FCM 서버키가 설정되어 있지 않습니다.');
  const payload = {
    to: token,
    notification: {
      title,
      body,
    },
    data: data || {},
  };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `key=${FCM_SERVER_KEY}`,
  };
  try {
    const res = await axios.post(FCM_ENDPOINT, payload, { headers });
    return res.data;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('FCM 발송 실패:', err?.response?.data || err?.message);
    throw err;
  }
} 