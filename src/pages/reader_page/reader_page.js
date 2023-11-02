import { useEffect, useState, useContext } from 'react'
import DataTable from 'react-data-table-component';
import nomalize from '..//components/nomalize'
import { CustomStyle } from '../components/table_props'
import { Selection } from '../components/select'
import { AcceptRemove } from '../components/acceptRemove'
import { AddUser } from './addUser.js'
import { UserInfo } from './userInfo'
import { AppContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import { createdDateSort } from '../components/dateSort'
import alert from '../components/alert'

export default function ReaderPage() {
    const { token, setUserInfo } = useContext(AppContext);
    const navigate = useNavigate();

    //Define data users

    const [userAPI, setUserAPI] = useState([]) //original-user
    const [users, setUsers] = useState([]) //handle-user
    const [userInfo, setUserInfos] = useState({ name: "", username: "", birth: "", email: "", address: "", type: "", createdDate: "" })

    //Define seacrh-tool
    const [userName, setUserName] = useState("")
    const [name, setName] = useState("")
    const [createdDate, setCreatedDate] = useState("")
    const [type, setType] = useState("Loại độc giả")

    //Define selected user
    const [selectedUsers, setSelectedUsers] = useState([])
    const [toggledClearRows, setToggleClearRows] = useState(false)

    //Define table props 
    const columns = [
        {
            width: "80px",
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "9.5vw",
            name: "Tên đăng nhập",
            selector: row => row.username,
            sortable: true,
        },
        {
            width: "13.5vw",
            name: "Họ tên",
            selector: row => row.name,
            sortable: true,
        },
        {
            width: "5.5vw",
            name: "Loại",
            selector: row => row.type,
            sortable: true,
        },
        {
            width: "9vw",
            name: "Địa chỉ",
            selector: row => row.address,
            sortable: true,
        },
        {
            width: "9vw",
            name: "Email",
            selector: row => row.email,
            sortable: true,
        },
        {
            width: "9vw",
            name: "Ngày lập thẻ",
            selector: row => row.created,
            sortable: true,
            sortFunction: createdDateSort
        },
        {
            name: "Hành động",
            selector: row => row.Action,
        },
    ]

    //Call API
    useEffect(() => {
        fetch('https://library2.herokuapp.com/users', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => response.json())
            .then(users => {
                setUserAPI(() => {
                    setUsers(users)
                    return users
                })
            })
    }, [token])

    //Display users
    useEffect(() => {
        //handleNavigate
        const handleNavigation = (ele) => {
            setUserInfo(ele)
            navigate("/Service/BRSlip")
        };

        //hanldeClickInfo
        function handleClickInfo(ele) {
            setUserInfos(ele)
            const overLay = document.querySelector("#overlay")
            overLay.style.display = "flex"
            const infoTable = document.querySelector(".info-table-user")
            infoTable.style.display = "flex"
        }

        users.map((ele, index) => {
            //user index
            ele.STT = index + 1;

            //user createDate
            ele.created = new Date(ele.createdDate).toLocaleDateString('pt-PT')

            //user actions
            ele.Action = (<div className="action">
                <span onClick={() => handleClickInfo(ele)} style={{ cursor: "pointer" }}>
                    <img className="icon icon-hover" src={require("./img/edit1.svg").default} alt="" />
                </span>
                <span onClick={() => handleNavigation(ele)} style={{ cursor: "pointer" }}>
                    <img className="icon icon-hover" src={require("./img/edit2.svg").default} alt="" />
                </span>
            </div>)
            return ele
        })

    }, [users, navigate, setUserInfo])

    //Dislay default user
    useEffect(() => {
        if (userName === "" && name === "" && (nomalize(type) === nomalize("Loại độc giả")) && createdDate === "")
            setUsers(userAPI)
    }, [userName, name, type, createdDate, userAPI])

    //Handle clickSearch
    function handleClickSearch() {
        const date = new Date(createdDate).toLocaleDateString('pt-PT')
        const newUser = userAPI.filter((ele) => {
            return (userName === "" || nomalize(ele.username).includes(nomalize(userName))) &&
                (name === "" || nomalize(ele.name).includes(nomalize(name))) &&
                (type === "" || type === ele.type || type === "Loại độc giả") &&
                (createdDate === "" || date === ele.created)
        }
        )
        setUsers(newUser)
    }
    //Hanlde click Remove users
    function handleClickRemove() {
        if (selectedUsers.length === 0)
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
    function handleClickAdd() {
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "flex"
        const addTable = document.querySelector(".add-table-user")
        addTable.style.display = "flex"
    }
    //Handle clear Rows
    const handleClearRows = () => {
        setToggleClearRows(!toggledClearRows);
    }

    //Hanlde selected Books
    const handleSelectedUsers = () => {
        setSelectedUsers([])
    }
    return (<div className="home-page">
        <AcceptRemove
            listAPI={userAPI}
            setListAPI={setUserAPI}
            selected={selectedUsers || []}
            handleClearRows={handleClearRows}
            handleSelected={handleSelectedUsers}
            fetchLink={"https://library2.herokuapp.com/users/user/"}
            ele={"userId"}
            access_token={token}
        />
        <AddUser
            userAPI={userAPI}
            setUserAPI={setUserAPI}
            token={token}
        >
        </AddUser>
        <UserInfo
            userAPI={userAPI}
            setUserAPI={setUserAPI}
            ele={userInfo}
            setUserInfo={setUserInfos}
        ></UserInfo>
        <div className="main-title">
            <span>ĐỘC GIẢ</span>
        </div>
        <div className="main-content">
            <div className="search-tool" style={{ margin: "20px auto 12.5px" }}>
                <input
                    className="input"
                    placeholder="Tên đăng nhập"
                    type="text"
                    id="user"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                />
                <input
                    className="input"
                    placeholder="Tên độc giả"
                    type="text"
                    id="user-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <Selection
                    genres={["X", "Y"]}
                    title="Loại độc giả"
                    value={type}
                    SET={setType}
                    ID="type-select"
                ></Selection>
                <input
                    onFocus={e => e.target.type = "date"}
                    onBlur={e => e.target.type = "text"}
                    className="input"
                    placeholder="Ngày lập thẻ"
                    type="text"
                    id="created-date"
                    value={createdDate}
                    onChange={e => setCreatedDate(e.target.value)}
                />
                <button onClick={handleClickSearch}>Tra cứu</button>
            </div>
            <div className="handle-tool">
                <button className="handle-add" onClick={handleClickAdd}>Thêm thẻ độc giả</button>
                <button className="handle-dele" onClick={handleClickRemove}>Xóa</button>
            </div>
            <div className="data-table">
                <DataTable
                    columns={columns}
                    data={users}
                    fixedHeader={"true"}
                    fixedHeaderScrollHeight="100%"
                    customStyles={CustomStyle}
                    selectableRows
                    onSelectedRowsChange={(selected) => setSelectedUsers(selected.selectedRows)}
                    clearSelectedRows={toggledClearRows}
                />
            </div>
        </div>
    </div>)
}