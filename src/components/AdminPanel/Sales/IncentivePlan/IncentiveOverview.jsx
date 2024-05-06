import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import DeleteButton from "../../DeleteButton";
import FormContainer from "../../FormContainer";
import DynamicExcelDownload from "../DynamicExcelDownload";
import DynamicPDFDownload from "../DynamicPDFDownload";

const IncentiveOverview = () => {
  const [incentiveData, setIncentiveData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");
  const getData = async () => {
    try {
      const response = await axios.get(
        baseUrl + "sales/getlist_incentive_plan"
      );
      const data = response.data.data;
      console.log(data, "hello world");
      setIncentiveData(data);
      setOriginalData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = originalData.filter((d) => {
      return d.service_name?.toLowerCase().includes(search.toLowerCase());
    });
    setIncentiveData(result);
  }, [search]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Service Name",
      selector: (row) => row.Sales_Service_Master.service_name,
    },
    {
      name: "Service Name",
      selector: (row) => row.incentive_type,
    },
    {
      name: "Value",
      selector: (row) => row.value,
    },
    {
      name: "Action",

      cell: (row) => (
        <>
          <div class="btn-group">
            <button
              type="button"
              class=" icon-1 "
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fa-solid fa-ellipsis"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to={`/admin/sales-incentive-update/${row._id}`}>
                <div className="icon-1">
                  <i className="fa fa-edit"></i>
                </div>
              </Link>

              <DeleteButton
                endpoint="sales/delete_incentive_plan"
                id={row._id}
                getData={getData}
              />
            </div>
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Incentive Plan"
            link="/admin/sales-incentive-create"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <button
              className="btn btn-danger mt-2"
              onClick={() => {
                const selectedData = originalData.map((row, index) => ({
                  "S.No": index + 1,
                  "Service Name": row.Sales_Service_Master.service_name,
                  "Incentive Type": row.incentive_type,
                  Value: row.value,
                }));
                const fileName = "Incentive-exlce.xlsx";
                DynamicExcelDownload(selectedData, fileName);
              }}
            >
              Excel Download
            </button>

            <button
              className="btn btn-success mt-2"
              onClick={() => DynamicPDFDownload(originalData)}
            >
              PDF Download
            </button>

            {/* <DynamicExcelDownload incentiveData={incentiveData} /> */}
            <DataTable
              title="Incentive Overview"
              columns={columns}
              data={incentiveData}
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

export default IncentiveOverview;
