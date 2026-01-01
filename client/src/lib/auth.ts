// Token management
export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
};

export const removeToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
};

// User management
export const getUser = (): any | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
};

// Decode JWT to get user info
export const decodeToken = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join(''),
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// Get user role
export const getUserRole = (): string | null => {
    const user = getUser();
    return user?.role || null;
};
