import { listServicos } from "./api.js";

function createHeader() {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerText = "Catálogo de Serviços e Preços";

    const p = document.createElement("p");
    p.classList.add("subText");
    p.innerText = "Gerencie os serviços, valores e durações oferecidos.";

    div.appendChild(h1);
    div.appendChild(p);
    header.appendChild(div);

    const button = document.createElement("button");
    button.classList.add("btnPrimary");
    button.type = "button";
    button.innerText = "+ Novo Serviço";
    header.appendChild(button);

    return header;
}

function createServiceCard(service) {
    const article = document.createElement("article");
    article.classList.add("card", "serviceCard");

    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerText = service.name;

    const span = document.createElement("span");
    span.classList.add("badge", "confirmed");
    span.innerText = service.audience;

    div.appendChild(h1);
    div.appendChild(span);
    article.appendChild(div);

    const price = document.createElement("p");
    price.classList.add("servicePrice");
    price.innerText = service.price;

    const description = document.createElement("p");
    description.classList.add("subText");
    description.innerText = service.description;

    const duration = document.createElement("p");
    const strong = document.createElement("strong");
    strong.innerText = "Duração:";
    duration.appendChild(strong);
    duration.appendChild(document.createTextNode(" " + service.duration));

    article.appendChild(price);
    article.appendChild(description);
    article.appendChild(duration);
    return article;
}

async function createServicesGrid() {
    const services = await listServicos();
    const section = document.createElement("section");
    section.classList.add("servicesGrid");
    

    services.forEach(service => {
        section.appendChild(createServiceCard({
            name: service.nome,
            audience: service.publico,
            price: Number(service.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            description: service.descricao,
            duration: service.duracao
        }));
    });

    return section;
}

async function createServicesSection() {
    const section = document.createElement("section");

    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "servicos");
    section.appendChild(createHeader());
    section.appendChild(await createServicesGrid());

    return section;
}

export async function renderServicesPage() {
    const mainContent = document.querySelector("#dashboard-content");

    mainContent.replaceChildren(await createServicesSection());
}
