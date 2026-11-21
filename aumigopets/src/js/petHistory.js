async function initPetHistory(params) {
    const petId = params.get("id")

    const pets = await getPets()
    const appointments = await getAppointments()

    const pet = pets.find(p => String(p.id) === String(petId))
    if (!pet) {
        location.hash = "#/myPets"
        return
    }

    document.getElementById("petName").textContent = pet.name
    document.getElementById("petSize").textContent = sizeLabel[pet.size]
    document.getElementById("age").textContent = pet.age

    const petAppointments = appointments
        .filter(a => String(a.pet?.documentId) === String(pet.id))
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
                <td>${a.service?.name ?? "—"}</td>
                <td>${a.current_status === "done" ? formatMoney(a.service?.price) : "—"}</td>
                <td><span class="badge ${a.current_status}">${statusLabel[a.current_status]}</span></td>
            </tr>
        `).join("")
}