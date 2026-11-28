const AUTH_API_URL = window.API_URL || 'http://localhost:1337';
const AUTH_JWT_KEY = 'aumigo_jwt';
const AUTH_USER_KEY = 'aumigo_current_user_v1';

const apiErrors = {
    'Invalid identifier or password': 'E-mail ou senha inválidos.',
    'Email already taken': 'Não foi possível concluir o cadastro com os dados informados.',
    'Username already taken': 'Não foi possível concluir o cadastro com os dados informados.',
    'Your account email is not confirmed': 'E-mail ou senha inválidos.',
    'Your account has been blocked by an administrator': 'E-mail ou senha inválidos.',
    'Forbidden': 'Você não tem permissão para realizar esta ação.'
};

function translateError(rawMessage, fallback) {
    if (!rawMessage) return fallback;
    return apiErrors[rawMessage] || fallback;
}

function setAuthSession(jwt, user) {
    if (jwt) {
        localStorage.setItem(AUTH_JWT_KEY, jwt);
    }
    if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
    syncHeaderAuthUI();
}

function clearAuthSession() {
    localStorage.removeItem(AUTH_JWT_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    syncHeaderAuthUI();
}

function syncHeaderAuthUI() {
    const headerBtn = document.querySelector(
        '#siteHeader .menu a[href="#/login"], #siteHeader .menu .authSessionBtn'
    );
    if (!headerBtn) return;

    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    const jwt = localStorage.getItem(AUTH_JWT_KEY);

    if (rawUser && jwt) {
        headerBtn.textContent = 'Sair';
        headerBtn.href = '#/home';
        headerBtn.classList.add('authSessionBtn');
        headerBtn.onclick = (event) => {
            event.preventDefault();
            clearAuthSession();
            goToRoute('home');
        };
    } else {
        headerBtn.textContent = 'Entrar / Agendar';
        headerBtn.href = '#/login';
        headerBtn.classList.remove('authSessionBtn');
        headerBtn.onclick = null;
    }
}

async function fetchCurrentUser(jwt) {
    const response = await fetch(`${AUTH_API_URL}/api/users/me?populate=role`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        throw new Error('Não foi possível identificar o usuário autenticado.');
    }

    return response.json();
}

function resolveTargetRoute(user) {
    const roleType = String(user?.role?.type || user?.role?.name || '').toLowerCase();

    if (roleType === 'admin' || roleType === 'administrator') {
        return 'services';
    }

    return 'home';
}

function goToRoute(routeName) {
    if (window.AuMigoRouter && typeof window.AuMigoRouter.navigate === 'function') {
        window.AuMigoRouter.navigate(routeName);
    } else {
        window.location.hash = `#/${routeName}`;
    }
}

function showAlert(el, message) {
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
}

function hideAlert(el) {
    if (!el) return;
    el.textContent = '';
    el.hidden = true;
}

function isStrongPassword(password) {
    return (
        password.length >= 6 
    );
}

function setSubmitting(form, isSubmitting, loadingText) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    if (isSubmitting) {
        btn.dataset.originalText = btn.textContent;
        btn.disabled = true;
        if (loadingText) btn.textContent = loadingText;
    } else {
        btn.disabled = false;
        if (btn.dataset.originalText) {
            btn.textContent = btn.dataset.originalText;
        }
    }
}

function initLogin() {
    const form = document.getElementById('loginForm');
    const mailInput = document.getElementById('loginMail');
    const passInput = document.getElementById('loginPass');
    const errorEl = document.getElementById('loginError');

    if (!form || !mailInput || !passInput) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideAlert(errorEl);

        const email = mailInput.value.trim().toLowerCase();
        const password = passInput.value;

        if (!email || !password) {
            showAlert(errorEl, 'Preencha e-mail e senha para entrar.');
            return;
        }

        setSubmitting(form, true, 'Entrando...');

        try {
            const response = await fetch(`${AUTH_API_URL}/api/auth/local`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identifier: email,
                    password
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.jwt) {
                const msg = translateError(
                    data?.error?.message,
                    'E-mail ou senha inválidos.'
                );
                showAlert(errorEl, msg);
                return;
            }

            const identifiedUser = await fetchCurrentUser(data.jwt).catch(() => data.user);
            setAuthSession(data.jwt, identifiedUser);

            const targetRoute = resolveTargetRoute(identifiedUser);
            goToRoute(targetRoute);
        } catch {
            showAlert(errorEl, 'Erro ao conectar com o servidor.');
        } finally {
            setSubmitting(form, false);
        }
    });
}

function initRegister() {
    const form = document.getElementById('registerForm');
    const nameInput = document.getElementById('regName');
    const mailInput = document.getElementById('regMail');
    const phoneInput = document.getElementById('regPhone');
    const passInput = document.getElementById('regPass');
    const confirmInput = document.getElementById('regConfirm');
    const errorEl = document.getElementById('registerError');

    if (!form || !nameInput || !mailInput || !phoneInput || !passInput || !confirmInput) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideAlert(errorEl);

        const name = nameInput.value.trim();
        const email = mailInput.value.trim().toLowerCase();
        const phone = phoneInput.value.trim();
        const password = passInput.value;
        const confirm = confirmInput.value;

        if (!name || !email || !phone || !password || !confirm) {
            showAlert(errorEl, 'Preencha todos os campos obrigatórios.');
            return;
        }

        if (!isStrongPassword(password)) {
            showAlert(
                errorEl,
                'A senha deve ter no mínimo 6 caracteres'
            );
            return;
        }

        if (password !== confirm) {
            showAlert(errorEl, 'A confirmação de senha não confere.');
            return;
        }

        setSubmitting(form, true, 'Criando conta...');

        try {
            const response = await fetch(`${AUTH_API_URL}/api/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    email,
                    password,
                    name,
                    phone
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const msg = translateError(
                    data?.error?.message,
                    'Não foi possível concluir o cadastro com os dados informados.'
                );
                showAlert(errorEl, msg);
                return;
            }

            if (data.jwt) {
                const identifiedUser = await fetchCurrentUser(data.jwt).catch(() => data.user);
                setAuthSession(data.jwt, identifiedUser);
                goToRoute(resolveTargetRoute(identifiedUser));
            } else {
                goToRoute('login');
            }
        } catch {
            showAlert(errorEl, 'Erro ao conectar com o servidor.');
        } finally {
            setSubmitting(form, false);
        }
    });
}

function initRecover() {
    const form = document.getElementById('recoverForm');
    const mailInput = document.getElementById('recoverMail');
    const successEl = document.getElementById('recoverSuccess');
    const errorEl = document.getElementById('recoverError');

    if (!form || !mailInput) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideAlert(successEl);
        hideAlert(errorEl);

        const email = mailInput.value.trim().toLowerCase();
        if (!email) {
            showAlert(errorEl, 'Informe um e-mail válido.');
            return;
        }

        setSubmitting(form, true, 'Enviando...');

        try {
            await fetch(`${AUTH_API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (successEl) {
                successEl.textContent = 'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.';
                successEl.hidden = false;
            }
            form.reset();
        } catch {
            showAlert(errorEl, 'Erro ao conectar com o servidor.');
        } finally {
            setSubmitting(form, false);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    syncHeaderAuthUI();
});

document.addEventListener('aumigo:routechange', (event) => {
    syncHeaderAuthUI();
    const route = event.detail && event.detail.route;
    if (route === 'login') initLogin();
    if (route === 'register') initRegister();
    if (route === 'recover') initRecover();
});