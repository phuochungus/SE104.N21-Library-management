import { useState, useEffect, useContext } from 'react'
import nomalize from './nomalize.js'
import { SelectedTypes } from '../components/selectedTypes'
import './components.scss'
import alert from './alert.js'
import { AppContext } from '../../App.js'

export function BookInfoAdmin(props) {
    const { token } = useContext(AppContext)
    const [enableEdit, setEnableEdit] = useState(false)

    const [name, setName] = useState(props.name)
    const [author, setAuthor] = useState(props.author)
    const [publisher, setPublisher] = useState(props.publisher)
    const [publishYear, setPublishYear] = useState(props.publishYear)
    const [cost, setCost] = useState(props.price)
    const [type, setType] = useState(props.typeArray)

    const addBtn = document.querySelector(".add-btn-Edit")
    const refreshBtn = document.querySelector(".refresh-btn-Edit")

    const updatedDate = new Date()

    const createdDate = new Date(props.createdDate)

    const [maxPY, setMaxPY] = useState()

    useEffect(() => {
        fetch("https://library2.herokuapp.com/rules/max_publish_year/", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(res => setMaxPY(res))
    }, [token])

    useEffect(() => {
        setName(props.name)
        setAuthor(props.author)
        setPublisher(props.publisher)
        setPublishYear(props.publishYear)
        setCost(props.price)
        setType(props.typeArray)
    }, [props.name, props.author, props.publisher, props.publishYear, props.price, props.typeArray])

    useEffect(() => {
        if (enableEdit === false) {
            const pointerEvents = document.querySelectorAll(".info-table-Edit input")
            for (const ele of pointerEvents)
                ele.style.pointerEvents = "none"
        }
    }, [enableEdit])

    //Handle Click close
    function handleClickClose() {
        const infoTable = document.querySelector(".info-table-Edit")
        infoTable.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"

        const dropcontent = document.querySelector(".dropdown-Selected-content")
        dropcontent.style.display = "none"

        if (enableEdit) {
            refreshBtn.style.display = "none"
            addBtn.innerHTML = "Chỉnh sửa"
            setEnableEdit(cur => !cur)
        }
    }

    //Handle Click Edit
    async function handleClickEdit() {
        const dropdownContent = document.querySelector(".dropdown-Selected-content")
        const pointerEvents = document.querySelectorAll(".info-table-Edit input")

        if (nomalize(addBtn.innerText) === nomalize("Chỉnh sửa")) {
            //prevent edit
            dropdownContent.style.display = "none"
            setEnableEdit(cur => !cur)

            for (const ele of pointerEvents)
                ele.style.pointerEvents = "auto"

            refreshBtn.style.display = "flex"
            addBtn.innerHTML = "Lưu thông tin"
        }
        else {
            addBtn.style.cursor = "wait"

            //type
            const tempType = []
            type.forEach((ele1) => {
                props.genres.forEach((ele2) => {
                    if (nomalize(ele1) === nomalize(ele2.name)) {
                        tempType.push(ele2)
                    }
                })
            })

            if (name === "" || author === "" || tempType.length === 0 || publisher === "" || publishYear === "" || cost === "") {
                alert("Thông tin không được để trống")
                addBtn.style.cursor = "pointer"
            }
            else if (Number.isNaN(Number(cost)) || Number(cost) <= 0) {
                alert("Trị giá không hợp lệ")
                addBtn.style.cursor = "pointer"
            }
            else if (Number.isNaN(Number(publishYear)) || (Number(publishYear) < updatedDate.getFullYear() - maxPY)
                || (Number(publishYear) > updatedDate.getFullYear())) {
                alert("Năm xuất bản không hợp lệ")
                addBtn.style.cursor = "pointer"
            }
            else {
                //prevent edit
                dropdownContent.style.display = "none"
                setEnableEdit(cur => !cur)

                //prevent click
                for (const ele of pointerEvents)
                    ele.style.pointerEvents = "none"

                //fetch
                const option = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        author: author,
                        publisher: publisher,
                        publishYear: Number(publishYear),
                        price: Number(cost),
                        updatedDate: updatedDate.toISOString(),
                        genreIds: tempType.map(ele => ele.genreId)
                    })
                }
                await fetch(`https://library2.herokuapp.com/books/book/${props.bookId}`, option)

                //done
                refreshBtn.style.display = "none"
                addBtn.innerHTML = "Chỉnh sửa"
                addBtn.style.cursor = "pointer"

                const arr = props.bookAPI.map((ele, index) => {
                    if (ele.bookId === props.bookId) {
                        return {
                            ...props.bookAPI[index],
                            name: name,
                            author: author,
                            publisher: publisher,
                            publishYear: Number(publishYear),
                            price: Number(cost),
                            updatedDate: updatedDate.toISOString(),
                            genres: tempType
                        }
                    }
                    else return ele
                })
                props.setBookAPI(arr)
            }

        }
    }

    //handleClickRefresh
    async function handleClickRefresh() {
        refreshBtn.style.cursor = "wait"
        await fetch(`https://library2.herokuapp.com/books/book/${props.bookId}`)
            .then(res => res.json())
            .then(book => {
                props.setBookInfo({
                    ...props.bookInfo,
                    "name": book.name, "author": book.author,
                    "publisher": book.publisher, "publishYear": book.publishYear, "price": book.price
                })
                props.setTypeArray(() => book.genres.map((ele) => ele.name))
            })
        refreshBtn.style.cursor = "pointer"
    }

    //Check available
    var checkAvai = ""
    if (props.isAvailable) {
        checkAvai = "Có sẵn"
        const bookStatus = document.querySelector(".info-table-Edit .book-status")
        if (bookStatus) {
            bookStatus.style.backgroundColor = "#114D0F"
            bookStatus.style.color = "white"
            bookStatus.style.border = "none"
        }
    }
    else {
        if (props.bookInfo.user === null) {
            checkAvai = "Ngưng lưu trữ"
            const bookStatus = document.querySelector(".info-table-Edit .book-status")
            if (bookStatus) {
                bookStatus.style.backgroundColor = "#070B72"
                bookStatus.style.color = "white"
                bookStatus.style.border = "none"
            }
        }
        else {
            checkAvai = "Không có sẵn"
            const bookStatus = document.querySelector(".info-table-Edit .book-status")
            if (bookStatus) {
                bookStatus.style.backgroundColor = "#B65500"
                bookStatus.style.color = "white"
                bookStatus.style.border = "none"
            }
        }

    }

    //Render UI
    return (
        <div className="info-table-Edit">
            <div className="table-title">THÔNG TIN SÁCH</div>
            <div className="info-row">
                <span>Tên sách</span>
                <input
                    className="input"
                    value={name}
                    type="text"
                    onChange={(e) => {
                        if (enableEdit)
                            setName(e.target.value)
                        else return e.target.value
                    }}
                ></input>
            </div>
            <div className="info-row">
                <span>Tác giả</span>
                <input
                    className="input"
                    value={author}
                    type="text"
                    onChange={(e) => {
                        if (enableEdit)
                            setAuthor(e.target.value)
                        else return e.target.value
                    }}
                ></input>
            </div>
            <div className="info-row">
                <span>Thể loại</span>
                <SelectedTypes
                    enableEdit={enableEdit}
                    genres={props.genres || []}
                    genresBook={type || []}></SelectedTypes>
            </div>
            <div className="info-row-differ1">
                <div className="info-row">
                    <span>Nhà xuất bản</span>
                    <input
                        className="input publisher"
                        value={publisher}
                        type="text"
                        onChange={(e) => {
                            if (enableEdit)
                                setPublisher(e.target.value)
                            else return e.target.value
                        }}
                    ></input>
                </div>
                <div className="info-row">
                    <span>Năm xuất bản</span>
                    <input
                        className="input year"
                        value={publishYear}
                        type="text"
                        onChange={(e) => {
                            if (enableEdit)
                                setPublishYear(e.target.value)
                            else return e.target.value
                        }}
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
                        className="input book-cost"
                        value={cost}
                        type="text"
                        onChange={(e) => {
                            if (enableEdit)
                                setCost(e.target.value)
                            else return e.target.value
                        }}
                    ></input>
                </div>
                <span className="par-value">đồng</span>
                <div className="info-row">
                    <span>Tình trạng</span>
                    <input
                        className="input book-status"
                        value={checkAvai}
                        type="text"
                        onChange={(e) => e.target.value}
                    ></input>
                </div>
            </div>
            <div className="ending-row">
                <div className="close-btn-Edit" onClick={handleClickClose}><span>Đóng</span></div>
                <div className="refresh-btn-Edit" onClick={handleClickRefresh}>Hoàn tác</div>
                <div className="add-btn-Edit" onClick={handleClickEdit}><span>Chỉnh sửa</span></div>
            </div>
        </div >)
}