async function initNewService() {
    const pets = await getPets();
    const availableServices = await getAvailableServices();

    const petSelect = document.getElementById("pet");
    const serviceSelect = document.getElementById("service");
    const date = document.getElementById("date");
    const summaryText = document.getElementById("summaryText");
    const summaryPrice = document.getElementById("summaryPrice");
    const form = document.querySelector(".bookingCard form");

    pets.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = `${p.name} (${p.breed})`;
        petSelect.appendChild(option);
    });

    availableServices.forEach((s, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${s.name} - ${formatMoney(s.price)}`;
        serviceSelect.appendChild(option);
    });

    const today = new Date().toLocaleDateString("en-CA");
    date.value = today;
    date.min = today;

    serviceSelect.addEventListener("change", () => {
        const selectedIndex = serviceSelect.value;
        if (selectedIndex === "") {
            summaryText.textContent = "Selecione um serviço para ver os detalhes.";
            summaryPrice.textContent = formatMoney(0);
            return;
        }

        const service = availableServices[selectedIndex];
        summaryText.textContent = service.description;
        summaryPrice.textContent = formatMoney(service.price);
    });

    let selectedTime = "";
    const slotsContainer = document.getElementById("slots");
    const slotButtons = slotsContainer.querySelectorAll(".slot");

    slotButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            slotButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedTime = btn.textContent.trim();
        });
    });

    form.onsubmit = async function (e) {
        e.preventDefault();
        if (!selectedTime) {
            showDialog("Por favor, selecione um horário disponível");
            return;
        }

        const service = availableServices[serviceSelect.value];
        if (!service) {
            showDialog("Por favor, selecione um serviço válido");
            return;
        }

        try {
            await createAppointment({
                service: service.name,
                petId: petSelect.value,
                date: date.value,
                time: selectedTime,
                price: service.price,
                status: "pending"
            });

            showDialog("Agendamento realizado com sucesso!", () => { location.hash = "#/schedules"; });
        } catch (err) {
            console.error("Erro ao criar agendamento:", err);
            showDialog(err.message || "Não foi possível realizar o agendamento.");
        }
    };
}