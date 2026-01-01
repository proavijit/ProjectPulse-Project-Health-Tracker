'use client';

import React, { useEffect, useState } from 'react';
import { projectsApi, authApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export default function AdminProjects() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch projects
            const projRes = await projectsApi.getAll();
            if (projRes.data.success) setProjects(projRes.data.data);

            // We need a list of clients and employees. 
            // For now, let's assume an endpoint exists or we can seed them.
            // In a real app we'd have a usersApi.
            // Since I'm an AI, I'll add a simplified user fetch or mock it if needed.
            // Let's try to fetch all projects as a way to get unique users or just define roles correctly.
        } catch (err) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Fetch users for assignment (Simplified)
        const fetchUsers = async () => {
            // Ideally: const res = await usersApi.getAll();
            // Since I haven't created a user management API, I'll mock some for the dropdown
            // or better, I should have created one. 
            // Let's create a User list route in the backend next.
        };
        fetchUsers();
    }, []);

    const onSubmit = async (data: any) => {
        setIsCreating(true);
        try {
            // Process multi-select values if needed
            const formattedData = {
                ...data,
                // In a real app, employees would be an array of IDs from a multi-select
                employees: Array.isArray(data.employees) ? data.employees : [data.employees]
            };
            const res = await projectsApi.create(formattedData);
            if (res.data.success) {
                setShowForm(false);
                reset();
                fetchData();
            }
        } catch (err) {
            console.error('Failed to create project');
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) return <div className="text-center py-10 font-medium text-indigo-600 italic">Synchronizing project repository...</div>;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Project Management</h1>
                    <p className="text-sm text-gray-500 font-medium">Create and oversee strategic initiatives</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel Creation' : 'Register New Project'}
                </Button>
            </header>

            {showForm && (
                <Card title="New Project Registration" description="Populate the fields to initialize a new tracking stream">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Project Name"
                                placeholder="Strategic Growth Initiative"
                                {...register('name', { required: 'Project name is required' })}
                                error={errors.name?.message as string}
                            />
                            <div className="flex flex-col gap-1.5 font-medium text-sm">
                                <label className="text-gray-700">Client Owner ID (Required)</label>
                                <Input
                                    placeholder="Enter Client User ID"
                                    {...register('client', { required: 'Client ID is required' })}
                                    error={errors.client?.message as string}
                                />
                                <p className="text-[10px] text-gray-400 italic">Note: Use ID from database for now (e.g. from seed)</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 font-medium text-sm">
                            <label className="text-gray-700">Project Description</label>
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-normal min-h-[100px]"
                                placeholder="Core objectives and scope..."
                            />
                            {errors.description && <span className="text-xs text-red-500">{errors.description.message as string}</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Start Date"
                                type="date"
                                {...register('startDate', { required: 'Start date is required' })}
                                error={errors.startDate?.message as string}
                            />
                            <Input
                                label="Target End Date"
                                type="date"
                                {...register('endDate', { required: 'End date is required' })}
                                error={errors.endDate?.message as string}
                            />
                        </div>

                        <Button type="submit" className="w-full" isLoading={isCreating}>Initialize Project</Button>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project: any) => (
                    <Card key={project._id} title={project.name}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Current Status</span>
                                <Badge variant={
                                    project.status === 'On Track' ? 'success' :
                                        project.status === 'At Risk' ? 'warning' : 'danger'
                                }>
                                    {project.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Health Metrics</span>
                                <span className="font-black text-indigo-600">{project.healthScore}%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Client</span>
                                <span className="font-bold text-gray-700">{project.client.name}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-50 flex gap-2">
                                <Button variant="secondary" className="flex-1 text-xs" onClick={() => router.push(`/projects/${project._id}`)}>Analyze</Button>
                                <Button variant="ghost" className="flex-1 text-xs">Edit Config</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
