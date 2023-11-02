import { useState, useContext, useEffect } from 'react'
import { SelectType } from '../components/selectTypes'
import nomalize from '../components/nomalize'
import alert from '../components/alert'
import { AppContext } from '../../App.js'
import success from '../components/success'

export function AddBook(props) {
    //define info Books
    const [name, setName] = useState("")
    const [author, setAuthor] = useState("")
    const [type, setType] = useState([])
    const [publisher, setPublisher] = useState("")
    const [publishYear, setPublishYear] = useState("")
    const [price, setPrice] = useState("")

    const { token } = useContext(AppContext)
    const [maxPY, setMaxPY] = useState()

    //Define present date
    const createdDate = new Date()

    //Define default status
    const bookStatus = document.querySelector(".book-status-add")
    if (bookStatus) {
        bookStatus.style.backgroundColor = "#114D0F"
        bookStatus.style.color = "white"
        bookStatus.style.border = "none"
    }

    useEffect(() => {
        fetch("https://library2.herokuapp.com/rules/max_publish_year/", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(res => setMaxPY(res))
    }, [token])

    //Hanlde click close
    function handleClickClose(e) {
        const addTable = document.querySelector(".add-table")
        addTable.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"

        const dropdownContent = document.querySelector(".dropdown-content")
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none"
        }

        const theChecks = document.querySelectorAll(".the-Checks")
        theChecks.forEach((ele, index) => {
            if (ele.checked)
                ele.checked = false
        })
        const dropbtn = document.querySelector(".dropbtn span")
        dropbtn.innerHTML = "Thể loại"

        setName("")
        setAuthor("")
        setType([])
        setPublisher("")
        setPublishYear("")
        setPrice("")
    }

    //Hanlde click add books
    async function handleClickAdd(e) {
        const addBtn = document.querySelector(".add-btn")
        addBtn.style.cursor = "wait"
        const tempType = []

        type.forEach((ele1, index1) => {
            props.genres.forEach((ele2) => {
                if (nomalize(ele1) === nomalize(ele2.name)) {
                    tempType[index1] = ele2
                }
            })
        })

        if (name === "" || author === "" || tempType.length === 0 || publisher === "" || publishYear === "" || price === "") {
            alert("Thông tin không được để trống")
            addBtn.style.cursor = "pointer"
        }
        else if (Number.isNaN(Number(price)) || Number(price) <= 0) {
            alert("Trị giá không hợp lệ")
            addBtn.style.cursor = "pointer"
        }
        else if (Number.isNaN(Number(publishYear)) || (Number(publishYear) < createdDate.getFullYear() - maxPY)
            || (Number(publishYear) > createdDate.getFullYear())) {
            alert("Năm xuất bản không hợp lệ")
            addBtn.style.cursor = "pointer"
        }
        else {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    author: author,
                    publisher: publisher,
                    publishYear: Number(publishYear),
                    price: Number(price),
                    createdDate: createdDate.toISOString(),
                    updatedDate: createdDate.toISOString(),
                    genreIds: tempType.map(ele => ele.genreId)
                })
            }
            await fetch('https://library2.herokuapp.com/books/', option)
                .then(res => res.json())
                .then(res => {
                    const arr = [res, ...props.bookAPI]
                    props.setBookAPI(arr)
                })

            const dropdownContent = document.querySelector(".dropdown-content")
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none"
            }

            const theChecks = document.querySelectorAll(".the-Checks")
            theChecks.forEach((ele, index) => {
                if (ele.checked)
                    ele.checked = false
            })

            success("Thêm thành công")

            const dropbtn = document.querySelector(".dropbtn span")
            dropbtn.innerHTML = "Thể loại"
            const addTable = document.querySelector(".add-table")
            addTable.style.display = "none"
            const overLay = document.querySelector("#overlay")
            overLay.style.display = "none"

            setName("")
            setAuthor("")
            setType([])
            setPublisher("")
            setPublishYear("")
            setPrice("")

            addBtn.style.cursor = "pointer"

        }

    }

    //Render UI
    return (
        <div className="add-table">
            <div className="table-title">THÔNG TIN SÁCH</div>
            <div className="info-row">
                <span>Tên sách</span>
                <input
                    placeholder="Tên sách"
                    className="input"
                    value={name}
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                ></input>
            </div>
            <div className="info-row">
                <span>Tác giả</span>
                <input
                    placeholder="Tác giả"
                    className="input"
                    value={author}
                    type="text"
                    onChange={(e) => setAuthor(e.target.value)}
                ></input>
            </div>
            <div className="info-row">
                <span>Thể loại</span>
                <SelectType
                    genres={props.genres}
                    type={type}></SelectType>
            </div>
            <div className="info-row-differ1">
                <div className="info-row">
                    <span>Nhà xuất bản</span>
                    <input
                        placeholder="Nhà xuất bản"
                        className="input publisher"
                        value={publisher}
                        type="text"
                        onChange={(e) => setPublisher(e.target.value)}
                    ></input>
                </div>
                <div className="info-row">
                    <span>Năm xuất bản</span>
                    <input
                        placeholder="Năm xuất bản"
                        className="input year"
                        value={publishYear}
                        type="text"
                        onChange={(e) => setPublishYear(e.target.value)}
                    ></input>
                </div>
            </div>
            <div className="info-row-differ2">
                <div className="info-row">
                    <span>Ngày nhập</span>
                    <input
                        className="input receipt-date"
                        value={createdDate.toLocaleDateString('pt-PT')}
                        type="text"
                        onChange={(e) => e.target.value}
                    ></input>
                </div>
                <div className="info-row">
                    <span>Trị giá</span>
                    <input
                        placeholder="Trị giá"
                        className="input book-cost"
                        value={price}
                        type="text"
                        onChange={(e) => setPrice(e.target.value)}
                    ></input>
                </div>
                <span className="par-value">đồng</span>
                <div className="info-row">
                    <span>Tình trạng</span>
                    <input
                        className="input book-status-add"
                        value="Có sẵn"
                        type="text"
                        onChange={(e) => e.target.value}
                    ></input>
                </div>
            </div>
            <div className="ending-row">
                <div className="close-btn" onClick={(e) => handleClickClose(e)}><span>Đóng</span></div>
                <div className="add-btn" onClick={(e) => handleClickAdd(e)}><span>Lưu thông tin</span></div>
            </div>
        </div>)
}