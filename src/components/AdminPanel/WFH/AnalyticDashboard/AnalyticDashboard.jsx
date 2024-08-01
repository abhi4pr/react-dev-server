import React from "react";
import WFHDUsersGrapf from "./WFHDUsersGraph";
import UserCountInCards from "./UserCountInCards";
import SalaryDetailsInLineChart from "./SalaryDetailsInLineChart";
import BirthdayAndWorkAniCard from "./BirthdayAndWorkAniCard";
import NewJoineeAndExitUsers from "./NewJoineeAndExitUsers";
import UserCountWithLPA from "./UserCountWithLPA";
import AgeGraf from "./AgeGraf";
import YearWiseGraph from "./YearWiseGraph";
import { Link } from "react-router-dom";

const AnalyticDashboard = () => {
  return (
    <>
      <div className="d-flex" style={{ justifyContent: "space-between" }}>
        <div>
          <h3 className="bold">WFHD Dashboard</h3>
        </div>
        <div className="">
          <Link to="/admin/wfhd-register">
            <button type="button" className="btn btn-outline-info btn-sm mr-2">
              Add Buddy
            </button>
          </Link>
          <Link to="/admin/wfhd-overview">
            <button type="button" className="btn btn-outline-info btn-sm">
              My Team
            </button>
          </Link>
          <Link to="/admin/attendence-mast">
            <button type="button" className="btn btn-outline-info btn-sm ml-2">
            Create Attendance
            </button>
          </Link>
          <Link to="/admin/salaryWFH">
            <button type="button" className="btn btn-outline-success btn-sm ml-2">
              Payout Summary
            </button>
          </Link>
        </div>
      </div>
      <UserCountInCards />
      <BirthdayAndWorkAniCard />
      <NewJoineeAndExitUsers />
      <div className="row">
        <div className="col-6">
          <h5 className="mb-2 card-title">Department Wise User Count</h5>
          <WFHDUsersGrapf />
        </div>
        <div className="col-5 ml-5">
          <h5 className="mb-2 card-title">User Count With LPA</h5>
          <UserCountWithLPA />
        </div>

        <div className="col-7 mr-5">
          <h5 className="mb-2 card-title">Department & Month Wise Salary</h5>
          <SalaryDetailsInLineChart />
        </div>
        <div className="col-4">
          <h5 className="mb-2 card-title">Age Wise Graph</h5>
          <AgeGraf />
        </div>
        <div className="col-4">
          <h5 className="mb-2 card-title">Years Wise Users</h5>
          <YearWiseGraph />
        </div>
      </div>
      
    </>
  );
};

export default AnalyticDashboard;
