'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.login(data.email, data.password);
            if (response.data.success) {
                const { token, user } = response.data.data;
                login(token, user);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-600">ProjectPulse</h1>
                    <p className="text-gray-500 mt-2">Internal Project Health tracking system</p>
                </div>

                <Card title="Login" description="Enter your credentials to access your dashboard">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@projectpulse.com"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email?.message as string}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { required: 'Password is required' })}
                            error={errors.password?.message as string}
                        />

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>
                </Card>

                <div className="mt-6">
                    <Card className="!p-4 bg-indigo-50/50 border-indigo-100">
                        <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-3">Demo Credentials</h4>
                        <div className="space-y-2 text-[10px] font-medium text-indigo-900/70">
                            <div className="flex justify-between border-b border-indigo-100/50 pb-1">
                                <span>Admin</span>
                                <span className="font-bold">admin@projectpulse.com / admin123</span>
                            </div>
                            <div className="flex justify-between border-b border-indigo-100/50 pb-1">
                                <span>Employee</span>
                                <span className="font-bold">employee@projectpulse.com / employee123</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Client</span>
                                <span className="font-bold">client@projectpulse.com / client123</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="mt-8 text-center text-sm text-gray-400">
                    <p>© 2026 ProjectPulse. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
