import './UserHistory.scss'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../../App'
import DataTable from 'react-data-table-component'
import { CustomStyle } from './table_props'
import { borrowDateSort, returnDateSort } from '../../components/dateSort'

export default function UserHistoryPage() {
    const { userInfo, setUserInfo, setBRInfo } = useContext(AppContext)
    const [history, setHistory] = useState([])

    //Define navigate
    const navigate = useNavigate()

    //define data
    useEffect(() => {
        async function handleClick(ele, e) {
            e.target.style.cursor = "wait"
            await fetch(`https://library2.herokuapp.com/book_borrow_return_histories/return_session/${ele.returnSessionId}/`)
                .then(res => res.json())
                .then(rec => {
                    setBRInfo(rec.info)
                    setUserInfo({ ...userInfo, brn: "brn" })
                })
            e.target.style.cursor = "pointer"
            navigate("/ReturnCard")
        }

        fetch(`https://library2.herokuapp.com/book_borrow_return_histories/user/${userInfo.userId}/`)
            .then(res => res.json())
            .then(brInfo => {
                brInfo.map((ele, index) => {
                    ele.STT = index + 1
                    ele.detail = (
                        <div className="action">
                            <span onClick={(e) => handleClick(ele, e)} style={{ cursor: "pointer" }}>
                                <img className="icon icon-hover" src={require("./img/info.svg").default} alt="" />
                            </span>
                        </div>
                    )
                    return ele
                })
                setHistory(brInfo)
            })
    })

    //Define table props 
    const columns = [
        {
            width: "85px",
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "120px",
            name: "Mã sách",
            selector: row => row.bookId,
            sortable: true,
        },
        {
            width: "130.5px",
            name: "Tên sách",
            selector: row => row.bookName,
            sortable: true,
        },
        {
            width: "131px",
            name: "Tác giả",
            selector: row => row.author,
            sortable: true,
        },
        {
            width: "140px",
            name: "Ngày mượn",
            selector: row => new Date(row.borrowDate).toLocaleDateString('pt-PT'),
            sortable: true,
            sortFunction: borrowDateSort

        },
        {
            width: "140px",
            name: "Ngày trả",
            selector: row => new Date(row.returnDate).toLocaleDateString('pt-PT'),
            sortable: true,
            sortFunction: returnDateSort
        },
        {
            name: "Chi tiết",
            selector: row => row.detail,
        },
    ]

    return (<div className="user-history-page">
        <div className="user-info">
            <span className="tittle">THÔNG TIN ĐỘC GIẢ</span>
            <div className="info-row">
                <span>Tên độc giả</span>
                <input
                    className="input "
                    type="text"
                    defaultValue={userInfo.name}
                ></input>
            </div>
            <div className="info-row">
                <span>Tên đăng nhập</span>
                <input
                    className="input "
                    type="text"
                    defaultValue={userInfo.username}
                ></input>
            </div>
            <div className="info-row">
                <span>Email</span>
                <input
                    className="input "
                    type="text"
                    defaultValue={userInfo.email}
                ></input>
            </div>
            <div className="info-row">
                <span>Địa chỉ</span>
                <input
                    className="input "
                    type="text"
                    defaultValue={userInfo.address}
                ></input>
            </div>
            <div className="info-row">
                <span>Ngày hết hạn</span>
                <input
                    className="input "
                    type="text"
                    defaultValue={new Date(userInfo.validUntil).toLocaleDateString('pt-PT')}
                ></input>
            </div>
        </div>
        <div className="borrow-card">
            <span className="tittle">LỊCH SỬ MƯỢN - TRẢ SÁCH</span>
            <NavLink to={userInfo.Action ? "/Reader" : "/Service/BRHistory"}><img className="icon icon-hover return" src={require("./img/return.svg").default} alt="" /></NavLink>
            <div className="cards">
                <DataTable
                    data={history}
                    columns={columns}
                    fixedHeader={"true"}
                    fixedHeaderScrollHeight="648px"
                    customStyles={CustomStyle}
                />
            </div>
        </div>
    </div>)
}