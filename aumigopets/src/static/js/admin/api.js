import { showErrorModal } from "./errorModal.js";

const URL_BASE = "http://127.0.0.1:1337/api";
const JWT_AUTH_TOKEN = "JWT_AUTH_TOKEN"

function auth() {
    const authToken = localStorage.getItem(JWT_AUTH_TOKEN);
    if (!authToken) {
        window.location.href = "/";
        return null;
    }
    return authToken;
}

async function submitData(endpoint, data, isAuth = true, method = "POST") {
    const headers = {
        "Content-Type": "application/json"
    };

    if (isAuth) {
        const authToken = auth();
        if (!authToken) return false;
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(URL_BASE + endpoint, {
        method,
        headers,
        body: typeof data === "string" ? data : JSON.stringify(data)
    });

    if (!response.ok) {
        if (response.status === 401) {
            window.location.href = "/";
            return false;
        }
        showErrorModal(`Erro ao salvar os dados (código ${response.status}).`);
        return false;
    }

    return true;
}

async function fetchData(endpoint, params = "", isAuth = true) {
    const headers = {};

    if (isAuth) {
        const authToken = auth();
        if (!authToken) return null;
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(URL_BASE + endpoint + params, {
        method: "GET",
        headers
    });

    if (!response.ok) {
        if (response.status === 401) {
            window.location.href = "/";
            return null;
        }
        showErrorModal(`Erro ao carregar os dados (código ${response.status}).`);
        return null;
    }

    return await response.json();
}

export async function listAppointments() {
    const response = await fetchData("/appointments", "?populate=user&populate=service&populate=pet", true);
    return response?.data;
}

export async function listTodayAppointments() {
    const today = new Date().toLocaleDateString("en-CA");
    const response = await fetchData(
        "/appointments",
        `?populate=user&populate=service&populate=pet&filters[date][$eq]=${today}`,
        true
    );
    return response?.data;
}

export async function listServices() {
    const response = await fetchData("/services", "", false);
    return response?.data;
}

export async function listClients() {
    return await fetchData("/users", "?populate=pets&populate=appointments", true);
}

export async function getClient(userId) {
    return await fetchData(
        `/users/${userId}`,
        "?populate[pets]=true&populate[appointments][populate][service]=true&populate[appointments][populate][pet]=true",
        true
    );
}

export async function getReports() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth();
    const inicioMes = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const fimMes = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(diasNoMes).padStart(2, "0")}`;
    const inicioMesISO = new Date(ano, mes, 1).toISOString();
    const inicioProximoMesISO = new Date(ano, mes + 1, 1).toISOString();

    const transactionResponse = await fetchData(
        "/transactions",
        `?filters[createdAt][$gte]=${encodeURIComponent(inicioMesISO)}&filters[createdAt][$lt]=${encodeURIComponent(inicioProximoMesISO)}`,
        true
    );
    if (!transactionResponse || !Array.isArray(transactionResponse.data)) {
        throw new Error("Não foi possível carregar as transações do relatório.");
    }

    const appointmentResponse = await fetchData(
        "/appointments",
        `?filters[date][$between][0]=${inicioMes}&filters[date][$between][1]=${fimMes}&filters[current_status][$in]=done&populate=service`,
        true
    );
    if (!appointmentResponse || !Array.isArray(appointmentResponse.data)) {
        throw new Error("Não foi possível carregar os agendamentos do relatório.");
    }

    const faturamentoPorSemana = Array.from(
        { length: Math.ceil(diasNoMes / 7) },
        (_, index) => ({
            semana: `Semana ${index + 1}`,
            valor: 0
        })
    );
    const entradas = transactionResponse.data.filter(transaction => transaction.type === "in");
    const saidas = transactionResponse.data.filter(transaction => transaction.type === "out");
    const faturamentoMes = entradas.reduce((total, transaction) => total + Number(transaction.value), 0);
    const despesasMes = saidas.reduce((total, transaction) => total + Number(transaction.value), 0);
    const servicosContagem = {};

    entradas.forEach(transaction => {
        const dia = new Date(transaction.createdAt).getDate();
        faturamentoPorSemana[Math.floor((dia - 1) / 7)].valor += Number(transaction.value);
    });

    appointmentResponse.data.forEach(agendamento => {
        const nomeServico = agendamento.service.name;
        servicosContagem[nomeServico] = (servicosContagem[nomeServico] || 0) + 1;
    });

    return {
        faturamentoMes: faturamentoMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        despesasMes: despesasMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        margemLiquida: faturamentoMes
            ? (faturamentoMes - despesasMes) / faturamentoMes * 100
            : null,
        ticketMedio: (entradas.length
            ? faturamentoMes / entradas.length
            : 0
        ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        faturamentoSemanal: faturamentoPorSemana,
        servicosMaisRealizados: Object.entries(servicosContagem)
            .map(([nome, quantidade]) => ({ nome, quantidade }))
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 5)
    };
}

export async function listReviews() {
    const response = await fetchData("/reviews", "?populate[user]=true&populate[appointment][populate][pet]=true&populate[appointment][populate][service]=true", true);
    return response?.data;
}

export async function listUserPets(userId) {
    return await fetchData(`/users/${userId}`, "?populate=pets", true);
}

export async function listPets() {
    const response = await fetchData("/pets", "", true);
    return response?.data;
}

export async function listTransactions() {
    const response = await fetchData("/transactions", "?populate=user&sort=createdAt:desc", true);
    return response?.data;
}

export async function postLogout() {
    return await submitData("/auth/logout", {}, true);
}

export async function postAppointment(payload) {
    return await submitData("/appointments", payload, true);
}

export async function postService(payload) {
    return await submitData("/services", payload, true);
}

export async function postTransaction(payload) {
    if (!payload.data.user) {
        const currentUser = await fetchData("/users/me", "", true);
        if (!currentUser || !currentUser.documentId) {
            showErrorModal("Não foi possível identificar o usuário da transação.");
            return false;
        }

        payload = {
            ...payload,
            data: {
                ...payload.data,
                user: currentUser.documentId
            }
        };
    }

    return await submitData("/transactions", payload, true);
}

export async function getAppointment(id) {
    return await fetchData(`/appointments/${id}`, "?populate=user&populate=service", true);
}

export async function updateAppointmentStatus(appointmentId, currentStatus) {
    if (currentStatus !== "pending" && currentStatus !== "confirmed") {
        return false;
    }

    const next = currentStatus === "pending" ? "confirmed" : "done";
    const appointmentInfos = await getAppointment(appointmentId);
    if (!appointmentInfos?.data) return false;

    if (next === "done") {
        const transaction = {
            data: {
                name: appointmentInfos.data.service.name,
                type: "in",
                user: appointmentInfos.data.user.documentId,
                value: appointmentInfos.data.service.price
            }
        };
    
        const transactionSaved = await postTransaction(transaction);
        if (!transactionSaved) return false;
    }

    return await submitData(
        `/appointments/${appointmentId}`,
        { data: { current_status: next } },
        true,
        "PUT"
    );
}