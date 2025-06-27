import { create } from 'zustand';

export type ContentStatus = 'pending' | 'approved' | 'rejected' | 'deleted';

export interface Content {
  id: string;
  title: string;
  content: string;
  channel: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

interface ContentStore {
  contents: Content[];
  loading: boolean;
  error: string | null;
  q: string;
  status: ContentStatus | '';
  channel: string;
  fetchContents: () => Promise<void>;
  setQ: (q: string) => void;
  setStatus: (status: ContentStatus | '') => void;
  setChannel: (channel: string) => void;
  createContent: (data: Partial<Content>) => Promise<void>;
  updateContent: (id: string, data: Partial<Content>) => Promise<void>;
  updateStatus: (id: string, status: ContentStatus) => Promise<void>;
  removeContent: (id: string) => Promise<void>;
}

export const useContentStore = create<ContentStore>((set, get) => ({
  contents: [],
  loading: false,
  error: null,
  q: '',
  status: '',
  channel: '',
  setQ: (q) => set({ q }),
  setStatus: (status) => set({ status }),
  setChannel: (channel) => set({ channel }),
  fetchContents: async () => {
    set({ loading: true, error: null });
    const { q, status, channel } = get();
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (status) params.append('status', status);
    if (channel) params.append('channel', channel);
    try {
      const res = await fetch(`/api-gateway/posts?${params.toString()}`, { credentials: 'include' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ contents: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message || '네트워크 오류', loading: false });
    }
  },
  createContent: async (data) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api-gateway/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      await get().fetchContents();
    } catch (e: any) {
      set({ error: e.message || '등록 실패', loading: false });
    }
  },
  updateContent: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api-gateway/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      await get().fetchContents();
    } catch (e: any) {
      set({ error: e.message || '수정 실패', loading: false });
    }
  },
  updateStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api-gateway/posts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      await get().fetchContents();
    } catch (e: any) {
      set({ error: e.message || '상태 변경 실패', loading: false });
    }
  },
  removeContent: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api-gateway/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      await get().fetchContents();
    } catch (e: any) {
      set({ error: e.message || '삭제 실패', loading: false });
    }
  },
})); 