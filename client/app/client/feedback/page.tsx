'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { projectsApi, feedbackApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function FeedbackPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            project: '',
            satisfactionRating: 5,
            communicationRating: 5,
            comments: '',
            issueFlagged: false
        }
    });

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
            const response = await feedbackApi.create({
                ...data,
                satisfactionRating: Number(data.satisfactionRating),
                communicationRating: Number(data.communicationRating)
            });
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Thank you for your feedback! We appreciate your input.' });
                setTimeout(() => router.push('/client/dashboard'), 2000);
            }
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to submit feedback. Have you already submitted feedback for this week?'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="text-center py-10">Loading projects...</div>;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <header className="mb-8 items-center text-center">
                <h1 className="text-2xl font-bold text-gray-900">Weekly Client Feedback</h1>
                <p className="text-gray-500 text-sm mt-1">Help us improve by sharing your thoughts on current delivery.</p>
            </header>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-1.5 font-medium text-sm">
                        <label className="text-gray-700">Project Name</label>
                        <select
                            {...register('project', { required: 'Please select a project' })}
                            className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-normal"
                        >
                            <option value="">Select a project...</option>
                            {projects.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                        {errors.project && <span className="text-xs text-red-500">{errors.project.message as string}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Satisfaction Rating */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-gray-700">Overall Satisfaction</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    {...register('satisfactionRating')}
                                    className="flex-1 accent-indigo-600"
                                />
                                <span className="text-2xl font-black text-indigo-600">{watch('satisfactionRating')}</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                <span>Poor</span>
                                <span>Perfect</span>
                            </div>
                        </div>

                        {/* Communication Rating */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-gray-700">Communication Clarity</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    {...register('communicationRating')}
                                    className="flex-1 accent-indigo-600"
                                />
                                <span className="text-2xl font-black text-indigo-600">{watch('communicationRating')}</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                <span>Blurry</span>
                                <span>Crystal Clear</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 font-medium text-sm">
                        <label className="text-gray-700 font-medium">Comments or Suggestions</label>
                        <textarea
                            {...register('comments')}
                            className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-normal min-h-[100px]"
                            placeholder="Anything else you'd like to share?"
                        ></textarea>
                    </div>

                    <label className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100 cursor-pointer group">
                        <input
                            type="checkbox"
                            {...register('issueFlagged')}
                            className="w-5 h-5 accent-red-600"
                        />
                        <div>
                            <p className="font-bold text-red-700 text-sm">Flag a Critical Issue</p>
                            <p className="text-xs text-red-500 font-medium">Check this if you are highly dissatisfied and need immediate attention.</p>
                        </div>
                    </label>

                    {message && (
                        <div className={`p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="pt-4 flex gap-4">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => router.push('/client/dashboard')}>Back</Button>
                        <Button type="submit" className="flex-1" isLoading={isLoading}>Submit Feedback</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
