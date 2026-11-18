const columnsName = ["pendingColumn", "progressColumn", "completedColumn"];

function createItemInfo() {
    const itemInfo = document.createElement('div');
    itemInfo.classList.add("itemInfo");

    const htmlContent =  `
    <p><span>Bela (Siames)</span> - Tosa Felina</p>
    <p>Gato arisco, usar luvas de contenção</p>
    <hr>
    <div class="itemTime">
    <p>15:30</p>
    <p>ID #5</p>
    </div>`
    itemInfo.innerHTML = htmlContent;
    return itemInfo
}

function createPipelineCard(customer, value) {
    const pipelineCard = document.createElement('div')
    pipelineCard.classList.add('pipelineCard')

    const customerName = document.createElement('h1')
    const serviceValue = document.createElement('p')
    customerName.innerText = customer
    serviceValue.innerText = value

    pipelineCard.appendChild(customerName)
    pipelineCard.appendChild(serviceValue)

    pipelineCard.appendChild(createItemInfo());

    return pipelineCard;
}

function createPipelineColumnHeader(columnName) {
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

function createPipelineColumn(columnName) {
    const article = document.createElement("article");
    article.classList.add("pipelineColumn");
    article.classList.add(columnName);

    const itemHeader = createPipelineColumnHeader(columnName);

    article.appendChild(itemHeader);
    article.appendChild(createPipelineCard("Edmilson", "R$ 100,00"));

    return article;
}


function createPipelineSection() {
    const section = document.createElement('section');
    section.classList.add("pipelineItems");

    for (const col of columnsName) {
        section.appendChild(createPipelineColumn(col))
    }

    return section;
}

function createMetricCard(name, value, isCompMetric) {
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

function createPipelineCards() {
    const cardsList = ["Agendamentos", "Faturamento Previsto", "Taxa de Conclusão"];

    const section = document.createElement("section");
    section.classList.add("pipelineCards");
    section.setAttribute("aria-label", "Resumo do pipeline")

    for (const card of cardsList) {
        if (card === "Taxa de Conclusão") {
            section.appendChild(createMetricCard(card, "87%", true));
            continue;
        }
        section.appendChild(createMetricCard(card, "R$ 500,00", false));
    }

    return section;
}

function createMainHeaderContent() {
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

function createMainHeader() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "pipeline");

    const header = document.createElement("header");
    const button = document.createElement("button");
    button.classList.add("btnPrimary");
    button.type = "button";
    button.innerText = "Novo Agendamento";

    header.classList.add("pageHeader", "dashboardPageHeader");
    header.appendChild(createMainHeaderContent());
    header.appendChild(button);

    section.appendChild(header);
    return section
}

function createPipeline() {
    const section = document.createElement("section")
    section.id = "pipeline-content"

    section.appendChild(createMainHeader());
    section.appendChild(createPipelineCards());
    section.appendChild(createPipelineSection());

    return section;
}

// pendingColumn progressColumn completedColumn
export function renderMainPipelinePage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(createPipeline());
}