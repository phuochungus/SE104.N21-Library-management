import './resetPass.scss'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import alert from '../components/alert'
import success from '../components/success'


export default function ResetPassPage() {
    const [user, setUser] = useState("")
    const [mail, setMail] = useState("")

    async function handleClick() {
        const reset = document.querySelector(".reset-option")

        reset.style.cursor = "wait"

        if (user === "" || mail === "") {
            alert("Thông tin không được để trống")
            reset.style.cursor = "pointer"
        }
        else if (!mail.includes("@")) {
            alert("Định dạng Email không hợp lệ")
            reset.style.cursor = "pointer"
        }
        else {
            const option = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: mail,
                    username: user
                })

            }
            await fetch('https://library2.herokuapp.com/users/password_reset/', option)
                .then(res => { if (res.status === 404) return res.json() })
                .then(async res => {
                    if (res) {
                        switch (res.message) {
                            case "Not found account with provided username and email": res.mes = "Không tìm thấy tài khoản"; break;
                            default: break;
                        }
                        alert(res.mes)
                    }
                    else {
                        success("Mật khẩu mới đã được gửi tới email")
                    }
                })
            reset.style.cursor = "pointer"

        }
    }
    return (<div className="body-app">
        <div className="reset-container">
            <div className="form-name">QUÊN MẬT KHẨU</div>
            <div className="form-require">Nhập tên đăng nhập và email của bạn để nhận mật khẩu mới</div>
            <div className="info-row">
                <span>Tên đăng nhập</span>
                <input
                    placeholder="Tên đăng nhập"
                    className="input"
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                ></input>
            </div>
            <div className="info-row">
                <span>Email</span>
                <input
                    placeholder="Email"
                    className="input"
                    type="text"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                ></input>
            </div>
            <div className="btn-option">
                <Link className="return-option" to="/SignIn">Quay lại đăng nhập</Link>
                <div className="reset-option" onClick={handleClick}>Nhận mật khẩu</div>
            </div>
            <div className="ending-row">Nếu bạn không thể nhớ email đã đăng ký, hãy <Link className="go-signUp" to="/SignUp">Đăng ký</Link>
                ngay bây giờ</div>
        </div>
    </div >)
}