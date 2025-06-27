import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';

export type Notification = {
  id: string;
  type: string;
  content: string;
  link?: string;
  is_read: boolean;
  created_at: string;
};

type NotificationStore = {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  subscribeRealtime: (userId: string) => void;
};

let socket: Socket | null = null;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/notifications/me');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ notifications: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  markAsRead: async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, is_read: true } : n)
      }));
    } catch {}
  },
  subscribeRealtime: (userId: string) => {
    if (typeof window === 'undefined' || !userId) return;
    if (socket) return; // Prevent multiple connections
    socket = io('/', { path: '/socket.io', transports: ['websocket'] });
    socket.on('connect', () => {
      socket?.emit('join', userId);
    });
    socket.on('notification:new', (notification: Notification) => {
      set((state) => ({ notifications: [notification, ...state.notifications] }));
    });
  },
})); 