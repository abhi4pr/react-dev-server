import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DashboardWFHUser = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [totalUserCount, setTotalUserCount] = useState(0);

  const getDepartment = () => {
    axios
      .get("http://34.93.221.166:3000/api/all_departments_of_wfh")
      .then((res) => {
        setDepartmentData(res.data.data);
      });
  };

  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    const total = departmentData.reduce(
      (acc, item) => acc + item.user_count,
      0
    );
    setTotalUserCount(total);
  }, [departmentData]);

  return (
    <>
      <div className="card mb24">
        <div className="card-header d-flex justify-content-between">
          <h4>Dashboard</h4>
          <h4>
            Total WFH User:{" "}
            <span className="color_primary"> {totalUserCount}</span>
          </h4>
        </div>
        <div className="card-body">
          <div className="row gap_24_0">
            <div className="col-xl-12 col-lg-12 col-md-6 col-sm-12 col-12">
              <div className="salary_dtlCard">
                <div className="salary_dtlCard_head">
                  <div className="d-flex justify-content-between">
                    <Link>
                      <h2>Details</h2>
                    </Link>
                  </div>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>Total Employees</li>
                    {totalUserCount}
                  </ul>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>Total Salary</li>
                  </ul>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>Yet To Register</li>
                  </ul>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>
                      <Link to="/admin/user">Add New Employee</Link>
                    </li>
                  </ul>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>
                      <Link to="/admin/user-overview">All Employees</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
                {/* </Link> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardWFHUser;
