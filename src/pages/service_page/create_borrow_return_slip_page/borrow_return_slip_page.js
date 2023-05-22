import "./borrow_return_slip_page.scss";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import CustomServiceCard from "../../../components/UI/CustomServiceCard";
import {
  TempListStyle,
  BorrowingBooksStyle,
} from "../../js/create_borrow_return_slip_page_table";

const BRSlipPage = () => {
  //define search tool
  const [bookId, setBookId] = useState("");

  //define API
  const [tempListBooksAPI, setTempListBooksAPI] = useState([]);
  const [tempListBooks, setTempListBooks] = useState([]);

  //define columns TempList + BorrowingBooks
  const TempList_Columns = [
    {},
    {
      name: "STT",
      selector: (row) => row.STT,
      sortable: true,
    },
    {
      name: "Mã sách",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Tên sách",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Tình trạng",
      selector: (row) => row.createdDate,
      sortable: true,
    },
  ];

  //define token
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI4NzMyODk3NC05NTRhLTQxMmMtODQxYS04OTRmZWYyMWUxYzAiLCJyb2xlcyI6WyJhZG1pbiIsInVzZXIiXSwiaWF0IjoxNjg0Mzg2MDg0LCJleHAiOjE2ODY5NzgwODR9.y_tGQaPEKB7ecqOH0zGA2DQK_Sos7kOsiHK-ORHiOhM";

  //fetch data TempList + BorrowingBooks
  {
    /*DANH SÁCH MƯỢN TẠM THỜI*/
  }
  useEffect(() => {
    const fetchTempList = async () => {
      await fetch(
        "https://library2.herokuapp.com/book_shelf/user/10fb6406-fa70-44ed-bdcb-898f6e4fd505",
        {
          method: "GET",
          Authorization: "Bearer " + token,
        }
      )
        .then((res) => res.json())
        .then((tempListData) =>
          setTempListBooksAPI(() => {
            setTempListBooks(tempListData);
            return tempListData;
          })
        );
    };

    fetchTempList();
  }, []);

  return (
    <div className="view">
      <h1>LẬP PHIẾU MƯỢN/TRẢ SÁCH</h1>
      <div className="cards-view">
        {/*DANH SÁCH TẠM THỜI */}
        <div className="temp-list">
          <div className="head">
            <input
              placeholder="Mã sách"
              type="text"
              id="bookId"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
            />
            <button>Tra cứu</button>
          </div>
          <div className="body">
            <CustomServiceCard>
              <header>DANH SÁCH TẠM THỜI</header>
              <DataTable
                data={tempListBooks}
                columns={TempList_Columns}
                customStyles={TempListStyle}
                fixedHeader={"true"}
                fixedHeaderScrollHeight="490px"
              />
            </CustomServiceCard>
          </div>
        </div>
        {/*SÁCH ĐANG MƯỢN */}
        <div className="borrowing-books-list">
          <div className="head">
            <input
              placeholder="Tên đăng nhập"
              type="text"
              id="bookId"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
            />
            <button>Trưu Cá</button>
          </div>
          <div className="body">
            <CustomServiceCard>
              <header className="body header">SÁCH ĐANG MƯỢN</header>
              <div className="body table">
                <DataTable
                  fixedHeader={"true"}
                  fixedHeaderScrollHeight="490px"
                />
              </div>
              <div className="body bottom">
                <button className="print-button">In phiếu trả sách</button>
              </div>
            </CustomServiceCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BRSlipPage;
