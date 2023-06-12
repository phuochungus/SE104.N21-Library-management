import { AppContext } from '../../../App'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import { CustomStyle } from '../../components/table_props'
import nomalize from '../../components/nomalize'
import "../../home_page/home_page.scss"

export default function BRHistoryPage() {
    //define context
    const { setUserInfo, token } = useContext(AppContext)

    //define navigate
    const navigate = useNavigate()

    //define search tool
    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")

    //define data
    const [users, setUsers] = useState([])
    const [usersAPI, setUsersAPI] = useState([])

    //define columns
    const columns = [
        {
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            name: "Tên đăng nhập",
            selector: row => row.username,
            sortable: true,
        },
        {
            name: "Tên độc giả",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Chi tiết",
            selector: row => row.detail,
        },
    ]

    //Get data
    useEffect(() => {
        fetch("https://library2.herokuapp.com/users/", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(users => {
                function handleClickInfo(ele) {
                    setUserInfo(ele)
                    navigate("/Service/BRHistory/UserHistory")
                }
                users.map((ele, index) => {
                    ele.STT = index + 1
                    ele.detail = (<div className="action">
                        <span onClick={() => handleClickInfo(ele)} style={{ cursor: "pointer" }}>
                            <img className="icon icon-hover" src={require("./img/info.svg").default} alt="" />
                        </span>
                    </div>)
                    return ele
                })
                setUsersAPI(() => {
                    setUsers(users)
                    return users
                })
            })
    }, [token, navigate, setUserInfo])


    //Dislay default users
    useEffect(() => {
        if (userName === "" && name === "")
            setUsers(usersAPI)
    }, [userName, name, usersAPI])

    //Handle clickSearch
    function handleClickSearch() {
        const newUsers = usersAPI.filter((ele) => {
            return (userName === "" || nomalize(ele.username).includes(nomalize(userName))) &&
                (name === "" || nomalize(ele.name).includes(nomalize(name)))
        }
        )
        setUsers(newUsers)
    }

    // Render UI
    return (
        <div className="home-page">
            <div className="main-title">
                <span>LỊCH SỬ MƯỢN/TRẢ SÁCH</span>
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
                    <button onClick={handleClickSearch}>Tra cứu</button>
                </div>
                <div className="data-table">
                    <DataTable
                        data={users}
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