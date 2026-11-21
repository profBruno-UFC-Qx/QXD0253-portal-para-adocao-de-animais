async function initSchedules() {
    const pets = await getPets()
    const appointments = await getAppointments()

    const scheduleContainer = document.getElementById("schedule")

    if (appointments.length === 0) {
        scheduleContainer.innerHTML = `<p class="subText" style="text-align: center; padding: 20px;">Nenhum agendamento encontrado.</p>`
        return
    }

    scheduleContainer.innerHTML = appointments.map(a => {
        const pet = a.pet || { name: "Pet não encontrado", breed: "" }

        let buttons = ""
        if (a.current_status === "done") {
            buttons = a.review
                ? `<span class="subText">Avaliado: ${"⭐".repeat(a.review.rating)}</span>`
                : `<a href="#/rateService?id=${a.id}" class="btnCancel btnRate">⭐ Avaliar</a>`
        } else if (a.current_status !== "canceled") {
            buttons = `<button type="button" class="btnCancel" data-cancel="${a.id}">Cancelar</button>`
        }

        return `
            <div class="item card">
                <div class="scheduleInfo">
                    <h2>${a.service?.name ?? "—"}</h2>
                    <p>Pet: <strong>${pet.name} (${pet.breed})</strong></p>
                    <p class="when">${formatDate(a.date)}, ${formatTime(a.time)}</p>
                    <p>Valor: <strong>${formatMoney(a.service?.price)}</strong></p>
                </div>
                <div class="scheduleAction">
                    <span class="badge ${a.current_status}">${statusLabel[a.current_status] || a.current_status}</span>
                    ${buttons}
                </div>
            </div>
        `
    }).join("")

    scheduleContainer.querySelectorAll("[data-cancel]").forEach(btn => {
        btn.addEventListener("click", () => {
            showConfirm("Deseja realmente cancelar este agendamento?", async () => {
                try {
                    await cancelAppointment(btn.dataset.cancel)
                    await initSchedules()
                    showDialog("Agendamento cancelado.")
                } catch (err) {
                    console.error("Erro ao cancelar agendamento:", err)
                    showDialog(err.message || "Não foi possível cancelar o agendamento.")
                }
            })
        })
    })
}