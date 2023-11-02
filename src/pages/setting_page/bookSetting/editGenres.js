import { useState, useEffect } from 'react'
import alert from '../../components/alert'

export default function EditGenres(props) {
    const [data, setData] = useState("")

    useEffect(() => {
        setData(props.genresEdit.name)
    }, [props.genresEdit.name])

    //Handle Click close
    function handleClickClose() {
        const genresTable = document.querySelector(".genres-table-edit")
        genresTable.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"

        setData(props.genresEdit.name)
    }

    async function handleClickAdd(e) {
        e.style.cursor = "wait"

        if (data === "")
            alert("Thông tin không được để trống")
        else {
            const option = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data
                })
            }
            await fetch(`https://library2.herokuapp.com/genres/${props.genresEdit.genreId}`, option)

            props.setAPI(cur => !cur)

            const genresTable = document.querySelector(".genres-table-edit")
            genresTable.style.display = "none"
            const overLay = document.querySelector("#overlay")
            overLay.style.display = "none"
        }
        e.style.cursor = "pointer"
    }

    return (<div className="genres-table-edit">
        <div className="title"><span>CHỈNH SỬA THỂ LOẠI</span></div>
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