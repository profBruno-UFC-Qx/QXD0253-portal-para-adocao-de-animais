import { renderMainPipelinePage } from './pipeline.js';
import { renderAgendaPage } from './agenda.js';
import { renderServicesPage } from './servicos.js';
import { renderClientsPage } from './clientes.js';
import { renderFinancialPage } from './financeiro.js';
import { renderExpensesPage } from './despesas.js';
import { renderReportsPage } from './relatorios.js';
import { renderReviewsPage } from './avaliacoes.js';

function switchOptions() {
    const menuOptions = document.querySelectorAll('[data-dashboard-option]');

    menuOptions.forEach(option => {
        option.addEventListener('click', async event => {
            event.preventDefault();

            menuOptions.forEach(opt => opt.classList.remove("active"));
    
            option.classList.add("active");

            const selected = option.dataset.dashboardOption;
            if (selected === "pipeline") {
                await renderMainPipelinePage();
            } else if (selected === "agenda") {
                renderAgendaPage();
            } else if (selected === "servicos") {
                renderServicesPage();
            } else if (selected === "clientes") {
                renderClientsPage();
            } else if (selected === "financeiro") {
                renderFinancialPage();
            } else if (selected === "despesas") {
                renderExpensesPage();
            } else if (selected === "relatorios") {
                renderReportsPage();
            } else if (selected === "avaliacoes") {
                renderReviewsPage();
            }
        });
    });
}

await renderMainPipelinePage();
switchOptions();