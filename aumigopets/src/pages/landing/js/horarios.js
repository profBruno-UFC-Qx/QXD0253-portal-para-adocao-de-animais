const AVAILABILITY_API_URL = window.API_URL || 'http://localhost:1337';

const AVAILABILITY_SERVICES = [
    { id: 'banho-tosa', name: 'Banho & Tosa Completa' },
    { id: 'consulta-veterinaria', name: 'Consulta Veterinária' },
    { id: 'cuidados-felinos', name: 'Banho e Cuidados para Gatos' }
];

const DEFAULT_SLOTS = ['08:30', '09:30', '10:30', '14:00', '15:00', '16:00'];

function formatDateInputValue(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDatePtBr(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) return isoDate;
    return `${day}/${month}/${year}`;
}

function getMockSlots(serviceId, dateStr) {
    if (!dateStr) return [];
    const dayObj = new Date(`${dateStr}T12:00:00`);
    const dayOfWeek = dayObj.getDay();

    if (dayOfWeek === 0) return [];

    const seed = `${serviceId}-${dateStr}`
        .split('')
        .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

    return DEFAULT_SLOTS.map((time, index) => ({
        time,
        available: (seed + index) % 3 !== 0
    }));
}

function populateServiceSelect(selectEl, servicesList, queryService) {
    selectEl.innerHTML = servicesList
        .map((service) => `<option value="${service.id}">${service.name}</option>`)
        .join('');

    if (queryService && servicesList.some((s) => String(s.id) === String(queryService))) {
        selectEl.value = queryService;
    }
}

function renderSlots(servicesList, serviceId, dateStr) {
    const titleEl = document.getElementById('slotsTitle');
    const areaEl = document.getElementById('slotsArea');
    if (!titleEl || !areaEl) return;

    const service =
        servicesList.find((item) => String(item.id) === String(serviceId)) ||
        servicesList[0];

    if (!dateStr) {
        titleEl.textContent = 'Horários Disponíveis';
        areaEl.innerHTML =
            '<p class="slotsMessage">Selecione um serviço e uma data para consultar os horários livres.</p>';
        return;
    }

    titleEl.textContent = `Horários para ${service.name} — ${formatDatePtBr(dateStr)}`;
    const slots = getMockSlots(service.id, dateStr);

    if (slots.length === 0) {
        areaEl.innerHTML =
            '<p class="slotsMessage">Não há atendimentos disponíveis nessa data. Tente escolher outro dia.</p>';
        return;
    }

    const buttonsHtml = slots
        .map((slot) => {
            if (!slot.available) {
                return `<button type="button" class="slotBtn" disabled title="Horário indisponível">${slot.time}</button>`;
            }
            return `<button type="button" class="slotBtn" data-slot="${slot.time}">${slot.time}</button>`;
        })
        .join('');

    areaEl.innerHTML = `<div class="slotsGrid">${buttonsHtml}</div>`;

    areaEl.querySelectorAll('.slotBtn:not(:disabled)').forEach((btn) => {
        btn.addEventListener('click', () => {
            areaEl.querySelectorAll('.slotBtn').forEach((item) => item.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
}

function initAvailability(params) {
    const selectEl = document.getElementById('serviceSelect');
    const dateEl = document.getElementById('dateInput');
    const searchBtn = document.getElementById('btnSearch');

    if (!selectEl || !dateEl || !searchBtn) return;

    let currentServices = [...AVAILABILITY_SERVICES];
    const queryService =
        params && typeof params.get === 'function' ? params.get('service') : null;

    populateServiceSelect(selectEl, currentServices, queryService);

    const todayStr = formatDateInputValue(new Date());
    dateEl.min = todayStr;
    if (!dateEl.value) {
        dateEl.value = todayStr;
    }

    const runSearch = () => {
        renderSlots(currentServices, selectEl.value, dateEl.value);
    };

    searchBtn.onclick = runSearch;
    selectEl.onchange = runSearch;
    dateEl.onchange = runSearch;

    runSearch();

    fetch(`${AVAILABILITY_API_URL}/api/services`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => (res.ok ? res.json() : null))
        .then((body) => {
            const list = Array.isArray(body?.data) ? body.data : [];
            if (list.length === 0) return;

            currentServices = list.map((item) => {
                const base = item?.attributes ? { id: item.id, ...item.attributes } : item;
                return {
                    id: String(base?.documentId ?? base?.id ?? base?.name),
                    name: base?.name ?? 'Serviço'
                };
            });

            const previousValue = selectEl.value;
            populateServiceSelect(selectEl, currentServices, queryService || previousValue);
            runSearch();
        })
        .catch(() => {});
}

window.initAvailability = initAvailability;