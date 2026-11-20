function createHeader() {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerText = "Controle de Despesas";

    const p = document.createElement("p");
    p.classList.add("subText");
    p.innerText = "Gerencie contas a pagar, insumos e custos operacionais.";

    div.appendChild(h1);
    div.appendChild(p);
    header.appendChild(div);

    const button = document.createElement("button");
    button.classList.add("btnPrimary");
    button.type = "button";
    button.innerText = "+ Nova Despesa";
    header.appendChild(button);
    return header;
}

function createTableHead() {
    const columns = ["Vencimento", "Fornecedor", "Categoria", "Valor", "Status", "Ações"];
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

function createStatusCell(expense) {
    const td = document.createElement("td");
    const badge = document.createElement("span");
    badge.classList.add("badge", expense.badgeClass);
    badge.innerText = expense.status;
    td.appendChild(badge);
    return td;
}

function createActionCell(expense) {
    const td = document.createElement("td");
    const button = document.createElement("button");
    button.classList.add("btnCancel");
    button.type = "button";
    button.innerText = expense.action;
    td.appendChild(button);
    return td;
}

function createTableRow(expense) {
    const row = document.createElement("tr");

    [expense.dueDate, expense.vendor, expense.category, expense.value].forEach(value => {
        const td = document.createElement("td");
        td.innerText = value;
        row.appendChild(td);
    });

    row.appendChild(createStatusCell(expense));
    row.appendChild(createActionCell(expense));
    return row;
}

function createTableBody() {
    const expenses = [
        {
            dueDate: "10/11/2026",
            vendor: "Distribuidora PetPro",
            category: "Insumos",
            value: "R$ 350,00",
            status: "Pendente",
            badgeClass: "pending",
            action: "Marcar pago"
        },
        {
            dueDate: "05/11/2026",
            vendor: "Conta de Energia",
            category: "Operacional",
            value: "R$ 480,00",
            status: "Pendente",
            badgeClass: "pending",
            action: "Marcar pago"
        },
        {
            dueDate: "30/10/2026",
            vendor: "Aluguel comercial",
            category: "Infraestrutura",
            value: "R$ 2.200,00",
            status: "Pago",
            badgeClass: "done",
            action: "Editar"
        }
    ];
    const tbody = document.createElement("tbody");

    expenses.forEach(expense => {
        tbody.appendChild(createTableRow(expense));
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

function createExpensesSection() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "despesas");
    section.appendChild(createHeader());
    section.appendChild(createTableCard());
    return section;
}

export function renderExpensesPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(createExpensesSection());
}
