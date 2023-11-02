import './storage_page.scss'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import nomalize from '..//components/nomalize'
import { CustomStyle } from '../components/table_props'
import { BookInfoAdmin } from '../components/bookInfo-Admin'
import { AcceptRemove } from '../components/acceptRemove'
import { AddBook } from './addBook'
import { Selection } from '../components/select'
import alert from '../components/alert'
import statusSort from '../components/sortStatus'
import success from '../components/success'

export default function StoragePage() {
    //Define seacrh-tool
    const [bookName, setBookName] = useState("")
    const [author, setAuthor] = useState("")
    const [type, setType] = useState("Thể loại")
    const [status, setStatus] = useState("Tình trạng")

    //Define data books
    const [bookAPI, setBookAPI] = useState([]) //original-books
    const [books, setBooks] = useState([]) //handle-books
    const [genres, setGenres] = useState([]) //handle-genres

    //Define book info
    const [bookInfo, setBookInfo] = useState({})
    const [typeArray, setTypeArray] = useState([])

    //Define selected book
    const [selectedBooks, setSelectedBooks] = useState([])
    const [toggledClearRows, setToggleClearRows] = useState(false)

    //Define table props 
    const columns = [
        {
            width: "85px",
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "8.5vw",
            name: "Mã sách",
            selector: row => row.bookId,
            sortable: true,
        },
        {
            width: "15vw",
            name: "Tên sách",
            selector: row => row.name,
            sortable: true,
        },
        {
            width: "11vw",
            name: "Thể loại",
            selector: row => row.Type,
            sortable: true,
        },
        {
            width: "11vw",
            name: "Tác giả",
            selector: row => row.author,
            sortable: true,
        },
        {
            width: "10vw",
            name: "Tình trạng",
            selector: row => row.Status,
            sortable: true,
            sortFunction: statusSort,

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
    }, [])

    //Call API Genres
    useEffect(() => {
        fetch('https://library2.herokuapp.com/genres/')
            .then(res => res.json())
            .then(genres => setGenres(genres))
    }, [])

    //Display books
    useEffect(() => {
        function handleClickInfo(ele) {
            setBookInfo(ele)
            setTypeArray(() => ele.genres.map((ele1) => ele1.name))

            const overLay = document.querySelector("#overlay")
            overLay.style.display = "flex"
            const infoTable = document.querySelector(".info-table-Edit")
            infoTable.style.display = "flex"
        }

        async function handleClickCopy(ele, e) {
            e.target.style.cursor = "wait"

            if (ele.isAvailable === false && ele.user === null)
                alert("Sách hiện tại đã ngưng lưu trữ")
            else {
                const option = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: ele.name,
                        author: ele.author,
                        publisher: ele.publisher,
                        publishYear: ele.publishYear,
                        price: ele.price,
                        genreIds: ele.genres.map(ele => ele.genreId)
                    })
                }
                await fetch('https://library2.herokuapp.com/books/', option)
                    .then(res => res.json())
                    .then(res => {
                        const arr = [res, ...bookAPI]
                        setBookAPI(arr)
                    })

                success("Sao chép sách thành công")
            }

            e.target.style.cursor = "pointer"
        }

        books.map((ele, index) => {
            //Book index
            ele.STT = index + 1;

            //Book types
            ele.Type = (ele.genres.map(e => e.name)).join(", ")

            //Book availability
            if (ele.isAvailable)
                ele.Status = (<span style={{ color: "#285D24" }}>Có sẵn</span>)
            else {
                if (ele.user === null)
                    ele.Status = (<span style={{ color: "#070B72" }}>Ngưng lưu trữ</span>)
                else
                    ele.Status = (<span style={{ color: "#B65500" }}>Không có sẵn</span>)
            }

            //Book actions
            ele.Action = (<div className="action">
                <span onClick={() => handleClickInfo(ele, index)} style={{ cursor: "pointer" }}>
                    <img className="icon icon-hover" src={require("./img/edit.svg").default} alt="" />
                </span>
                <span onClick={(e) => handleClickCopy(ele, e)} style={{ cursor: "pointer" }}>
                    <img className="icon icon-hover" src={require("./img/copy.svg").default} alt="" />
                </span>
            </div>)
            return ele
        })

    }, [books, typeArray, bookAPI])

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
            return ((bookName === "" || nomalize(ele.name).includes(nomalize(bookName))) &&
                (author === "" || nomalize(ele.author).includes(nomalize(author))) &&
                (nomalize(type) === nomalize("Tất cả") ||
                    nomalize(type) === nomalize("Thể loại") ||
                    ele.genres.some((elex) => nomalize(elex.name) === nomalize(type))) &&
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
            alert("Không có mục nào cần xóa")
        else {
            const overLay = document.querySelector("#overlay")
            overLay.style.display = "flex"
            const acceptTable = document.querySelector(".accept-table")
            acceptTable.style.display = "flex"
            window.onload = function () {
                acceptTable.focus();
            }
        }
    }

    //Handle click add books
    function handleClickAdd() {
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "flex"
        const addTable = document.querySelector(".add-table")
        addTable.style.display = "flex"
    }

    //Handle clear Rows
    const handleClearRows = () => {
        setToggleClearRows(!toggledClearRows);
    }

    //Hanlde selected Books
    const handleSelectedBooks = () => {
        setSelectedBooks([])
    }

    // Render UI
    return (
        <div className="home-page">
            <AddBook
                genres={genres}
                bookAPI={bookAPI}
                setBookAPI={setBookAPI}>
            </AddBook>
            <AcceptRemove
                listAPI={bookAPI}
                setListAPI={setBookAPI}
                selected={selectedBooks || []}
                handleClearRows={handleClearRows}
                handleSelected={handleSelectedBooks}
                fetchLink={"https://library2.herokuapp.com/books/book/"}
                ele={"bookId"}
            >
            </AcceptRemove>
            <BookInfoAdmin
                bookAPI={bookAPI}
                setBookAPI={setBookAPI}
                bookInfo={bookInfo}
                bookId={bookInfo.bookId}
                name={bookInfo.name || ""}
                author={bookInfo.author || ""}
                isAvailable={bookInfo.isAvailable || ""}
                publisher={bookInfo.publisher || ""}
                publishYear={bookInfo.publishYear || ""}
                price={bookInfo.price || ""}
                createdDate={bookInfo.createdDate || ""}
                setBookInfo={setBookInfo}
                genres={genres || []}
                typeArray={typeArray || []}
                setTypeArray={setTypeArray || []}
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
                    <Selection
                        genres={genres.map(ele => ele.name)}
                        title="Thể loại"
                        value={type}
                        SET={setType}
                        ID="type-select"
                    ></Selection>
                    <Selection
                        genres={["Tất cả", "Có sẵn", "Không có sẵn"]}
                        title="Tình trạng"
                        value={status}
                        SET={setStatus}
                        ID="status-select"
                    ></Selection>
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
                        fixedHeaderScrollHeight="100%"
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
