const URL_BASE = 'http://127.0.0.1:1337/api'

export async function listAgendamentos() {
    const endpoint = "/agendamentos?populate=user&populate=servico&populate=pet";
    const token = localStorage.getItem("auth_token");

    if (!token) {
        alert("Não autenticado");
        window.location.href = "index.html"
        return;
    }

    const response = await fetch(URL_BASE + endpoint, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!response.ok) {
        alert("Error: " + response.status);
        return;
    }

    const data = await response.json();
    return data.data
}

