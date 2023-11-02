function timeout(ms) {
    return new Promise(res => setTimeout(res, ms));
}
export default async function success(cont) {
    const content = document.querySelector(".success .content-bar .content")
    content.innerText = cont
    const warning = document.querySelector(".success")
    warning.style.display = "flex"
    await timeout(600)
    warning.style.opacity = "1.0"
    await timeout(2000)
    warning.style.opacity = "0"
    await timeout(600)
    warning.style.display = "none"
}