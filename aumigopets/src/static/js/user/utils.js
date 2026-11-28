const statusLabel = {
    pending: "Pendente",
    confirmed: "Confirmado",
    done: "Concluído",
    canceled: "Cancelado"
}

const speciesLabel = {
    dog: "Cão",
    cat: "Gato"
}

const sizeLabel = {
    small: "Pequeno",
    medium: "Médio",
    big: "Grande"
}

const furLabel = {
    smoothCoat: "Curto e liso",
    silkyCoat: "Longo e liso",
    "wavy/curlyCoat": "Longo ou ondulado/encaracolado",
    brokenCoat: "Curto duro ou áspero",
    doubleCoat: "Pelagem dupla"
}

function formatMoney(value) {
    return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(date) {
    if (!date) return ""
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR")
}

function formatTime(time) { return time ? String(time).slice(0, 5) : "" }

const apiErrors = {
    "The provided current password is invalid": "A senha atual está incorreta.",
    "Invalid identifier or password": "Usuário ou senha inválidos.",
    "Email already taken": "Este e-mail já está em uso.",
    "Username already taken": "Este nome de usuário já está em uso.",
    "Forbidden": "Você não tem permissão para esta ação.",
    "Not Found": "Registro não encontrado."
}

function translateError(err, fallback) {
    const msg = err?.message || ""
    return apiErrors[msg] || fallback
}