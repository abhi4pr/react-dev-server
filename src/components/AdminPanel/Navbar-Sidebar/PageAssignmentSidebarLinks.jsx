import { Link, NavLink } from "react-router-dom";
import { UserFocus } from "@phosphor-icons/react";

const PageAssignmentSidebarLinks = () => {
  return (
    <li className="nav-item">
      <Link
        className="nav-link collapsed"
        data-toggle="collapse"
        data-target="#collapseTwom99s"
        aria-expanded="true"
        aria-controls="collapseTwom99s"
      >
        <i className="ph">
          <UserFocus weight="duotone" />
        </i>
        <span>Page Assignment</span>
      </Link>
      <div
        id="collapseTwom99s"
        className="collapse"
        aria-labelledby="headingTwo"
        data-parent="#accordionSidebar"
      >
        <div className="internal collapse-inner">
          <NavLink className="collapse-item" to="/admin/page-assignment">
            <i className="bi bi-dot"></i>Page Assignment
          </NavLink>
          <NavLink className="collapse-item" to="/admin/historyAssignment">
            <i className="bi bi-dot"></i>History
          </NavLink>
        </div>
      </div>
    </li>
  );
};

export default PageAssignmentSidebarLinks;
