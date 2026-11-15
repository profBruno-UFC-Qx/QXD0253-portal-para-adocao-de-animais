const pets = [
  { id: 1, name: "Bob",  species: "dog", breed: "Golden Retriever", size: "big",   age: "3 anos", notes: "Extremamente dócil, mas um pouco agitado com secador.", fur: "silkyCoat" },
  { id: 2, name: "Luna", species: "cat", breed: "Persa",            size: "small", age: "2 anos", notes: "Sensível a shampoos com perfume forte.", fur: "doubleCoat"}
];

const appointments = [
  { id: 1, service: "Banho Completo",    petId: 1, date: "2026-11-15", time: "14:30", price: 80,  status: "confirmed" },
  { id: 2, service: "Tosa Higiênica",    petId: 2, date: "2026-11-19", time: "10:00", price: 45,  status: "pending" },
  { id: 3, service: "Banho & Tosa Raça", petId: 1, date: "2026-05-15", time: "11:00", price: 110, status: "done" }
];

const availableServices = [
        { name: "Banho Completo", price: 80, description: "Banho com produtos hipoalergênicos, secagem, escovação e corte de unhas." },
        { name: "Tosa Higiênica", price: 45, description: "Aparação dos pelos nas regiões íntimas, patinhas e face." },
        { name: "Banho & Tosa Raça", price: 110, description: "Banho completo acompanhado de tosa padrão da raça." },
        { name: "Hidratação Profunda", price: 60, description: "Tratamento nutritivo para pelagem macia e brilhante." }
];

const speciesLabel = { dog: "Cão", cat: "Gato" };

const furLabel = {
    smoothCoat: "Curto e liso",
    silkyCoat: "Longo e liso",
    "wavy/curlyCoat": "Longo ou ondulado/encaracolado",
    brokenCoat: "Curto duro ou áspero",
    doubleCoat: "Pelagem dupla"
};

const statusLabel = {
    confirmed: "Confirmado",
    pending: "Pendente",
    canceled: "Cancelado",
    done: "Concluído"
}

const user = {
    name: "Maria",
    email: "maria@aumigopet.com",
    contact: "(11) 99999-9999"
};

async function getUser() {
    return user;
}

async function getPets() {
    return pets;
}

async function getAppointments() {
    return appointments;
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