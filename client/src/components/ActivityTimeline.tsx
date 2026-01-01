import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityProps {
    activities: any[];
}

export const ActivityTimeline = ({ activities }: ActivityProps) => {
    if (!activities || activities.length === 0) {
        return <p className="text-gray-500 text-sm text-center py-8 italic">No activity recorded yet.</p>;
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'project_created': return '📁';
            case 'project_updated': return '🔄';
            case 'checkin_submitted': return '📝';
            case 'feedback_submitted': return '📣';
            case 'risk_created': return '⚠️';
            case 'status_changed': return '⚡';
            default: return '📍';
        }
    };

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {activities.map((activity, idx) => (
                    <li key={activity._id}>
                        <div className="relative pb-8">
                            {idx !== activities.length - 1 ? (
                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className="h-8 w-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-sm shadow-sm ring-4 ring-white">
                                        {getActivityIcon(activity.activityType)}
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-800 font-medium">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            By {activity.user?.name}
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-xs text-gray-400 uppercase tracking-tighter">
                                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
