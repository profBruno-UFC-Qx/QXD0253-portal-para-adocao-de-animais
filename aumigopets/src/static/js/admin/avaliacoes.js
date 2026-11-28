import { listReviews } from "./api.js";

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

    console.log(review)

    const h1 = document.createElement("h1");
    h1.innerText = review.user.username;

    const stars = document.createElement("p");
    stars.classList.add("stars");
    stars.setAttribute("aria-label", review.rating + " estrelas");
    stars.innerText = "★".repeat(Number(review.rating)) + "☆".repeat(5 - Number(review.rating));

    const quote = document.createElement("blockquote");
    quote.innerText = review.comment;

    const description = document.createElement("p");
    description.classList.add("subText");
    description.innerText = review.appointment.pet.name + " - " + review.appointment.service.name;

    article.appendChild(h1);
    article.appendChild(stars);
    article.appendChild(quote);
    article.appendChild(description);
    return article;
}

async function createReviewsGrid() {
    const reviews = await listReviews();

    if (reviews.length === 0) {
        const emptyState = document.createElement("p");
        emptyState.classList.add("emptyState");
        emptyState.innerText = "Não há avaliações disponíveis no momento.";
        return emptyState;
    }

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
