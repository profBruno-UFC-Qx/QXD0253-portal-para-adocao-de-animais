import { listAppointments, updateAppointmentStatus } from "./api.js";
import { showErrorModal } from "./errorModal.js";

let agendamentos = [];

function createHeader() {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    header.innerHTML = `
        <div>
            <h1>Gestão de Agendamentos</h1>
            <p class="subText">Controle completo da agenda por data, status e tutor.</p>
        </div>
    `;

    return header;
}

function createFilterForm() {
    const form = document.createElement("form");
    form.classList.add("filterBar");
    form.setAttribute("aria-label", "Filtros da agenda");

    form.innerHTML = `
        <div class="field filterField">
            <label for="filtro-data">Data</label>
            <input id="filtro-data" type="date">
        </div>
        <div class="field filterField">
            <label for="filtro-status">Status</label>
            <select id="filtro-status">
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="confirmed">Em Andamento</option>
                <option value="done">Concluídos</option>
                <option value="canceled">Cancelados</option>
            </select>
        </div>
        <div class="field filterField filterSearch">
            <label for="filtro-busca">Buscar</label>
            <input id="filtro-busca" type="search" placeholder="Tutor ou pet">
        </div>
    `;

    return form;
}

function createTableRow(agendamento, onStatusChange) {
    const tr = document.createElement("tr");

    const valorFormatado = Number(agendamento.service.price).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    let statusTexto = "";
    let badgeClasse = "";

    if (agendamento.current_status === "pending") {
        statusTexto = "Pendente";
        badgeClasse = "pending";
    } else if (agendamento.current_status === "confirmed") {
        statusTexto = "Em andamento";
        badgeClasse = "confirmed";
    } else if (agendamento.current_status === "done") {
        statusTexto = "Concluído";
        badgeClasse = "done";
    } else {
        statusTexto = "Cancelado";
        badgeClasse = "canceled";
    }

    tr.innerHTML = `
        <td>${agendamento.time.slice(0, 5)}</td>
        <td>${agendamento.user.username}</td>
        <td>${agendamento.pet.name}</td>
        <td>${agendamento.service.name}</td>
        <td>${valorFormatado}</td>
        <td><span class="badge ${badgeClasse}">${statusTexto}</span></td>
        <td></td>
    `;

    const button = document.createElement("button");
    button.classList.add("btnCancel");
    button.type = "button";
    button.innerText = "→";
    button.setAttribute("aria-label", "Avançar status do agendamento");
    button.title = "Avançar status";
    button.style.color = "#15803d";
    button.style.fontSize = "20px";

    if (agendamento.current_status !== "pending" && agendamento.current_status !== "confirmed") {
        button.disabled = true;
    }

    button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        button.disabled = true;

        try {
            const updated = await updateAppointmentStatus(
                agendamento.documentId,
                agendamento.current_status
            );

            if (!updated) return;

            if (agendamento.current_status === "pending") {
                agendamento.current_status = "confirmed";
            } else {
                agendamento.current_status = "done";
            }

            onStatusChange();
        } catch (error) {
            console.log(error)
            showErrorModal("Não foi possível avançar o status do agendamento.");
            button.disabled = false;
        }
    });

    tr.lastElementChild.appendChild(button);
    return tr;
}

function createTableBody(lista, onStatusChange) {
    const tbody = document.createElement("tbody");

    for (const agendamento of lista) {
        tbody.appendChild(createTableRow(agendamento, onStatusChange));
    }

    return tbody;
}

function createTableCard(lista, onStatusChange) {
    const card = document.createElement("div");
    card.classList.add("card", "tableCard");

    const tableScroll = document.createElement("div");
    tableScroll.classList.add("tableScroll");

    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Horário</th>
                <th>Tutor</th>
                <th>Pet</th>
                <th>Serviço</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
            </tr>
        </thead>
    `;

    table.appendChild(createTableBody(lista, onStatusChange));
    tableScroll.appendChild(table);
    card.appendChild(tableScroll);

    return card;
}

export async function renderAgendaPage() {
    const mainContent = document.querySelector("#dashboard-content");
    agendamentos = await listAppointments();

    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "agenda");

    const filterForm = createFilterForm();
    const dateInput = filterForm.querySelector("#filtro-data");
    const statusSelect = filterForm.querySelector("#filtro-status");
    const searchInput = filterForm.querySelector("#filtro-busca");

    function filterAppointments() {
        const date = dateInput.value;
        const status = statusSelect.value;
        const search = searchInput.value.trim().toLowerCase();

        const filtrados = agendamentos.filter(agendamento => {
            const matchDate = !date || agendamento.date === date;
            const matchStatus = status === "all" || agendamento.current_status === status;
            const tutorEPet = (agendamento.user.username + " " + agendamento.pet.name).toLowerCase();
            const matchSearch = tutorEPet.includes(search);

            return matchDate && matchStatus && matchSearch;
        });

        const tbodyAtual = section.querySelector("tbody");
        tbodyAtual.replaceWith(createTableBody(filtrados, filterAppointments));
    }

    section.appendChild(createHeader());
    section.appendChild(filterForm);
    section.appendChild(createTableCard(agendamentos, filterAppointments));

    mainContent.replaceChildren(section);

    filterForm.addEventListener("submit", (event) => event.preventDefault());
    dateInput.addEventListener("change", filterAppointments);
    statusSelect.addEventListener("change", filterAppointments);
    searchInput.addEventListener("input", filterAppointments);
}