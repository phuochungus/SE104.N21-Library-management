import './components.scss'
import { useEffect, useState } from 'react'
import nomalize from './nomalize'

export function Selection(props) {
    const [value, setValue] = useState(props.value)

    useEffect(() => {
        setValue(props.value)
        const selections = document.querySelectorAll(`#${props.ID} .drop-down-content div`)
        for (let ele of selections) {
            if (nomalize(props.value) === nomalize(ele.innerText)) {
                const selectedEle = document.querySelector(`#${props.ID} .on-selected`)
                if (selectedEle) {
                    selectedEle.classList.remove("on-selected")
                    ele.classList.add("on-selected")
                }
            }
        }
    }, [props])

    function handleClickShow() {
        const dropdownContent = document.querySelector(`#${props.ID} .drop-down-content`)

        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none"
        }
        else {
            dropdownContent.style.display = "block"
        }
    }
    function handleClickSelect(e) {
        const dropdownContent = document.querySelector(`#${props.ID} .drop-down-content`)

        dropdownContent.style.display = "none"
        setValue(e.target.innerText)
        props.SET(e.target.innerText)
    }

    return (<div id={props.ID} >
        <div className="drop-btn" onClick={handleClickShow}>{value}</div>
        <div className="drop-down-content">
            <div onClick={(e) => handleClickSelect(e)} className="on-selected">{props.title}</div>
            {props.genres.map((ele, index) =>
                (<div onClick={(e) => handleClickSelect(e)} key={index}>{ele}</div>))}
        </div>
    </div>)
}