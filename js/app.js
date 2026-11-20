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

const needsPet = ["/schedules", "/newService", "/rateService"];

async function updateMenuPetVisibility() {
    let hasPets = false;
    try {
        hasPets = (await getPets()).length > 0;
    } catch (err) {
        console.error("Erro ao verificar pets:", err);
    }

    const schedulesLink = document.querySelector('.menu a[href="#/schedules"]');
    if (schedulesLink) {
        schedulesLink.hidden = !hasPets;
    }

    return hasPets;
}

async function navigate() {
    if (!getToken()) {
        location.hash = "#/login";
        return;
    }

    const [path, text] = (location.hash.slice(1) || "/mainPage").split("?");
    const route = routes[path] || routes["/mainPage"];
    const params = new URLSearchParams(text);

    const hasPets = await updateMenuPetVisibility();

    if (!hasPets && needsPet.includes(path)) {
        location.hash = "#/myPets";
        return;
    }

    const model = document.getElementById(route.template);
    if (!model) {
        console.error("Page not found:", route.template);
        return;
    }

    document.getElementById("view").replaceChildren(model.content.cloneNode(true));
    document.getElementById("topTitle").textContent = route.titulo;

    document.querySelectorAll(".menu a").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + route.menu);
    });

    window.scrollTo(0, 0);
    if (route.init) {
        route.init(params);
    }
}

document.addEventListener("click", (e) => {
    const logoutBtn = e.target.closest(".logout");
    if (!logoutBtn) return;

    e.preventDefault();
    setToken(null);
    location.hash = "#/login";
});

window.addEventListener("hashchange", navigate);
navigate();

function showDialog(message, onClose) {
    const dialog = document.getElementById("appDialog");
    document.getElementById("appDialogMessage").textContent = message;
    dialog.onclose = () => {
        dialog.onclose = null;
        if (onClose) onClose();
    };
    dialog.showModal();
}

document.getElementById("appDialogBtn").addEventListener("click", () => {
    document.getElementById("appDialog").close();
});

document.addEventListener("submit", e => e.preventDefault());

function showConfirm(message, onConfirm) {
    const dialog = document.getElementById("confirmDialog");
    document.getElementById("confirmDialogMessage").textContent = message;
    document.getElementById("confirmDialogYes").onclick = () => { dialog.close(); onConfirm(); };
    document.getElementById("confirmDialogNo").onclick = () => dialog.close();
    dialog.showModal();
}