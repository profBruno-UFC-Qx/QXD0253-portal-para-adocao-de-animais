async function initMyProfile() {
    const user = await getUser()

    const personalForm = document.getElementById("personalForm")
    const securityForm = document.getElementById("securityForm")

    const usernameInput = personalForm.querySelector("#username")
    const emailInput = personalForm.querySelector("#email")
    const phoneInput = personalForm.querySelector("#phone")

    usernameInput.value = user.username
    emailInput.value = user.email
    phoneInput.value = user.phone

    personalForm.onsubmit = async function (e) {
        e.preventDefault()

        const newName = usernameInput.value.trim()
        const newMail = emailInput.value.trim()
        const newPhone = phoneInput.value.trim()

        if (!newName || !newMail || !newPhone) {
            showDialog("Um ou mais campos obrigatórios vazios")
            return
        }

        try {
            const updatedUser = await updateUser(user.numericId ?? user.id, {
                username: newName,
                email: newMail,
                phone: newPhone
            })

            if (updatedUser) {
                Object.assign(user, updatedUser)
            }

            showDialog("Informações pessoais atualizadas com sucesso!")
        } catch (err) {
            console.error("Erro ao atualizar perfil:", err)
            showDialog(translateError(err, "Não foi possível atualizar as informações pessoais."))
        }
    }

    securityForm.onsubmit = async function (e) {
        e.preventDefault()

        const currentPass = securityForm.querySelector("#passWord").value
        const newPass = securityForm.querySelector("#newPassword").value
        const confirmPass = securityForm.querySelector("#confirmPassWord").value

        if (!currentPass || !newPass || !confirmPass) {
            showDialog("Por favor, preencha todos os campos de senha.")
            return
        }

        if (newPass === currentPass) {
            showDialog("A nova senha precisa ser diferente da senha atual.")
            return
        }


        if (newPass !== confirmPass) {
            showDialog("A nova senha e a confirmação não coincidem!")
            return
        }

        try {
            await changePassword({
                currentPassword: currentPass,
                password: newPass,
                passwordConfirmation: confirmPass
            })

            securityForm.reset()
            showDialog("Senha alterada com sucesso!")
        } catch (err) {
            console.error("Erro ao alterar senha:", err)
            showDialog(translateError(err, "Não foi possível alterar a senha."))
        }
    }
}