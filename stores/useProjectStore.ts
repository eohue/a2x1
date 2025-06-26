import { create } from 'zustand';

interface Project {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string; // PDF 다운로드 URL
  instagramFeed?: string[];
  interviews?: { name: string; content: string }[];
  // TODO: 기타 필드
}

interface ProjectStore {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  setProjects: (projects) => set({ projects }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 