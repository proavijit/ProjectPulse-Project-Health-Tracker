'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'Admin') router.push('/admin/dashboard');
        else if (user.role === 'Employee') router.push('/employee/dashboard');
        else if (user.role === 'Client') router.push('/client/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-black text-indigo-600 animate-pulse tracking-tighter">ProjectPulse</h1>
        <p className="text-gray-400 mt-2 text-sm font-medium">Checking authentication status...</p>
      </div>
    </div>
  );
}
