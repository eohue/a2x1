import { create } from 'zustand';

export interface Group {
  id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  created_by: { id: string; name?: string };
  members?: { id: string; name?: string }[];
  created_at: string;
  updated_at: string;
}

interface GroupStore {
  groups: Group[];
  currentGroup: Group | null;
  members: { id: string; name?: string }[];
  loading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  fetchGroup: (id: string) => Promise<void>;
  createGroup: (data: Partial<Group>) => Promise<void>;
  updateGroup: (id: string, data: Partial<Group>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  joinGroup: (id: string) => Promise<void>;
  leaveGroup: (id: string) => Promise<void>;
  fetchMembers: (id: string) => Promise<void>;
  removeMember: (groupId: string, userId: string) => Promise<void>;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],
  currentGroup: null,
  members: [],
  loading: false,
  error: null,

  /** 소모임(그룹) 리스트 조회 */
  fetchGroups: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api-gateway/groups', { credentials: 'include' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ groups: json, loading: false });
    } catch (e: any) {
      set({ error: e.message || '소모임 목록 불러오기 실패', loading: false });
    }
  },

  /** 소모임(그룹) 상세 조회 */
  fetchGroup: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api-gateway/groups/${id}`, { credentials: 'include' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ currentGroup: json, loading: false });
    } catch (e: any) {
      set({ error: e.message || '소모임 정보 불러오기 실패', loading: false });
    }
  },

  /** 소모임(그룹) 생성 */
  createGroup: async (data) => {
    set({ loading: true, error: null });
    try {
      await fetch('/api-gateway/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      await get().fetchGroups();
    } catch (e: any) {
      set({ error: e.message || '소모임 생성 실패', loading: false });
    }
  },

  /** 소모임(그룹) 정보 수정 */
  updateGroup: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api-gateway/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      await get().fetchGroups();
    } catch (e: any) {
      set({ error: e.message || '소모임 수정 실패', loading: false });
    }
  },

  /** 소모임(그룹) 삭제 */
  deleteGroup: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api-gateway/groups/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      await get().fetchGroups();
    } catch (e: any) {
      set({ error: e.message || '소모임 삭제 실패', loading: false });
    }
  },

  /** 소모임 참여 */
  joinGroup: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api-gateway/groups/${id}/join`, {
        method: 'POST',
        credentials: 'include',
      });
      await get().fetchGroup(id);
    } catch (e: any) {
      set({ error: e.message || '참여 실패', loading: false });
    }
  },

  /** 소모임 탈퇴 */
  leaveGroup: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api-gateway/groups/${id}/leave`, {
        method: 'POST',
        credentials: 'include',
      });
      await get().fetchGroup(id);
    } catch (e: any) {
      set({ error: e.message || '탈퇴 실패', loading: false });
    }
  },

  /** 소모임 멤버 리스트 */
  fetchMembers: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api-gateway/groups/${id}/members`, { credentials: 'include' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ members: json, loading: false });
    } catch (e: any) {
      set({ error: e.message || '멤버 목록 불러오기 실패', loading: false });
    }
  },

  /** 소모임 멤버 강퇴 */
  removeMember: async (groupId, userId) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api-gateway/groups/${groupId}/members/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      await get().fetchMembers(groupId);
    } catch (e: any) {
      set({ error: e.message || '멤버 강퇴 실패', loading: false });
    }
  },
})); 