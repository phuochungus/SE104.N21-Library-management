import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from './App'

export default function AcceptSignOut() {
    const { setIsLoggedIn, setAdmin, isAdmin } = useContext(AppContext);
    const navigate = useNavigate();

    function handleClickReject() {
        const acceptTable = document.querySelector(".accept-signout")
        acceptTable.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"
    }
    function handleClickAccept() {
        const acceptTable = document.querySelector(".accept-signout")
        acceptTable.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"
        if (isAdmin) setAdmin(cur => !cur)
        setIsLoggedIn(cur => !cur);
        navigate('/SignIn');
    }

    return (<div className="accept-signout">
        <div className="accept-title">Đăng xuất khỏi tài khoản của bạn?</div>
        <div className="accept-reject">
            <button className="reject-btn" onClick={handleClickReject}>Hủy bỏ</button>
            <button className="accept-btn" onClick={handleClickAccept}>Đăng xuất</button>
        </div>
    </div>)
}