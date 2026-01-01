'use client';

import React, { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ClientDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await dashboardApi.getClient();
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (err: any) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center py-10">Loading your projects...</div>;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

    const { stats, assignedProjects, pendingFeedback, lastFeedback } = data;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Project Portfolio</h1>
                    <p className="text-gray-500">View progress and provide feedback on your active projects</p>
                </div>
                <Link href="/client/feedback">
                    <Button>Submit Weekly Feedback</Button>
                </Link>
            </header>

            {/* Notifications */}
            {pendingFeedback.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3 text-indigo-800">
                        <span className="text-xl">📫</span>
                        <div>
                            <p className="font-semibold">Feedback Requested</p>
                            <p className="text-sm">We'd love to hear your thoughts on {pendingFeedback.length} project(s) for this week.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Projects Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedProjects.map((project: any) => (
                    <Card
                        key={project._id}
                        title={project.name}
                        description={project.status}
                    >
                        <div className="space-y-6">
                            <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Health Score</span>
                                <span className={`text-4xl font-black mt-1 ${project.healthScore >= 80 ? 'text-green-600' :
                                        project.healthScore >= 60 ? 'text-amber-600' : 'text-red-600'
                                    }`}>
                                    {project.healthScore}%
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium uppercase tracking-tight text-gray-400">
                                    <span>Team Members</span>
                                    <span>{project.employees.length} Members</span>
                                </div>
                                <div className="flex -space-x-2">
                                    {project.employees.map((emp: any, i: number) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700"
                                            title={emp.name}
                                        >
                                            {emp.name.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link href={`/projects/${project._id}`}>
                                <Button variant="ghost" className="w-full">View Detailed Progress</Button>
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Last Feedback Summary */}
            {lastFeedback && (
                <Card title="Last Feedback Submitted" description={`For ${lastFeedback.project.name}`}>
                    <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-2">
                            <div className="flex gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Satisfaction</p>
                                    <p className="text-lg font-bold text-indigo-600">{lastFeedback.satisfactionRating}/5</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Communication</p>
                                    <p className="text-lg font-bold text-indigo-600">{lastFeedback.communicationRating}/5</p>
                                </div>
                            </div>
                            {lastFeedback.comments && (
                                <p className="text-sm text-gray-600 italic">"{lastFeedback.comments}"</p>
                            )}
                        </div>
                        <Badge variant={lastFeedback.issueFlagged ? 'danger' : 'success'}>
                            {lastFeedback.issueFlagged ? 'Issue Flagged' : 'Positive'}
                        </Badge>
                    </div>
                </Card>
            )}
        </div>
    );
}
