const API_URL = 'http://localhost:1337';

const FEATURED_SERVICES = [
    {
        id: 'banho-tosa',
        matchKeywords: ['banho', 'tosa'],
        name: 'Banho & Tosa Completa',
        description: 'Banho com produtos específicos para pelagem, secagem cuidadosa e tosa higiênica ou na régua.',
        priceFrom: 'A partir de R$ 55,00',
        image: 'img/felizes-animal-estimacao-caes-tocando-capim_1359-228.avif',
        alt: 'Cães felizes ao ar livre'
    },
    {
        id: 'consulta-veterinaria',
        matchKeywords: ['consulta', 'veterin'],
        name: 'Consulta Veterinária',
        description: 'Avaliação clínica preventiva, orientações de vacinação e acompanhamento da saúde do seu pet.',
        priceFrom: 'A partir de R$ 110,00',
        image: 'img/Convivencia-de-caes-e-gatos.jpg',
        alt: 'Cão e gato convivendo com tranquilidade'
    },
    {
        id: 'cuidados-felinos',
        matchKeywords: ['gato', 'felin'],
        name: 'Cuidados Especiais para Gatos',
        description: 'Atendimento tranquilo e adaptado ao temperamento dos gatos, com escovação e higiene.',
        priceFrom: 'A partir de R$ 65,00',
        image: 'img/photo-1548767797-d8c844163c4c.avif',
        alt: 'Gato em ambiente acolhedor'
    }
];

function formatFeaturedPrice(value) {
    const num = Number(value);
    if (Number.isNaN(num) || num <= 0) return null;
    const formatted = num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    return `A partir de ${formatted}`;
}

function findMatchingFeatured(serviceName = '') {
    const normalizedName = String(serviceName).toLowerCase();
    return (
        FEATURED_SERVICES.find((item) =>
            item.matchKeywords.some((kw) => normalizedName.includes(kw))
        ) || null
    );
}

function mapApiServiceToCard(item) {
    const base = item?.attributes ? { id: item.id, ...item.attributes } : item;
    const name = base?.name ?? 'Serviço';
    const matched = findMatchingFeatured(name);

    return {
        id: base?.documentId ?? base?.id ?? name,
        name,
        description:
            (base?.description && String(base.description).trim()) ||
            matched?.description ||
            'Atendimento dedicado para o bem-estar do seu pet.',
        priceFrom:
            formatFeaturedPrice(base?.price) ||
            matched?.priceFrom ||
            'Consulte o valor',
        image: matched?.image || 'img/Convivencia-de-caes-e-gatos.jpg',
        alt: matched?.alt || `${name} no AuMigo Pet Shop`
    };
}

async function fetchFeaturedFromApi() {
    const response = await fetch(`${API_URL}/api/services`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
    }

    const body = await response.json();
    const list = Array.isArray(body?.data) ? body.data : [];

    if (list.length === 0) {
        return FEATURED_SERVICES;
    }

    return list.slice(0, 3).map(mapApiServiceToCard);
}

function createFeaturedServiceCard(service) {
    const article = document.createElement('article');
    article.className = 'serviceCard';
    article.dataset.serviceId = service.id;

    const img = document.createElement('img');
    img.src = service.image;
    img.alt = service.alt;
    img.loading = 'lazy';

    const body = document.createElement('div');
    body.className = 'serviceCardBody';

    const title = document.createElement('h3');
    title.textContent = service.name;

    const description = document.createElement('p');
    description.textContent = service.description;

    const price = document.createElement('span');
    price.className = 'servicePrice';
    price.textContent = service.priceFrom;

    const link = document.createElement('a');
    link.href = '#/services';
    link.className = 'btnOutline btnSmall';
    link.textContent = 'Ver detalhes';

    body.append(title, description, price, link);
    article.append(img, body);

    return article;
}

async function initHome() {
    const container = document.getElementById('featuredServices');
    if (!container) return;

    try {
        const services = await fetchFeaturedFromApi();
        container.replaceChildren(...services.map(createFeaturedServiceCard));
    } catch (error) {
        console.warn('Usando destaques padrão na home:', error.message);
        container.replaceChildren(...FEATURED_SERVICES.map(createFeaturedServiceCard));
    }
}

document.addEventListener('aumigo:routechange', (event) => {
    if (event.detail && event.detail.route === 'home') {
        initHome();
    }
});