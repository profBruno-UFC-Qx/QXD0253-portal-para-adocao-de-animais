import { renderMainPipelinePage } from './pipeline.js';
import { renderAgendaPage } from './agenda.js';
import { renderServicesPage } from './servicos.js';
import { renderClientsPage } from './clientes.js';
import { renderFinancialPage } from './financeiro.js';
import { renderReportsPage } from './relatorios.js';
import { renderReviewsPage } from './avaliacoes.js';
import { postLogout } from './api.js';

function switchOptions() {
    const menuOptions = document.querySelectorAll('[data-dashboard-option]');
    const logoutOption = document.querySelector(".logout");

    logoutOption.addEventListener('click', async e => {
        e.preventDefault()

        await postLogout();

        localStorage.removeItem("current_user");
        localStorage.removeItem("JWT_AUTH_TOKEN");

        window.location.href = "/#/login";
        return;
    });

    menuOptions.forEach(option => {
        option.addEventListener('click', async event => {
            event.preventDefault();

            menuOptions.forEach(opt => opt.classList.remove("active"));
    
            option.classList.add("active");

            const selected = option.dataset.dashboardOption;
            if (selected === "pipeline") {
                await renderMainPipelinePage();
            } else if (selected === "agenda") {
                await renderAgendaPage();
            } else if (selected === "servicos") {
                await renderServicesPage();
            } else if (selected === "clientes") {
                await renderClientsPage();
            } else if (selected === "financeiro") {
                await renderFinancialPage();
            } else if (selected === "relatorios") {
                await renderReportsPage();
            } else if (selected === "avaliacoes") {
                await renderReviewsPage();
            }
        });
    });
}

await renderMainPipelinePage();
switchOptions();