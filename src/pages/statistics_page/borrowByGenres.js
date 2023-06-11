import { NavLink } from 'react-router-dom'
import { CustomStyle } from '../components/table_props'
import { Selection } from '../components/select'
import DataTable from 'react-data-table-component';
import { useState, useEffect, useContext } from 'react'
import handleExport from '../components/handleExport'
import { AppContext } from '../../App'
import alert from '../components/alert'
import { percenSort } from '../components/dateSort'

export default function BorrowByGenres() {
    const { token } = useContext(AppContext);

    //Define data 
    const [stats, setStats] = useState([])

    //Current Date
    const curDate = new Date()
    const curMonth = curDate.getMonth() + 1
    const curYear = curDate.getFullYear()

    const [month, setMonth] = useState("0" + curMonth.toString())
    const [year, setYear] = useState(curYear.toString())
    const [total, setTotal] = useState(0)

    //Define selected stats
    const [selectedStats, setSelectedStats] = useState([])

    //Define table props 
    const columns = [
        {
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            name: "Tên thể loại",
            selector: row => row.genreName,
            sortable: true,
        },
        {
            name: "Số lượt mượn",
            selector: row => row.count,
            sortable: true,
        },
        {
            name: "Tỉ lệ (%)",
            selector: row => row.percentage,
            sortable: true,
            sortFunction: percenSort
        }
    ]

    //Call API
    useEffect(() => {
        setTotal(0)
        stats.forEach((ele) => {
            setTotal(cur => cur + ele.count)
        })
    }, [stats])

    useEffect(() => {
        fetch(`https://library2.herokuapp.com/reports/borrow_by_genres?month=${curMonth}&year=${curYear}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => response.json())
            .then(stats => {
                stats.map((ele, index) => {
                    ele.STT = index + 1;
                    return ele
                })
                setStats(stats)
            })
    }, [curMonth, curYear, token])

    async function handleClickStat() {
        await fetch(`https://library2.herokuapp.com/reports/borrow_by_genres?month=${month}&year=${year}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => response.json())
            .then(stats => {
                stats.map((ele, index) => {
                    ele.STT = index + 1;
                    return ele
                })
                setStats(stats)
            })
    }

    function handleClickExport() {
        if (selectedStats.length === 0)
            alert("Chưa chọn thể loại cần thống kê")
        else
            handleExport(selectedStats, `Thống kê tháng ${month}`, "Thống kê mượn sách theo thể loại")
    }

    return (
        <div className="borrow-by-genres-page ">
            <div className="main-title">
                <span>BÁO CÁO THỐNG KÊ TÌNH HÌNH MƯỢN SÁCH THEO THỂ LOẠI</span>
                <NavLink to="/Statistics"><img className="icon icon-hover" src={require("./img/return.svg").default} alt="" /></NavLink>
            </div>
            <div className="main-content">
                <div className="search-tool">
                    <div className="search-info">
                        <span>Tháng</span>
                        <Selection
                            genres={["02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]}
                            title="01"
                            value={month}
                            SET={setMonth}
                            ID="month-select"
                        ></Selection>
                    </div>
                    <div className="search-info">
                        <span>Năm</span>
                        <Selection
                            genres={["2022", "2023", "2024"]}
                            title="2021"
                            value={year}
                            SET={setYear}
                            ID="year-select"
                        ></Selection>
                    </div>
                    <button className="statics" onClick={handleClickStat}>Thống kê</button>
                    <button className="export" onClick={handleClickExport}>Xuất báo cáo</button>
                </div>
                <div className="data-table" style={{ "height": "calc(90% - 137px)" }}>
                    <DataTable
                        data={stats}
                        columns={columns}
                        fixedHeader={"true"}
                        fixedHeaderScrollHeight="100%"
                        customStyles={CustomStyle}
                        selectableRows
                        onSelectedRowsChange={(selected) => setSelectedStats(selected.selectedRows)}
                    />
                </div>
                <div className="total">
                    <span>TỔNG SỐ LƯỢT MƯỢN:</span>
                    <div>{total}</div>
                    <span>lượt</span>
                </div>
            </div>
        </div>

    )
}