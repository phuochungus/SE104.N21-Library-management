import './ReturnCard.scss'
import { NavLink } from 'react-router-dom'
import ReturnCard from '../../components/returnCard'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../../App'
import { Print } from '../../components/print'

export default function ReturnCardPage() {
    const { BRInfo, userInfo, token } = useContext(AppContext)
    const [user, setUser] = useState({})
    const [API, setAPI] = useState(false)

    useEffect(() => {
        fetch(`https://library2.herokuapp.com/users/user/${userInfo.userId}/`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(user => setUser(user))
    }, [API, token, userInfo.userId])

    function handleClickCollect() {
        const printInfo = document.querySelector(".print-info")
        printInfo.style.display = "flex"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "flex"
    }

    function handleNavi() {
        if (userInfo.quantity)
            return "/Service/Return"
        else if (userInfo.brn)
            return "/Service/BRHistory/UserHistory"
        else return "/Service/BRSlip"
    }

    return (<div className="return-card-page">
        <Print
            userInfo={userInfo}
            user={user}
            setAPI={setAPI}
        ></Print>
        <div className="all-info">
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
            <div className="fine-info">
                <span className="tittle">THÔNG TIN TIỀN PHẠT</span>
                <div className="row-info">
                    <div className="info-row">
                        <span>Tiền phạt kỳ này</span>
                        <input
                            className="input "
                            type="text"
                            defaultValue={BRInfo.reduce((pre, ele) => pre + ele.fine, 0)}
                        ></input>
                    </div>
                    <div className="par-value">đồng</div>

                </div>
                <div className="total-fine">
                    <div className="fine-tittle">TỔNG NỢ: </div>
                    <input
                        className="fine-value"
                        type="text"
                        defaultValue={user.totalDebt}
                    ></input>
                    <span className="par-value">đồng</span>
                </div>
                <div className="ending-row">
                    <div className="make-card" onClick={handleClickCollect}>Lập phiếu thu</div>
                    <div className="print">In phiếu thu</div>
                </div>
            </div>
        </div>
        <div className="borrow-card">
            <span className="tittle">PHIẾU TRẢ SÁCH</span>
            <NavLink to={handleNavi()}><img className="icon icon-hover" src={require("./img/return.svg").default} alt="" /></NavLink>
            <div className="cards">
                {BRInfo.map((ele, index) => (<ReturnCard key={index} ele={ele} index={index}></ReturnCard>))}
            </div>
        </div>
    </div>)
}