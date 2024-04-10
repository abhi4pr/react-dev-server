import { Link } from "react-router-dom";

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
        <i className="bi bi-person-gear" />
        <span>Page Assignment</span>
      </Link>
      <div
        id="collapseTwom99s"
        className="collapse"
        aria-labelledby="headingTwo"
        data-parent="#accordionSidebar"
      >
        <div className="internal collapse-inner">
          <Link className="collapse-item" to="/admin/page-assignment">
            <i className="bi bi-dot"></i>Page Assignment
          </Link>
          <Link className="collapse-item" to="/admin/historyAssignment">
            <i className="bi bi-dot"></i>History
          </Link>
        </div>
      </div>
    </li>
  );
};

export default PageAssignmentSidebarLinks;
