import { create } from 'zustand';

export type Report = {
  id: string;
  user: { id: string; name?: string };
  type: string;
  content: string;
  status: 'submitted' | 'in_progress' | 'resolved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type ReportHistory = {
  id: string;
  user: { id: string; name?: string };
  status: string;
  comment?: string;
  created_at: string;
};

type ReportStore = {
  reports: Report[];
  report: Report | null;
  history: ReportHistory[];
  loading: boolean;
  error: string | null;
  filter: { type?: string; status?: string; q?: string };
  fetchReports: () => Promise<void>;
  fetchReport: (id: string) => Promise<void>;
  fetchHistory: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string, comment?: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  exportReports: (type: 'csv' | 'pdf') => Promise<void>;
  setFilter: (filter: Partial<{ type: string; status: string; q: string }>) => void;
};

export const useReportStore = create<ReportStore>((set, get) => ({
  reports: [],
  report: null,
  history: [],
  loading: false,
  error: null,
  filter: {},
  fetchReports: async () => {
    set({ loading: true, error: null });
    try {
      const { type, status, q } = get().filter;
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (status) params.append('status', status);
      if (q) params.append('q', q);
      const res = await fetch(`/api/reports?${params.toString()}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ reports: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  fetchReport: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/reports/${id}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ report: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  fetchHistory: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/reports/${id}/history`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ history: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  updateStatus: async (id, status, comment) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, comment }),
      });
      await get().fetchReport(id);
      await get().fetchReports();
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      await get().fetchReports();
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  exportReports: async (type) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/reports/export?type=${type}`);
      if (!res.ok) throw new Error('다운로드 실패');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'csv' ? 'reports.csv' : 'reports.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      set({ loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),
})); 