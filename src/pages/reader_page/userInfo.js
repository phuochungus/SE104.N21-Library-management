import { Selection } from '../components/select'
import { useState, useEffect, useContext } from "react"
import nomalize from '..//components/nomalize'
import { AppContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import alert from '../components/alert'

export function UserInfo(props) {
    const { token, setUserInfo } = useContext(AppContext);
    const [enableEdit, setEnableEdit] = useState(false)
    const navigate = useNavigate()

    //Info-user
    const [userName, setUserName] = useState("")
    const [user, setUser] = useState("")
    const [birth, setBirth] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [readerType, setReaderType] = useState("")
    const [createdDate, setCreatedDate] = useState("")

    const addBtn = document.querySelector(".info-table-user .add-btn-Edit")
    const refreshBtn = document.querySelector(".info-table-user .refresh-btn-Edit")
    const historyCheck = document.querySelector(".info-table-user .history-check")

    useEffect(() => {
        setUserName(props.ele.name)
        setUser(props.ele.username)
        setBirth(new Date(props.ele.birth).toLocaleDateString('fr-CA'))
        setEmail(props.ele.email)
        setAddress(props.ele.address)
        setReaderType(props.ele.type)
        setCreatedDate(new Date(props.ele.createdDate).toLocaleDateString('fr-CA'))
    }, [props.ele.name, props.ele.username, props.ele.birth, props.ele.email, props.ele.address, props.ele.type, props.ele.createdDate, props.ele])

    useEffect(() => {
        if (enableEdit === false) {
            const pointerEvents = document.querySelectorAll(".info-table-user input")
            const poinerReaderType = document.querySelector(".info-table-user .drop-btn")
            poinerReaderType.style.pointerEvents = "none"

            for (const ele of pointerEvents)
                ele.style.pointerEvents = "none"
        }
    }, [enableEdit])

    function handleClickClose() {
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"
        const infoTable = document.querySelector(".info-table-user")
        infoTable.style.display = "none"
        const dropcontent = document.querySelector(".info-table-user .drop-down-content")
        dropcontent.style.display = "none"

        if (enableEdit) {
            historyCheck.style.display = "flex"
            refreshBtn.style.display = "none"
            addBtn.innerHTML = "Chỉnh sửa"
            addBtn.style.width = "100px"
            setEnableEdit(cur => !cur)
        }
        props.setUserInfo({ ...props.ele })
    }
    //Handle Click Edit
    async function handleClickEdit() {
        const pointerEvents = document.querySelectorAll(".info-table-user .able-change")
        const poinerReaderType = document.querySelector(".info-table-user .drop-btn")


        if (nomalize(addBtn.innerText) === nomalize("Chỉnh sửa")) {
            setEnableEdit(cur => !cur)

            historyCheck.style.display = "none"
            poinerReaderType.style.pointerEvents = "auto"
            for (const ele of pointerEvents)
                ele.style.pointerEvents = "auto"

            addBtn.style.width = "200px"
            refreshBtn.style.display = "flex"
            addBtn.innerHTML = "Lưu thông tin"
        }
        else {
            addBtn.style.cursor = "wait"

            if (userName === "" || user === "" || birth === "" || email === "" || address === "" || readerType === "Loại độc giả") {
                alert("Thông tin không được bỏ trống")
                addBtn.style.cursor = "pointer"
            }
            else if (!email.includes("@")) {
                alert("Định dạng Email phải có @")
                addBtn.style.cursor = "pointer"
            }
            else {
                //handle save
                const option = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify({
                        username: user,
                        email: email,
                        name: userName,
                        birth: birth,
                        address: address,
                        type: readerType
                    })
                }
                await fetch(`https://library2.herokuapp.com/users/user/${props.ele.userId}`, option)
                    .then(res => {
                        if (res.status === 409)
                            return res.json()
                    }
                    )
                    .then(async res => {
                        if (res) {
                            switch (res.message) {
                                case "Username or email already taken": res.mes = "Email đã được sử dụng"; break;
                                case "User age not available": res.mes = "Tuổi chưa phù hợp"; break;
                                default: break;
                            }
                            alert(res.mes)
                            addBtn.style.cursor = "pointer"
                        }
                        else {
                            const arr = props.userAPI.map((ele, index) => {
                                if (ele.userId === props.ele.userId) {
                                    return {
                                        ...props.userAPI[index],
                                        username: user,
                                        email: email,
                                        name: userName,
                                        birth: birth,
                                        address: address,
                                        type: readerType
                                    }
                                }
                                else return ele
                            })
                            props.setUserAPI(arr)

                            //prevent edit
                            setEnableEdit(cur => !cur)
                            for (const ele of pointerEvents)
                                ele.style.pointerEvents = "none"
                            poinerReaderType.style.pointerEvents = "none"

                            //display
                            historyCheck.style.display = "flex"
                            refreshBtn.style.display = "none"
                            addBtn.innerHTML = "Chỉnh sửa"
                            addBtn.style.width = "100px"
                            addBtn.style.cursor = "pointer"

                        }
                    })
            }
        }

    }

    //handle Refresh
    async function handleClickRefresh() {
        const refresh = document.querySelector(".info-table-user .refresh-btn-Edit")
        refresh.style.cursor = "wait"

        await fetch(`https://library2.herokuapp.com/users/user/${props.ele.userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then(res => res.json())
            .then(user => {
                props.setUserInfo({
                    ...props.ele,
                    name: user.name, username: user.username, birth: user.birth,
                    email: user.email, address: user.address, type: user.type
                }
                )
            })
        refresh.style.cursor = "pointer"
    }

    function handleClickHistory() {
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"
        const infoTable = document.querySelector(".info-table-user")
        infoTable.style.display = "none"
        const dropcontent = document.querySelector(".info-table-user .drop-down-content")
        dropcontent.style.display = "none"
        setUserInfo(props.ele)
        navigate("/Service/BRHistory/UserHistory")
    }
    //Render UI
    return (
        <div className="info-table-user">
            <div className="table-title">THẺ ĐỘC GIẢ</div>
            <div className="info-row">
                <span>Họ tên độc giả</span>
                <input
                    className="able-change"
                    placeholder="Họ tên độc giả"
                    type="text"
                    value={userName}
                    onChange={e => {
                        if (enableEdit)
                            setUserName(e.target.value)
                        else return e.target.value
                    }}
                ></input>
            </div>
            <div className="info-row">
                <span>Tên đăng nhập</span>
                <input
                    placeholder="Tên đăng nhập"
                    type="text"
                    value={user}
                    onChange={e => {
                        if (enableEdit)
                            setUser(e.target.value)
                        else return e.target.value
                    }}
                ></input>
            </div>
            <div className="differ-1">
                <div className="info-row">
                    <span>Ngày sinh</span>
                    <input
                        className="able-change"
                        style={{ "width": "150px", "textIndent": "6px" }}
                        placeholder="Ngày sinh"
                        type="date"
                        value={birth}
                        onChange={e => {
                            if (enableEdit)
                                setBirth(e.target.value)
                            else return e.target.value
                        }}></input>
                </div>
                <div className="info-row row-2">
                    <span>Email</span>
                    <input
                        className="able-change"
                        style={{ "width": "335px" }}
                        placeholder="Email"
                        type="text"
                        value={email}
                        onChange={e => {
                            if (enableEdit)
                                setEmail(e.target.value)
                            else return e.target.value
                        }}
                    ></input>
                </div>
            </div>
            <div className="info-row">
                <span>Địa chỉ</span>
                <input
                    className="able-change"
                    placeholder="Địa chỉ"
                    type="text"
                    value={address}
                    onChange={e => {
                        if (enableEdit)
                            setAddress(e.target.value)
                        else return e.target.value
                    }}></input>
            </div>
            <div className="differ-1">
                <div className="info-row special-row" >
                    <span>Ngày lập thẻ</span>
                    <input
                        style={{
                            "width": "150px", "textIndent": "6px",
                        }}
                        placeholder="Ngày lập thẻ"
                        type="date"
                        defaultValue={createdDate}
                    ></input>
                </div>
                <div className="info-row row-2">
                    <span>Loại độc giả</span>
                    <Selection
                        genres={["X", "Y"]}
                        title="Loại độc giả"
                        value={readerType || ""}
                        SET={setReaderType}
                        ID="readerType-selected">
                    </Selection>
                </div>
            </div>
            <div className="ending-row">
                <div className="close-btn-Edit" onClick={handleClickClose}><span>Đóng</span></div>
                <div className="history-check" onClick={handleClickHistory}><span>Kiểm tra lịch sử mượn/trả</span></div>
                <div className="refresh-btn-Edit" onClick={handleClickRefresh} >Hoàn tác</div>
                <div className="add-btn-Edit" onClick={handleClickEdit}><span>Chỉnh sửa</span></div>
            </div>
        </div>)
}