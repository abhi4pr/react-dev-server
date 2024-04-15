import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineCategory } from "react-icons/md";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";
import Modal from "react-modal";
import DataTable from "react-data-table-component";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

const UserDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [wFOCount, setWFOCount] = useState([]);
  const [wfhdCount, setWfhdCount] = useState([]);
  const [wFhCount, setWFhCount] = useState([]);
  const [activeUserCount, setActiveUserCount] = useState([]);
  const [exitUserCount, setExiteUserCount] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCard = (jobtype) => {
    setIsModalOpen(true);
    const filteredData = userData.filter((user) => user.job_type === jobtype);
    setSelectedRow(filteredData);
  };

  useEffect(() => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      const data = res.data.data;
      setUserData(data);
      setWFOCount(data.filter((d) => d.job_type === "WFO"));
      setWfhdCount(data.filter((d) => d.job_type === "WFHD"));
      setWFhCount(data.filter((d) => d.job_type === "WFH"));
      setActiveUserCount(data.filter((d) => d.user_status === "Active"));
      setExiteUserCount(data.filter((d) => d.user_status === "Exit"));
    });
    axios.get(baseUrl + "get_all_departments").then((res) => {
      setDepartmentData(res.data);
    });
  }, []);

  const [designationData, setDesignationData] = useState([]);
  async function designaitonData() {
    await axios.get(baseUrl + "get_all_designations").then((res) => {
      setDesignationData(res.data.data);
    });
  }
  const [subDepartmentData, setSubDeparmentData] = useState([]);
  function SubDeptData() {
    axios.get(baseUrl + "get_all_sub_departments").then((res) => {
      setSubDeparmentData(res.data);
    });
  }
  const [roleData, setRoleData] = useState([]);
  async function RoleData() {
    try {
      const response = await axios.get(baseUrl + "get_all_roles");
      setRoleData(response.data.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  useEffect(() => {
    designaitonData();
    SubDeptData();
    RoleData();
  }, []);

  return (
    <div>
      <FormContainer mainTitle="User Dashboard" link="/" />
      <div className="row">
        <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
          <div className="d_infocard card shadow">
            <Link to="/admin/user-overview">
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
            </Link>
          </div>
        </div>
        <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
          <div className="d_infocard card shadow">
            <div className="card-body" onClick={() => handleCard("WFO")}>
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
            <div className="card-body" onClick={() => handleCard("WFH")}>
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
            <div className="card-body" onClick={() => handleCard("WFHD")}>
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
        <div className="asset_chart">
          <div
            className="card"
            style={{
              width: "50%",
              height: "100%",
            }}
          >
            <div className="chart_container body-padding">
              <h5 style={{ fontWeight: "600", color: "var(--gray-700)" }}>
                Total Users - {userData.length}
              </h5>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: wfhdCount.length,
                        label: "WFHD",
                        color: "rgb(184, 0, 216)",
                      },
                      {
                        id: 1,
                        value: wFhCount.length,
                        label: "WFH",
                      },
                      {
                        id: 2,
                        value: wFOCount.length,
                        label: "WFO",
                        color: "green",
                      },
                    ],
                    innerRadius: 30,
                    outerRadius: 70,
                    cornerRadius: 5,
                    paddingAngle: 1,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                height={200}
              />
            </div>
          </div>
          <div style={{ backgroundColor: "#33FF57", padding: "30px" }}>
            Active User
            <h2>{activeUserCount.length}</h2>
          </div>
          <div style={{ backgroundColor: "#FF5733", padding: "30px" }}>
            Exit User
            <h2>{exitUserCount.length}</h2>
          </div>
        </div>

        <div
          className="chart_container p-0"
          style={{ width: "50%", height: "100% " }}
        >
          <div className="card">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ["Department", "Sub Department", "Designation", "Role"],
                },
              ]}
              series={[
                {
                  data: [
                    departmentData.length,
                    subDepartmentData.length,
                    designationData.length,
                    roleData.length,
                  ],
                  // colors: ["#FF5733", "#33FF57", "#337EFF", "#FF33E1"],
                },
                { data: [] },
                // { data: [2, 5, 6] },
              ]}
              width={600}
              height={300}
            />
          </div>
        </div>

        {/* {departmentData.map((d) => (
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
                    <div className="d_infocard_icon">
                      <span>
                        <MdOutlineCategory />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </>
        ))} */}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            width: "80%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {selectedRow && (
          <div>
            <div className="d-flex justify-content-between mb-2">
              <h2>Overview: {selectedRow.dept_name}</h2>

              <button
                className="btn btn-success float-left"
                onClick={handleCloseModal}
              >
                X
              </button>
            </div>
            <DataTable
              columns={[
                {
                  name: "S.No",
                  cell: (row, index) => <div>{index + 1}</div>,
                  width: "10%",
                },
                {
                  name: "Name",
                  selector: (row) => (
                    <Link
                      to={`/admin/user-single/${row.user_id}`}
                      style={{ color: "blue" }}
                    >
                      {row.user_name}
                    </Link>
                  ),
                },
                { name: "Employe ID", selector: (row) => row.emp_id },
                { name: "Email", selector: (row) => row.user_email_id },
                { name: "Contact", selector: (row) => row.user_contact_no },
                { name: "Job Type", selector: (row) => row.job_type },
              ]}
              data={selectedRow}
              highlightOnHover
              fixedHeaderScrollHeight="68vh"
              fixedHeader
              subHeader
              // subHeaderComponent={
              //   <input
              //     type="text"
              //     placeholder="Search..."
              //     className="w-50 form-control"
              //     value={modalSearch}
              //     onChange={(e) => setModalSearch(e.target.value)}
              //   />
              // }
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserDashboard;
