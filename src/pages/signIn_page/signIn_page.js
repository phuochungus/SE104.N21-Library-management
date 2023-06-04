import './signIn_page.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AppContext } from '../../App'
import alert from '../components/alert'

export default function SignInPage() {
    const [user, setUser] = useState("")
    const [pass, setPass] = useState("")
    const [show, setShow] = useState(false)

    const { setIsLoggedIn, setAdmin, setToken, setUserInfo, setAdminInfo } = useContext(AppContext);

    const navigate = useNavigate();

    async function HandleSignIn() {
        const enter = document.querySelector(".enter button")
        enter.style.cursor = "wait"

        if (user === "" || pass === "") {
            alert("Thông tin không được để trống")
            enter.style.cursor = "pointer"
        }
        else {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: user,
                    password: pass
                })
            }
            await fetch('https://library2.herokuapp.com/auth/login/', option)
                .then(response => response.json())
                .then(data => {
                    if (data.access_token) {
                        if (user === "admin") {
                            fetch("https://library2.herokuapp.com/users/me/", {
                                headers: {
                                    'Authorization': 'Bearer ' + data.access_token
                                }
                            }).then(response => response.json())
                                .then(info => setAdminInfo(info))
                            setAdmin(cur => !cur)
                        }
                        else {
                            fetch("https://library2.herokuapp.com/users/me/", {
                                headers: {
                                    'Authorization': 'Bearer ' + data.access_token
                                }
                            }).then(response => response.json())
                                .then(info => setUserInfo(info))
                        }

                        setIsLoggedIn(cur => !cur)
                        setToken(data.access_token)
                        navigate('/')
                    }
                    else
                        alert("Tên đăng nhập hoặc mật khẩu không chính xác")
                })
            enter.style.cursor = "pointer"

        }

    }

    return (
        <div className="body-app">
            <div className="sign-in-container">
                <div className="form-name">ĐĂNG NHẬP</div>
                <form action="" className="form-1">
                    <div className="row">
                        <img className="icon" src={require("./img/sign-in.svg").default} alt="" />
                        <input
                            className="input"
                            placeholder="Tên đăng nhập"
                            type="text"
                            id="username"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </div>
                    <div className="row">
                        <img className="icon" src={require("./img/pass.svg").default} alt="" />
                        <input
                            className="input"
                            placeholder="Mật khẩu"
                            type={show ? "text" : "password"}
                            id="password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                        <span className="pass_option" onClick={() => setShow(cur => !cur)}>
                            {show ? <img className="icon" src={require("./img/show.svg").default} alt="" /> :
                                <img className="icon" src={require("./img/hide.svg").default} alt="" />
                            }
                        </span>
                    </div>
                </form>
                <div className="password">
                    <Link className="forget" to="/ResetPass">Quên mật khẩu?</Link>
                </div>
                <div className="enter"><button onClick={HandleSignIn}>Đăng nhập</button></div>
                <div className="sign-up">
                    <span>Bạn chưa có tài khoản?</span>
                    <Link to="/SignUp">Đăng ký</Link>
                </div>
            </div>
        </div >)
}