import { Link } from "react-router-dom";
import "./service_page.scss";

export default function ServicePage() {
  return (
    <div className="service-page">
      <h1>VUI LÒNG CHỌN LOẠI DỊCH VỤ</h1>
      <button>
        <p>LẬP PHIẾU MƯỢN/TRẢ SÁCH</p>
      </button>
      <Link to="/Service/BorrowPage">
        <button>
          <p>DỊCH VỤ MƯỢN SÁCH</p>
        </button>
      </Link>
      <Link to="/Service/ReturnPage">
        <button>
          <p>DỊCH VỤ TRẢ SÁCH</p>
        </button>
      </Link>
      <Link to="/Service/HistoryBRPage">
        <button>
          <p>LỊCH SỬ MƯỢN/TRẢ SÁCH</p>
        </button>
      </Link>
    </div>
  );
}
