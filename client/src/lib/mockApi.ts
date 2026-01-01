import { db } from './mockDatabase';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getRes = (data: any, success = true, message = '') => ({
    data: { success, data, message }
});

export const mockAuthApi = {
    login: async (email: string, pass: string) => {
        await delay(500);
        const users = db.get('users');
        const user = users.find((u: any) => u.email === email && u.password === pass);
        if (user) {
            const { password, ...userWithoutPass } = user;
            localStorage.setItem('token', 'mock-jwt-token');
            localStorage.setItem('user', JSON.stringify(userWithoutPass));
            return getRes({ token: 'mock-jwt-token', user: userWithoutPass });
        }
        throw { response: { data: { message: 'Invalid credentials' } } };
    },
    getCurrentUser: async () => {
        const user = localStorage.getItem('user');
        return getRes(user ? JSON.parse(user) : null);
    },
    logout: async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return getRes({});
    }
};

export const mockProjectsApi = {
    getAll: async () => getRes(db.get('projects')),
    getById: async (id: string) => getRes(db.getById('projects', id)),
    create: async (data: any) => {
        const admin: any = JSON.parse(localStorage.getItem('user') || '{}');
        const project = db.insert('projects', { ...data, healthScore: 100, status: 'On Track' });
        db.insert('activities', {
            project: project._id,
            activityType: 'project_created',
            user: { name: admin.name },
            description: `Project "${project.name}" created by ${admin.name}`
        });
        return getRes(project);
    },
    update: async (id: string, data: any) => getRes(db.update('projects', id, data))
};

export const mockCheckinsApi = {
    create: async (data: any) => {
        const emp: any = JSON.parse(localStorage.getItem('user') || '{}');
        const checkin = db.insert('checkins', { ...data, employee: emp._id });
        db.insert('activities', {
            project: data.project,
            activityType: 'checkin_submitted',
            user: { name: emp.name },
            description: `${emp.name} submitted a weekly check-in`
        });
        return getRes(checkin);
    },
    getByProject: async (pid: string) => getRes(db.query('checkins', c => c.project === pid)),
    getPending: async () => getRes([])
};

export const mockRisksApi = {
    getAll: async () => getRes(db.get('risks')),
    create: async (data: any) => {
        const user: any = JSON.parse(localStorage.getItem('user') || '{}');
        const risk = db.insert('risks', { ...data, createdBy: user, status: 'Open' });
        db.insert('activities', {
            project: data.project,
            activityType: 'risk_created',
            user: { name: user.name },
            description: `${user.name} reported a new risk: ${data.title}`
        });
        return getRes(risk);
    },
    update: async (id: string, updates: any) => {
        const user: any = JSON.parse(localStorage.getItem('user') || '{}');
        const risk = db.update('risks', id, updates);
        if (updates.status) {
            db.insert('activities', {
                project: risk.project._id,
                activityType: updates.status === 'Resolved' ? 'risk_resolved' : 'risk_updated',
                user: { name: user.name },
                description: `${user.name} ${updates.status === 'Resolved' ? 'resolved' : 'updated'} risk: ${risk.title}`
            });
        }
        return getRes(risk);
    },
    getHighPriority: async () => getRes(db.query('risks', r => r.severity === 'High' && r.status === 'Open'))
};

export const mockDashboardApi = {
    getAdmin: async () => {
        const projects = db.get('projects');
        const risks = db.query('risks', r => r.status === 'Open');
        return getRes({
            stats: { totalProjects: projects.length, atRisk: projects.filter((p: any) => p.healthScore < 70).length },
            projects,
            topRisks: risks.slice(0, 5)
        });
    },
    getEmployee: async () => {
        const user: any = JSON.parse(localStorage.getItem('user') || '{}');
        const projects = db.query('projects', p => p.employees?.some((e: any) => e._id === user._id));
        return getRes({ projects, pendingCheckins: [] });
    },
    getClient: async () => {
        const user: any = JSON.parse(localStorage.getItem('user') || '{}');
        const projects = db.query('projects', p => p.client?._id === user._id);
        return getRes({ projects, pendingFeedback: [] });
    }
};

export const mockActivitiesApi = {
    getByProject: async (pid: string) => getRes(db.query('activities', a => a.project === pid))
};

export const mockFeedbackApi = {
    create: async (data: any) => {
        const client: any = JSON.parse(localStorage.getItem('user') || '{}');
        const feedback = db.insert('feedback', { ...data, client: client._id });
        db.insert('activities', {
            project: data.project,
            activityType: 'feedback_submitted',
            user: { name: client.name },
            description: `Client feedback received from ${client.name}`
        });
        return getRes(feedback);
    },
    getByProject: async (pid: string) => getRes(db.query('feedback', f => f.project === pid)),
    getPending: async () => getRes([])
};
