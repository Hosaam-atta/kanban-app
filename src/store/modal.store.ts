import { create } from 'zustand';

interface ModalState {
  activeModal: string | null;
  openModal: (name: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  activeModal: null,
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}));
