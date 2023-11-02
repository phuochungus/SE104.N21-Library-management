import { useState } from 'react'
import alert from '../../components/alert'

export default function AddGenres(props) {
    const [data, setData] = useState("")

    //Handle Click close
    function handleClickClose() {
        const genresTable = document.querySelector(".genres-table-add")
        genresTable.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"

        setData('')
    }

    async function handleClickAdd(e) {
        e.style.cursor = "wait"

        if (data === "")
            alert("Thông tin không được để trống")
        else {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data
                })
            }
            await fetch('https://library2.herokuapp.com/genres/', option)

            props.setAPI(cur => !cur)
            setData("")

            const genresTable = document.querySelector(".genres-table-add")
            genresTable.style.display = "none"
            const overLay = document.querySelector("#overlay")
            overLay.style.display = "none"
        }
        e.style.cursor = "pointer"
    }

    return (<div className="genres-table-add">
        <div className="title"><span>THÊM THỂ LOẠI</span></div>
        <input
            type="text"
            placeholder="Nhập thể loại"
            value={data}
            onChange={e => setData(e.target.value)}
        ></input>
        <div className="ending-row">
            <div className="delete" onClick={handleClickClose} >Đóng</div>
            <div className="print order" onClick={(e) => handleClickAdd(e.target)}>Lưu thay đổi</div>
        </div>
    </div>)
}