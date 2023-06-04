import './account_page'
import { useState, useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../../App'
import nomalize from '..//components/nomalize'
import alert from '../components/alert'

export default function AdminInfo() {
    const { token, adminInfo, setAdminInfo } = useContext(AppContext);

    //Info-user
    const [user, setUser] = useState(adminInfo.username)
    const [name, setName] = useState(adminInfo.name)
    const [birth, setBirth] = useState(adminInfo.birth)
    const [email, setEmail] = useState(adminInfo.email)
    const [address, setAddress] = useState(adminInfo.address)
    const [valid, setValid] = useState(new Date(adminInfo.validUntil).toLocaleDateString('pt-PT'))

    const [enableEdit, setEnableEdit] = useState(false)


    useEffect(() => {
        setUser(adminInfo.username)
        setName(adminInfo.name)
        setBirth(new Date(adminInfo.birth).toLocaleDateString('fr-CA'))
        setAddress(adminInfo.address)
        setValid(new Date(adminInfo.validUntil).toLocaleDateString('pt-PT'))
        setEmail(adminInfo.email)
    }, [adminInfo])

    useEffect(() => {
        if (enableEdit === false) {
            const pointerEvents = document.querySelectorAll(".info-page input")
            for (const ele of pointerEvents)
                ele.style.pointerEvents = "none"
        }
    }, [enableEdit])

    //Handle Click Edit
    async function handleClickEdit() {
        const addBtn = document.querySelector(".info-page .add-btn-Edit")
        const refreshBtn = document.querySelector(".info-page .refresh-btn-Edit")
        const pointerEvents = document.querySelectorAll(".info-page .able-change")

        if (nomalize(addBtn.innerText) === nomalize("Chỉnh sửa")) {
            setEnableEdit(cur => !cur)

            for (const ele of pointerEvents)
                ele.style.pointerEvents = "auto"

            refreshBtn.style.display = "flex"
            addBtn.innerHTML = "Lưu thông tin"
        }
        else {
            addBtn.style.cursor = "wait"

            if (name === "" || birth === "" || email === "" || address === "") {
                alert("Thông tin không được bỏ trống")
                addBtn.style.cursor = "pointer"
            }
            else if (!email.includes("@")) {
                alert("Định dạng Email phải có @")
                addBtn.style.cursor = "pointer"
            }
            else {
                const option = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        username: user,
                        email: email,
                        name: name,
                        birth: birth,
                        address: address,
                    })
                }
                await fetch(`https://library2.herokuapp.com/users/me/`, option)
                    .then(res => {
                        if (res.status === 409)
                            return res.json()
                    })
                    .then(async res => {
                        if (res) {
                            switch (res.message) {
                                case "Username or email already taken": res.mes = "Email đã được sử dụng"; break;
                                case "User age not available": res.mes = "Tuổi chưa phù hợp"; break;
                                default: break;
                            }
                            alert(res.mes)
                            addBtn.style.cursor = "pointer"
                        } else {
                            setEnableEdit(cur => !cur)
                            for (const ele of pointerEvents)
                                ele.style.pointerEvents = "none"

                            addBtn.style.cursor = "pointer"
                            refreshBtn.style.display = "none"
                            addBtn.innerHTML = "Chỉnh sửa"
                            setAdminInfo({
                                ...adminInfo,
                                email: email,
                                name: name,
                                birth: birth,
                                address: address,
                            })
                        }
                    }
                    )
            }

        }
    }


    return (
        <div className="info-page">
            <div className="info-User">
                <div className="table-title">THÔNG TIN TÀI KHOẢN</div>
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
                <div className="info-row">
                    <span>Họ tên</span>
                    <input
                        className="able-change"
                        placeholder="Họ tên"
                        type="text"
                        value={name}
                        onChange={e => {
                            if (enableEdit)
                                setName(e.target.value)
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
                            }}
                        ></input>
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
                        }}
                    ></input>
                </div>
                <div className="info-row">
                    <span>Ngày hết hạn</span>
                    <input
                        placeholder="Ngày hết hạn"
                        type="text"
                        defaultValue={valid}
                    ></input>
                </div>
                <div className="ending-row">
                    <NavLink className="close-btn-Edit" to="/Account" >Quay lại</NavLink>
                    <div className="refresh-btn-Edit" onClick={e => setAdminInfo({ ...adminInfo })}>Hoàn tác</div>
                    <div className="add-btn-Edit" onClick={handleClickEdit}><span>Chỉnh sửa</span></div>
                </div>
            </div>
        </div>
    )
}