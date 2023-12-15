import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnniversaryBirthdayCard from "./AnniversaryBirthdayCard";

const DashboardWFHUser = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [wfhUsersCount, setWfhUsersCount] = useState(0);
  const [yetToOnBoardCount, setYetToOnBoardCount] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [anniversaryBirthdays, setAnniversaryBirthdays] = useState([]);
  const [thisMonthJoinee, setThisMonthJoinee] = useState([]);

  const getDepartment = async () => {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/all_departments_of_wfh"
      );

      setDepartmentData(response.data.data);
    } catch (error) {
      console.log("Error Fetching Department", error);
    }
  };

  const getTotalSalary = async () => {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/get_total_salary"
      );
      setTotalSalary(response.data.data[0].totalsalary);
    } catch (error) {
      console.log("Error Fetching total salary", error);
    }
  };

  const preOnboardCount = async () => {
    try {
      const res = await axios.get(
        "http://34.93.221.166:3000/api/get_all_wfh_users"
      );
      const data = res.data.data;
      const onboarddata = data.filter((d) => d.onboard_status === 2).length;

      setWfhUsersCount(data.length);
      setYetToOnBoardCount(onboarddata);
    } catch (error) {
      console.log("Error fething all wfh users", error);
    }
  };

  const getAnniversaryBirthdays = async () => {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/get_all_users_with_dob_doj"
      );
      setAnniversaryBirthdays(response.data.users);
    } catch (error) {
      console.log("Api problem getanniversary", error);
    }
  };

  const getThisMonthJoinees = async () => {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/get_last_month_users"
      );
      setThisMonthJoinee(response.data);
    } catch (error) {
      console.log("Api problem getanniversary", error);
    }
  };

  console.log("this month Joinee", thisMonthJoinee);
  useEffect(() => {
    getDepartment();
    preOnboardCount();
    getTotalSalary();
    getAnniversaryBirthdays();
    getThisMonthJoinees();
  }, []);

  return (
    <>
      <div className="card mb24">
        <div className="card-header d-flex justify-content-between">
          <h4>Dashboard</h4>
          <h4>
            Total WFH User:{" "}
            <span className="color_primary"> {wfhUsersCount}</span>
          </h4>
        </div>
        <div className="card-body">
          <div className="row gap_24_0">
            <div className="col-xl-9 col-lg-9 col-md-6 col-sm-12 col-12">
              <div className="salary_dtlCard">
                <div className="salary_dtlCard_head">
                  <div className="d-flex justify-content-between">
                    <Link>
                      <h2>Details</h2>
                    </Link>
                    <button className="btn btn-primary">
                      <Link to="/admin/user">Add New Employee</Link>
                    </button>
                  </div>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>
                      <span>
                        <Link to="/admin/wfh-users-overview">
                          All Employees
                        </Link>
                      </span>
                      {wfhUsersCount}
                    </li>
                    <li>
                      <span>Total Salary</span>₹ {totalSalary}
                    </li>
                    <li>
                      <span>
                        <Link to="/admin/pre-onboarding-overview">
                          Yet To Register
                        </Link>
                      </span>
                      {yetToOnBoardCount}
                    </li>
                    <li>
                      <span>This Month Joinee</span>
                      {thisMonthJoinee.length}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <AnniversaryBirthdayCard
              anniversaryBirthdays={anniversaryBirthdays}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="row gap_24_0">
            {departmentData?.map((item) => (
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                <div className="salary_dtlCard">
                  <div className="salary_dtlCard_head">
                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/admin/wfh-dashboard-overview/${item.dept_id}`}
                        title="Department"
                      >
                        <h2>{item.dept_name}</h2>
                      </Link>
                      <h2 className="d-flex">
                        <span className="mr-3">{item.user_count} </span>
                        <Link to={`/admin/salary-dashboard/${item.dept_id}`}>
                          <i className="bi bi-ui-checks-grid" />
                        </Link>
                      </h2>
                    </div>
                  </div>
                  <div className="salary_dtlCard_info">
                    <ul>
                      <li>
                        <span>Total Salary Incurred :</span>₹{" "}
                        {item.total_salary}
                      </li>
                    </ul>
                  </div>
                  <div className="salary_dtlCard_info">
                    <ul>
                      <li>
                        <span>New Joinee</span>
                      </li>
                    </ul>
                  </div>
                  <div className="salary_dtlCard_info">
                    <ul>
                      <li>
                        <span>Employee Left</span>
                      </li>
                    </ul>
                  </div>
                  <div className="salary_dtlCard_info">
                    <ul>
                      <li>Yet To Register</li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardWFHUser;
