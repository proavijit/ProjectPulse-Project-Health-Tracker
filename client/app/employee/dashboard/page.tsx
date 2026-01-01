'use client';

import React, { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function EmployeeDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await dashboardApi.getEmployee();
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

    if (loading) return <div className="text-center py-10">Loading dashboard...</div>;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

    const { stats, assignedProjects, pendingCheckIns, myOpenRisks } = data;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Workspace</h1>
                    <p className="text-gray-500">Track your projects and report weekly progress</p>
                </div>
                <Link href="/employee/checkin">
                    <Button>Submit New Check-in</Button>
                </Link>
            </header>

            {/* Quick Actions / Alerts */}
            {pendingCheckIns.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3 text-amber-800">
                        <span className="text-xl">⏳</span>
                        <div>
                            <p className="font-semibold">Pending Weekly Check-ins</p>
                            <p className="text-sm">You have {pendingCheckIns.length} projects needing a progress update for this week.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* My Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedProjects.length === 0 ? (
                    <Card className="col-span-full py-12 text-center text-gray-500">
                        You are not assigned to any active projects yet.
                    </Card>
                ) : (
                    assignedProjects.map((project: any) => (
                        <Card
                            key={project._id}
                            title={project.name}
                            footer={
                                <Link href={`/employee/checkin?project=${project._id}`}>
                                    <Button variant="ghost" className="w-full text-xs">Update Progress</Button>
                                </Link>
                            }
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <Badge variant={
                                        project.status === 'On Track' ? 'success' :
                                            project.status === 'At Risk' ? 'warning' : 'danger'
                                    }>
                                        {project.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Health Score</span>
                                    <span className={`font-bold ${project.healthScore >= 80 ? 'text-green-600' :
                                            project.healthScore >= 60 ? 'text-amber-600' : 'text-red-600'
                                        }`}>
                                        {project.healthScore}/100
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className="bg-indigo-600 h-1.5 rounded-full"
                                            style={{ width: `${project.healthScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* My Risks */}
            <Card title="My Reported Risks" description="Status of risks you've flagged">
                <div className="space-y-4">
                    {myOpenRisks.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No open risks reported by you.</p>
                    ) : (
                        myOpenRisks.map((risk: any) => (
                            <div key={risk._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{risk.title}</p>
                                    <p className="text-xs text-gray-500">{risk.project.name} • Severity: {risk.severity}</p>
                                </div>
                                <Badge variant={risk.status === 'Open' ? 'warning' : 'success'}>
                                    {risk.status}
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
