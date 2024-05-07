import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Modal from "react-modal";
import { set } from "date-fns";
import { baseUrl } from "../../../utils/config";
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SaleBookingVerify = ({ onHandleOpenUniqueSalesExecutiveChange, onHandleOpenUniqueCustomerClickChange, setAbouttoclosecount, setButtonaccess, setclosecount, setOpencount, setUniquecustomerCount, setBaseamountTotal, setUniquesalesexecutiveCount }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [balAmount, setBalAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [row, setRow] = useState({});
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("verified_amount", balAmount);
    formData.append("verified_remark", remark);
    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=verifybooking",
        formData,
        {
          headers: {
            "application-type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        handleCloseImageModal();
        getData();
      });

    toastAlert("Data Updated");
    setIsFormSubmitted(true);
  };

  const handleImageClick = (row) => {
    setImageModalOpen(true);
    setRow(row);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setBalAmount("");
    setRemark("");
  };

  function getData() {
    axios
      .post(baseUrl + "add_php_sale_booking_tds_verification_data_in_node")
      .then(() => { });
    let formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-sale_booking_tds_verification",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setFilterData(res.data.boby);
        setData(res.data.body);
        const custData = res.data.body;
        const uniqueCustomers = new Set(custData.map((item) => item.cust_name));
        setUniqueCustomerCount(uniqueCustomers.size);
        setUniquecustomerCount(uniqueCustomers.size);
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
        setUniquesalesexecutiveCount(uniqueSalesEx.size);
        const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
          return salesExecuteiveData.find(
            (item) => item.sales_exe_name === salesEName
          );
        });
        setUniqueSalesExecutiveData(uniqueSEData);
      });
  }

  const convertDateToDDMMYYYY = (date) => {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const output = day + "/" + month + "/" + year;
    return output;
  };

  useEffect(() => {
    getData();
    setButtonaccess(contextData &&
      contextData[2] &&
      contextData[2].insert_value === 1 &&
      false);
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().includes(search.toLowerCase());
    });
    setFilterData(result);
  }, [search, datas]); // Including datas in dependencies

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
  useEffect(() => {
    onHandleOpenUniqueSalesExecutiveChange(() => handleOpenUniqueSalesExecutive);
    onHandleOpenUniqueCustomerClickChange(() => handleOpenUniqueCustomerClick);
  }, []);

  // Total base amount:-
  const baseAmountTotal = datas.reduce(
    (total, item) => total + parseFloat(item.base_amount),
    0
  );
  setBaseamountTotal(baseAmountTotal);

  const sameSalesExecutivecolumn = [
    {
      field: "S.No",
      width: 800,

      renderCell: (params, index) => (
        <div>{[...sameSalesExecutiveData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      width: 200,

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
      width: 200,

      renderCell: (params) => params.row.sales_exe_name,
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      width: 200,

      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      width: 200,

      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      width: 200,

      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      width: 200,

      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      width: 200,

      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      width: 200,

      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      width: 200,

      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      width: 200,

      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Balance Amount",
      width: 200,

      renderCell: (params) => {
        return params.row.campaign_amount - params.row.total_paid_amount;
      },
    },
    {
      field: "Net Bal Cust to pay Amt",
      fieldName: "net_balance_amount_to_pay",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "creation_date",
      width: 200,

      renderCell: (params) => convertDateToDDMMYYYY(params.row.creation_date),
    },
  ];
  const uniqueSalesExecutivecolumn = [
    {
      field: "S.No",
      width: 80,

      renderCell: (params, index) => (
        <div>{[...uniqueSalesExecutiveData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      width: 200,

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
      width: 200,

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
      width: 200,

      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      width: 200,

      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      width: 200,

      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      width: 200,

      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      width: 200,

      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      width: 200,

      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      width: 200,

      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      width: 200,

      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Balance Amount",
      width: 200,

      renderCell: (params) => {
        return params.row.campaign_amount - params.row.total_paid_amount;
      },
    },
    {
      field: "Net Bal Cust to pay Amt",
      fieldName: "net_balance_amount_to_pay",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "creation_date",
      width: 200,

      renderCell: (params) => convertDateToDDMMYYYY(params.row.creation_date),
    },
  ];
  const sameCustomercolumn = [
    {
      field: "S.No",
      width: 80,

      renderCell: (params, index) => (
        <div>{[...sameCustomerData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      width: 200,

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
      width: 200,

      renderCell: (params) => params.row.sales_exe_name,
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      width: 200,

      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      width: 200,

      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      width: 200,

      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      width: 200,

      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      width: 200,

      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      width: 200,

      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      width: 200,

      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      width: 200,

      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Balance Amount",
      width: 200,

      renderCell: (params) => {
        return params.row.campaign_amount - params.row.total_paid_amount;
      },
    },
    {
      field: "Net Bal Cust to pay Amt",
      fieldName: "net_balance_amount_to_pay",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "creation_date",
      width: 200,

      renderCell: (params) => convertDateToDDMMYYYY(params.row.creation_date),
    },
  ];
  const uniqueCustomercolumn = [
    {
      field: "S.No",
      width: 80,

      renderCell: (params, index) => (
        <div>{[...uniqueCustomerData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      width: 200,

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
      width: 200,

      renderCell: (params) => params.row.sales_exe_name,
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      width: 200,

      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      width: 200,

      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      width: 200,

      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      width: 200,

      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      width: 200,

      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      width: 200,

      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      width: 200,

      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      width: 200,

      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Balance Amount",
      width: 200,

      renderCell: (params) => {
        return params.row.campaign_amount - params.row.total_paid_amount;
      },
    },
    {
      field: "Net Bal Cust to pay Amt",
      fieldName: "net_balance_amount_to_pay",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "creation_date",
      width: 200,

      renderCell: (params) => convertDateToDDMMYYYY(params.row.creation_date),
    },
    {
      name: "Action",
      width: 200,

      renderCell: (params) => (
        <>
          {params.row.tds_status == 2 ? (
            <span>Verified</span>
          ) : (
            <button
              className="btn cmnbtn btn_sm btn-outline-primary mr4"
              onClick={() => handleImageClick(params.row)}
            >
              Verify
            </button>
          )}
        </>
      ),
    },
  ];
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
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
      width: "10%",
    },
    {
      name: "Booking Date",
      // selector: (row) => row.sale_booking_date,
      cell: (row) => convertDateToDDMMYYYY(row.sale_booking_date),
      width: "6%",
    },
    {
      name: "Campaign Amount",
      selector: (row) => row.campaign_amount,
      width: "9%",
    },
    {
      name: "Base Amount",
      selector: (row) => row.base_amount,
      width: "6%",
    },
    {
      name: "GST Amount",
      selector: (row) => row.gst_amount,
      width: "7%",
    },
    {
      name: "Net Amount",
      selector: (row) => row.net_amount,
      width: "7%",
    },
    {
      name: "Paid Amount",
      selector: (row) => row.total_paid_amount,
      width: "7%",
    },
    {
      name: "Refund Amount",
      selector: (row) => row.total_refund_amount,
      width: "7%",
    },
    {
      name: "Refund Balance Amount",

      cell: (row) => {
        return row.balance_refund_amount;
      },
      width: "9%",
    },
    {
      name: "Balance Amount",
      cell: (row) => {
        return row.campaign_amount - row.total_paid_amount;
      },
      width: "7%",
    },
    {
      name: "Net Bal Cust to pay Amt",
      selector: (row) => row.net_balance_amount_to_pay,
      width: "9%",
    },
    {
      name: "Net Bal Cust to pay Amt (%)",
      selector: (row) => row.net_balance_amount_to_pay_percentage,
      width: "12%",
    },
    {
      name: "Booking Created Date",
      cell: (row) => convertDateToDDMMYYYY(row.creation_date),
      width: "9%",
    },
    // {
    //   name: "Action",
    //   selector: (row) => (
    //     <>
    //       {row.tds_status == 2 ? (
    //         <span>Verified</span>
    //       ) : (
    //         <button
    //           className="btn cmnbtn btn_sm btn-outline-primary mr4"
    //           onClick={() => handleImageClick(row)}
    //         >
    //           Verify
    //         </button>
    //       )}
    //     </>
    //   ),
    // },
  ];

  return (
    <>
      {/* <FormContainer
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
        saleBookingVerifyPaymentAdditionalTitles={true}
      /> */}
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
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="thm_table fx-head">
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
          </div>
        </DialogContent>
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
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="thm_table fx-head">
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
          </div>
        </DialogContent>
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
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >

          <div className="thm_table fx-head">
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
          </div>
        </DialogContent>
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
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="thm_table fx-head">


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
          </div>
        </DialogContent>
      </Dialog>


      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Search by filter</h5>
        </div>
        <div className="card-body pb4">
          <div className="row thm_form">
            <div className="col-md-4">
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
            <div className="col-md-4">
              <div className="form-group">
                <label>Sales Executive Name</label>
                <Autocomplete
                  value={salesExecutive}
                  onChange={(event, newValue) =>
                    setSalesExecutive(newValue)
                  }
                  options={datas.map(
                    (option) => option.sales_exe_name || ""
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
            <div className="col-md-4">
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
            <div className="col-md-4">
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
            <div className="col-md-4">
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
            <div className="col-md-4">
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
          </div>
        </div>
        <div className="card-footer">
          <div className="flexCenter colGap16">
            <Button
              variant="contained"
              onClick={handleAllFilters}
              className="btn cmnbtn btn-primary"
            >
              <i className="fas fa-search"></i> Search
            </Button>
            <Button
              variant="contained"
              onClick={handleClearAllFilter}
              className="btn cmnbtn btn-secondary"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>





      <div className="card">
        <div className="card-header sb">
          <h5 className="card-title">Sale Booking Verify</h5>
          <input
            type="text"
            placeholder="Search here"
            className="w-25 form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body thm_table">
          <DataTable
            columns={columns}
            data={filterData}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            pagination

          />
        </div>
      </div>



      <Modal
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
        style={{
          content: {
            width: "30%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Sale Booking Verify</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseImageModal}
            >
              X
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 ">
            <form onSubmit={handleSubmit}>
              <div className="form-group col-12"></div>

              <div className="form-group">
                <label htmlFor="images">Amount:</label>
                <input
                  type="number"
                  className="form-control"
                  id="images"
                  name="images"
                  value={balAmount}
                  onChange={(e) => {
                    if (e.target.value > row.net_balance_amount_to_pay) {
                      toastError(
                        "Amount is greater than balance amount to pay"
                      );
                      return;
                    }
                    setBalAmount(e.target.value);
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="images">Remark:</label>
                <input
                  type="text"
                  className="form-control"
                  id="images"
                  name="images"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SaleBookingVerify;
