async function initPetHistory(params) {
    const petId = params.get("id")
    const pets = await getPets()
    const appointments = await getAppointments()

    const pet = pets.find(p => p.id == petId)

    if(!pet) {
        document.getElementById("petName").textContent = "Pet não encontrado"
        return
    }

    document.getElementById("petName").textContent = pet.name
    document.getElementById("petSize").textContent = sizeLabel[pet.size]
    document.getElementById("age").textContent = pet.age

    const petAppointments = appointments
        .filter(a => a.petId == pet.id)
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))

    document.getElementById("numServices").textContent = `${petAppointments.length} atendimento(s)`

    const historyRows = document.getElementById("historyRows")

    if(petAppointments.length === 0) {
        historyRows.innerHTML = `
                <tr>
                    <td colspan="4" class="subText" style="text-align: center; padding: 15px">
                        Nenhum atendimento resgistrado.
                    </td>
                </tr>
            `
        return
    }

    historyRows.innerHTML = petAppointments.map(a => `
            <tr>
                <td>${formatDate(a.date)}</td>
                <td>${a.service}</td>
                <td>${a.status === "done" ? formatMoney(a.price) : "—"}</td>
                <td><span class="badge ${a.status}">${statusLabel[a.status]}</span></td>
            </tr>
        `).join("")
}