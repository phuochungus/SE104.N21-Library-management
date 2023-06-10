import './reader_page.scss'
import { useState } from 'react'
import { Selection } from '../components/select'
import alert from '../components/alert'
import success from '../components/success'

export function AddUser(props) {
    //Info-user
    const [userName, setUserName] = useState("")
    const [user, setUser] = useState("")
    const [birth, setBirth] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [readerType, setReaderType] = useState("Loại độc giả")

    //createdDay
    const createdDay = new Date().toLocaleDateString('pt-PT')

    function handleClickClose(e) {
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"
        const addTable = document.querySelector(".add-table-user")
        addTable.style.display = "none"

        const dropdownContent = document.querySelector(".drop-down-content")
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none"
        }
    }

    async function handleClickAdd(e) {
        const addbtn = document.querySelector(".add-table-user .add-btn")
        addbtn.style.cursor = "wait"

        if (userName === "" || user === "" || birth === "" || email === "" || address === "" || readerType === "Loại độc giả") {
            alert("Thông tin không được bỏ trống")
            addbtn.style.cursor = "pointer"
        }
        else if (!email.includes("@")) {
            alert("Định dạng Email không hợp lệ")
            addbtn.style.cursor = "pointer"
        }
        else {

            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                },
                body: JSON.stringify({
                    username: user,
                    password: "password",
                    email: email,
                    name: userName,
                    birth: birth,
                    address: address,
                    type: readerType
                })
            }

            await fetch('https://library2.herokuapp.com/users/for_admin/', option)
                .then(res => res.json())
                .then(async res => {
                    if (res.message) {
                        switch (res.message) {
                            case "Username is already taken": res.mes = "Tên tài khoản đã tồn tại"; break;
                            case "Email or username already taken": res.mes = "Email đã được sử dụng"; break;
                            case "User age not available": res.mes = "Tuổi không phù hợp để đăng ký"; break;
                            default: break;
                        }
                        alert(res.mes)
                        addbtn.style.cursor = "pointer"

                    }
                    else {
                        const addTable = document.querySelector(".add-table-user")
                        addTable.style.display = "none"
                        const overLay = document.querySelector("#overlay")
                        overLay.style.display = "none"

                        const arr = [res, ...props.userAPI]
                        props.setUserAPI(arr)

                        success("Thêm thành công")

                        setUserName("")
                        setUser("")
                        setBirth("")
                        setEmail("")
                        setAddress("")
                        setReaderType("Loại độc giả")
                        addbtn.style.cursor = "pointer"
                    }
                })

        }
    }
    //Render UI

    return (
        <div className="add-table-user">
            <div className="table-title">THẺ ĐỘC GIẢ</div>
            <div className="info-row">
                <span>Họ tên độc giả</span>
                <input
                    placeholder="Họ tên độc giả"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                ></input>
            </div>
            <div className="info-row">
                <span>Tên đăng nhập</span>
                <input
                    placeholder="Tên đăng nhập"
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                ></input>
            </div>
            <div className="differ-1">
                <div className="info-row">
                    <span>Ngày sinh</span>
                    <input
                        style={{ "width": "150px", "textIndent": "6px" }}
                        placeholder="Ngày sinh"
                        type="date"
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
                    ></input>
                </div>
                <div className="info-row row-2">
                    <span>Email</span>
                    <input
                        style={{ "width": "335px" }}
                        placeholder="Email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                </div>
            </div>
            <div className="info-row">
                <span>Địa chỉ</span>
                <input
                    placeholder="Địa chỉ"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                ></input>
            </div>
            <div className="differ-1">
                <div className="info-row">
                    <span>Ngày lập thẻ</span>
                    <input
                        style={{ "width": "150px", "textIndent": "6px" }}
                        placeholder="Ngày lập thẻ"
                        type="text"
                        defaultValue={createdDay}
                    ></input>
                </div>
                <div className="info-row row-2">
                    <span>Loại độc giả</span>
                    <Selection
                        genres={["X", "Y"]}
                        title="Loại độc giả"
                        value={readerType}
                        SET={setReaderType}
                        ID="readerType-select">
                    </Selection>
                </div>
            </div>
            <div className="ending-row">
                <div className="close-btn" onClick={(e) => handleClickClose(e)}><span>Đóng</span></div>
                <div className="add-btn" onClick={(e) => handleClickAdd(e)}><span>Lưu thông tin</span></div>
            </div>
        </div>)
}