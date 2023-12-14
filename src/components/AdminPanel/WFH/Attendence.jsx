import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
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
  const { toastAlert } = useGlobalContext();
  const [department, setDepartment] = useState("");
  // const [userName, setUserName] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);
  const [noOfAbsent, setNoOfAbsent] = useState(null);
  // const [bonus, setBonus] = useState("");
  const [remark, setRemark] = useState("");
  const [userData, getUsersData] = useState([]);
  const [attendenceData, setAttendenceData] = useState([]);

  const [userName, setUserName] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [completedYearsMonths, setCompletedYearsMonths] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [deptSalary, setDeptSalary] = useState([]);

  let isInEditMode = false;

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  var settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    swipeToSlide: true,
    variableWidth: true,
  };

  useEffect(() => {
    axios
      .get("http://34.93.221.166:3000/api/all_departments_of_wfh")
      .then((res) => {
        getDepartmentData(res.data.data);
      });

    axios
      .get("http://34.93.221.166:3000/api/get_month_year_data")
      .then((res) => {
        setCompletedYearsMonths(res.data.data);
      });
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
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
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

  // Get the current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNumber = new Date().getMonth() + 1;
  // Function to get the previous month
  const getCurrentMonth = () => {
    const previousMonthIndex = currentDate.getMonth();
    return previousMonthIndex >= 0 ? months[previousMonthIndex] : months[11];
  };

  // Set the initial state for selectedMonth and selectedYear using the current date
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [activeusers, setActiveUsers] = useState("");

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  useEffect(() => {
    axios
      .post("http://34.93.221.166:3000/api/get_distinct_depts", {
        month: selectedMonth,
        year: selectedYear,
      })
      .then((res) => setDeptSalary(res.data));
  }, [selectedMonth, selectedYear, department]);

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
      .post("http://34.93.221.166:3000/api/get_salary_by_id_month_year", payload)
      .then((res) => {
        setAttendenceData(res.data.data);
        setFilterData(res.data.data);
      })
      .catch(() => {
        department &&
          selectedMonth &&
          selectedYear &&
          toastAlert("Failed to submit data");
      });
  };

  useEffect(() => {
    if (department || selectedMonth || selectedYear !== "") {
      getAttendanceData();
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
    const updatedRow = { ...newRow, isNew: false };
    axios
      .post("http://34.93.221.166:3000/api/add_attendance", {
        dept: updatedRow.dept,
        user_id: updatedRow.user_id,
        noOfabsent: updatedRow.noOfabsent,
        salary_deduction: Number(updatedRow.salary_deduction),
        month: selectedMonth,
        year: selectedYear,
        bonus: updatedRow.bonus,
        remark: remark,
        created_by: userID,
      })
      .then(() => getAttendanceData());
    return updatedRow;
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
      width: 150,
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
            // color="primary"
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

      {/* <FormContainer
        mainTitle="Attendance"
        title="Attendance"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-4">
          <label className="form-label">
            Department Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={departmentdata.map((option) => ({
              value: option.dept_id,
              label: `${option.dept_name}`,
            }))}
            value={{
              value: department,
              label:
                departmentdata.find((user) => user.dept_id === department)
                  ?.dept_name || "",
            }}
            onChange={(e) => {
              setDepartment(e.value);
            }}
            required
          />
          <span style={{ color: "green" }}>Active : {activeusers.length}</span>
        </div>

        <div className="form-group col-4">
          <label className="form-label">Month</label>
          <Select
            options={months.map((month) => ({
              value: month,
              label: month,
            }))}
            value={{
              value: selectedMonth,
              label: selectedMonth,
            }}
            onChange={(e) => setSelectedMonth(e.value)}
            required
          />
        </div>

        <div className="form-group col-4">
          <label className="form-label">Year</label>
          <Select
            options={years.map((year) => ({
              value: year,
              label: `${year}`,
            }))}
            value={{
              value: selectedYear,
              label: selectedYear,
            }}
            onChange={(e) => setSelectedYear(e.value)}
            required
          />
        </div>

        <div className="col-12 ">
          <hr />
        </div>

        <div className="form-group col-3">
          <label className="form-label">Employee Name</label>
          <Select
            options={userData?.map((option) => ({
              value: option.user_id,
              label: `${option.user_name}`,
            }))}
            value={{
              value: userName,
              label:
                userData?.find((user) => user.user_id == userName)?.user_name ||
                "",
            }}
            onChange={(e) => setUserName(e.value)}
            required
          />
        </div>

        <FieldContainer
          label="Number of Absent"
          fieldGrid={3}
          type="number"
          value={noOfAbsent}
          onChange={(e) => setNoOfAbsent(Number(e.target.value))}
        />
        <FieldContainer
          label="Bonus (₹)"
          fieldGrid={3}
          type="number"
          value={bonus}
          required={false}
          onChange={(e) => setBonus(e.target.value)}
        />
        <FieldContainer
          required={false}
          label="Remark"
          fieldGrid={3}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer> */}

      <div className="card mb24">
        <div className="card-header">
          <h4>Department</h4>
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
                  ? "btn-success"
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
              getRowId={(row) => row.attendence_id}
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
