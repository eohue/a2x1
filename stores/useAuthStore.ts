import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: { email: string } | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: { email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  setToken: (token) => {
    set({ token, isAuthenticated: !!token });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  setUser: (user) => set({ user }),
  logout: () => {
    set({ token: null, user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
})); 