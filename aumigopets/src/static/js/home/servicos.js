const SERVICES_API_URL = window.API_URL || 'http://localhost:1337';
const SERVICES_JWT_KEY = 'AUTH_JWT_KEY';
const SERVICES_USER_KEY = 'current_user';

const speciesLabel = {
    dog: 'Cão',
    cat: 'Gato',
    'dog&cat': 'Cães e Gatos'
};

const apiErrorsService = {
    'Forbidden': 'Você não tem permissão para realizar esta ação.',
    'Not Found': 'Serviço não encontrado.'
};

function translateError(err, fallback) {
    const msg = err?.message || '';
    return apiErrorsService[msg] || fallback;
}

function formatMoney(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function formatDuration(minutes) {
    const total = Number(minutes);
    if (!total || Number.isNaN(total)) return '';
    return `${total} min`;
}

function getServiceToken() {
    return localStorage.getItem(SERVICES_JWT_KEY) || localStorage.getItem('jwt');
}

function getCurrentServiceUser() {
    try {
        const raw = localStorage.getItem(SERVICES_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function isAdminServiceUser(user) {
    if (!user) return false;

    const roleValue = String(
        user.role?.name ||
        user.role?.type ||
        user.role ||
        user.userType ||
        user.perfil ||
        ''
    ).toLowerCase();

    return (
        user.isAdmin === true ||
        roleValue === 'admin' ||
        roleValue === 'administrator'
    );
}

function normalizeServiceEntry(entry) {
    if (!entry) return null;
    const base = entry.attributes ? { id: entry.id, ...entry.attributes } : entry;
    return {
        ...base,
        numericId: base.id,
        id: base.documentId ?? base.id
    };
}

async function serviceApiFetch(endpoint, options = {}) {
    const token = getServiceToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${SERVICES_API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Detalhes do erro:', errorData?.error);

        const detalhes = errorData?.error?.details?.errors
            ?.map((d) => `${(d.path || []).join('.')}: ${d.message}`)
            .join(' | ');

        throw new Error(
            detalhes || errorData?.error?.message || `Erro HTTP ${response.status}`
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function mapServiceItem(item) {
    const normalized = normalizeServiceEntry(item);
    const featured = findMatchingFeatured(normalized.name);

    return {
        id: normalized.id,
        numericId: normalized.numericId,
        documentId: normalized.documentId,
        name: normalized.name ?? '',
        audience: speciesLabel[normalized.species] ?? normalized.species ?? 'Cães e Gatos',
        price: formatMoney(normalized.price),
        description: normalized.description ?? '',
        duration: formatDuration(normalized.duration),
        image:
            featured?.image ||
            (normalized.species === 'cat' ? '/images/image3.avif' : '/images/image1.jpg'),
        alt: featured?.alt || `${normalized.name || 'Serviço'} no AuMigo Pet Shop`
    };
}

async function fetchServicesCatalog() {
    const body = await serviceApiFetch('/api/services');
    const list = Array.isArray(body?.data) ? body.data : [];
    return list.map(mapServiceItem);
}

async function createCatalogService(payload) {
    const token = getServiceToken();
    if (!token) {
        throw new Error('Você precisa estar autenticado para criar um serviço.');
    }

    const body = await serviceApiFetch('/api/services', {
        method: 'POST',
        body: JSON.stringify({ data: payload })
    });

    return mapServiceItem(body?.data ?? body);
}

function createServiceField(labelText, inputEl) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('field');

    const label = document.createElement('label');
    label.textContent = labelText;
    if (inputEl.id) {
        label.htmlFor = inputEl.id;
    }

    wrapper.append(label, inputEl);
    return wrapper;
}

function createNewServiceForm(onCreated) {
    const form = document.createElement('form');
    form.classList.add('card', 'serviceForm');
    form.hidden = true;

    const title = document.createElement('h2');
    title.textContent = 'Novo Serviço';

    const nameInput = document.createElement('input');
    nameInput.id = 'serviceNameInput';
    nameInput.type = 'text';
    nameInput.placeholder = 'Ex.: Banho e Tosa';
    nameInput.required = true;

    const priceInput = document.createElement('input');
    priceInput.id = 'servicePriceInput';
    priceInput.type = 'number';
    priceInput.step = '0.01';
    priceInput.min = '0';
    priceInput.placeholder = 'Ex.: 65.00';
    priceInput.required = true;

    const durationInput = document.createElement('input');
    durationInput.id = 'serviceDurationInput';
    durationInput.type = 'number';
    durationInput.step = '1';
    durationInput.min = '1';
    durationInput.placeholder = 'Duração em minutos (ex.: 60)';
    durationInput.required = true;

    const speciesSelect = document.createElement('select');
    speciesSelect.id = 'serviceSpeciesInput';
    [
        { value: 'dog&cat', label: speciesLabel['dog&cat'] },
        { value: 'dog', label: speciesLabel.dog },
        { value: 'cat', label: speciesLabel.cat }
    ].forEach((opt) => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        speciesSelect.append(option);
    });

    const descriptionInput = document.createElement('textarea');
    descriptionInput.id = 'serviceDescriptionInput';
    descriptionInput.rows = 3;
    descriptionInput.placeholder = 'Descrição do serviço (opcional)';

    const feedback = document.createElement('p');
    feedback.classList.add('alertError');
    feedback.hidden = true;

    const actions = document.createElement('div');
    actions.classList.add('formActions');

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.classList.add('btnPrimary');
    submitBtn.textContent = 'Salvar Serviço';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.classList.add('btnCancel');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.addEventListener('click', () => {
        form.hidden = true;
        feedback.hidden = true;
        feedback.textContent = '';
        form.reset();
    });

    actions.append(submitBtn, cancelBtn);

    form.append(
        title,
        createServiceField('Nome do serviço', nameInput),
        createServiceField('Valor (R$)', priceInput),
        createServiceField('Duração (minutos)', durationInput),
        createServiceField('Espécie / Público', speciesSelect),
        createServiceField('Descrição', descriptionInput),
        feedback,
        actions
    );

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        feedback.hidden = true;
        feedback.textContent = '';

        const name = nameInput.value.trim();
        const price = Number(priceInput.value);
        const duration = Number.parseInt(durationInput.value, 10);
        const species = speciesSelect.value;
        const description = descriptionInput.value.trim();

        if (!name || Number.isNaN(price) || price < 0 || !duration || duration <= 0) {
            feedback.textContent = 'Preencha nome, valor válido e duração maior que zero.';
            feedback.hidden = false;
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Salvando...';

        try {
            await createCatalogService({
                name,
                price,
                duration,
                species,
                description
            });

            form.reset();
            form.hidden = true;

            if (typeof onCreated === 'function') {
                await onCreated();
            }
        } catch (error) {
            console.error(error);
            feedback.textContent = translateError(
                error,
                error.message || 'Não foi possível criar o serviço.'
            );
            feedback.hidden = false;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Salvar Serviço';
        }
    });

    return form;
}

function createServicesHeader(currentUser, onToggleForm) {
    const header = document.createElement('header');
    header.classList.add('pageHeader');

    const info = document.createElement('div');

    const h1 = document.createElement('h1');
    h1.textContent = 'Catálogo de Serviços e Preços';

    const p = document.createElement('p');
    p.classList.add('subText');
    p.textContent = isAdminServiceUser(currentUser)
        ? 'Gerencie os serviços, valores e durações oferecidos.'
        : 'Consulte os serviços disponíveis, valores e durações.';

    info.append(h1, p);
    header.append(info);

    if (isAdminServiceUser(currentUser)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('btnPrimary');
        button.textContent = '+ Novo Serviço';
        button.addEventListener('click', onToggleForm);
        header.append(button);
    }

    return header;
}

function createServiceStatusCard(message, { isError = false, onRetry = null } = {}) {
    const box = document.createElement('div');
    box.classList.add('card', isError ? 'alertError' : 'emptyState');
    box.classList.add('serviceCatalogStatus');

    const text = document.createElement('p');
    text.textContent = message;
    box.append(text);

    if (onRetry) {
        const retryBtn = document.createElement('button');
        retryBtn.type = 'button';
        retryBtn.classList.add('btnOutline', 'btnSmall');
        retryBtn.textContent = 'Tentar novamente';
        retryBtn.addEventListener('click', onRetry);
        box.append(retryBtn);
    }

    return box;
}

function createServiceCatalogCard(service) {
    const article = document.createElement('article');
    article.classList.add('serviceCard');
    article.dataset.serviceId = service.id;
    if (service.documentId) {
        article.dataset.documentId = service.documentId;
    }

    const image = document.createElement('img');
    image.src = service.image;
    image.alt = service.alt;
    image.loading = 'lazy';

    const body = document.createElement('div');
    body.classList.add('serviceCardBody');

    const tag = document.createElement('span');
    tag.classList.add('serviceTag');
    tag.textContent = service.audience;

    const title = document.createElement('h3');
    title.textContent = service.name;

    const description = document.createElement('p');
    description.textContent = service.description;

    const price = document.createElement('p');
    price.classList.add('servicePrice');
    price.textContent = service.price;

    const duration = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = 'Duração:';
    duration.append(strong, ` ${service.duration}`);

    const footer = document.createElement('div');
    footer.classList.add('serviceCardFooter');

    // const availabilityLink = document.createElement('a');
    // availabilityLink.href = `#/availability?service=${encodeURIComponent(service.id)}`;
    // availabilityLink.classList.add('btnOutline', 'btnSmall');
    // availabilityLink.textContent = 'Ver Horários';

    const appointmentLink = document.createElement('a');
    appointmentLink.href = '#/login';
    appointmentLink.classList.add('btnPrimary', 'btnSmall');
    appointmentLink.textContent = 'Agendar';

    // footer.append(availabilityLink, appointmentLink);
    footer.append(appointmentLink);
    body.append(tag, title, description, price, duration, footer);
    article.append(image, body);
    return article;
}

function createServicesGrid(services) {
    const grid = document.createElement('section');
    grid.classList.add('servicesGrid');

    const cards = services.map(createServiceCatalogCard);
    grid.replaceChildren(...cards);
    return grid;
}

async function renderPublicServicesCatalog(container) {
    const parent = container.parentElement;
    parent?.querySelector('.serviceCatalogAdminControls')?.remove();
    parent?.querySelector('.serviceForm')?.remove();

    const currentUser = getCurrentServiceUser();
    if (parent && isAdminServiceUser(currentUser)) {
        const controls = document.createElement('div');
        controls.classList.add('serviceCatalogAdminControls');

        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('btnPrimary');
        button.textContent = '+ Novo Serviço';

        const form = createNewServiceForm(() => renderPublicServicesCatalog(container));
        button.addEventListener('click', () => {
            form.hidden = !form.hidden;
            if (!form.hidden) {
                form.querySelector('#serviceNameInput')?.focus();
            }
        });

        controls.append(button);
        parent.insertBefore(controls, container);
        parent.insertBefore(form, container);
    }

    container.replaceChildren(createServiceStatusCard('Carregando serviços...'));

    try {
        const services = await fetchServicesCatalog();

        if (services.length === 0) {
            container.replaceChildren(
                createServiceStatusCard('Nenhum serviço cadastrado no momento.')
            );
            return;
        }

        container.replaceChildren(...services.map(createServiceCatalogCard));
    } catch (error) {
        console.error(error);
        container.replaceChildren(
            createServiceStatusCard(
                translateError(error, error.message || 'Não foi possível carregar os serviços.'),
                {
                    isError: true,
                    onRetry: () => renderPublicServicesCatalog(container)
                }
            )
        );
    }
}

function findServicesContainer() {
    return (
        document.querySelector('#dashboard-content') ||
        document.querySelector('#serviceCatalog') ||
        document.querySelector('#servicesContainer')
    );
}

async function renderServicesPage() {
    const container = findServicesContainer();
    if (!container) return;

    if (container.id === 'serviceCatalog') {
        await renderPublicServicesCatalog(container);
        return;
    }

    const currentUser = getCurrentServiceUser();
    const canManage = isAdminServiceUser(currentUser);

    const section = document.createElement('section');
    section.classList.add('ownerPage');
    section.setAttribute('data-dashboard-section', 'servicos');

    const form = canManage
        ? createNewServiceForm(() => renderServicesPage())
        : null;

    const header = createServicesHeader(currentUser, () => {
        if (!form) return;
        form.hidden = !form.hidden;
        if (!form.hidden) {
            form.querySelector('#serviceNameInput')?.focus();
        }
    });

    const contentArea = document.createElement('div');
    contentArea.classList.add('servicesContentArea');
    contentArea.append(createServiceStatusCard('Carregando serviços...'));

    section.append(header);
    if (form) {
        section.append(form);
    }
    section.append(contentArea);
    container.replaceChildren(section);

    try {
        const services = await fetchServicesCatalog();

        if (services.length === 0) {
            contentArea.replaceChildren(
                createServiceStatusCard('Nenhum serviço cadastrado no momento.')
            );
            return;
        }

        contentArea.replaceChildren(createServicesGrid(services));
    } catch (error) {
        console.error(error);
        contentArea.replaceChildren(
            createServiceStatusCard(
                translateError(error, error.message || 'Não foi possível carregar os serviços.'),
                {
                    isError: true,
                    onRetry: () => renderServicesPage()
                }
            )
        );
    }
}

window.renderServicesPage = renderServicesPage;

document.addEventListener('aumigo:routechange', (event) => {
    if (event.detail && event.detail.route === 'services') {
        renderServicesPage();
    }
});