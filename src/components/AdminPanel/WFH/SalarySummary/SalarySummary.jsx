import React, { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../../FormContainer";
import DataTable from "react-data-table-component";
import Select from "react-select";
import Modal from "react-modal";
import { baseUrl } from "../../../../utils/config";
import DynamicSelect from "../../Sales/DynamicSelectManualy";

const SalarySummary = () => {
  const [allSalaryData, setAllSalaryData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [search, setSearch] = useState("");

  const [userCount, setUserCount] = useState([]);
  const [handleOpenUser, setHandleOpenUser] = useState(false);
  const [month, setMonth] = useState("");
  const MonthData = [
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

  const handleOpenSubCat = () => {
    setHandleOpenUser(true);
  };
  const handleCloseSubCat = () => {
    setHandleOpenUser(false);
  };

  const [departmentData, setDepartmentData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState([]);
  const departmentAPI = () => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      setDepartmentData(res.data);
      getData();
    });
  };

  useEffect(() => {
    const result = savedData.filter((d) => {
      const deptMatch = !departmentFilter || d.dept_id === departmentFilter;
      const monthMatch = !month || d.month === month;
      return deptMatch || monthMatch;
    });
    setAllSalaryData(result);
  }, [departmentFilter, month]);

  useEffect(() => {
    departmentAPI();
  }, []);

  const handleUserModal = async (row) => {
    try {
      const response = await axios.post(
        `${baseUrl}` + `get_users_count_by_dept`,
        {
          dept_id: row.dept_id,
          month: row.month,
          year: row.year,
        }
      );
      setUserCount(response.data.data);
      handleOpenSubCat();
    } catch (error) {
      console.log(error, "sub cat api not working");
    }
  };

  const getData = async () => {
    const response = await axios.get(baseUrl + "get_salary_calculation_data");
    setAllSalaryData(response.data.data);
    setSavedData(response.data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();
    const searchYear = parseInt(search, 10); // Convert search string to a number for year comparison

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
      const matchesMonth = d.month?.toLowerCase().includes(lowerCaseSearch);
      const matchesYear = d.year === searchYear;

      return (
        matchesUserName ||
        matchesDeptName ||
        matchesDesiName ||
        matchesMonth ||
        (!isNaN(searchYear) && matchesYear)
      );
    });

    setAllSalaryData(result);
  }, [search, savedData]); // Dependencies

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Department Name",
      cell: (row) => row.dept_name,
    },
    {
      name: "Month",
      cell: (row) => row.month,
    },
    {
      name: "User Count",
      cell: (row) => (
        <button
          style={{ width: "60px" }}
          className="btn btn-outline-warning"
          onClick={() => handleUserModal(row)}
        >
          {row.totalUsers}
        </button>
      ),
      sortable: true,
    },

    {
      name: "Total Salary",
      cell: (row) => row.totalSalary + " ₹",
    },

    {
      name: "Pending Amount",
      cell: (row) => row.pendingAmount + " ₹",
    },
  ];

  const SubCatColumns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "10%",
    },
    {
      name: "User Name",
      width: "50%",
      selector: (row) => row.user_name,
    },
  ];

  return (
    <>
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
              const selectedValue = selectedOption ? selectedOption.value : "";
              setDepartmentFilter(selectedValue);
              if (selectedValue === "") {
                getData();
              }
            }}
            required
          />
        </div>
        <DynamicSelect
          lable="Month"
          astric={true}
          data={MonthData}
          value={month}
          cols={3}
          onChange={(e) => setMonth(e.value)}
        />
      </div>

      <div className="master-card-css">
        <FormContainer mainTitle="Salary Summary" link={"/admin/"} />
        <div className="card">
          <div className="card-header sb">
            <h5>Total Salary Summary</h5>
            <input
              type="text"
              placeholder="Search Here"
              className="w-50 form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="data_tbl table-responsive card-body body-padding">
            <DataTable
              columns={columns}
              data={allSalaryData}
              // fixedHeader
              // fixedHeaderScrollHeight="64vh"
              highlightOnHover
              pagination
            />
          </div>
        </div>
        <Modal
          isOpen={handleOpenUser}
          onRequestClose={handleCloseSubCat}
          contentLabel="Example Modal"
          appElement={document.getElementById("root")}
          style={{
            content: {
              width: "60%",
              height: "50%",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <button
            className="btn btn-success mb-3 float-right"
            onClick={handleCloseSubCat}
          >
            x
          </button>
          <DataTable
            columns={SubCatColumns}
            data={userCount}
            highlightOnHover
            pagination
          />
        </Modal>
      </div>
    </>
  );
};

export default SalarySummary;
