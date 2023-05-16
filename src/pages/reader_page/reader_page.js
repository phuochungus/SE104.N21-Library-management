import DataTable from "react-data-table-component";
import "./reader_page.scss";
import { CustomStyle } from "../js/table_props";
import { useEffect, useState } from "react";

export default function ReadesrPage() {
  const [dataReaders, setDataReaders] = useState([
    {
      STT: 1,
      nameID: "NguyenVanA",
      fullName: "Nguyễn Văn A",
      type: "Thường",
      address: "Hà Nội",
      email: "sat@sat.com",
      dateCreated: "20/10/2020",
    },
  ]);

  const [readerColumns] = useState([
    {
      name: "STT",
      selector: (row) => row.STT,
      sortable: true,
    },
    {
      name: "Tên đăng nhập",
      selector: (row) => row.nameID,
      sortable: true,
    },
    {
      name: "Họ tên độc giả",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Loại",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Địa chỉ",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Ngày lập thẻ",
      selector: (row) => row.dateCreated,
    },
    {
      name: "Action",
      selector: (row) => row.Action,
    },
  ]);

  useEffect(() => {
    dataReaders.map((ele, index) => {
      ele.STT = index + 1;
      ele.Action = (
        <div className="action">
          <span
            // onClick={() => handleClickInfo(ele, index)}
            style={{ cursor: "pointer" }}
          >
            <img
              className="icon icon-hover"
              src={require("./img/info.svg").default}
              alt="icon-1"
            />
          </span>
          <span style={{ cursor: "pointer" }}>
            <img
              className="icon icon-hover"
              src={require("./img/edit.svg").default}
              alt="icon-2"
            />
          </span>
        </div>
      );
      return ele;
    });
    setDataReaders(dataReaders);
  }, [dataReaders]);
  return (
    <div className="home-page">
      <div className="main-title">
        <span>ĐỘC GIẢ</span>
      </div>
      <div className="main-content">
        <div className="search-tool-block">
          <div
            style={{ textAlign: "center", width: "70%", padding: "0 0 20px 0" }}
          >
            <div className="search-tool-no-margin">
              <input
                className="input"
                placeholder="Tên đăng nhập"
                type="text"
                id="account-name"
              />
              <input
                className="input"
                placeholder="Tên độc giả"
                type="text"
                id="book-name"
              />
              <select
                className="input"
                placeholder="Loại độc giả"
                id="author-name"
              >
                <option>Thể loại</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
              <input
                className="input"
                placeholder="Tên độc giả"
                type="date"
                id="book-name"
              />
            </div>
            <button className="button-submit">Tra cứu</button>
          </div>
          <div style={{ width: "30%" }}>
            <div style={{ display: "flex" }}>
              <button className="button-add-reader">Thêm thẻ độc giả</button>
              <button className="button-remove-reader">Xóa</button>
            </div>
            <div className="div-error-remove-reader">
              Lỗi: xoá thất bại! Vui lòng thử lại.
            </div>
          </div>
        </div>

        <div className="data-table">
          <DataTable
            columns={readerColumns}
            data={dataReaders}
            fixedHeader={"true"}
            fixedHeaderScrollHeight="490px"
            customStyles={CustomStyle}
          />
        </div>
      </div>
    </div>
  );
}
