const API_URL = 'http://localhost:1337';
const STRAPI_JWT_KEY = 'aumigo_jwt';
const STRAPI_USER_KEY = 'aumigo_current_user';

function getJwt() {
    return localStorage.getItem(STRAPI_JWT_KEY);
}

function getStoredUser() {
    try {
        const raw = localStorage.getItem(STRAPI_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function setAuthSession(jwt, user) {
    if (jwt) localStorage.setItem(STRAPI_JWT_KEY, jwt);
    if (user) localStorage.setItem(STRAPI_USER_KEY, JSON.stringify(user));
}

function clearAuthSession() {
    localStorage.removeItem(STRAPI_JWT_KEY);
    localStorage.removeItem(STRAPI_USER_KEY);
}

async function apiRequest(endpoint, { method = 'GET', body = null, auth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };

    if (auth) {
        const token = getJwt();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const fetchOptions = {
        method,
        headers
    };

    if (body !== null && body !== undefined) {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

    if (response.status === 204) {
        return null;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (data?.error?.details?.errors) {
            console.error('Detalhes de validação do Strapi:', data.error.details.errors);
        }
        const msg = data?.error?.message || `Erro HTTP ${response.status}`;
        throw new Error(msg);
    }

    return data;
}