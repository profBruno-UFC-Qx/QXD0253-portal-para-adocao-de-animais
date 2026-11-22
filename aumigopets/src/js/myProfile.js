async function initMyProfile() {
    const user = await getUser();

    const personalForm = document.getElementById("personalForm")
    const securityForm = document.getElementById("securityForm")

    const nameInput = personalForm.querySelector("#name")
    const mailInput = personalForm.querySelector("#mail")
    const contactInput = personalForm.querySelector("#contact")

    nameInput.value = user.name
    mailInput.value = user.email
    contactInput.value = user.contact

    personalForm.onsubmit = function(e) {
        e.preventDefault()

        const newName = nameInput.value.trim()
        const newMail = mailInput.value.trim()
        const newContact = contactInput.value.trim()

        if (newName) user.name = newName
        if (newMail) user.email = newMail
        if (newContact) user.contact = newContact

        const userNameEl = document.getElementById("userName")
        if (userNameEl) {
            userNameEl.textContent = user.name
        }

        showDialog("Informações pessoais atualizadas com sucesso!")
    }

   securityForm.onsubmit = function(e) {
        e.preventDefault();

        const currentPass = securityForm.querySelector("#passWord").value;
        const newPass = securityForm.querySelector("#newPassword").value;
        const confirmPass = securityForm.querySelector("#confirmPassWord").value;

        if (!currentPass || !newPass || !confirmPass) {
            showDialog("Por favor, preencha todos os campos de senha.")
            return
        }

        if (newPass === currentPass) {
            showDialog("A nova senha precisa ser diferente da senha atual.")
            return
        }

        const strongPassword = /^(?=.*\p{Lu})(?=.*\d)(?=.*[^\p{L}\d\s]).{6,}$/u
            if (!strongPassword.test(newPass)) {
                showDialog("A nova senha precisa ter no mínimo 6 caracteres, uma letra maiúscula, um número e um símbolo.")
                return
            }

        if (newPass !== confirmPass) {
            showDialog("A nova senha e a confirmação não coincidem!")
            return
        }

        user.password = newPass
        securityForm.reset()

        showDialog("Senha alterada com sucesso!")
    };
}