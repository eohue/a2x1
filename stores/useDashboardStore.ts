import { create } from 'zustand';

interface DashboardSummary {
  users: { total: number; dau: number; mau: number };
  reports: { total: number; pending: number };
  posts: { total: number };
  applications: { total: number; pending: number };
}

interface DashboardStore {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  fetchSummary: () => Promise<void>;
  lastFetched: number | null;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  summary: null,
  loading: false,
  error: null,
  lastFetched: null,
  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api-gateway/dashboard/summary', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || '대시보드 데이터 오류');
      set({ summary: json.data, loading: false, error: null, lastFetched: Date.now() });
    } catch (e: any) {
      set({ error: e.message || '네트워크 오류', loading: false });
    }
  },
})); 