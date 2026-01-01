'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projectsApi, activitiesApi, risksApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ActivityTimeline } from '@/components/ActivityTimeline';

export default function ProjectDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [project, setProject] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [risks, setRisks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, actRes, riskRes] = await Promise.all([
                    projectsApi.getById(id as string),
                    activitiesApi.getByProject(id as string),
                    risksApi.getByProject(id as string)
                ]);

                if (projRes.data.success) setProject(projRes.data.data);
                if (actRes.data.success) setActivities(actRes.data.data);
                if (riskRes.data.success) setRisks(riskRes.data.data);
            } catch (err) {
                console.error('Failed to fetch project details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleBack = () => {
        if (user?.role === 'Admin') router.push('/admin/dashboard');
        else if (user?.role === 'Employee') router.push('/employee/dashboard');
        else if (user?.role === 'Client') router.push('/client/dashboard');
    };

    if (loading) return <div className="text-center py-20 animate-pulse font-medium text-gray-400 italic">Analyzing project data...</div>;
    if (!project) return <div className="text-center py-20 text-red-500">Project not found or access denied.</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50/50 min-h-screen">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={handleBack}
                        className="text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-indigo-600 flex items-center gap-2 mb-2 transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{project.name}</h1>
                    <p className="text-gray-500 mt-2 max-w-2xl text-sm leading-relaxed">{project.description}</p>
                </div>

                <div className="flex flex-col items-end gap-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Health Score</span>
                    <div className="flex items-center gap-3">
                        <span className={`text-4xl font-black ${project.healthScore >= 80 ? 'text-green-600' :
                                project.healthScore >= 60 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                            {project.healthScore}
                        </span>
                        <Badge variant={
                            project.status === 'On Track' ? 'success' :
                                project.status === 'At Risk' ? 'warning' : 'danger'
                        }>
                            {project.status}
                        </Badge>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details & Risks */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Team & Stakeholders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Client Stakeholder">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    {project.client.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{project.client.name}</p>
                                    <p className="text-xs text-gray-500">{project.client.email}</p>
                                </div>
                            </div>
                        </Card>
                        <Card title="Project Team">
                            <div className="flex flex-wrap gap-2">
                                {project.employees.map((emp: any) => (
                                    <div key={emp._id} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100">
                                        {emp.name}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Active Risks */}
                    <Card title="Project Risks" description="Identified delivery risks and mitigation plans">
                        <div className="space-y-4">
                            {risks.filter(r => r.status === 'Open').length === 0 ? (
                                <div className="text-center py-8 bg-green-50/50 rounded-xl border border-green-100 text-green-700 text-sm font-medium italic">
                                    No open risks at the moment. Implementation is smooth.
                                </div>
                            ) : (
                                risks.filter(r => r.status === 'Open').map((risk: any) => (
                                    <div key={risk._id} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm ring-1 ring-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-900">{risk.title}</h4>
                                            <Badge variant={risk.severity === 'High' ? 'danger' : risk.severity === 'Medium' ? 'warning' : 'default'}>
                                                {risk.severity} Severity
                                            </Badge>
                                        </div>
                                        <div className="bg-red-50/50 p-3 rounded-lg text-xs text-red-800 italic border-l-4 border-red-200">
                                            <span className="font-bold not-italic">Plan: </span>{risk.mitigationPlan}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Timeline */}
                <div className="space-y-8">
                    <Card title="Activity Timeline" description="Latest updates from the team and client">
                        <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                            <ActivityTimeline activities={activities} />
                        </div>
                    </Card>

                    <Card title="Timeline Info">
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold uppercase tracking-tighter text-[10px]">Start Date</span>
                                <span className="font-semibold text-gray-700">{new Date(project.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold uppercase tracking-tighter text-[10px]">End Date</span>
                                <span className="font-semibold text-gray-700">{new Date(project.endDate).toLocaleDateString()}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Overall Progress</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-indigo-600 h-full transition-all duration-1000"
                                            style={{ width: `${project.healthScore}%` }}
                                        />
                                    </div>
                                    <span className="font-black text-indigo-600">{project.healthScore}%</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
