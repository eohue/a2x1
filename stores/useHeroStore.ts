import { create } from 'zustand';

export interface HeroIndicators {
  monthlyUV: number;
  avgApprovalHours: number;
  weeklyPosts: number;
}

interface HeroStore {
  indicators: HeroIndicators;
  loading: boolean;
  error: string | null;
  setIndicators: (indicators: HeroIndicators) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialIndicators: HeroIndicators = {
  monthlyUV: 0,
  avgApprovalHours: 0,
  weeklyPosts: 0,
};

export const useHeroStore = create<HeroStore>((set) => ({
  indicators: initialIndicators,
  loading: false,
  error: null,
  setIndicators: (indicators) => set({ indicators }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 