import { listClients, listServices, listTodayAppointments } from "./api.js";
import { renderAppointmentForm } from "./appointmentForm.js"

const columnsName = ["pendingColumn", "progressColumn", "completedColumn"];
let agendamentos;

async function createItemInfo(agendamento) {
    const itemInfo = document.createElement('div');
    itemInfo.classList.add("itemInfo");

    const pet = agendamento.pet;
    let descricao = agendamento.pet.notes;
    if (!descricao) {
        descricao = "Nenhuma obs informada"
    }

    const htmlContent =  `
    <p><span>${pet.name} (${pet.breed})</span> - ${agendamento.service.name}</p>
    <p>${descricao}</p>
    <hr>
    <div class="itemTime">
    <p>${agendamento.time.slice(0, 5)}</p>
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
    serviceValue.innerText = "R$ " + agendamento.service.price.toString().replace(".", ",");

    pipelineCard.appendChild(customerName);
    pipelineCard.appendChild(serviceValue);

    pipelineCard.appendChild(await createItemInfo(agendamento));

    return pipelineCard;
}

async function createPipelineColumnHeader(columnName, count) {
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
    span.innerText = count;

    itemHeader.appendChild(title);
    itemHeader.appendChild(span);
    return itemHeader;

}

async function createPipelineColumn(columnName) {
    const article = document.createElement("article");
    article.classList.add("pipelineColumn");
    article.classList.add(columnName);

    let stage = "";
    if (columnName === "pendingColumn") {
        stage = "pending";
    } else if (columnName === "progressColumn") {
        stage = "confirmed";
    } else {
        stage = "done";
    }

    const columnAppointments = agendamentos.filter(agendamento => {
        if (stage === "done") {
            return agendamento.current_status === "done" || agendamento.current_status === "done";
        }
        return agendamento.current_status === stage;
    });
    const itemHeader = await createPipelineColumnHeader(columnName, columnAppointments.length);

    article.appendChild(itemHeader);

    for (const agendamento of columnAppointments) {
        article.appendChild(await createPipelineCard(agendamento));
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
    const total = agendamentos.length;

    const completed = agendamentos.filter(agendamento => {
        return agendamento.current_status === "done";
    }).length;

    const expectedRevenue = agendamentos
        .filter(agendamento => agendamento.current_status === "pending" || agendamento.current_status === "confirmed" || agendamento.current_status === "done")
        .reduce((totalValue, agendamento) => totalValue + Number(agendamento.service.price), 0);

    const completionRate = total ? Math.round(completed / total * 100) : 0;

    const cardsList = [
        ["Agendamentos", total.toString(), false],
        ["Faturamento Previsto", expectedRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), false],
        ["Taxa de Conclusão", completionRate + "%", true]
    ];

    const section = document.createElement("section");

    section.classList.add("pipelineCards");
    section.setAttribute("aria-label", "Resumo do pipeline")

    for (const [name, value, isCompMetric] of cardsList) {
        section.appendChild(await createMetricCard(name, value, isCompMetric));
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

    agendamentos = await listTodayAppointments();

    mainContent.replaceChildren(await createPipeline());

    const novoAgendamento = document.querySelector(".btnPrimary");
    novoAgendamento.addEventListener('click', async event => {
        event.preventDefault();

        const tutors = await listClients();
        const services = await listServices();

        mainContent.replaceChildren(await renderAppointmentForm({
            tutors,
            services,
            onSubmit: renderMainPipelinePage
        }));
    })
}