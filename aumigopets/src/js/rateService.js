async function initRateService(params) {
    const appointments = await getAppointments()
    const appointmentId = params.get("id")
    const appointment = appointments.find(a => a.id == appointmentId)

    if (appointment) {
        document.getElementById("reviewService").textContent = appointment.service
        document.getElementById("reviewDate").textContent = formatDate(appointment.date)
    }

    const stars = document.querySelectorAll(".stars .star")
    const form = document.getElementById("reviewForm")
    let selectedRating = 0

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            selectedRating = index + 1
            stars.forEach((s, i) => s.classList.toggle("active", i < selectedRating))
        })
    })

    form.onsubmit = function (e) {
        e.preventDefault()

        if (selectedRating === 0) {
            showDialog("Selecione uma nota de 1 a 5 estrelas antes de enviar.")
            return
        }

        if (appointment) {
            appointment.rating = selectedRating
            appointment.comment = document.getElementById("comment").value.trim()
        }

        showDialog("Avaliação enviada. Obrigado!", () => { location.hash = "#/schedules" })
    }
}