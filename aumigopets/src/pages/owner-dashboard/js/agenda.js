import { listAgendamentos } from './api.js'

async function createHeaderContent() {
    const div = document.createElement("div")

    const h1 = document.createElement("h1");
    h1.innerText = "Gestão de Agendamentos";

    const p = document.createElement("p");
    p.classList.add("subText")
    p.innerText = "Controle completo da agenda por data, status e tutor."

    div.appendChild(h1);
    div.appendChild(p);

    return div;
}

async function createHeader() {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    header.appendChild(await createHeaderContent());

    const button = document.createElement("button");
    button.classList.add("btnPrimary")
    button.type = "button";
    button.innerText = "Agendar Serviço";

    header.appendChild(button);

    return header;
}


// field filterField (filterSearch) <- apenas no filtro de busca
async function createDivFormField(...classes) {
    const div = document.createElement("div");
    div.classList.add(...classes);

    return div;
}


async function createDateField() {
    const div = await createDivFormField("field", "filterField");

    const label = document.createElement("label");
    label.htmlFor = "filtro-data"
    label.innerText = "Data"

    const input = document.createElement("input");
    input.id = "filtro-data"
    input.type = "date"

    div.appendChild(label);
    div.appendChild(input);

    return div;
}

async function createOption(value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = text;

    return option;
}

async function createStatusField() {
    const options = [
        ["todos", "Todos"], 
        ["pendentes", "Pendentes"], 
        ["andamento", "Em Andamento"], 
        ["concluidos", "Concluídos"]
    ]

    const div = await createDivFormField("field", "filterField");

    const label = document.createElement("label");
    label.htmlFor = "filtro-status"
    label.innerText = "Status"

    const select = document.createElement("select");
    select.id = "filtro-status";

    for (const opt of options) {
        select.appendChild(await createOption(...opt));
    }

    div.appendChild(label);
    div.appendChild(select);

    return div;
}


async function createSearchField() {
    const div = await createDivFormField("field", "filterField", "filterSearch");

    const label = document.createElement("label");
    label.htmlFor = "filtro-busca";
    label.innerText = "Buscar";

    const input = document.createElement("input");
    input.id = "filtro-busca";
    input.type = "search";
    input.placeholder = "Tutor ou pet";

    div.appendChild(label);
    div.appendChild(input);

    return div;
}


async function createForm() {
    const form = document.createElement("form");
    form.classList.add("filterBar");
    form.setAttribute("aria-label", "Filtros da agenda");
    
    form.appendChild(await createDateField());
    form.appendChild(await createStatusField());
    form.appendChild(await createSearchField());

    return form;
}

async function createTableHead() {
    const columns = ["Horário", "Tutor", "Pet", "Serviço", "Valor", "Status", "Ações"];
    const thead = document.createElement("thead");
    const row = document.createElement("tr");

    columns.forEach(column => {
        const th = document.createElement("th");
        th.innerText = column;
        row.appendChild(th);
    });

    thead.appendChild(row);
    return thead;
}

async function createTableCell(text) {
    const td = document.createElement("td");
    td.innerText = text;
    return td;
}

async function createStatusCell(status, badgeClass) {
    const td = document.createElement("td");
    const badge = document.createElement("span");
    badge.classList.add("badge", badgeClass);
    badge.innerText = status;
    td.appendChild(badge);
    return td;
}

async function createActionCell() {
    const td = document.createElement("td");
    const button = document.createElement("button");
    button.classList.add("btnCancel");
    button.type = "button";
    button.innerText = "Editar";
    td.appendChild(button);
    return td;
}

async function createTableRow(appointment) {
    const tr = document.createElement("tr");

    tr.appendChild(await createTableCell(appointment.hour.slice(0, 5)));
    tr.appendChild(await createTableCell(appointment.user.username));
    tr.appendChild(await createTableCell(appointment.pet.name));
    tr.appendChild(await createTableCell(appointment.service.name));

    tr.appendChild(await createTableCell(
        Number(appointment.service.price).toLocaleString("pt-BR", { 
            style: "currency", 
            currency: "BRL" 
        }))
    );

    const status = {
        pendente: ["Pendente", "pending"],
        andamento: ["Em andamento", "confirmed"],
        concluido: ["Concluído", "done"]
    }[appointment.estagio] || [appointment.estagio, "pending"];

    tr.appendChild(await createStatusCell(...status));
    tr.appendChild(await createActionCell());

    return tr;
}

async function createTableBody() {
    const appointments = await listAgendamentos();
    const tbody = document.createElement("tbody");

    for (const appointment of appointments) {
        tbody.appendChild(await createTableRow(appointment));
    }

    return tbody;
}

async function createTable() {
    const table = document.createElement("table");
    table.appendChild(await createTableHead());
    table.appendChild(await createTableBody());
    return table;
}

async function createTableCard() {
    const div = await createDivFormField("card", "tableCard");
    const tableScroll = document.createElement("div");
    tableScroll.classList.add("tableScroll");
    tableScroll.appendChild(await createTable());
    div.appendChild(tableScroll);

    return div;
}

async function createAgendaSection() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "agenda");

    section.appendChild(await createHeader());
    section.appendChild(await createForm());
    section.appendChild(await createTableCard());

    return section;
}

export async function renderAgendaPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(await createAgendaSection());
}