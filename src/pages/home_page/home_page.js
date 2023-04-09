import "./home_page.scss"
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import nomalize from './js/nomalize.js'
import { BookInfo } from './js/bookInfo'
import { CustomStyle } from './js/table_props'

export default function HomePage() {
    //Define
    const [keyWord, setKeyWord] = useState("")
    const [bookName, setBookName] = useState("")
    const [author, setAuthor] = useState("")
    const [type, setType] = useState("Thể loại")
    const [books, setBooks] = useState([])
    const [bookInfo, setBookInfo] = useState({ ID: "-1", Name: "-1", Type: "-1", Author: "-1", Status: "-1" })

    //Define table props
    const columns = [
        {
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            name: "Mã sách",
            selector: row => row.ID,
            sortable: true,
        },
        {
            name: "Tên sách",
            selector: row => row.Name,
            sortable: true,
        },
        {
            name: "Thể loại",
            selector: row => row.Type,
            sortable: true,
        },
        {
            name: "Tác giả",
            selector: row => row.Author,
            sortable: true,
        },
        {
            name: "Tình trạng",
            selector: row => row.Status,
            sortable: true,
        },
        {
            name: "Hành động",
            selector: row => row.Action,
        },
    ]

    //Call API
    useEffect(() => {
        fetch('http://localhost:3000/courses')
            .then(res => res.json())
            .then(books => {
                localStorage.setItem("bookStorage", JSON.stringify(books))
                setBooks(JSON.parse(localStorage.getItem("bookStorage")))
            })
    }, [])

    //Show book info
    function handleClickInfo(ele) {
        const infoTable = document.querySelector(".info-table")
        infoTable.style.display = "flex"
        setBookInfo(ele)
    }

    //Display books
    useEffect(() => {
        books.map((ele, index) => {
            ele.STT = index + 1;
            ele.Action = (<div className="action">
                <span onClick={() => handleClickInfo(ele, index)} style={{ cursor: "pointer" }}>
                    <img className="icon icon-hover" src={require("./img/info.svg").default} alt="" />
                </span>
                <span style={{ cursor: "pointer" }}>
                    <img className="icon icon-hover" src={require("./img/edit.svg").default} alt="" />
                </span>
            </div>)
            return ele
        })
    }, [books])

    useEffect(() => {
        if (keyWord === "" && bookName === "" && author === "" && (nomalize(type) === nomalize("Tất cả") ||
            nomalize(type) === nomalize("Thể loại")))
            setBooks(JSON.parse(localStorage.getItem("bookStorage")))
    }, [keyWord, bookName, author, type])

    //Handle click
    function handleClick() {
        const newBooks = JSON.parse(localStorage.getItem("bookStorage")).filter((ele, index) => {
            return ((keyWord === "" || nomalize(keyWord) === nomalize(ele.ID)) &&
                (bookName === "" || nomalize(bookName) === nomalize(ele.Name)) &&
                (author === "" || nomalize(author) === nomalize(ele.Author)) &&
                (nomalize(type) === nomalize("Tất cả") ||
                    nomalize(type) === nomalize("Thể loại") ||
                    nomalize(type) === nomalize(ele.type)))
        }
        )
        setBooks(newBooks)
    }

    // Render UI
    return (
        <div className="home-page">
            <div className="book-info">{<BookInfo id={bookInfo.ID}
                name={bookInfo.Name}
                type={bookInfo.Type}
                author={bookInfo.Author}
                status={bookInfo.Status}
            />}</div>
            <div className="main-title">
                <span>TRA CỨU SÁCH</span>
            </div>
            <div className="main-content">
                <div className="search-tool">
                    <input
                        className="input"
                        placeholder="Từ khóa"
                        type="text"
                        id="key-word"
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                    />
                    <input
                        className="input"
                        placeholder="Tên sách"
                        type="text"
                        id="book-name"
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                    />
                    <input
                        className="input"
                        placeholder="Tác giả"
                        type="text"
                        id="author-name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                    <select name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option >Thể loại</option>
                        <option >Tất cả</option>
                    </select>
                    <button onClick={handleClick}>Tra cứu</button>
                </div>
                <div className="data-table">
                    <DataTable
                        columns={columns}
                        data={books}
                        fixedHeader={"true"}
                        fixedHeaderScrollHeight="512px"
                        customStyles={CustomStyle}
                    />
                </div>
            </div>
        </div >
    )
}
