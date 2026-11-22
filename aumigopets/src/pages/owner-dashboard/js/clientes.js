import { listClientes } from "./api.js";

function createHeader() {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerText = "Gestão de Tutores e Pets";

    const p = document.createElement("p");
    p.classList.add("subText");
    p.innerText = "Base de clientes cadastrados e animais vinculados.";

    div.appendChild(h1);
    div.appendChild(p);
    header.appendChild(div);

   
    return header;
}

function createSearchField() {
    const div = document.createElement("div");
    div.classList.add("field", "searchField");

    const label = document.createElement("label");
    label.htmlFor = "cliente-busca";
    label.innerText = "Buscar tutor ou pet";

    const input = document.createElement("input");
    input.id = "cliente-busca";
    input.type = "search";
    input.placeholder = "Nome, e-mail ou pet";

    div.appendChild(label);
    div.appendChild(input);
    return div;
}

function createTableHead() {
    const columns = ["Tutor", "Contato", "Pet vinculado", "Atendimentos", "Ações"];
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

function createTutorCell(tutor) {
    const td = document.createElement("td");
    const strong = document.createElement("strong");
    strong.innerText = tutor.name;

    const email = document.createElement("small");
    email.innerText = tutor.email;

    td.appendChild(strong);
    td.appendChild(document.createElement("br"));
    td.appendChild(email);
    return td;
}

function createActionCell() {
    const td = document.createElement("td");
    const button = document.createElement("button");
    button.classList.add("btnCancel");
    button.type = "button";
    button.innerText = "Ver perfil";
    td.appendChild(button);
    return td;
}

function createTableRow(tutor) {
    const row = document.createElement("tr");
    row.appendChild(createTutorCell(tutor));

    [tutor.phone, tutor.pet, tutor.visits].forEach(value => {
        const td = document.createElement("td");
        td.innerText = value;
        row.appendChild(td);
    });

    row.appendChild(createActionCell());
    return row;
}

async function createTableBody() {
    const tutors = await listClientes();
    const tbody = document.createElement("tbody");

    tutors.forEach(tutor => {
        if (tutor.username !== "maria") {
            tbody.appendChild(createTableRow({
                name: tutor.username,
                email: tutor.email,
                phone: tutor.phone,
                pet: tutor.pet,
                visits: tutor.appointments.length + " visitas"
            }));
        }
    });

    return tbody;
}

async function createTableCard() {
    const card = document.createElement("div");
    card.classList.add("card", "tableCard");

    const tableScroll = document.createElement("div");
    tableScroll.classList.add("tableScroll");
    const table = document.createElement("table");
    table.appendChild(createTableHead());
    table.appendChild(await createTableBody());
    tableScroll.appendChild(table);
    card.appendChild(tableScroll);
    return card;
}

async function createClientsSection() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "clientes");
    section.appendChild(createHeader());
    section.appendChild(createSearchField());
    section.appendChild(await createTableCard());
    return section;
}

export async function renderClientsPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(await createClientsSection());
}
