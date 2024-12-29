import {create} from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("theme") || "business",
    setTheme: (theme) => {
        set({theme});
        localStorage.setItem("Chat-theme", theme);
    },
}));