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
        password.length >= 6 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );
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

        try {
            const data = await apiRequest('/api/auth/local', {
                method: 'POST',
                body: {
                    identifier: email,
                    password
                }
            });

            setAuthSession(data.jwt, data.user);
            goToRoute('mainPage');
        } catch (err) {
            showAlert(errorEl, 'E-mail ou senha inválidos. Se ainda não tem conta, cadastre-se.');
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
                'A senha deve ter no mínimo 6 caracteres, 1 letra maiúscula, 1 número e 1 símbolo.'
            );
            return;
        }

        if (password !== confirm) {
            showAlert(errorEl, 'A confirmação de senha não confere.');
            return;
        }

        try {
            const data = await apiRequest('/api/auth/local/register', {
                method: 'POST',
                body: {
                    username: email,
                    email,
                    password,
                    name,
                    phone
                }
            });

            // Alguns setups do Strapi exigem confirmação de e-mail e não devolvem jwt de imediato
            if (data.jwt) {
                setAuthSession(data.jwt, data.user);
                goToRoute('mainPage');
            } else {
                goToRoute('login');
            }
        } catch (err) {
            showAlert(errorEl, err.message || 'Não foi possível concluir o cadastro.');
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
            showAlert(errorEl, 'Informe o e-mail cadastrado para recuperar a senha.');
            return;
        }

        try {
            await apiRequest('/api/auth/forgot-password', {
                method: 'POST',
                body: { email }
            });

            if (successEl) {
                successEl.hidden = false;
            }
            form.reset();
        } catch (err) {
            showAlert(errorEl, err.message || 'Não foi possível enviar as instruções.');
        }
    });
}

document.addEventListener('aumigo:routechange', (event) => {
    const route = event.detail && event.detail.route;
    if (route === 'login') initLogin();
    if (route === 'register') initRegister();
    if (route === 'recover') initRecover();
});