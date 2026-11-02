import { produce } from 'immer';
import { create } from 'zustand';

type FormFile = File | '' | null;
type State = {
  cvFileState: { cvFile: FormFile };
  filePostPitch: { pitchDeckFile: FormFile };
  filePostFinancial: { financialFile: FormFile };
  filePostFinancialModel: { financialModelFile: FormFile };
  filePostBussines: { businessPlanFile: FormFile };
};
type Action = {
  handleCvFileChange: (file: State['cvFileState']) => void;
  handleBusinessFileChange: (file: FormFile) => void;
  handlePitchFileChange: (file: FormFile) => void;
  handleFinancialFileChange: (file: FormFile) => void;
  handleFinancialModelFileChange: (file: FormFile) => void;
};

const useFile = create<State & Action>((set) => ({
  cvFileState: { cvFile: null },
  filePostPitch: { pitchDeckFile: null },
  filePostFinancial: { financialFile: null },
  filePostFinancialModel: { financialModelFile: null },
  filePostBussines: { businessPlanFile: null },
  handleCvFileChange: (file) => set({ cvFileState: file }),
  handleBusinessFileChange: (file) => set(produce((state: State & Action) => { state.filePostBussines.businessPlanFile = file; })),
  handlePitchFileChange: (file) => set(produce((state: State & Action) => { state.filePostPitch.pitchDeckFile = file; })),
  handleFinancialFileChange: (file) => set(produce((state: State & Action) => { state.filePostFinancial.financialFile = file; })),
  handleFinancialModelFileChange: (file) => set(produce((state: State & Action) => { state.filePostFinancialModel.financialModelFile = file; })),
}));

export { useFile };
