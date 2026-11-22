async function initRateService(params) {
    const appointmentId = params.get("id")
    const user = await getUser()
    const appointments = await getAppointments()
    const appointment = appointments.find(a => String(a.id) === String(appointmentId))

    if (appointment.review) {
        showDialog("Este atendimento já foi avaliado.", () => { location.hash = "#/schedules" })
        return
    }

    if (!appointment) {
        location.hash = "#/schedules"
        return
    }

    document.getElementById("reviewService").textContent = appointment.service?.name ?? "—"
    document.getElementById("reviewDate").textContent = formatDate(appointment.date)

    const form = document.getElementById("reviewForm")
    const stars = document.querySelectorAll(".stars .star")
    let selectedRating = 0

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            selectedRating = index + 1
            stars.forEach((s, i) => s.classList.toggle("active", i < selectedRating))
        })
    })

    form.onsubmit = async function (e) {
        e.preventDefault()

        if (selectedRating === 0) {
            showDialog("Selecione uma nota de 1 a 5 estrelas antes de enviar.")
            return
        }

        const comment = document.getElementById("comment").value.trim()

        const ratingData = {
            rating: selectedRating,
            user: user.id,
            appointment: appointment.id,
            comment
        }

        try {
            await rateAppointment(ratingData)
            showDialog("Avaliação enviada. Obrigado!", () => { location.hash = "#/schedules" })
        } catch (err) {
            console.error("Erro ao enviar avaliação:", err)
            showDialog(err.message || "Não foi possível enviar a avaliação.")
        }
    }
}