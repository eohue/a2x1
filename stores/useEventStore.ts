import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface EventParticipant {
  id: string;
  name?: string;
}
export interface Event {
  id: string;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  participants: EventParticipant[];
  created_by: any;
  created_at: string;
  updated_at: string;
}

interface EventStore {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  fetchEvent: (id: string) => Promise<void>;
  createEvent: (data: { title: string; description: string; start_at: string; end_at: string }) => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
  _initSocket: () => void;
}

const socket: Socket = io(process.env.NEXT_PUBLIC_API_SOCKET_URL || '', {
  path: '/socket.io',
  autoConnect: false,
  transports: ['websocket'],
});

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  currentEvent: null,
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/v1/events');
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || '불러오기 실패');
      set({ events: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  fetchEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/v1/events/${id}`);
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || '불러오기 실패');
      set({ currentEvent: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  createEvent: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || '생성 실패');
      set((s) => ({ events: [json.data, ...s.events], loading: false }));
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  joinEvent: async (eventId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/v1/events/${eventId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || '참여 실패');
      set({ currentEvent: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  _initSocket: () => {
    if (!socket.connected) socket.connect();
    socket.on('event:new', (event: Event) => {
      set((s) => ({ events: [event, ...s.events] }));
    });
    socket.on('event:joined', ({ eventId, user }) => {
      set((s) => {
        const events = s.events.map((ev) =>
          ev.id === eventId ? { ...ev, participants: [...(ev.participants || []), user] } : ev
        );
        return { events };
      });
    });
  },
})); 