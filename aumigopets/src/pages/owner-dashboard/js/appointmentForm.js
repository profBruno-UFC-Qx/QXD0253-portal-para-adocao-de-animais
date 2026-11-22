import { listUserPets } from "./api.js";

function createSelectField({ id, labelText, placeholderText, items = [] }) {
  const div = document.createElement("div");
  div.classList.add("field");

  const label = document.createElement("label");
  label.htmlFor = id;
  label.innerText = labelText;

  const select = document.createElement("select");
  select.id = id;
  select.name = id;
  select.required = true;

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerText = placeholderText;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = String(item.id);

    if (labelText !== "Serviço") {
      option.innerText = item.username;
    } else {
      option.innerText = item.name;
    }
    
    select.appendChild(option);
  });

  div.appendChild(label);
  div.appendChild(select);
  return { div, select };
}

function createInputField({ id, labelText, type }) {
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

  div.appendChild(label);
  div.appendChild(input);
  return { div, input };
}

export async function renderAppointmentForm({ tutors = [], services = [], onSubmit } = {}) {
  const mainContent = document.querySelector("#dashboard-content");
  if (!mainContent) return null;

  const existingForm = mainContent.querySelector(".formCard");
  if (existingForm) {
    existingForm.remove();
  }

  const card = document.createElement("section");
  card.classList.add("card", "formCard");

  const form = document.createElement("form");

  const tutorField = createSelectField({
    id: "agendamento-tutor",
    labelText: "Tutor",
    placeholderText: "Selecione um tutor",
    items: tutors,
  });

  const extraFieldsContainer = document.createElement("div");

  form.append(tutorField.div, extraFieldsContainer);
  card.appendChild(form);

  const pageHeader = mainContent.querySelector(".pageHeader.dashboardPageHeader");
  if (pageHeader) {
    pageHeader.insertAdjacentElement("afterend", card);
  } else {
    mainContent.prepend(card);
  }

  // Referências para usar no submit depois
  let petField, serviceField, dateField, timeField;

  // 3. Quando selecionar um tutor, monta e exibe os demais campos
  tutorField.select.addEventListener("change", async (e) => {
    const selectedValue = e.target.value;

    extraFieldsContainer.innerHTML = "";
    if (!selectedValue) return;

    const selectedUser = await listUserPets(selectedValue);
    console.log(selectedUser);

    petField = createSelectField({
      id: "agendamento-pet",
      labelText: "Pet",
      placeholderText: "Selecione um pet",
      items: selectedUser.pets || [],
    });

    serviceField = createSelectField({
      id: "agendamento-servico",
      labelText: "Serviço",
      placeholderText: "Selecione um serviço",
      items: services,
    });

    dateField = createInputField({
      id: "agendamento-data",
      labelText: "Data",
      type: "date",
    });

    timeField = createInputField({
      id: "agendamento-horario",
      labelText: "Horário",
      type: "time",
    });

    const actions = document.createElement("div");
    actions.classList.add("formActions");

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.classList.add("btnCancel");
    cancelBtn.innerText = "Cancelar";
    cancelBtn.addEventListener("click", () => card.remove());

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.classList.add("btnSave");
    saveBtn.innerText = "Salvar";

    actions.append(cancelBtn, saveBtn);

    extraFieldsContainer.append(
      petField.div,
      serviceField.div,
      dateField.div,
      timeField.div,
      actions
    );
  });

  // 4. Submit registrado uma única vez fora do change
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || !petField) return;

    const payload = {
      tutor: tutorField.select.value,
      pet: petField.select.value,
      servico: serviceField.select.value,
      data: dateField.input.value,
      horario: timeField.input.value,
    };

    if (onSubmit) {
      await onSubmit(payload);
    }

    card.remove();
  });

  return card;
}