import Modal from "../../../components/UI/Modal";
import { useState, useEffect } from "react";
import "./history_page.scss";

import { CustomStyle } from "../../js/hp_table";
import DataTable from "react-data-table-component";

const HistoryPage = (props) => {
  //define API
  const [API] = useState();
  const [bookAPI, setBookAPI] = useState([]);
  const [books, setBooks] = useState([]);

  //Table columns
  const columns = [
    {
      name: "STT",
      selector: (row) => row.STT,
      sortable: true,
    },
    {
      name: "Mã sách",
      selector: (row) => row.bookId,
      sortable: true,
    },
    {
      name: "Tên sách",
      selector: (row) => row.bookName,
      sortable: true,
    },
    {
      name: "Tác giả",
      selector: (row) => row.author,
      sortable: true,
    },
    {
      name: "Ngày mượn",
      selector: (row) => row.borrowDate,
      sortable: true,
    },
    {
      name: "Ngày trả",
      selector: (row) => row.returnDate,
      sortable: true,
    },
    {
      name: "Chi tiết kì trả",
      selector: (row) => row.Action,
    },
  ];

  //fetch Data
  useEffect(() => {
    //fetch an example user
    fetch(
      "https://library2.herokuapp.com/book_borrow_return_histories/user/931be421-ebf9-457b-8da9-0730bc8dee5c"
    )
      .then((res) => res.json())
      .then((books) => {
        setBookAPI(() => {
          setBooks(books);
          return books;
        });
      });
  }, [API]);

  //Display books
  useEffect(() => {
    books.map((ele, index) => {
      ele.STT = index + 1;
      ele.Action = (
        <div className="action">
          <span
            onClick={() => handleClickInfo(ele, index)}
            style={{ cursor: "pointer" }}
          >
            <img
              className="icon icon-hover"
              src={require("../img/info.svg").default}
              alt=""
            />
          </span>
        </div>
      );
      return ele;
    });
  }, [books]);

  const handleClickInfo = () => {};

  return (
    <Modal>
      <div className="view">
        {/* <!-- THÔNG TIN ĐỘC GIẢ --> */}
        <div className="infor-layout">
          <h1>THÔNG TIN ĐỘC GIẢ</h1>
          <label htmlFor="name">Tên độc giả</label>
          <input id="name" type="text" placeholder="Tên độc giả" />
          <label htmlFor="userName">Tên độc giả</label>
          <input id="userName" type="text" placeholder="Tên đăng nhập" />
          <label htmlFor="email">Tên độc giả</label>
          <input id="email" type="text" placeholder="Email" />
          <label htmlFor="address">Tên độc giả</label>
          <input id="address" type="text" placeholder="Địa chỉ" />
          <label htmlFor="ovrDate">Tên độc giả</label>
          <input id="ovrDate" type="text" placeholder="Ngày hết hạn" />
        </div>
        {/* <!-- LỊCH SỬ MƯỢN TRẢ SÁCH --> */}
        <div className="history-layout">
          <h1>LỊCH SỬ MƯỢN - TRẢ SÁCH</h1>
          {/*History table*/}
          <div className="list-view">
            <DataTable
              columns={columns}
              data={books}
              customStyles={CustomStyle}
              fixedHeader={"true"}
              fixedHeaderScrollHeight="490px"
            ></DataTable>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HistoryPage;
