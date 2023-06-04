import './components.scss'
import nomalize from './nomalize'

export function SelectType(props) {
    const dropbtn = document.querySelector(".dropbtn span")
    function handleChange(e) {
        if (e.target.checked) props.type.push(e.target.name)
        if (!e.target.checked) {
            props.type.forEach((ele, index) => {
                if (nomalize(ele) === nomalize(e.target.name))
                    props.type.splice(index, 1)
            })
        }
        dropbtn.innerHTML = props.type.join(", ")
    }

    function handleClickShow() {
        const dropdownContent = document.querySelector(".dropdown-content")
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none"
        }
        else {
            dropdownContent.style.display = "block"
        }
    }
    return (<div className="dropdown" >
        <div className="dropbtn" onClick={handleClickShow}><span>Thể loại</span></div>
        <div className="dropdown-content">
            {props.genres.map((ele, index) => (<div key={index}>
                <input className="the-Checks" type="checkbox" name={ele.name} onChange={(e) => handleChange(e)} />
                <label htmlFor={ele.name}>{ele.name}</label>
            </div>))}
        </div>
    </div>)
}