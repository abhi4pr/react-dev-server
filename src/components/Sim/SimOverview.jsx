import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import FormContainer from "../AdminPanel/FormContainer";
import DeleteButton from "../AdminPanel/DeleteButton";
import UserNav from "../Pantry/UserPanel/UserNav";
import jwtDecode from "jwt-decode";
import * as XLSX from "xlsx";
import Select from "react-select";
import Modal from "react-modal";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from "../../utils/config";

const SimOverview = () => {
  const { toastAlert, categoryDataContext } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [ImageModalOpen, setImageModalOpen] = useState(false);

  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  const [userData, setUserData] = useState([]);

  // const [simTypeFilter, setSimTypeFilter] = useState("");
  // const [providerFilter, setProviderFilter] = useState("");

  const [simallocationdata, setSimAllocationData] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [selectedUserTransfer, setSelectedUserTransfer] = useState("");

  const [modalData, setModalData] = useState([]);

  const [particularUserName, setParticularUserName] = useState("");

  const [modalSelectedUserData, setModalSelectedUserData] = useState([]);

  const [simAllocationTransferData, setSimAllocationTransferData] = useState(
    []
  );

  const [showAssetsImage, setShowAssetImages] = useState([]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const [assetsType, setAssetsType] = useState("");
  const AsstestTypeOptions = [
    { value: "New", label: "New" },
    { value: "Old", label: "Old" },
  ];

  function getData() {
    axios.get(baseUrl+"get_all_sims").then((res) => {
      const simAllData = res.data.data;
      // if (status != "") {
      //   const AvailableData = simAllData?.filter(
      //     (data) => data.status.toLowerCase() == status
      //   );
      //   setData(AvailableData);
      //   setFilterData(AvailableData);
      // } else
      if (selectedStatus !== "") {
        const AvailableData = simAllData?.filter(
          (data) => data.status == selectedStatus
        );
        setData(AvailableData);
        setFilterData(AvailableData);
      } else {
        setData(simAllData);
        setFilterData(simAllData);
      }
    });
  }
  // function getAllocatedData (){
  //   axios.get(baseUrl+"get_all_allocations").then((res) => {
  //     console.log(res.data)
  //   });
  // }

  useEffect(() => {
    const MSD = userData?.filter(
      (data) => data.user_id == selectedUserTransfer
    );
    setModalSelectedUserData(MSD);
  }, [selectedUserTransfer]);

  const [category, setCategory] = useState("");
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [subcategory, setSubCategory] = useState("");

  // i want to use context api this is replace

  // const [categoryData, setCategoryData] = useState([]);
  // const getCategoryData = () => {
  //   axios
  //     .get(baseUrl+"get_all_asset_category")
  //     .then((res) => {
  //       setCategoryData(res.data);
  //     });
  // };
  const getSubCategoryData = () => {
    if (category) {
      axios
        .get(
          `${baseUrl}`+`get_single_asset_sub_category/${category}`
        )
        .then((res) => {
          setSubCategoryData(res.data);
        });
    }
  };
  useEffect(() => {
    getSubCategoryData();
  }, [category]);

  useEffect(() => {
    getData();
    // getCategoryData();
  }, [selectedStatus]);

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_allocations")
      .then((res) => {
        setSimAllocationData(res.data.data);
      });

    axios.get(baseUrl+"get_all_users").then((res) => {
      setUserData(res.data.data);
    });
  }, []);

  useEffect(() => {
    const result = data?.filter((d) => {
      return (
        d.mobileNumber?.toLowerCase().match(search.toLowerCase()) ||
        d.provider?.toLowerCase().match(search.toLowerCase()) ||
        d.type?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  function handleParticularSimData(simId) {
    axios
      .get(`${baseUrl}`+`get_single_sim/${simId}`)
      .then((res) => {
        setModalData(res.data.data);
        // console.log(res.data.data , "there is data")
      });
  }

  useEffect(() => {
    if (modalData) {
      const simAllocationTransfer = simallocationdata?.filter(
        (data) => data.sim_id == modalData?.sim_id
      );
      setSimAllocationTransferData(simAllocationTransfer);
    }
  }, [modalData]);

  useEffect(() => {
    if (simAllocationTransferData?.length > 0) {
      const commonUserId = userData?.filter(
        (data) => data.user_id == simAllocationTransferData[0].user_id
      );
      setParticularUserName(commonUserId[0]?.user_name);
    }
  }, [simAllocationTransferData, userData]);

  function handleTransfer() {
    if (selectedUserTransfer != "") {
      const currDate = new Date().toISOString();
      const dateString = currDate.replace("T", " ").replace("Z", "");
      axios.put(baseUrl+"update_allocationsim", {
        sim_id: simAllocationTransferData[0].sim_id,
        allo_id: simAllocationTransferData[0].allo_id,
        user_id: simAllocationTransferData[0].user_id,
        // dept_id: modalSelectedUserData[0].dept_id,
        status: "Available",
        submitted_by: userID,
        Last_updated_by: userID,
        Reason: "",
        submitted_at: dateString,
      });

      axios.post(baseUrl+"add_sim_allocation", {
        user_id: Number(selectedUserTransfer),
        sim_id: Number(simAllocationTransferData[0].sim_id),
        // dept_id: Number(modalSelectedUserData[0].dept_id),
        created_by: userID,
      });
      setSelectedUserTransfer("");
    } else {
      alert("Please Select User");
    }
  }

  const handleSimAllocation = async () => {
    if (selectedUserTransfer !== "") {
      await axios.post(baseUrl+"add_sim_allocation", {
        user_id: Number(selectedUserTransfer),
        status: "Allocated",
        sim_id: Number(modalData.sim_id),
        category_id: Number(modalData.category_id),
        sub_category_id: Number(modalData.sub_category_id),
        created_by: userID,
      });

      await axios
        .put(baseUrl+"update_sim", {
          id: modalData.sim_id,
          mobilenumber: modalData.mobileNumber,
          sim_no: modalData.sim_no,
          provider: modalData.provider,
          dept_id: Number(modalSelectedUserData[0].dept_id),
          desi_id: Number(modalSelectedUserData[0].user_designation),
          status: "Allocated",
          s_type: modalData.s_type,
          type: modalData.type,
          remark: modalData.Remarks,
        })
        .then(() => {
          getData();
          toastAlert("Asset Allocated Successfully");
          setSelectedUserTransfer("");
        });
    } else {
      alert("Please select user first");
    }
  };

  // console.log(modalData , "there is modal data")
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
    },
    {
      name: "Assets Name",
      selector: (row) => (
        <Link
          style={{ color: "blue" }}
          to={`/singleAssetDetails/${row.sim_id}`}
        >
          {row.assetsName}
        </Link>
      ),
      width: "150px",
      sortable: true,
    },
    {
      name: "Asset ID",
      selector: (row) => row.asset_id,
      sortable: true,
    },
    {
      name: "Allocated To",
      selector: (row) => row.allocated_username,
      sortable: true,
      width: "150px",
    },
    {
      name: "Duration",
      selector: (row) => row.date_difference + " " + " Days",
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: "sub category",
      selector: (row) => row.sub_category_name,
      sortable: true,
    },

    {
      name: "Value",
      selector: (row) => row.assetsValue,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
    },

    {
      name: "img",
      selector: (row) => (
        <button
          className="btn btn-outline-success"
          onClick={() => handleImageClick(row.sim_id)}
        >
          <i className="bi bi-images"></i>
        </button>
      ),
    },
    {
      name: "Invoice",
      selector: (row) => (
        <>
          <a style={{ cursor: "pointer" }} href={row.invoiceCopy_url} download>
            {/* <img
              style={{ width: "100px" }}
              src={row.invoiceCopy_url}
              alt="invoice copy"
            /> */}
            <i
              class="fa fa-download"
              aria-hidden="true"
              style={{ fontSize: "25px", color: "blue" }}
            ></i>
          </a>
        </>
      ),
      sortable: true,
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          {/* <button className="btn btn-outline-success">
            <i className="bi bi-images"></i>
          </button> */}
          <Link to={`/sim-update/${row.sim_id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>

          <DeleteButton
            endpoint="delete_sim"
            id={row.sim_id}
            getData={getData}
          />

          <Link to={`/sim-summary/${row.sim_id}`}>
            <button
              title="Summary"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <i className="bi bi-journal-text"></i>
            </button>
          </Link>

          {selectedStatus == "Allocated" && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm user-button"
              data-toggle="modal"
              data-target="#exampleModal"
              data-whatever="@mdo"
              onClick={() => handleParticularSimData(row.sim_id)}
            >
              <i className="bi bi-arrow-up-right"></i>
            </button>
          )}

          {selectedStatus == "Available" && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm user-button"
              data-toggle="modal"
              data-target="#AllocationModal"
              data-whatever="@mdo"
              onClick={() => handleParticularSimData(row.sim_id)}
            >
              A
            </button>
          )}
        </>
      ),
      allowOverflow: true,
      width: "25%",
    },
  ];

  // const [buttonAccess, setButtonAccess] = useState(false);

  const handleExport = () => {
    const fileName = "data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  const handleImageClick = (row) => {
    axios
      .post(`${baseUrl}`+`get_single_assets_image`, {
        sim_id: row,
      })
      .then((res) => {
        setShowAssetImages(res.data.data);
      });
    setImageModalOpen(true);
  };
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };
  useEffect(() => {
    const result = data?.filter((d) => {
      const categoryMatch = !category || d.category_id === category;
      const subcategoryMatch =
        !subcategory || d.sub_category_id === subcategory;
      const assettypeMatch = !assetsType || d.asset_type === assetsType;
      // console.log(assetsType, d.asset_type, "asset");
      return categoryMatch && subcategoryMatch && assettypeMatch;
    });
    setFilterData(result);
  }, [category, subcategory, assetsType]);

  return (
    <>
      <div>
        <UserNav />

        <div className="section section_padding sec_bg h100vh">
          <div className="container mt-2">
            <div className="action_heading">
              <div className="action_title">
                <FormContainer
                  mainTitle="Assets"
                  link="/sim-master"
                  submitButton={false}
                />
              </div>
              <div className="action_btns">
                <button
                  type="button"
                  className={"btn btn-outline-primary btn-sm"}
                >
                  <Link to="/admin/asset-dashboard">Dashboard</Link>
                </button>

                {/* There is masters  */}

                <Link to="/asset-category-overview">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Assets Category
                  </button>
                </Link>
                <Link to="/asset/subCategory/overview">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Assets SubCategory
                  </button>
                </Link>
                <Link to="/venderOverView">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Vendor
                  </button>
                </Link>

                <button
                  type="button"
                  className={`btn ${
                    selectedStatus == "Available"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } btn-sm`}
                  onClick={() => setSelectedStatus("Available")}
                >
                  Available
                </button>
                <button
                  type="button"
                  className={`btn ${
                    selectedStatus == "Allocated"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } btn-sm`}
                  onClick={() => setSelectedStatus("Allocated")}
                >
                  Allocated
                </button>
                <button
                  type="button"
                  className={`btn ${
                    selectedStatus == "" ? "btn-primary" : "btn-outline-primary"
                  } btn-sm`}
                  onClick={() => setSelectedStatus("")}
                >
                  All Assets
                </button>

                <Link to="/sim-allocation-overview">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Return Assets
                  </button>
                </Link>

                <Link to="/repair-request">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Repair Management
                  </button>
                </Link>
                <Link to="/sim-master">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Add Assets
                  </button>
                </Link>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-body pb0 pb4">
                <div className="row thm_form">
                  <div className="form-group col-3">
                    <label className="form-label">
                      Category <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      options={[
                        { value: "", label: "All" },
                        ...categoryDataContext?.map((option) => ({
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
                                categoryDataContext?.find(
                                  (dept) => dept.category_id === category
                                )?.category_name || "Select...",
                            }
                      }
                      onChange={(selectedOption) => {
                        const selectedValue = selectedOption
                          ? selectedOption.value
                          : "";
                        setCategory(selectedValue);
                        if (selectedValue === "") {
                          getData();
                        }
                      }}
                      required
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
                        ...subcategoryData?.map((option) => ({
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
                                subcategoryData?.find(
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
                  <div className="form-group col-3">
                    <label className="form-label">
                      Assets Type<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      value={AsstestTypeOptions.find(
                        (option) => option.value === assetsType
                      )}
                      onChange={(selectedOption) => {
                        setAssetsType(selectedOption.value);
                      }}
                      options={AsstestTypeOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="page_height">
              <div className="card mb-4">
                <div className="data_tbl table-responsive">
                  <DataTable
                    title="Assets Overview"
                    columns={columns}
                    data={filterdata}
                    fixedHeader
                    // pagination
                    fixedHeaderScrollHeight="64vh"
                    exportToCSV
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <>
                        <input
                          type="text"
                          placeholder="Search here"
                          className="w-50 form-control "
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                          className="btn btn-outline-success ml-2 btn-sm"
                          onClick={handleExport}
                        >
                          Export TO Excel
                        </button>
                      </>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Start */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Transfer
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            {/* Modal here----------------------- */}

            <div className="modal-body">
              <form className="modal_formdata">
                <div className="modal_formbx">
                  <ul>
                    <li>
                      <span>Asset Name : </span>
                      {modalData.assetsName}
                    </li>
                    <li>
                      <span>Registered TO: </span>
                      {modalData.register}
                    </li>
                    <li>
                      <span>Status: </span>
                      {modalData.status}
                    </li>
                    <li>
                      <span>Allocated To: </span>
                      {particularUserName}
                    </li>
                    <li>
                      <span>Sim Type: </span>
                      {modalData.s_type}
                    </li>
                  </ul>
                </div>
                {/* <div className="modal_formbx row thm_form">
                  <FieldContainer
                    label="Allocate TO"
                    fieldGrid={12}
                    Tag="select"
                    value={selectedUserTransfer}
                    onChange={(e) => setSelectedUserTransfer(e.target.value)}
                  >
                    <option value="">Please Select</option>
                    {userData.map((data) => (
                      <option value={data.user_id} key={data.user_id}>
                        {data.user_name}
                      </option>
                    ))}
                  </FieldContainer>
                </div> */}
                <div className="modal_formbx row thm_form">
                  <div className="form-group col-12">
                    <label className="form-label">
                      Allocate To <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      className=""
                      options={userData?.map((option) => ({
                        value: option.user_id,
                        label: `${option.user_name}`,
                      }))}
                      value={{
                        value: selectedUserTransfer,
                        label:
                          userData?.find(
                            (user) => user.user_id == selectedUserTransfer
                          )?.user_name || "",
                      }}
                      onChange={(e) => {
                        setSelectedUserTransfer(e.value);
                      }}
                      required
                    />
                  </div>
                </div>
                {modalSelectedUserData?.length > 0 && (
                  <div className="modal_formbx">
                    <ul>
                      <li>
                        <span>Department : </span>
                        {modalSelectedUserData[0].department_name}
                      </li>
                      <li>
                        <span>Designation : </span>
                        {modalSelectedUserData[0].designation_name}
                      </li>
                    </ul>
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleTransfer}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="AllocationModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="AllocationModal"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="AllocationModal">
                Allocation
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form className="modal_formdata">
                <div className="modal_formbx">
                  <ul>
                    <li>
                      <span>Asset Name : </span>
                      {modalData.assetsName}
                    </li>
                    <li>
                      <span>Asset ID: </span>
                      {modalData.asset_id}
                    </li>
                    <li>
                      <span>Status: </span>
                      {modalData.status}
                    </li>
                  </ul>
                </div>
                {/* <div className="modal_formbx row thm_form">
                  <FieldContainer
                    label="Users"
                    Tag="select"
                    fieldGrid={12}
                    value={selectedUserTransfer}
                    onChange={(e) => setSelectedUserTransfer(e.target.value)}
                  >
                    <option value="">Please Select</option>
                    {userData.map((data) => (
                      <option value={data.user_id} key={data.user_id}>
                        {data.user_name}
                      </option>
                    ))}
                  </FieldContainer>
                </div> */}
                <div className="modal_formbx row thm_form">
                  <div className="form-group col-12">
                    <label className="form-label">
                      Allocate To <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      className=""
                      options={userData?.map((option) => ({
                        value: option.user_id,
                        label: `${option.user_name}`,
                      }))}
                      value={{
                        value: selectedUserTransfer,
                        label:
                          userData?.find(
                            (user) => user.user_id == selectedUserTransfer
                          )?.user_name || "",
                      }}
                      onChange={(e) => {
                        setSelectedUserTransfer(e.value);
                      }}
                      required
                    />
                  </div>
                </div>

                {modalSelectedUserData?.length > 0 && (
                  <div className="modal_formbx">
                    <ul>
                      <li>
                        <span>Department : </span>
                        {modalSelectedUserData[0].department_name}
                      </li>
                      <li>
                        <span>Designation : </span>
                        {modalSelectedUserData[0].designation_name}
                      </li>
                    </ul>
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSimAllocation}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
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
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Assets Images</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseImageModal}
            >
              X
            </button>
          </div>
        </div>

        {showAssetsImage?.length > 0 && (
          <>
            <h2>Type : {showAssetsImage[0]?.type}</h2>
            <div className="summary_cards flex-row row">
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          style={{ cursor: "pointer" }}
                          href={showAssetsImage[0]?.img1_url}
                          download
                        >
                          <img
                            src={showAssetsImage[0]?.img1_url}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          style={{ cursor: "pointer" }}
                          href={showAssetsImage[0]?.img2_url}
                          download
                        >
                          <img
                            src={showAssetsImage[0]?.img2_url}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          style={{ cursor: "pointer" }}
                          href={showAssetsImage[0]?.img3_url}
                          download
                        >
                          <img
                            src={showAssetsImage[0]?.img3_url}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          style={{ cursor: "pointer" }}
                          href={showAssetsImage[0]?.img4_url}
                          download
                        >
                          <img
                            src={showAssetsImage[0]?.img4_url}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};
export default SimOverview;
