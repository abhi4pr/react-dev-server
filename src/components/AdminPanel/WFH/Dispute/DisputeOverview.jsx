import axios from "axios";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import DataTable from "react-data-table-component";
import { baseUrl } from "../../../../utils/config";
import { useLocation } from "react-router-dom";
import getDecodedToken from "../../../../utils/DecodedToken";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";

const d = new Date();
const currentDate = DateISOtoNormal(d.toISOString());

const DisputeOverview = () => {
  const location = useLocation();
  const { id } = location.state || "";
  const token = getDecodedToken();
  const loginUserRole = token.role_id;
  const loginUserDept = token.dept_id;
  const { toastAlert, toastError } = useGlobalContext();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Employee Name",
      cell: (row) => row.user_name,
    },
    {
      name: "Department",
      cell: (row) => row.dept_name,
    },

    {
      name: "Work Days",
      cell: () => 30,
    },
    {
      name: "Month",
      cell: (row) => row.month,
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
            // Assuming row.bonus is a numeric value
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
            // Assuming row.bonus is a numeric value
            return total + Number(rows.bonus);
          }, 0);
          return <div>{totalBonus + " ₹"}</div>;
        },
      },
    },
    {
      name: "Net Salary",
      cell: (row) => row.net_salary + " ₹",
    },
    {
      name: "TDS",
      cell: (row) => row.tds_deduction + " ₹",
      width: "7%",
    },
    {
      name: "To Pay",
      cell: (row) => row.toPay + " ₹",
    },
    {
      name: "Status",
      cell: (row) => row.dispute_status,
    },
    {
      name: "Disputed Date",
      cell: (row) => row.dispute_date,
    },
    {
      name: "Reason",
      cell: (row) => row.dispute_reason,
    },
    (!id || loginUserRole == 2) && {
      name: "Actions",
      cell: (row) => (
        <>
          {row.dispute_status == "Disputed" && (
            <>
              <button
                className="btn btn-primary"
                onClick={(e) => handleResolveReject(row, e, "Dispute Resolved")}
              >
                Resolve
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) => handleResolveReject(row, e, "Dispute Rejected")}
              >
                Reject
              </button>
            </>
          )}
        </>
      ),
    },
  ];

  const getData = async () => {
    try {
      const url = `${baseUrl}get_all_disputes${id ? "/" + id : ""}`;

      const response = await axios.get(url);
      let data = response.data;

      if (id && loginUserRole == 2) {
        data = data.filter((item) => item.dept === loginUserDept);
      }

      console.log("data", data);
      setData(data);
      setFilterData(data);
      toastAlert("Data Fetched Successfully");
    } catch (error) {
      toastError("Error getting data");
    }
  };

  useState(() => {
    getData();
  }, []);

  async function handleResolveReject(row, e, status) {
    e.preventDefault();
    await axios.put(`${baseUrl}` + `update_attendance`, {
      attendence_id: row.attendence_id,
      month: row.month,
      year: row.year,
      attendence_status_flow: "Invoice Submit Pending For Verifcation",
    });
    await axios.put(`${baseUrl}update_attendance_dispute`, {
      user_id: row.user_id,
      attendence_id: row.attendence_id,
      dispute_status: status,
      dispute_reason: row.dispute_reason,
      dispute_date: currentDate,
    });
    getData();
    toastAlert("Successful");
  }

  useEffect(() => {
    const result = data?.filter((d) => {
      return (
        d.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.month?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  return (
    <>
      <FormContainer
        mainTitle="Dispute"
        title="Dispute Overview"
        // handleSubmit={handleSubmit}
        submitButton={false}
      >
        <div className="page_height">
          <div className="card mb-4">
            <div className="data_tbl table-responsive">
              <DataTable
                title="Disputed Status Employees"
                columns={columns}
                data={filterData}
                fixedHeader
                // pagination
                fixedHeaderScrollHeight="64vh"
                highlightOnHover
                subHeader
                subHeaderComponent={
                  <input
                    type="text"
                    placeholder="Search here"
                    className="w-50 form-control "
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                }
              />
            </div>
          </div>
        </div>
      </FormContainer>
    </>
  );
};

export default DisputeOverview;
