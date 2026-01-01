'use client';

import React, { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await dashboardApi.getAdmin();
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

    const {
        stats = { totalProjects: 0, onTrack: 0, atRisk: 0, critical: 0 },
        highRiskProjects = [],
        openHighRisks = [],
        projectsMissingCheckIns = []
    } = data || {};

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Project Health Overview</h1>
                <p className="text-gray-500">Monitor all ongoing projects and delivery risks</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="!p-4">
                    <p className="text-sm text-gray-500">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </Card>
                <Card className="!p-4 border-l-4 border-l-green-500">
                    <p className="text-sm text-gray-500">On Track</p>
                    <p className="text-2xl font-bold text-green-600">{stats.onTrack}</p>
                </Card>
                <Card className="!p-4 border-l-4 border-l-amber-500">
                    <p className="text-sm text-gray-500">At Risk</p>
                    <p className="text-2xl font-bold text-amber-600">{stats.atRisk}</p>
                </Card>
                <Card className="!p-4 border-l-4 border-l-red-500">
                    <p className="text-sm text-gray-500">Critical</p>
                    <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* High Risk Projects */}
                <Card title="Projects Needing Attention" description="Projects with Critical or At Risk status">
                    <div className="space-y-4">
                        {highRiskProjects.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">All projects are healthy!</p>
                        ) : (
                            highRiskProjects.map((project: any) => (
                                <Link
                                    key={project._id}
                                    href={`/admin/projects/${project._id}`}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{project.name}</p>
                                        <p className="text-xs text-gray-500">Client: {project.client.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={project.status === 'Critical' ? 'danger' : 'warning'}>
                                            {project.status}
                                        </Badge>
                                        <p className="text-xs text-gray-400 mt-1">Score: {project.healthScore}</p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </Card>

                {/* High Severity Risks */}
                <Card title="Top Delivery Risks" description="Active High and Medium severity risks">
                    <div className="space-y-4">
                        {openHighRisks.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No critical risks reported.</p>
                        ) : (
                            openHighRisks.map((risk: any) => (
                                <div key={risk._id} className="p-3 border border-gray-100 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <p className="font-medium text-gray-900">{risk.title}</p>
                                        <Badge variant={risk.severity === 'High' ? 'danger' : 'warning'}>
                                            {risk.severity}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Project: {risk.project.name}</p>
                                    <div className="mt-2 bg-gray-50 p-2 rounded text-xs text-gray-600 italic">
                                        Mitigation: {risk.mitigationPlan}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Missing Check-ins */}
            <Card title="Operational Gaps" description="Projects with no check-ins in the last 7 days">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-gray-100 italic text-gray-400">
                                <th className="pb-3 font-medium">Project Name</th>
                                <th className="pb-3 font-medium">Assigned Employees</th>
                                <th className="pb-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectsMissingCheckIns.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-500 italic">
                                        All teams are up to date with their check-ins.
                                    </td>
                                </tr>
                            ) : (
                                projectsMissingCheckIns.map((project: any) => (
                                    <tr key={project._id} className="border-b border-gray-50 last:border-0">
                                        <td className="py-4 font-medium text-gray-900">{project.name}</td>
                                        <td className="py-4 text-gray-600">
                                            {project.employees.map((e: any) => e.name).join(', ')}
                                        </td>
                                        <td className="py-4 text-right">
                                            <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                                                Nudge Team
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
