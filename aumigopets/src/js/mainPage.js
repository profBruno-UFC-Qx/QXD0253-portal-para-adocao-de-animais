async function initMainPage() {
    const pets = await getPets();
    const appointments = await getAppointments();

    const active = appointments.filter(a => a.status === "confirmed" || a.status === "pending")
    const completed = appointments.filter(a => a.status === "done")

    document.getElementById("numPets").textContent = pets.length
    document.getElementById("numSchedules").textContent = active.length
    document.getElementById("numCompleted").textContent = completed.length

    const upcoming = active
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .slice(0,3);

    const scheduleList = document.getElementById("scheduleList")
    
    if(upcoming.length === 0) {
        scheduleList.innerHTML = `<p class="subText"> Nenhum atendimento agendado.</p>`
    } else {
        scheduleList.innerHTML = upcoming.map(a => {
            const pet = pets.find(p => p.id === a.petId)
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

    document.getElementById("petList").innerHTML = pets.map(p =>
        `
            <div class="item">
                <div class="avatar">${p.name.charAt(0)}</div>
                <div>
                    <strong>${p.name}</strong>
                    <small>${p.breed} (${sizeLabel[p.size]})</small>
                </div>
            </div>
        `).join("")
}