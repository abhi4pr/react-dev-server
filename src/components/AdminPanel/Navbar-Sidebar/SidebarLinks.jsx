import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import SalesSidebarLinks from "./SalesSidebarLinks";
import {
  Gauge,
  IdentificationBadge,
  House,
  Laptop,
  CurrencyInr,
  FolderSimpleStar,
  UserRectangle,
  Files,
} from "@phosphor-icons/react";
import { constant } from "../../../utils/constants";
import ExenseManagement from "./ExenseManagementSidebarLinks";

const SidebarLinks = () => {
  const [contextData, setData] = useState([]);
  const [allCount, setAllCount] = useState();
  const [ownCount, setOwnCount] = useState();
  const [otherCount, setOtherCount] = useState();
  const [jobType, setJobtype] = useState("");

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const RoleId = decodedToken.role_id;
  const job_type = decodedToken.job_type;

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
        .then((res) => {
          setData(res.data);
        });
      axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
        setJobtype(res.data.job_type);
      });
    }
  }, [userID]);

  useEffect(() => {
    const formData = new URLSearchParams();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        const filterVendorId = res.data.body.filter(
          (check) => check.vendor_id == "8"
        ).length;
        setOwnCount(filterVendorId);
        const filterVendorId1 = res.data.body.length;
        setAllCount(filterVendorId1);
        const filterVendorId2 = res.data.body.filter(
          (check) => check.vendor_id !== "8"
        ).length;
        setOtherCount(filterVendorId2);
      });
  }, []);

  const isUserManagementVisible = [0, 1, 2, 6, 16, 23].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isWFHVisible = [17, 19].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isPantryManagementVisible = [5, 8, 9].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isOnboardingVisible = [18, 20, 21].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isLeadManagementVisible = [22].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isExecutionVisible = [24, 31, 32, 34, 46].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isInstaApiVisible = [25].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isWFHDManager = [37].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isWFHDHRPayrollManager = [38].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isAssetNotifierVisible = [40].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isTaskManagment = [43].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isPHPFinance = [44].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isOpration = [42].some((index) => contextData[index]?.view_value === 1);
  const isCustomer = [50].some((index) => contextData[index]?.view_value === 1);
  const isPageManagement = [51].some(
    (index) => contextData[index]?.view_value === 1
  );
  const isSales = [52].some((index) => contextData[index]?.view_value === 1);
  const isAssets = [53].some((index) => contextData[index]?.view_value === 1);
  const isExenseManagement = [54].some(
    (index) => contextData[index]?.view_value === 1
  );

  // const isWFHDuser  = [].some(index=>context )
  const activelink = useLocation().pathname;
  return (
    <>
      <li className="nav-item nav-item-single">
        <Link
          className={`nav-btn nav-link ${
            activelink === "/admin" ? "active" : ""
          }`}
          to="/admin"
        >
          <i className="ph">
            <Gauge weight="duotone" />
          </i>
          <span>Dashboard</span>
        </Link>
      </li>

      {/* USER MANAGEMENT */}
      {isUserManagementVisible && (
        <li className="nav-item">
          <Link
            className="nav-btn nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            <i className="ph">
              <IdentificationBadge weight="duotone" />
            </i>
            <span>User Management</span>
          </Link>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="collapse-inner internal">
              {/* {contextData &&
                contextData[0] &&
                contextData[0].view_value === 1 && (
                  <NavLink
                    className="collapse-item"
                    to="/admin/users-dashboard"
                  >
                    <i className="bi bi-dot"></i> User Dashboard
                  </NavLink>
                )} */}
              {contextData &&
                contextData[0] &&
                contextData[0].view_value === 1 && (
                  <NavLink
                    className="collapse-item"
                    to={`/admin/user-overview/${"Active"}`}
                  >
                    <i className="bi bi-dot"></i> User
                  </NavLink>
                )}

              {/* Asset Management here  */}
              {isAssets && (
                <li className="nav-item">
                  <a
                    className="nav-btn nav-link collapsed"
                    data-toggle="collapse"
                    data-target="#collapsInnerOneModifyTwo"
                    aria-expanded="true"
                    aria-controls="collapsInnerOneModifyTwo"
                  >
                    <i className="ph">
                      <FolderSimpleStar weight="duotone" />
                    </i>
                    <span>Assets</span>
                  </a>
                  <div
                    id="collapsInnerOneModifyTwo"
                    className="collapse"
                    aria-labelledby="headingTwoOne"
                  >
                    <div className="internal collapse-inner">
                      {RoleId == 5 && (
                        <NavLink
                          className="collapse-item"
                          to="/admin/asset-dashboard"
                        >
                          <i className="bi bi-dot"></i> Dashboard
                        </NavLink>
                      )}
                      <NavLink
                        className="collapse-item"
                        to="/admin/asset-single-user"
                      >
                        <i className="bi bi-dot"></i> My Asset
                      </NavLink>
                      {RoleId == 5 && (
                        <NavLink
                          className="collapse-item"
                          to={`/sim-overview/${0}`}
                        >
                          <i className="bi bi-dot"></i> Asset Management
                        </NavLink>
                      )}
                      {RoleId == 5 && (
                        <NavLink
                          className="collapse-item"
                          to="/admin/asset-visible-to-hr"
                        >
                          <i className="bi bi-dot"></i> Asset's Request
                        </NavLink>
                      )}
                      <NavLink
                        className="collapse-item"
                        to="/admin/asset-visible-to-taged-person"
                      >
                        <i className="bi bi-dot"></i> Tagged Asset
                      </NavLink>
                      {RoleId == 2 && (
                        <NavLink
                          className="collapse-item"
                          to="/admin/asset-manager"
                        >
                          <i className="bi bi-dot"></i> Asset Request Approvel
                        </NavLink>
                      )}
                      {RoleId == 5 && (
                        <NavLink
                          className="collapse-item"
                          to="/admin/asset-repair-return-summary"
                        >
                          <i className="bi bi-dot"></i> Return Summary
                        </NavLink>
                      )}
                      {RoleId == 5 && (
                        <NavLink
                          className="collapse-item"
                          to="/admin/asset-repair-summary"
                        >
                          <i className="bi bi-dot"></i> Repair Summary
                        </NavLink>
                      )}
                      {RoleId == 5 && (
                        <NavLink
                          className="collapse-item"
                          to="/admin/asset-vendor-summary"
                        >
                          <i className="bi bi-dot"></i> Vendor Summary
                        </NavLink>
                      )}
                    </div>
                  </div>
                </li>
              )}

              {/* <NavLink
                className="collapse-item"
                to="/admin/only-pre-onboard-user-data"
              >
                Pre Onboarding
              </NavLink> */}

              {contextData &&
                contextData[21] &&
                contextData[21].view_value === 1 && (
                  <NavLink className="collapse-item" to="/admin/user-directory">
                    <i className="bi bi-dot"></i> User Directory
                  </NavLink>
                )}

              {/* {contextData &&
                contextData[1] &&
                contextData[1].view_value === 1 && (
                  <NavLink
                    className="collapse-item"
                    to="/admin/user-respons-overivew"
                  >
                    <i className="bi bi-dot"></i> User Responsibility
                  </NavLink>
                )} */}
              {/* {contextData &&
                contextData[2] &&
                contextData[2].view_value === 1 && (
                  <NavLink
                    className="collapse-item"
                    to="/admin/object-overview"
                  >
                    <i className="bi bi-dot"></i> Object
                  </Link>
                )} */}

              {contextData &&
                contextData[6] &&
                contextData[6].view_value === 1 && (
                  <NavLink
                    className="collapse-item"
                    to="/admin/office-mast-overview"
                  >
                    <i className="bi bi-dot"></i> Office
                  </NavLink>
                )}

              {/* {contextData &&
                contextData[16] &&
                contextData[16].view_value === 1 && (
                  <>
                    <NavLink
                      className="collapse-item"
                      to="/admin/responsibility-overview"
                    >
                      <i className="bi bi-dot"></i> Responsibility Register
                    </NavLink>
                  </>
                )} */}

              {/* <Link className="collapse-item" to="/admin/jobType">
                <i className="bi bi-dot"></i> Job Type
              </Link> */}
              {/* <Link className="collapse-item" to="/sim-overview">
                Asset Management
              </NavLink> */}
              {/* <NavLink className="collapse-item" to="/admin/user-graph">
                <i className="bi bi-dot"></i> User Graphs
              </NavLink> */}
              {/* <NavLink
                className="collapse-item"
                to="/admin/email-template-overview"
              >
                <i className="bi bi-dot"></i> Email Templates
              </NavLink> */}
            </div>
          </div>
        </li>
      )}
      {/* USER MANAGEMENT */}

      {/*WFHD USER */}
      {job_type == "WFHD" && RoleId == 4 && (
        <li className="nav-item">
          <Link
            className="nav-btn nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapseFourddnm"
            aria-expanded="true"
            aria-controls="collapseFourddnm"
          >
            <i className="bi bi-person-gear" />
            <span>Payout</span>
          </Link>

          <div
            id="collapseFourddnm"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className=" collapse-inner internal">
              {/* <NavLink
                className="collapse-item"
                to="/admin/view-edit-digital-signature"
              >
                Digital Signature
              </NavLink>

              <NavLink className="collapse-item" to="/admin/wfh-template-overview">
                Change/View Template
              </NavLink> */}

              <NavLink className="collapse-item" to="/admin/wfh-single-user">
                <i className="bi bi-dot"></i> Payout Summary
              </NavLink>
              <NavLink className="collapse-item" to="/admin/user-summary">
                <i className="bi bi-dot"></i> User Summary
              </NavLink>

              {/* <NavLink
                className="collapse-item"
                to="/admin/dispute-overview"
                state={{ id: userID }}
              >
                Dispute Summary
              </NavLink> */}
            </div>
          </div>
        </li>
      )}
      {/* WFHD USER */}

      {/* PAYOUT HR / MANAGER ACCOUNTS */}
      {(isWFHDManager || isWFHDHRPayrollManager) && ( 
      <li className="nav-item">
        <a
          className="nav-btn nav-link collapsed"
          data-toggle="collapse"
          data-target="#collapsInnerOneModify"
          aria-expanded="true"
          aria-controls="collapsInnerOneModify"
        >
          <i className="ph">
            <House weight="duotone" />
          </i>
          <span>{RoleId == 2 ? "Team" : "HR"}</span>
        </a>
        <div
          id="collapsInnerOneModify"
          className="collapse"
          aria-labelledby="headingTwo"
        >
          <li className="nav-item">
            <Link
              className="nav-btn nav-link collapsed"
              data-toggle="collapse"
              data-target="#collapseFourcc"
              aria-expanded="true"
              aria-controls="collapseFourcc"
            >
              <i className="bi bi-dash"></i>
              <span>Payout</span>
            </Link>
            <div
              id="collapseFourcc"
              className="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionSidebar"
            >
              <div className="internal collapse-inner">
                {RoleId !== constant.CONST_MANAGER_ROLE && (
                  <NavLink
                    className="collapse-item"
                    to="/admin/wfhd-analytic-dashbaord"
                  >
                    <i className="bi bi-dot"></i> WFHD Dashboard
                  </NavLink>
                )}
                {/* <NavLink className="collapse-item" to="/admin/billing-overview">
                    Billing Header Overview
                  </NavLink> */}
                  {RoleId === constant.CONST_MANAGER_ROLE && isWFHDManager && (
                <NavLink className="collapse-item" to="/admin/wfhd-register">
                    <i className="bi bi-dot"></i> Add Buddy
                  </NavLink>
                  )}
                  {RoleId === constant.CONST_MANAGER_ROLE && isWFHDManager && (
                <NavLink className="collapse-item" to="/admin/wfhd-overview">
                    <i className="bi bi-dot"></i> My Team
                  </NavLink>
                  )}
                {/* {isWFHDHRPayrollManager && (
                  <NavLink className="collapse-item" to="/admin/salaryWFH">
                    <i className="bi bi-dot"></i> Payout Summary
                  </NavLink>
                )} */}

                {/* {RoleId === constant.CONST_MANAGER_ROLE && isWFHDManager && (
                  // <>
                  <NavLink
                    className="collapse-item"
                    to="/admin/attendence-mast"
                  >
                    <i className="bi bi-dot"></i> Create Attendance
                  </NavLink>
                )} */}
                {/* <NavLink
                        className="collapse-item"
                        to="/admin/dispute-overview"
                      >
                        <i className="bi bi-dot"></i>Dispute Summary
                      </NavLink> */}
                {/* <NavLink className="collapse-item" to="/admin/total-NDG">
                        <i className="bi bi-dot"></i> Total & NDG
                      </NavLink> */}
                {/* </> */}
                {/* )} */}

                {RoleId == 1 && (
                  <NavLink
                    className="collapse-item"
                    to="/admin/hr-template-overview"
                  >
                    <i className="bi bi-dot"></i> Invoice Template Summary
                  </NavLink>
                )}
              </div>
            </div>
          </li>

          {isPantryManagementVisible && (
            <li className="nav-item">
              <Link
                className="nav-btn nav-link collapsed"
                data-toggle="collapse"
                data-target="#collapseThree"
                aria-expanded="true"
                aria-controls="collapseThree"
              >
                <i className="bi bi-dash"></i>
                <span>Pantry Management</span>
              </Link>
              <div
                id="collapseThree"
                className="collapse"
                aria-labelledby="headingTwo"
                data-parent="#accordionSidebar"
              >
                <div className="internal   collapse-inner">
                  {contextData &&
                    contextData[5] &&
                    contextData[5].view_value === 1 && (
                      <NavLink
                        className="collapse-item"
                        to="/admin/product-overview"
                      >
                        <i className="bi bi-dot"></i> Product
                      </NavLink>
                    )}

                  {contextData &&
                    contextData[8] &&
                    contextData[8].view_value === 1 && (
                      <NavLink className="collapse-item" to="/pantry-user">
                        <i className="bi bi-dot"></i> Pantry User
                      </NavLink>
                    )}
                  {contextData &&
                    contextData[9] &&
                    contextData[9].view_value === 1 && (
                      <NavLink className="collapse-item" to="/pantry-delivery">
                        <i className="bi bi-dot"></i> Pantry Delivery
                      </NavLink>
                    )}
                </div>
              </div>
            </li>
          )}

          {isAssetNotifierVisible && (
            <li className="nav-item">
              <Link
                className="nav-btn nav-link collapsed"
                data-toggle="collapse"
                data-target="#collapseEight"
                aria-expanded="true"
                aria-controls="collapseEight"
              >
                <i className="bi bi-dash"></i>
                <span>Asset Notifier</span>
              </Link>
              <div
                id="collapseEight"
                className="collapse"
                aria-labelledby="headingTwo"
                data-parent="#accordionSidebar"
              >
                <div className="internal collapse-inner">
                  {/* {contextData &&
                contextData[5] &&
                contextData[5].view_value === 1 && ( */}
                  <NavLink className="collapse-item" to="/admin/self-audit">
                    <i className="bi bi-dot"></i> Audit asset
                  </NavLink>
                </div>
              </div>
            </li>
          )}

          {/* Asset Managerment Routing  */}
          {/* {isAssetNotifierVisible && ( */}
          {/* )} */}

          {/* PREONBOARDING START*/}
          {isOnboardingVisible && (
            <li className="nav-item">
              <Link
                className="nav-btn nav-link collapsed"
                data-toggle="collapse"
                data-target="#collapseFive"
                aria-expanded="true"
                aria-controls="collapseFive"
              >
                <i className="bi bi-dash"></i>
                <span>Org</span>
              </Link>
              <div
                id="collapseFive"
                className="collapse"
                aria-labelledby="headingTwo"
                data-parent="#accordionSidebar"
              >
                <div className="internal collapse-inner">
                 {contextData &&
                      contextData[18] &&
                      contextData[18].view_value === 1 && (
                        <NavLink
                          className="collapse-item"
                          to="/admin/pre-onboarding"
                        >
                          <i className="bi bi-dot"></i> Add Pre Onboarding
                        </NavLink>
                      )} 

                  {contextData && contextData[18]?.view_value == 1 && (
                    <NavLink
                      className="collapse-item"
                      to="/admin/pre-onboarding-overview"
                    >
                      <i className="bi bi-dot"></i> Overview
                    </NavLink>
                  )}
                  {contextData && contextData[18]?.view_value == 1 && (
                    <NavLink
                      className="collapse-item"
                      to="/admin/pre-onboard-extend-date-overview"
                    >
                      <i className="bi bi-dot"></i> Extend Date Overview
                    </NavLink>
                  )}
                  {contextData && contextData[18]?.view_value == 1 && (
                    <NavLink
                      className="collapse-item"
                      to="/admin/pre-onboard-coc-master"
                    >
                      <i className="bi bi-dot"></i> Coc Master
                    </NavLink>
                  )}
                  {contextData && contextData[18]?.view_value == 1 && (
                    <NavLink
                      className="collapse-item"
                      to="/admin/pre-onboard-coc-overview"
                    >
                      <i className="bi bi-dot"></i> Coc Overview
                    </NavLink>
                  )}
                  {contextData && contextData[18]?.view_value == 1 && (
                    <NavLink
                      className="collapse-item"
                      to="/admin/pre-onboard-user-login-history"
                    >
                      <i className="bi bi-dot"></i> Login History
                    </NavLink>
                  )}
                  {contextData && contextData[18]?.view_value == 1 && (
                    <NavLink
                      className="collapse-item"
                      to="/admin/pre-onboard-all-notifications"
                    >
                      <i className="bi bi-dot"></i> All Notifications
                    </NavLink>
                  )}

                  <NavLink
                    className="collapse-item"
                    to="/admin/preonboarding-documents-overview"
                  >
                    <i className="bi bi-dot"></i> Documents
                  </NavLink>

                  {contextData &&
                    contextData[20] &&
                    contextData[20].insert_value === 1 && (
                      <NavLink
                        className="collapse-item"
                        to="/admin/announcement-post"
                      >
                        <i className="bi bi-dot"></i> Announcement Post
                      </NavLink>
                    )}
                  {contextData &&
                    contextData[21] &&
                    contextData[21].view_value === 1 && (
                      <NavLink
                        className="collapse-item"
                        to="/admin/announcement-view"
                      >
                        <i className="bi bi-dot"></i> Announcement View
                      </NavLink>
                    )}
                </div>
              </div>
            </li>
          )}
          {/* PREOBOARDING END*/}
        </div>
      </li>
      )} 

      {/* PAYOUT HR / MANAGER ACCOUNTS  END*/}

      {/* OPERATIONS */}
      {isOpration && (
        <li className="nav-item">
          <Link
            className="nav-btn nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapsInnerexeop"
            aria-expanded="true"
            aria-controls="collapsInnerOneModifyTwo"
          >
            <i className="ph">
              <Laptop weight="duotone" />
            </i>
            <span>Operation</span>
          </Link>
          <div
            id="collapsInnerexeop"
            className="collapse"
            aria-labelledby="headingTwoOne"
          >
            <div className="collapse-inner internal">
              {contextData &&
                contextData[34] &&
                contextData[34].view_value === 1 && (
                  <>
                    <NavLink
                      className="collapse-item"
                      to="/admin/exeoperation/master"
                    >
                      <i className="bi bi-dot"></i>
                      Masters
                    </NavLink>
                    <NavLink
                      className="collapse-item"
                      to="/admin/op-registered-campaign"
                    >
                      <i className="bi bi-dot"></i>
                      Regsiter Campaign
                    </NavLink>
                    {/* <NavLink
                      className="collapse-item"
                      to="/admin/op-plan-creation"
                    >
                      <i className="bi bi-dot"></i>
                      Plan Creation
                    </NavLink> */}
                    {/* <NavLink
                      className="collapse-item"
                      to="/admin/op-phase-creation"
                    >
                      <i className="bi bi-dot"></i>
                      Phase Creation
                    </NavLink> */}
                    <NavLink
                      className="collapse-item"
                      to="/admin/op-campaign-executions"
                    >
                      <i className="bi bi-dot"></i>
                      Camp Execution
                    </NavLink>
                  </>
                )}
            </div>

            {contextData &&
              contextData[24] &&
              contextData[24].view_value === 1 && (
                <li className="nav-item">
                  <a
                    className="nav-btn nav-link collapsed"
                    data-toggle="collapse"
                    data-target="#collapsInnerOne"
                    aria-expanded="true"
                    aria-controls="collapsInnerOne"
                  >
                    <i className="bi bi-dash"></i>
                    {/* <i className="bi bi-person-gear" /> */}
                    <span>Execution</span>
                  </a>
                  <div
                    id="collapsInnerOne"
                    className="collapse"
                    aria-labelledby="headingTwo"
                    // data-parent="#accordionSidebar"
                  >
                    <div className="internal collapse-inner">
                      <NavLink className="collapse-item" to="/admin/execution">
                        <i className="bi bi-dot"></i> Dashboard
                      </NavLink>
                      <NavLink
                        className="collapse-item"
                        to="/admin/exeexecution/pending"
                      >
                        <i className="bi bi-dot"></i> Pending
                      </NavLink>{" "}
                      <NavLink
                        className="collapse-item"
                        to="/admin/exeexecution/done"
                      >
                        <i className="bi bi-dot"></i> Executed
                      </NavLink>{" "}
                      {/* <NavLink
                          className="collapse-item"
                          to="/admin/exeexecution/accepted"
                        >
                          In Progress
                        </NavLink>{" "} */}
                      <NavLink
                        className="collapse-item"
                        to="/admin/exeexecution/rejected"
                      >
                        <i className="bi bi-dot"></i> Rejected
                      </NavLink>
                    </div>
                  </div>
                </li>
              )}
          </div>
        </li>
      )}
      {/* {isOpration && (
        <li className="nav-item">
          <a
            className="nav-btn nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapsInnerOneModifyTwo"
            aria-expanded="true"
            aria-controls="collapsInnerOneModifyTwo"
          >
            <i className="ph">
              <Laptop weight="duotone" />
            </i>

            <span>Inventory</span>
          </a>
          <div
            id="collapsInnerOneModifyTwo"
            className="collapse"
            aria-labelledby="headingTwoOne"
          >
            {contextData &&
              contextData[34] &&
              contextData[34].view_value === 1 && (
                <li className="nav-item">
                  <a
                    className="nav-btn nav-link collapsed"
                    data-toggle="collapse"
                    data-target="#collapsInnerOneThree"
                    aria-expanded="true"
                    aria-controls="collapsInnerOneThree"
                  >
                    <i className="bi bi-dash"></i>
                    <span>Inventory</span>
                  </a>
                  <div
                    id="collapsInnerOneThree"
                    className="collapse"
                    aria-labelledby="headingTwo"
                  >
                    <div className="internal collapse-inner">
                      {/* <NavLink className="collapse-item" to="/admin/exeinventory">
                          Dashboard
                        </NavLink> 
                      <NavLink className="collapse-item" to="/admin/cityMsater">
                        <i className="bi bi-dot"></i> City Mast
                      </NavLink>{" "}
                      <NavLink
                        className="collapse-item"
                        to="/admin/exeexecution/PagePerformanceAnalytics"
                      >
                        <i className="bi bi-dot"></i> Analytics
                      </NavLink>{" "}
                      <NavLink
                        to="/admin/exeexecution/dashboard"
                        className="collapse-item"
                      >
                        <i className="bi bi-dot"></i> Dashboard
                      </NavLink>
                      <NavLink
                        to="/admin/exeexecution/PagePerformanceDashboard"
                        className="collapse-item"
                      >
                        <i className="bi bi-dot"></i> Page Performance Dashboard
                      </NavLink>
                      <NavLink
                        className="collapse-item"
                        to="/admin/exeexecution/allpagesdetail"
                      >
                        <i className="bi bi-dot"></i> All Pages Detailed
                      </NavLink>{" "}
                      {/* <NavLink
                        to="/admin/exeexecution/dashboard"
                        className="collapse-item"
                      >
                        Dashboard
                      </NavLink> 
                      <NavLink
                        className="collapse-item"
                        to="/admin/exeexecution/all"
                      >
                        <i className="bi bi-dot"></i> All ({allCount})
                      </NavLink>{" "}
                      <NavLink
                        className="collapse-item"
                        to="/admin/exeexecution/own"
                      >
                        <i className="bi bi-dot"></i> Own ({ownCount})
                      </NavLink>{" "}
                      <NavLink
                        className="collapse-item"
                        to="/admin/exeexecution/other"
                      >
                        <i className="bi bi-dot"></i> Other ({otherCount})
                      </NavLink>
                    </div>
                  </div>
                </li>
              )}

            {/* {isExecutionVisible && (
              <li className="nav-item">
                <Link
                  className="nav-btn nav-link collapsed"
                  data-toggle="collapse"
                  data-target="#collapseSeven"
                  aria-expanded="true"
                  aria-controls="collapseSeven"
                >
                  <i className="bi bi-dash"></i>
                  <span>Plan & Operation</span>
                </Link>
                <div
                  id="collapseSeven"
                  className="collapse"
                  aria-labelledby="headingTwo"
                  data-parent="#accordionSidebar"
                >
                  <div className="collapse-inner">
                    
                    {contextData &&
                      contextData[24] &&
                      contextData[24].view_value === 1 && (
                        <li className="nav-item">
                          <Link
                            className="nav-btn nav-link collapsed"
                            data-toggle="collapse"
                            data-target="#collapsInnerTwoCamp"
                            aria-expanded="true"
                            aria-controls="collapsInnerTwoCamp"
                          >
                            <i className="bi bi-dash"></i>
                            <span>Campaign</span>
                          </Link>
                          <div
                            id="collapsInnerTwoCamp"
                            className="collapse"
                            aria-labelledby="headingTwo"
                            
                          >
                            <div className="internal collapse-inner">
                              <>
                                <NavLink
                                  className="collapse-item"
                                  to="/admin/operation-dashboards"
                                >
                                  <i className="bi bi-dot"></i> Dashboards
                                </NavLink>
                                <NavLink
                                  className="collapse-item"
                                  to="/admin/operation-campaigns"
                                >
                                  <i className="bi bi-dot"></i> Campaign Masters
                                </NavLink>
                                <NavLink
                                  className="collapse-item"
                                  to="/admin/operation-contents"
                                >
                                  <i className="bi bi-dot"></i> Contents
                                </NavLink>
                                <NavLink
                                  className="collapse-item"
                                  to="/admin/experties-overview"
                                >
                                  <i className="bi bi-dot"></i> Expert
                                </NavLink>
                                <NavLink
                                  className="collapse-item"
                                  to="/admin/registered-campaign"
                                >
                                  <i className="bi bi-dot"></i> Registered
                                  Campaign
                                </NavLink>

                                <NavLink
                                  className="collapse-item"
                                  to="/admin/checkPageFollowers"
                                >
                                  <i className="bi bi-dot"></i> Check Page
                                  Follower
                                </NavLink>
                              </>
                            </div>
                          </div>
                        </li>
                      )}
                    {contextData &&
                      contextData[45] &&
                      contextData[45].view_value === 1 && (
                        <li className="nav-item">
                          <NavLink
                            className="nav-btn nav-link collapsed"
                            to="/admin/create-plan"
                            
                          >
                            <i className="bi bi-dash"></i>
                            <span>Create Plan </span>
                          </NavLink>
                        </li>
                      )}
                    {contextData &&
                      contextData[45] &&
                      contextData[45].view_value === 1 && (
                        <li className="nav-item">
                          <NavLink
                            className="nav-btn nav-link collapsed"
                            to="/admin/tempexcusion"
                            
                          >
                            <i className="bi bi-dash"></i>
                            <span> Temp. Execution</span>
                          </NavLink>
                        </li>
                      )}
                    {contextData &&
                      contextData[45] &&
                      contextData[45].view_value === 1 && (
                        <li className="nav-item">
                          <NavLink
                            className="nav-btn nav-link collapsed"
                            to="/admin/operation/case-study"
                          >
                            <i className="bi bi-dash"></i>
                            <span>Case Study </span>
                          </NavLink>
                        </li>
                      )}
                    {contextData &&
                      contextData[31] &&
                      contextData[31].view_value === 1 && (
                        <li className="nav-item">
                          <Link
                            className="nav-btn nav-link collapsed"
                            data-toggle="collapse"
                            data-target="#collapsInnerTwo"
                            aria-expanded="true"
                            aria-controls="collapsInnerTwo"
                          >
                            <i className="bi bi-dash"></i>
                            <span>Content Creation </span>
                          </Link>
                          <div
                            id="collapsInnerTwo"
                            className="collapse"
                            aria-labelledby="headingTwo"
                            
                          >
                            <div className="internal collapse-inner">
                              <>
                                
                                <NavLink
                                  className="collapse-item"
                                  to="/admin/createrdashboard"
                                >
                                  <i className="bi bi-dot"></i> Creator
                                  Dashborad
                                </NavLink>
                                <NavLink
                                  className="collapse-item"
                                  to="/admin/excusionCampaign"
                                >
                                  <i className="bi bi-dot"></i> Execution
                                  Campaign
                                </NavLink>
                              </>
                            </div>
                          </div>
                        </li>
                      )}
                    {contextData &&
                      contextData[32] &&
                      contextData[32].view_value === 1 && (
                        <li className="nav-item">
                          <Link
                            className="nav-btn nav-link collapsed"
                            data-toggle="collapse"
                            data-target="#collapsInnerThree"
                            aria-expanded="true"
                            aria-controls="collapsInnerThree"
                          >
                            <i className="bi bi-dash"></i>
                            <span>Content Creation Admin</span>
                          </Link>
                          <div
                            id="collapsInnerThree"
                            className="collapse"
                            aria-labelledby="headingTwo"
                            
                          >
                            <div className="internal collapse-inner">
                              <>
                                <NavLink
                                  className="collapse-item"
                                  to="/admin/campaign-admin"
                                >
                                  <i className="bi bi-dot"></i> Campaign Admin
                                </NavLink>
                              </>
                            </div>
                          </div>
                        </li>
                      )}
                  </div>
                </div>
              </li>
            )} 
          </div>
        </li>
      )} */}
      {/* {isLeadManagementVisible && (
        <li className="nav-item">
          <NavLink
            className="nav-btn nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapseSix"
            aria-expanded="true"
            aria-controls="collapseSix"
          >
            <i className="bi bi-person-gear" />
            <span>Lead Management</span>
          </NavLink>
          <div
            id="collapseSix"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="collapse-inner">
              {contextData &&
                contextData[22] &&
                contextData[22].view_value === 1 && (
                  <NavLink className="collapse-item" to="/admin/explore-leads">
                    Explore Leads
                  </NavLink>
                )}
            </div>
          </div>
        </li>
      )}  */}
      {/* OPERATIONS */}

      {/* FINANCE */}
      {isPHPFinance && (
        <li className="nav-item">
          <Link
            className="nav-btn nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapseNine"
            aria-expanded="true"
            aria-controls="collapseNine"
          >
            <i className="ph">
              <CurrencyInr weight="duotone" />
            </i>
            <span>Finance</span>
          </Link>
          <div
            id="collapseNine"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="collapse-inner">
              <li className="nav-item">
                {/* <NavLink
                  className="nav-btn nav-link collapsed"
                  data-toggle="collapse"
                  data-target="#collapsInnerEightFinanceEditDashboard"
                  aria-expanded="true"
                  aria-controls="collapsInnerEightFinanceEditDashboard"
                >
                  <span>Dashboard</span>
                </NavLink> */}
                {/* <div
                  id="collapsInnerEightFinanceEditDashboard"
                  className="collapse"
                  aria-labelledby="headingTwo"
                  // data-parent="#accordionSidebar"
                > */}
                <div className="collapse-inner">
                  <>
                    <li className="nav-item">
                      <NavLink
                        className="collapse-item"
                        to="/admin/finance-dashboard"
                      >
                        {/* <i className="bi bi-dash"></i> */}
                        <i className="bi bi-dot"></i>
                        <span>Dashboard</span>
                      </NavLink>
                    </li>
                  </>
                </div>
                {/* </div> */}

                <Link
                  className="nav-btn nav-link collapsed"
                  data-toggle="collapse"
                  data-target="#collapsInnerEightFinanceEdit"
                  aria-expanded="true"
                  aria-controls="collapsInnerEightFinanceEdit"
                >
                  {/* <i className="bi bi-dash"></i> */}
                  <span>Sales</span>
                </Link>

                <div
                  id="collapsInnerEightFinanceEdit"
                  className="collapse"
                  aria-labelledby="headingTwo"
                  // data-parent="#accordionSidebar"
                >
                  <div className="collapse-inner">
                    <>
                      <li className="nav-item">
                        {/* <a
                          className="nav-btn nav-link collapsed"
                          data-toggle="collapse"
                          data-target="#collapsInnerOneFinance"
                          aria-expanded="true"
                          aria-controls="collapsInnerOneFinance"
                        >
                          <i className="bi bi-dash"></i>
                          <span>Payment Update</span>
                        </a> */}
                        {/* <div
                          id="collapsInnerOneFinance"
                          className="collapse"
                          aria-labelledby="headingTwo"
                        > */}
                        <div className="internal collapse-inner">
                          <NavLink
                            className="collapse-item"
                            to="/admin/finance-alltransactions"
                          >
                            <i className="bi bi-dot"></i>
                            Dashboard
                          </NavLink>
                          {/* <NavLink
                              className="collapse-item"
                              to="/admin/finance-pending-sales-approval"
                            >
                              <i className="bi bi-dot"></i> Pending for approval
                            </NavLink> */}
                          {/* <NavLink
                              className="collapse-item"
                              to="/admin/finance-paymentmode"
                            >
                              <i className="bi bi-dot"></i> Payment Mode
                            </NavLink> */}
                          {/* <NavLink
                              className="collapse-item"
                              to="/admin/finance-pendingapproveupdate"
                            >
                              <i className="bi bi-dot"></i> Pending Approval
                            </NavLink> */}
                        </div>
                        {/* </div> */}
                      </li>

                      {/* <li className="nav-item">
                        <a
                          className="nav-btn nav-link collapsed"
                          data-toggle="collapse"
                          data-target="#collapsInnerOneFinanceSecound"
                          aria-expanded="true"
                          aria-controls="collapsInnerOneFinanceSecound"
                        >
                     
                          <i className="bi bi-dash"></i>
                          <span>Payment Refund</span>
                        </a>
                        <div
                          id="collapsInnerOneFinanceSecound"
                          className="collapse"
                          aria-labelledby="headingTwo"
  
                        >
                          <div className="internal collapse-inner">
                            <NavLink
                              className="collapse-item"
                              to="/admin/finance-pendingapproverefund"
                            >
                              <i className="bi bi-dot"></i> Pending Approval
                              Refund
                            </NavLink>
                            <NavLink
                              className="collapse-item"
                              to="/admin/finance-pendingrequests"
                            >
                              <i className="bi bi-dot"></i> All Refund Request
                            </NavLink>
                          </div>
                        </div>
                      </li> */}

                      <li className="nav-item">
                        {/* <NavLink
                          className="nav-btn nav-link collapsed"
                          data-toggle="collapse"
                          data-target="#collapsInnerThree"
                          aria-expanded="true"
                          aria-controls="collapsInnerThree"
                        >
                          <i className="bi bi-dash"></i>
                          <span>Outstanding</span>
                        </NavLink> */}
                        {/* <div
                          id="collapsInnerThree"
                          className="collapse"
                          aria-labelledby="headingTwo"
                          // data-parent="#accordionSidebar"
                        >
                          <div className="internal collapse-inner"> */}
                        <>
                          <NavLink
                            className="collapse-item"
                            to="/admin/finance-balancepayment"
                          >
                            <i className="bi bi-dot"></i> Outstanding
                          </NavLink>
                        </>
                        {/* </div>
                        </div> */}
                      </li>
                      {/* 
                      <li className="nav-item">
                        <Link
                          className="nav-btn nav-link collapsed"
                          data-toggle="collapse"
                          data-target="#collapsInnerFourFinance"
                          aria-expanded="true"
                          aria-controls="collapsInnerFourFinance"
                        >
                          <i className="bi bi-dash"></i>
                          <span>Incentive Payment</span>
                        </Link>
                        <div
                          id="collapsInnerFourFinance"
                          className="collapse"
                          aria-labelledby="headingTwo"
                        >
                          <div className="internal collapse-inner">
                            <>
                              <NavLink
                                className="collapse-item"
                                to="/admin/finance-incentive-parent"
                              >
                                <i className="bi bi-dot"></i>Incentive
                              </NavLink>
                            </>
                          </div>
                        </div>
                      </li> */}

                      {/* <li className="nav-item">
                        <NavLink
                          className="nav-btn nav-link collapsed"
                          data-toggle="collapse"
                          data-target="#collapsInnerFiveFinance"
                          aria-expanded="true"
                          aria-controls="collapsInnerFiveFinance"
                        >
                          <i className="bi bi-dash"></i>
                          <span>Invoice</span>
                        </NavLink>
                        <div
                          id="collapsInnerFiveFinance"
                          className="collapse"
                          aria-labelledby="headingTwo"
                          // data-parent="#accordionSidebar"
                        >
                          <div className="internal collapse-inner">
                            <>
                              <NavLink
                                className="collapse-item"
                                to="/admin/finance-pendinginvoice"
                              >
                                <i className="bi bi-dot"></i> Pending Invoice
                                Creation
                              </NavLink>
                              <NavLink
                                className="collapse-item"
                                to="/admin/finance-createdinvoice"
                              >
                                <i className="bi bi-dot"></i> Invoice Created
                              </NavLink>
                              {/* <NavLink
                                className="collapse-item"
                                to="/admin/finance-invoice"
                              >
                                <i className="bi bi-dot"></i> Invoice
                              </NavLink> */}
                      {/* </>
                          </div>
                        </div>
                      </li> */}
                      {/* <li className="nav-item">
                        <NavLink
                          className="collapse-item"
                          to="/admin/finance-invoice"
                        >
                          <i className="bi bi-dot"></i> Invoice
                        </NavLink>
                      </li> */}
                      {/* <li className="nav-item">
                        <Link
                          className="nav-btn nav-link collapsed"
                          data-toggle="collapse"
                          data-target="#collapsInnerSevenFinance"
                          aria-expanded="true"
                          aria-controls="collapsInnerSevenFinance"
                        >
                          <i className="bi bi-dash"></i>
                          <span>TDS</span>
                        </Link>
                        <div
                          id="collapsInnerSevenFinance"
                          className="collapse"
                          aria-labelledby="headingTwo"
                          // data-parent="#accordionSidebar"
                        >
                          <div className="internal collapse-inner">
                            <>
                              <NavLink
                                className="collapse-item"
                                to="/admin/finance-salebooking"
                              >
                                <i className="bi bi-dot"></i> Sales Booking
                              </NavLink>

                            
                            </>
                          </div>
                        </div>
                      </li> */}
                    </>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-btn nav-link collapsed"
                  data-toggle="collapse"
                  data-target="#collapsInnerEightFinance"
                  aria-expanded="true"
                  aria-controls="collapsInnerEightFinance"
                >
                  {/* <i className="bi bi-dash"></i> */}
                  <span>Purchase </span>
                </Link>
                <div
                  id="collapsInnerEightFinance"
                  className="collapse"
                  aria-labelledby="headingTwo"
                  // data-parent="#accordionSidebar"
                >
                  <div className="internal collapse-inner">
                    <>
                      <NavLink
                        className="collapse-item"
                        to="/admin/finance-pruchasemanagement-alltransaction"
                      >
                        <i className="bi bi-dot"></i> Purchase Dashboard
                      </NavLink>
                      <NavLink
                        className="collapse-item"
                        to="/admin/finance-pruchasemanagement-pendingpaymentrequest"
                      >
                        <i className="bi bi-dot"></i>
                        Pending Payment Request
                      </NavLink>{" "}
                      <NavLink
                        className="collapse-item"
                        to="/admin/payment-mode-master"
                      >
                        {/* <i className="bi bi-dot"></i> */}
                        Payment Mode Master
                      </NavLink>
                      {/* <NavLink
                        className="collapse-item"
                        to="/admin/payment-TDS_deduct"
                      >
                        <i className="bi bi-dot"></i> TDS Deduction
                      </NavLink> */}
                      {/* <NavLink
                        className="collapse-item"
                        to="/admin/payment-GST_hold"
                      >
                        <i className="bi bi-dot"></i> GST Hold
                      </NavLink> */}
                      {/* <NavLink
                        className="collapse-item"
                        to="/admin/finance-pruchasemanagement-paymentdone"
                      >
                        <i className="bi bi-dot"></i> Payment Done
                      </NavLink> */}
                      {/* <NavLink
                        className="collapse-item"
                        to="/admin/finance-pruchasemanagement-discardpayment"
                      >
                        <i className="bi bi-dot"></i> Discard Payment
                      </NavLink> */}
                    </>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-btn nav-link collapsed"
                  data-toggle="collapse"
                  data-target="#collapsInnerEightFinancePayout"
                  aria-expanded="true"
                  aria-controls="collapsInnerEightFinancePayout"
                >
                  {/* <i className="bi bi-dash"></i> */}
                  <span>WFHD</span>
                </Link>
                <div
                  id="collapsInnerEightFinancePayout"
                  className="collapse"
                  aria-labelledby="headingTwo"
                  // data-parent="#accordionSidebar"
                >
                  <div className="internal collapse-inner">
                    <>
                      <NavLink
                        className="collapse-item"
                        to="/admin/accounts-finance-dashboard"
                      >
                        <i className="bi bi-dot"></i>
                        Payout Summary
                      </NavLink>

                      <NavLink
                        className="collapse-item"
                        to="/admin/accounts-finance-overview"
                      >
                        <i className="bi bi-dot"></i>
                        Account Overview
                      </NavLink>
                    </>
                  </div>
                </div>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-btn nav-link collapsed"
                  data-toggle="collapse"
                  data-target="#collapsInnerEightFinanceTask"
                  aria-expanded="true"
                  aria-controls="collapsInnerEightFinanceTask"
                >
                  {/* <i className="bi bi-dash"></i> */}
                  <span>Task</span>
                </Link>
                <div
                  id="collapsInnerEightFinanceTask"
                  className="collapse"
                  aria-labelledby="headingTwo"
                  // data-parent="#accordionSidebar"
                >
                  <div className="internal collapse-inner">
                    <>
                      <NavLink
                        className="collapse-item"
                        to="/admin/finance-task-pending"
                      >
                        <i className="bi bi-dot"></i>
                        Pending
                      </NavLink>

                      <NavLink
                        className="collapse-item"
                        to="/admin/finance-task-done/type"
                      >
                        <i className="bi bi-dot"></i>
                        Done
                      </NavLink>
                    </>
                  </div>
                </div>
              </li>
              {/* <li className="nav-item">
                <>
                  <NavLink
                    className="collapse-item"
                    to="/admin/finance-gst-nongst-incentive-report"
                  >
                    <i className="bi bi-dash"></i> Incentive Report
                  </NavLink>
                </>
              </li> */}
            </div>
          </div>
        </li>
      )}

      {/* FINANCE */}

      {/* Asset Management here  */}

      {/* {isTaskManagment && (
        <li className="nav-item">
          <Link
            className="nav-btn nav-link collapsed"
            data-toggle="collapse"
            data-target="#taskmanagement"
            aria-expanded="true"
            aria-controls="taskmanagement"
          >
            <i className="ph">
              <FolderSimpleStar weight="duotone" />
            </i>
            <span>Task Management</span>
          </Link>
          <div
            id="taskmanagement"
            className="collapse"
            aria-labelledby="headingTwo"
          >
            <div className="internal   collapse-inner">
              <>
                <NavLink
                  className="collapse-item"
                  to="/admin/task-status-dept-wise-overview"
                >
                  <i className="bi bi-dot"></i> Task Status
                </NavLink>
              </>
            </div>
          </div>
        </li>
      )} */}

      {/* {isCustomer && (
        <li className="nav-item">
          <Link
            className="nav-btn nav-link collapsed"
            data-toggle="collapse"
            data-target="#customer"
            aria-expanded="true"
            aria-controls="customer"
          >
            <i className="ph">
              <UserRectangle weight="duotone" />
            </i>
            <span>Customer</span>
          </Link>
          <div
            id="customer"
            className="collapse"
            aria-labelledby="headingTwo"
          // data-parent="#accordionSidebar"
          >
            <div className="internal collapse-inner">
              <>
                {/* <NavLink className="collapse-item" to="/admin/account-type">
                  <i className="bi bi-dot"></i> Account Type
                </NavLink> 

                <NavLink className="collapse-item" to="/admin/account-master">
                  <i className="bi bi-dot"></i> Brand Name Type
                </NavLink>

                <NavLink className="collapse-item" to="/admin/ownership-master">
                  <i className="bi bi-dot"></i> Ownership Type
                </NavLink>
                <NavLink
                  className="collapse-item"
                  to="/admin/ops-customer-overview"
                >
                  <i className="bi bi-dot"></i> Account Overview
                </NavLink>
                {/* <NavLink className="collapse-item" to="/admin/ops-customer-update">
                <i className="bi bi-dot"></i> Ops Customer Update
              </NavLink> 

                <NavLink
                  className="collapse-item"
                  to="/admin/customer-cont-overview"
                >
                  <i className="bi bi-dot"></i> Contact
                </NavLink>
                <NavLink className="collapse-item" to="/admin/ops-doc-mast">
                  <i class="bi bi-dot"></i> Doc Master
                </NavLink>
                <NavLink
                  className="collapse-item"
                  to="/admin/customer-document-overview"
                >
                  <i class="bi bi-dot"></i> Document Overview
                </NavLink>
                {/* <NavLink className="collapse-item" to="/admin/customer-doc-master">
                <i class="bi bi-dot"></i> Customer Document
              </NavLink> 
              </>
            </div>
          </div>
        </li>
      )} */}

      {isPageManagement && (
        <li className="nav-item">
          <Link
            className="nav-link nav-btn collapsed"
            data-toggle="collapse"
            data-target="#collapseTwom8"
            aria-expanded="true"
            aria-controls="collapseTwom8"
          >
            <i className="ph">
              <Files weight="duotone" />
            </i>
            <span>Inventory</span>
          </Link>
          <div
            id="collapseTwom8"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="internal collapse-inner">
              {/* {contextData &&
                contextData[0] &&
                contextData[0].view_value === 1 && (
                  <NavLink className="collapse-item" to="/admin/pms-master">
                    <i className="bi bi-dot"></i>Master
                  </NavLink>
                )} */}

              {/* {contextData &&
                contextData[0] &&
                contextData[0].view_value === 1 && ( */}
              <NavLink
                className="collapse-item"
                to="/admin/pms-vendor-overview"
              >
                <i className="bi bi-dot"></i>Vendor
              </NavLink>
              {/* )} */}
              {/* {contextData &&
                contextData[0] &&
                contextData[0].view_value === 1 && ( */}
              <NavLink className="collapse-item" to="/admin/pms-page-overview">
                <i className="bi bi-dot"></i>Page
              </NavLink>
              {/* )} */}
              {/* {contextData &&
              contextData[0] &&
              contextData[0].view_value === 1 && (
                <NavLink className="collapse-item" to="/admin/pms-vendor-type">
                  <i className="bi bi-dot"></i>Vendor Type
                </NavLink>
              )} */}

              {/* {contextData &&
              contextData[0] &&
              contextData[0].view_value === 1 && (
                <NavLink className="collapse-item" to="/admin/pms-page-category">
                  <i className="bi bi-dot"></i> Page Category
                </NavLink>
              )} */}

              {/* {contextData &&
              contextData[0] &&
              contextData[0].view_value === 1 && (
                <NavLink className="collapse-item" to="/admin/pms-profile-type">
                  <i className="bi bi-dot"></i> Profile Type
                </NavLink>
              )} */}

              {/* {contextData &&
              contextData[0] &&
              contextData[0].view_value === 1 && (
                <NavLink className="collapse-item" to="/admin/pms-page-ownership">
                  <i className="bi bi-dot"></i> Page Ownership
                </NavLink>
              )} */}

              {/* {contextData &&
              contextData[21] &&
              contextData[21].view_value === 1 && (
                <NavLink className="collapse-item" to="/admin/pms-platform">
                  <i className="bi bi-dot"></i> Platform
                </NavLink>
              )} */}

              {/* {contextData &&
              contextData[1] &&
              contextData[1].view_value === 1 && (
                <NavLink className="collapse-item" to="/admin/pms-pay-method">
                  <i className="bi bi-dot"></i> Payment Method
                </NavLink>
              )} */}
              {/* {contextData &&
              contextData[2] &&
              contextData[2].view_value === 1 && (
                <NavLink className="collapse-item" to="/admin/pms-pay-cycle">
                  <i className="bi bi-dot"></i> Payment Cycle
                </NavLink>
              )} */}

              {/* {contextData &&
              contextData[6] &&
              contextData[6].view_value === 1 && (
                <Link className="collapse-item" to="/admin/pms-group-link-type">
                  <i className="bi bi-dot"></i> Group Link Type
                </Link>
              )} */}
              {/* {contextData &&
              contextData[6] &&
              contextData[6].view_value === 1 && (
                <Link className="collapse-item" to="/admin/pms-price-type">
                  <i className="bi bi-dot"></i> Price
                </Link>
              )} */}
              {/* {contextData &&
              contextData[6] &&
              contextData[6].view_value === 1 && (
                <Link
                  className="collapse-item"
                  to="/admin/pms-platform-price-type"
                >
                  <i className="bi bi-dot"></i>Platform Price
                </Link>
              )} */}
              {/* {contextData &&
              contextData[6] &&
              contextData[6].view_value === 1 && (
                <Link
                  className="collapse-item"
                  to="/admin/pms-vendor-page-price-overview"
                >
                  <i className="bi bi-dot"></i> Vendor Page Price Overview
                </Link>
              )} */}

              {/* <Link className="collapse-item" to="/admin/pms-vendor-overview">
              <i className="bi bi-dot"></i> Vendor Overview
            </Link> */}
              {/* <Link className="collapse-item" to="/admin/pms-vendor-group-link">
              <i className="bi bi-dot"></i>Vendor Group Link
            </Link> */}
              {/* <Link className="collapse-item" to="/admin/pms-page-overview">
              <i className="bi bi-dot"></i> Page Overview
            </Link> */}
            </div>
          </div>
        </li>
      )}

      {isSales && <SalesSidebarLinks />}
      {isExenseManagement && <ExenseManagement />}
      {isInstaApiVisible && (
        <li className="nav-item">
          <Link
            className="nav-btn nav-link collapsed"
            data-toggle="collapse"
            data-target="#cummunity"
            aria-expanded="true"
            aria-controls="cummunity"
          >
            <i className="ph">
              <UserRectangle weight="duotone" />
            </i>
            <span>Community</span>
          </Link>
          <div
            id="cummunity"
            className="collapse"
            aria-labelledby="headingFive"
            // data-parent="#accordionSidebar"
          >
            <div className="internal collapse-inner">
              {contextData &&
                contextData[0] &&
                (contextData[0].view_value === 1 || contextData[61].view_value === 1) && (
                  <>
                    <NavLink
                      className="collapse-item"
                      to="/admin/instaapi/community"
                    >
                      <i className="bi bi-dot"></i> Community-Overview
                    </NavLink>
                  </>
                )}
              <NavLink
                className="collapse-item"
                to="/admin/instaapi/community/manager"
              >
                <i className="bi bi-dot"></i> Community-Manager
              </NavLink>
            </div>
          </div>
        </li>
      )}
    </>
  );
};

export default SidebarLinks;
