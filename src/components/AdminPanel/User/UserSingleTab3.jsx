import React from "react";
import DataTable from "react-data-table-component";

const UserSingleTab3 = ({ KRIData }) => {
  return (
    <>
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
  );
};

export default UserSingleTab3;
