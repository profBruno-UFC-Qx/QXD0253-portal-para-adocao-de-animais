function createHeader() {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerText = "Relatórios & Lucratividade";

    const p = document.createElement("p");
    p.classList.add("subText");
    p.innerText = "Desempenho, ticket médio e serviços mais rentáveis.";

    div.appendChild(h1);
    div.appendChild(p);
    header.appendChild(div);

    const button = document.createElement("button");
    button.classList.add("btnPrimary");
    button.type = "button";
    button.innerText = "Exportar Relatório";
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
        { name: "Faturamento do mês", value: "R$ 14.850,00" },
        { name: "Margem líquida", value: "62%", className: "positive" },
        { name: "Ticket médio", value: "R$ 88,00" }
    ];
    const section = document.createElement("section");
    section.classList.add("metricGrid");

    metrics.forEach(metric => {
        section.appendChild(createMetricCard(metric));
    });

    return section;
}

function createReportBars() {
    const values = [
        ["40%", "Sem 1"],
        ["65%", "Sem 2"],
        ["85%", "Sem 3"],
        ["100%", "Sem 4"]
    ];
    const div = document.createElement("div");
    div.classList.add("reportBars");
    div.setAttribute("aria-label", "Gráfico de faturamento semanal");

    values.forEach(value => {
        const bar = document.createElement("div");
        bar.style.height = value[0];
        const label = document.createElement("span");
        label.innerText = value[1];
        bar.appendChild(label);
        div.appendChild(bar);
    });

    return div;
}

function createWeeklyReportCard() {
    const article = document.createElement("article");
    article.classList.add("card", "reportCard");

    const h1 = document.createElement("h1");
    h1.innerText = "Faturamento semanal";
    article.appendChild(h1);
    article.appendChild(createReportBars());
    return article;
}

function createRanking() {
    const services = [
        ["Banho Completo", "142"],
        ["Banho & Tosa", "89"],
        ["Tosa Higiênica", "64"]
    ];
    const div = document.createElement("div");
    div.classList.add("ranking");

    services.forEach(service => {
        const p = document.createElement("p");
        const span = document.createElement("span");
        span.innerText = service[0];
        const strong = document.createElement("strong");
        strong.innerText = service[1];
        p.appendChild(span);
        p.appendChild(strong);
        div.appendChild(p);
    });

    return div;
}

function createRankingCard() {
    const article = document.createElement("article");
    article.classList.add("card", "reportCard");

    const h1 = document.createElement("h1");
    h1.innerText = "Serviços mais realizados";
    article.appendChild(h1);
    article.appendChild(createRanking());
    return article;
}

function createReportGrid() {
    const section = document.createElement("section");
    section.classList.add("reportGrid");
    section.appendChild(createWeeklyReportCard());
    section.appendChild(createRankingCard());
    return section;
}

function createReportsSection() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "relatorios");
    section.appendChild(createHeader());
    section.appendChild(createMetricGrid());
    section.appendChild(createReportGrid());
    return section;
}

export function renderReportsPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(createReportsSection());
}
