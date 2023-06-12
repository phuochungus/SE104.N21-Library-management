import './changePass.scss'
import { NavLink } from 'react-router-dom'
import { useState, useContext } from "react"
import alert from '../../components/alert'
import { AppContext } from '../../../App'
import success from '../../components/success'

export default function Info() {
    const { userInfo, isAdmin, adminInfo } = useContext(AppContext)

    const [cur, setCur] = useState("")
    const [newPass, setNewPass] = useState("")
    const [again, setAgain] = useState("")

    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)

    async function handleClickChange() {
        const change = document.querySelector('.pass-page .add-btn-Change')
        change.style.cursor = "wait"

        if (cur === "" || newPass === "" || again === "")
            alert("Thông tin không được để trống")
        else if (newPass.length < 8)
            alert("Mật khẩu mới phải có ít nhất 8 ký tự")
        else if (newPass !== again)
            alert("Mật khẩu mới không khớp")
        else {
            const option = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: isAdmin ? adminInfo.username : userInfo.username,
                    password: cur,
                    newPassword: newPass,
                })
            }
            await fetch(`https://library2.herokuapp.com/users/password/`, option)
                .then(res => {
                    if (res.status === 409)
                        return res.json()
                })
                .then(async res => {
                    if (res) {
                        switch (res.message) {
                            case "New password can not be same as old password": res.mes = "Mật khẩu mới phải khác mật khẩu hiện tại"; break;
                            case "Password not correct": res.mes = "Mật khẩu hiện tại không chính xác"; break;
                            default: break;
                        }
                        alert(res.mes)
                    }
                    else {
                        success("Đổi mật khẩu thành công")
                        setCur("")
                        setNewPass("")
                        setAgain("")
                    }
                })
        }
        change.style.cursor = "pointer"

    }


    return (<div className="pass-page">
        <div className="forgot-password">
            <div className="title">
                THAY ĐỔI MẬT KHẨU
            </div>
            <div className="current-pass">
                <span>Nhập mật khẩu hiện tại</span>
                <input
                    placeholder="Nhập mật khẩu hiện tại..."
                    type={show1 ? "text" : "password"}
                    value={cur}
                    onChange={(e) => setCur(e.target.value)}
                ></input>
                <span className="pass_option" onClick={() => setShow1(cur => !cur)}>
                    {show1 ? <img className="icon" src={require("./img/show.svg").default} alt="" /> :
                        <img className="icon" src={require("./img/hide.svg").default} alt="" />
                    }
                </span>
            </div>
            <div className="new-pass">
                <span>Nhập mật khẩu mới</span>
                <input
                    placeholder="Nhập mật khẩu mới..."
                    type={show2 ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                ></input>
                <span className="pass_option" onClick={() => setShow2(cur => !cur)}>
                    {show2 ? <img className="icon" src={require("./img/show.svg").default} alt="" /> :
                        <img className="icon" src={require("./img/hide.svg").default} alt="" />
                    }
                </span>
            </div>
            <div className="new-pass-confirm">
                <span>Nhập lại mật khẩu mới</span>
                <input
                    placeholder="Nhập lại mật khẩu mới..."
                    type={show3 ? "text" : "password"}
                    value={again}
                    onChange={(e) => setAgain(e.target.value)}
                ></input>
                <span className="pass_option" onClick={() => setShow3(cur => !cur)}>
                    {show3 ? <img className="icon" src={require("./img/show.svg").default} alt="" /> :
                        <img className="icon" src={require("./img/hide.svg").default} alt="" />
                    }
                </span>
            </div>
            <div className="ending-row">
                <NavLink className="close-btn-Change" to="/Account" >Quay lại</NavLink>
                <div className="add-btn-Change" onClick={handleClickChange}><span>Đổi mật khẩu</span></div>
            </div>
        </div>
    </div>)
}