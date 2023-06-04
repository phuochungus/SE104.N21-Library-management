export function AcceptRemove(props) {
    const acceptBTN = document.querySelector(".accept-table .accept-btn")

    //Hanlde click Reject
    function handleClickReject() {
        const acceptTable = document.querySelector(".accept-table")
        acceptTable.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"
    }

    //handle click Accept
    async function handleClickAccept() {
        acceptBTN.style.cursor = "wait"

        for (var a of props.selected) {
            const option = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + props.access_token
                },
            }
            await fetch(props.fetchLink + a[props.ele], option)
        }


        const acceptTable = document.querySelector(".accept-table")
        acceptTable.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"

        props.handleClearRows()
        props.handleSelected()
        props.setAPI(cur => !cur)

        acceptBTN.style.cursor = "pointer"
    }

    //Render UI
    return (<div className="accept-table">
        <div className="accept-title">Bạn có chắc muốn xóa {props.selected.length} mục đã chọn?</div>
        <div className="accept-reject">
            <button className="reject-btn" onClick={handleClickReject}>Hủy bỏ</button>
            <button className="accept-btn" onClick={handleClickAccept}>Đồng ý</button>
        </div>
    </div>)

}