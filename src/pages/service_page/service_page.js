import { NavLink } from "react-router-dom";
import "./service_page.scss";
import { useContext } from 'react'
import { AppContext } from '../../App'

export default function ServicePage() {
    const { isAdmin } = useContext(AppContext)

    return (
        <div className="service-page">
            {(!isAdmin) || <NavLink className="option" to="/Reader">
                <button>
                    <p>LẬP PHIẾU MƯỢN/TRẢ SÁCH</p>
                </button>
            </NavLink>}
            {(!isAdmin) || <NavLink className="option" to="/Service/Borrow">
                <button>
                    <p>DỊCH VỤ MƯỢN SÁCH</p>
                </button>
            </NavLink>}
            {(!isAdmin) || <NavLink className="option" to="/Service/Return">
                <button>
                    <p>DỊCH VỤ TRẢ SÁCH</p>
                </button>
            </NavLink>}
            <NavLink className="option" to={isAdmin ? "/Service/BRHistory" : "/Service/MyHistory"}>
                <button>
                    <p>LỊCH SỬ MƯỢN/TRẢ SÁCH</p>
                </button>
            </NavLink>
        </div>
    );
}