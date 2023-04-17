import { useState } from 'react'
export function AddBook(props) {
    //define info Books
    const [name, setName] = useState("")
    const [author, setAuthor] = useState("")
    const [type, setType] = useState("")
    const [publisher, setPublisher] = useState("")
    const [publishYear, setPublishYear] = useState("")
    const [price, setPrice] = useState("")

    //Define present date
    const createdDate = new Date()

    //Define default status
    const bookStatus = document.querySelector(".book-status-add")
    if (bookStatus) {
        bookStatus.style.backgroundColor = "#114D0F"
        bookStatus.style.color = "white"
        bookStatus.style.border = "none"
    }

    //Hanlde click close
    function handleClickClose(e) {
        const addTable = document.querySelector(".add-table")
        addTable.style.display = "none"
        setName("")
        setAuthor("")
        setType("")
        setPublisher("")
        setPublishYear("")
        setPrice("")
    }

    //Hanlde click add books
    async function handleClickAdd(e) {
        const addTable = document.querySelector(".add-table")
        addTable.style.display = "none"

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
                borrowedDate: null,
                reservedDate: null,
                dueDate: null,
                createdDate: createdDate.toISOString(),
                updatedDate: createdDate.toISOString(),
                user: null,
                genres: [],
                isAvailable: true
            })
        }

        await fetch('https://library2.herokuapp.com/books/', option)

        setName("")
        setAuthor("")
        setType("")
        setPublisher("")
        setPublishYear("")
        setPrice("")
        props.handleAPI()
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
                <input placeholder="Thể loại"
                    className="input"
                    value={type}
                    type="text"
                    onChange={(e) => setType(e.target.value)}
                ></input>
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