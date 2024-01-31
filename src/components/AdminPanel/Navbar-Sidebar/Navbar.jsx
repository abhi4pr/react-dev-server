import { useNavigate, Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DoneIcon from "@mui/icons-material/Done";
import {baseUrl} from '../../../utils/config'

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

  const handleLogOut = () => {
    sessionStorage.clear("token");
    navigate("/login");
  };

  useEffect(() => {
    axios
      .post(baseUrl+"login_user_data", {
        user_id: loginUserId,
      })
      .then((res) => setLoginUserData(res.data));
  }, []);

  const fetchData = async () => {
    await axios
      .get(baseUrl+"get_all_unreden_notifications")
      .then((res) => {
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
    await axios.put(`${baseUrl}`+`update_notification/`, {
      _id: _id,
      readen: true,
    });
    fetchData();
  };

  return (
    <>
      {/* Topbar Start */}
      <nav className="navbar navbar-expand topbar shadow">
        <button className="btn sidebar_tglbtn" id="sidebarToggle">
          <i className="bi bi-list" />
        </button>
        <ul className="navbar-nav align-items-center ml-auto">
          <li className="nav-item dropdown no-arrow d-sm-none">
            <a
              className="nav-link dropdown-toggle nav_icon_link"
              id="searchDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="bi bi-search" />
            </a>
            <div
              className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
              aria-labelledby="searchDropdown"
            >
              <form className="form-inline mr-auto w-100 navbar-search">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light border-0 small"
                    placeholder="Search for..."
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="button">
                      <i className="bi bi-search" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>
          <li>
            {(RoleID == 1 || RoleID == 5) && (
              <div className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <NotificationsActiveIcon />
                  <span>{count}</span>
                </a>
                <div className="dropdown-menu">
                  {notificationData.map((notification) => (
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
                  ))}

                  <button type="button" className="btn btn-success btn-xs">
                    <Link to={`/admin/pre-onboard-all-notifications/`}>
                      See All
                    </Link>
                  </button>
                </div>
              </div>
            )}
          </li>
          <li className="nav-item">
            <div className="theme-switch">
              <input type="checkbox" id="theme-toggle" />
              <label htmlFor="theme-toggle" />
            </div>
          </li>
          <li className="nav-item dropdown no-arrow user_dropdown">
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
              {/* <Link to="/profile">
                <a className="dropdown-item">
                  <i className="bi bi-person" />
                  Profile
                </a>
              </Link> */}
              <a onClick={handleLogOut} className="dropdown-item">
                <i className="bi bi-box-arrow-left" />
                Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
      {/* Topbar End */}
    </>
  );
};
export default Navbar;
