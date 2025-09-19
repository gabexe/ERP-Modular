import { create } from 'zustand';

type ModalType = 'client' | 'invoice' | 'product' | 'project' | 'appointment';

interface ModalState {
  type: ModalType | null;
  isOpen: boolean;
  data?: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  isOpen: false,
  data: undefined,
  openModal: (type, data) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: undefined }),
}));
