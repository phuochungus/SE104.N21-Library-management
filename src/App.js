import './App.scss';
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/home_page/home_page'
import ReaderPage from './pages/reader_page/reader_page'
import StoragePage from './pages/storage_page/storage_page'
import ServicePage from './pages/service_page/service_page'
import StatisticsPage from './pages/statistics_page/statistics_page'
import SettingPage from './pages/setting_page/setting_page'
import AccountPage from './pages/account_page/account_page'
import handleClickPage from "./handleClickPage"

function App() {
  return (
    <div className="body-app">
      <div className="main-body">
        {/* <!-- side-bar --> */}
        <div className="side-bar">
          <ul className="nav-bar">
            <li>
              <Link className="list-item on-display" to="/" onClick={(e) => handleClickPage(e)}>
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/home.svg").default}
                  alt=""
                />
                <span>Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link className="list-item" to="/Reader" onClick={(e) => handleClickPage(e)}>
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/author.svg").default}
                  alt=""
                />
                <span>Độc giả</span>
              </Link>
            </li>
            <li>
              <Link className="list-item" to="/Storage" onClick={(e) => handleClickPage(e)}>
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/store.svg").default}
                  alt=""
                />
                <span>Kho sách</span>
              </Link>
            </li>
            <li>
              <Link className="list-item" to="/Service" onClick={(e) => handleClickPage(e)}>
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/service.svg").default}
                  alt=""
                />
                <span>Dịch vụ</span>
              </Link>
            </li>
            <li>
              <Link className="list-item" to="/Statistics" onClick={(e) => handleClickPage(e)}>
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/statistic.svg").default}
                  alt=""
                />
                <span>Thống kê</span>
              </Link>
            </li>
            <li>
              <Link className="list-item" to="/Setting" onClick={(e) => handleClickPage(e)}>
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/setting.svg").default}
                  alt=""
                />
                <span>Tùy chỉnh</span >
              </Link>
            </li>
          </ul>
          <div className="account">
            <Link className="list-item" to="/Account" onClick={(e) => handleClickPage(e)}>
              <span>Tài khoản</span>
              <img
                className="icon"
                src={require("./assets/nav-bar-icons/account.svg").default}
                alt=""
              />
            </Link>
          </div>
          <div className="sign-out-tab">
            <Link className="sign-out" to="/">Đăng xuất</Link>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/Reader" element={<ReaderPage />}></Route>
          <Route path="/Storage" element={<StoragePage />}></Route>
          <Route path="/Service" element={<ServicePage />}></Route>
          <Route path="/Statistics" element={<StatisticsPage />}></Route>
          <Route path="/Setting" element={<SettingPage />}></Route>
          <Route path="/Account" element={<AccountPage />}></Route>
        </Routes>
      </div>
    </div>
  );
}
export default App;
