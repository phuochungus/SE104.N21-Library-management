import './signUp_page.scss'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import alert from '../components/alert'
import success from '../components/success'

export default function SignUpPage() {
    const navigate = useNavigate();

    async function HandleClick() {
        const signUp = document.querySelector(".sign-up")

        signUp.style.cursor = "wait"
        if (name === "" || email === "" || address === "" || user === "" || pass === "" || birth === "") {
            alert("Thông tin không được để trống")
            signUp.style.cursor = "pointer"
        }
        else if (pass.length < 8) {
            alert("Mật khẩu phải có ít nhất 8 ký tự")
            signUp.style.cursor = "pointer"
        }
        else {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: user,
                    password: pass,
                    email: email,
                    name: name,
                    birth: birth,
                    address: address
                })
            }
            await fetch('https://library2.herokuapp.com/users/', option)
                .then(res => {
                    if (res.status === 409 || res.status === 400)
                        return res.json()
                    else {
                        success("Đăng ký tài khoản thành công")
                        navigate("/SignIn")
                    }
                }
                )
                .then(async res => {
                    if (res) {
                        if (Array.isArray(res.message))
                            res.mes = "Định dạng Email không hợp lệ";
                        else {
                            switch (res.message) {
                                case "Username is already taken": res.mes = "Tên tài khoản đã tồn tại"; break;
                                case "Email or username already taken": res.mes = "Email đã được sử dụng"; break;
                                case "User age not available": res.mes = "Tuổi không phù hợp để đăng ký"; break;
                                default: break;
                            }
                        }
                        alert(res.mes)
                    }
                })
            signUp.style.cursor = "pointer"

        }

    }

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [user, setUser] = useState("")
    const [pass, setPass] = useState("")
    const [birth, setBirth] = useState("")

    return (
        <div className="body-app"><div className="sign-up-container">
            <div className="form-name">ĐĂNG KÝ</div>
            <form action="" className="form-2">
                <input
                    className="info"
                    placeholder="Họ và tên"
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="different">
                    <input
                        style={{ textIndent: "5px" }}
                        className="info-2"
                        placeholder="Ngày sinh"
                        type="date"
                        id="birth"
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
                    />
                    <input
                        className="info-2"
                        placeholder="Email"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <input
                    className="info"
                    placeholder="Địa chỉ"
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <input
                    className="info"
                    placeholder="Tên đăng nhập"
                    type="text"
                    id="user"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <input
                    className="info"
                    placeholder="Mật khẩu"
                    type="text"
                    id="pass"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                />
            </form>
            <div className="pass-required">Mật khẩu phải có ít nhất 8 ký tự</div>
            <div className="sign-up" onClick={HandleClick}>Đăng ký</div>
            <div className="sign-in">
                <span>Bạn đã có tài khoản?</span>
                <Link to="/SignIn">Đăng nhập</Link>
            </div>
        </div>
        </div>
    )
} 