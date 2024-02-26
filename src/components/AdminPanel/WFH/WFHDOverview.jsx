import { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import { baseUrl } from "../../../utils/config";
import { Link } from "react-router-dom";
import FieldContainer from "../FieldContainer";
import jwtDecode from "jwt-decode";
import Modal from "react-modal"
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import DetailsIcon from '@mui/icons-material/Details';

const WFHDOverview = () => {
  const { ContextDept, RoleIDContext } = useAPIGlobalContext();
  const [allWFHDData, setAllWFHDData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [search, setSearch] = useState("");
  const [remark, setRemark] = useState("");
  const [rowData, setRowData] = useState({});
  const [filterDataS, setFilteredDatas] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    registered: 0,
    document_upload: 0,
    training: 0,
    onboarded: 0,
  });
  const [trainingDate, setTrainingDate] = useState("");
  const [showOnBoardModal, setShowOnBoardModal] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [searchFilter, setSearchFilter] = useState([])

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const roleID = decodedToken.role_id;

  const getData = async () => {
    const response = await axios.get(baseUrl + "get_all_wfh_users");
    if (RoleIDContext == 1 || RoleIDContext == 5) {
      setAllWFHDData(response.data.data);
      const FinalResonse = response.data.data

      let filterTabWise = [];
      switch (activeTab) {
        case 0:
          filterTabWise = FinalResonse.filter(
            (item) => item.att_status == "registered"
          );
          break;

        case 1:
          filterTabWise = FinalResonse.filter(
            (item) => item.att_status == "document_upload"
          );
          break;

        case 2:
          filterTabWise = FinalResonse.filter(
            (item) => item.att_status == "training"
          );
          break;

        case 3:
          filterTabWise = FinalResonse.filter(
            (item) => item.att_status == "onboarded"
          );
          break;

        default:
          filterTabWise = FinalResonse.filter(
            (item) => item.att_status == "registered"
          );
      }

      setFilteredDatas(filterTabWise);
      setSearchFilter(filterTabWise)

    } else {
      const deptWiseData = response.data.data?.filter(
        (d) => d.dept_id == ContextDept
      );
      setAllWFHDData(deptWiseData);


      let filterTabWise = [];
      switch (activeTab) {
        case 0:
          filterTabWise = deptWiseData.filter(
            (item) => item.att_status == "registered"
          );
          break;

        case 1:
          filterTabWise = deptWiseData.filter(
            (item) => item.att_status == "document_upload"
          );
          break;

        case 2:
          filterTabWise = deptWiseData.filter(
            (item) => item.att_status == "training"
          );
          break;

        case 3:
          filterTabWise = deptWiseData.filter(
            (item) => item.att_status == "onboarded"
          );
          break;

        default:
          filterTabWise = deptWiseData.filter(
            (item) => item.att_status == "registered"
          );
      }



      setFilteredDatas(filterTabWise);
      setSearchFilter(filterTabWise)

      setSavedData(response.data.data?.filter((d) => d.dept_id == ContextDept));
    }
    const counts = response.data.data.reduce((acc, curr) => {
      if (
        RoleIDContext == 1 ||
        RoleIDContext == 5 ||
        curr.dept_id == ContextDept
      ) {
        acc[curr.att_status] = (acc[curr.att_status] || 0) + 1;
      }
      return acc;
    }, {});
    setStatusCounts(counts);
  };

  useEffect(() => {
    getData();
  }, []);

  function getFilterData(status) {
    const newData = allWFHDData.filter((item) => item.att_status == status);
    setFilteredDatas(newData);
  }

  const setRowDataFunc = (row) => {
    setRowData(row);
  };

  const trainingFunc = async (e) => {
    e.preventDefault();
    const payload = {
      user: rowData.user_id,
      done_by: userID,
      remark: remark,
      training_date: trainingDate,
    };
    await axios.post(baseUrl + "add_user_training", payload);
    await axios.put(baseUrl + "update_user", {
      user_id: rowData.user_id,
      att_status: "training",
    });
    setRemark("");
    setTrainingDate("");
    await getData();
  };

  const onboardingFunc = async (e) => {
    e.preventDefault();
    try {
      await axios.put(baseUrl + "update_user", {
        user_id: rowData.user_id,
        att_status: "onboarded",
      });
      setRemark("");
      setShowOnBoardModal(false)
      // setActiveTab(prev =>prev + 1);
    } catch (error) {
      console.error(error)
    } finally {
      getData()
    }
  }


  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();

    const result = searchFilter.filter((d) => {
      const matchesUserName = d.user_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesDeptName = d.dept_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesDesiName = d.desi_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesJobType = d.job_type
        ?.toLowerCase()
        .includes(lowerCaseSearch);

      return (
        matchesUserName || matchesDeptName || matchesDesiName || matchesJobType
      );
    });

    setFilteredDatas(result);
  }, [search, searchFilter]); // Dependencies

  const FilterTabData = (filterValue) => {
    let filteredData = [];

    switch (filterValue) {
      case "registered":
        filteredData = allWFHDData.filter((option) => option.att_status == filterValue);
        break;
      case "document_upload":
        filteredData = allWFHDData.filter(
          (option) => option.att_status == filterValue
        );
        break;
      case "training":
        filteredData = allWFHDData.filter(
          (option) => option.att_status == filterValue
        );
        break;
      case "onboarded":
        filteredData = allWFHDData.filter(
          (option) => option.att_status == filterValue
        );
        break;
      default:
        filteredData = allWFHDData;
    }

    setFilteredDatas(filteredData);
    setSearchFilter(filteredData)
  };


  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "User Name",
      cell: (row) => row.user_name,
    },
    {
      name: "Employee ID",
      cell: (row) => row.emp_id,
      width: "120px",
    },
    {
      name: "Profile status",
      cell: (row) => row.profile_status + " %",
    },
    {
      name: "status",
      cell: (row) => (
        <>
          {row.user_status === "Active" ? (
            <span className="badge badge-success">Active</span>
          ) : row.user_status === "Exit" || row.user_status === "On Leave" ? (
            <span className="badge badge-warning">{row.user_status}</span>
          ) : row.user_status === "Resign" ? (
            <span className="badge badge-danger">Resigned</span>
          ) : null}
        </>
      ),
      width: "100px",
    },
    {
      name: "Login ID",
      cell: (row) => row.user_login_id,
    },
    {
      name: "Personal Contact Number",
      cell: (row) => row.PersonalNumber,
    },
    // {
    //   name: "Alternate Contact Number",
    //   cell: (row) => row.alternate_contact,
    // },
    {
      name: "Department",
      cell: (row) => row.department_name,
      width: "120px",
    },
    {
      name: "Designation",
      cell: (row) => row.designation_name,
      width: "170px",
    },
    {
      name: "Job Type",
      cell: (row) => row.job_type,
      width: "100px",
    },
    {
      name: "Email",
      cell: (row) => row.user_email_id,
    },
    // {
    //   name: "Login ID",
    //   cell: (row) => row.user_login_id,
    // },
    roleID !== 2 && {
      name: "Action",
      cell: (row) => (
        <>
          {row.att_status == "registered" ? (
            <>
              <button title="Edit user" type="button" className="btn btn-primary mr-1">
                <Link to={`/admin/wfhd-update/${row.user_id}`}><EditIcon /></Link>
              </button>
              <button title="Bank details" type="button" className="btn btn-primary mr-1">
                <Link to={`/admin/wfhd-bank-update/${row.user_id}`}><DetailsIcon /></Link>
              </button>
              <button title="Document upload" type="button" className="btn btn-success">
                <Link to={`/admin/wfh-update-document/${row.user_id}`}>
                  <UploadIcon />
                </Link>
              </button>
            </>
          ) : row.att_status == "document_upload" ? (
            <button
              type="button"
              className="btn btn-success"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={() => setRowDataFunc(row)}
            >
              Training Done
            </button>
          ) : row.att_status == "training" ? (
            <button
              type="button"
              className="btn btn-success"
              // data-toggle="modal"
              // data-target="#exampleModal2"

              onClick={() => {
                setRowDataFunc(row)
                setShowOnBoardModal(true)
              }
              }
            >
              Onboard
            </button>
          ) : row.att_status == "onboarded" ? (
            "User Onboarded"
          ) : null}
        </>
      ),
      width: "100px",
    },
  ];

  return (
    <>
      <Modal
        className="Ready to Onboard"
        isOpen={showOnBoardModal}
        onRequestClose={() => setShowOnBoardModal(false)}
        contentLabel="Preview Modal"
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          },
          content: {
            position: "absolute",

            width: "500px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
          },
        }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel2">
                Onboard user
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={() => setShowOnBoardModal(false)}>×</span>
              </button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Remark"
                fieldGrid={12}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required={true}
              ></FieldContainer>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                // data-dismiss="modal"
                onClick={() => setShowOnBoardModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onboardingFunc}
                // data-dismiss="modal"
                disabled={!remark}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div>
        {console.log(activeTab)}
        <FormContainer mainTitle="My Team" link={"/admin/"} />
        {/* <ul
          className="nav nav-pills nav-fill navtop"
          style={{ marginBottom: "20px" }}
        >
          <li className="nav-item">
            <a
              className="nav-link active"
              href="#menu1"
              data-toggle="tab"
              onClick={() => getFilterData("registered")}
            >
              Registered ({statusCounts.registered})
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#menu2"
              data-toggle="tab"
              onClick={() => getFilterData("document_upload")}
            >
              Upload Document ({statusCounts.document_upload})
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#menu3"
              data-toggle="tab"
              id="training_tab"
              onClick={() => getFilterData("training")}
            >
              Training ({statusCounts?.training ? statusCounts.training : 0})
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#menu4"
              id="onboarded_tab"
              data-toggle="tab"
              onClick={() => getFilterData("onboarded")}
            >
              Onboarded ({statusCounts.onboarded})
            </a>
          </li>
        </ul> */}
        <div className="card-header d-flex flex-row align-items-center justify-content-between">
          <div className="btn-group w-100">
            <button
              className={`btn ${activeTab == 0 ? "btn-primary" : "btn-outline-primary"
                }`}
              onClick={() => {
                FilterTabData("registered"), setActiveTab(0);
              }}
            >
              Registered ({statusCounts.registered})
            </button>
            <button
              className={`btn ${activeTab == 1 ? "btn-primary" : "btn-outline-primary"
                }`}
              onClick={() => {
                FilterTabData("document_upload"), setActiveTab(1);
              }}
            >
              Upload document ({statusCounts.document_upload})
            </button>
            <button
              className={`btn ${activeTab == 2 ? "btn-primary" : "btn-outline-primary"
                }`}
              onClick={() => {
                FilterTabData("training"), setActiveTab(2);
              }}
            >
              Training ({statusCounts.training})
            </button>
            <button
              className={`btn ${activeTab == 3 ? "btn-primary" : "btn-outline-primary"
                }`}
              onClick={() => {
                FilterTabData("onboarded"), setActiveTab(3);
              }}
            >
              Onboarded ({statusCounts.onboarded})
            </button>
          </div>
        </div>
        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Payout Users"
              columns={columns}
              data={filterDataS}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search Here"
                  className="w-50 form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>

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
                  Done Training
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
                <FieldContainer
                  label="Remark"
                  fieldGrid={12}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  required={true}
                ></FieldContainer>
                <FieldContainer
                  type="date"
                  label="Training Date"
                  fieldGrid={12}
                  min={rowData?.joining_date && rowData?.joining_date.split("T")[0]}
                  value={trainingDate}
                  onChange={(e) => setTrainingDate(e.target.value)}
                />
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
                  onClick={trainingFunc}
                  data-dismiss="modal"
                  disabled={!remark || !trainingDate}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>

          {/* <div
            className="modal fade"
            id="exampleModal2"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel2"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel2">
                    Onboard user
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
                  <FieldContainer
                    label="Remark"
                    fieldGrid={12}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    required={true}
                  ></FieldContainer>
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
                    onClick={onboardingFunc}
                    data-dismiss="modal"
                    disabled={!remark}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default WFHDOverview;
