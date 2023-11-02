import './BorrowCard.scss'
import { NavLink } from 'react-router-dom'
import BorrowCard from '../../components/borrowCard'
import { useContext } from 'react'
import { AppContext } from '../../../App'

export default function BorrowCardPage() {
    const { BRInfo, userInfo } = useContext(AppContext)

    return (<div className="borrow-card-page">
        <div className="user-info">
            <span className="tittle">THÔNG TIN ĐỘC GIẢ</span>
            <div className="info-row">
                <span>Tên độc giả</span>
                <input
                    className="input "
                    type="text"
                    defaultValue={userInfo.name}
                ></input>
            </div>
            <div className="info-row">
                <span>Tên đăng nhập</span>
                <input
                    className="input "
                    type="text"
                    defaultValue={userInfo.username}
                ></input>
            </div>
            <div className="info-row">
                <span>Số lượng sách</span>
                <input
                    className="input "
                    type="text"
                    defaultValue={BRInfo.length}
                ></input>
            </div>
        </div>
        <div className="borrow-card">
            <span className="tittle">PHIẾU MƯỢN SÁCH</span>
            <NavLink to={userInfo.quantity ? "/Service/Borrow" : "/Service/BRSlip"}><img className="icon icon-hover" src={require("./img/return.svg").default} alt="" /></NavLink>
            <div className="cards">
                {BRInfo.map((ele, index) => (<BorrowCard key={index} ele={ele} index={index}></BorrowCard>))}
            </div>
        </div>
    </div>)
}