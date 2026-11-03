import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createStore, type StoreApi } from 'zustand/vanilla';
import type { MagazineData } from '@/types/global';

export type SubmitState = {
  isSubmitting: boolean;
  isSuccess: boolean;
  send: boolean;
  showNotification: boolean;
  csrfToken: string;
  selectedRole: string;
  cardsData: MagazineData[];
  cardData: MagazineData;
  categories: any[];
  tags: any[];
  startupFormType: string;
  filesCounter: { pitch: boolean; business: boolean; financial: boolean };
  solutionsLevel: number;
};

type CounterKey = keyof SubmitState['filesCounter'];

export type SubmitActions = {
  handleSubmitingChange: (value: boolean) => void;
  handleSuccessChange: (value: boolean) => void;
  handleSendChange: (value: boolean) => void;
  handleNotifChange: (value: boolean) => void;
  handleTokenChange: (value: string) => void;
  updateRole: (role: string) => void;
  setCardsData: (data: MagazineData[]) => void;
  setCardData: (data: MagazineData) => void;
  setCategories: (data: any[]) => void;
  setTags: (data: any[]) => void;
  setStartUpFormType: (value: string) => void;
  handleFileCounterChange: (name: string) => void;
  handleSolutionsLevelChange: (value: number) => void;
};

export type SubmitStore = SubmitState & SubmitActions;

export function createScopedSubmitStore(): StoreApi<SubmitStore> {
  return createStore<SubmitStore>()((set) => ({
    isSubmitting: false,
    isSuccess: true,
    send: false,
    showNotification: true,
    csrfToken: '',
    selectedRole: 'All',
    cardsData: [],
    cardData: {
      title: '', description: '', thumbnail: '', slug: '', date: '', file: '',
    },
    categories: [],
    tags: [],
    startupFormType: '',
    filesCounter: { pitch: false, business: false, financial: false },
    solutionsLevel: 0,
    handleSubmitingChange: (value) => set({ isSubmitting: value }),
    handleSuccessChange: (value) => set({ isSuccess: value }),
    handleSendChange: (value) => set({ send: value }),
    handleNotifChange: (value) => set({ showNotification: value }),
    handleTokenChange: (value) => set({ csrfToken: value }),
    updateRole: (role) => set({ selectedRole: role }),
    setCardsData: (data) => set({ cardsData: data }),
    setCardData: (data) => set({ cardData: data }),
    setCategories: (data) => set({ categories: data }),
    setTags: (data) => set({ tags: data }),
    setStartUpFormType: (value) => set({ startupFormType: value }),
    handleFileCounterChange: (name) => {
      if (name !== 'pitch' && name !== 'business' && name !== 'financial') return;
      const key: CounterKey = name;
      set((state) => ({ filesCounter: {
        ...state.filesCounter,
        [key]: !state.filesCounter[key],
      } }));
    },
    handleSolutionsLevelChange: (value) => set({ solutionsLevel: value }),
  }));
}

export const SubmitStoreContext = createContext<StoreApi<SubmitStore> | null>(null);

// Fallback is retained for compatibility with existing, non-form consumers.
// Every routed form receives its own scoped instance through FormStateScope.
const fallbackStore = createScopedSubmitStore();

function useScopedSubmit(): SubmitStore;
function useScopedSubmit<T>(selector: (state: SubmitStore) => T): T;
function useScopedSubmit<T>(selector?: (state: SubmitStore) => T): T | SubmitStore {
  const scoped = useContext(SubmitStoreContext);
  const select: (state: SubmitStore) => T | SubmitStore = selector ?? ((state) => state);
  return useStore(scoped ?? fallbackStore, select);
}

// Preserve the old Zustand-style static API for imports outside React.
export const useSubmit = Object.assign(useScopedSubmit, {
  getState: fallbackStore.getState,
  setState: fallbackStore.setState,
  subscribe: fallbackStore.subscribe,
});
