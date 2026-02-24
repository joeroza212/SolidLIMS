import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/index.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [appSetting, setAppSetting] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const res = await authApi.me();
            if (res.success) {
                setUser(res.data.user);
                setAppSetting(res.data.appSetting);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(userName, password) {
        const res = await authApi.login({ userName, password });
        if (res.success) {
            setUser(res.data.user);
            setAppSetting(res.data.appSetting);
        }
        return res;
    }

    async function logout() {
        await authApi.logout();
        setUser(null);
        setAppSetting(null);
    }

    return (
        <AuthContext.Provider value={{ user, appSetting, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
