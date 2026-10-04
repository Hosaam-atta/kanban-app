import { create } from 'zustand';

interface PreferencesState {
  defaultView: 'board' | 'list';
  setDefaultView: (view: 'board' | 'list') => void;
}

export const usePreferencesStore = create<PreferencesState>()((set) => ({
  defaultView: 'board',
  setDefaultView: (view) => set({ defaultView: view }),
}));
