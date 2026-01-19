import { create } from "zustand";

/**
 * Store simple pour gérer la langue actuelle.
 * Utilise Zustand pour la réactivité.
 */

type Locale = "fr" | "en";

interface I18nState {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
    locale: "fr",
    setLocale: (locale) => set({ locale }),
}));

// Hook pour récupérer une traduction
import fr from "./locales/fr.json";
import en from "./locales/en.json";

const translations = { fr, en };

export function useTranslation() {
    const { locale } = useI18nStore();

    const t = (path: string) => {
        const keys = path.split(".");
        let result: any = translations[locale];

        for (const key of keys) {
            if (result[key] === undefined) return path;
            result = result[key];
        }

        return result;
    };

    return { t, locale };
}
