const routes = {
    "/mainPage": {
        template: "mainPage",
        titulo: "Painel do Tutor",
        menu: "/mainPage",
        init: initMainPage
    },

    "/myPets": {
        template: "myPets",
        titulo: "Meus Animais de Estimação",
        menu: "/myPets",
        init: initMyPets
    },

    "/myPets/petConfig": {
        template: "petConfig",
        titulo: "Gerenciamento de Pet",
        menu: "/myPets",
        init: initPetConfig
    },

    "/myPets/petHistory": {
        template: "petHistory",
        titulo: "Histórico do Pet",
        menu: "/myPets",
        init: initPetHistory
    },

    "/schedules": {
        template: "schedules",
        titulo: "Histórico e Acompanhamento",
        menu: "/schedules",
        init: initSchedules
    },

    "/newService": {
        template: "newService",
        titulo: "Novo Agendamento",
        menu: "/schedules",
        init: initNewService
    },

    "/rateService": {
        template: "rateService",
        titulo: "Avaliar Atendimento",
        menu: "/schedules",
        init: initRateService
    },

    "/myProfile": {
        template: "myProfile",
        titulo: "Configurações da Conta",
        menu: "/myProfile",
        init: initMyProfile
    }
};

function navigate() {
    const [path, text] = (location.hash.slice(1) || "/mainPage").split("?");
    const route = routes[path] || routes["/mainPage"];
    const params = new URLSearchParams(text);

    const model = document.getElementById(route.template);
    if(!model) {
        showDialog("Não foi possível carregar esta página.");
        return;
    }
    document.getElementById("view").replaceChildren(model.content.cloneNode(true));
    document.getElementById("topTitle").textContent = route.titulo;

    document.querySelectorAll(".menu a").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + route.menu);
    });

    window.scrollTo(0, 0);
    if(route.init) {
        route.init(params)
    }
}

window.addEventListener("hashchange", navigate);
navigate();

getUser().then(user => {
    document.getElementById("userName").textContent = user.name
})

function showDialog(message, onClose) {
    const dialog = document.getElementById("appDialog")
    document.getElementById("appDialogMessage").textContent = message
    dialog.onclose = () => {
        dialog.onclose = null
        if (onClose) onClose()
    }
    dialog.showModal()
}

document.getElementById("appDialogBtn").addEventListener("click", () => {
    document.getElementById("appDialog").close()
})

document.addEventListener("submit", e => e.preventDefault())

function showConfirm(message, onConfirm) {
    const dialog = document.getElementById("confirmDialog")
    document.getElementById("confirmDialogMessage").textContent = message
    document.getElementById("confirmDialogYes").onclick = () => { dialog.close(); onConfirm() }
    document.getElementById("confirmDialogNo").onclick = () => dialog.close()
    dialog.showModal()
}