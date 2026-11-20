async function initPetConfig(params) {
    const petId = params.get("id");
    const pets = await getPets();
    const form = document.querySelector("#view form");

    let currentPet = null;

    if (petId) {
        currentPet = pets.find(p => String(p.id) === String(petId)) || null;
    }

    if(currentPet) {
        const fields = ["name", "species", "breed", "size", "fur", "age", "notes"];
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.value = currentPet[field] || "";
            }
        });
        } else {
            form.reset();
    }
    
    form.onsubmit = async function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById("name").value.trim(),
            species: document.getElementById("species").value,
            breed: document.getElementById("breed").value.trim(),
            size: document.getElementById("size").value,
            fur: document.getElementById("fur").value,
            age: document.getElementById("age").value.trim(),
            notes: document.getElementById("notes").value.trim()
        };

        try {
            if (petId && currentPet) {
                await updatePet(currentPet.id, formData);
            } else {
                await createPet(formData);
            }

            if (typeof updateMenuPetVisibility === "function") {
                await updateMenuPetVisibility();
            }

            showDialog(
                petId && currentPet ? "Pet atualizado com sucesso!" : "Pet cadastrado com sucesso!",
                () => { location.hash = "#/myPets"; }
            );
        } catch (err) {
            console.error("Erro ao salvar pet:", err);
            showDialog(err.message || "Não foi possível salvar o pet.");
        }
    };
}