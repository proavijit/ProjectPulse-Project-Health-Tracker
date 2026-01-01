// Basic LocalStorage database to make the app standalone
const STORAGE_KEY = 'projectpulse_db';

const initialData = {
    users: [
        { _id: 'u1', name: 'Admin User', email: 'admin@projectpulse.com', password: 'admin123', role: 'Admin' },
        { _id: 'u2', name: 'John Developer', email: 'employee@projectpulse.com', password: 'employee123', role: 'Employee' },
        { _id: 'u3', name: 'Sarah Engineer', email: 'sarah@projectpulse.com', password: 'employee123', role: 'Employee' },
        { _id: 'u4', name: 'Client Company', email: 'client@projectpulse.com', password: 'client123', role: 'Client' },
    ],
    projects: [
        {
            _id: 'p1',
            name: 'E-Commerce Platform Redesign',
            description: 'Complete redesign of the e-commerce platform with modern UI/UX and improved performance',
            startDate: '2026-01-01',
            endDate: '2026-06-30',
            client: { _id: 'u4', name: 'Client Company', email: 'client@projectpulse.com' },
            employees: [{ _id: 'u2', name: 'John Developer' }, { _id: 'u3', name: 'Sarah Engineer' }],
            status: 'On Track',
            healthScore: 85,
        },
        {
            _id: 'p2',
            name: 'Mobile App Development',
            description: 'Native mobile application for iOS and Android platforms',
            startDate: '2025-12-01',
            endDate: '2026-03-31',
            client: { _id: 'u4', name: 'Client Company', email: 'client@projectpulse.com' },
            employees: [{ _id: 'u2', name: 'John Developer' }],
            status: 'At Risk',
            healthScore: 68,
        },
    ],
    checkins: [],
    feedback: [],
    risks: [
        {
            _id: 'r1',
            project: { _id: 'p2', name: 'Mobile App Development' },
            createdBy: { _id: 'u2', name: 'John Developer' },
            title: 'iOS Certificate Expiration',
            severity: 'High',
            mitigationPlan: 'Working with Apple support to renew certificate.',
            status: 'Open',
            createdAt: new Date().toISOString()
        }
    ],
    activities: [
        {
            _id: 'a1',
            project: 'p1',
            activityType: 'project_created',
            user: { name: 'Admin User' },
            description: 'Project "E-Commerce Platform Redesign" created',
            createdAt: new Date().toISOString()
        }
    ]
};

const getDB = () => {
    if (typeof window === 'undefined') return initialData;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        return initialData;
    }
    return JSON.parse(data);
};

const saveDB = (data: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
};

export const db = {
    get: (collection: string) => getDB()[collection] || [],
    getById: (collection: string, id: string) => (getDB()[collection] || []).find((item: any) => item._id === id),
    insert: (collection: string, item: any) => {
        const data = getDB();
        const newItem = { ...item, _id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
        data[collection] = [...(data[collection] || []), newItem];
        saveDB(data);
        return newItem;
    },
    update: (collection: string, id: string, updates: any) => {
        const data = getDB();
        data[collection] = (data[collection] || []).map((item: any) =>
            item._id === id ? { ...item, ...updates } : item
        );
        saveDB(data);
        return data[collection].find((item: any) => item._id === id);
    },
    query: (collection: string, filter: (item: any) => boolean) => (getDB()[collection] || []).filter(filter)
};
