import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface PollOption {
  id: string;
  text: string;
}
export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  votes: { userId: string; optionId: string }[];
  created_by: any;
  event?: any;
  created_at: string;
  updated_at: string;
}
export interface PollResult {
  pollId: string;
  title: string;
  results: { optionId: string; text: string; votes: number }[];
}

interface PollStore {
  polls: Poll[];
  currentPoll: Poll | null;
  results: PollResult | null;
  loading: boolean;
  error: string | null;
  fetchPolls: () => Promise<void>;
  fetchPoll: (id: string) => Promise<void>;
  createPoll: (data: { title: string; description: string; options: PollOption[]; eventId?: string }) => Promise<void>;
  vote: (pollId: string, optionId: string) => Promise<void>;
  getResults: (pollId: string) => Promise<void>;
  _initSocket: () => void;
}

const socket: Socket = io(process.env.NEXT_PUBLIC_API_SOCKET_URL || '', {
  path: '/socket.io',
  autoConnect: false,
  transports: ['websocket'],
});

export const usePollStore = create<PollStore>((set, get) => ({
  polls: [],
  currentPoll: null,
  results: null,
  loading: false,
  error: null,

  fetchPolls: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/v1/polls');
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || '불러오기 실패');
      set({ polls: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  fetchPoll: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/v1/polls/${id}`);
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || '불러오기 실패');
      set({ currentPoll: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  createPoll: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/v1/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || '생성 실패');
      set((s) => ({ polls: [json.data, ...s.polls], loading: false }));
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  vote: async (pollId, optionId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/v1/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || '투표 실패');
      set({ currentPoll: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  getResults: async (pollId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/v1/polls/${pollId}/results`);
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || '결과 불러오기 실패');
      set({ results: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  _initSocket: () => {
    if (!socket.connected) socket.connect();
    socket.on('poll:new', (poll: Poll) => {
      set((s) => ({ polls: [poll, ...s.polls] }));
    });
    socket.on('poll:vote', ({ pollId, userId, optionId }) => {
      set((s) => {
        const polls = s.polls.map((p) =>
          p.id === pollId ? { ...p, votes: [...(p.votes || []), { userId, optionId }] } : p
        );
        return { polls };
      });
    });
  },
})); 