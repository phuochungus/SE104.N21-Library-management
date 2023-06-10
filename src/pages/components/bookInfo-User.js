import './components.scss'
import { useEffect } from 'react'
import success from './success'

export function BookInfoUser(props) {

    useEffect(() => {
        const pointerEvents = document.querySelectorAll(".info-table input")
        for (const ele of pointerEvents)
            ele.style.pointerEvents = "none"
    })

    //Handle clickClose
    function handleClickClose(e) {
        const infoTable = document.querySelector(".info-table")
        infoTable.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"
    }
    //Handle clickAdd
    async function handleClickAdd(e) {
        handleClickClose()
        const option = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.token
            },
            body: JSON.stringify({
                bookId: props.bookId,
            })
        }
        await fetch('https://library2.herokuapp.com/book_shelf/', option)

        success("Thêm vào giỏ sách thành công")
    }
    //Define a created Date
    const createdDate = new Date(props.createdDate)

    //Check available
    var checkAvai = ""
    if (props.isAvailable) {
        checkAvai = "Có sẵn"
        const bookStatus = document.querySelector(".info-table .book-status")
        if (bookStatus) {
            bookStatus.style.backgroundColor = "#114D0F"
            bookStatus.style.color = "white"
            bookStatus.style.border = "none"
        }
    }
    else {
        if (props.bookInfo.user === null) {
            checkAvai = "Ngưng lưu trữ"
            const bookStatus = document.querySelector(".info-table .book-status")
            if (bookStatus) {
                bookStatus.style.backgroundColor = "#070B72"
                bookStatus.style.color = "white"
                bookStatus.style.border = "none"
            }
        }
        else {
            checkAvai = "Không có sẵn"
            const bookStatus = document.querySelector(".info-table .book-status")
            if (bookStatus) {
                bookStatus.style.backgroundColor = "#B65500"
                bookStatus.style.color = "white"
                bookStatus.style.border = "none"
            }
        }

    }

    //Show all types
    const typeArray = props.genres.map(ele => ele.name)

    //Render UI
    return (
        <div className="info-table">
            <div className="table-title">THÔNG TIN SÁCH</div>
            <div className="info-row">
                <span>Tên sách</span>
                <input
                    className="input"
                    value={props.name}
                    type="text"
                    onChange={(e) => e.target.value}
                ></input>
            </div>
            <div className="info-row">
                <span>Tác giả</span>
                <input
                    className="input"
                    value={props.author}
                    type="text"
                    onChange={(e) => e.target.value}
                ></input>
            </div>
            <div className="info-row">
                <span>Thể loại</span>
                <input
                    className="input"
                    value={typeArray.join(", ")}
                    type="text"
                    onChange={(e) => e.target.value}
                ></input>
            </div>
            <div className="info-row-differ1">
                <div className="info-row">
                    <span>Nhà xuất bản</span>
                    <input
                        className="input publisher"
                        value={props.publisher}
                        type="text"
                        onChange={(e) => e.target.value}
                    ></input>
                </div>
                <div className="info-row">
                    <span>Năm xuất bản</span>
                    <input
                        className="input year"
                        value={props.publishYear}
                        type="text"
                        onChange={(e) => e.target.value}
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
                        value={props.price}
                        type="text"
                        onChange={(e) => e.target.value}
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
                <div className="close-btn" onClick={(e) => handleClickClose(e)}><span>Đóng</span></div>
                <div className="add-btn" onClick={(e) => handleClickAdd(e)}><span>Thêm vào giá sách</span></div>
            </div>
        </div>)
}