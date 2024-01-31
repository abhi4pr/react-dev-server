import React, { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import { baseUrl } from "../../../utils/config";

const WFHDOverview = () => {
  const { ContextDept, RoleIDContext } = useAPIGlobalContext();
  const [allWFHDData, setAllWFHDData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    const response = await axios.get(
      baseUrl+"get_all_wfh_users"
    );
    if (RoleIDContext == 1 || RoleIDContext == 5) {
      setAllWFHDData(response.data.data);
    } else {
      setAllWFHDData(
        response.data.data?.filter((d) => d.dept_id == ContextDept)
      );
      setSavedData(response.data.data?.filter((d) => d.dept_id == ContextDept));
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
      cell: (row) => row.percentage_filled,
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
  ];

  return (
    <>
      <div>
        <FormContainer mainTitle="Payout Overivew" link={"/admin/"} />
        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Payout Users"
              columns={columns}
              data={allWFHDData}
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

export default WFHDOverview;
