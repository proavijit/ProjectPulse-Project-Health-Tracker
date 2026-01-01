'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { projectsApi, risksApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RiskPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectsApi.getAll();
                if (response.data.success) {
                    setProjects(response.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch projects');
            } finally {
                setIsFetching(false);
            }
        };
        fetchProjects();
    }, []);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await risksApi.create(data);
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Risk reported successfully! Admin notified.' });
                setTimeout(() => router.push('/employee/dashboard'), 2000);
            }
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to report risk.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <header className="mb-8 items-center text-center">
                <h1 className="text-2xl font-bold text-gray-900">Report a Delivery Risk</h1>
                <p className="text-gray-500 text-sm mt-1">Found a potential blocker? Let the management know early.</p>
            </header>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-1.5 font-medium text-sm">
                        <label className="text-gray-700">Select Project</label>
                        <select
                            {...register('project', { required: 'Please select a project' })}
                            className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-normal"
                        >
                            <option value="">Choose a project...</option>
                            {projects.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                        {errors.project && <span className="text-xs text-red-500">{errors.project.message as string}</span>}
                    </div>

                    <Input
                        label="Risk Title"
                        placeholder="e.g., Delay in third-party API keys"
                        {...register('title', { required: 'Risk title is required' })}
                        error={errors.title?.message as string}
                    />

                    <div className="flex flex-col gap-1.5 font-medium text-sm">
                        <label className="text-gray-700">Severity Level</label>
                        <select
                            {...register('severity', { required: 'Please select severity' })}
                            className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-normal"
                        >
                            <option value="Low">Low (Minimal impact)</option>
                            <option value="Medium">Medium (Affects timeline)</option>
                            <option value="High">High (Immediate intervention required)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 font-medium text-sm">
                        <label className="text-gray-700 font-medium">Mitigation Plan</label>
                        <textarea
                            {...register('mitigationPlan', { required: 'Mitigation plan is required' })}
                            className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-normal min-h-[100px]"
                            placeholder="What are we doing to solve this?"
                        ></textarea>
                        {errors.mitigationPlan && <span className="text-xs text-red-500">{errors.mitigationPlan.message as string}</span>}
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="pt-4 flex gap-4">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" variant="danger" className="flex-1" isLoading={isLoading}>Report Risk</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
