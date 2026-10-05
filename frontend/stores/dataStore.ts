import { create } from "zustand";
import { MagazineData } from '@/types/global';
import {produce} from 'immer';



type State = {
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
    startupFormType: string
    filesCounter: {
        pitch: boolean
        business: boolean
        financial: boolean
    }
    solutionsLevel: number 
}

type Action = {
    handleSubmitingChange: (bool: State['isSubmitting']) => void,
    handleSuccessChange: (bool: State['isSuccess']) => void,
    handleSendChange: (bool: State['send']) => void,
    handleNotifChange: (bool: State['send']) => void,
    handleTokenChange: (str: State['csrfToken']) => void,
    updateRole: (role: State['selectedRole']) => void,
    setCardsData: (data: State["cardsData"]) => void,
    setCardData: (data: State["cardData"]) => void,
    setCategories: (category: State["categories"]) => void,
    setTags: (tags: State["tags"]) => void,
    setStartUpFormType: (type: State["startupFormType"]) => void
    handleFileCounterChange: (name: string) => void
    handleSolutionsLevelChange: (index: number) => void

    // handleChangeSuccess: () => void,
}

const useSubmit = create<State & Action>((set) => {
    return {
        isSubmitting: false,
        isSuccess: true,
        send: false,
        showNotification: true,
        csrfToken: "",
        selectedRole: "All",
        cardsData: [],
        cardData: {
            title: "",
            description: "",
            thumbnail: "",
            slug: "",
            date: "",
            file: "",
        },
        categories: [],
        tags: [],
        startupFormType: "",
        filesCounter: {
            pitch: false,
            business: false,
            financial: false
        },
        solutionsLevel: 0,


        handleSubmitingChange: (bool) => set(() => ({isSubmitting: bool})),
        handleSuccessChange: (bool) => set(() => ({isSuccess: bool})),
        handleSendChange: (bool) => set(() => ({send: bool})),
        handleNotifChange: (bool) => set(() => ({showNotification: bool})),
        handleTokenChange: (str) => set(() => ({csrfToken: str})),
        updateRole: (role) => set(() => ({selectedRole: role})),
        setCardsData: (data) => set(() => ({cardsData: data})),
        setCategories: (categories) => set(() => ({categories: categories})),
        setTags: (tags) => set(() => ({tags: tags})),
        setCardData: (cardData) => set(() => ({cardData: cardData})),
        setStartUpFormType: (type) => set(() => ({startupFormType: type})),
        handleFileCounterChange: (name) => set(produce((state) => {
            state.filesCounter[name] = !state.filesCounter[name]
        })),
        handleSolutionsLevelChange: (index) => set(() => ({
            solutionsLevel: index
        }))
    };
});

export { useSubmit }