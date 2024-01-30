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

import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

const AssetDashboard = () => {
  const { categoryDataContext } = useGlobalContext();

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
  // const userID = decodedToken.id;

  const [category, setCategory] = useState("");
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [subcategory, setSubCategory] = useState("");
  const [newAssetRequest, setNewAssetRequest] = useState([]);
  const [returnAssetData, setReturnAssetData] = useState([]);

  async function getNewAssetData() {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/assetrequest"
      );
      setNewAssetRequest(
        response.data.data?.filter((d) => d.asset_request_status == "Requested")
      );
    } catch (error) {
      console.log(error);
    }
  }

  const [repairRequestData, setRepairRequestData] = useState([]);
  async function getRepariRequestData() {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/show_asset_hr_data"
      );
      setRepairRequestData(
        response.data.data?.filter((d) => d.status == "Requested")
      );
    } catch (error) {
      console.log(error);
    }
  }
  const getReturnAssetData = () => {
    axios.get("http://34.93.221.166:3000/api/assetreturn").then((res) => {
      setReturnAssetData(res.data.singleAssetReturnRequest);
    });
  };
  useEffect(() => {
    getNewAssetData();
    getRepariRequestData();
    getReturnAssetData();
  }, []);

  const getSubCategoryData = () => {
    if (category) {
      axios
        .get(
          `http://34.93.221.166:3000/api/get_single_asset_sub_category/${category}`
        )
        .then((res) => {
          setSubCategoryData(res.data);
          const filtersubcat = subcategory
            ? res.data?.filter((item) => item.sub_category_id === subcategory)
            : res.data;
          setDepartmentData(filtersubcat);
        });
    }
  };
  useEffect(() => {
    getSubCategoryData();
  }, [category]);

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

        const filteredDatas = category
          ? res.data.data?.filter((item) => item.category_id === category)
          : res.data.data;
        setDepartmentData(filteredDatas);
      });
  }

  useEffect(() => {
    getData();
  }, [category]);

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
      <div className="section section_padding sec_bg h100vh">
        <div className="">
          <div className="action_heading">
            <div className="action_title">
              <FormContainer
                mainTitle="Assets Dashboard"
                link="/sim-dashboard"
              />
            </div>
          </div>
          <div className="asset_chart">
            <div className="chart_container">
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: availableObjects.length,
                        label: "Available",
                        color: "rgb(184, 0, 216)",
                      },
                      {
                        id: 1,
                        value: allocatedObjects.length,
                        label: "Allocated",
                      },
                    ],
                    innerRadius: 0,
                    cornerRadius: 5,
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
              <h5 style={{ fontWeight: "bold" }}>
                Total Asset - {simData.length}
              </h5>
            </div>

            <div className="chart_container ml-5">
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      "New Asset Request",
                      "Repair Request",
                      "Return Asset Request",
                    ],
                  },
                ]}
                series={[
                  {
                    data: [
                      newAssetRequest.length,
                      repairRequestData.length,
                      returnAssetData.length,
                    ],
                  },
                  { data: [] },
                  // { data: [2, 5, 6] },
                ]}
                width={600}
                height={300}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <Link to="/sim-overview">
                <div
                  className="d_infocard card shadow p-1"
                  style={{
                    backgroundImage:
                      "linear-gradient(240deg, #fc8ebe 0%, #fce5c3 100%)",
                  }}
                >
                  <div className="card-body">
                    <div className="d_infocard_txt">
                      <h2>Total</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>{simData.length}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <Link to="/sim-overview">
                <div
                  className="d_infocard card shadow p-1"
                  style={{
                    backgroundImage:
                      "linear-gradient(240deg, rgb(124, 136, 224) 0%, #c3f4fc 100%)",
                  }}
                >
                  <div className="card-body">
                    <div className="d_infocard_txt">
                      <h2>Available</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>{availableObjects.length}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <div
                className="d_infocard card shadow p-1"
                style={{
                  backgroundImage:
                    "linear-gradient(240deg, #97e7d1 0%, #ecfcc3 100%)",
                }}
              >
                <Link to="/sim-overview">
                  <div className="card-body">
                    <div className="d_infocard_txt">
                      <h2>Allocated</h2>
                      {/* <SimOverview allocated={isAllocation} /> */}
                    </div>
                    <div className="d_infocard_icon">
                      <span>{allocatedObjects.length}</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <hr className="mb-3" />
          <div className="row">
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
              />
            </div>
            <div className="form-group col-3">
              <label className="form-label">
                Category <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={[
                  { value: "", label: "All" },
                  ...categoryDataContext.map((option) => ({
                    value: option.category_id,
                    label: option.category_name,
                  })),
                ]}
                value={
                  category === ""
                    ? { value: "", label: "All" }
                    : {
                        value: category,
                        label:
                          categoryDataContext.find(
                            (dept) => dept.category_id === category
                          )?.category_name || "Select...",
                      }
                }
                onChange={(selectedOption) => {
                  const selectedValues = selectedOption
                    ? selectedOption.value
                    : "";
                  setCategory(selectedValues);
                  // if (selectedValues === "") {
                  //   getData();
                  // }
                }}
              />
            </div>
            <div className="form-group col-3">
              <label className="form-label">
                Sub Category <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                className=""
                options={[
                  { value: "", label: "All" },
                  ...subcategoryData.map((option) => ({
                    value: option.sub_category_id,
                    label: `${option.sub_category_name}`,
                  })),
                ]}
                value={
                  subcategory === ""
                    ? { value: "", label: "All" }
                    : {
                        value: subcategory,
                        label:
                          subcategoryData.find(
                            (sub) => sub.sub_category_id === subcategory
                          )?.sub_category_name || "Select...",
                      }
                }
                onChange={(select) => {
                  const selectsub = select ? select.value : "";
                  setSubCategory(selectsub);
                  if (selectsub === "") {
                    getData();
                  }
                }}
                required
              />
            </div>
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
                          <h3>cat -{item.category_name}</h3>
                          {/* <h3>subcat -{item.sub_category_name}</h3> */}
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
                { name: "Name", selector: (row) => row.user_name },
                { name: "Category Name", selector: (row) => row.category_name },
                {
                  name: "SubCategory Name",
                  selector: (row) => row.sub_category_name,
                },
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

export default AssetDashboard;
