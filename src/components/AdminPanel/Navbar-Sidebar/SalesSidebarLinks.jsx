import { Link, NavLink } from "react-router-dom";
import { ChartLineUp } from "@phosphor-icons/react";

const SalesSidebarLinks = () => {
  return (
    <li className="nav-item">
      <Link
        className="nav-link nav-btn collapsed"
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
          <NavLink className="collapse-item" to="/admin/sales-dashboard">
            <i className="bi bi-dot" />
            Dashboard
          </NavLink>

          <NavLink
            className="collapse-item"
            to="/admin/sales-services-overview"
          >
            <i className="bi bi-dot" />
            Services
          </NavLink>

          <NavLink className="collapse-item" to="/admin/pms-vendor-overview">
            <i className="bi bi-dot" />
            Bookings
          </NavLink>
          <NavLink
            className="collapse-item"
            to="/admin/view-credit-reason-approval"
          >
            <i className="bi bi-dot" />
            Credit Reason Approval
          </NavLink>
          <NavLink className="collapse-item" to="/admin/view-sales-booking">
            <i className="bi bi-dot" />
            Sale Booking Overview
          </NavLink>

          <NavLink className="collapse-item" to="/admin/deleted-sales-booking">
            <i className="bi bi-dot" />
            Deleted Sale Booking
          </NavLink>
          <NavLink
            className="collapse-item"
            to="/admin/pending-payment-request-sales"
          >
            <i className="bi bi-dot" />
            Pending Payment Request
          </NavLink>
          <NavLink
            className="collapse-item"
            to="/admin/rejected-payment-request-sales"
          >
            <i className="bi bi-dot" />
            Rejected Payment Request
          </NavLink>
          <NavLink className="collapse-item" to="/admin/record-servcies">
            <i className="bi bi-dot" />
            Record Services
          </NavLink>

          <NavLink className="collapse-item" to="/admin/view-payment-update">
            <i className="bi bi-dot" />
            Payment Update
          </NavLink>

          <NavLink className="collapse-item" to="/admin/view-payment-mode">
            <i className="bi bi-dot" />
            Payment Mode
          </NavLink>

          <NavLink className="collapse-item" to="/admin/view-payment-details">
            <i className="bi bi-dot" />
            Payment Details
          </NavLink>

          <NavLink className="collapse-item" to="/admin/credit-approval">
            <i className="bi bi-dot" />
            Credit Approval
          </NavLink>

          <NavLink className="collapse-item" to="/admin/sales-account-overview">
            <i className="bi bi-dot" />
            Account Overview
          </NavLink>
        </div>
      </div>
    </li>
  );
};

export default SalesSidebarLinks;
