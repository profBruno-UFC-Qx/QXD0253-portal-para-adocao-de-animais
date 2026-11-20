function createHeader() {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerText = "Caixa & Controle Financeiro";

    const p = document.createElement("p");
    p.classList.add("subText");
    p.innerText = "Entradas, despesas e saldo do caixa do petshop.";

    div.appendChild(h1);
    div.appendChild(p);
    header.appendChild(div);

    const button = document.createElement("button");
    button.classList.add("btnPrimary");
    button.type = "button";
    button.innerText = "+ Nova Transação";
    header.appendChild(button);
    return header;
}

function createMetricCard(metric) {
    const article = document.createElement("article");
    article.classList.add("card", "metricCard");
    if (metric.className) {
        article.classList.add(metric.className);
    }

    const span = document.createElement("span");
    span.innerText = metric.name;

    const h1 = document.createElement("h1");
    h1.innerText = metric.value;

    article.appendChild(span);
    article.appendChild(h1);
    return article;
}

function createMetricGrid() {
    const metrics = [
        { name: "Receitas", value: "R$ 4.250,00", className: "positive" },
        { name: "Despesas", value: "R$ 1.580,00", className: "negative" },
        { name: "Lucro Líquido", value: "R$ 2.670,00" }
    ];
    const section = document.createElement("section");
    section.classList.add("metricGrid");

    metrics.forEach(metric => {
        section.appendChild(createMetricCard(metric));
    });

    return section;
}

function createTableHead() {
    const columns = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
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

function createTransactionTypeCell(transaction) {
    const td = document.createElement("td");
    const badge = document.createElement("span");
    badge.classList.add("badge", transaction.badgeClass);
    badge.innerText = transaction.type;
    td.appendChild(badge);
    return td;
}

function createTransactionValueCell(transaction) {
    const td = document.createElement("td");
    td.classList.add(transaction.valueClass);
    td.innerText = transaction.value;
    return td;
}

function createTableRow(transaction) {
    const row = document.createElement("tr");

    [transaction.date, transaction.description, transaction.category].forEach(value => {
        const td = document.createElement("td");
        td.innerText = value;
        row.appendChild(td);
    });

    row.appendChild(createTransactionTypeCell(transaction));
    row.appendChild(createTransactionValueCell(transaction));
    return row;
}

function createTableBody() {
    const transactions = [
        {
            date: "03/11/2026",
            description: "Banho & Tosa - Thor",
            category: "Serviços",
            type: "Entrada",
            badgeClass: "done",
            value: "+ R$ 120,00",
            valueClass: "amountPositive"
        },
        {
            date: "03/11/2026",
            description: "Compra de insumos",
            category: "Insumos",
            type: "Saída",
            badgeClass: "canceled",
            value: "- R$ 350,00",
            valueClass: "amountNegative"
        },
        {
            date: "02/11/2026",
            description: "Banho Completo - Mel",
            category: "Serviços",
            type: "Entrada",
            badgeClass: "done",
            value: "+ R$ 90,00",
            valueClass: "amountPositive"
        }
    ];
    const tbody = document.createElement("tbody");

    transactions.forEach(transaction => {
        tbody.appendChild(createTableRow(transaction));
    });

    return tbody;
}

function createTransactionsCard() {
    const card = document.createElement("div");
    card.classList.add("card", "tableCard");

    const title = document.createElement("h1");
    title.classList.add("tableTitle");
    title.innerText = "Últimas movimentações";

    const tableScroll = document.createElement("div");
    tableScroll.classList.add("tableScroll");
    const table = document.createElement("table");
    table.appendChild(createTableHead());
    table.appendChild(createTableBody());
    tableScroll.appendChild(table);

    card.appendChild(title);
    card.appendChild(tableScroll);
    return card;
}

function createFinancialSection() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "financeiro");
    section.appendChild(createHeader());
    section.appendChild(createMetricGrid());
    section.appendChild(createTransactionsCard());
    return section;
}

export function renderFinancialPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(createFinancialSection());
}
