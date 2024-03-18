import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const VendorOverview = () => {
  const [vendorTypes, setVendorTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const getData = () => {
    axios.get(baseUrl + "vendorAllData").then((res) => {
      setVendorTypes(res.data.tmsVendorkMastList);
      setFilterData(res.data.tmsVendorkMastList);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = vendorTypes?.filter((d) => {
      return d.vendorMast_name.toLowerCase().match(search.toLowerCase());
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
      name: "Vendor Name",
      selector: (row) => row.vendorMast_name,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Home City",
      selector: (row) => row.home_city,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/pms-vendor-edit/${row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          <DeleteButton
            endpoint="deleteVendorMast"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const dataGridcolumns = [
    {
      field: "sno",
      headerName: "S.NO",
      width: 200,
      renderCell: (params) => <div>{filterData.indexOf(params.row) + 1}</div>,
    },
    {
      field: "vendorMast_name",
      headerName: "Vendor Name",
      width: 200,
      editable: true,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 200,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
    },
    {
      field: "home_city",
      headerName: "Home City",
      width: 200,
      editable: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <Link to={`/admin/pms-vendor-edit/${params.row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          <DeleteButton
            endpoint="deleteVendorMast"
            id={params.row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <div className="d-flex ">
        <Link to={`/admin/pms-vendor-master`} className="me-3">
          <button
            title="Add"
            className="btn btn-outline-primary"
            style={{ marginBottom: "10px" }}
          >
            Add Vendor
          </button>
        </Link>

        <Link to={`/admin/pms-vendor-page-price-overview`}>
          <button
            title="Add"
            className="btn btn-outline-primary"
            style={{ marginBottom: "10px" }}
          >
            Vendor Page Price Overview
          </button>
        </Link>
      </div>
      <div className="card">
        <div className="data_tbl table-responsive">
          {/* <DataTable
            title="Vendor Overview"
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
              <h5 className="card-title">Vendor Type</h5>
              <div className="card-text">
                <div className="row">
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-vendor-type"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Vendor Type
                    </Link>
                  </div>{" "}
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-pay-method"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Payment Mehtod
                    </Link>
                  </div>
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-pay-cycle"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Payment Cycle
                    </Link>
                  </div>
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-group-link-type"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Group Link Type
                    </Link>
                  </div>
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-vendor-group-link"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Vendor Group Link
                    </Link>
                  </div>
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-price-type"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Price
                    </Link>
                  </div>{" "}
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

export default VendorOverview;
