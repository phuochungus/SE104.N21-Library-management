import success from './success'
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

        var arr = []
        for (let a of props.selected) {
            const option = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + props.access_token
                },
            }
            await fetch(props.fetchLink + a[props.ele], option)
            if (arr.length === 0)
                arr = props.listAPI.filter((ele) => ele[props.ele] !== a[props.ele])
            else
                arr = arr.filter((ele) => ele[props.ele] !== a[props.ele])
        }
        await props.setListAPI(arr)

        success("Xóa thành công")
        const acceptTable = document.querySelector(".accept-table")
        acceptTable.style.display = "none"
        const overLay = document.querySelector("#overlay")
        overLay.style.display = "none"

        props.handleClearRows()
        props.handleSelected()

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