import "./home_page.scss"
import { AppContext } from '../../App'
import { useEffect, useState, useContext } from 'react'
import DataTable from 'react-data-table-component';
import nomalize from '../components/nomalize'
import { BookInfoUser } from '../components/bookInfo-User'
import { BookInfoAdmin } from '../components/bookInfo-Admin'
import { CustomStyle } from '../components/table_props'
import { Selection } from '../components/select'

export default function HomePage() {
    const { isAdmin, userId, token } = useContext(AppContext);
    //Define seacrh-tool
    const [keyWord, setKeyWord] = useState("")
    const [bookName, setBookName] = useState("")
    const [author, setAuthor] = useState("")
    const [type, setType] = useState("Thể loại")

    //Define API
    const [API, setAPI] = useState(true)
    const [bookAPI, setBookAPI] = useState([]) //original-books
    const [books, setBooks] = useState([]) //handle-books
    const [genres, setGenres] = useState([]) //handle-genres

    //Define book info
    const [bookInfo, setBookInfo] = useState({})
    const [typeArray, setTypeArray] = useState([])


    //Define table props 
    const columns = [
        {
            width: "85px",
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "200px",
            name: "Mã sách",
            selector: row => row.bookId,
            sortable: true,
        },
        {
            width: "200px",
            name: "Tên sách",
            selector: row => row.name,
            sortable: true,
        },
        {
            width: "200px",
            name: "Thể loại",
            selector: row => row.Type,
            sortable: true,
        },
        {
            width: "200px",
            name: "Tác giả",
            selector: row => row.author,
            sortable: true,
        },
        {
            width: "192.3px",
            name: "Tình trạng",
            selector: row => row.Status,
            sortable: true,
        },
        {
            width: "115px",
            name: "Hành động",
            selector: row => row.Action,
        },
    ]

    //Call API books
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

    //Call API Genres
    useEffect(() => {
        fetch('https://library2.herokuapp.com/genres/')
            .then(res => res.json())
            .then(genres => setGenres(genres))
    }, [])

    //Display books
    useEffect(() => {
        function handleClickInfoUser(ele) {
            setBookInfo(ele)
            setTypeArray(() => ele.genres.map((ele1) => ele1.name))

            const overLay = document.querySelector("#overlay")
            overLay.style.display = "flex"
            const infoTable = document.querySelector(".info-table")
            infoTable.style.display = "flex"
        }
        function handleClickInfoAdmin(ele) {
            setBookInfo(ele)
            setTypeArray(() => ele.genres.map((ele1) => ele1.name))

            const overLay = document.querySelector("#overlay")
            overLay.style.display = "flex"
            const infoTable = document.querySelector(".info-table-Edit")
            infoTable.style.display = "flex"
        }
        books.map((ele, index) => {
            //Book index
            ele.STT = index + 1;

            //Book types
            ele.Type = (ele.genres.map(e => e.name)).join(", ")

            //Book availability
            if (ele.isAvailable)
                ele.Status = (<span style={{ color: "#285D24" }}>Có sẵn</span>)
            else
                ele.Status = (<span style={{ color: "#B65500" }}>Không có sẵn</span>)

            //Book actions
            if (isAdmin) {
                ele.Action = (<div className="action">
                    <span onClick={() => handleClickInfoAdmin(ele, index)} style={{ cursor: "pointer" }}>
                        <img className="icon icon-hover" src={require("./img/edit.svg").default} alt="" />
                    </span>
                </div>)
            }
            else {
                ele.Action = (<div className="action">
                    <span onClick={() => handleClickInfoUser(ele, index)} style={{ cursor: "pointer" }}>
                        <img className="icon icon-hover" src={require("./img/info.svg").default} alt="" />
                    </span>
                </div>)
            }
            return ele
        })

    }, [books, typeArray, isAdmin])

    //Dislay default books
    useEffect(() => {
        if (keyWord === "" && bookName === "" && author === "" && (nomalize(type) === nomalize("Tất cả") ||
            nomalize(type) === nomalize("Thể loại")))
            setBooks(bookAPI)
    }, [keyWord, bookName, author, type, bookAPI])

    //Handle clickSearch
    function handleClickSearch() {
        const newBooks = bookAPI.filter((ele) => {
            return ((keyWord === "" || nomalize(keyWord) === nomalize(ele.name) ||
                nomalize(keyWord) === nomalize(ele.author) ||
                ele.genres.some((elex) => nomalize(elex.name) === nomalize(keyWord))) &&
                (bookName === "" || nomalize(bookName) === nomalize(ele.name)) &&
                (author === "" || nomalize(author) === nomalize(ele.author)) &&
                (nomalize(type) === nomalize("Tất cả") ||
                    nomalize(type) === nomalize("Thể loại") ||
                    ele.genres.some((elex) => nomalize(elex.name) === nomalize(type))))
        }
        )
        setBooks(newBooks)
    }

    // Render UI
    return (
        <div className="home-page">
            {isAdmin ?
                <BookInfoAdmin
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
                    setAPI={setAPI}
                /> :
                <BookInfoUser
                    bookId={bookInfo.bookId}
                    name={bookInfo.name || ""}
                    genres={bookInfo.genres || []}
                    author={bookInfo.author || ""}
                    isAvailable={bookInfo.isAvailable || ""}
                    publisher={bookInfo.publisher || ""}
                    publishYear={bookInfo.publishYear || ""}
                    price={bookInfo.price || ""}
                    createdDate={bookInfo.createdDate || ""}
                    userId={userId}
                    token={token}
                />
            }
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
                    <Selection
                        genres={genres.map(ele => ele.name)}
                        title="Thể loại"
                        value={type}
                        SET={setType}
                        ID="type-select"
                    ></Selection>
                    <button onClick={handleClickSearch}>Tra cứu</button>
                </div>
                <div className="data-table">
                    <DataTable
                        columns={columns}
                        data={books}
                        fixedHeader={"true"}
                        fixedHeaderScrollHeight="100%"
                        customStyles={CustomStyle}
                    />
                </div>
            </div>
        </div >
    )
}