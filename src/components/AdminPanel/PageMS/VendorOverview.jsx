import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import RouteIcon from "@mui/icons-material/Route";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { Box, Button, Grid, Skeleton, Stack } from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useGlobalContext } from "../../../Context/Context";

const VendorOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [vendorTypes, setVendorTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [typeData, setTypeData] = useState([{}]);
  const [platformData, setPlatformData] = useState([{}]);
  const [cycleData, setCycleData] = useState([{}]);
  const [payData, setPayData] = useState([{}]);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    axios.get(baseUrl + "vendorAllData").then((res) => {
      setVendorTypes(res.data.tmsVendorkMastList);
      setFilterData(res.data.tmsVendorkMastList);
      setLoading(false);
    });
    axios.get(baseUrl + "getAllVendor").then((res) => {
      setTypeData(res.data.data);
    });
    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformData(res.data.data);
    });
    axios.get(baseUrl + "getAllPayCycle").then((res) => {
      setCycleData(res.data.data);
    });

    axios.get(baseUrl + "getAllPay").then((res) => {
      setPayData(res.data.data);
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
      field: "alternate_mobile",
      headerName: "Alternate Mobile",
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
      field: "gst_no",
      headerName: "GST No",
      width: 200,
      editable: true,
    },
    {
      field: "threshold_limit",
      headerName: "Threshold Limit",
      width: 200,
      editable: true,
    },
    {
      field: "country_code",
      headerName: "Country Code",
      width: 200,
      editable: true,
    },
    {
      field: "company_pincode",
      headerName: "Company Pincode",
      width: 200,
      editable: true,
    },
    {
      field: "company_address",
      headerName: "Company Address",
      width: 200,
      editable: true,
    },
    {
      field: "company_city",
      headerName: "Company City",
      width: 200,
      editable: true,
    },
    {
      field: "company_name",
      headerName: "Company Name",
      width: 200,
      editable: true,
    },
    {
      field: "company_state",
      headerName: "Company State",
      width: 200,
      editable: true,
    },
    {
      field: "home_address",
      headerName: "Home Address",
      width: 200,
      editable: true,
    },
    {
      field: "home_state",
      headerName: "Home State",
      width: 200,
      editable: true,
    },
    {
      field: "pan_no",
      headerName: "Pan No",
      width: 200,
      editable: true,
    },
    {
      field: "personal_address",
      headerName: "Personal Address",
      width: 200,
      editable: true,
    },
    {
      field: "type_id",
      headerName: "Vendor Type",
      width: 200,
      renderCell: (params) => {
        let name = typeData?.find(
          (item) => item?._id == params.row?.type_id
        )?.type_name;
        return <div>{name}</div>;
      },
      editable: true,
    },
    {
      field: "platform_id",
      headerName: "Platform",
      width: 200,
      renderCell: (params) => {
        let name = platformData?.find(
          (item) => item?._id == params.row?.platform_id
        )?.platform_name;
        return <div>{name}</div>;
      },
      editable: true,
    },
    {
      field: "payMethod_id",
      headerName: "Paymen Method",
      width: 200,
      renderCell: (params) => {
        let name = payData?.find(
          (item) => item?._id == params.row?.payMethod_id
        )?.payMethod_name;
        return <div>{name}</div>;
      },
      editable: true,
    },
    {
      field: "cycle_id",
      headerName: "Cycle",
      width: 200,
      renderCell: (params) => {
        let name = cycleData?.find(
          (item) => item?._id == params.row?.cycle_id
        )?.cycle_name;
        return <div>{name}</div>;
      },
      editable: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <Link
            to={`/admin/pms-vendor-page-price-master/${params.row.vendorMast_name}`}
          >
            <button
              title="Update Price"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <PriceChangeIcon />
            </button>
          </Link>
          <Link
            to={`/admin/pms-vendor-group-link/${params.row.vendorMast_name}`}
          >
            <button
              title="Group Link"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <RouteIcon />
            </button>
          </Link>
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
  const copySelectedRows = (type) => {
    let data = [];
    let selectedRows = [];
    
    if (type === 1) {
      selectedRows = Array.from(
        document.getElementsByClassName("MuiDataGrid-row")
      ).filter((row) => row.classList.contains("Mui-selected"));
    }
    
    data = selectedRows.map((row) => {
      let rowData = {};
      for (let j = 1; j < row.children.length - 1; j++) {
        if (dataGridcolumns[j].field) {
          rowData[dataGridcolumns[j].field] = row.children[j + 1].innerText;
        }
      }
      return rowData;
    });
    
    let copyData = data.map((item) => {
      return `Vendor Name: ${item.vendorMast_name}\n` +
             `Mobile: ${item.mobile}\n` +
             `Alternate Mobile: ${item.alternate_mobile}\n` +
             `Email: ${item.email}\n` +
             `Home City: ${item.home_city}\n` +
             `GST No: ${item.gst_no}\n` +
             `Threshold Limit: ${item.threshold_limit}\n` +
             `Country Code: ${item.country_code}\n` +
             `Company Pincode: ${item.company_pincode}\n` +
             `Company Address: ${item.company_address}\n` +
             `Company City: ${item.company_city}\n` +
             `Company Name: ${item.company_name}\n` +
             `Company State: ${item.company_state}\n` +
             `Home Address: ${item.home_address}\n` +
             `Home State: ${item.home_state}\n` +
             `Pan No: ${item.pan_no}\n` +
             `Personal Address: ${item.personal_address}\n` +
             `Vendor Type: ${typeData?.find((type) => type._id == item.type_id)?.type_name}\n` +
             `Platform: ${item.platform_id}\n` +
             `Payment Method: ${payData?.find((pay) => pay._id == item.payMethod_id)?.payMethod_name}\n` +
             `Cycle: ${cycleData?.find((cycle) => cycle._id == item.cycle_id)?.cycle_name}\n`;
    });
    
    converttoclipboard(copyData.join("\n"));
    toastAlert("Copied Selected Pages");
  };
  
  const converttoclipboard = (copydata) => {
    const textarea = document.createElement("textarea");
    textarea.value = copydata;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };
  

  const copyAllRows = () => {
  let data = filterData.map((item) => {
    let formattedData =
      `Vendor Name: ${item.vendorMast_name}\n` +
      `Mobile: ${item.mobile}\n` +
      `Alternate Mobile: ${item.alternate_mobile}\n` +
      `Email: ${item.email}\n` +
      `Home City: ${item.home_city}\n` +
      `GST No: ${item.gst_no}\n` +
      `Threshold Limit: ${item.threshold_limit}\n` +
      `Country Code: ${item.country_code}\n` +
      `Company Pincode: ${item.company_pincode}\n` +
      `Company Address: ${item.company_address}\n` +
      `Company City: ${item.company_city}\n` +
      `Company Name: ${item.company_name}\n` +
      `Company State: ${item.company_state}\n` +
      `Home Address: ${item.home_address}\n` +
      `Home State: ${item.home_state}\n` +
      `Pan No: ${item.pan_no}\n` +
      `Personal Address: ${item.personal_address}\n` +
      `Vendor Type: ${
        typeData?.find((type) => type._id == item.type_id)?.type_name
      }\n` +
      `Platform: ${item.platform_id}\n` +
      `Payment Method: ${
        payData?.find((pay) => pay._id == item.payMethod_id)?.payMethod_name
      }\n` +
      `Cycle: ${
        cycleData?.find((cycle) => cycle._id == item.cycle_id)?.cycle_name
      }\n`;
    return formattedData;
  }
  );
  console.log(data, "data");
  // navigator.clipboard.writeText(data.join("\n"));
  converttoclipboard(data.join("\n"));
  toastAlert("Copied All Pages");
  };

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
        <Stack direction="row" spacing={1}>
          <button
            title="Add"
            className="btn btn-outline-primary ml-3"
            style={{ marginBottom: "10px" }}
            onClick={() => copySelectedRows(1)}
          >
            <ContentCopyOutlinedIcon />
            Copy Selected Pages
          </button>
          <button
            title="Add"
            className="btn btn-outline-primary ml-3"
            style={{ marginBottom: "10px" }}
            onClick={copyAllRows}
          >
            <CopyAllOutlinedIcon />
            Copy All Pages
          </button>
          {/* <Button
                size="small"
                variant="outlined"
                startIcon={<ContentPasteIcon />}
                onClick={() => copySelectedRows(0)}
              >
                Copy Page Name & Links
              </Button> */}
        </Stack>
      </div>
      <div className="card">
        <div className="data_tbl table-responsive">
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
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <Box mt={2} ml={2} mb={3} sx={{ width: "95%" }}>
              <Grid
                container
                spacing={{ xs: 1, md: 10 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {Array.from(Array(5)).map((_, index) => (
                  <Grid item md={1} key={index}>
                    <Skeleton
                      sx={{
                        width: "100%",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {Array.from(Array(30)).map((_, index) => (
                  <Grid item xs={2} sm={2} md={2} key={index}>
                    <Skeleton
                      animation="wave"
                      sx={{
                        width: "100%",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
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
              checkboxSelection
            />
          )}
        </div>
      </div>
    </>
  );
};

export default VendorOverview;
