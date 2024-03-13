import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import FormContainer from "../AdminPanel/FormContainer";
import { baseUrl } from "../../utils/config";
import DateISOtoNormal from "../../utils/DateISOtoNormal";

const RepairRetrunSummary = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);

  async function getData() {
    try {
      const response = await axios.get(baseUrl + "get_summary_of_asset_return");
      setData(response.data.data);
      setFilterData(response.data.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  const columns = [
    {
      name: "S.No",
      // selector: (row) => row.Role_id,
      cell: (row, index) => <div>{index + 1}</div>,
      width: "10%",
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.assetName,

      sortable: true,
    },

    {
      name: "Asset Return By",
      selector: (row) => row.asset_return_by_name,
    },
    {
      name: "Retun Date",
      selector: (row) => DateISOtoNormal(row.return_asset_data_time),
    },
    {
      name: "Return Remark",
      selector: (row) => row.asset_return_remark,
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.Role_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  return (
    <>
      {/* <FormContainer mainTitle="Repair & Return" link="" submitButton={false}> */}
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Repair & Return Summary"
            columns={columns}
            data={filterdata}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="62vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>
      {/* </FormContainer> */}
    </>
  );
};

export default RepairRetrunSummary;
