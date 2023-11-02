import { NavLink, useNavigate } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { CustomStyle } from '../../components/table_props'
import './BRPage.scss'
import { AppContext } from '../../../App'
import { useContext, useEffect, useState } from 'react'
import alert from '../../components/alert'

export default function BRPage() {
    //Define data from system
    const { userInfo, token, setBRInfo } = useContext(AppContext)
    const [bookId, setBookId] = useState("")

    //Define reserved
    const [reserved, setReserved] = useState()
    const [selectedReserved, setSelectedReserved] = useState([])

    //Define navigate
    const navigate = useNavigate()

    //Define borrowed
    const [borrowed, setBorrowed] = useState()
    const [selectedBorrowed, setSelectedBorrowed] = useState([])

    //define max borrow
    const [maxBorrow, setMaxBorrow] = useState()

    //define due days
    const [dueDay, setDueDay] = useState()

    //Define table props reserved
    const columnsReserved = [
        {
            name: "STT",
            width: "80px",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "8vw",
            name: "Mã sách",
            selector: row => row.bookId,
            sortable: true,
        },
        {
            width: "8vw",
            name: "Tên sách",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Tình trạng",
            selector: row => row.status,
            sortable: true,
        },
    ]

    //Define table props borrowed
    const columnsBorrowed = [
        {
            name: "STT",
            width: "80px",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "8vw",
            name: "Mã sách",
            selector: row => row.bookId,
            sortable: true,
        },
        {
            name: "Tên sách",
            selector: row => row.name,
            sortable: true,
        }
    ]

    //get max borrow
    useEffect(() => {
        fetch("https://library2.herokuapp.com/rules/max_borrow/", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(res => {
                setMaxBorrow(res)
            })
        fetch("https://library2.herokuapp.com/rules/borrow_interval/", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(res => {
                setDueDay(res)
            })
    }, [token])

    //Get reserved Data
    useEffect(() => {
        fetch(`https://library2.herokuapp.com/users/user/${userInfo.userId}/reserved_book/`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            })
            .then(res => res.json())
            .then(books => {
                books.map((ele, index) => {
                    //Book index
                    ele.STT = index + 1;
                    //Book Status
                    ele.status = <span style={{ "color": "#070B72" }}>Đặt mượn</span>
                    return ele
                })
                setReserved(books)
            })
    }, [token, userInfo.userId])

    //Get borrowed Data
    useEffect(() => {
        fetch(`https://library2.herokuapp.com/users/borrow_book/${userInfo.userId}/`)
            .then(res => res.json())
            .then(books => {
                books.map((ele, index) => {
                    //Book index
                    ele.STT = index + 1;
                    return ele
                })
                setBorrowed(books)
            })
    }, [token, userInfo.userId])

    //HandleClickSearch
    async function handleClickSearch() {
        if (bookId === "")
            alert("Thông tin không được để trống")
        else {
            await fetch(`https://library2.herokuapp.com/books/book/${bookId}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                .then(res => res.json())
                .then(book => {
                    if (book.message)
                        alert("Không tìm thấy sách tương ứng")
                    else if (book.isAvailable === false) { alert("Sách hiện không có sẵn") }
                    else {
                        if (!reserved.some(ele => ele.bookId === book.bookId)) {
                            book.STT = reserved.length + 1
                            book.status = <span style={{ "color": "red" }}>Mới</span>
                            setReserved(cur => [...cur, book])
                        }
                    }

                })
        }
    }

    //handle Click borrow
    async function hanldeClickBorrow() {
        const print = document.querySelector(".temp-list .print")
        print.style.cursor = "wait"

        if (selectedReserved.length === 0) {
            alert("Chưa chọn sách để mượn")
            print.style.cursor = "pointer"
        }
        else {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    bookIds: selectedReserved.map(ele => ele.bookId),
                    userId: userInfo.userId
                })
            }
            await fetch('https://library2.herokuapp.com/book_borrow_records/', option)
                .then(res => res.json())
                .then(book => {
                    if (book.message) {
                        console.log(book.message)
                        alert(`Người dùng đã mượn tối đa ${maxBorrow} cuốn trong vòng ${dueDay} ngày`)
                        print.style.cursor = "pointer"
                    }
                    else {
                        print.style.cursor = "pointer"
                        setBRInfo(book)
                        navigate("/BorrowCard")
                    }
                })
        }
    }

    //handle Click return
    async function handleClickReturn() {
        const print = document.querySelector(".borrowed-list .print")
        print.style.cursor = "wait"

        if (selectedBorrowed.length === 0) {
            alert("Chưa chọn sách để trả")
            print.style.cursor = "pointer"
        }
        else {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    bookIds: selectedBorrowed.map(ele => ele.bookId),
                    userId: userInfo.userId
                })
            }
            await fetch('https://library2.herokuapp.com/book_return_records/', option)
                .then(res => res.json())
                .then(async function (book) {
                    await fetch(`https://library2.herokuapp.com/book_borrow_return_histories/return_session/${book[0].returnSessionId}/`)
                        .then(res => res.json())
                        .then(rec => { setBRInfo(rec.info) })
                })
            print.style.cursor = "pointer"
            navigate("/ReturnCard")
        }
    }


    return (
        <div className="borrow-and-return-page">
            <div className="main-title">
                <span>LẬP PHIẾU MƯỢN - TRẢ SÁCH</span>
                <NavLink to="/Reader"><img className="icon icon-hover" src={require("./img/return.svg").default} alt="" /></NavLink>
            </div>
            <div className="main-content">
                <div className="temp-list">
                    <div className="books-id">
                        <input
                            className="input"
                            placeholder="Mã sách"
                            type="text"
                            value={bookId}
                            onChange={e => setBookId(e.target.value)}
                        />
                        <button onClick={handleClickSearch}>Tra cứu</button>
                    </div>
                    <div className="the-table">
                        <span className="table-name">DANH SÁCH TẠM THỜI</span>
                        <div className="table">
                            <div className="data-table">
                                <DataTable
                                    data={reserved}
                                    columns={columnsReserved}
                                    fixedHeader={"true"}
                                    fixedHeaderScrollHeight="100%"
                                    customStyles={CustomStyle}
                                    selectableRows
                                    onSelectedRowsChange={(selected) => setSelectedReserved(selected.selectedRows)}
                                />
                            </div>
                        </div>
                        <div className="ending-row">
                            <div onClick={hanldeClickBorrow} className="print">In phiếu mượn sách</div>
                        </div>
                    </div>
                </div>
                <div className="borrowed-list">
                    <input
                        className="input"
                        placeholder="Tên đăng nhập"
                        type="text"
                        defaultValue={userInfo.username}
                        style={{ "pointerEvents": "none" }}
                    />
                    <div className="the-table">
                        <span className="table-name">SÁCH ĐANG MƯỢN</span>
                        <div className="table">
                            <div className="data-table">
                                <DataTable
                                    data={borrowed}
                                    columns={columnsBorrowed}
                                    fixedHeader={"true"}
                                    fixedHeaderScrollHeight="100%"
                                    customStyles={CustomStyle}
                                    selectableRows
                                    onSelectedRowsChange={(selected) => setSelectedBorrowed(selected.selectedRows)}
                                />
                            </div>
                        </div>
                        <div className="ending-row">
                            <div className="print" onClick={handleClickReturn}>In phiếu trả sách</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >)
}
