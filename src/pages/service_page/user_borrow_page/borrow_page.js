import "./borrow_page.scss";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CustomStyle } from "../../js/service_borrow_table";


const BorrowPage = () => {
  //Define seacrh-tool
  const [name, setName] = useState("");
  const [usrname, setUsrname] = useState("");
  const [date, setDate] = useState("");

  //define API
  const [API] = useState();
  const [userAPI, setUserAPI] = useState([]);
  const [users, setUsers] = useState([]);

  //Table columns
  const columns = [
    {
      name: "STT",
      selector: (row) => row.STT,
      sortable: true,
    },
    {
      name: "Tên đăng nhập",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Tên độc giả",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Ngày mượn",
      selector: (row) => row.createdDate,
      sortable: true,
    },
    {
      name: "Số lượng",
      selector: (row) => row.quantity,
      sortable: true,
    },
    {
      name: "Chi tiết",
      selector: (row) => row.Action,
    },
  ];

  //fetch Data
  useEffect(() => {
    const fetchUsers = async () => {
      await fetch("https://library2.herokuapp.com/book_borrow_sessions", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((usersData) =>
          setUserAPI(() => {
            setUsers(usersData);
            return usersData;
          })
        );
    };

    fetchUsers().catch((error) => console.log(error));
  }, [API]);

  //Display users
  useEffect(() => {
    users &&
      users.map((ele, index) => {
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
  }, [users]);

  const handleClickInfo = () => {};
  const handleClickSearch = () => {};
  return (
    <div className="view">
      <h1>DỊCH VỤ MƯỢN SÁCH</h1>
      <div className="user-list-view">
        <div className="search-bar">
          <input
            placeholder="Tên độc giả"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Tên đăng nhập"
            type="text"
            id="username"
            value={usrname}
            onChange={(e) => setUsrname(e.target.value)}
          />
          <input
            placeholder="Ngày mượn"
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={handleClickSearch}>Tra cứu</button>
        </div>
        <div className="table">
          <DataTable
            columns={columns}
            data={users}
            customStyles={CustomStyle}
            fixedHeader={"true"}
            fixedHeaderScrollHeight="490px"
          />
        </div>
      </div>
    </div>
  );
};

export default BorrowPage;
