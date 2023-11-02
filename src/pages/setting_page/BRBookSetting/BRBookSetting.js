import './BRBookSetting.scss'
import { useEffect, useState, useContext } from 'react'
import nomalize from '../../components/nomalize'
import alert from '../../components/alert'
import { AppContext } from '../../../App'

export default function BRBookSettingPage() {
    const { token } = useContext(AppContext)

    const [maxBorrow, setMaxBorrow] = useState("")
    const [fine, setFine] = useState("")
    const [maxDayBr, setMaxDayBr] = useState("")
    const [maxHourOr, setMaxHourOr] = useState("")
    const [maxDayInter, setMaxDayInter] = useState("")


    const [enableEdit, setEnableEdit] = useState(false)

    useEffect(() => {
        fetch('https://library2.herokuapp.com/rules/max_borrow/')
            .then(res => res.json())
            .then(res => setMaxBorrow(res))
        fetch('https://library2.herokuapp.com/rules/fine_per_day/')
            .then(res => res.json())
            .then(res => setFine(res))
        fetch('https://library2.herokuapp.com/rules/borrow_due/')
            .then(res => res.json())
            .then(res => setMaxDayBr(res))
        fetch('https://library2.herokuapp.com/rules/reserve_day/')
            .then(res => res.json())
            .then(res => setMaxHourOr(res))
        fetch('https://library2.herokuapp.com/rules/borrow_interval/')
            .then(res => res.json())
            .then(res => setMaxDayInter(res))

    }, [])

    useEffect(() => {
        const all = document.querySelectorAll(".input")
        if (enableEdit) {
            for (let a of all) {
                a.classList.remove("non-edit")
            }
        }
        else {
            for (let a of all) {
                a.classList.add("non-edit")
            }
        }
    }, [enableEdit])

    async function handleClickEdit() {
        const saveBtn = document.querySelector('.BRBook-setting .save-btn')
        const refreshBtn = document.querySelector('.BRBook-setting .refresh-btn')
        saveBtn.style.cursor = "wait"

        if (nomalize(saveBtn.innerText) === nomalize("Chỉnh sửa")) {

            //edit ending-row
            refreshBtn.style.display = "flex"
            saveBtn.innerHTML = "Lưu thông tin"

            //enable-edit
            setEnableEdit(cur => !cur)
        }
        else {
            if (maxBorrow === "" || fine === "" || maxDayBr === "" || maxHourOr === "" || maxDayInter === "")
                alert("Thông tin không được để trống")

            else if (Number.isNaN(Number(maxBorrow)) || Number(maxBorrow) <= 0)
                alert("Số lượng sách mượn tối đa không hợp lệ")

            else if (Number.isNaN(Number(fine)) || Number(fine) <= 0)
                alert('Số tiền phạt trễ không hợp lệ')

            else if (Number.isNaN(Number(maxDayBr)) || Number(maxDayBr) <= 0)
                alert('Thời gian mượn tối đa không hợp lệ')

            else if (Number.isNaN(Number(maxHourOr)) || Number(maxHourOr) <= 0)
                alert('Thời gian đặt mượn tối đa không hợp lệ')

            else if (Number.isNaN(Number(maxDayInter)) || Number(maxDayInter) <= 0)
                alert('Số ngày quy định mượn tối đa không lợp lệ')
            else {
                //fetch max_borrow
                const optionMaxBorrow = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        value: String(maxBorrow)
                    })
                }
                await fetch('https://library2.herokuapp.com/rules/max_borrow/', optionMaxBorrow)

                //fetch max_fine
                const optionFine = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        value: String(fine)
                    })
                }
                await fetch('https://library2.herokuapp.com/rules/fine_per_day/', optionFine)

                //fetch max_Dayborrow
                const optionMaxDayBr = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        value: String(maxDayBr)
                    })
                }
                await fetch('https://library2.herokuapp.com/rules/borrow_due/', optionMaxDayBr)

                //fetch max_Hour Or
                const optionMaxHourOr = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        value: String(maxHourOr)
                    })
                }
                await fetch('https://library2.herokuapp.com/rules/reserve_day/', optionMaxHourOr)


                //fetch max_Inter
                const optionInter = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        value: String(maxDayInter)
                    })
                }
                await fetch('https://library2.herokuapp.com/rules/borrow_interval/', optionInter)

                setEnableEdit(cur => !cur)

                //edit ending-row
                refreshBtn.style.display = "none"
                saveBtn.innerHTML = "Chỉnh sửa"

            }
        }
        saveBtn.style.cursor = "pointer"
    }

    async function handleClickRefresh() {
        const refreshBtn = document.querySelector('.BRBook-setting .refresh-btn')
        refreshBtn.style.cursor = "wait"

        await fetch('https://library2.herokuapp.com/rules/max_borrow/')
            .then(res => res.json())
            .then(res => setMaxBorrow(res))
        await fetch('https://library2.herokuapp.com/rules/fine_per_day/')
            .then(res => res.json())
            .then(res => setFine(res))
        await fetch('https://library2.herokuapp.com/rules/borrow_due/')
            .then(res => res.json())
            .then(res => setMaxDayBr(res))
        await fetch('https://library2.herokuapp.com/rules/reserve_day/')
            .then(res => res.json())
            .then(res => setMaxHourOr(res))
        await fetch('https://library2.herokuapp.com/rules/borrow_interval/')
            .then(res => res.json())
            .then(res => setMaxDayInter(res))

        refreshBtn.style.cursor = "pointer"

    }

    return (<div className="BRBook-setting">
        <div className="change-box">
            <div className="br-change">
                <div className="option-change">
                    <span>Số lượng sách mượn tối đa</span>
                    <div className="type">
                        <img
                            className="icon-change"
                            src={require("../img/book.svg").default}
                            alt=""
                        />
                        <input
                            className="input non-edit"
                            type="text"
                            value={maxBorrow}
                            onChange={e => setMaxBorrow(e.target.value)}
                        ></input>

                    </div>
                </div>
                <div className="option-change">
                    <span>Số tiền phạt trả trễ mỗi ngày (/sách)</span>
                    <div className="type">
                        <img
                            className="icon-change"
                            src={require("../img/money.svg").default}
                            alt=""
                        />
                        <input
                            className="input non-edit"
                            type="text"
                            value={fine}
                            onChange={e => setFine(e.target.value)}></input>

                    </div>
                </div>
            </div>
            <div className="br-change">
                <div className="option-change">
                    <span>Thời gian mượn tối đa (ngày)</span>
                    <div className="type">
                        <img
                            className="icon-change"
                            src={require("../img/calendar.svg").default}
                            alt=""
                        />
                        <input
                            className="input non-edit"
                            type="text"
                            value={maxDayBr}
                            onChange={e => setMaxDayBr(e.target.value)}
                        ></input>

                    </div>
                </div>
                <div className="option-change">
                    <span>Thời gian đặt mượn tối đa (ngày)</span>
                    <div className="type">
                        <img
                            className="icon-change"
                            src={require("../img/clock.svg").default}
                            alt=""
                        />
                        <input
                            className="input non-edit"
                            type="text"
                            value={maxHourOr}
                            onChange={e => setMaxHourOr(e.target.value)}></input>

                    </div>
                </div>
            </div>
            <div className="valid-change">
                <div className="option-differ">
                    <span>Số ngày quy định số sách mượn tối đa</span>
                    <div className="type">
                        <img
                            className="icon-change"
                            src={require("../img/calendar.svg").default}
                            alt=""
                        />
                        <input
                            className="input non-edit"
                            type="text"
                            value={maxDayInter}
                            onChange={e => setMaxDayInter(e.target.value)}></input>
                    </div>
                </div>
            </div>
            <div className="ending-row">
                <div className="refresh-btn" onClick={handleClickRefresh}>Hoàn tác</div>
                <div className="save-btn" onClick={handleClickEdit}>Chỉnh sửa</div>
            </div>
        </div>
    </div>)
}