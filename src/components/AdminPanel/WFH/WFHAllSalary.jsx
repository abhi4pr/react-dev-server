import React, { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";

const WFHAllSalary = () => {
  const [allSalaryData, setAllSalaryData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    const response = await axios.get(
      "http://192.168.29.115:3000/api/get_all_attendance_data"
    );
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
      name: "Employee Name",
      selector: (row) => row.user_name,
    },
    {
      name: "Department",
      cell: (row) => row.dept_name,
    },
    {
      name: "Designation",
      cell: (row) => row.designation_name,
    },
    {
      name: "DOJ",
      cell: (row) => {
        const date = new Date(row.joining_date);
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yy = String(date.getFullYear()).slice(2);
        return `${dd}/${mm}/${yy}`;
      },
    },
    {
      name: "Work Days",
      cell: () => 30,
    },
    {
      name: "Month",
      cell: (row) => row.month,
    },
    { name: "Year", cell: (row) => row.year },
    {
      name: "Salary",
      cell: (row) => row.salary,
    },
    {
      name: "Absent Days",
      cell: (row) => row.noOfabsent,
    },
    {
      name: "Present Days",
      cell: (row) => 30 - Number(row.noOfabsent),
    },

    {
      name: "Total Salary",
      cell: (row) => row.total_salary + " ₹",
      footer: {
        cell: (row) =>
          row.reduce((total, rows) => {
            return total + Number(rows.total_salary);
          }, 0),
      },
    },
    {
      name: "Bonus",
      cell: (row) => row.bonus + " ₹",
      footer: {
        cell: (row) => {
          const totalBonus = row.reduce((total, rows) => {
            return total + Number(rows.bonus);
          }, 0);
          return <div>{totalBonus + " ₹"}</div>;
        },
      },
    },
    {
      name: "Deductions",
      cell: (row) => row.salary_deduction + " ₹",
    },
    {
      name: "Net Salary",
      cell: (row) => row.net_salary + " ₹",
    },
    {
      name: "TDS",
      cell: (row) => row.tds_deduction + " ₹",
    },
    {
      name: "To Pay",
      cell: (row) => row.toPay + " ₹",
    },
  ];

  return (
    <>
      <div>
        <FormContainer mainTitle="All Salary" link={"/admin/"} />
        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="All Salary Overview"
              columns={columns}
              data={allSalaryData}
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
      </div>
    </>
  );
};

export default WFHAllSalary;
