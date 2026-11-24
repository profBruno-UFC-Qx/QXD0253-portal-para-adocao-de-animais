import { listTransactions } from "./api.js";
import { renderTransactionForm } from "./transactionForm.js";

function formatDate(rawDate) {
    if (!rawDate) {
        return "-";
    }
    return rawDate.slice(0, 10).split("-").reverse().join("/");
}

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

function createMetricGrid(transactions) {
    const incomes = transactions
        .filter(transaction => transaction.type === "in")
        .reduce((total, transaction) => total + Number(transaction.value), 0);
    const expenses = transactions
        .filter(transaction => transaction.type === "out")
        .reduce((total, transaction) => total + Number(transaction.value), 0);
    const metrics = [
        { name: "Receitas", value: incomes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), className: "positive" },
        { name: "Despesas", value: expenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), className: "negative" },
        { name: "Lucro Líquido", value: (incomes - expenses).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }
    ];
    const section = document.createElement("section");
    section.classList.add("metricGrid");

    for (const metric of metrics) {
        section.appendChild(createMetricCard(metric));
    }

    return section;
}

function createTableHead() {
    const columns = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
    const thead = document.createElement("thead");
    const row = document.createElement("tr");

    for (const column of columns) {
        const th = document.createElement("th");
        th.innerText = column;
        row.appendChild(th);
    }

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

    for (const value of [transaction.date, transaction.description, transaction.category]) {
        const td = document.createElement("td");
        td.innerText = value;
        row.appendChild(td);
    }

    row.appendChild(createTransactionTypeCell(transaction));
    row.appendChild(createTransactionValueCell(transaction));
    return row;
}

function createTableBody(transactions) {
    const tbody = document.createElement("tbody");

    for (const transaction of transactions) {
        const isIncome = transaction.type === "in";
        let category = transaction.category;
        if (!category) {
            category = transaction.user ? "Atendimento" : "Geral";
        }

        tbody.appendChild(createTableRow({
            date: formatDate(transaction.date || transaction.createdAt),
            description: transaction.name || "-",
            category: category,
            type: isIncome ? "Entrada" : "Saída",
            badgeClass: isIncome ? "done" : "canceled",
            value: Number(transaction.value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            valueClass: isIncome ? "amountPositive" : "amountNegative"
        }));
    }

    return tbody;
}

function createTransactionsCard(transactions) {
    const card = document.createElement("div");
    card.classList.add("card", "tableCard");

    const title = document.createElement("h1");
    title.classList.add("tableTitle");
    title.innerText = "Últimas movimentações";

    const tableScroll = document.createElement("div");
    tableScroll.classList.add("tableScroll");
    const table = document.createElement("table");
    table.appendChild(createTableHead());
    table.appendChild(createTableBody(transactions));
    tableScroll.appendChild(table);

    card.appendChild(title);
    card.appendChild(tableScroll);
    return card;
}

async function createFinancialSection() {
    const transactions = (await listTransactions()) || [];
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "financeiro");
    section.appendChild(createHeader());
    section.appendChild(createMetricGrid(transactions));
    section.appendChild(createTransactionsCard(transactions));
    return section;
}

export async function renderFinancialPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(await createFinancialSection());

    const newTransactionButton = mainContent.querySelector(".btnPrimary");
    newTransactionButton.addEventListener("click", async event => {
        event.preventDefault();
        mainContent.replaceChildren(await renderTransactionForm({
            onSubmit: renderFinancialPage
        }));
    });
}