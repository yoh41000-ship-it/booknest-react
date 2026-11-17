// src/app/providers/AuthContext.tsx
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export interface User { id: string; name: string; }

interface AuthContextValue {
    user: User | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const raw = localStorage.getItem('booknest.user');
        return raw ? JSON.parse(raw) : null;
    });

    const login = useCallback(() => {
        const fake: User = { id: '1', name: 'Student' };
        setUser(fake);
        localStorage.setItem('booknest.user', JSON.stringify(fake));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('booknest.user');
    }, []);

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}