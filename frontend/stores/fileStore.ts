import { produce } from "immer";
import { create } from "zustand";

type State = {
    cvFileState: {cvFile:  File | '' | null};
    filePostPitch: {pitchDeckFile:  File | '' | null},
    filePostFinancial: {financialFile:  File | '' | null},
    filePostFinancialModel: {financialModelFile:  File | '' | null},
    filePostBussines: {businessPlanFile:  File | '' | null}
}

type Action = {
    handleCvFileChange: (file: State['cvFileState']) => void,
    handleBusinessFileChange: (file: any) => void,
    handlePitchFileChange: (file: any) => void,
    handleFinancialFileChange: (file: any) => void,
    handleFinancialModelFileChange: (file: any) => void,
}

const useFile = create<State & Action>((set) => {
    return {
        cvFileState: { cvFile: null },
        filePostPitch: { pitchDeckFile: null},
        filePostFinancial: { financialFile: null},
        filePostFinancialModel: { financialModelFile: null},
        filePostBussines: { businessPlanFile: null},
        handleCvFileChange: (file) => set(() => ({cvFileState: file})),
        handleBusinessFileChange: (file) => set(produce((state) => {
            state.filePostBussines.businessPlanFile = file
        })),
        handlePitchFileChange: (file) => set(produce((state) => {
            state.filePostPitch.pitchDeckFile = file
        })),       
        handleFinancialFileChange: (file) => set(produce((state) => {
            state.filePostFinancial.financialFile = file
        })),
        handleFinancialModelFileChange: (file) => set(produce((state) => {
            state.filePostFinancial.financialFile = file
        })),
    };
});

export { useFile }