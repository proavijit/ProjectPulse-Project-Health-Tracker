'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                // Redirect unauthorized users to their own dashboard
                if (user.role === 'Admin') router.push('/admin/dashboard');
                else if (user.role === 'Employee') router.push('/employee/dashboard');
                else if (user.role === 'Client') router.push('/client/dashboard');
            }
        }
    }, [user, loading, router, allowedRoles]);

    if (loading) {
        return (
            <div className="flex animate-pulse items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
}
