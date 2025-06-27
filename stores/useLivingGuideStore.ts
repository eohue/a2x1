import { create } from 'zustand';

export type LivingGuide = {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  version: number;
  created_by: { id: string; name?: string };
  approved_by?: { id: string; name?: string };
  approved_at?: string;
  created_at: string;
  updated_at: string;
};

type LivingGuideStore = {
  guides: LivingGuide[];
  loading: boolean;
  error: string | null;
  editingGuide: LivingGuide | null;
  fetchGuides: (opts?: { onlyApproved?: boolean }) => Promise<void>;
  editGuide: (id: string) => void;
  setEditingContent: (content: string) => void;
  saveGuide: () => Promise<void>;
  submitForApproval: () => Promise<void>;
};

export const useLivingGuideStore = create<LivingGuideStore>((set, get) => ({
  guides: [],
  loading: false,
  error: null,
  editingGuide: null,
  fetchGuides: async (opts?: { onlyApproved?: boolean }) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/living-guide');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ guides: json.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  editGuide: (id) => {
    const guide = get().guides.find((g) => g.id === id);
    if (guide) set({ editingGuide: { ...guide } });
  },
  setEditingContent: (content) => {
    set((state) => ({ editingGuide: state.editingGuide ? { ...state.editingGuide, content } : null }));
  },
  saveGuide: async () => {
    const { editingGuide, fetchGuides } = get();
    if (!editingGuide) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/living-guide/${editingGuide.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingGuide.content }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ editingGuide: null, loading: false });
      await fetchGuides();
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  submitForApproval: async () => {
    const { editingGuide, fetchGuides } = get();
    if (!editingGuide) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/living-guide/${editingGuide.id}/submit`, {
        method: 'PATCH',
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      set({ editingGuide: null, loading: false });
      await fetchGuides();
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
})); 