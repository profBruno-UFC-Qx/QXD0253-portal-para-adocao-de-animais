const API_URL = 'http://localhost:1337';
const STRAPI_JWT_KEY = 'aumigo_jwt';
const STRAPI_USER_KEY = 'aumigo_user';

function getJwt() {
    return localStorage.getItem(STRAPI_JWT_KEY);
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

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const msg = data?.error?.message || 'Erro ao comunicar com o servidor.';
        throw new Error(msg);
    }

    return data;
}