import { listAvaliacoes } from "./api.js";

function createHeader() {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerText = "Central de Avaliações";

    const p = document.createElement("p");
    p.classList.add("subText");
    p.innerText = "Monitore a opinião dos tutores sobre os serviços prestados.";

    div.appendChild(h1);
    div.appendChild(p);
    header.appendChild(div);
    return header;
}

function createReviewCard(review) {
    const article = document.createElement("article");
    article.classList.add("card", "reviewCard");

    const h1 = document.createElement("h1");
    h1.innerText = review.tutor;

    const stars = document.createElement("p");
    stars.classList.add("stars");
    stars.setAttribute("aria-label", review.nota + " estrelas");
    stars.innerText = "★".repeat(Number(review.nota)) + "☆".repeat(5 - Number(review.nota));

    const quote = document.createElement("blockquote");
    quote.innerText = review.comentario;

    const description = document.createElement("p");
    description.classList.add("subText");
    description.innerText = review.pet + " - " + review.servico;

    article.appendChild(h1);
    article.appendChild(stars);
    article.appendChild(quote);
    article.appendChild(description);
    return article;
}

async function createReviewsGrid() {
    const reviews = await listAvaliacoes();
    const section = document.createElement("section");
    section.classList.add("reviewsGrid");

    reviews.forEach(review => {
        section.appendChild(createReviewCard(review));
    });

    return section;
}

async function createReviewsSection() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "avaliacoes");
    section.appendChild(createHeader());
    section.appendChild(await createReviewsGrid());
    return section;
}

export async function renderReviewsPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(await createReviewsSection());
}
