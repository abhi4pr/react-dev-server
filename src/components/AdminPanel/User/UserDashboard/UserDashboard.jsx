import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineCategory } from "react-icons/md";
import { Link } from "react-router-dom";
import {baseUrl} from '../../../../utils/config'

const UserDashboard = () => {
  console.log("Dashboard Loaded");
  const [userData, setUserData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    axios.get(baseUrl+"get_all_users").then((res) => {
      setUserData(res.data.data);
    });
    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        setDepartmentData(res.data);
      });
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
          <div className="d_infocard card shadow">
            <div className="card-body">
              <div className="d_infocard_txt">
                <h3>All Users</h3>
                <h2>{userData.length}</h2>
              </div>
              <div className="d_infocard_icon">
                <span>
                  <MdOutlineCategory />
                </span>
              </div>
            </div>
          </div>
        </div>
        {departmentData.map((d) => (
          <>
            <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <div className="d_infocard card shadow">
                <Link to={`/admin/dashboard_department_wise_user/${d.dept_id}`}>
                  <div className="card-body">
                    <div className="d_infocard_txt">
                      <h3>{d.dept_name}</h3>
                      <h2>
                        {
                          userData.filter(
                            (data) => data.department_name === d.dept_name
                          ).length
                        }
                      </h2>
                    </div>
                    {/* <div className="d_infocard_icon">
                    <span>
                    <MdOutlineCategory />
                    </span>
                  </div> */}
                  </div>
                </Link>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
