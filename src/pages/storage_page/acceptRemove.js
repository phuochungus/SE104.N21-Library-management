export function AcceptRemove(props) {
    //Hanlde click Reject
    function handleClickReject() {
        const acceptTable = document.querySelector(".accept-table")
        acceptTable.style.display = "none"
    }

    //handle click Accept
    async function handleClickAccept() {
        const acceptTable = document.querySelector(".accept-table")
        acceptTable.style.display = "none"

        for (var a of props.selectedBooks) {
            const option = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
            await fetch(`https://library2.herokuapp.com/books/book/${a.bookId}/`, option)
        }

        props.handleClearRows()
        props.handleSelectedBooks()
        props.handleAPI()
    }

    //Render UI
    return (<div className="accept-table">
        <div className="accept-title">Bạn có chắc muốn xóa {props.selectedBooks.length} mục đã chọn?</div>
        <div className="accept-reject">
            <button className="reject-btn" onClick={handleClickReject}>Hủy bỏ</button>
            <button className="accept-btn" onClick={handleClickAccept}>Đồng ý</button>
        </div>
    </div>)

}