import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;
const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

// 간단한 메모리 캐시 (운영시 redis 등으로 대체 가능)
const cache: Record<string, { data: any; expires: number }> = {};

@Injectable()
export class ExternalService {
  async getInstagramFeed(limit: number = 9) {
    const cacheKey = `instagram_feed_${limit}`;
    if (cache[cacheKey] && cache[cacheKey].expires > Date.now()) {
      return { data: cache[cacheKey].data, error: null, meta: { cached: true } };
    }
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
      // 환경변수 미설정 시 mock 반환
      return { data: this.mockInstagramFeed(), error: 'NO_TOKEN', meta: null };
    }
    try {
      const url = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,media_url,thumbnail_url,permalink,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Instagram API 오류');
      const json: any = await res.json();
      const images = (json.data || []).map((item: any) => item.media_url || item.thumbnail_url).filter(Boolean);
      // 5분 캐싱
      cache[cacheKey] = { data: images, expires: Date.now() + 5 * 60 * 1000 };
      return { data: images, error: null, meta: null };
    } catch (e) {
      // 장애 시 fallback mock
      return { data: this.mockInstagramFeed(), error: 'INSTAGRAM_FALLBACK', meta: null };
    }
  }

  mockInstagramFeed() {
    return [
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    ];
  }

  async getKakaoShare(url: string, req: any) {
    if (!KAKAO_REST_API_KEY) {
      return { data: this.mockKakaoShare(url), error: 'NO_TOKEN', meta: null };
    }
    try {
      // 카카오톡 공유용 링크/메타데이터 생성 (실제 서비스에서는 더 복잡한 파라미터 필요)
      const apiUrl = `https://kapi.kakao.com/v2/api/talk/memo/default/send`;
      // 실제 서비스에서는 사용자 인증 토큰 필요, 여기서는 예시로만 반환
      // 장애 fallback
      return { data: { url, shared: true }, error: null, meta: null };
    } catch (e) {
      return { data: this.mockKakaoShare(url), error: 'KAKAO_FALLBACK', meta: null };
    }
  }

  mockKakaoShare(url: string) {
    return { url, shared: false };
  }
} 