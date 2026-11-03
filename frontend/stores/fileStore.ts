import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createStore, type StoreApi } from 'zustand/vanilla';

type FormFile = File | '' | null;
export type FileState = {
  cvFileState: { cvFile: FormFile };
  filePostPitch: { pitchDeckFile: FormFile };
  filePostFinancial: { financialFile: FormFile };
  filePostFinancialModel: { financialModelFile: FormFile };
  filePostBussines: { businessPlanFile: FormFile };
};
type FileActions = {
  handleCvFileChange: (file: FileState['cvFileState']) => void;
  handleBusinessFileChange: (file: FormFile) => void;
  handlePitchFileChange: (file: FormFile) => void;
  handleFinancialFileChange: (file: FormFile) => void;
  handleFinancialModelFileChange: (file: FormFile) => void;
};
export type FileStore = FileState & FileActions;

export function createScopedFileStore(): StoreApi<FileStore> {
  return createStore<FileStore>()((set) => ({
    cvFileState: { cvFile: null },
    filePostPitch: { pitchDeckFile: null },
    filePostFinancial: { financialFile: null },
    filePostFinancialModel: { financialModelFile: null },
    filePostBussines: { businessPlanFile: null },
    handleCvFileChange: (file) => set({ cvFileState: file }),
    handleBusinessFileChange: (file) => set({ filePostBussines: { businessPlanFile: file } }),
    handlePitchFileChange: (file) => set({ filePostPitch: { pitchDeckFile: file } }),
    handleFinancialFileChange: (file) => set({ filePostFinancial: { financialFile: file } }),
    handleFinancialModelFileChange: (file) => set({ filePostFinancialModel: { financialModelFile: file } }),
  }));
}

export const FileStoreContext = createContext<StoreApi<FileStore> | null>(null);
const fallbackStore = createScopedFileStore();

function useScopedFile(): FileStore;
function useScopedFile<T>(selector: (state: FileStore) => T): T;
function useScopedFile<T>(selector?: (state: FileStore) => T): T | FileStore {
  const scoped = useContext(FileStoreContext);
  const select: (state: FileStore) => T | FileStore = selector ?? ((state) => state);
  return useStore(scoped ?? fallbackStore, select);
}

export const useFile = Object.assign(useScopedFile, {
  getState: fallbackStore.getState,
  setState: fallbackStore.setState,
  subscribe: fallbackStore.subscribe,
});
