import './Main.scss';
import { useContext } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/home_page/home_page'
import ReaderPage from './pages/reader_page/reader_page'
import StoragePage from './pages/storage_page/storage_page'
import ServicePage from './pages/service_page/service_page'
import StatisticsPage from './pages/statistics_page/statistics_page'
import SettingPage from './pages/setting_page/setting_page'
import AccountPage from './pages/account_page/account_page'
import AcceptSignOut from './accept_SignOut'
import BorrowByGenres from './pages/statistics_page/borrowByGenres'
import PassDue from './pages/statistics_page/passDue'
import Info from './pages/account_page/userInfo'
import UserCart from './pages/account_page/user_cart'
import { AppContext } from './App'
import BRPage from './pages/service_page/BR_Page/BRPage'
import BorrowPage from './pages/service_page/Borrow_Page/borrow_Page'
import ReturnPage from './pages/service_page/Return_Page/return_Page'
import BRHistoryPage from './pages/service_page/BRHistory_Page/BRHistory_Page'
import BorrowCardPage from './pages/service_page/BorrowCard_Page/BorrowCard'
import ReturnCardPage from './pages/service_page/ReturnCard_Page/ReturnCard'
import UserHistoryPage from './pages/service_page/userHistory_Page/UserHistory'
import MyHistoryPage from './pages/service_page/myHistory/myHistory'
import AdminInfo from './pages/account_page/adminInfo'
import ChangePassPage from './pages/account_page/changePass/changePass'

function Main() {
  const { isAdmin } = useContext(AppContext);

  function handleSignOut() {
    const overLay = document.querySelector("#overlay")
    overLay.style.display = "flex"
    const acceptTable = document.querySelector(".accept-signout")
    acceptTable.style.display = "flex"
  }

  return (
    <div className="body-app">
      <div className="main-body">
        <AcceptSignOut />
        {/* <!-- side-bar --> */}
        <div className="side-bar">
          <ul className="nav-bar">
            <li>
              <NavLink id="Home" className="list-item" to="/">
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/home.svg").default}
                  alt=""
                />
                <span>Trang chủ</span>
              </NavLink>
            </li>
            {(!isAdmin) || <li>
              <NavLink id="Reader" className="list-item" to="/Reader" >
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/author.svg").default}
                  alt=""
                />
                <span>Độc giả</span>
              </NavLink>
            </li>}
            {(!isAdmin) || <li>
              <NavLink id="Storage" className="list-item" to="/Storage" >
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/store.svg").default}
                  alt=""
                />
                <span>Kho sách</span>
              </NavLink>
            </li>}
            <li>
              <NavLink id="Service" className="list-item" to="/Service" >
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/service.svg").default}
                  alt=""
                />
                <span>Dịch vụ</span>
              </NavLink>
            </li>
            {(!isAdmin) || <li>
              <NavLink id="Statistics" className="list-item" to="/Statistics" >
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/statistic.svg").default}
                  alt=""
                />
                <span>Thống kê</span>
              </NavLink>
            </li>}
            {(!isAdmin) || <li>
              <NavLink id="Setting" className="list-item" to="/Setting" >
                <img
                  className="icon"
                  src={require("./assets/nav-bar-icons/setting.svg").default}
                  alt=""
                />
                <span>Tùy chỉnh</span >
              </NavLink>
            </li>}
          </ul>
          <div className="account">
            <NavLink className="list-item" to="/Account">
              <span>Tài khoản</span>
              <img
                className="icon"
                src={require("./assets/nav-bar-icons/account.svg").default}
                alt=""
              />
            </NavLink>
          </div>
          <div className="sign-out-tab">
            <div onClick={handleSignOut} className="sign-out" >Đăng xuất</div>
          </div>
        </div>
        <Routes>
          {/* HomePage */}
          <Route path="/" element={<HomePage />}></Route>
          {/* ReaderPage */}
          <Route path="/Reader" element={<ReaderPage />}></Route>
          {/* StoragePage */}
          <Route path="/Storage" element={<StoragePage />}></Route>
          {/* ServicePage */}
          <Route path="/Service" element={<ServicePage />}></Route>
          <Route path="/Service/BRSlip" element={<BRPage />}></Route>
          <Route path="/Service/Borrow" element={<BorrowPage />}></Route>
          <Route path="/Service/Return" element={<ReturnPage />}></Route>
          <Route path="/Service/BRHistory" element={<BRHistoryPage />}></Route>
          <Route path="/BorrowCard" element={<BorrowCardPage />}></Route>
          <Route path="/ReturnCard" element={<ReturnCardPage />}></Route>
          <Route path="/Service/BRHistory/UserHistory" element={<UserHistoryPage />}></Route>
          <Route path="/Service/MyHistory" element={<MyHistoryPage />}></Route>
          {/* StatisticsPage */}
          <Route path="/Statistics" element={<StatisticsPage />}></Route>
          <Route path="/Statistics/Genres" element={<BorrowByGenres />}></Route>
          <Route path="/Statistics/Passdue" element={<PassDue />}></Route>
          {/* SettingPage */}
          <Route path="/Setting/*" element={<SettingPage />}></Route>
          {/* AccountPage */}
          <Route path="/Account" element={<AccountPage />}></Route>
          <Route path="/Account/Cart" element={<UserCart />}></Route>
          <Route path="/Account/Info" element={<Info />}></Route>
          <Route path="/Account/AdminInfo" element={<AdminInfo />}></Route>
          <Route path="/Account/ChangePass" element={<ChangePassPage />}></Route>
        </Routes>
        <div id="overlay"></div>
      </div>
    </div>
  );
}
export default Main;
