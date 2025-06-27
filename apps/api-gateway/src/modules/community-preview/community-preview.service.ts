import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../../entities/Interview.entity';

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;

@Injectable()
export class CommunityPreviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepo: Repository<Interview>,
  ) {}

  // TODO: 인스타그램/인터뷰 API 연동 및 데이터 파싱 구현

  async getInstagramFeed(): Promise<string[]> {
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
      // 환경변수 미설정 시 mock 반환
      return [
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      ];
    }
    try {
      const url = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,media_url,thumbnail_url,permalink,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=9`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Instagram API 오류');
      const json = await res.json();
      // media_url 또는 thumbnail_url만 추출
      const images = (json.data || [])
        .map((item: any) => item.media_url || item.thumbnail_url)
        .filter(Boolean);
      return images;
    } catch (e) {
      // 장애 시 fallback mock
      return [
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      ];
    }
  }

  async getInterviews(): Promise<{ name: string; content: string }[]> {
    try {
      const interviews = await this.interviewRepo.find({
        where: { is_deleted: false },
        order: { created_at: 'DESC' },
        take: 6,
      });
      if (!interviews.length) throw new Error('no_data');
      return interviews.map((iv) => ({ name: iv.name, content: iv.content }));
    } catch (e) {
      // 장애/데이터 없음 시 fallback mock
      return [
        { name: '홍길동', content: '입주 후 커뮤니티가 정말 좋아졌어요!' },
        { name: '김영희', content: '이웃과 소통하며 다양한 활동을 할 수 있어 만족합니다.' },
      ];
    }
  }
} 