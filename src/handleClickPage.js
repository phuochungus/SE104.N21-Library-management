export default function handleClickParent(e) {
    //remove on-display
    const display = document.querySelector(".on-display")
    if (display) { display.classList.remove("on-display") }

    //display
    if (e.target.tagName === "IMG" || e.target.tagName === "SPAN") {
        e.target.parentElement.classList.add("on-display")
    }
    else e.target.classList.add("on-display")
}

