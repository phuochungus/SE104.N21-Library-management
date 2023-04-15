import "./home_page.scss"
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import nomalize from './js/nomalize.js'
import { BookInfo } from './js/bookInfo'
import { CustomStyle } from './js/table_props'

export default function HomePage() {
    //Define seacrh-tool
    const [keyWord, setKeyWord] = useState("")
    const [bookName, setBookName] = useState("")
    const [author, setAuthor] = useState("")
    const [type, setType] = useState("Thể loại")

    //Define API
    const [API] = useState(true)
    const [bookAPI, setBookAPI] = useState([]) //original-books
    const [books, setBooks] = useState([]) //handle-books

    //Define book info
    const [bookInfo, setBookInfo] = useState({})


    //Define table props 
    const columns = [
        {
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            name: "Mã sách",
            selector: row => row.bookId,
            sortable: true,
        },
        {
            name: "Tên sách",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Thể loại",
            selector: row => row.Type,
            sortable: true,
        },
        {
            name: "Tác giả",
            selector: row => row.author,
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
        fetch('https://library2.herokuapp.com/books?fbclid=IwAR0ONLDTe76gARjq9IUzmWgxBgY_7LOm7ccDpKxC9uDKo2GReB4iS3rTZ3g')
            .then(res => res.json())
            .then(books => {
                setBookAPI(() => {
                    setBooks(books)
                    return books
                })
            }
            )
    }, [API])

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
            if (ele.isAvailable)
                ele.Status = "Có sẵn"
            else
                ele.Status = "Không có sẵn"
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
            setBooks(bookAPI)
    }, [keyWord, bookName, author, type, bookAPI])

    //Handle click
    function handleClick() {
        const newBooks = bookAPI.filter((ele, index) => {
            return ((keyWord === "" || nomalize(keyWord) === nomalize(ele.bookId)) &&
                (bookName === "" || nomalize(bookName) === nomalize(ele.name)) &&
                (author === "" || nomalize(author) === nomalize(ele.author)) &&
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
            <div className="book-info">{<BookInfo bookId={bookInfo.bookId}
                name={bookInfo.name || ""}
                type={bookInfo.Type || ""}
                author={bookInfo.author || ""}
                isAvailable={bookInfo.isAvailable || ""}
                publisher={bookInfo.publisher || ""}
                publishYear={bookInfo.publishYear || ""}
                price={bookInfo.price || ""}
                createdDate={bookInfo.createdDate || ""}
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