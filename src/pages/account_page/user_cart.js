import { NavLink } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import DataTable from 'react-data-table-component'
import { CustomStyle } from '../components/table_props'
import './account_page.scss'
import { AppContext } from '../../App'
import alert from '../components/alert'
import statusSort from '../components/sortStatus'

export default function UserCart() {
    //Define info 
    const { token, userInfo } = useContext(AppContext)

    //Define cart
    const [cart, setCart] = useState()
    const [APICart, setAPICart] = useState(false)

    //Define reserved
    const [reserved, setReserved] = useState()
    const [APIReserved, setAPIReserved] = useState(false)

    //Define selected book Cart
    const [selectedCartBooks, setSelectedCartBooks] = useState([])
    const [toggledClearRowsCart, setToggleClearRowsCart] = useState(false)

    //Define selected book Reserved
    const [selectedReservedBooks, setSelectedReservedBooks] = useState([])
    const [toggledClearRowsReserved, setToggleClearRowsReserved] = useState(false)

    //define max borrow
    const [maxBorrow, setMaxBorrow] = useState()

    //define due days
    const [dueDay, setDueDay] = useState()

    //get max borrow
    useEffect(() => {
        fetch("https://library2.herokuapp.com/rules/max_borrow/")
            .then(res => res.json())
            .then(res => {
                setMaxBorrow(res)
            })
        fetch("https://library2.herokuapp.com/rules/borrow_interval/")
            .then(res => res.json())
            .then(res => {
                setDueDay(res)
            })
    }, [])

    //Define table props cart
    const columnsCart = [
        {
            width: "80px",
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "5vw",
            name: "Mã sách",
            selector: row => row.bookId,
            sortable: true,
        },
        {
            width: "10.2vw",
            name: "Tên sách",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Tình trạng",
            selector: row => row.Status,
            sortable: true,
            sortFunction: statusSort
        },
    ]

    //Define table props reserved
    const columnsReserved = [
        {
            name: "STT",
            width: "80px",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "7vw",
            name: "Mã sách",
            selector: row => row.bookId,
            sortable: true,
        },
        {
            width: "7.5vw",
            name: "Tên sách",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Thời gian còn lại",
            selector: row => <span style={{ "color": "red" }}>{String(row.remainReserveTime.toFixed(2)) + ' giờ'}</span>,
            sortable: true,
        },
    ]

    //Get cart data
    useEffect(() => {
        fetch('https://library2.herokuapp.com/book_shelf/', {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
            .then(res => res.json())
            .then(books => {
                books.map((ele, index) => {
                    //Book index
                    ele.STT = index + 1;

                    //Book availability
                    if (ele.isAvailable)
                        ele.Status = (<span style={{ color: "#285D24" }}>Có sẵn</span>)
                    else {
                        if (ele.user === null)
                            ele.Status = (<span style={{ color: "#070B72" }}>Ngưng lưu trữ</span>)
                        else
                            ele.Status = (<span style={{ color: "#B65500" }}>Không có sẵn</span>)
                    }

                    return ele
                })
                setCart(books)
            })
    }, [token, APICart])

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
                    return ele
                })
                setReserved(books)
            })
    }, [token, APIReserved, userInfo.userId])

    //Handle clear Rows
    const handleClearRowsCart = () => {
        setToggleClearRowsCart(!toggledClearRowsCart);
    }
    //Hanlde selected Books
    const handleSelectedCartBooks = () => {
        setSelectedCartBooks([])
    }

    //Handle order to borrow
    async function handleClickBorrow() {
        if (selectedCartBooks.length === 0)
            alert("Chưa chọn sách cần đặt mượn")
        else {
            const print = document.querySelector(".user-cart-page .order")
            print.style.cursor = "wait"

            for (var a of selectedCartBooks) {
                if (a.isAvailable === false) {
                    alert("Sách hiện không có sẵn")
                }
                else {
                    const option = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({
                            bookId: a.bookId,
                            userId: userInfo.userId
                        })
                    }
                    await fetch('https://library2.herokuapp.com/books/reserve/', option)
                        .then(res => {
                            if (res.status === 409)
                                return res.json()
                        })
                        .then(res => {
                            if (res) {
                                console.log(res.message)
                                alert(`Bạn đã mượn tối đa ${maxBorrow} cuốn trong vòng ${dueDay} ngày`)
                            }
                        }
                        )
                }

            }
            handleClearRowsReserved()
            handleSelectedReservedBooks()
            handleClearRowsCart()
            handleSelectedCartBooks()
            setAPIReserved(cur => !cur)
            print.style.cursor = "pointer"
        }

    }

    //handle delete cart
    async function handleClickDelete() {
        if (selectedCartBooks.length === 0)
            alert("Không có mục nào cần xóa")
        else {
            const deleteE = document.querySelector(".user-cart-page .delete")

            deleteE.style.cursor = "wait"
            const option = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    bookIds: selectedCartBooks.map(ele => ele.bookId)
                })
            }
            await fetch('https://library2.herokuapp.com/book_shelf/', option)
            handleClearRowsCart()
            handleSelectedCartBooks()
            setAPICart(cur => !cur)
            deleteE.style.cursor = "pointer"
        }
    }

    //Handle clear Rows
    const handleClearRowsReserved = () => {
        setToggleClearRowsReserved(!toggledClearRowsReserved);
    }
    //Hanlde selected Books
    const handleSelectedReservedBooks = () => {
        setSelectedReservedBooks([])
    }
    //handle delete reserved
    async function handleClickUndo() {
        if (selectedReservedBooks.length === 0)
            alert("Chưa chọn sách cần hủy đặt mượn")
        else {
            const undo = document.querySelector(".user-cart-page .undo")
            undo.style.cursor = "wait"

            for (var a of selectedReservedBooks) {
                const option = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        bookId: a.bookId,
                        userId: userInfo.userId
                    })
                }
                await fetch('https://library2.herokuapp.com/books/reserve/', option)
            }
            handleClearRowsReserved()
            handleSelectedReservedBooks()
            setAPIReserved(cur => !cur)
            undo.style.cursor = "pointer"
        }

    }

    return (
        <div className="user-cart-page">
            <div className="main-title">
                <span>GIÁ SÁCH CỦA TÔI</span>
                <NavLink to="/Account"><img className="icon icon-hover" src={require("./img/return.svg").default} alt="" /></NavLink>
            </div>
            <div className="main-content">
                <div className="temp-list">
                    <div className="the-table">
                        <span className="table-name">GIÁ SÁCH</span>
                        <div className="table">
                            <div className="data-table">
                                <DataTable
                                    data={cart}
                                    columns={columnsCart}
                                    fixedHeader={"true"}
                                    fixedHeaderScrollHeight="100%"
                                    customStyles={CustomStyle}
                                    selectableRows
                                    onSelectedRowsChange={(selected) => setSelectedCartBooks(selected.selectedRows)}
                                    clearSelectedRows={toggledClearRowsCart}
                                />
                            </div>
                        </div>
                        <div className="ending-row">
                            <div className="delete" onClick={handleClickDelete}>Xóa</div>
                            <div className="print order" onClick={handleClickBorrow}>Đặt mượn</div>
                        </div>
                    </div>
                    <div className="attention"></div>
                </div>
                <div className="borrowed-list">
                    <div className="the-table">
                        <span className="table-name">SÁCH ĐÃ ĐẶT MƯỢN</span>
                        <div className="table">
                            <div className="data-table">
                                <DataTable
                                    data={reserved}
                                    columns={columnsReserved}
                                    fixedHeader={"true"}
                                    fixedHeaderScrollHeight="100%"
                                    customStyles={CustomStyle}
                                    selectableRows
                                    onSelectedRowsChange={(selected) => setSelectedReservedBooks(selected.selectedRows)}
                                    clearSelectedRows={toggledClearRowsReserved}
                                />
                            </div>
                        </div>
                        <div className="ending-row">
                            <div className="print undo" onClick={handleClickUndo}>Hủy đặt mượn</div>
                        </div>
                    </div>
                    <div className="attention">Lưu ý: Trong vòng 3 ngày sau khi đặt mượn, nếu bạn không đến xác
                        nhận mượn sách tại thư viện, bạn sẽ không được đặt mượn tiếp. </div>
                </div>
            </div>
        </div >)
}
