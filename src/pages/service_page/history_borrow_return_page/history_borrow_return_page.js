import DataTable from "react-data-table-component";
import { CustomStyle } from "../../js/hbrp_table";
import { useState, useEffect } from "react";
import "./history_borrow_return_page.scss";

const HistoryBRPage = (props) => {
  //Define seacrh-tool
  const [name, setName] = useState("");
  const [usrname, setUsrname] = useState("");

  //define API
  const [API] = useState();
  const [userAPI, setUserAPI] = useState([]);
  const [users, setUsers] = useState([]);

  //define token
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI4NzMyODk3NC05NTRhLTQxMmMtODQxYS04OTRmZWYyMWUxYzAiLCJyb2xlcyI6WyJhZG1pbiIsInVzZXIiXSwiaWF0IjoxNjg0Mzg2MDg0LCJleHAiOjE2ODY5NzgwODR9.y_tGQaPEKB7ecqOH0zGA2DQK_Sos7kOsiHK-ORHiOhM";

  //Table columns
  const columns = [
    {
      name: "STT",
      selector: (row) => row.STT,
      sortable: true,
    },
    {
      name: "Tên đăng nhập",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Tên độc giả",
      selector: (row) => row.username,
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
      await fetch("https://library2.herokuapp.com/users", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
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
      <h1>LỊCH SỬ MƯỢN/TRẢ SÁCH</h1>
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

export default HistoryBRPage;
