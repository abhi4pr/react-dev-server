import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import jwtDecode from "jwt-decode";
import Slider from "react-slick";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  GridRowModes,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearIcon from "@mui/icons-material/Clear";

const Attendence = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const { ContextDept, RoleIDContext } = useAPIGlobalContext();
  const [department, setDepartment] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);
  const [noOfAbsent, setNoOfAbsent] = useState(null);
  const [remark, setRemark] = useState("");
  const [userData, getUsersData] = useState([]);
  const [attendenceData, setAttendenceData] = useState([]);

  const [userName, setUserName] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [completedYearsMonths, setCompletedYearsMonths] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [deptSalary, setDeptSalary] = useState([]);

  const [rowUpdateError, setRowUpdateError] = useState(null);

  let isInEditMode = false;

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  var settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    sliderToScroll: 1,
    // slidesToShow: 1,
    initialSlide: 9,
    swipeToSlide: true,
    variableWidth: true,
  };

  if (new Date().getMonth() > 3) {
    settings.initialSlide = new Date().getMonth - 4;
  } else {
    settings.initialSlide = new Date().getMonth() + 8;
  }

  function gettingSliderData() {
    axios
      .get("http://34.93.221.166:3000/api/get_month_year_data")
      .then((res) => {
        setCompletedYearsMonths(res.data.data);
      });
  }

  useEffect(() => {
    axios
      .get("http://34.93.221.166:3000/api/all_departments_of_wfh")
      .then((res) => {
        if (RoleIDContext == 1 || RoleIDContext == 5) {
          getDepartmentData(res.data.data);
        } else {
          getDepartmentData(
            res.data.data?.filter((d) => d.dept_id == ContextDept)
          );
        }
      });

    gettingSliderData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://34.93.221.166:3000/api/get_all_wfh_users"
        );
        const data = res.data.data;
        const filteredUser = data.filter((d) => d.dept_id === department);
        if (filteredUser?.length > 0) {
          const firstUser = filteredUser[0];
          setUserName(firstUser);
        } else {
          console.log("No users found for the selected department.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [department]);

  const years = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    const row = rowModesModel[id];
    if (row.noOfabsent > 30) {
      setRowUpdateError({
        id,
        error: "Absent days cannot be greater than 30.",
      });
      return;
    }

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setRowUpdateError(null);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleAttendence = () => {
    axios
      .post("http://34.93.221.166:3000/api/add_attendance", {
        dept: department,
        user_id: userName.user_id,
        noOfabsent: 0,
        month: selectedMonth,
        year: selectedYear,
      })
      .then(() => {
        setNoOfAbsent("");
        toastAlert("Submitted success");
      })
      .then(() => {
        getAttendanceData();
        toastAlert("Submitted success");
      });
  };

  function handleAllDepartmentAttendance() {
    axios
      .post("http://34.93.221.166:3000/api/save_all_depts_attendance", {
        month: selectedMonth,
        year: selectedYear,
      })
      .then(() => {
        toastAlert("Submitted");
        gettingSliderData();
        getAttendanceData();
        gettingDepartmentSalaryExists();
      });
  }

  // Get the current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNumber = new Date().getMonth() + 1;
  // Function to get the previous month
  const getCurrentMonth = () => {
    const previousMonthIndex = currentDate.getMonth();
    return previousMonthIndex >= 0 ? months[previousMonthIndex] : months[11];
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [activeusers, setActiveUsers] = useState("");

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  function gettingDepartmentSalaryExists() {
    axios
      .post("http://34.93.221.166:3000/api/get_distinct_depts", {
        month: selectedMonth,
        year: selectedYear,
      })
      .then((res) => setDeptSalary(res.data));
  }

  const handleCardSelect = (index, data) => {
    setSelectedCardIndex(index);
    setSelectedYear(data.year);
    setSelectedMonth(data.month);
  };

  useEffect(() => {
    axios.get("http://34.93.221.166:3000/api/get_all_wfh_users").then((res) => {
      const data = res.data.data;
      const filteredUser = data.filter(
        (d) => d.dept_id === department && d.user_status
      );
      setActiveUsers(filteredUser);
    });
  }, [department]);

  const getAttendanceData = () => {
    const payload = {
      dept_id: department,
      month: selectedMonth,
      year: selectedYear,
    };
    axios
      .post(
        "http://34.93.221.166:3000/api/get_salary_by_id_month_year",
        payload
      )
      .then((res) => {
        setAttendenceData(res.data.data);
        setFilterData(res.data.data);
      })
      .catch(() => {
        setFilterData([]);
        department &&
          selectedMonth &&
          selectedYear &&
          toastError("Not Data Exist");
      });
  };

  useEffect(() => {
    if (department || selectedMonth || selectedYear !== "") {
      getAttendanceData();
      gettingDepartmentSalaryExists();
    }
  }, [department, selectedMonth, selectedYear]);

  useEffect(() => {
    if (department) {
      axios
        .get(`http://34.93.221.166:3000/api/get_wfh_user/${department}`)
        .then((res) => {
          getUsersData(res.data);
        });
    }
  }, [department]);

  const handleCreateSalary = (e) => {
    e.preventDefault();
    axios
      .put("http://34.93.221.166:3000/api/update_attendence_status", {
        month: selectedMonth,
        year: Number(selectedYear),
        dept: department,
      })
      .then(() => toastAlert("Attendance Completed"));
  };

  const processRowUpdate = (newRow) => {
    if (newRow.noOfabsent > 30) {
      toastError("Absent days cannot be greater than 30.");
      return null;
    } else {
      const updatedRow = { ...newRow, isNew: false };
      // console.log(updatedRow, "update row");
      axios
        .post("http://34.93.221.166:3000/api/add_attendance", {
          attendence_id: updatedRow.attendence_id,
          dept: updatedRow.dept,
          user_id: updatedRow.user_id,
          noOfabsent: updatedRow.noOfabsent,
          salary_deduction: Number(updatedRow.salary_deduction),
          month: selectedMonth,
          year: selectedYear,
          bonus: Number(updatedRow.bonus),
          remark: remark,
          created_by: userID,
        })
        .then(() => getAttendanceData());
      return updatedRow;
    }
  };

  const columns = [
    {
      field: "S.NO",
      headernewname: "ID",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = filterData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "user_name",
      headerName: "Employee Name",
      width: 200,
      type: "text",
    },
    {
      field: "dept_name",
      headerName: "Department",
      type: "text",
    },
    {
      field: "designation_name",
      headerName: "Designation",
      type: "text",
    },
    {
      field: "Report_L1Name",
      headerName: "Report to L1",
      type: "text",
    },
    {
      field: "Report_L2Name",
      headerName: "Report to L2",
      type: "text",
    },
    {
      field: "joining_date",
      headerName: "Joining Date",
      width: 150,
      type: "text",
      renderCell: (params) => {
        const oldDate = params.row.joining_date.split("T");
        const arr = oldDate[0].toString().split("-");
        const newDate = arr[2] + "-" + arr[1] + "-" + arr[0];
        return <div>{newDate}</div>;
      },
    },
    {
      field: "month",
      headerName: "Month",
      type: "text",
    },
    {
      field: "workdays",
      headerName: "Work Days",
      type: "number",
      valueGetter: () => 30,
    },
    {
      field: "noOfabsent",
      headerName: "Absent Days",
      type: "number",
      editable: true,
    },
    {
      field: "present",
      headerName: "Present Days ",
      type: "number",
      valueGetter: (params) => 30 - Number(params.row.noOfabsent),
    },
    {
      field: "total_salary",
      headerName: "Total Salary",
      width: 150,
      type: "text",
    },
    {
      field: "bonus",
      headerName: "Bonus",
      type: "Number",
      editable: true,
    },
    {
      field: "salary_deduction",
      headerName: "Deduction",
      type: "Number",
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<ClearIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<SaveAsIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  return (
    <>
      {/* Cards */}
      <div className="timeline_wrapper mb24">
        <Slider {...settings} className="timeline_slider">
          {completedYearsMonths.map((data, index) => (
            <div
              className={`timeline_slideItem ${
                data.atdGenerated && "completed"
              } ${selectedCardIndex === index ? "selected" : ""} ${
                currentMonth == data.month && "current"
              }`}
              onClick={() => handleCardSelect(index, data)}
              key={index}
            >
              <h2>
                {data.month} <span>{data.year}</span>
              </h2>
              <h3>
                {data?.atdGenerated == 1 ? (
                  <span>
                    <i className="bi bi-check2-circle" />
                  </span>
                ) : currentMonthNumber - 4 - index < 0 ? (
                  <span>
                    <i className="bi bi-clock-history" />
                  </span>
                ) : (
                  <span>
                    <i className="bi bi-hourglass-top" />
                  </span>
                )}
                {data.atdGenerated == 1
                  ? "Completed"
                  : currentMonthNumber - 4 - index < 0
                  ? "Upcoming"
                  : "Pending"}
              </h3>
            </div>
          ))}
        </Slider>
      </div>

      <div className="card mb24">
        <div className="card-header d-flex justify-content-between">
          <h4>Department</h4>
          <span>
            {deptSalary?.length !== departmentdata?.length &&
              (RoleIDContext == 1 || RoleIDContext == 5) && (
                <button
                  className="btn btn-primary"
                  onClick={handleAllDepartmentAttendance}
                >
                  Create All Department Attendance
                </button>
              )}
          </span>
        </div>
        <div className="card-body">
          <div className="d-flex gap4 h_scroller mb24">
            {departmentdata.map((option) => {
              const isDeptInSalary =
                Array.isArray(deptSalary) &&
                deptSalary.some((d) => d.dept === option.dept_id);

              const className = `btn ${
                department === option.dept_id
                  ? "btn-primary"
                  : isDeptInSalary
                  ? "btn-outline-primary"
                  : "btn-outline-primary"
              }`;

              return (
                <button
                  className={className}
                  onClick={() => setDepartment(option.dept_id)}
                >
                  {option.dept_name}
                </button>
              );
            })}
          </div>

          <h6>
            <span style={{ color: "green" }}>
              Active : {activeusers.length}
            </span>
          </h6>
        </div>
      </div>

      {filterData?.length !== 0 && (
        <button
          className="btn btn-primary"
          onClick={(e) => handleCreateSalary(e)}
        >
          Complete Attendance
        </button>
      )}

      <div className="form-group col-3">
        {filterData?.length == 0 &&
          department &&
          selectedMonth &&
          selectedYear && (
            <button onClick={handleAttendence} className="btn btn-warning">
              No Absents, Create Attendance
            </button>
          )}
      </div>

      <div className="card">
        <div className="data_tbl table-responsive footer_none">
          {filterData.length > 0 && (
            <DataGrid
              rows={filterData}
              getRowId={(row) => row._id}
              columns={columns}
              slots={{
                toolbar: GridToolbar,
              }}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Attendence;
