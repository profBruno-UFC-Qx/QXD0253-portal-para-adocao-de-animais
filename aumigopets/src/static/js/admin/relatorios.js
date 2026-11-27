import { getReports } from "./api.js";

function createHeader() {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerText = "Relatórios & Lucratividade";

    const p = document.createElement("p");
    p.classList.add("subText");
    p.innerText = "Desempenho, ticket médio e serviços mais realizados.";

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

function formatMargin(margin) {
    if (margin === null) {
        return "N/D";
    }

    return `${Number(margin).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
}

function exportReport(report) {
    const rows = [
        ["Indicador", "Valor"],
        ["Faturamento do mês", report.faturamentoMes],
        ["Despesas do mês", report.despesasMes],
        ["Margem líquida", formatMargin(report.margemLiquida)],
        ["Ticket médio", report.ticketMedio],
        [],
        ["Faturamento semanal", "Valor"]
    ];

    report.faturamentoSemanal.forEach(week => {
        rows.push([week.semana, Number(week.valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })]);
    });

    rows.push([], ["Serviços mais realizados", "Quantidade"]);
    report.servicosMaisRealizados.forEach(service => {
        rows.push([service.nome, service.quantidade]);
    });

    const csv = "\uFEFF" + rows
        .map(row => row.map(value => {
            const text = value === undefined || value === null ? "" : value;
            return `"${String(text).replace(/"/g, '""')}"`;
        }).join(";"))
        .join("\n");
    const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "relatorio-financeiro.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(fileUrl), 0);
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
        { name: "Margem líquida", value: formatMargin(report.margemLiquida) },
        { name: "Ticket médio", value: report.ticketMedio }
    ];
    if (report.margemLiquida !== null) {
        metrics[1].className = report.margemLiquida >= 0 ? "positive" : "negative";
    }
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
        bar.style.height = (Number(week.valor) / (maxValue || 1) * 100) + "%";
        bar.title = `${week.semana}: ${Number(week.valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}`;
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

    if (!report.servicosMaisRealizados.length) {
        const emptyState = document.createElement("p");
        emptyState.classList.add("emptyState");
        emptyState.innerText = "Nenhum serviço concluído neste período.";
        div.appendChild(emptyState);
        return div;
    }

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
    const report = await getReports();
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "relatorios");
    const header = createHeader();
    header.querySelector(".btnPrimary").addEventListener("click", () => exportReport(report));
    section.appendChild(header);
    section.appendChild(await createMetricGrid(report));
    section.appendChild(await createReportGrid(report));
    return section;
}

export async function renderReportsPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(await createReportsSection());
}
