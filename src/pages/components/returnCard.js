import './components.scss'
import millisecondsToDays from '../components/convertDay'

export default function ReturnCard(props) {
    const borrowedDate = new Date(props.ele.borrowDate)
    const returnedDate = new Date(props.ele.returnDate)

    const borrowDateNum = millisecondsToDays(returnedDate - borrowedDate)

    return (
        <div className="card-table-return">
            <div className="order-number">
                <span>STT:</span>
                <input type="text"
                    defaultValue={props.index + 1}
                ></input>
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
                <div className="info-row" style={{ "width": "42.85%", "minWidth": "none" }}>
                    <span>Mã sách</span>
                    <input
                        style={{ "width": "100%" }}
                        className="input1"
                        type="text"
                        defaultValue={props.ele.bookId}
                    ></input>
                </div>
                <div className="info-row" style={{ "width": "20.71%", "minWidth": "none" }}>
                    <span>Ngày mượn</span>
                    <input
                        style={{ "width": "99%" }}
                        className="input2"
                        type="text"
                        defaultValue={borrowedDate.toLocaleDateString('pt-PT')}
                    ></input>
                </div>
                <div className="info-row" style={{ "width": "20.71%", "minWidth": "none" }}>
                    <span>Ngày trả</span>
                    <input
                        style={{ "width": "100%" }}
                        className="input3"
                        type="text"
                        defaultValue={returnedDate.toLocaleDateString('pt-PT')}
                    ></input>
                </div>
            </div>
            <div className="differ-2">
                <div className="fer-1" style={{ "width": "40.3%", "minWidth": "none" }}>
                    <div className="info-row" style={{ "width": "100%" }}>
                        <span>Số ngày mượn</span>
                        <input
                            style={{ "width": "100%" }}
                            className="input1"
                            type="text"
                            defaultValue={borrowDateNum}
                        ></input>
                    </div>
                    <span className="row-value">ngày</span>
                </div>
                <div className="fer-2" style={{ "width": "20%", "minWidth": "none" }}>
                    <div className="info-row" style={{ "width": "100%" }}>
                        <span>Tiền phạt</span>
                        <input
                            style={{ "width": "100%" }}
                            className="input2"
                            type="text"
                            defaultValue={props.ele.fine}
                        ></input>
                    </div>
                    <span className="row-value">đồng</span>
                </div>
            </div>
        </div>)
}