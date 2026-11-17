const apiConfig = {
    development: import.meta.env.VITE_API_DEVELOPMENT,
    production: import.meta.env.VITE_API_PRODUCTION,
    testing: import.meta.env.VITE_API_TESTING,
};

export const API_URL = apiConfig['development'];

export const getToken = () => {
    try {
        const raw = sessionStorage.getItem('authStore');
        if (!raw) return null;

        const parsed = JSON.parse(raw);

        // pinia-plugin-persistedstate guarda el state directo
        return parsed?.token ?? null;
    } catch (e) {
        console.warn('No se pudo leer el token', e);
        return null;
    }
};

export const authHeaders = () => {
    const token = getToken();

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};
