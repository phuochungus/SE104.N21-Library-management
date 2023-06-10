import './setting_page.scss'
import { useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import UserSettingPage from './userSetting/userSetting'
import BookSettingPage from './bookSetting/bookSetting'
import BRBookSettingPage from './BRBookSetting/BRBookSetting'

export default function SettingPage() {
    //define navigate
    const navi = useNavigate()
    const cur = window.location.pathname

    //default /Setting/Users
    useEffect(() => {
        if (cur === "/Setting")
            navi("/Setting/Users")
    }, [navi, cur])

    return (<div className="setting-page">
        <div className="main-title">
            <span>TÙY CHỈNH</span>
        </div>
        <div className="options">
            <NavLink className="option" to="/Setting/Users">THÔNG TIN THẺ ĐỘC GIẢ</NavLink>
            <NavLink className="option" to="/Setting/Books">THÔNG TIN SÁCH</NavLink>
            <NavLink className="option" to="/Setting/BRBooks">THÔNG TIN MƯỢN/TRẢ SÁCH</NavLink>
        </div>
        <Routes>
            <Route path="/Users" element={<UserSettingPage />}></Route>
            <Route path="/Books" element={<BookSettingPage />}></Route>
            <Route path="/BRBooks" element={<BRBookSettingPage />}></Route>
        </Routes>
    </div>)
}