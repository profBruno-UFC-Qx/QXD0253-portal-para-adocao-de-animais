import { renderMainPipelinePage } from './pipeline.js';
import { renderAgendaPage } from './agenda.js';
import { listAll } from './api.js';

function switchOptions() {
    const menuOptions = document.querySelectorAll('[data-dashboard-option]');

    menuOptions.forEach(option => {
        option.addEventListener('click', event => {
            event.preventDefault();

            menuOptions.forEach(opt => opt.classList.remove("active"));
    
            option.classList.add("active");

            const selected = option.dataset.dashboardOption;
            if (selected === "pipeline") {
                renderMainPipelinePage();
            } else if (selected === "agenda") {
                renderAgendaPage();
            }
        });
    });
}

await listAll('/agendamentos');

renderMainPipelinePage();
switchOptions();