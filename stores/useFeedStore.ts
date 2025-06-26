import { create } from 'zustand';
import { FeedItemProps } from '@/app/resident/community/FeedItem';

interface FeedState {
  feed: FeedItemProps[];
  loading: boolean;
  error: string | null;
  fetchFeed: () => Promise<void>;
  addPost: (post: Omit<FeedItemProps, 'date'>) => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  feed: [],
  loading: false,
  error: null,
  fetchFeed: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/community/feed', { credentials: 'include' });
      const { data, error } = await res.json();
      if (error) throw new Error(error);
      const feed = (data || []).map((item: any) => ({
        author: item.user?.name || '알 수 없음',
        date: new Date(item.created_at).toLocaleString(),
        channel: item.channel || '일반',
        content: item.content,
        imageUrl: item.image_url,
        videoUrl: item.video_url,
      }));
      set({ feed, loading: false });
    } catch (e: any) {
      set({ error: e.message || '피드 불러오기 실패', loading: false });
    }
  },
  addPost: async (post) => {
    try {
      const res = await fetch('/api/community/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: post.content,
          channel: post.channel,
          image_url: post.imageUrl,
          video_url: post.videoUrl,
        }),
      });
      const { data, error } = await res.json();
      if (error) throw new Error(error);
      const newItem: FeedItemProps = {
        author: data.user?.name || '알 수 없음',
        date: new Date(data.created_at).toLocaleString(),
        channel: data.channel || '일반',
        content: data.content,
        imageUrl: data.image_url,
        videoUrl: data.video_url,
      };
      set((state) => ({ feed: [newItem, ...state.feed] }));
    } catch (e: any) {
      set({ error: e.message || '피드 작성 실패' });
    }
  },
})); 