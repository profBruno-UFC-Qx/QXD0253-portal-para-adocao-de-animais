async function initMyPets() {
    const pets = await getPets();
    const petCards = document.getElementById("petCards")

    if(!petCards) {
        return
    }

    if(pets.length === 0) {
        petCards.innerHTML = `<p class="subText">Nenhum pet cadastrado.</p>`
        return
    }

    petCards.innerHTML = pets.map(p => `
        <div class="card petCard">
            <div class="petTop">
                <div class="avatar avatarLg">${p.name.charAt(0)}</div>
                <div>
                    <h2>${p.name}</h2>
                    <p class="subText"> ${speciesLabel[p.species]} • ${p.breed}</p>
                </div>
            </div>

            <div class="petData">
                <div><small>Porte:</small><strong>${sizeLabel[p.size]}</strong></div>
                <div><small>Idade:</small><strong>${p.age}</strong></div>
                <div><small>Tipo de Pelagem:</small><strong>${furLabel[p.fur]}</strong></div>
            </div>

            ${p.notes ? `
                <div class="petNotes">
                    <strong>Observações de Saúde/Temperamento:</strong>
                    <p>${p.notes}</p>
                </div>` : ""}

            <div class="petActions">
                <a href="#/myPets/petConfig?id=${p.id}" class="btnCancel">Editar</a>
                <a href="#/myPets/petHistory?id=${p.id}" class="btnCancel btnRate"> Histórico</a>
            </div>
        </div>
    `).join("")
}