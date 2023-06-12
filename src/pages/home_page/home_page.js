import "./home_page.scss"
import { AppContext } from '../../App'
import { useEffect, useState, useContext } from 'react'
import DataTable from 'react-data-table-component';
import nomalize from '../components/nomalize'
import { BookInfoUser } from '../components/bookInfo-User'
import { BookInfoAdmin } from '../components/bookInfo-Admin'
import { CustomStyle } from '../components/table_props'
import { Selection } from '../components/select'
import statusSort from '../components/sortStatus'
import success from '../components/success'
import alert from '../components/alert'

export default function HomePage() {
    const { isAdmin, userId, token } = useContext(AppContext);
    //Define seacrh-tool
    const [keyWord, setKeyWord] = useState("")
    const [bookName, setBookName] = useState("")
    const [author, setAuthor] = useState("")
    const [type, setType] = useState("Thể loại")

    //Define API
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
            width: "9vw",
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
            width: "12vw",
            name: "Thể loại",
            selector: row => row.Type,
            sortable: true,
        },
        {
            width: "12vw",
            name: "Tác giả",
            selector: row => row.author,
            sortable: true,
        },
        {
            width: "11.5vw",
            name: "Tình trạng",
            selector: row => row.Status,
            sortable: true,
            sortFunction: statusSort
        },
        {
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
    }, [])

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
            if (isAdmin) {
                ele.Action = (<div className="action">
                    <span onClick={() => handleClickInfoAdmin(ele, index)} style={{ cursor: "pointer" }}>
                        <img className="icon icon-hover" src={require("./img/edit.svg").default} alt="" />
                    </span>
                    <span onClick={(e) => handleClickCopy(ele, e)} style={{ cursor: "pointer" }}>
                        <img className="icon icon-hover" src={require("./img/copy.svg").default} alt="" />
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

    }, [books, typeArray, isAdmin, bookAPI])

    //Dislay default books
    useEffect(() => {
        if (keyWord === "" && bookName === "" && author === "" && (nomalize(type) === nomalize("Tất cả") ||
            nomalize(type) === nomalize("Thể loại")))
            setBooks(bookAPI)
    }, [keyWord, bookName, author, type, bookAPI])

    //Handle clickSearch
    function handleClickSearch() {
        const newBooks = bookAPI.filter((ele) => {
            return ((keyWord === "" || nomalize(ele.name).includes(nomalize(keyWord)) ||
                nomalize(ele.author).includes(nomalize(keyWord)) ||
                ele.genres.some((elex) => nomalize(elex.name).includes(nomalize(keyWord)))) &&

                (bookName === "" || nomalize(ele.name).includes(nomalize(bookName))) &&
                (author === "" || nomalize(ele.author).includes(nomalize(author))) &&
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
                /> :
                <BookInfoUser
                    bookInfo={bookInfo}
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