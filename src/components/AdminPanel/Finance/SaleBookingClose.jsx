import { useEffect, useState } from "react";
import axios, { all } from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tr } from "date-fns/locale";
import { baseUrl } from "../../../utils/config";
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogTitle,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SaleBookingClose = () => {
  const { toastAlert } = useGlobalContext();
  const [displaySeq, setDisplaySeq] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [tdsStatus, setTdsStatus] = useState(0);
  const [aboutToClose, setAboutToClose] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [salesExecutive, setSalesExecutive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setcampaignAmountField] = useState("");
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [sameSalesExecutiveDialog, setSameSalesExecutiveDialog] = useState("");
  const [sameSalesExecutiveData, setSameSalesExecutiveData] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleVerify = async (row) => {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("close_booking", 1);
    formData.append("tds_status", 1);
    formData.append("sale_booking_id", row.sale_booking_id);
    await axios.post(
      "https://sales.creativefuel.io/webservices/RestController.php?view=close_booking",
      formData,
      {
        headers: {
          "application-type": "multipart/form-data",
        },
      }
    );
    getData();
    toastAlert("Data Updated");
    setIsFormSubmitted(true);
  };
  function getData() {
    axios
      .post(baseUrl + "add_php_sale_booking_tds_data_in_node")
      .then((res) => {});
    let formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("tds_status", tdsStatus);
    {
      aboutToClose && formData.append("about_to_close", 1);
    }

    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-sale_booking_for_tds",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        // const filteredData = allData.filter(
        //   (item) => item.show_fstatus == "Open"
        // );
        setData(res.data.body);
        setFilterData(res.data.body);
        const custData = res.data.body;
        const uniqueCustomers = new Set(custData.map((item) => item.cust_name));
        setUniqueCustomerCount(uniqueCustomers.size);
        const uniqueCustomerData = Array.from(uniqueCustomers).map(
          (customerName) => {
            return custData.find((item) => item.cust_name === customerName);
          }
        );
        setUniqueCustomerData(uniqueCustomerData);
        // For Unique Sales Executive
        const salesExecuteiveData = res.data.body;
        const uniqueSalesEx = new Set(
          salesExecuteiveData.map((item) => item.sales_exe_name)
        );
        setUniqueSalesExecutiveCount(uniqueSalesEx.size);
        const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
          return salesExecuteiveData.find(
            (item) => item.sales_exe_name === salesEName
          );
        });
        setUniqueSalesExecutiveData(uniqueSEData);
      });
  }

  useEffect(() => {
    getData();
  }, [tdsStatus, aboutToClose]);

  const aboutClose = () => {
    // const allData = datas;
    // const filteredData = allData.filter(
    //   (item) => item.show_fstatus == "About To Close"
    // );
    // setData(allData);
    // setFilterData(filteredData);
    setTdsStatus(0);
    setAboutToClose(true);
  };

  const open = () => {
    const allData = datas;
    // const filteredData = allData.filter((item) => item.show_fstatus == "Open");
    // setData(allData);
    // setFilterData(filteredData);
    setTdsStatus(0);
    setAboutToClose(false);
  };

  const close = () => {
    // const allData = datas;
    // const filteredData = allData.filter(
    //   (item) => item.show_fstatus == "Closed Link"
    // );
    // setData(allData);
    // setFilterData(filteredData);
    setTdsStatus(1);
    setAboutToClose(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  // Filters Logic :-
  const handleAllFilters = () => {
    const filterData = datas.filter((item) => {
      const date = new Date(item.payment_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Customer Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.cust_name.toLowerCase().includes(customerName.toLowerCase());

      // Requested By Filter
      const salesExecutiveFilterPassed =
        !salesExecutive ||
        item.sales_exe_name
          .toLowerCase()
          .includes(salesExecutive.toLowerCase());
      // Campaign Amount filter
      const campaignAmountFilterPassed = () => {
        const campaignAmount = parseFloat(campaignAmountField);
        switch (campaignAmountFilter) {
          case "greaterThan":
            return +item.campaign_amount > campaignAmount;
          case "lessThan":
            return +item.campaign_amount < campaignAmount;
          case "equalTo":
            return +item.campaign_amount === campaignAmount;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        dateFilterPassed &&
        customerNameFilterPassed &&
        salesExecutiveFilterPassed &&
        campaignAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setCustomerName("");
    setcampaignAmountField("");
    setCampaignAmountFilter("");
    setSalesExecutive("");
  };
  // For Customers
  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleCloseUniqueCustomer = () => {
    setUniqueCustomerDialog(false);
  };

  const handleOpenSameCustomer = (custName) => {
    setSameCustomerDialog(true);

    const sameNameCustomers = datas.filter(
      (item) => item.cust_name === custName
    );
    setSameCustomerData(sameNameCustomers);
  };

  const handleCloseSameCustomer = () => {
    setSameCustomerDialog(false);
  };

  // For Sales Executive
  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesEName) => {
    setSameSalesExecutiveDialog(true);

    const sameNameSalesExecutive = datas.filter(
      (item) => item.sales_exe_name === salesEName
    );

    setSameSalesExecutiveData(sameNameSalesExecutive);
  };

  const handleCloseSameSalesExecutive = () => {
    setSameSalesExecutiveDialog(false);
  };

  // Total base amount:-
  const baseAmountTotal = datas.reduce(
    (total, item) => total + parseFloat(item.base_amount),
    0
  );
  const sameSalesExecutivecolumn = [
    {
      field: "S.No",
      renderCell: (params, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "Sales Executive Name",
      fieldName: "sales_exe_name",
      renderCell: (params) => params.row.sales_exe_name,
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      renderCell: (params) => params.row.sale_booking_date,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "booking_created_date",
      renderCell: (params) => params.row.booking_created_date,
    },
  ];
  const uniqueSalesExecutivecolumn = [
    {
      field: "S.No",
      renderCell: (params, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "Sales Executive Name",
      fieldName: "sales_exe_name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            handleOpenSameSalesExecutive(params.row.sales_exe_name)
          }
        >
          {params.row.sales_exe_name}
        </div>
      ),
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      renderCell: (params) => params.row.sale_booking_date,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "booking_created_date",
      renderCell: (params) => params.row.booking_created_date,
    },
    {
      field: "Action",
      renderCell: (params) => {
        // return row.show_fstatus === "About To Close" ? (
        return tdsStatus === 0 && aboutToClose == true ? (
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleVerify(params.row)}
          >
            Close
          </button>
        ) : (
          <span>{params.row.show_fstatus}</span>
        );
      },
    },
  ];
  const sameCustomercolumn = [
    {
      field: "S.No",
      renderCell: (params, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "Sales Executive Name",
      fieldName: "sales_exe_name",
      renderCell: (params) => params.row.sales_exe_name,
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      renderCell: (params) => params.row.sale_booking_date,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "booking_created_date",
      renderCell: (params) => params.row.booking_created_date,
    },
  ];

  const uniqueCustomercolumn = [
    {
      field: "S.No",
      renderCell: (params, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameCustomer(params.row.cust_name)}
        >
          {params.row.cust_name}
        </div>
      ),
    },
    {
      field: "Sales Executive Name",
      fieldName: "sales_exe_name",
      renderCell: (params) => params.row.sales_exe_name,
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      renderCell: (params) => params.row.sale_booking_date,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "booking_created_date",
      renderCell: (params) => params.row.booking_created_date,
    },
    {
      field: "Action",
      renderCell: (params) => {
        // return row.show_fstatus === "About To Close" ? (
        return tdsStatus === 0 && aboutToClose == true ? (
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleVerify(params.row)}
          >
            Close
          </button>
        ) : (
          <span>{params.row.show_fstatus}</span>
        );
      },
    },
  ];

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.cust_name,
      width: "10%",
    },
    {
      name: "Sales Executive Name",
      selector: (row) => row.sales_exe_name,
    },
    {
      name: "Booking Date",
      selector: (row) => row.sale_booking_date,
    },
    {
      name: "Campaign Amount",
      selector: (row) => row.campaign_amount,
    },
    {
      name: "Base Amount",
      selector: (row) => row.base_amount,
    },
    {
      name: "GST Amount",
      selector: (row) => row.gst_amount,
    },
    {
      name: "Net Amount",
      selector: (row) => row.net_amount,
    },
    {
      name: "Paid Amount",
      selector: (row) => row.total_paid_amount,
    },
    {
      name: "Refund Amount",
      selector: (row) => row.total_refund_amount,
    },
    {
      name: "Refund Balance Amount",
      selector: (row) => row.balance_refund_amount,
    },
    {
      name: "Net Bal Cust to pay Amt (%)",
      selector: (row) => row.net_balance_amount_to_pay_percentage,
    },
    {
      name: "Booking Created Date",
      selector: (row) => row.booking_created_date,
    },
    {
      name: "Action",
      selector: (row) => {
        // return row.show_fstatus === "About To Close" ? (
        return tdsStatus === 0 && aboutToClose == true ? (
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleVerify(row)}
          >
            Close
          </button>
        ) : (
          <span>{row.show_fstatus}</span>
        );
      },
    },
  ];
  return (
    <>
      <FormContainer
        mainTitle="Sale Booking "
        link="/admin/incentive-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        uniqueCustomerCount={uniqueCustomerCount}
        baseAmountTotal={baseAmountTotal}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        saleBookingClosePaymentAdditionalTitles={true}
      />
      {/* Same Sales Executive Dialog Box */}

      <Dialog
        open={sameSalesExecutiveDialog}
        onClose={handleCloseSameSalesExecutive}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSameSalesExecutive}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DataGrid
          rows={sameSalesExecutiveData}
          columns={sameSalesExecutivecolumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableColumnFilter
          disableColumnReorder
          disableColumnResize
          disableMultipleColumnsSorting
          components={{
            Toolbar: GridToolbar,
          }}
          fv
          componentsProps={{
            toolbar: {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Search",
              clearSearch: true,
              clearSearchAriaLabel: "clear",
            },
          }}
          getRowId={(row) => sameSalesExecutiveData.indexOf(row)}
        />
      </Dialog>
      {/* Unique Sales Executive Dialog Box */}
      <Dialog
        open={uniqueSalesExecutiveDialog}
        onClose={handleCloseUniquesalesExecutive}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniquesalesExecutive}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DataGrid
          rows={uniqueSalesExecutiveData}
          columns={uniqueSalesExecutivecolumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableColumnFilter
          disableColumnReorder
          disableColumnResize
          disableMultipleColumnsSorting
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Search",
              clearSearch: true,
              clearSearchAriaLabel: "clear",
            },
          }}
          getRowId={(row) => uniqueSalesExecutiveData.indexOf(row)}
        />
      </Dialog>
      {/* Same Customer Dialog */}
      <Dialog
        open={sameCustomerDialog}
        onClose={handleCloseSameCustomer}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Customers</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSameCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DataGrid
          rows={sameCustomerData}
          columns={sameCustomercolumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableColumnFilter
          disableColumnReorder
          disableColumnResize
          disableMultipleColumnsSorting
          components={{
            Toolbar: GridToolbar,
          }}
          fv
          componentsProps={{
            toolbar: {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Search",
              clearSearch: true,
              clearSearchAriaLabel: "clear",
            },
          }}
          getRowId={(row) => sameCustomerData.indexOf(row)}
        />
      </Dialog>

      {/* Unique Customer Dialog Box */}
      <Dialog
        open={uniqueCustomerDialog}
        onClose={handleCloseUniqueCustomer}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Customers</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniqueCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DataGrid
          rows={uniqueCustomerData}
          columns={uniqueCustomercolumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableColumnFilter
          disableColumnReorder
          disableColumnResize
          disableMultipleColumnsSorting
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Search",
              clearSearch: true,
              clearSearchAriaLabel: "clear",
            },
          }}
          getRowId={(row) => uniqueCustomerData.indexOf(row)}
        />
      </Dialog>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label>Customer Name</label>
            <Autocomplete
              value={customerName}
              onChange={(event, newValue) => setCustomerName(newValue)}
              options={Array.from(
                new Set(datas.map((option) => option.cust_name))
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Customer Name"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    className: "form-control", // Apply Bootstrap's form-control class
                  }}
                  style={{
                    borderRadius: "0.25rem",
                    transition:
                      "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                    "&:focus": {
                      borderColor: "#80bdff",
                      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Sales Executive Name</label>
            <Autocomplete
              value={salesExecutive}
              onChange={(event, newValue) => setSalesExecutive(newValue)}
              options={Array.from(
                new Set(datas.map((option) => option.sales_exe_name))
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sales Executive Name"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    className: "form-control", // Apply Bootstrap's form-control class
                  }}
                  style={{
                    borderRadius: "0.25rem",
                    transition:
                      "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                    "&:focus": {
                      borderColor: "#80bdff",
                      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>From Date</label>
            <input
              value={fromDate}
              type="date"
              className="form-control"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>To Date</label>
            <input
              value={toDate}
              type="date"
              className="form-control"
              onChange={(e) => {
                setToDate(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Campaign Amount Filter</label>
            <select
              value={campaignAmountFilter}
              className="form-control"
              onChange={(e) => setCampaignAmountFilter(e.target.value)}
            >
              <option value="">Select Amount</option>
              <option value="greaterThan">Greater Than</option>
              <option value="lessThan">Less Than</option>
              <option value="equalTo">Equal To</option>
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Campaign Amount</label>
            <input
              value={campaignAmountField}
              type="number"
              placeholder="Request Amount"
              className="form-control"
              onChange={(e) => {
                setcampaignAmountField(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-md-1 mt-4 me-2">
          <Button variant="contained" onClick={handleAllFilters}>
            <i className="fas fa-search"></i> Search
          </Button>
        </div>
        <div className="col-md-1 mt-4">
          <Button variant="contained" onClick={handleClearAllFilter}>
            Clear
          </Button>
        </div>
      </div>
      <button className="btn btn-success" onClick={open}>
        Open
      </button>
      <button className="btn btn-warning" onClick={close}>
        Closed
      </button>
      <button className="btn btn-primary" onClick={aboutClose}>
        About to close
      </button>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Sale Booking"
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

export default SaleBookingClose;
