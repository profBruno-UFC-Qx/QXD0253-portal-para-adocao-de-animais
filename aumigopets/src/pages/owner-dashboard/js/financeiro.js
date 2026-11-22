import { listTransacoes } from "./api.js";

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

async function createMetricGrid(transactions) {
    const incomes = transactions
        .filter(transaction => transaction.tipo === "entrada")
        .reduce((total, transaction) => total + Number(transaction.valor), 0);
    const expenses = transactions
        .filter(transaction => transaction.tipo === "saida")
        .reduce((total, transaction) => total + Number(transaction.valor), 0);
    const metrics = [
        { name: "Receitas", value: incomes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), className: "positive" },
        { name: "Despesas", value: expenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), className: "negative" },
        { name: "Lucro Líquido", value: (incomes - expenses).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }
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

async function createTableBody(transactions) {
    const tbody = document.createElement("tbody");

    transactions.forEach(transaction => {
        const isIncome = transaction.tipo === "entrada";
        tbody.appendChild(createTableRow({
            date: transaction.data,
            description: transaction.descricao,
            category: transaction.categoria,
            type: isIncome ? "Entrada" : "Saída",
            badgeClass: isIncome ? "done" : "canceled",
            value: Number(transaction.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            valueClass: isIncome ? "amountPositive" : "amountNegative"
        }));
    });

    return tbody;
}

async function createTransactionsCard(transactions) {
    const card = document.createElement("div");
    card.classList.add("card", "tableCard");

    const title = document.createElement("h1");
    title.classList.add("tableTitle");
    title.innerText = "Últimas movimentações";

    const tableScroll = document.createElement("div");
    tableScroll.classList.add("tableScroll");
    const table = document.createElement("table");
    table.appendChild(createTableHead());
    table.appendChild(await createTableBody(transactions));
    tableScroll.appendChild(table);

    card.appendChild(title);
    card.appendChild(tableScroll);
    return card;
}

async function createFinancialSection() {
    const transactions = await listTransacoes();
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "financeiro");
    section.appendChild(createHeader());
    section.appendChild(await createMetricGrid(transactions));
    section.appendChild(await createTransactionsCard(transactions));
    return section;
}

export async function renderFinancialPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(await createFinancialSection());
}
