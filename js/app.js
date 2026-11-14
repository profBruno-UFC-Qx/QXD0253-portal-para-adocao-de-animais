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
        //init: initMyPets
    },

    "/myPets/configPet": {
        template: "configPet",
        titulo: "Gerenciamento de Pet",
        menu: "/myPets",
        //init: initConfigPet
    },

    "/myPets/petHistory": {
        template: "petHistory",
        titulo: "Histórico do Pet",
        menu: "/myPets",
        //init: initPetHistory
    },

    "/schedules": {
        template: "schedules",
        titulo: "Histórico e Acompanhamento",
        menu: "/schedules",
        //init: initSchedules
    },

    "/newService": {
        template: "newService",
        titulo: "Novo Agendamento",
        menu: "/schedules",
        //init: initNewService
    },

    "/rateService": {
        template: "rateService",
        titulo: "Avaliar Atendimento",
        menu: "/schedules",
        //init: initRateService
    },

    "/myProfile": {
        template: "myProfile",
        titulo: "Configurações da Conta",
        menu: "/myProfile",
        //init: initMyProfile
    }
};

function navigate() {
    const [path, text] = (location.hash.slice(1) || "/mainPage").split("?");
    const route = routes[path] || routes["/mainPage"];
    const params = new URLSearchParams(text);

    const model = document.getElementById(route.template);
    if(!model) {
        console.error("Page not found:", route.template);
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
