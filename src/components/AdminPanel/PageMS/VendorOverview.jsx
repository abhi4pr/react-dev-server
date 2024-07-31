import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Grid, Skeleton } from "@mui/material";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import {
  setRowData,
  setShowBankDetailsModal,
  setShowWhatsappModal,
} from "../../Store/PageOverview";
import { useDispatch } from "react-redux";
import VendorWhatsappLinkModla from "./VendorWhatsappLinkModla";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import VendorPageModal from "./VendorPageModal";
import {
  useGetAllVendorQuery,
  useGetAllVendorTypeQuery,
  useGetPmsPayCycleQuery,
  useGetPmsPaymentMethodQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";
import VendorBankDetailModal from "./VendorBankDetailModal";
import VendorDetails from "./Vendor/VendorDetails";
import { useGetAllPageListQuery } from "../../Store/PageBaseURL";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import formatString from "../Operation/CampaignMaster/WordCapital";

const VendorOverview = () => {
  const [vendorDetails, setVendorDetails] = useState(null);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const dispatch = useDispatch();
  const [contextData, setContextData] = useState(false);

  const userID = decodedToken.id;
  const { data: vendor } = useGetAllVendorTypeQuery();
  const typeData = vendor?.data;
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data;

  const { data: cycle } = useGetPmsPayCycleQuery();
  const cycleData = cycle?.data;

  const { data: payData } = useGetPmsPaymentMethodQuery();
  const {
    data: vendorData,
    isLoading: loading,
    refetch: refetchVendor,
  } = useGetAllVendorQuery();
  let vendorTypes = vendorData?.data;
  const [filterData, setFilterData] = useState([]);

  const { data: pageList } = useGetAllPageListQuery();

  const getData = () => {
    refetchVendor();
  };

  useEffect(() => {
    // if (showPageHealthColumn) {
    //   dispatch(setShowPageHealthColumn(false));
    // }
    if (userID && !contextData) {
      axios
        .get(`${baseUrl}get_single_user_auth_detail/${userID}`)
        .then((res) => {
          if (res.data[57].view_value === 1) {
            setContextData(true);
          }
        });
    }

    getData();
  }, []);

  useEffect(() => {
    // console.log(vendorData?.data);
    if (vendorData) {
      setFilterData(vendorData?.data);
    }
  }, [vendorData]);

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
  };

  const handleClickVendorName = (params) => {
    setVendorDetails(params.row);
  };

  const dataGridcolumns = [
    {
      field: "sno",
      headerName: "S.NO",
      width: 80,

      valueGetter: (params) => {
        return filterData?.findIndex((item) => item._id === params.id) + 1;
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      width: 200,
      // editable: true,
      renderCell: (params) => {
        return (
          <div
            onClick={() => handleClickVendorName(params)}
            className="link-primary cursor-pointer text-truncate"
          >
            {formatString(params.row.vendor_name)}
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
      field: "primary_page",
      headerName: "Primary Page",
      width: 200,
      valueGetter: (params) => {
        let name = pageList?.data?.find(
          (ele) => ele._id === params.row.primary_page
        )?.page_name;
        return name ?? "NA";
      },
    },
    {
      field: "page_count",
      headerName: "Page Count",
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 200,
      editable: true,
    },
    // {
    //   field: "alternate_mobile",
    //   headerName: "Alternate Mobile",
    //   width: 200,
    //   editable: true,
    // },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
    },
    // {
    //   field: "gst_no",
    //   headerName: "GST No",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "threshold_limit",
    //   headerName: "Threshold Limit",
    //   width: 200,
    //   editable: true,
    // },
    {
      field: "country_code",
      headerName: "Country Code",
      width: 200,
      editable: true,
    },
    // {
    //   field: "company_pincode",
    //   headerName: "Company Pincode",
    //   width: 200,
    //   editable: true,
    // },
    {
        field: "Pincode",
        headerName: "Home Pincode",
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
      field: "home_state",
      headerName: "Home State",
      width: 200,
      editable: true,
    },
    // {
    //   field: "company_address",
    //   headerName: "Company Address",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "company_name",
    //   headerName: "Company Name",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "company_state",
    //   headerName: "Company State",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "company_city",
    //   headerName: "Company City",
    //   width: 200,
    //   editable: true,
    // },
    {
      field: "home_address",
      headerName: "Home Address",
      width: 200,
      editable: true,
    },
    // {
    //   field: "pan_no",
    //   headerName: "Pan No",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "personal_address",
    //   headerName: "Personal Address",
    //   width: 200,
    //   editable: true,
    // },
    {
      field: "vendor_type",
      headerName: "Vendor Type",
      valueGetter: (params) => {
       return typeData?.find(
          (item) => item?._id == params.row?.vendor_type
        )?.type_name;
      },
      width: 200,
      editable: true,
    },
    {
      field: "vendor_platform",
      headerName: "Platform",
      valueGetter: (params) => {
        return  platformData?.find(
          (item) => item?._id == params.row?.vendor_platform
        )?.platform_name;
      },
      width: 200,
      editable: true,
    },
    // {
    //   field: "payment_method",
    //   headerName: "Payment Method",
    //   width: 200,
    //   renderCell: (params) => {
    //     let name = payData?.find(
    //       (item) => item?._id == params.row?.payment_method
    //     )?.payMethod_name;
    //     console.log(params.row.payment_method, "payment_method")
    //     return <div>{name}</div>;
    //   },
    //   editable: true,
    // },
    {
      field: "pay_cycle",
      headerName: "Cycle",
      width: 200,
      valueGetter: (params) => {
       return cycleData?.find(
          (item) => item?._id == params.row?.pay_cycle
        )?.cycle_name;
        
      },
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
      renderCell: ({ row }) => (
        <>
          {contextData && (
            <Link to={`/admin/pms-vendor-master/${row._id}`}>
              <button
                title="Edit"
                className="btn btn-outline-primary btn-sm user-button"
              >
                <FaEdit />{" "}
              </button>
            </Link>
          )}
          {decodedToken.role_id == 1 && (
            <DeleteButton endpoint="v1/vendor" id={row._id} getData={getData} />
          )}
        </>
      ),
    },
  ];

  return (
    <>
      {filterData && (
        <div className="card">
          {vendorDetails && (
            <VendorDetails
              vendorDetails={vendorDetails}
              setVendorDetails={setVendorDetails}
            />
          )}
          <VendorWhatsappLinkModla />
          <div className="card-header flexCenterBetween">
            <h5 className="card-title">Vendor : {vendorTypes?.length}</h5>
            <div className="flexCenter colGap8">
              <Link
                to={`/admin/pms-vendor-master`}
                className="btn cmnbtn btn_sm btn-outline-primary"
              >
                Add Vendor <i className="fa fa-plus" />
              </Link>
              <Link
                to={`/admin/pms-page-overview`}
                className="btn cmnbtn btn_sm btn-outline-primary"
              >
                Page <KeyboardArrowRightIcon />
              </Link>
            </div>
          </div>
          {/* <VendorFilters
            filterData={filterData}
            setFilterData={setFilterData}
          /> */}
          <div className="data_tbl thm_table table-responsive card-body p0">
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
              />
            )}
          </div>
          <VendorBankDetailModal />
          <VendorPageModal />
          <VendorWhatsappLinkModla />
        </div>
      )}
    </>
  );
};

export default VendorOverview;
