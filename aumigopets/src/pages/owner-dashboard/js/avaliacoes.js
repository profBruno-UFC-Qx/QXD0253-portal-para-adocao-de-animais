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
    h1.innerText = review.name;

    const stars = document.createElement("p");
    stars.classList.add("stars");
    stars.setAttribute("aria-label", review.rating + " estrelas");
    stars.innerText = review.stars;

    const quote = document.createElement("blockquote");
    quote.innerText = review.comment;

    const description = document.createElement("p");
    description.classList.add("subText");
    description.innerText = review.details;

    article.appendChild(h1);
    article.appendChild(stars);
    article.appendChild(quote);
    article.appendChild(description);
    return article;
}

function createReviewsGrid() {
    const reviews = [
        {
            name: "Mariana Souza",
            rating: "5",
            stars: "★★★★★",
            comment: "“O atendimento foi impecável. A Mel voltou cheirosa e super calma.”",
            details: "Mel (Poodle) - Banho & Tosa"
        },
        {
            name: "Carlos Alberto",
            rating: "5",
            stars: "★★★★★",
            comment: "“Excelente estrutura e equipe preparada para lidar com meu cachorro.”",
            details: "Thor (Pitbull) - Banho Completo"
        },
        {
            name: "Ana Beatriz",
            rating: "4",
            stars: "★★★★☆",
            comment: "“Muito bom o serviço e pontualidade. O perfume poderia ser mais suave.”",
            details: "Nina (Shih-tzu) - Tosa Higiênica"
        }
    ];
    const section = document.createElement("section");
    section.classList.add("reviewsGrid");

    reviews.forEach(review => {
        section.appendChild(createReviewCard(review));
    });

    return section;
}

function createReviewsSection() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "avaliacoes");
    section.appendChild(createHeader());
    section.appendChild(createReviewsGrid());
    return section;
}

export function renderReviewsPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(createReviewsSection());
}
