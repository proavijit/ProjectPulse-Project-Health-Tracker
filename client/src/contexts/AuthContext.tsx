'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { getToken, setUser, removeToken, removeUser, getUser } from '@/lib/auth';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Employee' | 'Client';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const token = getToken();
            const storedUser = getUser();

            if (token && storedUser) {
                setUserState(storedUser);
                // Optionally verify token with backend
                try {
                    const response = await authApi.getCurrentUser();
                    if (response.data.success) {
                        setUserState(response.data.data);
                        setUser(response.data.data);
                    }
                } catch (error) {
                    console.error('Failed to verify token', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        setUser(userData);
        setUserState(userData);

        // Redirect based on role
        if (userData.role === 'Admin') router.push('/admin/dashboard');
        else if (userData.role === 'Employee') router.push('/employee/dashboard');
        else if (userData.role === 'Client') router.push('/client/dashboard');
    };

    const logout = () => {
        removeToken();
        removeUser();
        setUserState(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
