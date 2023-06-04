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
                <div className="info-row">
                    <span>Mã sách</span>
                    <input
                        style={{ "width": "350px" }}
                        className="input"
                        type="text"
                        defaultValue={props.ele.bookId}
                    ></input>
                </div>
                <div className="info-row">
                    <span>Tác giả</span>
                    <input
                        style={{ "width": "300px" }}
                        className="input "
                        type="text"
                        defaultValue={props.ele.authorName}
                    ></input>
                </div>
            </div>
            <div className="differ-2">
                <div className="info-row">
                    <span>Thể loại</span>
                    <input
                        style={{ "width": "420px" }}
                        className="input "
                        type="text"
                        defaultValue={props.ele.genreNames.join(", ")}
                    ></input>
                </div>
                <div className="info-row">
                    <span>Ngày mượn</span>
                    <input
                        style={{ "width": "230px" }}
                        className="input "
                        type="text"
                        defaultValue={new Date(props.ele.createdDate).toLocaleDateString('pt-PT')}
                    ></input>
                </div>
            </div>
        </div>)
}