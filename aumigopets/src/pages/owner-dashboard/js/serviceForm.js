import { postService } from "./api.js";
import { showErrorModal } from "./errorModal.js";

async function createInputField({ id, labelText, type, min, step }) {
    const div = document.createElement("div");
    div.classList.add("field");

    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerText = labelText;

    const input = document.createElement("input");
    input.id = id;
    input.name = id;
    input.type = type;
    input.required = true;
    if (min !== undefined) input.min = min;
    if (step !== undefined) input.step = step;

    div.appendChild(label);
    div.appendChild(input);
    return { div, input };
}

async function createSpeciesField() {
    const div = document.createElement("div");
    div.classList.add("field");

    const label = document.createElement("label");
    label.htmlFor = "servico-especie";
    label.innerText = "Espécie atendida";

    const select = document.createElement("select");
    select.id = "servico-especie";
    select.name = "species";
    select.required = true;

    [
        ["dog&cat", "Cães e gatos"],
        ["dog", "Cães"],
        ["cat", "Gatos"]
    ].forEach(([value, text]) => {
        const option = document.createElement("option");
        option.value = value;
        option.innerText = text;
        select.appendChild(option);
    });

    div.appendChild(label);
    div.appendChild(select);
    return { div, select };
}

async function createDescriptionField() {
    const div = document.createElement("div");
    div.classList.add("field");

    const label = document.createElement("label");
    label.htmlFor = "servico-descricao";
    label.innerText = "Descrição";

    const textarea = document.createElement("textarea");
    textarea.id = "servico-descricao";
    textarea.name = "description";

    div.appendChild(label);
    div.appendChild(textarea);
    return { div, textarea };
}

export async function renderServiceForm({ onSubmit } = {}) {
    const card = document.createElement("section");
    card.classList.add("card", "formCard");

    const heading = document.createElement("h1");
    heading.innerText = "Novo Serviço";

    const form = document.createElement("form");
    const nameField = await createInputField({
        id: "servico-nome",
        labelText: "Nome do serviço",
        type: "text"
    });
    const priceField = await createInputField({
        id: "servico-preco",
        labelText: "Preço",
        type: "number",
        min: "0",
        step: "0.01"
    });
    const durationField = await createInputField({
        id: "servico-duracao",
        labelText: "Duração (minutos)",
        type: "number",
        min: "1",
        step: "1"
    });
    const speciesField = await createSpeciesField();
    const descriptionField = await createDescriptionField();

    const actions = document.createElement("div");
    actions.classList.add("formActions");

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.classList.add("btnCancel");
    cancelBtn.innerText = "Cancelar";
    cancelBtn.addEventListener("click", async () => {
        if (onSubmit) await onSubmit();
    });

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.classList.add("btnSave");
    saveBtn.innerText = "Salvar";
    actions.append(cancelBtn, saveBtn);

    form.append(
        nameField.div,
        priceField.div,
        durationField.div,
        speciesField.div,
        descriptionField.div,
        actions
    );
    card.append(heading, form);

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const payload = JSON.stringify({
            data: {
                name: nameField.input.value.trim(),
                price: Number(priceField.input.value),
                duration: Number(durationField.input.value),
                species: speciesField.select.value,
                description: descriptionField.textarea.value.trim()
            }
        });

        saveBtn.disabled = true;
        let submitted;
        try {
            submitted = await postService(payload);
        } catch {
            showErrorModal("Erro de comunicação ao cadastrar o serviço. Tente novamente.");
            return;
        } finally {
            saveBtn.disabled = false;
        }

        if (!submitted) {
            return;
        }

        if (onSubmit) await onSubmit(true);
    });

    return card;
}
