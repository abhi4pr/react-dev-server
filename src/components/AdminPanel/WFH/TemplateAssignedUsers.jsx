import React, { useState } from "react";
import DataTable from "react-data-table-component";

const TemplateAssignedUsers = ({ usersData }) => {
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Employee Name",
      cell: (row) => row.user_name,
      width: "150px",
    },
    {
      name: "Department",
      cell: (row) => row.department_name,
    },
    {
      name: "Designation",
      cell: (row) => row.designation_name,
    },
    {
      name: "Designation",
      cell: (row) => row.designation_name,
    },
    {
      name: "Salary",
      cell: (row) => row.salary,
    },
    {
      name: "CTC",
      cell: (row) => row.ctc,
    },
    {
      name: "Report(L1)",
      cell: (row) => row.Report_L1N,
    },
    {
      name: "Personal Contact",
      cell: (row) => row.PersonalNumber,
    },
  ];
  return (
    <>
      Selected Template Users
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Template Assiged Users"
            columns={columns}
            data={usersData}
            fixedHeader
            fixedHeaderScrollHeight="62vh"
            highlightOnHover
            subHeader
          />
        </div>
      </div>
    </>
  );
};

export default TemplateAssignedUsers;
