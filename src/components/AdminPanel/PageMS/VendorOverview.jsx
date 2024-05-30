import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import RouteIcon from "@mui/icons-material/Route";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { Box, Grid, Skeleton, Stack } from "@mui/material";
// import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
// import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
import { useGlobalContext } from "../../../Context/Context";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import {
  setRowData,
  setShowBankDetailsModal,
  setShowPageModal,
  setShowWhatsappModal,
  setVendorRowData,
} from "../../Store/PageOverview";
import { useDispatch, useSelector } from "react-redux";
import VendorWhatsappLinkModla from "./VendorWhatsappLinkModla";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import VendorPageModal from "./VendorPageModal";
import {
  useGetAllVendorTypeQuery,
  useGetPmsPayCycleQuery,
  useGetPmsPaymentMethodQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";
import VendorBankDetailModal from "./VendorBankDetailModal";

const VendorOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [vendorTypes, setVendorTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { data: vendor } = useGetAllVendorTypeQuery();
  const typeData = vendor?.data;

  const showWhatsappModal = useSelector(
    (state) => state.PageOverview.showWhatsappModal
  );
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data;

  const { data: cycle } = useGetPmsPayCycleQuery();
  const cycleData = cycle?.data;

  const { data: pay } = useGetPmsPaymentMethodQuery();
  const payData = pay?.data;
  const getData = () => {
    setLoading(true);
    axios.get(baseUrl + "v1/vendor").then((res) => {
      setVendorTypes(res.data.data);
      setFilterData(res.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = vendorTypes?.filter((d) => {
      return d.vendor_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
    setData(result);
  }, [search]);

  const handleOpenWhatsappModal = (row) => {
    return () => {
      dispatch(setShowWhatsappModal());
      dispatch(setRowData(row));
    };
  };

  const handleOpenBankDetailsModal = (row) => {
    return () => {
      dispatch(setShowBankDetailsModal());
      dispatch(setRowData(row));
    };
  }

  const handleClickVendorName = (params) => {
    return () => {
      dispatch(setVendorRowData(params.row));
      dispatch(setShowPageModal());
    };
  };

  const dataGridcolumns = [
    {
      field: "sno",
      headerName: "S.NO",
      width: 80,
      renderCell: (params) => <div>{filterData.indexOf(params.row) + 1}</div>,
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      width: 200,
      // editable: true,
      renderCell: (params) => {
        return (
          <div
            // onClick={handleClickVendorName(params)}
            // className="link-primary cursor-pointer text-truncate"
          >
            {params.row.vendor_name}
          </div>
        );
      },
    },
    {
      field: "vendor_category",
      headerName: "Vendor Category",
      width: 150,
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
      field: "vendor_type",
      headerName: "Vendor Type",
      width: 200,
      renderCell: (params) => {
        let name = typeData?.find(
          (item) => item?._id == params.row?.vendor_type
        )?.type_name;
        return <div>{name}</div>;
      },
      editable: true,
    },
    {
      field: "vendor_platform",
      headerName: "Platform",
      width: 200,
      renderCell: (params) => {
        let name = platformData?.find(
          (item) => item?._id == params.row?.vendor_platform
        )?.platform_name;
        return <div>{name}</div>;
      },
      editable: true,
    },
    {
      field: "payment_method",
      headerName: "Paymen Method",
      width: 200,
      renderCell: (params) => {
        let name = payData?.find(
          (item) => item?._id == params.row?.payment_method
        )?.payMethod_name;
        return <div>{name}</div>;
      },
      editable: true,
    },
    {
      field: "pay_cycle",
      headerName: "Cycle",
      width: 200,
      renderCell: (params) => {
        let name = cycleData?.find(
          (item) => item?._id == params.row?.pay_cycle
        )?.cycle_name;
        return <div>{name}</div>;
      },
      editable: true,
    },
    {
      field: "Bank Details",
      headerName: "Bank Details",
      width: 200,
      renderCell: (params) => {
        return (
          <button
            title="Bank Details"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={handleOpenBankDetailsModal(params.row)}
          >
            <OpenWithIcon />
          </button>
        );
      },
    },
    {
      field: "whatsapp_link",
      headerName: "Whatsapp Link",
      width: 200,
      renderCell: (params) => {
        return (
          <button
            title="Whatsapp Link"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={handleOpenWhatsappModal(params.row)}
          >
            <OpenWithIcon />
          </button>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          {/* <Link
            to={`/admin/pms-vendor-page-price-master/${params.row.vendorMast_name}`}
          >
            <button
              title="Update Price"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <PriceChangeIcon />
            </button>
          </Link> */}
          {/* <Link
            to={`/admin/pms-vendor-group-link/${params.row.vendorMast_name}`}
          >
            <button
              title="Group Link"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <RouteIcon />
            </button>
          </Link> */}
          <Link to={`/admin/pms-vendor-master/${params.row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          <DeleteButton
            endpoint="v1/vendor"
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
      return (
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
        }\n`
      );
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
    });

    converttoclipboard(data.join("\n"));
    toastAlert("Copied All Pages");
  };

  return (
    <>
      <VendorWhatsappLinkModla />
      <Stack direction={"row"} justifyContent={"flex-end"}>
        <Link to={`/admin/pms-vendor-master`} className="me-3 btn btn-primary btn-sm">
        
            Add Vendor <i className="fa fa-plus"/>
        </Link>
        <Link
          to={`/admin/pms-page-overview`}
          className="btn btn-primary btn-sm"
        >
          Page <KeyboardArrowRightIcon />
        </Link>
        {/* <Link to={`/admin/pms-vendor-page-price-overview`}>
          <button
            title="Add"
            className="btn btn-outline-primary"
            style={{ marginBottom: "10px" }}
          >
            Vendor Page Price Overview
          </button>
        </Link> */}
        {/* <Stack direction="row" spacing={1}>
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
          </button> */}
          {/* <Button
                size="small"
                variant="outlined"
                startIcon={<ContentPasteIcon />}
                onClick={() => copySelectedRows(0)}
              >
                Copy Page Name & Links
              </Button> */}
        {/* </Stack> */}
      </Stack>
      <div className="card">
        <div className="data_tbl table-responsive">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Vendor </h1>
              {/* <div className="card-text">
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
              </div> */}
            </div>
            {/* <div className="mx-3 mb-2">
              {[
                ...new Set(
                  filterData.map((item) => {
                    return item?.vendor_category;
                  })
                ),
              ].map((item, index) => {
                return (
                  <button
                    key={index}
                    className="btn btn-primary btn-sm"
                    onClick={() => setSearch(item)}
                  >
                    {item}{" "}
                    <span className="badge bg-secondary">
                      {
                        filterData.filter((data) => {
                          return data.vendor_category === item;
                        }).length
                      }
                    </span>
                  </button>
                );
              })}
            </div> */}
            <div className="mx-3 mb-2">
              <h4>
                <span className="text-primary">
                  Total Vendor:{vendorTypes.length}
                </span>
              </h4>
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
              // checkboxSelection
            />
          )}
        </div>
      </div>
      <VendorBankDetailModal />
      <VendorPageModal />
     <VendorWhatsappLinkModla />
    </>
  );
};

export default VendorOverview;
