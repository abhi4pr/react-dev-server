import axios from "axios";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import DataTable from "react-data-table-component";
import {baseUrl} from '../../../../utils/config'

const DisputeOverview = () => {
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
      width: "12%",
    },
    {
      name: "Department",
      cell: (row) => row.dept_name,
    },

    {
      name: "Work Days",
      width: "8%",
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
      cell: (row) => row.attendence_status_flow,
    },
    {
      name: "Disputed Date",
      cell: (row) => row.disputed_date,
    },
    {
      name: "Reason",
      cell: (row) => row.disputed_reason,
    },
  ];

  const getData = async () => {
    try {
      const response = await axios.get(
        baseUrl+"get_all_disputes"
      );
      const responseFinal = response.data;
      setData(responseFinal);
      setFilterData(responseFinal);
      toastAlert("Data Fetched Successfully");
    } catch (error) {
      toastError("Error getting data");
    }
  };

  useState(() => {
    getData();
  }, []);

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
