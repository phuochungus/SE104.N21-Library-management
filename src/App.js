import './App.scss';
import { Routes, Route, Navigate } from 'react-router-dom'
import { createContext, useState } from 'react'
import Main from './Main'
import SignInPage from './pages/signIn_page/signIn_page'
import SignUpPage from './pages/signUp_page/signUp_page'
import ResetPassPage from './pages/resetPass_page/resetPass'

export const AppContext = createContext();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isAdmin, setAdmin] = useState(false)
    const [token, setToken] = useState("")
    const [userInfo, setUserInfo] = useState({})
    const [adminInfo, setAdminInfo] = useState({})
    const [BRInfo, setBRInfo] = useState([])

    function handleClickClose(e) {
        const div = e.target.parentElement;
        div.style.opacity = "0";
        setTimeout(() => div.style.display = "none", 600)
    }

    return (
        <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setAdmin, token, setToken, userInfo, setUserInfo, BRInfo, setBRInfo, adminInfo, setAdminInfo }}>
            <Routes>
                <Route path="*" element={isLoggedIn ? (<Main />) : <Navigate to="/SignIn" />}></Route>
                <Route path="/SignIn" element={<SignInPage />}></Route>
                <Route path="/SignUp" element={<SignUpPage />}></Route>
                <Route path="/ResetPass" element={<ResetPassPage />}></Route>
            </Routes>
            <div style={{ "color": "#8F3034" }} className="alert">
                <div className="warning-icon">
                    <img
                        src={require("./assets/icons/warning.svg").default}
                        alt=""
                    />
                </div>
                <span style={{ "width": "350px" }} className="content-bar"><span style={{ "fontWeight": "1000" }}>Lỗi! </span><span className="content">t might need attention.</span></span>
                <span onClick={(e) => handleClickClose(e)} className="closebtn">&times;</span>
            </div>
            <div style={{ "color": "#8F3034" }} className="success">
                <div className="success-icon">
                    <img
                        src={require("./assets/icons/done.svg").default}
                        alt=""
                    />
                </div>
                <span style={{ "width": "250px" }} className="content-bar"><span style={{ "fontWeight": "1000" }}></span><span className="content">t might need attention.</span></span>
                <span onClick={(e) => handleClickClose(e)} className="closebtn">&times;</span>
            </div>
        </AppContext.Provider >
    );
}
export default App;

