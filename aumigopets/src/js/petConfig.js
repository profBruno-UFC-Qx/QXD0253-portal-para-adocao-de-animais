async function initPetConfig(params) {
    const petId = params.get("id")
    const pets = await getPets()
    
    const form = document.querySelector("#view form")
    
    if(!form) {
        return
    }

    let currentPet = null

    if(petId) {
        currentPet = pets.find(p => p.id == petId)
        if(currentPet) {
            document.getElementById("name").value = currentPet.name || ""
            document.getElementById("species").value = currentPet.species || ""
            document.getElementById("breed").value = currentPet.breed || ""
            document.getElementById("size").value = currentPet.size || ""
            document.getElementById("fur").value = currentPet.fur || ""
            document.getElementById("age").value = currentPet.age || ""
            document.getElementById("notes").value = currentPet.notes || ""
        }
    } else {
        form.reset()
    }

    form.onsubmit = async function (e) {
        e.preventDefault()

        const formData = {
            name: document.getElementById("name").value.trim(),
            species: document.getElementById("species").value,
            breed: document.getElementById("breed").value.trim(),
            size: document.getElementById("size").value,
            fur: document.getElementById("fur").value,
            age: document.getElementById("age").value.trim(),
            notes: document.getElementById("notes").value.trim()
        }

        if(petId && currentPet) {
            Object.assign(currentPet, formData)
        } else {
            const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1
            pets.push({
                id: newId,
                ...formData
            })
        }
        showDialog(petId && currentPet ? "Pet atualizado com sucesso!" : "Pet cadastrado com sucesso!", () => { location.hash = "#/myPets" })
    }

}