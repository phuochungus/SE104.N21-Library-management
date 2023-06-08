import './components.scss'
export default function BorrowCard(props) {
    return (
        <div className="card-table">
            <div className="order-number">
                <span>STT:</span>
                <input type="text"
                    defaultValue={props.index + 1}></input>
            </div>
            <div className="info-row">
                <span>Tên sách</span>
                <input
                    className="input"
                    type="text"
                    defaultValue={props.ele.bookName}
                ></input>
            </div>
            <div className="differ-1">
                <div className="info-row" style={{ "width": "50%", "minWidth": "none" }}>
                    <span>Mã sách</span>
                    <input
                        className="input1"
                        style={{ "width": "100%" }}
                        type="text"
                        defaultValue={props.ele.bookId}
                    ></input>
                </div>
                <div className="info-row" style={{ "width": "42.85%", "minWidth": "none" }}
                >
                    <span>Tác giả</span>
                    <input
                        className="input2"
                        type="text"
                        style={{ "width": "99%" }}
                        defaultValue={props.ele.authorName}
                    ></input>
                </div>
            </div>
            <div className="differ-2">
                <div className="info-row" style={{ "width": "60%", "minWidth": "none" }}>
                    <span>Thể loại</span>
                    <input
                        style={{ "width": "100%" }}
                        className="input1"
                        type="text"
                        defaultValue={props.ele.genreNames.join(", ")}
                    ></input>
                </div>
                <div className="info-row" style={{ "width": "32.85%", "minWidth": "none" }}
                >
                    <span>Ngày mượn</span>
                    <input
                        style={{ "width": "99%" }}
                        className="input2"
                        type="text"
                        defaultValue={new Date(props.ele.createdDate).toLocaleDateString('pt-PT')}
                    ></input>
                </div>
            </div>
        </div>)
}