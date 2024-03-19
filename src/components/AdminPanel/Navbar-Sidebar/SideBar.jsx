import { Link } from "react-router-dom";
import SidebarLinks from "./SidebarLinks";
import Logo from "../../../assets/logo.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
const SideBar = () => {
  return (
    <>
      <ul className="navbar-nav sidebar shadow accordion" id="accordionSidebar">
        <label htmlFor="nav-toggle" id="sidebarToggle">
          <div className="circle">
            <i className="bi bi-chevron-left"></i>
          </div>
        </label>
        {/* <Link className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <img src={Logo} alt="logo" width={40} height={40} />
          </div>
          <div className="sidebar-brand-text">
            <h4>
              Creative<span>fuel</span>
            </h4> 
          </div>
        </Link> */}
        <div className="links">
          <SidebarLinks />
        </div>
        <div className="pack">
          <div className="radial"></div>
          <div className="copyright-sec">
            ⓒ <span>2023 |</span> <p>CreativeFuel</p>
          </div>
        </div>
      </ul>
    </>
  );
};

export default SideBar;
