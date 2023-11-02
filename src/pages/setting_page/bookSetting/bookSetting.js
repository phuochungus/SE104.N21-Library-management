import './bookSetting.scss'
import DataTable from 'react-data-table-component'
import { CustomStyle } from '../../components/table_props'
import { useState, useEffect, useContext } from 'react'
import AddGenres from './addGenres'
import EditGenres from './editGenres'
import alert from '../../components/alert'
import nomalize from '../../components/nomalize'
import { AppContext } from '../../../App'

export default function BookSettingPage() {
    const { token } = useContext(AppContext)

    const [genres, setGenres] = useState([])
    const [total, setTotal] = useState("")
    const [API, setAPI] = useState(false)
    const [genresEdit, setGenresEdit] = useState({})

    //Define selected book Reserved
    const [selectedGenres, setSelectedGenres] = useState([])
    const [toggledClearRows, setToggleClearRows] = useState(false)

    const [enableEdit, setEnableEdit] = useState(false)

    const [maxYear, setMaxYear] = useState("")

    useEffect(() => {
        fetch('https://library2.herokuapp.com/rules/max_publish_year/')
            .then(res => res.json())
            .then(res => setMaxYear(res))
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

    //Call API Genres
    useEffect(() => {
        fetch('https://library2.herokuapp.com/genres/')
            .then(res => res.json())
            .then(genres => {
                function handleClickEdit(ele) {
                    const genresTable = document.querySelector(".genres-table-edit")
                    genresTable.style.display = "flex"
                    const overLay = document.querySelector("#overlay")
                    overLay.style.display = "flex"

                    setGenresEdit(ele)
                }
                genres.map((ele, index) => {
                    ele.STT = index + 1

                    ele.fix = (<div className="action">
                        <span onClick={() => handleClickEdit(ele)} style={{ cursor: "pointer" }}>
                            <img className="icon icon-hover" src={require("../img/edit.svg").default} alt="" />
                        </span>
                    </div>)

                    return ele
                })
                setGenres(genres)
                setTotal(genres.length)
            })
    }, [API])

    //Define table 
    const columns = [
        {
            width: "80px",
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            width: "22vw",
            name: "Thể loại",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Sửa",
            selector: row => row.fix,
        },
    ]
    //Handle clear Rows
    const handleClearRows = () => {
        setToggleClearRows(!toggledClearRows);
    }
    //Hanlde selected Books
    const handleSelected = () => {
        setSelectedGenres([])
    }

    function handleClickAdd() {
        const genresTable = document.querySelector(".genres-table-add")
        genresTable.style.display = "flex"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "flex"
    }
    async function handleClickDelete() {
        const deleteBtn = document.querySelector('.book-setting .deletes')
        deleteBtn.style.cursor = "wait"

        if (selectedGenres.length === 0)
            alert("Không có mục nào cần xóa")
        else {
            const option = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            for (var a of selectedGenres) {
                await fetch(`https://library2.herokuapp.com/genres/${a.genreId}/`, option)
            }
            handleSelected()
            handleClearRows()
            setAPI(cur => !cur)
        }
        deleteBtn.style.cursor = "pointer"
    }

    async function handleClickRefresh() {
        const refreshBtn = document.querySelector('.book-setting .refresh-btn')
        refreshBtn.style.cursor = "wait"

        await fetch('https://library2.herokuapp.com/rules/max_publish_year/')
            .then(res => res.json())
            .then(res => setMaxYear(res))

        refreshBtn.style.cursor = "pointer"
    }

    async function handleClickEdit() {
        const saveBtn = document.querySelector('.book-setting .save-btn')
        const refreshBtn = document.querySelector('.book-setting .refresh-btn')
        saveBtn.style.cursor = "wait"

        if (nomalize(saveBtn.innerText) === nomalize("Chỉnh sửa")) {

            //edit ending-row
            refreshBtn.style.display = "flex"
            saveBtn.innerHTML = "Lưu thông tin"

            //enable-edit
            setEnableEdit(cur => !cur)
        }
        else {
            if (maxYear === "")
                alert("Thông tin không được để trống")
            else if (Number.isNaN(Number(maxYear)) || Number(maxYear) <= 0)
                alert("Khoảng cách tối đa không hợp lệ")
            else {
                //fetch min_age
                const option = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        value: String(maxYear)
                    })
                }
                await fetch(`https://library2.herokuapp.com/rules/max_publish_year/`, option)

                setEnableEdit(cur => !cur)

                //edit ending-row
                refreshBtn.style.display = "none"
                saveBtn.innerHTML = "Chỉnh sửa"

            }
        }
        saveBtn.style.cursor = "pointer"
    }


    return (<div className="book-setting">
        <AddGenres
            setAPI={setAPI}
        ></AddGenres>
        <EditGenres
            genresEdit={genresEdit || {}}
            setAPI={setAPI}
        ></EditGenres>
        <div className="temp-list">
            <div className="the-table">
                <span className="table-name">THỂ LOẠI</span>
                <div className="total">
                    <span>SỐ LƯỢNG THỂ LOẠI: </span>
                    <input type="text"
                        value={total}
                        onChange={() => { }}></input>
                </div>
                <div className="table">
                    <div className="data-table">
                        <DataTable
                            data={genres}
                            columns={columns}
                            fixedHeader={"true"}
                            fixedHeaderScrollHeight="100%"
                            customStyles={CustomStyle}
                            selectableRows
                            onSelectedRowsChange={(selected) => setSelectedGenres(selected.selectedRows)}
                            clearSelectedRows={toggledClearRows}
                        />
                    </div>
                </div>
                <div className="ending-row">
                    <div className="delete deletes" onClick={handleClickDelete}>Xóa</div>
                    <div className="print order" onClick={handleClickAdd}>Thêm thể loại</div>
                </div>
            </div>
        </div>
        <div className="borrowed-list">
            <div className="the-table">
                <span className="table-name">NĂM XUẤT BẢN</span>
                <div className="option-change">
                    <span>Khoảng cách tối đa (năm)</span>
                    <div className="type">
                        <img
                            className="icon-change"
                            src={require("../img/calendar.svg").default}
                            alt=""
                        />
                        <input
                            className="input non-edit"
                            type="text"
                            value={maxYear}
                            onChange={(e) => setMaxYear(e.target.value)}
                        ></input>

                    </div>
                </div>
                <div className="ending-row">
                    <div className="refresh-btn" onClick={handleClickRefresh}>Hoàn tác</div>
                    <div className="save-btn" onClick={handleClickEdit}>Chỉnh sửa</div>
                </div>
            </div>
        </div>
    </div>
    )
}