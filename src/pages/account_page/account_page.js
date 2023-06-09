import './account_page.scss'
import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../App'

export default function AccountPage() {
    const { isAdmin } = useContext(AppContext)

    return (<div className="account-page">
        {(isAdmin) || <NavLink className="option" to="/Account/Cart"><img className="icon" src={require("./img/cart.svg").default} alt="" />GIÁ SÁCH CỦA TÔI</NavLink>}
        <NavLink className="option" to={isAdmin ? "/Account/AdminInfo" : "/Account/Info"}><img className="icon" src={require("./img/info.svg").default} alt="" />THÔNG TIN TÀI KHOẢN</NavLink>
        <NavLink className="option" to="/Account/ChangePass"><img className="icon" src={require("./img/change.svg").default} alt="" />ĐỔI MẬT KHẨU</NavLink>
    </div>)
}