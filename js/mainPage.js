async function initMainPage() {
    const pets = await getPets()
    const appointments = await getAppointments()

    const hasPets = pets.length > 0

    document.querySelectorAll("[data-needs-pet]").forEach(el => {
        el.hidden = !hasPets
    })

    document.querySelectorAll(".stats, .twoColumns").forEach(el => {
        el.classList.toggle("noPets", !hasPets)
    })

    const subtitle = document.getElementById("homeSubtitle")
    subtitle.textContent = hasPets
            ? "Acompanhe aqui os seus agendamentos e os seus pets."
            : "Acompanhe aqui os seus pets."

    const active = appointments.filter(a => a.status === "confirmed" || a.status === "pending")
    const completed = appointments.filter(a => a.status === "done")

    document.getElementById("numPets").textContent = pets.length
    document.getElementById("numSchedules").textContent = active.length
    document.getElementById("numCompleted").textContent = completed.length

    const upcoming = active
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .slice(0,3)

    const scheduleList = document.getElementById("scheduleList")
    
    if(upcoming.length === 0) {
        scheduleList.innerHTML = `<p class="subText"> Nenhum atendimento agendado.</p>`
    } else {
        scheduleList.innerHTML = upcoming.map(a => {
            const pet = pets.find(p => p.id === a.petId) || { name: "Pet não encontrado", breed: ""}
            return `
                <div class="item">
                    <div>
                        <strong>${a.service}</strong>
                        <small>${pet.name} (${pet.breed})</small>
                        <small>${formatDate(a.date)}, ${a.time}</small>
                    </div>
                    <span class="badge ${a.status}">${statusLabel[a.status]}</span>
                </div>
            `
        }).join("")
    }

    const petList = document.getElementById("petList")
    if (pets.length === 0) {
        petList.innerHTML = `<p class="subText emptyState">Cadastre seu primeiro pet para começar.</p>`
    } else {
        petList.innerHTML = pets.map(p => {
            return `
                <div class="item">
                    <div class="avatar">${(p.name || "?").charAt(0)}</div>
                    <div>
                        <strong>${p.name}</strong>
                        <small>${p.breed} (${sizeLabel[p.size]})</small>
                    </div>
                </div>
            `
        }).join("")
    }

}