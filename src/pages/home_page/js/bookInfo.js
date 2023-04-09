export function BookInfo(props) {
    function handleClick(e) {
        const infoTable = document.querySelector(".info-table")
        infoTable.style.display = "none"

    }
    return (
        <div className="info-table">
            <div className="table-title">THÔNG TIN SÁCH</div>
            <div className="info-row">
                <span>Tên sách</span>
                <input
                    className="input"
                    value={props.name}
                    type="text"
                ></input>
            </div>
            <div className="info-row">
                <span>Tác giả</span>
                <input
                    className="input"
                    value={props.author}
                    type="text"
                ></input>
            </div>
            <div className="info-row">
                <span>Thể loại</span>
                <input
                    className="input"
                    value={props.type}
                    type="text"
                ></input>
            </div>
            <div className="info-row-differ1">
                <div className="info-row">
                    <span>Nhà xuất bản</span>
                    <input
                        className="input publisher"
                        value={props.type}
                        type="text"
                    ></input>
                </div>
                <div className="info-row">
                    <span>Năm xuất bản</span>
                    <input
                        className="input year"
                        value={props.type}
                        type="text"
                    ></input>
                </div>
            </div>
            <div className="info-row-differ2">
                <div className="info-row">
                    <span>Ngày nhập</span>
                    <input
                        className="input receipt-date"
                        value={props.type}
                        type="text"
                    ></input>
                </div>
                <div className="info-row">
                    <span>Trị giá</span>
                    <input
                        className="input book-cost"
                        value={props.type}
                        type="text"
                    ></input>
                </div>
                <span className="par-value">đồng</span>
                <div className="info-row">
                    <span>Tình trạng</span>
                    <input
                        className="input book-status"
                        value={props.type}
                        type="text"
                    ></input>
                </div>
            </div>
            <div className="ending-row">
                <div className="close-btn" onClick={(e) => handleClick(e)}><span>Đóng</span></div>
                <div className="add-btn"><span>Thêm vào giá sách</span></div>
            </div>
        </div>)
}