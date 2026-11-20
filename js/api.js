const API_URL = "http://localhost:1337";

function getToken() {
    return localStorage.getItem("jwt");
}

function setToken(token) {
    if (token) {
        localStorage.setItem("jwt", token);
    } else {
        localStorage.removeItem("jwt");
    }
}

async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        setToken(null);
        throw new Error("Não autorizado. Faça login novamente.");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Erro HTTP ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function normalizeEntry(entry) {
    if (!entry) return null;
    const base = entry.attributes ? { id: entry.id, ...entry.attributes } : entry;
    return {
        ...base,
        id: base.documentId ?? base.id
    };
}

async function fetchNormalized(endpoint) {
    const data = await apiFetch(endpoint);

    if (Array.isArray(data?.data)) {
        return data.data.map(normalizeEntry);
    }
    if (Array.isArray(data)) {
        return data.map(normalizeEntry);
    }

    return normalizeEntry(data?.data ?? data);
}

const getUser = () => fetchNormalized("/api/users/me");
const getPets = () => fetchNormalized("/api/pets");
const getAppointments = () => fetchNormalized("/api/appointments");
const getAvailableServices = () => fetchNormalized("/api/services");

function sendData(endpoint, method, payload, { wrapData = true, normalize = true } = {}) {
    const body = JSON.stringify(wrapData ? { data: payload } : payload);
    return apiFetch(endpoint, { method, body }).then(res =>
        normalize ? normalizeEntry(res?.data ?? res) : res
    );
}

const createPet = (petData) => sendData("/api/pets", "POST", petData);
const updatePet = (id, petData) => sendData(`/api/pets/${id}`, "PUT", petData);

const createAppointment = (appointmentData) => sendData("/api/appointments", "POST", appointmentData);
const cancelAppointment = (id) => sendData(`/api/appointments/${id}`, "PUT", { status: "canceled" });
const rateAppointment = (id, rating, comment) => sendData(`/api/appointments/${id}`, "PUT", { rating, comment });

const updateUser = (id, userData) => sendData(`/api/users/${id}`, "PUT", userData, { wrapData: false });
const changePassword = (payload) => sendData("/api/auth/change-password", "POST", payload, { wrapData: false, normalize: false });