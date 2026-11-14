const pets = [
  { id: 1, name: "Bob",  species: "dog", breed: "Golden Retriever", size: "big",   age: "3 anos", notes: "Extremamente dócil, mas um pouco agitado com secador." },
  { id: 2, name: "Luna", species: "cat", breed: "Persa",            size: "small", age: "2 anos", notes: "Sensível a shampoos com perfume forte." }
];

const appointments = [
  { id: 1, service: "Banho Completo",    petId: 1, date: "2026-11-15", time: "14:30", price: 80,  status: "confirmed" },
  { id: 2, service: "Tosa Higiênica",    petId: 2, date: "2026-11-19", time: "10:00", price: 45,  status: "pending" },
  { id: 3, service: "Banho & Tosa Raça", petId: 1, date: "2026-05-15", time: "11:00", price: 110, status: "done" }
];

async function getUser() {
    return { 
        name: "Maria"
    };
}

async function getPets() {
    return pets;
}

async function getAppointments() {
    return appointments;
}

const statusLabel = {
    confirmed: "Confirmado",
    pending: "Pendente",
    done: "Concluído"
}

const sizeLabel = {
    small: "Pequeno",
    medium: "Médio",
    big: "Grande"
}

function formatDate(iso) {
    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`
}

function formatMoney(value) {
    return value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
}