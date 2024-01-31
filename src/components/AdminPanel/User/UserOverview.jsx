import { useEffect, useState } from "react";
import axios from "axios";
import "./ShowData.css";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { RiLoginBoxLine } from "react-icons/ri";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import FieldContainer from "../FieldContainer";
import Select from "react-select";
import { useGlobalContext } from "../../../Context/Context";
import Modal from "react-modal";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import {baseUrl} from '../../../utils/config'

const UserOverview = () => {
  const whatsappApi = WhatsappAPI();
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [contextData, setData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [desiOrgData, setDesiOrgData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [jobType, setJobType] = useState("ALL");
  const [transferResponsibilityData, setTransferResponsibilityData] = useState(
    []
  );
  const [remark, setRemark] = useState("");
  const [transferTo, setTransferTo] = useState(0);
  const [transferToUser, setTransferToUser] = useState([]);
  const [username, setUserName] = useState("");
  const [usercontact, setUserContact] = useState("");
  const navigate = useNavigate();
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const roleToken = decodedToken.role_id;
  const oldToken = sessionStorage.getItem("token");
  const [checkedData, setCheckedData] = useState([]);
  const [separationReasonGet, setSeparationReasonGet] = useState([]);
  const [separationUserID, setSeparationUserID] = useState(null);
  const [separationStatus, setSeparationStatus] = useState("");
  const [separationReason, setSeparationReason] = useState("");
  const [separationRemark, setSeparationRemark] = useState("");
  const [separationReinstateDate, setSeparationReinstateDate] = useState("");
  const [separationResignationDate, setSeparationResignationDate] =
    useState("");
  const [separationLWD, setSeparationLWD] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [KRIData, setKRIData] = useState([]);
  const [map1, setMap1] = useState({});

  const handleKRA = (userId) => {
    setIsModalOpen(true);
    KRAAPI(userId);
  };

  const KRAAPI = (userId) => {
    axios
      .get(`${baseUrl}`+`get_single_kra/${userId}`)
      .then((res) => {
        setKRIData(res.data);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setKRIData([]);
  };

  function handleSeprationReason(userId, username, user_contact_no) {
    setSeparationUserID(userId);
    setUserName(username);
    setUserContact(user_contact_no);
    axios
      .get(baseUrl+"get_all_reasons")
      .then((res) => setSeparationReasonGet(res.data));
  }
  const today = new Date().toISOString().split("T")[0];

  function handleSeparationDataPost() {
    axios.post(baseUrl+"add_separation", {
      user_id: separationUserID,
      status: separationStatus,
      created_by: userID,
      resignation_date: separationResignationDate,
      last_working_day: separationLWD,
      remark: separationRemark,
      reason: separationReason,
    });
    whatsappApi.callWhatsAPI(
      "CF_Separation",
      JSON.stringify(usercontact),
      username,
      [username, separationStatus]
    );
  }

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}`+`get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setData(res.data);
        });
    }
  }, [userID]);

  // Admin Login from User
  const handleLogin = (user_id, user_login_id, user_login_password) => {
    axios
      .post(baseUrl+"login_user", {
        user_id: user_id,
        user_login_id: user_login_id,
        user_login_password: user_login_password,
        role_id: roleToken,
      })
      .then((res) => {
        const token1 = res.data.token;
        sessionStorage.getItem("token", token1);
        if (oldToken && token1) {
          sessionStorage.setItem("token", token1);
          window.open("/", "_blank");
          sessionStorage.setItem("token", oldToken);
        } else {
          navigate("/admin/user-overview");
        }
      });
  };

  async function getData() {
    try {
      const response = await axios.get(
        baseUrl+"get_all_users"
      );
      const data = response.data.data;
      setDatas(data);
      setFilterData(data);
      setTransferToUser(data);
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  }

  const departmentAPI = () => {
    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        setDepartmentData(res.data);
        getData();
      });
  };

  const designationAPI = () => {
    axios
      .get(baseUrl+"get_all_designations")
      .then((res) => {
        setDesiOrgData(res.data.data);
      });
  };

  const handleDelete = (userId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${baseUrl}`+`delete_user/${userId}`)
            .then(() => {
              // Check if no error occurred and then show the success alert
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Your file has been deleted.",
                "success"
              );
              getData();
            })
            .catch(() => {
              showErrorAlert();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)"
          );
        }
      });
  };

  useEffect(() => {
    getData();
    departmentAPI();
    designationAPI();
  }, []);

  useEffect(() => {
    const deptWiseDesi = desiOrgData.filter(
      (d) => d.dept_id == departmentFilter
    );
    setDesignationData(deptWiseDesi);
  }, [departmentFilter]);

  useEffect(() => {
    const result1 = datas.filter((d) => {
      return (
        d.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.department_name?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilterData(result1);
  }, [search]);

  useEffect(() => {
    const result = datas.filter((d) => {
      console.log("each data", d.user_designation, designationFilter);
      const departmentMatch =
        !departmentFilter || d.dept_id === departmentFilter;
      const designationMatch =
        !designationFilter || d.user_designation === designationFilter;
      const jobtypeMatch = jobType === "ALL" || d.job_type === jobType;
      return departmentMatch && designationMatch && jobtypeMatch;
    });
    console.log("result", result);
    setFilterData(result);
  }, [departmentFilter, designationFilter, jobType]);

  const jobTypeOptions = [
    { value: "ALL", label: "All" },
    { value: "WFO", label: "WFO" },
    { value: "WFH", label: "WFH" },
    { value: "WFHD", label: "WFHD" },
  ];

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      width: 70,
      renderCell: (params) => <div>{params.row.id + 1}</div>,
    },
    {
      field: "user_name",
      headerName: "User Name",
      width: 120,
      renderCell: (params) => (
        <Link
          to={`/admin/user-single/${params.row.user_id}`}
          style={{ color: "blue" }}
        >
          {params.row.user_name}
        </Link>
      ),
      sortable: true,
    },
    {
      field: "emp_id",
      headerName: "Employee ID",
      width: 100,
      sortable: true,
    },
    { field: "Role_name", headerName: "Role", width: 110, sortable: true },
    {
      field: "percentage_filled",
      headerName: "Profile Status",
      width: 110,
      sortable: true,
    },
    {
      field: "user_login_id",
      headerName: "Login ID",
      width: 190,
      sortable: true,
    },
    {
      field: "designation_name",
      headerName: "Designation",
      width: 180,
      sortable: true,
    },
    {
      field: "department_name",
      headerName: "Department",
      width: 120,
      sortable: true,
    },
    {
      field: "job_type",
      headerName: "Job Type",
      width: 120,
      sortable: true,
    },
    { field: "user_email_id", headerName: "Email", width: 230 },
    {
      field: "user_status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <>
          {params.row.user_status === "Active" ? (
            <span className="badge badge-success">Active</span>
          ) : params.row.user_status === "Exit" ||
            params.row.user_status === "On Leave" ? (
            <span className="badge badge-warning">
              {params.row.user_status}
            </span>
          ) : params.row.user_status === "Resign" ? (
            <span className="badge badge-danger">Resigned</span>
          ) : null}
        </>
      ),
    },
    {
      field: "auth",
      headerName: "Auth",

      width: 90,
      renderCell: (params) => (
        <>
          {contextData &&
            contextData[0] &&
            contextData[3].update_value === 1 && (
              <Link to={`/admin/user-auth-detail/${params.row.user_id}`}>
                <Button variant="contained" color="primary" size="small">
                  Auth
                </Button>
              </Link>
            )}
        </>
      ),
    },
    {
      field: "kra",
      headerName: "KRA",
      width: 90,
      renderCell: (params) => (
        <>
          {contextData &&
            contextData[0] &&
            contextData[3].update_value === 1 && (
              <Button
                size="small"
                variant="contained"
                onClick={() => handleKRA(params.row.user_id)}
              >
                KRA
              </Button>
            )}
        </>
      ),
    },
    {
      field: "log",
      headerName: "Log",
      width: 80,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={<RiLoginBoxLine />}
          onClick={() =>
            handleLogin(
              params.row.user_id,
              params.row.user_login_id,
              params.row.user_login_password
            )
          }
        ></Button>
      ),
    },
    {
      field: "transfer_res",
      headerName: "Transfer Res",
      width: 110,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          data-toggle="modal"
          data-target="#exampleModal1"
          data-whatever="@mdo"
          onClick={() => handleTransfer(params.row.user_id)}
        >
          Transfer
        </Button>
      ),
    },
    {
      field: "separation",
      headerName: "Separation",
      width: 100,
      renderCell: (params) => (
        <Button
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#exampleModal"
          size="small"
          variant="contained"
          color="primary"
          onClick={() =>
            handleSeprationReason(
              params.row.user_id,
              params.row.user_name,
              params.row.user_contact_no
            )
          }
        >
          Sep
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          {contextData &&
            contextData[0] &&
            contextData[0].update_value === 1 && (
              <Link to={`/admin/user-update/${params.row.user_id}`}>
                <EditIcon sx={{ gap: "4px", margin: "5px", color: "blue" }} />
              </Link>
            )}
          {contextData &&
            contextData[0] &&
            contextData[0].delete_flag_value === 1 && (
              <DeleteOutlineIcon
                sx={{ gap: "4px", margin: "15px" }}
                color="error"
                onClick={() => handleDelete(params.row.user_id)}
              />
            )}
        </>
      ),
    },
    {
      field: "User Map",
      headerName: "User Map",
      width: 100,
      renderCell: (params) => (
        <Button
          className="btn btn-success"
          data-toggle="modal"
          data-target="#mapModal"
          size="small"
          variant="contained"
          color="success"
          onClick={() => setMap1(params.row)}
        >
          Open Map
        </Button>
      ),
    },
  ];

  const handleTransfer = (userId) => {
    axios
      .get(`${baseUrl}`+`get_single_kra/${userId}`)
      .then((res) => {
        setTransferResponsibilityData(res.data);
      });
  };

  function handleAllCheckedData(event) {
    if (event.target.checked) {
      setCheckedData([...transferResponsibilityData]);
    } else {
      setCheckedData([]);
      const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
  }

  function handleCheckedData(row) {
    if (checkedData.includes(row)) {
      setCheckedData(checkedData.filter((r) => r !== row));
    } else {
      setCheckedData([...checkedData, row]);
    }
  }

  const handleTransferSubmit = () => {
    for (const element of checkedData) {
      const requestData = {
        user_to_id: transferTo,
        remarks: remark,
        created_by: userID,
        user_from_id: element.user_id,
        job_responsibility_id: element.Job_res_id,
        Job_res_id: element.Job_res_id,
      };
      axios
        .post(baseUrl+"add_kra", requestData)
        .then(() => {
          setRemark("");
          setTransferTo("");
          toastAlert("KRA Transfer Successfully");
          const MailUser = transferToUser.find((d) => d.user_id == transferTo);
          axios.post(baseUrl+"add_send_user_mail", {
            email: MailUser.user_email_id,
            subject: "User Registration",
            text: "You Have Assign New KRA",
          });
        });
    }
  };

  // const options = [
  //   { value: "All", label: "All" },
  //   ...designationData.map((option) => ({
  //     value: option.desi_id,
  //     label: option.desi_name,
  //   })),
  // ];

  // const selectedOption =
  //   options.find((option) => option.value === designationFilter) || null;

  // const selectedOption = designationFilter ? designationFilter ==="All"
  // ?     { value: "All", label: "All" }:
  // {
  //  value: designationFilter,
  //  label: designationData.find((desi)=>desi.desi_id ===designationFilter)?.desi_name || "",
  // }
  // const options = [
  //   { value: "All", label: "All" },
  //   ...designationData.map((option) => ({
  //     value: option.desi_id,
  //     label: option.desi_name,
  //   })),
  // ];

  // Finding the selected option
  // const selectedOption = designationFilter
  //   ? options.find((option) => option.value === designationFilter)
  //   : null;

  const apiKey = "AIzaSyCRv0hz37kV5Oa-2Pz-D3JEReg1snhU4S0";
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${map1?.latitude?.$numberDecimal},${map1?.longitude?.$numberDecimal}`;

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="User"
            link="/admin/user"
            submitButton={false}
          />
        </div>
        <div className="action_btns">
          <Link to="/admin/hobbies-overview">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Hobbies
            </button>
          </Link>
          <Link to="/sim-overview">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Asset
            </button>
          </Link>
          <Link to="/admin/users-dashboard">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Dashboard
            </button>
          </Link>
          <Link to="/admin/reason">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Reason
            </button>
          </Link>
          <Link to="/admin/role-overview">
            <button type="button" className="btn btn-outline-primary btn-sm">
              User Roles
            </button>
          </Link>

          {contextData && contextData[3] && contextData[3].view_value === 1 && (
            <Link to="/admin/department-overview">
              <button type="button" className="btn btn-outline-primary btn-sm">
                Department
              </button>
            </Link>
          )}
          {contextData && contextData[3] && contextData[3].view_value === 1 && (
            <Link to="/admin/sub-department-overview">
              <button type="button" className="btn btn-outline-primary btn-sm">
                Sub Department
              </button>
            </Link>
          )}
          {contextData &&
            contextData[10] &&
            contextData[10].view_value === 1 && (
              <Link to="/admin/designation-overview">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  Designation
                </button>
              </Link>
            )}
          {contextData &&
            contextData[0] &&
            contextData[0].insert_value === 1 && (
              <Link to="/admin/user">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  Add New User
                </button>
              </Link>
            )}
        </div>
      </div>

      <div className="modal fade" id="mapModal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <h4 className="modal-title"></h4>
            </div>
            <div className="modal-body">
              <iframe
                width="600"
                height="450"
                frameBorder="0"
                style={{ border: "0" }}
                src={mapUrl}
                allowFullScreen
              ></iframe>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {isloading ? (
        <div className="loader">
          <div>
            <ul>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
            </ul>
          </div>
          <span>Loading</span>
        </div>
      ) : (
        <div className="page_height">
          <div className="card mb-4">
            <div className="card-body pb0 pb4">
              <div className="row thm_form">
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
                      if (selectedValue === "") {
                        getData();
                      }
                    }}
                    required
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">
                    Designation<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={[
                      { value: "", label: "All" },
                      ...designationData.map((option) => ({
                        value: option.desi_id,
                        label: option.desi_name,
                      })),
                    ]}
                    value={
                      designationFilter === ""
                        ? { value: "", label: "All" }
                        : {
                            value: designationFilter,
                            label:
                              designationData.find(
                                (option) => option.desi_id === designationFilter
                              )?.desi_name || "Select...",
                          }
                    }
                    onChange={(selectedOption) => {
                      const newValue = selectedOption
                        ? selectedOption.value
                        : "";
                      setDesignationFilter(newValue);
                      if (newValue === "") {
                        designationAPI();
                      }
                    }}
                    required
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">
                    Job Type<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    value={jobTypeOptions.find(
                      (option) => option.value === jobType
                    )}
                    onChange={(selectedOption) => {
                      setJobType(selectedOption.value);
                    }}
                    options={jobTypeOptions}
                  />
                </div>
                <div className="form-group col-3">
                  <FieldContainer
                    fieldGrid={12}
                    label="Search"
                    placeholder="Search Here"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="data_tbl" style={{ height: "64vh", width: "100%" }}>
              <DataGrid
                rows={filterdata.map((data, index) => ({ ...data, id: index }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableColumnMenu
                disableSelectionOnClick
                getRowId={(row) => row.id}
                slots={{
                  toolbar: GridToolbar,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal here  */}
      <div
        className="modal fade"
        id="exampleModal1"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div
            className="modal-content"
            style={{ height: "90vh", overflow: "scroll", width: "140%" }}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Transfer KRA
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
              <div>
                <div className="row">
                  <div className="form-group col-3">
                    <label className="form-label">
                      Transfer Kra <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      className=""
                      options={transferToUser.map((option) => ({
                        value: option.user_id,
                        label: `${option.user_name}`,
                      }))}
                      value={{
                        value: transferTo,
                        label:
                          transferToUser.find(
                            (user) => user.user_id === transferTo
                          )?.user_name || "",
                      }}
                      onChange={(e) => {
                        setTransferTo(e.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group col-9">
                    <label className="form-label">Reason</label>
                    <input
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      className="form-control"
                      type="text"
                    />
                  </div>
                </div>
                <DataTable
                  columns={[
                    {
                      name: (
                        <input
                          type="checkbox"
                          checked={
                            checkedData.length ===
                            transferResponsibilityData.length
                          }
                          onChange={handleAllCheckedData}
                        />
                      ),
                      cell: (row) => (
                        <input
                          type="checkbox"
                          checked={checkedData.includes(row)}
                          onChange={() => handleCheckedData(row)}
                        />
                      ),
                    },
                    {
                      name: "s.no",
                      cell: (row, index) => <div>{index + 1}</div>,
                    },
                    { name: "Name", selector: "user_name" },
                    { name: "Department", selector: "department_name" },
                    {
                      name: "Job Responsibility",
                      selector: "sjob_responsibility",
                    },
                  ]}
                  data={transferResponsibilityData}
                  highlightOnHover
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => handleTransferSubmit()}
                className="btn btn-primary"
              >
                Transfer
              </button>
            </div>
          </div>
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
                Separation
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
                label="Status"
                Tag="select"
                value={separationStatus}
                onChange={(e) => setSeparationStatus(e.target.value)}
              >
                <option value="" disabled>
                  Choose...
                </option>
                <option value="Resigned">Resigned</option>
                <option value="Resign Accepted">Resign Accepted</option>
                <option value="On Long Leave">On Long Leave</option>
                <option value="Subatical">Subatical</option>
                <option value="Suspended">Suspended</option>
              </FieldContainer>
              <FieldContainer
                label="Reason"
                Tag="select"
                value={separationReason}
                onChange={(e) => setSeparationReason(e.target.value)}
              >
                {separationReasonGet.map((option) => (
                  <option value={option.id} key={option.id}>
                    {" "}
                    {option.reason}
                  </option>
                ))}
              </FieldContainer>
              <FieldContainer
                label="Remark"
                value={separationRemark}
                onChange={(e) => setSeparationRemark(e.target.value)}
              />
              {(separationStatus === "On Long Leave" ||
                separationStatus === "Subatical" ||
                separationStatus === "Suspended") && (
                <FieldContainer
                  label="Reinstated Date"
                  type="date"
                  value={separationReinstateDate}
                  onChange={(e) => setSeparationReinstateDate(e.target.value)}
                />
              )}
              {separationStatus == "Resign Accepted" && (
                <input
                  label="Last Working Day"
                  className="form-control"
                  style={{ width: "220px" }}
                  type="date"
                  value={separationLWD}
                  max={today}
                  onChange={(e) => setSeparationLWD(e.target.value)}
                />
              )}
              {separationStatus == "Resigned" && (
                <FieldContainer
                  label="Resignation Date"
                  type="date"
                  value={separationResignationDate}
                  onChange={(e) => setSeparationResignationDate(e.target.value)}
                />
              )}
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
                onClick={() => handleSeparationDataPost()}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for user KRA */}
      <Modal
        appElement={document.getElementById("root")}
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            width: "80%",
            height: "85%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <>
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              KRA
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleCloseModal}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <DataTable
            columns={[
              {
                name: "s.no",
                cell: (row, index) => <div>{index + 1}</div>,
              },
              { name: "Name", selector: "user_name" },
              { name: "Department", selector: "department_name" },
              {
                name: "Job Responsibility",
                selector: "sjob_responsibility",
              },
            ]}
            data={KRIData}
            highlightOnHover
          />
        </>
      </Modal>
    </>
  );
};
export default UserOverview;
