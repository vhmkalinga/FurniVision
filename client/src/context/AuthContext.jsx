import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('fv_token');
        const stored = localStorage.getItem('fv_user');
        if (token && stored) {
            setUser(JSON.parse(stored));
            api.get('/auth/me').then(res => {
                setUser(res.data.user);
                localStorage.setItem('fv_user', JSON.stringify(res.data.user));
            }).catch(() => {
                localStorage.removeItem('fv_token');
                localStorage.removeItem('fv_user');
                setUser(null);
            });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('fv_token', res.data.token);
        localStorage.setItem('fv_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('fv_token', res.data.token);
        localStorage.setItem('fv_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('fv_token');
        localStorage.removeItem('fv_user');
        setUser(null);
    };

    const updateProfile = async (data) => {
        const res = await api.put('/auth/profile', data);
        setUser(res.data.user);
        localStorage.setItem('fv_user', JSON.stringify(res.data.user));
        return res.data;
    };

    const uploadAvatar = async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
        const res = await api.post('/auth/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setUser(res.data.user);
        localStorage.setItem('fv_user', JSON.stringify(res.data.user));
        return res.data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, uploadAvatar }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
