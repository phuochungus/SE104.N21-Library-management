import './components.scss'
import { useEffect } from 'react'
import nomalize from './nomalize'

export function SelectedTypes(props) {
    const dropbtn = document.querySelector(".dropbtn-Selected span")

    useEffect(() => {
        const dropbtn = document.querySelector(".dropbtn-Selected span")
        const theChecked = document.querySelectorAll(".the-Checked")
        for (const ele of theChecked) {
            if (ele.checked)
                ele.checked = false
        }

        props.genresBook.forEach((ele1, index1) => {
            props.genres.forEach((ele2, index2) => {
                if (nomalize(ele1) === nomalize(ele2.name)) {
                    const inputElement = document.querySelector(`input[id="${ele2.name + index2}"]`)
                    inputElement.checked = 'true'
                }
            })
        })
        dropbtn.innerHTML = props.genresBook.join(", ")
    }, [props])

    function handleChange(e) {
        if (e.target.checked) props.genresBook.push(e.target.name)
        if (!e.target.checked) {
            props.genresBook.forEach((ele, index) => {
                if (nomalize(ele) === nomalize(e.target.name))
                    props.genresBook.splice(index, 1)
            })
        }
        dropbtn.innerHTML = props.genresBook.join(", ")
    }

    function handleClickShow() {
        if (props.enableEdit) {
            const dropdownContent = document.querySelector(".dropdown-Selected-content")
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none"
            }
            else {
                dropdownContent.style.display = "block"
            }
        }
    }
    return (<div className="dropdown-Selected" >
        <div className="dropbtn-Selected" onClick={handleClickShow}><span>Thể loại</span></div>
        <div className="dropdown-Selected-content">
            {props.genres.map((ele, index) => (<div key={index}>
                <input className="the-Checked" type="checkbox" id={ele.name + index} name={ele.name} onChange={(e) => handleChange(e)} />
                <label htmlFor={ele.name}>{ele.name}</label>
            </div>))}
        </div>
    </div>)
}