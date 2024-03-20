import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const PageOverview = () => {
  const [vendorTypes, setVendorTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const getData = () => {
    axios.get(baseUrl + "getPageMastList").then((res) => {
      setVendorTypes(res.data.data);
      setFilterData(res.data.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

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
      selector: (row) => row.page_status,
    },
    {
      name: "Ownership type",
      selector: (row) => row.ownership_type,
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

  const dataGridcolumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => <div>{filterData.indexOf(params.row) + 1}</div>,

      width: 130,
    },
    { field: "page_user_name", headerName: "Page user Name", width: 200 },
    { field: "page_level", headerName: "Page level", width: 200 },
    { field: "page_status", headerName: "Page status", width: 200 },
    { field: "ownership_type", headerName: "Ownership type", width: 200 },
    {
      field:"link", header:"Link", width:200, renderCell: (params) => (
        <Link to={params.row.link} target="_blank" className="text-primary">
          {/* <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
          > */}
           {params.row.link}
          {/* </button> */}
        </Link>
      )
    },
    {
      field: "Action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <div className="d-flex align-center ">
          <Link className="mt-2" to={`/admin/pms-page-edit/${params.row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          <DeleteButton
            endpoint="deletePageMast"
            id={params.row._id}
            getData={getData}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Link to={`/admin/pms-page-master`}>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{ marginBottom: "10px" }}
        >
          Add Page
        </button>
      </Link>
      <div className="card">
        <div className="data_tbl table-responsive">
          {/* <DataTable
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
          /> */}

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Page</h5>
              <div className="card-text">
                <div className="row">
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-profile-type"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Profile Type
                    </Link>
                  </div>
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-page-category"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Page Category
                    </Link>
                  </div>
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-page-category"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Page Ownership
                    </Link>
                  </div>{" "}
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-platform"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Platform
                    </Link>
                  </div>
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-platform-price-type"
                      className="btn btn-primary btn-sm mt-2"
                      id="pageName"
                    >
                      Platform Price
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DataGrid
            title="Page Overview"
            rows={filterData}
            columns={dataGridcolumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            getRowId={(row) => row._id}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PageOverview;
