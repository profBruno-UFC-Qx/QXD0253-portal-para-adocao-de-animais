import { postTransaction } from "./api.js";
import { showErrorModal } from "./errorModal.js";

function createInputField({ id, labelText, type, min, step }) {
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

function createDescriptionField() {
    const div = document.createElement("div");
    div.classList.add("field");

    const label = document.createElement("label");
    label.htmlFor = "transacao-descricao";
    label.innerText = "Descrição";

    const textarea = document.createElement("textarea");
    textarea.id = "transacao-descricao";
    textarea.name = "description";

    div.appendChild(label);
    div.appendChild(textarea);
    return { div, textarea };
}

function createTypeField() {
    const div = document.createElement("div");
    div.classList.add("field");

    const label = document.createElement("label");
    label.htmlFor = "transacao-tipo";
    label.innerText = "Tipo";

    const select = document.createElement("select");
    select.id = "transacao-tipo";
    select.name = "type";
    select.required = true;

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.innerText = "Selecione o tipo";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    [
        ["in", "Entrada"],
        ["out", "Saída"]
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

export async function renderTransactionForm({ onSubmit } = {}) {
    const card = document.createElement("section");
    card.classList.add("card", "formCard");

    const heading = document.createElement("h1");
    heading.innerText = "Nova Transação";

    const form = document.createElement("form");
    const nameField = createInputField({
        id: "transacao-nome",
        labelText: "Nome",
        type: "text"
    });
    const descriptionField = createDescriptionField();
    const typeField = createTypeField();
    const valueField = createInputField({
        id: "transacao-valor",
        labelText: "Valor",
        type: "number",
        min: "0",
        step: "0.01"
    });

    const actions = document.createElement("div");
    actions.classList.add("formActions");

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.classList.add("btnCancel");
    cancelButton.innerText = "Cancelar";
    cancelButton.addEventListener("click", async () => {
        if (onSubmit) {
            await onSubmit();
        } else {
            card.remove();
        }
    });

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.classList.add("btnSave");
    saveButton.innerText = "Salvar";
    actions.append(cancelButton, saveButton);

    form.append(
        nameField.div,
        descriptionField.div,
        typeField.div,
        valueField.div,
        actions
    );
    card.append(heading, form);

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const payload = {
            data: {
                name: nameField.input.value.trim(),
                description: descriptionField.textarea.value.trim(),
                type: typeField.select.value,
                value: Number(valueField.input.value)
            }
        };

        saveButton.disabled = true;
        let submitted;
        try {
            submitted = await postTransaction(payload);
        } catch {
            showErrorModal("Erro de comunicação ao salvar a transação. Tente novamente.");
            return;
        } finally {
            saveButton.disabled = false;
        }

        if (!submitted) return;
        if (onSubmit) await onSubmit();
    });

    return card;
}
