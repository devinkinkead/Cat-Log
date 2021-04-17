function closeLogin() {
    let form = document.getElementById("loginForm");
    form.reset()
    let modal = document.getElementById("loginDiv")
    modal.style.display = "none"
}

function closeCreate() {
    let form = document.getElementById("signup");
    form.reset()
    let modal = document.getElementById("createAccount")
    modal.style.display = "none"
}