import axios from "axios";
import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";

const HistoryAssignData = () => {
  const [historyData, setHistoryData] = useState([]);
  const [search, setSearch] = useState(""); 

  const getHistory = async () => {
    const res = await axios.get(
      `http://192.168.1.33:8080/api/get_list_page_assignment_history`
    );
    setHistoryData(res?.data?.data);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const filteredData = historyData.filter(
    (row) =>
      row.page_id_name.toLowerCase().includes(search.toLowerCase()) ||
      row.assignment_to_name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Page Name",
      selector: (row) => row.page_id_name,
    },
    {
      name: "User Name",
      selector: (row) => row.assignment_to_name,
    },
  ];

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Page Assignment"
            link="/"
            buttonAccess={false}
            submitButton={false}
          />
        </div>
      </div>

      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Assignment Overview"
              columns={columns}
              data={filteredData}
              fixedHeader
              pagination
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
    </>
  );
};

export default HistoryAssignData;
