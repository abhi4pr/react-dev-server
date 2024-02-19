import { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import { baseUrl } from "../../../utils/config";
import { Link } from "react-router-dom";
import FieldContainer from "../FieldContainer";
import jwtDecode from "jwt-decode";

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

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const roleID = decodedToken.role_id;

  const getData = async () => {
    const response = await axios.get(baseUrl + "get_all_wfh_users");
    if (RoleIDContext == 1 || RoleIDContext == 5) {
      setAllWFHDData(response.data.data);
      const attStatus = response.data.data.filter(
        (item) => item.att_status == "registered"
      );
      setFilteredDatas(attStatus);
    } else {
      const deptWiseData = response.data.data?.filter(
        (d) => d.dept_id == ContextDept
      );
      setAllWFHDData(deptWiseData);
      const attStatus = deptWiseData.filter(
        (item) => item.att_status == "registered"
      );
      setFilteredDatas(attStatus);
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
    await getData();
  };

  const onboardingFunc = (e) => {
    e.preventDefault();
    axios.put(baseUrl + "update_user", {
      user_id: rowData.user_id,
      att_status: "onboarded",
    });
    setRemark("");
    getData();
  };

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();

    const result = savedData.filter((d) => {
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

    setAllWFHDData(result);
  }, [search, savedData]); // Dependencies

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
    {
      name: "Alternate Contact Number",
      cell: (row) => row.alternate_contact,
    },
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
    {
      name: "Login ID",
      cell: (row) => row.user_login_id,
    },
    roleID !== 2 && {
      name: "Action",
      cell: (row) => (
        <>
          {row.att_status == "registered" ? (
            <>
              <button type="button" className="btn btn-primary mr-1">
                <Link to={`/admin/wfhd-update/${row.user_id}`}>Edit</Link>
              </button>
              <button type="button" className="btn btn-success">
                <Link to={`/admin/wfh-update-document/${row.user_id}`}>
                  Upload Document
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
              data-toggle="modal"
              data-target="#exampleModal2"
              onClick={() => setRowDataFunc(row)}
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
      <div>
        <FormContainer mainTitle="Payout Overivew" link={"/admin/"} />
        <ul
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
              onClick={() => getFilterData("training")}
            >
              Training ({statusCounts?.training ? statusCounts.training : 0})
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#menu4"
              data-toggle="tab"
              onClick={() => getFilterData("onboarded")}
            >
              Onboarded ({statusCounts.onboarded})
            </a>
          </li>
        </ul>
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

          <div
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
          </div>
        </div>
      </div>
    </>
  );
};

export default WFHDOverview;
