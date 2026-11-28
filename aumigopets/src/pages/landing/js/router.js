(function () {
    const ROUTES = {
        home: { templateId: 'home', title: 'AuMigo Pet Shop — Início', isAuth: false },
        services: { templateId: 'services', title: 'AuMigo Pet Shop — Serviços', isAuth: false },
        login: { templateId: 'login', title: 'AuMigo Pet Shop — Entrar', isAuth: true },
        register: { templateId: 'register', title: 'AuMigo Pet Shop — Criar Conta', isAuth: true },
        recover: { templateId: 'recover', title: 'AuMigo Pet Shop — Recuperar Senha', isAuth: true }
    };

    const AUTH_ROUTES = new Set(['login', 'register', 'recover']);

    function extractRouteAndQuery(value) {
        if (!value) return { route: 'home', query: '' };
        const raw = String(value).replace(/^#\/?/, '').trim();
        const [pathPart, queryPart] = raw.split('?');
        const cleanRoute = (pathPart || '').trim().toLowerCase();
        const route = Object.prototype.hasOwnProperty.call(ROUTES, cleanRoute) ? cleanRoute : 'home';
        const query = queryPart ? `?${queryPart}` : '';
        return { route, query };
    }

    function normalizeRoute(value) {
        return extractRouteAndQuery(value).route;
    }

    function getCurrentRoute() {
        return normalizeRoute(window.location.hash);
    }

    function updateActiveNav(route) {
        const navLinks = document.querySelectorAll('#siteHeader nav a[href^="#/"]');
        navLinks.forEach((link) => {
            const linkRoute = normalizeRoute(link.getAttribute('href'));
            const isActive =
                linkRoute === route ||
                (route === 'register' && linkRoute === 'login') ||
                (route === 'recover' && linkRoute === 'login');
            link.classList.toggle('active', isActive);
        });
    }

    function render(routeName = getCurrentRoute()) {
        const route = normalizeRoute(routeName);
        const config = ROUTES[route];
        const view = document.getElementById('view');
        const template = document.getElementById(config.templateId);

        if (!view || !template) return;

        const fragment = template.content.cloneNode(true);
        view.innerHTML = '';

        if (config.isAuth) {
            const wrapper = document.createElement('div');
            wrapper.className = 'authView';
            wrapper.appendChild(fragment);
            view.appendChild(wrapper);
        } else {
            view.appendChild(fragment);
        }

        document.title = config.title;
        updateActiveNav(route);

        document.dispatchEvent(
            new CustomEvent('aumigo:routechange', {
                detail: { route, isAuth: config.isAuth }
            })
        );
    }

    function navigate(routeName) {
        const { route, query } = extractRouteAndQuery(routeName);
        const targetHash = `#/${route}${query}`;

        if (window.location.hash !== targetHash) {
            window.location.hash = targetHash;
        } else {
            render(route);
        }
    }

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#/"]');
        if (!link) return;

        const href = link.getAttribute('href');
        event.preventDefault();
        navigate(href);
    });

    window.addEventListener('hashchange', () => {
        render(getCurrentRoute());
    });

    window.addEventListener('DOMContentLoaded', () => {
        if (!window.location.hash) {
            window.location.replace('#/home');
        }
        render(getCurrentRoute());
    });

    window.AuMigoRouter = {
        navigate,
        render,
        getCurrentRoute,
        isAuthRoute: (route) => AUTH_ROUTES.has(normalizeRoute(route))
    };
})();