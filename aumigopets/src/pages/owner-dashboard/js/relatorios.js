import { getRelatorios } from "./api.js";

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

async function createMetricGrid(report) {
    const metrics = [
        { name: "Faturamento do mês", value: report.faturamentoMes },
        { name: "Margem líquida", value: report.margemLiquida, className: "positive" },
        { name: "Ticket médio", value: report.ticketMedio }
    ];
    const section = document.createElement("section");
    section.classList.add("metricGrid");

    metrics.forEach(metric => {
        section.appendChild(createMetricCard(metric));
    });

    return section;
}

async function createReportBars(report) {
    const maxValue = Math.max(...report.faturamentoSemanal.map(week => Number(week.valor)));
    const div = document.createElement("div");
    div.classList.add("reportBars");
    div.setAttribute("aria-label", "Gráfico de faturamento semanal");

    report.faturamentoSemanal.forEach(week => {
        const bar = document.createElement("div");
        bar.style.height = (Number(week.valor) / maxValue * 100) + "%";
        const label = document.createElement("span");
        label.innerText = week.semana;
        bar.appendChild(label);
        div.appendChild(bar);
    });

    return div;
}

async function createWeeklyReportCard(report) {
    const article = document.createElement("article");
    article.classList.add("card", "reportCard");

    const h1 = document.createElement("h1");
    h1.innerText = "Faturamento semanal";
    article.appendChild(h1);
    article.appendChild(await createReportBars(report));
    return article;
}

async function createRanking(report) {
    const div = document.createElement("div");
    div.classList.add("ranking");

    report.servicosMaisRealizados.forEach(service => {
        const p = document.createElement("p");
        const span = document.createElement("span");
        span.innerText = service.nome;
        const strong = document.createElement("strong");
        strong.innerText = service.quantidade;
        p.appendChild(span);
        p.appendChild(strong);
        div.appendChild(p);
    });

    return div;
}

async function createRankingCard(report) {
    const article = document.createElement("article");
    article.classList.add("card", "reportCard");

    const h1 = document.createElement("h1");
    h1.innerText = "Serviços mais realizados";
    article.appendChild(h1);
    article.appendChild(await createRanking(report));
    return article;
}

async function createReportGrid(report) {
    const section = document.createElement("section");
    section.classList.add("reportGrid");
    section.appendChild(await createWeeklyReportCard(report));
    section.appendChild(await createRankingCard(report));
    return section;
}

async function createReportsSection() {
    const report = await getRelatorios();
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "relatorios");
    section.appendChild(createHeader());
    section.appendChild(await createMetricGrid(report));
    section.appendChild(await createReportGrid(report));
    return section;
}

export async function renderReportsPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(await createReportsSection());
}
