import './statistics_page.scss'
import { NavLink } from 'react-router-dom'
export default function StatisticsPage() {
    return (<div className="statistics-page">
        <NavLink className="option" to="/Statistics/Genres">THỐNG KÊ TÌNH HÌNH MƯỢN SÁCH THEO THỂ LOẠI</NavLink>
        <NavLink className="option" to="/Statistics/Passdue">THỐNG KÊ SÁCH TRẢ TRỄ</NavLink>
    </div>)
}