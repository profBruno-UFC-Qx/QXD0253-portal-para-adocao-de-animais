import { listAgendamentos } from "./api.js";

const columnsName = ["pendingColumn", "progressColumn", "completedColumn"];
let agendamentos;

async function createItemInfo(agendamento) {
    const itemInfo = document.createElement('div');
    itemInfo.classList.add("itemInfo");

    const pet = agendamento.pet;
    let descricao = agendamento.descricao;
    if (!descricao) {
        descricao = "-"
    }

    const htmlContent =  `
    <p><span>${pet.nome} (${pet.raca})</span> - ${agendamento.servico.titulo}</p>
    <p>${descricao}</p>
    <hr>
    <div class="itemTime">
    <p>${agendamento.hora.slice(0, 5)}</p>
    <p>ID #${agendamento.id}</p>
    </div>`
    itemInfo.innerHTML = htmlContent;
    return itemInfo
}

async function createPipelineCard(agendamento) {
    const pipelineCard = document.createElement('div');
    pipelineCard.classList.add('pipelineCard');

    const customerName = document.createElement('h1');
    const serviceValue = document.createElement('p');
    customerName.innerText = agendamento.user.username;
    serviceValue.innerText = "R$ " + agendamento.servico.valor.toString().replace(".", ",");

    pipelineCard.appendChild(customerName);
    pipelineCard.appendChild(serviceValue);

    pipelineCard.appendChild(await createItemInfo(agendamento));

    return pipelineCard;
}

async function createPipelineColumnHeader(columnName) {
    const itemHeader = document.createElement("div");
    itemHeader.classList.add("itemHeader");

    let h1 = '';
    let badge = '';
    if (columnName === "pendingColumn") {
        h1 = "Pendentes";
        badge = 'pending'
    } else if (columnName === "progressColumn") {
        h1 = "Em Progresso";
        badge = 'confirmed'
    } else {
        h1 = "Concluídos";
        badge = 'done'
    }
    const title = document.createElement('h1');
    title.innerText = h1;

    const span = document.createElement('span');
    span.classList.add('badge');
    span.classList.add(badge);
    span.innerText = '2';

    itemHeader.appendChild(title);
    itemHeader.appendChild(span);
    return itemHeader;

}

async function createPipelineColumn(columnName) {
    const article = document.createElement("article");
    article.classList.add("pipelineColumn");
    article.classList.add(columnName);

    const itemHeader = await createPipelineColumnHeader(columnName);

    article.appendChild(itemHeader);

    console.log(agendamentos)

    for (const agendamento of agendamentos) {
        if (columnName === "pendingColumn" && agendamento.estagio === "pendente") {
            article.appendChild(
                await createPipelineCard(
                    agendamento
                ));
        } else if (columnName === "progressColumn" && agendamento.estagio === "andamento") {
            article.appendChild(
                await createPipelineCard(
                    agendamento
                ));
        }
    }

    return article;
}

async function createPipelineSection() {
    const section = document.createElement('section');
    section.classList.add("pipelineItems");

    for (const col of columnsName) {
        section.appendChild(await createPipelineColumn(col))
    }

    return section;
}

async function createMetricCard(name, value, isCompMetric) {
    const article = document.createElement("article");
    if (isCompMetric) {
        article.classList.add("card", "pipelineMetric", "completionMetric");
    } else {
        article.classList.add("card", "pipelineMetric");
    }

    const h1 = document.createElement("h1");
    h1.innerText = name;

    const p = document.createElement('p')
    p.innerText = value;

    article.appendChild(h1);
    article.appendChild(p)

    return article;
}

async function createPipelineCards() {
    const cardsList = ["Agendamentos", "Faturamento Previsto", "Taxa de Conclusão"];

    const section = document.createElement("section");
    section.classList.add("pipelineCards");
    section.setAttribute("aria-label", "Resumo do pipeline")

    for (const card of cardsList) {
        if (card === "Taxa de Conclusão") {
            section.appendChild(await createMetricCard(card, "87%", true));
            continue;
        }
        section.appendChild(await createMetricCard(card, "R$ 500,00", false));
    }

    return section;
}

async function createMainHeaderContent() {
    const div = document.createElement("div");

    const h1 = document.createElement("h1");
    h1.innerText = "Pipeline de Atendimentos"

    const p = document.createElement("p");
    p.classList.add("subText");
    p.innerText = "Acompanhe o fluxo dos serviços agendados, em andamento e concluídos hoje."

    div.appendChild(h1);
    div.appendChild(p);

    return div;
    
}

async function createMainHeader() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "pipeline");

    const header = document.createElement("header");
    const button = document.createElement("button");
    button.classList.add("btnPrimary");
    button.type = "button";
    button.innerText = "Novo Agendamento";

    header.classList.add("pageHeader", "dashboardPageHeader");
    header.appendChild(await createMainHeaderContent());
    header.appendChild(button);

    section.appendChild(header);
    return section
}

async function createPipeline() {
    const section = document.createElement("section")
    section.id = "pipeline-content"

    section.appendChild(await createMainHeader());
    section.appendChild(await createPipelineCards());
    section.appendChild(await createPipelineSection());

    return section;
}

// pendingColumn progressColumn completedColumn
export async function renderMainPipelinePage() {
    const mainContent = document.querySelector("#dashboard-content");

    agendamentos = await listAgendamentos();

    mainContent.replaceChildren(await createPipeline());
}