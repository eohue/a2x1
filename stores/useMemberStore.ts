import { create } from 'zustand';

export type UserRole = 'resident' | 'admin' | 'manager' | 'super';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'expelled';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

interface MemberStore {
  members: Member[];
  loading: boolean;
  error: string | null;
  q: string;
  status: UserStatus | '';
  role: UserRole | '';
  fetchMembers: () => Promise<void>;
  setQ: (q: string) => void;
  setStatus: (status: UserStatus | '') => void;
  setRole: (role: UserRole | '') => void;
  approve: (id: string) => Promise<void>;
  reject: (id: string) => Promise<void>;
  expel: (id: string) => Promise<void>;
  changeRole: (id: string, role: UserRole) => Promise<void>;
}

export const useMemberStore = create<MemberStore>((set, get) => ({
  members: [],
  loading: false,
  error: null,
  q: '',
  status: '',
  role: '',
  setQ: (q) => set({ q }),
  setStatus: (status) => set({ status }),
  setRole: (role) => set({ role }),
  fetchMembers: async () => {
    set({ loading: true, error: null });
    const { q, status, role } = get();
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (status) params.append('status', status);
    if (role) params.append('role', role);
    try {
      const res = await fetch(`/api-gateway/users?${params.toString()}`, { credentials: 'include' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ members: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message || '네트워크 오류', loading: false });
    }
  },
  approve: async (id) => {
    try {
      await fetch(`/api-gateway/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'approved' }),
      });
      await get().fetchMembers();
    } catch (e: any) {
      set({ error: e.message || '승인 실패' });
    }
  },
  reject: async (id) => {
    try {
      await fetch(`/api-gateway/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'rejected' }),
      });
      await get().fetchMembers();
    } catch (e: any) {
      set({ error: e.message || '거절 실패' });
    }
  },
  expel: async (id) => {
    try {
      await fetch(`/api-gateway/users/${id}/expel`, {
        method: 'PATCH',
        credentials: 'include',
      });
      await get().fetchMembers();
    } catch (e: any) {
      set({ error: e.message || '퇴거 실패' });
    }
  },
  changeRole: async (id, role) => {
    try {
      await fetch(`/api-gateway/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });
      await get().fetchMembers();
    } catch (e: any) {
      set({ error: e.message || '권한 변경 실패' });
    }
  },
})); 