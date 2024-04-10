import { Link } from "react-router-dom";
import { ChartLineUp } from "@phosphor-icons/react";

const SalesSidebarLinks = () => {
  return (
    <li className="nav-item">
      <Link
        className="nav-link collapsed"
        data-toggle="collapse"
        data-target="#collapseTwom99"
        aria-expanded="true"
        aria-controls="collapseTwom99"
      >
        <i className="ph">
          <ChartLineUp weight="duotone" />
        </i>
        <span>Sales</span>
      </Link>
      <div
        id="collapseTwom99"
        className="collapse"
        aria-labelledby="headingTwo"
        data-parent="#accordionSidebar"
      >
        <div className="internal collapse-inner">
          <Link className="collapse-item" to="/admin/sales-dashboard">
            <i className="bi bi-dot"></i>Dashboard
          </Link>

          <Link className="collapse-item" to="/admin/sales-services-overview">
            <i className="bi bi-dot"></i>Services
          </Link>

          <Link className="collapse-item" to="/admin/pms-vendor-overview">
            <i className="bi bi-dot"></i>Bookings
          </Link>
        </div>
      </div>
    </li>
  );
};

export default SalesSidebarLinks;
