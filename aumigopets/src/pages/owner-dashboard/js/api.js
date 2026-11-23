/*
export async function listServicos() -> Promise<Array<{ nome, publico, valor, descricao, duracao }>>
Retorna os serviços cadastrados e seus dados exibidos no catálogo.

export async function listClientes() -> Promise<Array<{ nome, email, telefone, pet, atendimentos }>>
Retorna os tutores cadastrados, seus pets e quantidade de atendimentos.

export async function listAvaliacoes() -> Promise<Array<{ tutor, nota, comentario, pet, servico }>>
Retorna as avaliações dos tutores e os dados relacionados ao atendimento.
---

export async function listTransacoes() -> Promise<Array<{ data, descricao, categoria, tipo, valor }>>
Retorna as movimentações financeiras recentes.

export async function getRelatorios() -> Promise<{ faturamentoMes, margemLiquida, ticketMedio, faturamentoSemanal, servicosMaisRealizados }>
Retorna os indicadores e dados usados nos relatórios.
*/


const URL_BASE = 'http://127.0.0.1:1337/api';

async function auth() {
    let auth_token = localStorage.getItem("auth_token");
    if (!auth_token) {
        window.location.href = "/";
        return;
    }
    return auth_token;

}

async function submitData(endpoint, params, data, is_auth) {
    let auth_token = "";
    if (is_auth) {
        auth_token = await auth();
    }
    
    const headers = {
        "Content-Type": "application/json",
        
    };

    if (is_auth) {
        headers["Authorization"] = "Bearer " + auth_token;
    }

    console.log(headers)

    const response = await fetch(URL_BASE + endpoint, {
        method: "POST",
        headers: { ...headers },
        body: data
    });

    if (!response.ok) {
        console.log("Erro: " + response.status);
        return false;
    }

    return true;
}

async function fetchData(endpoint, params, is_auth) {
    let auth_token = "";
    if (is_auth) {
        auth_token = await auth();
    }

    const headers = {}
    if (is_auth) {
        headers["Authorization"] = "Bearer " + auth_token
    }

    const response = await fetch(URL_BASE + endpoint + params, {
        method: "GET",
        headers: {
            ...headers
        }
    });

    if (!response.ok) {
        if (response.status == 401) {
            window.location.href = '/'
            return
        }
        alert("Error: " + response.status);
        return;
    }

    const data = await response.json();

    return data;
}


export async function listAgendamentos() {
    const today = new Date().toLocaleDateString("en-CA")

    const endpoint = "/appointments";
    const params = `?populate=user&populate=service&populate=pet&filters[date][$eq]=${today}`;
    console.log(params)

    const appointments = await fetchData(endpoint, params, true);

    return appointments.data;
}

export async function listServicos() {
    const endpoint = "/services";
    const params = "";

    const data = await fetchData(endpoint, params, false);

    return data.data;
}

export async function listClientes() {
    const endpoint = "/users";
    const params = "?populate=pets&populate=appointments";

    const data = await fetchData(endpoint, params, true);

    return data
}

export async function listTransacoes() {
    const endpoint = "/appointments";
    const params = "?filters[current_status][$in]=confirmed&filters[current_status][$in]=done";

    const data = await fetchData(endpoint, params, true);

    return data.data;
}


export async function getRelatorios() {
    const relatorio = {
        faturamentoMes: 0,
        margemLiquida: 0,
        ticketMedio: 0,
        faturamentoSemanal: 0,
        servicosMaisRealizados: 0
    };

    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth();

    // Primeiro dia do mês (00:00:00.000) e último dia do mês (23:59:59.999)
    const inicioMes = new Date(ano, mes, 1, 0, 0, 0, 0).toISOString();
    const fimMes = new Date(ano, mes + 1, 0, 23, 59, 59, 999).toISOString();

    const endpoint = "/appointments";
    const params = `?filters[date][$between][0]=${inicioMes}&filters[date][$between][1]=${fimMes}&filters[current_status][$in]=done&populate=service`;

    const servicos_concluidos = await fetchData(endpoint, params, true);
    let faturamentoMes = 0;
    servicos_concluidos.data.array.forEach(agendamento => {
        faturamentoMes += agendamento.service.price;
    });


    return relatorio;

}

export async function listAvaliacoes() {
    const endpoint = "/reviews";

    const data = await fetchData(endpoint, "", true);

    return data.data;
}

export async function listUserPets(userId) {
    const endpoint = "/users/" + userId;
    const params = "?populate=pets";

    const data = await fetchData(endpoint, params, true);

    return data
}

export async function listPets() {
    const endpoint = "/pets";
    const params = "";

    const data = await fetchData(endpoint, params, true);

    return data.data;
}

export async function postAppointment(payload) {
    
    const data = await submitData("/appointments", "", payload, true);
    if (!data) {
        console.log("Não foi possível criar um agendamento.")
    }

    console.log("Sucesso")
}