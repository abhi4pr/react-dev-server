import { Link } from "react-router-dom";
import SidebarLinks from "./SidebarLinks";
import Logo from "../../../assets/logo.png";
const SideBar = () => {
  return (
    <>
      <ul className="navbar-nav sidebar shadow accordion" id="accordionSidebar" style={{
        overflowX:"scroll "
      }} >
        <Link className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <img src={Logo} alt="logo" width={40} height={40} />
          </div>
          <div className="sidebar-brand-text">
            <h4>
              Creative<span>fuel</span>
            </h4>
          </div>
        </Link>
        <SidebarLinks />
        <div className="text-center sidebar_toggle sidebar_footer">
          <div className="footer_cprgt">
            <h6>© Copyright 2023 | Creativefuel</h6>
          </div>
        </div>
      </ul>
    </>
  );
};

export default SideBar;
