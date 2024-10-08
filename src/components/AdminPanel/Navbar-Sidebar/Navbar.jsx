import { useNavigate, Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DoneIcon from "@mui/icons-material/Done";
import { baseUrl } from "../../../utils/config";
import logo from "../../../assets/logo.png";
import { List } from "@phosphor-icons/react";
const Navbar = () => {
  const [count, setCount] = useState(0);
  const [loginUserData, setLoginUserData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userName = decodedToken.name;
  const loginUserId = decodedToken.id;
  const RoleID = decodedToken.role_id;
  const user_role = () => {
    if (RoleID == 1) {
      return "Admin";
    } else if (RoleID == 2) {
      return "Manager";
    } else if (RoleID == 3) {
      return "Office Boy";
    } else if (RoleID == 4) {
      return "User";
    } else if (RoleID == 5) {
      return "HR";
    }
  };
  const handleLogOut = () => {
    sessionStorage.clear("token");
    navigate("/login");
  };

  useEffect(() => {
    axios
      .post(baseUrl + "login_user_data", {
        user_id: loginUserId,
      })
      .then((res) => setLoginUserData(res.data));
  }, []);
  const fetchData = async () => {
    await axios.get(baseUrl + "get_all_unreden_notifications").then((res) => {
      setNotificationData(res.data.data);
      setCount(res.data.data.length);
    });
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const NotificationsOff = async (_id) => {
    // e.preventDefault();
    await axios.put(`${baseUrl}` + `update_notification/`, {
      _id: _id,
      readen: true,
    });
    fetchData();
  };

  return (
    <>
      {/* Topbar Start */}
      <nav className="navbar navbar-expand topbar ">
        {/* <button className="btn sidebar_tglbtn" id="sidebarToggle">
          <i className="bi bi-list" />
        </button> */}
        <div className="topbarBrand">
          <div className="branding">
            <div className="logo-1">
              <img className="logo-img" src={logo} alt="logo" width={40} />
            </div>
            <div className="brandtext">
              Creative <span>fuel</span>
            </div>
          </div>
        </div>
        <ul className="navbar-nav align-items-center ml-auto w-100 blurBg">
          <li className="nav-item ml-0 mr-auto ">
            <label className="icon" for="nav-toggle" id="sidebarToggle">
              <div class="circle">
                <i className="ph">
                  <List />
                </i>
              </div>
            </label>
          </li>
          <li className="nav-item">
            <div className="navBadge">
              <div className="navBadgeImg"></div>
              <div className="navBadgeTxt"></div>
            </div>
          </li>
          <li className="nav-item">
            <div className="theme-switch">
              <input type="checkbox" id="theme-toggle" />

              <label htmlFor="theme-toggle">
                <div className="theme-sw icon">
                  <i className="bi bi-brightness-high"></i>
                  <i className="bi bi-moon-stars-fill"></i>
                </div>
              </label>
            </div>
          </li>
          <li>
            {(RoleID == 1 || RoleID == 5) && (
              <div className="nav-item dropdown">
                <a
                  className="nav-link"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <div
                    className="icon"
                    data-bs-toggle="collapse"
                    data-bs-target="#Notificationbar"
                    aria-expanded="false"
                    aria-controls="Notificationbar"
                    alt=""
                    width={20}
                  >
                    <i class="bi bi-bell"></i>
                  </div>
                  {/* <NotificationsActiveIcon /> */}
                  {/* <span>{count}</span> */}
                </a>
                <div className="dropdown-menu notification  dropdown-menu-right shadow animated--grow-in mt1">
                  <div className="pack">
                    <div className="head-label">
                      Notification
                      <span>{count}</span>
                    </div>
                    <div className="pack-1">
                      {notificationData.map((notification) => (
                        <div
                          className="message"
                          id={notificationData._id}
                          key={notification._id}
                          onClick={() => NotificationsOff(notification._id)}
                        >
                          <div className="ppimg">
                            <img src={imageTest1} alt="" w={34} />
                          </div>
                          <div className="txt">
                            {notification.notification_message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link to={`/admin/pre-onboard-all-notifications/`}>
                    <div className="all-notification">
                      See all notifications
                    </div>
                  </Link>
                  {/* {notificationData.map((notification) => (
                    <div>
                      <div
                        id={notificationData._id}
                        aria-labelledby="headingOne"
                      >
                        {" - " + notification.notification_message}
                        <DoneIcon
                          onClick={() => NotificationsOff(notification._id)}
                        />
                      </div>
                    </div>
                  ))} */}

                  {/* <button type="button" className="btn btn-success btn-xs">
                    <Link to={`/admin/pre-onboard-all-notifications/`}>
                      See All
                    </Link>
                  </button> */}
                </div>
              </div>
            )}
          </li>
          {/* <li className="nav-item dropdown no-arrow user_dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span>{userName}</span>
              {loginUserData[0]?.image == null ? (
                <img className="img-profile" src={imageTest1} />
              ) : (
                // loginUserData.map((d) => (
                <img
                  key={1}
                  className="img-profile"
                  src={loginUserData[0]?.image}
                  alt="user"
                />
                // ))
              )}
            </a>
            <div
              className="dropdown-menu dropdown-menu-right shadow animated--grow-in mt16"
              aria-labelledby="userDropdown"
            >
               <Link to="/profile">
                <a className="dropdown-item">
                  <i className="bi bi-person" />
                  Profile
                </a>
              </Link>   
              <a onClick={handleLogOut} className="dropdown-item">
                <i className="bi bi-box-arrow-left" />
                Logout
              </a>
            </div>
          </li> */}
          <li className="nav-item dropdown no-arrow user_dropdown">
            {/* <a
              className="nav-link dropdown-toggle"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span>{userName}</span>
              {loginUserData[0]?.image == null ? (
                <img className="img-profile" src={lalit} />
              ) : (
                // loginUserData.map((d) => (
                <img
                  key={1}
                  className="img-profile"
                  src={loginUserData[0]?.image}
                  alt="user"
                />
                // ))
              )}
            </a> */}
            <div
              className="profile-sec nav-link dropdown-toggle"
              id="userDropdown"
              data-toggle="dropdown"
              data-bs-toggle="collapse"
              data-bs-target="#Profilebar"
              aria-expanded="false"
              aria-haspopup="true"
              aria-controls="Profilebar"
            >
              {loginUserData[0]?.image == null ? (
                <div className="profile-img">
                  <img src={imageTest1} alt="" width={40} />
                </div>
              ) : (
                // loginUserData.map((d) => (
                <img
                  key={1}
                  className="img-profile"
                  src={loginUserData[0]?.image}
                  alt="user"
                />
                // ))
              )}
              <div className="profile-name">
                <p>{userName}</p>
                <span>{user_role()}</span>
              </div>
            </div>
            <div
              className="dropdown-menu profilebar dropdown-menu-right shadow animated--grow-in mt16"
              aria-labelledby="userDropdown"
            >
              {/* <Link to="/profile">
                <a className="dropdown-item">
                  <i className="bi bi-person" />
                  Profile
                </a>
              </Link> */}
              <div className="profile-tab">
                <div className="profile-img">
                  <img
                    className="logo-img"
                    src={imageTest1}
                    alt=""
                    width={40}
                  />
                </div>
                <div className="profile-name">
                  <p>{userName}</p>
                  <span>{user_role()}</span>
                </div>
              </div>
              <div className="pack">
                <div className="pro-btn">
                  <i class="bi bi-person"></i>
                  <p>My profile</p>
                </div>
                <Link to="/admin/user-timeline">
                  <div className="pro-btn">
                    <i class="bi bi-gear"></i>
                    <p>Timeline</p>
                  </div>
                </Link>
                <div className="pro-btn" onClick={handleLogOut}>
                  <i class="bi bi-box-arrow-right"></i>
                  <p>Logout</p>
                </div>
              </div>
              {/* <a onClick={handleLogOut} className="dropdown-item">
                <i className="bi bi-box-arrow-left" />
                Logout
              </a> */}
            </div>
          </li>
        </ul>
      </nav>
      {/* Topbar End */}
    </>
  );
};
export default Navbar;
