import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineCategory } from "react-icons/md";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";

const UserDashboard = () => {
  console.log("Dashboard Loaded");
  const [userData, setUserData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [wFOCount, setWFOCount] = useState([]);
  const [wfhdCount, setWfhdCount] = useState([]);
  const [wFhCount, setWFhCount] = useState([]);

  useEffect(() => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      const data = res.data.data;
      setUserData(data);
      setWFOCount(data.filter((d) => d.job_type === "WFO"));
      setWfhdCount(data.filter((d) => d.job_type === "WFHD"));
      setWFhCount(data.filter((d) => d.job_type === "WFH"));
    });
    axios.get(baseUrl + "get_all_departments").then((res) => {
      setDepartmentData(res.data);
      console.log(res.data, " response data department");
    });
  }, []);

  return (
    <div>
      <FormContainer mainTitle="User Dashboard" link="/" />
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
        <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
          <div className="d_infocard card shadow">
            <div className="card-body">
              <div className="d_infocard_txt">
                <h3>WFO</h3>
                <h2>{wFOCount.length}</h2>
              </div>
              <div className="d_infocard_icon">
                <span>
                  <MdOutlineCategory />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
          <div className="d_infocard card shadow">
            <div className="card-body">
              <div className="d_infocard_txt">
                <h3>WFH</h3>
                <h2>{wFhCount.length}</h2>
              </div>
              <div className="d_infocard_icon">
                <span>
                  <MdOutlineCategory />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
          <div className="d_infocard card shadow">
            <div className="card-body">
              <div className="d_infocard_txt">
                <h3>WFHD</h3>
                <h2>{wfhdCount.length}</h2>
              </div>
              <div className="d_infocard_icon">
                <span>
                  <MdOutlineCategory />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

// {departmentData.map((d) => (
//   <>
//     <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
//       <div className="d_infocard card shadow">
//         <Link to={`/admin/dashboard_department_wise_user/${d.dept_id}`}>
//           <div className="card-body">
//             <div className="d_infocard_txt">
//               <h3>{d.dept_name}</h3>
//               <h2>
//                 {
//                   userData.filter(
//                     (data) => data.department_name === d.dept_name
//                   ).length
//                 }
//               </h2>
//             </div>
//             {/* <div className="d_infocard_icon">
//             <span>
//             <MdOutlineCategory />
//             </span>
//           </div> */}
//           </div>
//         </Link>
//       </div>
//     </div>
//   </>
// ))}
