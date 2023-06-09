import { NavLink } from 'react-router-dom'
import { CustomStyle } from '../components/table_props'
import { Selection } from '../components/select'
import DataTable from 'react-data-table-component';
import { useState, useEffect, useContext } from 'react'
import handleExport from '../components/handleExport'
import { AppContext } from '../../App'
import { borrowDateSort, returnDateSort } from '../components/dateSort'
import alert from '../components/alert'

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

    //Define selected stats
    const [selectedStats, setSelectedStats] = useState([])

    //Define table props 
    const columns = [
        {
            width: "85px",
            name: "STT",
            selector: row => row.STT,
            sortable: true,
        },
        {
            name: "Mã sách",
            selector: row => row.bookId,
            sortable: true,
        },
        {
            name: "Tên sách",
            selector: row => row.bookName,
            sortable: true,
        },
        {
            name: "Ngày mượn",
            selector: row => new Date(row.borrowDate).toLocaleDateString('pt-PT'),
            sortable: true,
            sortFunction: borrowDateSort
        }
        ,
        {
            name: "Ngày trả",
            selector: row => new Date(row.returnDate).toLocaleDateString('pt-PT'),
            sortable: true,
            sortFunction: returnDateSort
        }
        ,
        {
            name: "Số ngày trả trễ",
            selector: row => row.numberOfPassDueDays,
            sortable: true,
        }
    ]
    useEffect(() => {
        fetch(`https://library2.herokuapp.com/reports/pass_due?month=${curMonth}&year=${curYear}`, {
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
        await fetch(`https://library2.herokuapp.com/reports/pass_due?month=${month}&year=${year}`, {
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
            alert("Chưa chọn sách cần thống kê")
        else
            handleExport(selectedStats, `Thống kê tháng ${month}`, "Thống kê sách trả trễ")
    }

    return (
        <div className="borrow-by-genres-page ">
            <div className="main-title">
                <span>BÁO CÁO THỐNG KÊ SÁCH TRẢ TRỄ</span>
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
                <div className="data-table">
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
            </div>
        </div>

    )
}