import './components.scss'
import { useState, useEffect } from 'react'
import alert from './alert'

export function Print(props) {
    const [money, setMoney] = useState("")
    const [less, setLess] = useState("")

    useEffect(() => {
        setMoney(props.user.totalDebt)
        setLess(0)
    }, [props])

    async function handleClickSave(e) {
        if (money === "")
            alert("Thông tin không được bỏ trống")
        else if (isNaN(Number(money)) || Number(money) < 0 || Number(money) > props.user.totalDebt)
            alert("Số tiền thu không hợp lệ")
        else {
            e.target.style.cursor = "wait"
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: props.user.userId,
                    pay: Number(money)
                })
            }
            await fetch('https://library2.herokuapp.com/fine_receipts/', option)

            const printInfo = document.querySelector(".print-info")
            printInfo.style.display = "none"
            const overLay = document.querySelector("#overlay")
            overLay.style.display = "none"
            e.target.style.cursor = "pointer"

            props.setAPI(cur => !cur)
            setMoney(props.user.totalDebt)
            setLess(0)
        }
    }

    function handleClickClose() {
        const printInfo = document.querySelector(".print-info")
        printInfo.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"
        setMoney(props.user.totalDebt)
        setLess(0)
    }

    //Render UI
    return (
        <div className="print-info">
            <div className="print-title">
                <div className="row-1">
                    <div className="title">
                        PHIẾU THU TIỀN PHẠT
                    </div>
                    <span >Ngày lập phiếu: </span>
                    <input className="input" type="text"
                        defaultValue={new Date().toLocaleDateString('pt-PT')}
                    ></input>
                </div>
                <div className="row-2">
                    <div className="info-row">
                        <span>Tên độc giả</span>
                        <input
                            className="input "
                            type="text"
                            defaultValue={props.userInfo.name}
                        ></input>
                    </div>
                    <div className="info-row">
                        <span>Tên đăng nhập</span>
                        <input
                            style={{ "width": "200px" }}
                            className="input "
                            type="text"
                            defaultValue={props.userInfo.username}
                        ></input>
                    </div>
                </div>
            </div>
            <div className="money">
                <div className="left-side">
                    <div className="par">
                        <div className="info-row">
                            <span>Tổng nợ</span>
                            <input
                                style={{ "pointerEvents": "none" }}
                                className="input "
                                type="text"
                                defaultValue={props.user.totalDebt}
                            ></input>
                        </div>
                        <span className="dong">đồng</span>
                    </div>
                    <div className="par">
                        <div className="info-row">
                            <span>Số tiền thu</span>
                            <input
                                className="input "
                                placeholder="Số tiền thu"
                                type="text"
                                value={money}
                                onChange={(e) => {
                                    setMoney(e.target.value)
                                    setLess(props.user.totalDebt - Number(e.target.value))
                                }}
                            ></input>
                        </div>
                        <span className="dong">đồng</span>
                    </div>
                    <div className="ending-row">
                        <div className="fine-tittle">CÒN LẠI: </div>
                        <input
                            className="fine-value"
                            type="text"
                            value={less}
                            onChange={() => { }}
                        ></input>
                        <span className="par-value">đồng</span>
                    </div>
                </div>
                <div className="right-side">
                    <div className="close" onClick={handleClickClose}>Đóng</div>
                    <div className="save" onClick={(e) => handleClickSave(e)}>Lưu thông tin</div>
                </div>
            </div>
        </div>)
}