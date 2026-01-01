'use client';

import React, { useEffect, useState } from 'react';
import { risksApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminRisksPage() {
    const [risks, setRisks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRisks = async () => {
        setLoading(true);
        try {
            // Fetch all risks for comprehensive oversight
            const res = await risksApi.getAll();
            if (res.data.success) {
                setRisks(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch risks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRisks();
    }, []);

    const handleStatusUpdate = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'Open' ? 'Resolved' : 'Open';
            await risksApi.update(id, { status: newStatus });
            fetchRisks();
        } catch (err) {
            console.error('Failed to update risk status');
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse text-indigo-600 font-bold">SCANNING DELIVERY RISKS...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Risk Repository</h1>
                <p className="text-gray-500 font-medium">Global oversight of all identified project hazards</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {risks.length === 0 ? (
                    <Card>
                        <div className="text-center py-10">
                            <span className="text-4xl mb-4 block">🛡️</span>
                            <p className="text-gray-500 font-medium">No major risks identified across active projects.</p>
                        </div>
                    </Card>
                ) : (
                    risks.map((risk) => (
                        <Card key={risk._id}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">{risk.title}</h3>
                                        <Badge variant={risk.severity === 'High' ? 'danger' : risk.severity === 'Medium' ? 'warning' : 'default'}>
                                            {risk.severity} Severity
                                        </Badge>
                                        <Badge variant={risk.status === 'Open' ? 'warning' : 'success'}>
                                            {risk.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium italic bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-200">
                                        <span className="font-black not-italic text-indigo-700 uppercase tracking-tighter text-[10px] mr-2">Mitigation:</span>
                                        {risk.mitigationPlan}
                                    </p>
                                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <span>Project: <span className="text-indigo-600">{risk.project?.name}</span></span>
                                        <span>Reported By: <span className="text-indigo-600">{risk.createdBy?.name}</span></span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant={risk.status === 'Open' ? 'secondary' : 'primary'}
                                        onClick={() => handleStatusUpdate(risk._id, risk.status)}
                                        className="text-xs py-2"
                                    >
                                        {risk.status === 'Open' ? 'Mark as Resolved' : 'Reopen Risk'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
