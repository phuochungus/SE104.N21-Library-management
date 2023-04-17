import './storage_page.scss'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import nomalize from '../js/nomalize'
import { CustomStyle } from '../js/table_props'
import { BookInfo } from './bookInfo'
import { AcceptRemove } from './acceptRemove'
import { AddBook } from './addBook'

export default function StoragePage() {
    //Define seacrh-tool
    const [bookName, setBookName] = useState("")
    const [author, setAuthor] = useState("")
    const [type, setType] = useState("Thể loại")
    const [status, setStatus] = useState("Tình trạng")

    //Define data books
    const [API, setAPI] = useState(true)
    const [bookAPI, setBookAPI] = useState([]) //original-books
    const [books, setBooks] = useState([]) //handle-books

    //Define book info
    const [bookInfo, setBookInfo] = useState({})

    //Define selected book
    const [selectedBooks, setSelectedBooks] = useState([])
    const [toggledClearRows, setToggleClearRows] = useState(false)

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
        fetch('https://library2.herokuapp.com/books/')
            .then(res => res.json())
            .then(books => {
                setBookAPI(() => {
                    setBooks(books)
                    return books
                })
            })
    }, [API])

    //Display books
    useEffect(() => {
        books.map((ele, index) => {
            ele.STT = index + 1;
            if (ele.isAvailable)
                ele.Status = (<span style={{ color: "#285D24" }}>Có sẵn</span>)
            else
                ele.Status = (<span style={{ color: "#B65500" }}>Không có sẵn</span>)
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

    //Display default books
    useEffect(() => {
        if (bookName === "" && author === "" && (nomalize(type) === nomalize("Tất cả") ||
            nomalize(type) === nomalize("Thể loại")) && (nomalize(status) === nomalize("Tình trạng") ||
                nomalize(status) === nomalize("Tất cả"))
        )
            setBooks(bookAPI)
    }, [bookName, author, type, bookAPI, status])

    //Handle click Search
    function handleClickSearch() {
        const newBooks = bookAPI.filter((ele) => {
            return ((bookName === "" || nomalize(bookName) === nomalize(ele.name)) &&
                (author === "" || nomalize(author) === nomalize(ele.author)) &&
                (nomalize(type) === nomalize("Tất cả") ||
                    nomalize(type) === nomalize("Thể loại") ||
                    nomalize(type) === nomalize(ele.type)) &&
                (nomalize(status) === nomalize("Tất cả") ||
                    nomalize(status) === nomalize("Tình trạng") ||
                    (nomalize(status) === nomalize("Có sẵn") ? true : false) === ele.isAvailable))
        }
        )
        setBooks(newBooks)
    }

    //Hanlde click Remove books
    function handleClickRemove() {
        if (selectedBooks.length === 0)
            alert("Không có mục nào cần xóa !")
        else {
            const acceptTable = document.querySelector(".accept-table")
            acceptTable.style.display = "flex"
        }
    }

    //Handle click add books
    function handleClickAdd() {
        const addTable = document.querySelector(".add-table")
        addTable.style.display = "flex"

    }

    //Handle click show books info
    function handleClickInfo(ele) {
        const infoTable = document.querySelector(".info-table")
        infoTable.style.display = "flex"
        setBookInfo(ele)
    }

    //Handle clear Rows
    const handleClearRows = () => {
        setToggleClearRows(!toggledClearRows);
    }

    //Hanlde selected Books
    const handleSelectedBooks = () => {
        setSelectedBooks([])
    }

    //Hanlde set API
    const handleAPI = () => {
        setAPI(API => !API)
    }

    // Render UI
    return (
        <div className="home-page">
            <AddBook handleAPI={handleAPI}></AddBook>
            <AcceptRemove
                selectedBooks={selectedBooks || []}
                handleAPI={handleAPI}
                handleClearRows={handleClearRows}
                handleSelectedBooks={handleSelectedBooks}></AcceptRemove>
            <BookInfo
                bookId={bookInfo.bookId}
                name={bookInfo.name || ""}
                type={bookInfo.Type || ""}
                author={bookInfo.author || ""}
                isAvailable={bookInfo.isAvailable || ""}
                publisher={bookInfo.publisher || ""}
                publishYear={bookInfo.publishYear || ""}
                price={bookInfo.price || ""}
                createdDate={bookInfo.createdDate || ""}
            />
            <div className="main-title">
                <span>KHO SÁCH</span>
            </div>
            <div className="main-content">
                <div className="search-tool" style={{ margin: "20px auto 12.5px" }}>
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
                    <select name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option >Tình trạng</option>
                        <option >Tất cả</option>
                        <option >Có sẵn</option>
                        <option >Không có sẵn</option>
                    </select>
                    <button onClick={handleClickSearch}>Tra cứu</button>
                </div>
                <div className="handle-tool">
                    <button className="handle-add" onClick={handleClickAdd}>Thêm sách mới</button>
                    <button className="handle-dele" onClick={handleClickRemove}>Xóa</button>
                </div>
                <div className="data-table">
                    <DataTable
                        columns={columns}
                        data={books}
                        fixedHeader={"true"}
                        fixedHeaderScrollHeight="490px"
                        customStyles={CustomStyle}
                        selectableRows
                        onSelectedRowsChange={(selected) => setSelectedBooks(selected.selectedRows)}
                        clearSelectedRows={toggledClearRows}
                    />
                </div>
            </div>
        </div >
    )
}
