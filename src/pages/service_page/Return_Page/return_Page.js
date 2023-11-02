import { AppContext } from '../../../App'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import { CustomStyle } from '../../components/table_props'
import nomalize from '../../components/nomalize'
import "../../home_page/home_page.scss"
import { createdDateSort } from '../../components/dateSort'

export default function ReturnPage() {
    //define context
    const { setBRInfo, setUserInfo, token } = useContext(AppContext)
    //define navigate
    const navigate = useNavigate()

    //define search tool
    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")
    const [returnedDate, setReturnedDate] = useState("")

    //define return session
    const [reSession, setReSession] = useState([])
    const [reSessionAPI, setReSessionAPI] = useState([])

    //define columns
    const columns = [
        {
            width: "85px",
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "15vw",
            name: "Tên đăng nhập",
            selector: row => row.username,
            sortable: true,
        },
        {
            width: "15vw",
            name: "Tên độc giả",
            selector: row => row.name,
            sortable: true,
        },
        {
            width: "15vw",
            name: "Ngày trả",
            selector: row => new Date(row.createdDate).toLocaleDateString('pt-PT'),
            sortable: true,
            sortFunction: createdDateSort

        },
        {
            width: "14.5vw",
            name: "Số lượng sách",
            selector: row => row.quantity,
            sortable: true,
        },
        {
            name: "Chi tiết",
            selector: row => row.detail,
        },
    ]

    //Get data
    useEffect(() => {
        fetch("https://library2.herokuapp.com/book_return_sessions/")
            .then(res => res.json())
            .then(session => {
                //define clickInfoReturn
                async function handleClickInfo(ele, e) {
                    e.target.style.cursor = "wait"
                    await fetch(`https://library2.herokuapp.com/book_borrow_return_histories/return_session/${ele._id}/`)
                        .then(res => res.json())
                        .then(async info => {
                            await fetch(`https://library2.herokuapp.com/users/user/${info.info[0].userId}/`, {
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                }
                            })
                                .then(res => res.json())
                                .then(user => setUserInfo({ userId: user.userId, username: user.username, name: user.name, totalDebt: user.totalDebt, quantity: info.sessionInfo.quantity })
                                )
                            setBRInfo(info.info)
                        })
                    e.target.style.cursor = "pointer"
                    navigate("/ReturnCard")
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
                setReSessionAPI(() => {
                    setReSession(session)
                    return session
                })
            })
    }, [navigate, setBRInfo, setUserInfo, token])

    //Dislay default reSession
    useEffect(() => {
        if (userName === "" && name === "" && returnedDate === "")
            setReSession(reSessionAPI)
    }, [userName, name, returnedDate, reSessionAPI])


    //Handle clickSearch
    function handleClickSearch() {
        const date = new Date(returnedDate).toLocaleDateString('pt-PT')
        const newReSession = reSessionAPI.filter((ele) => {
            return (userName === "" || nomalize(ele.username).includes(nomalize(userName))) &&
                (name === "" || nomalize(ele.name).includes(nomalize(name))) &&
                (returnedDate === "" || date === new Date(ele.createdDate).toLocaleDateString('pt-PT'))
        }
        )
        setReSession(newReSession)
    }

    // Render UI
    return (
        <div className="home-page">
            <div className="main-title">
                <span>DỊCH VỤ TRẢ SÁCH</span>
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
                        placeholder="Ngày trả"
                        type="text"
                        value={returnedDate}
                        onChange={e => setReturnedDate(e.target.value)}
                    />
                    <button onClick={handleClickSearch}>Tra cứu</button>
                </div>
                <div className="data-table">
                    <DataTable
                        data={reSession}
                        columns={columns}
                        fixedHeader={"true"}
                        fixedHeaderScrollHeight="100%"
                        customStyles={CustomStyle}
                    />
                </div>
            </div>
        </div >
    )
}