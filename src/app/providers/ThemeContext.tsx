// src/app/providers/ThemeContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
    theme: Theme;
    toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() =>
        (localStorage.getItem('booknest.theme') as Theme) ?? 'light',
    );

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('booknest.theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
    return ctx;
}