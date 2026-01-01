'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
        { name: 'Projects', href: '/admin/projects', icon: '📁' },
        { name: 'Risks', href: '/admin/risks', icon: '⚠️' },
    ];

    return (
        <ProtectedRoute allowedRoles={['Admin']}>
            <div className="min-h-screen bg-gray-50 flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-indigo-600">ProjectPulse</h2>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Admin Panel</p>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                    `}
                                >
                                    <span>{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                {user?.name.charAt(0)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
