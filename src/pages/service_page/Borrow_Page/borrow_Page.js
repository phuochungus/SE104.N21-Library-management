import { AppContext } from '../../../App'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import { CustomStyle } from '../../components/table_props'
import nomalize from '../../components/nomalize'
import "../../home_page/home_page.scss"
import { createdDateSort } from '../../components/dateSort'

export default function BorrowPage() {
    //define context
    const { setBRInfo, setUserInfo } = useContext(AppContext)

    //define navigate
    const navigate = useNavigate()

    //define search tool
    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")
    const [borrowedDate, setBorrowedDate] = useState("")

    //define borrow session
    const [brSession, setBrSession] = useState([])
    const [brSessionAPI, setBrSessionAPI] = useState([])

    //define columns
    const columns = [
        {
            width: "85px",
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "271px",
            name: "Tên đăng nhập",
            selector: row => row.username,
            sortable: true,
        },
        {
            width: "271.3px",
            name: "Tên độc giả",
            selector: row => row.name,
            sortable: true,
        },
        {
            width: "250px",
            name: "Ngày mượn",
            selector: row => new Date(row.createdDate).toLocaleDateString('pt-PT'),
            sortable: true,
            sortFunction: createdDateSort

        },
        {
            width: "200px",
            name: "Số lượng sách",
            selector: row => row.quantity,
            sortable: true,
        },
        {
            width: "115px",
            name: "Chi tiết",
            selector: row => row.detail,
        },
    ]

    //Get data
    useEffect(() => {
        fetch("https://library2.herokuapp.com/book_borrow_sessions/")
            .then(res => res.json())
            .then(session => {
                //define clickInfoBorrow
                async function handleClickInfo(ele, e) {
                    e.target.style.cursor = "wait"
                    await fetch(`https://library2.herokuapp.com/book_borrow_sessions/session/${ele._id}/`)
                        .then(res => res.json())
                        .then(info => {
                            setUserInfo({ username: info[0].username, name: info[0].name, quantity: info[0].quantity })
                            setBRInfo(info[0].records)
                        })
                    e.target.style.cursor = "pointer"
                    navigate("/BorrowCard")
                }

                //display sesions
                session.map((ele, index) => {
                    ele.STT = index + 1
                    ele.detail = (<div className="action">
                        <span onClick={(e) => handleClickInfo(ele, e)} style={{ cursor: "pointer" }}>
                            <img className="icon icon-hover" src={require("./img/info.svg").default} alt="" />
                        </span>
                    </div>)
                    return ele
                })
                setBrSessionAPI(() => {
                    setBrSession(session)
                    return session
                })
            })
    }, [navigate, setBRInfo, setUserInfo])

    //Dislay default brSession
    useEffect(() => {
        if (userName === "" && name === "" && borrowedDate === "")
            setBrSession(brSessionAPI)
    }, [userName, name, borrowedDate, brSessionAPI])


    //Handle clickSearch
    function handleClickSearch() {
        const date = new Date(borrowedDate).toLocaleDateString('pt-PT')
        const newBrSession = brSessionAPI.filter((ele) => {
            return (userName === "" || userName === ele.username) &&
                (name === "" || nomalize(name) === nomalize(ele.name)) &&
                (borrowedDate === "" || date === new Date(ele.createdDate).toLocaleDateString('pt-PT'))
        }
        )
        setBrSession(newBrSession)
    }

    // Render UI
    return (
        <div className="home-page">
            <div className="main-title">
                <span>DỊCH VỤ MƯỢN SÁCH</span>
                <NavLink to="/Service"><img style={{
                    "position": "absolute",
                    "right": "45px",
                    "top": "30px",
                    "cursor": "pointer"
                }} className="icon icon-hover" src={require("./img/return.svg").default} alt="" />
                </NavLink>
            </div>
            <div className="main-content">
                <div className="search-tool">
                    <input
                        className="input"
                        placeholder="Tên đăng nhập"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        className="input"
                        placeholder="Tên độc giả"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        onFocus={e => e.target.type = "date"}
                        onBlur={e => e.target.type = "text"}
                        className="input"
                        placeholder="Ngày mượn"
                        type="text"
                        value={borrowedDate}
                        onChange={e => setBorrowedDate(e.target.value)}
                    />
                    <button onClick={handleClickSearch}>Tra cứu</button>
                </div>
                <div className="data-table">
                    <DataTable
                        data={brSession}
                        columns={columns}
                        fixedHeader={"true"}
                        fixedHeaderScrollHeight="520px"
                        customStyles={CustomStyle}
                    />
                </div>
            </div>
        </div >
    )
}