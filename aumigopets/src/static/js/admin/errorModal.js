let errorDialog;
let errorDescription;

export function showErrorModal(message) {
    if (!errorDialog) {
        errorDialog = document.createElement("dialog");
        errorDialog.classList.add("customDialog", "errorDialog");

        const icon = document.createElement("span");
        icon.classList.add("errorIcon");
        icon.innerText = "!";

        const heading = document.createElement("h1");
        heading.innerText = "Ocorreu um erro";

        errorDescription = document.createElement("p");

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.classList.add("btnSave");
        closeButton.innerText = "Entendi";
        closeButton.addEventListener("click", () => errorDialog.close());

        errorDialog.append(icon, heading, errorDescription, closeButton);
        document.body.appendChild(errorDialog);
    }

    errorDescription.innerText = message;
    if (!errorDialog.open) {
        errorDialog.showModal();
    }
}
