const API_URL = "http://localhost:1337"
const TOKEN_KEY = "jwt"

function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

function setToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token)
    } else {
        localStorage.removeItem(TOKEN_KEY)
    }
}

async function apiFetch(endpoint, options = {}) {
    const token = getToken()
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    })

    if (response.status === 401) {
        setToken(null)
        // location.hash = "#/login" COLOCAR AQUI QUANDO TIVER LOGIN
        throw new Error("Não autorizado. Faça login novamente.")
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Detalhes do erro:", errorData?.error)

        const detalhes = errorData?.error?.details?.errors
            ?.map(d => `${(d.path || []).join(".")}: ${d.message}`)
            .join(" | ")

        throw new Error(detalhes || errorData?.error?.message || `Erro HTTP ${response.status}`)
    }

    if (response.status === 204) {
        return null
    }

    return response.json()
}

function normalizeEntry(entry) {
    if (!entry) return null
    const base = entry.attributes ? { id: entry.id, ...entry.attributes } : entry
    return {
        ...base,
        numericId: base.id,
        id: base.documentId ?? base.id
    }
}

async function fetchNormalized(endpoint) {
    const data = await apiFetch(endpoint)

    if (Array.isArray(data?.data)) {
        return data.data.map(normalizeEntry)
    }
    if (Array.isArray(data)) {
        return data.map(normalizeEntry)
    }

    return normalizeEntry(data?.data ?? data)
}

function uniqueByDocument(list) {
    const unique = new Map()
    for (const e of list ?? []) {
        const key = e.documentId ?? e.id
        if (!unique.has(key) || e.publishedAt) unique.set(key, e)
    }
    return [...unique.values()].map(normalizeEntry)
}
const getUser = () => fetchNormalized("/api/users/me")
const getPets = async () =>
    uniqueByDocument((await apiFetch("/api/users/me?populate=pets"))?.pets)
const getAppointments = async () =>
    uniqueByDocument(
        (await apiFetch("/api/users/me?populate[appointments][populate][0]=service" + "&populate[appointments][populate][1]=pet" + "&populate[appointments][populate][2]=review"))?.appointments)
const getAvailableServices = () => fetchNormalized("/api/services")

function sendData(endpoint, method, payload, { wrapData = true, normalize = true } = {}) {
    const body = JSON.stringify(wrapData ? { data: payload } : payload)
    return apiFetch(endpoint, { method, body }).then(res =>
        normalize ? normalizeEntry(res?.data ?? res) : res
    )
}

const createPet = (petData) => sendData("/api/pets", "POST", petData)
const updatePet = (id, petData) => sendData(`/api/pets/${id}`, "PUT", petData)

const createAppointment = (appointmentData) => sendData("/api/appointments", "POST", appointmentData)
const cancelAppointment = (id) => sendData(`/api/appointments/${id}`, "PUT", { current_status: "canceled" })
const rateAppointment = (ratingData) => sendData(`/api/reviews/`, "POST", ratingData)

const updateUser = (id, userData) => sendData(`/api/users/${id}`, "PUT", userData, { wrapData: false })
const changePassword = (payload) => sendData("/api/auth/change-password", "POST", payload, { wrapData: false, normalize: false })