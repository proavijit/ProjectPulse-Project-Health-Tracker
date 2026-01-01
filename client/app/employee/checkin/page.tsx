'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { projectsApi, checkinsApi } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CheckInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectIdFromUrl = searchParams.get('project');

    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            project: projectIdFromUrl || '',
            confidenceLevel: 5,
            completionPercentage: 10,
            progressSummary: '',
            blockers: ''
        }
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectsApi.getAll();
                if (response.data.success) {
                    setProjects(response.data.data);
                    if (projectIdFromUrl) {
                        setValue('project', projectIdFromUrl);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch projects');
            } finally {
                setIsFetching(false);
            }
        };
        fetchProjects();
    }, [projectIdFromUrl, setValue]);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await checkinsApi.create({
                ...data,
                confidenceLevel: Number(data.confidenceLevel),
                completionPercentage: Number(data.completionPercentage)
            });
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Weekly check-in submitted successfully!' });
                setTimeout(() => router.push('/employee/dashboard'), 2000);
            }
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to submit check-in. Maybe you already submitted one this week?'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="text-center py-10">Loading projects...</div>;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <header className="mb-8 text-center text-center">
                <h1 className="text-2xl font-bold text-gray-900">Weekly Progress Update</h1>
                <p className="text-gray-500 text-sm mt-1">Share your progress and blockers for the week</p>
            </header>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
                    {/* Project Selection */}
                    <div className="flex flex-col gap-1.5 font-medium">
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

                    {/* Progress Summary */}
                    <div className="flex flex-col gap-1.5 font-medium">
                        <label className="text-gray-700 font-medium">Progress Summary</label>
                        <textarea
                            {...register('progressSummary', { required: 'Progress summary is required' })}
                            className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-normal min-h-[100px]"
                            placeholder="What did you achieve this week?"
                        ></textarea>
                        {errors.progressSummary && <span className="text-xs text-red-500">{errors.progressSummary.message as string}</span>}
                    </div>

                    {/* Blockers */}
                    <div className="flex flex-col gap-1.5 font-medium">
                        <label className="text-gray-700 font-medium">Blockers / Challenges (Optional)</label>
                        <textarea
                            {...register('blockers')}
                            className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-normal min-h-[60px]"
                            placeholder="Is anything holding you back?"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Confidence Level */}
                        <div className="flex flex-col gap-1.5 font-medium">
                            <label className="text-gray-700">Confidence Level (1-5)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    {...register('confidenceLevel')}
                                    className="flex-1 accent-indigo-600"
                                />
                                <span className="text-lg font-bold text-indigo-600">{watch('confidenceLevel')}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-normal italic">1: Low Confidence, 5: Very Confident</p>
                        </div>

                        {/* Completion Percentage */}
                        <div className="flex flex-col gap-1.5 font-medium">
                            <label className="text-gray-700">Estimated Project Completion</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    {...register('completionPercentage')}
                                    className="flex-1 accent-indigo-600"
                                />
                                <span className="text-lg font-bold text-indigo-600">{watch('completionPercentage')}%</span>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="pt-4 flex gap-4">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" className="flex-1" isLoading={isLoading}>Submit Update</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
