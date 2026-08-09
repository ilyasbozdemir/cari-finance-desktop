import { create } from 'zustand';

interface SessionState {
  isLocked: boolean;
  pinRequired: boolean;
  unlock: () => void;
  lock: () => void;
  setPinRequired: (required: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isLocked: false,
  pinRequired: false,
  unlock: () => set({ isLocked: false }),
  lock: () => set({ isLocked: true }),
  setPinRequired: (required: boolean) => set({ pinRequired: required, isLocked: required }),
}));
