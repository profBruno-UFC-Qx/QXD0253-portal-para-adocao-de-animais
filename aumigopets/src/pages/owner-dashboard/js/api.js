/*
export async function listServicos() -> Promise<Array<{ nome, publico, valor, descricao, duracao }>>
Retorna os serviços cadastrados e seus dados exibidos no catálogo.

export async function listClientes() -> Promise<Array<{ nome, email, telefone, pet, atendimentos }>>
Retorna os tutores cadastrados, seus pets e quantidade de atendimentos.

---

export async function listTransacoes() -> Promise<Array<{ data, descricao, categoria, tipo, valor }>>
Retorna as movimentações financeiras recentes.

export async function listDespesas() -> Promise<Array<{ vencimento, fornecedor, categoria, valor, status }>>
Retorna as despesas cadastradas e seus status de pagamento.

export async function getRelatorios() -> Promise<{ faturamentoMes, margemLiquida, ticketMedio, faturamentoSemanal, servicosMaisRealizados }>
Retorna os indicadores e dados usados nos relatórios.

export async function listAvaliacoes() -> Promise<Array<{ tutor, nota, comentario, pet, servico }>>
Retorna as avaliações dos tutores e os dados relacionados ao atendimento.
*/


const URL_BASE = 'http://127.0.0.1:1337/api'

async function list(endpoint, params, auth) {
    let auth_token = "";
    if (auth) {
        auth_token = localStorage.getItem("auth_token");
        if (!auth_token) {
            window.location.href = "/";
            return;
        }
    }

    const response = await fetch(URL_BASE + endpoint + params, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + auth_token
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
    return data.data;
}


export async function listAgendamentos() {
    const endpoint = "/agendamentos";
    const params = "?populate=user&populate=servico&populate=pet";

    return await list(endpoint, params, true);
}

export async function listServicos() {
    const endpoint = "/servicos";
    const params = "";

    return await list(endpoint, params, false);
}

export async function listClientes() {
    const endpoint = "/users";
    const params = "?populate=pet&populate=agendamento";

    return await list(endpoint, params, true);
}