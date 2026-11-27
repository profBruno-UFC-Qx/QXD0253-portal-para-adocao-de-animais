import { getClient } from "./api.js";
import { showErrorModal } from "./errorModal.js";

function createHeader(onBack) {
    const header = document.createElement("header");
    header.classList.add("pageHeader", "dashboardPageHeader");

    const div = document.createElement("div");
    const heading = document.createElement("h1");
    heading.innerText = "Perfil do Tutor";

    const description = document.createElement("p");
    description.classList.add("subText");
    description.innerText = "Informações do tutor, pets e histórico de atendimentos.";

    div.append(heading, description);
    header.appendChild(div);

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.classList.add("btnCancel");
    backButton.innerText = "Voltar";
    backButton.addEventListener("click", onBack);
    header.appendChild(backButton);

    return header;
}

function createInfoRow(labelText, value) {
    const div = document.createElement("div");
    div.classList.add("profileInfoRow");

    const label = document.createElement("span");
    label.innerText = labelText;

    const text = document.createElement("strong");
    text.innerText = value || "Não informado";

    div.append(label, text);
    return div;
}

function createProfileDetails(user) {
    const article = document.createElement("article");
    article.classList.add("card", "profileDetails");

    const heading = document.createElement("h2");
    heading.innerText = "Dados do tutor";
    article.appendChild(heading);

    article.append(
        createInfoRow("Nome", user.username),
        createInfoRow("E-mail", user.email),
        createInfoRow("Telefone", user.phone)
    );

    return article;
}

function createPetCard(pet) {
    const article = document.createElement("article");
    article.classList.add("profileListItem");

    const heading = document.createElement("h3");
    heading.innerText = pet.name;

    const details = document.createElement("p");
    const species = { dog: "Cão", cat: "Gato" }[pet.species] || pet.species;
    details.innerText = `${species} • ${pet.breed} • ${pet.age} anos`;

    article.append(heading, details);
    if (pet.notes) {
        const notes = document.createElement("p");
        notes.classList.add("subText");
        notes.innerText = pet.notes;
        article.appendChild(notes);
    }

    return article;
}

function createPetsSection(pets = []) {
    const article = document.createElement("article");
    article.classList.add("card", "profileSection");

    const heading = document.createElement("h2");
    heading.innerText = `Pets (${pets.length})`;
    article.appendChild(heading);

    if (!pets.length) {
        const emptyState = document.createElement("p");
        emptyState.classList.add("emptyState");
        emptyState.innerText = "Este tutor ainda não possui pets cadastrados.";
        article.appendChild(emptyState);
        return article;
    }

    const list = document.createElement("div");
    list.classList.add("profileList");
    pets.forEach(pet => list.appendChild(createPetCard(pet)));
    article.appendChild(list);

    return article;
}

function createAppointmentCard(appointment) {
    const article = document.createElement("article");
    article.classList.add("profileListItem");

    const heading = document.createElement("h3");
    heading.innerText = appointment.service && appointment.service.name
        ? appointment.service.name
        : "Serviço";

    const date = appointment.date
        ? appointment.date.split("-").reverse().join("/")
        : "Data não informada";
    const details = document.createElement("p");
    const petName = appointment.pet && appointment.pet.name
        ? appointment.pet.name
        : "Pet";
    const time = appointment.time ? appointment.time.slice(0, 5) : "--:--";
    details.innerText = `${petName} • ${date} às ${time}`;

    const statuses = {
        pending: ["Pendente", "pending"],
        confirmed: ["Confirmado", "confirmed"],
        done: ["Concluído", "done"],
        canceled: ["Cancelado", "canceled"]
    };
    const [statusText, statusClass] = statuses[appointment.current_status]
        || [appointment.current_status, "pending"];
    const status = document.createElement("span");
    status.classList.add("badge", statusClass);
    status.innerText = statusText;

    article.append(heading, details, status);
    return article;
}

function createAppointmentsSection(appointments = []) {
    const article = document.createElement("article");
    article.classList.add("card", "profileSection");

    const heading = document.createElement("h2");
    heading.innerText = `Agendamentos (${appointments.length})`;
    article.appendChild(heading);

    if (!appointments.length) {
        const emptyState = document.createElement("p");
        emptyState.classList.add("emptyState");
        emptyState.innerText = "Este tutor ainda não possui agendamentos.";
        article.appendChild(emptyState);
        return article;
    }

    const list = document.createElement("div");
    list.classList.add("profileList");
    appointments.forEach(appointment => {
        list.appendChild(createAppointmentCard(appointment));
    });
    article.appendChild(list);

    return article;
}

function createProfilePage(user, onBack) {
    const section = document.createElement("section");
    section.classList.add("ownerPage");
    section.setAttribute("data-dashboard-section", "perfil-cliente");
    section.appendChild(createHeader(onBack));
    section.appendChild(createProfileDetails(user));
    section.appendChild(createPetsSection(user.pets));
    section.appendChild(createAppointmentsSection(user.appointments));
    return section;
}

export async function renderClientProfile(userId, onBack) {
    const mainContent = document.querySelector("#dashboard-content");

    try {
        const user = await getClient(userId);
        if (!user) {
            return;
        }

        mainContent.replaceChildren(createProfilePage(user, onBack));
    } catch {
        showErrorModal("Erro ao carregar o perfil do tutor. Tente novamente.");
    }
}
