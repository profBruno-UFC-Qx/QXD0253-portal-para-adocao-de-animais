const SERVICES_CATALOG = [
    {
        id: 'banho-tosa',
        tag: 'Estética',
        name: 'Banho & Tosa Completa',
        description: 'Banho com shampoos adequados ao tipo de pelo, secagem, escovação, limpeza de ouvidos e tosa completa.',
        pricesBySize: [
            { size: 'Pequeno', price: 'R$ 55,00' },
            { size: 'Médio', price: 'R$ 75,00' },
            { size: 'Grande', price: 'R$ 95,00' }
        ],
        image: 'img/felizes-animal-estimacao-caes-tocando-capim_1359-228.avif',
        alt: 'Cães felizes após cuidados ao ar livre'
    },
    {
        id: 'consulta-veterinaria',
        tag: 'Saúde',
        name: 'Consulta Veterinária',
        description: 'Avaliação clínica completa, checagem de sinais vitais, plano vacinal e orientação preventiva.',
        pricesBySize: [
            { size: 'Cães', price: 'R$ 110,00' },
            { size: 'Gatos', price: 'R$ 110,00' }
        ],
        image: 'img/Convivencia-de-caes-e-gatos.jpg',
        alt: 'Cão e gato em atendimento veterinário'
    },
    {
        id: 'cuidados-felinos',
        tag: 'Felinos',
        name: 'Banho e Cuidados para Gatos',
        description: 'Atendimento em ambiente calmo e silencioso, com manejo suave, escovação e corte de unhas.',
        pricesBySize: [
            { size: 'Padrão', price: 'R$ 65,00' },
            { size: 'Pelagem longa', price: 'R$ 80,00' }
        ],
        image: 'img/photo-1548767797-d8c844163c4c.avif',
        alt: 'Gato em ambiente tranquilo'
    }
];

document.addEventListener('aumigo:routechange', (event) => {
    if (event.detail && event.detail.route === 'services') {
        initServices();
    }
});

function initServices() {
    const container = document.getElementById('serviceCatalog');
    if (!container) return;

    container.innerHTML = SERVICES_CATALOG.map((service) => {
        const sizesHtml = service.pricesBySize
            .map((item) => `<li>${item.size}: <strong>${item.price}</strong></li>`)
            .join('');

        return `
            <article class="serviceCard">
                <img src="${service.image}" alt="${service.alt}">
                <div class="serviceCardBody">
                    <span class="serviceTag">${service.tag}</span>
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <ul class="serviceSizes">${sizesHtml}</ul>
                    <div class="serviceCardFooter">
                        <a href="#/availability?service=${encodeURIComponent(service.id)}" class="btnOutline btnSmall">Ver Horários</a>
                        <a href="#/login" class="btnPrimary btnSmall">Agendar</a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}