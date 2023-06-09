import './userSetting.scss'
import { useEffect, useState, useContext } from 'react'
import nomalize from '../../components/nomalize'
import alert from '../../components/alert'
import { AppContext } from '../../../App'

export default function UserSettingPage() {
    const { token } = useContext(AppContext)

    const [minAge, setMinAge] = useState("")
    const [maxAge, setMaxAge] = useState("")
    const [valid, setValid] = useState("")

    const [enableEdit, setEnableEdit] = useState(false)

    useEffect(() => {
        fetch('https://library2.herokuapp.com/rules/min_age/')
            .then(res => res.json())
            .then(res => setMinAge(res))
        fetch('https://library2.herokuapp.com/rules/max_age/')
            .then(res => res.json())
            .then(res => setMaxAge(res))
        fetch('https://library2.herokuapp.com/rules/valid_period_of_user/')
            .then(res => res.json())
            .then(res => setValid(res))
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
        const saveBtn = document.querySelector('.user-setting .save-btn')
        const refreshBtn = document.querySelector('.user-setting .refresh-btn')
        saveBtn.style.cursor = "wait"

        if (nomalize(saveBtn.innerText) === nomalize("Chỉnh sửa")) {

            //edit ending-row
            refreshBtn.style.display = "flex"
            saveBtn.innerHTML = "Lưu thông tin"

            //enable-edit
            setEnableEdit(cur => !cur)
        }
        else {
            if (minAge === "" || maxAge === "" || valid === "")
                alert("Thông tin không được để trống")
            else if (Number.isNaN(Number(minAge)) || Number(minAge) <= 0 || Number(minAge) > Number(maxAge))
                alert("Tuổi tối thiểu không hợp lệ")
            else if (Number.isNaN(Number(maxAge)))
                alert('Tuổi tối đa không hợp lệ')
            else if (Number.isNaN(Number(valid)) || Number(valid) <= 0)
                alert('Thời hạn của thẻ không hợp lệ')
            else {
                //fetch min_age
                const optionMin = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        value: String(minAge)
                    })
                }
                await fetch(`https://library2.herokuapp.com/rules/min_age/`, optionMin)

                //fetch max_age
                const optionMax = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        value: String(maxAge)
                    })
                }
                await fetch(`https://library2.herokuapp.com/rules/max_age/`, optionMax)

                //fetch valid
                const optionValid = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        value: String(valid)
                    })
                }
                await fetch(`https://library2.herokuapp.com/rules/valid_period_of_user/`, optionValid)

                setEnableEdit(cur => !cur)

                //edit ending-row
                refreshBtn.style.display = "none"
                saveBtn.innerHTML = "Chỉnh sửa"

            }
        }
        saveBtn.style.cursor = "pointer"
    }

    async function handleClickRefresh() {
        const refreshBtn = document.querySelector('.user-setting .refresh-btn')
        refreshBtn.style.cursor = "wait"

        await fetch('https://library2.herokuapp.com/rules/min_age/')
            .then(res => res.json())
            .then(res => setMinAge(res))
        await fetch('https://library2.herokuapp.com/rules/max_age/')
            .then(res => res.json())
            .then(res => setMaxAge(res))
        await fetch('https://library2.herokuapp.com/rules/valid_period_of_user/')
            .then(res => res.json())
            .then(res => setValid(res))

        refreshBtn.style.cursor = "pointer"

    }

    return (<div className="user-setting">
        <div className="change-box">
            <div className="age-change">
                <div className="option-change">
                    <span>Độ tuổi tối thiểu</span>
                    <div className="type">
                        <img
                            className="icon-change"
                            src={require("../img/edit-age.svg").default}
                            alt=""
                        />
                        <input
                            className="input non-edit"
                            type="text"
                            value={minAge}
                            onChange={e => setMinAge(e.target.value)}
                        ></input>

                    </div>
                </div>
                <div className="option-change">
                    <span>Độ tuổi tối đa</span>
                    <div className="type">
                        <img
                            className="icon-change"
                            src={require("../img/edit-age.svg").default}
                            alt=""
                        />
                        <input
                            className="input non-edit"
                            type="text"
                            value={maxAge}
                            onChange={e => setMaxAge(e.target.value)}></input>

                    </div>
                </div>
            </div>
            <div className="valid-change">
                <div className="option-differ">
                    <span>Thời hạn có giá trị của thẻ (tháng)</span>
                    <div className="type">
                        <img
                            className="icon-change"
                            src={require("../img/calendar.svg").default}
                            alt=""
                        />
                        <input
                            className="input non-edit"
                            type="text"
                            value={valid}
                            onChange={e => setValid(e.target.value)}></input>
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