 

function createHeaderContent() {
    const div = document.createElement("div")

    const h1 = document.createElement("h1");
    h1.innerText = "Gestão de Agendamentos";

    const p = document.createElement("p");
    p.classList.add("subText")
    p.innerText = "Controle completo da agenda por data, status e tutor."

    div.appendChild(h1);
    div.appendChild(p);

    return div;
}

function createHeader() {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    header.appendChild(createHeaderContent());

    const button = document.createElement("button");
    button.classList.add("btnPrimary")
    button.type = "button";
    button.innerText = "Agendar Serviço";

    header.appendChild(button);

    return header;
}


// field filterField (filterSearch) <- apenas no filtro de busca
function createDivFormField(...classes) {
    const div = document.createElement("div");
    div.classList.add(...classes);

    return div;
}


function createDateField() {
    const div = createDivFormField("field", "filterField");

    const label = document.createElement("label");
    label.htmlFor = "filtro-data"
    label.innerText = "Data"

    const input = document.createElement("input");
    input.id = "filtro-data"
    input.type = "date"

    div.appendChild(label);
    div.appendChild(input);

    return div;
}

function createOption(value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = text;

    return option;
}

function createStatusField() {
    const options = [
        ["todos", "Todos"], 
        ["pendentes", "Pendentes"], 
        ["andamento", "Em Andamento"], 
        ["concluidos", "Concluídos"]
    ]

    const div = createDivFormField("field", "filterField");

    const label = document.createElement("label");
    label.htmlFor = "filtro-status"
    label.innerText = "Status"

    const select = document.createElement("select");
    select.id = "filtro-status";

    options.forEach(opt => {
        const option = createOption(...opt);
        select.appendChild(option);
    });

    div.appendChild(label);
    div.appendChild(select);

    return div;
}


function createSearchField() {
    const div = createDivFormField("field", "filterField", "filterSearch");

    const label = document.createElement("label");
    label.htmlFor = "filtro-busca";
    label.innerText = "Buscar";

    const input = document.createElement("input");
    input.id = "filtro-busca";
    input.type = "search";
    input.placeholder = "Tutor ou pet";

    div.appendChild(label);
    div.appendChild(input);

    return div;
}


function createForm() {
    const form = document.createElement("form");
    form.classList.add("filterBar");
    form.setAttribute("aria-label", "Filtros da agenda");
    
    form.appendChild(createDateField());
    form.appendChild(createStatusField());
    form.appendChild(createSearchField());

    return form;
}

function createTableCard() {
    const div = createDivFormField("card", "tableCard")
    const tableHTML = `<div class="tableScroll">
               <table>
                  <thead>
                        <tr>
                            <th>Horário</th>
                            <th>Tutor</th>
                            <th>Pet</th>
                            <th>Serviço</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>09:00</td>
                            <td>Mariana Souza</td>
                            <td>Mel (Poodle)</td>
                            <td>Banho &amp; Tosa</td>
                            <td>R$ 90,00</td>
                            <td><span class="badge done">Concluído</span></td>
                            <td><button class="btnCancel" type="button">Editar</button></td>
                        </tr>

                        <tr>
                            <td>13:00</td>
                            <td>Ana Beatriz</td>
                            <td>Nina (Shih-tzu)</td>
                            <td>Tosa Higiênica</td>
                            <td>R$ 50,00</td>
                            <td><span class="badge confirmed">Em andamento</span></td>
                            <td><button class="btnCancel" type="button">Editar</button></td>
                        </tr>
                        <tr>
                            <td>15:30</td>
                            <td>Fernanda Costa</td>
                            <td>Bela (Siamês)</td>
                            <td>Tosa Felina</td>
                            <td>R$ 100,00</td>
                            <td><span class="badge pending">Pendente</span></td>
                            <td><button class="btnCancel" type="button">Editar</button></td>
                        </tr>
                    </tbody>
               </table>
            </div>`

    div.innerHTML = tableHTML;

    return div;
}

function createAgendaSection() {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "agenda");

    section.appendChild(createHeader());
    section.appendChild(createForm());
    section.appendChild(createTableCard());

    return section;
}

export function renderAgendaPage() {
    const mainContent = document.querySelector("#dashboard-content");
    mainContent.replaceChildren(createAgendaSection());
}