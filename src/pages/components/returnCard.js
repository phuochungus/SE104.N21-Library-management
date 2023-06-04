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
                <div className="info-row">
                    <span>Mã sách</span>
                    <input
                        style={{ "width": "300px" }}
                        className="input"
                        type="text"
                        defaultValue={props.ele.bookId}
                    ></input>
                </div>
                <div className="info-row">
                    <span>Ngày mượn</span>
                    <input
                        style={{ "width": "145px" }}
                        className="input "
                        type="text"
                        defaultValue={borrowedDate.toLocaleDateString('pt-PT')}
                    ></input>
                </div>
                <div className="info-row">
                    <span>Ngày trả</span>
                    <input
                        style={{ "width": "145px" }}
                        className="input "
                        type="text"
                        defaultValue={returnedDate.toLocaleDateString('pt-PT')}
                    ></input>
                </div>
            </div>
            <div className="differ-2">
                <div className="fer-1">
                    <div className="info-row">
                        <span>Số ngày mượn</span>
                        <input
                            style={{ "width": "230px" }}
                            className="input "
                            type="text"
                            defaultValue={borrowDateNum}
                        ></input>
                    </div>
                    <span className="row-value">ngày</span>
                </div>
                <div className="fer-2">
                    <div className="info-row">
                        <span>Tiền phạt</span>
                        <input
                            style={{ "width": "140px" }}
                            className="input "
                            type="text"
                            defaultValue={props.ele.fine}
                        ></input>
                    </div>
                    <span className="row-value">đồng</span>
                </div>
            </div>
        </div>)
}