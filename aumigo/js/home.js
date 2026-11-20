const FEATURED_SERVICES = [
    {
        id: 'banho-tosa',
        name: 'Banho & Tosa Completa',
        description: 'Banho com produtos específicos para pelagem, secagem cuidadosa e tosa higiênica ou na régua.',
        priceFrom: 'A partir de R$ 55,00',
        image: 'img/felizes-animal-estimacao-caes-tocando-capim_1359-228.avif',
        alt: 'Cães felizes ao ar livre'
    },
    {
        id: 'consulta-veterinaria',
        name: 'Consulta Veterinária',
        description: 'Avaliação clínica preventiva, orientações de vacinação e acompanhamento da saúde do seu pet.',
        priceFrom: 'A partir de R$ 110,00',
        image: 'img/Convivencia-de-caes-e-gatos.jpg',
        alt: 'Cão e gato convivendo com tranquilidade'
    },
    {
        id: 'cuidados-felinos',
        name: 'Cuidados Especiais para Gatos',
        description: 'Atendimento tranquilo e adaptado ao temperamento dos gatos, com escovação e higiene.',
        priceFrom: 'A partir de R$ 65,00',
        image: 'img/photo-1548767797-d8c844163c4c.avif',
        alt: 'Gato em ambiente acolhedor'
    }
];

document.addEventListener('aumigo:routechange', (event) => {
    if (event.detail && event.detail.route === 'home') {
        initHome();
    }
});

function initHome() {
    const container = document.getElementById('featuredServices');
    if (!container) return;

    container.innerHTML = FEATURED_SERVICES.map((service) => `
        <article class="serviceCard">
            <img src="${service.image}" alt="${service.alt}">
            <div class="serviceCardBody">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <span class="servicePrice">${service.priceFrom}</span>
                <a href="#/services" class="btnOutline btnSmall">Ver detalhes</a>
            </div>
        </article>
    `).join('');
}