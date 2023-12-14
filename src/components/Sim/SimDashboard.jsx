import axios from "axios";
import React, { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import UserNav from "../Pantry/UserPanel/UserNav";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../Context/Context";
import Modal from "react-modal";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Select from "react-select";

const SimDashboard = () => {
  const { toastAlert } = useGlobalContext();

  const [simData, setSimData] = useState([]);
  const [availableObjects, setAvailableCount] = useState([]);
  const [allocatedObjects, setAllocatedCount] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState([]);
  const [modalSearch, setModalSearch] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  function getData() {
    axios.get("http://34.93.221.166:3000/api/get_all_sims").then((res) => {
      setSimData(res.data.data);

      const availableObjects = res.data.data.filter(
        (item) => item.status === "Available"
      );
      setAvailableCount(availableObjects);

      const allocatedObjects = res.data.data.filter(
        (item) => item.status === "Allocated"
      );
      setAllocatedCount(allocatedObjects);
    });
    axios
      .get("http://34.93.221.166:3000/api/get_asset_department_count")
      .then((res) => {
        setDepartmentData(res.data.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    axios
      .get(`http://34.93.221.166:3000/api/get_asset_users_of_dept/${row}`)
      .then((res) => {
        setSelectedUserData(res.data.data);
      });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <UserNav />
      <div className="section section_padding sec_bg h100vh">
        <div className="container">
          <div className="action_heading">
            <div className="action_title">
              <FormContainer
                mainTitle="Assets Dashboard"
                link="/sim-dashboard"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <div className="d_infocard card shadow">
                <div className="card-body">
                  <div className="d_infocard_txt">
                    <Link to="/sim-overview">
                      <h2>Total</h2>
                    </Link>
                  </div>
                  <div className="d_infocard_icon">
                    <span>{simData.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <div className="d_infocard card shadow">
                <div className="card-body">
                  <div className="d_infocard_txt">
                    <Link to="/sim-overview">
                      <h2>Available</h2>
                    </Link>
                  </div>
                  <div className="d_infocard_icon">
                    <span>{availableObjects.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <div className="d_infocard card shadow">
                <div className="card-body">
                  <div className="d_infocard_txt">
                    <Link to="/sim-overview">
                      <h2>Allocated</h2>
                    </Link>
                  </div>
                  <div className="d_infocard_icon">
                    <span>{allocatedObjects.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="mb-3" />
          <div className="form-group col-3">
            <label className="form-label">
              Department Name<sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={[
                { value: "", label: "All" },
                ...departmentData.map((option) => ({
                  value: option.dept_id,
                  label: option.dept_name,
                })),
              ]}
              value={
                departmentFilter === ""
                  ? { value: "", label: "All" }
                  : {
                      value: departmentFilter,
                      label:
                        departmentData.find(
                          (dept) => dept.dept_id === departmentFilter
                        )?.dept_name || "Select...",
                    }
              }
              onChange={(selectedOption) => {
                const selectedValue = selectedOption
                  ? selectedOption.value
                  : "";
                setDepartmentFilter(selectedValue);
              }}
              required
            />
          </div>
          <div className="row">
            {departmentData.map((item) => {
              // Conditionally render the department card based on the filter
              if (
                departmentFilter === "" ||
                departmentFilter === item.dept_id
              ) {
                return (
                  <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
                    <div
                      className="d_infocard card shadow"
                      onClick={() => handleRowClick(item.dept_id)}
                    >
                      <div className="card-body">
                        <div className="d_infocard_txt">
                          <h3>{item.dept_name}</h3>
                          <h2></h2>
                        </div>
                        <div className="d_infocard_icon">
                          <span>{item.count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null; // Return null for departments that don't match the filter
            })}
          </div>
        </div>
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
              <h2>Assigned Assets User Name</h2>
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
                { name: "Name", selector: "user_name" },
              ]}
              data={selectedUserData.filter((user) =>
                user.user_name.toLowerCase().includes(modalSearch.toLowerCase())
              )}
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-50 form-control"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                />
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SimDashboard;
