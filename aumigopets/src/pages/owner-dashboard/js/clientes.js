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

    const button = document.createElement("button");
    button.classList.add("btnPrimary");
    button.type = "button";
    button.innerText = "+ Novo Tutor";
    header.appendChild(button);
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

function createTableBody() {
    const tutors = [
        {
            name: "Mariana Souza",
            email: "mariana@exemplo.com",
            phone: "(11) 98765-1111",
            pet: "Mel (Poodle)",
            visits: "8 visitas"
        },
        {
            name: "Carlos Alberto",
            email: "carlos@exemplo.com",
            phone: "(11) 97654-2222",
            pet: "Thor (Pitbull)",
            visits: "5 visitas"
        },
        {
            name: "Fernanda Costa",
            email: "fernanda@exemplo.com",
            phone: "(11) 94321-5555",
            pet: "Bela (Siamês)",
            visits: "6 visitas"
        }
    ];
    const tbody = document.createElement("tbody");

    tutors.forEach(tutor => {
        tbody.appendChild(createTableRow(tutor));
    });

    return tbody;
}

function createTableCard() {
    const card = document.createElement("div");
    card.classList.add("card", "tableCard");

    const tableScroll = document.createElement("div");
    tableScroll.classList.add("tableScroll");
    const table = document.createElement("table");
    table.appendChild(createTableHead());
    table.appendChild(createTableBody());
    tableScroll.appendChild(table);
    card.appendChild(tableScroll);
    return card;
}

function createClientsSection() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "clientes");
    section.appendChild(createHeader());
    section.appendChild(createSearchField());
    section.appendChild(createTableCard());
    return section;
}

export function renderClientsPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(createClientsSection());
}
