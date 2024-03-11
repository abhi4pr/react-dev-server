import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";

const PageOverview = () => {

  const [vendorTypes, setVendorTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([])

  const getData = () => {
    axios.get(baseUrl+"getPageMastList")
      .then((res) => {
        setVendorTypes(res.data.data);
        setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  },[])

  useEffect(() => {
    const result = vendorTypes?.filter((d) => {
      return d.page_user_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Page user Name",
      selector: (row) => row.page_user_name,
    },
    {
      name: "Page level",
      selector: (row) => row.page_level,
    },
    {
      name: "Page status",
      selector: (row) => row.page_status
    },
    {
      name: "Ownership type",
      selector: (row) => row.ownership_type
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/pms-page-edit/${row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          <DeleteButton
            endpoint="deletePageMast"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Link to={`/admin/pms-page-master`}>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{marginBottom:'10px'}}
        >
        Add Page
        </button>
      </Link>
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Page Overview"
            columns={columns}
            data={filterData}
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

    </>
  );
};

export default PageOverview;