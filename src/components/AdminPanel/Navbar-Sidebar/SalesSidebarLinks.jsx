import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChartLineUp } from "@phosphor-icons/react";
import getDecodedToken from "../../../utils/DecodedToken";

const SalesSidebarLinks = () => {
  const token = getDecodedToken();
  const navigate = useNavigate();

  let loginUserId;
  const loginUserRole = token.role_id;
  if (loginUserRole !== 1) {
    loginUserId = token.id;
  }
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
          <NavLink className="collapse-item" to="/admin/sales-account-overview">
            <i className="bi bi-dot" />
            Account
          </NavLink>
          <NavLink className="collapse-item" to="/admin/view-sales-booking">
            <i className="bi bi-dot" />
            Sales Booking
          </NavLink>
          <NavLink
            className="collapse-item"
            to={
              loginUserRole === 1
                ? "/admin/sales-incentive-dashboard"
                : {
                    pathname: "/admin/sales-user-incentve",
                    state: { id: loginUserId, name: "monthwise" },
                  }
            }
          >
            <i className="bi bi-dot" />
            Dashboard
          </NavLink>
        </div>
      </div>
    </li>
  );
};

export default SalesSidebarLinks;
