import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { Alert, Autocomplete, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { baseUrl } from "../../../utils/config";
import pdfImg from "./pdf-file.png";
import ImageView from "./ImageView";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";

import dayjs from "dayjs";
import { Link } from "react-router-dom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const BalancePaymentList = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [balAmount, setBalAmount] = useState("");
  const [paymentRefNo, setPaymentRefNo] = useState("");
  const [paymentRefImg, setPaymentRefImg] = useState("");
  const [paymentType, setPaymentType] = useState({ label: "", value: "" });
  const [paymentDetails, setPaymentDetails] = useState("");
  const [singleRow, setSingleRow] = useState({});
  const [dropdownData, setDropDownData] = useState([]);
  const [paidAmount, setPaidAmount] = useState([]);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);
  const [paymentDate, setPaymentDate] = useState(dayjs(new Date()));
  const [customerName, setCustomerName] = useState("");
  const [salesExecutiveName, setSalesExecutiveName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setCampaignAmountField] = useState("");
  const [balanceAmountFilter, setBalanceAmountFilter] = useState("");
  const [balanceAmountField, setBalanceAmountField] = useState("");
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
  const [partyNameDialog, setPartyNameDialog] = useState(false);
  const [invoiceNumberDialog, setInvoiceNumberDialog] = useState(false);
  const [withInvoiceCount, setWithInvoiceCount] = useState(0);
  const [withoutInvoiceCount, setWithoutInvoiceCount] = useState(0);
  const [partyName, setPartyName] = useState("");
  const [gstNonGstData, setGstNonGstData] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [saleBookingIdforPartyName, setSaleBookingIdforPartyName] =
    useState("");
  const [saleBookingIdForInvoiceNo, setSaleBookingIdForInvoiceNo] =
    useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [closeDialog, setCloseDialog] = useState(false);
  // const [TDSPercentage, setTDSPercetage] = useState("");
  // const [TDSValue, setTDSValue] = useState("");
  const [tdsFieldSaleBookingId, setTDSFieldSaleBookingId] = useState("");
  const [paidPercentage, setPaidPercentage] = useState("");
  const [tdsPercentage, setTDSPercentage] = useState("");
  const [showField, setShowField] = useState(false);
  const [baseAmount, setBaseAmount] = useState();
  const [campaignAmountData, setCampaignAmountData] = useState();
  const [paidAmountData, setPaidAmountData] = useState();

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const DateFormateToYYYYMMDD = (date) => {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return `${ye}-${mo}-${da}`;
  };

  useEffect(() => {
    calculatePaidPercentage();
    calculateTDSPercentage();
  }, [balAmount, paidAmount, baseAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", +singleRow.sale_booking_id);
    formData.append("payment_update_id", "");
    formData.append("payment_ref_no", paymentRefNo);
    formData.append("payment_detail_id", paymentDetails.value);
    formData.append("payment_screenshot", paymentRefImg);
    formData.append("payment_type", paymentType.label);
    formData.append("payment_mode", "others");
    formData.append("paid_amount", paidAmount);

    //     // sale_booking_id:161
    //     payment_update_id:
    //     payment_ref_no:Axispo444385821
    //     payment_detail_id:43
    //     loggedin_user_id:36
    //     paid_amount:54000
    //     payment_type:Partial
    //     payment_mode:Others
    //     payment_screenshot

    //     sale_booking_id:161
    // payment_update_id:
    // payment_ref_no:Axispo444385821
    // payment_detail_id:43
    // loggedin_user_id:36
    // paid_amount:54000
    // payment_type:Partial
    // payment_mode:Others

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=balance_payment_update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        axios
          .put(baseUrl + "balance_payment_list_update", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            getData();
            setBalAmount("");
            setPaymentRefNo("");
            setPaymentRefImg("");
            setPaymentType({ label: "", value: "" });
            setPaymentDetails("");
            setPaidAmount([]);
          });
      });
    setImageModalOpen(false);

    toastAlert("Data updated");
    setIsFormSubmitted(true);
    setImageModalOpen(false);
  };

  function getData() {
    axios.post(baseUrl + "add_php_payment_bal_data_in_node").then(() => {});
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-balance_payment_list",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
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
          salesExecuteiveData.map((item) => item.username)
        );
        setUniqueSalesExecutiveCount(uniqueSalesEx.size);
        const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
          return salesExecuteiveData.find(
            (item) => item.username === salesEName
          );
        });
        setUniqueSalesExecutiveData(uniqueSEData);

        // with nd without invoice count
        const withInvoiceImage = custData.filter(
          (item) => item.invc_img && item.invc_img.length > 0
        );
        const withoutInvoiceImage = custData.filter(
          (item) => !item.invc_img || item.invc_img.length === 0
        );
        setWithoutInvoiceCount(withInvoiceImage.length);
        setWithoutInvoiceCount(withoutInvoiceImage.length);
        // ===============================================

        const dateFilterData = filterDataBasedOnSelection(res?.data?.body);
        setFilterData(dateFilterData);
      });
  }

  useEffect(() => {
    getData();
  }, [dateFilter]);

  const getDropdownData = async () => {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    const response = await axios.post(
      "https://sales.creativefuel.io/webservices/RestController.php?view=sales-payment_account_list",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const responseData = response.data.body;
    setDropDownData(responseData);
  };

  useEffect(() => {
    getDropdownData();
  }, []);

  useEffect(() => {
    totalPA();
  }, [paidAmount]);

  const handleImageClick = (row) => {
    setBalAmount(row.campaign_amount - row.total_paid_amount);
    setBaseAmount(row.base_amount);
    setPaidAmountData(row.total_paid_amount);
    setCampaignAmountData(row.campaign_amount);
    setTDSFieldSaleBookingId(row.sale_booking_id);
    setSingleRow(row);
    getData();
    setImageModalOpen(true);
  };
  const convertDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setBalAmount("");
    setPaymentRefNo("");
    setPaymentRefImg("");
    setPaymentType({ label: "", value: "" });
    setPaymentDetails("");
    setPaidAmount([]);
    setPaidPercentage("");
  };

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleAllFilters = () => {
    const filterData = datas.filter((item) => {
      const date = new Date(item.sale_booking_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // sales Booking Date Range Filter:-
      const salesBookingdateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Customer Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.cust_name.toLowerCase().includes(customerName.toLowerCase());
      // sales Executive Name Filter:-
      const salesExecutiveNameFilterPassed =
        !salesExecutiveName ||
        item.username.toLowerCase().includes(salesExecutiveName.toLowerCase());
      // GST FIlter:-
      console.log(gstNonGstData, "HI>>>>");
      const gstFilterPassed =
        !gstNonGstData ||
        (gstNonGstData === "GST" && item.gst_status === "1") ||
        (gstNonGstData === "Non GST" && item.gst_status === "0");

      //  Campaign Amount Filter
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
      //  Balance Amount Filter
      const balanceAmountFilterPassed = () => {
        const balanceAmount = parseFloat(balanceAmountField);
        const balance = +item.campaign_amount - item.total_paid_amount;
        switch (balanceAmountFilter) {
          case "greaterThan":
            return +balance > balanceAmount;
          case "lessThan":
            return +balance < balanceAmount;
          case "equalTo":
            return +balance === balanceAmount;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        customerNameFilterPassed &&
        salesExecutiveNameFilterPassed &&
        salesBookingdateFilterPassed &&
        gstFilterPassed &&
        campaignAmountFilterPassed() &&
        balanceAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setCustomerName("");
    setSalesExecutiveName("");
    setCampaignAmountFilter("");
    setCampaignAmountField("");
    setBalanceAmountFilter("");
    setBalanceAmountField("");
    setGstNonGstData("");
  };

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
    // Calculate the total amount for vendors with the same name
    // const totalAmount = sameNameVendors.reduce(
    //   (total, item) => total + item.request_amount,
    //   0
    // );

    // Set the selected vendor data including the vendor name, data, and total amount
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
      (item) => item.username === salesEName
    );

    setSameSalesExecutiveData(sameNameSalesExecutive);
  };

  const handleCloseSameSalesExecutive = () => {
    setSameSalesExecutiveDialog(false);
  };

  const calculateRequestedAmountTotal = () => {
    let totalAmount = 0;
    filterData.forEach((customer) => {
      totalAmount += parseFloat(
        customer.campaign_amount - customer.total_paid_amount
      );
    });
    return totalAmount;
  };

  // Call the function to get the total sum of requested amount
  const balanceAmountTotal = calculateRequestedAmountTotal();
  // All counts :-
  const approvedCount = datas.filter(
    (item) => item.finance_refund_status === 1
  ).length;
  const rejectedCount = datas.filter(
    (item) => item.finance_refund_status === 2
  ).length;

  const handleUpdatePartyName = () => {
    const formData = new FormData();

    formData.append("sale_booking_id", saleBookingIdforPartyName);
    formData.append("party_mnj_name", partyName);

    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales_edit_invoice_detail",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((res) => {
        console.log(res, "RESPONSE<<>>>>>>>>>>>");
        getData();
        handleCloseEditPartyField();
      });
  };
  const handleUpdateInvoiceNumber = () => {
    const formData = new FormData();

    formData.append("sale_booking_id", saleBookingIdForInvoiceNo);
    formData.append("invoice_mnj_number", invoiceNumber);

    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales_edit_invoice_detail",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((res) => {
        console.log(res, "RESPONSE<<>>>>>>>>>>>");
        getData();
        handleCloseEditInvoiceField();
      });
  };

  const handleOpenEditPartyField = (id) => {
    setPartyNameDialog(true);
    setSaleBookingIdforPartyName(id);
  };

  const handleCloseEditPartyField = () => {
    setPartyNameDialog(false);
  };
  const handleOpenEditInvoiceField = (id) => {
    setInvoiceNumberDialog(true);
    setSaleBookingIdForInvoiceNo(id);
  };

  const handleCloseEditInvoiceField = () => {
    setInvoiceNumberDialog(false);
  };

  // TDS DIALOG FUNCTION:-
  const handleOpenTDSFields = (row) => {
    // setTDSFieldSaleBookingId(row.sale_booking_id);
    setCloseDialog(true);
    // setBalAmount(row.campaign_amount - row.total_paid_amount);
  };

  const handleCloseTDSFields = () => {
    setCloseDialog(false);
  };

  // const handleTdsValue = (inputValue) => {
  //   // if (parseFloat(inputValue) > parseFloat(balAmount)) {
  //   //   // If TDS value is greater, don't update state
  //   //   toastError("TDS shouldn't be more than Balance Amount");
  //   //   // You can also display a message to the user indicating the issue
  //   //   return;
  //   // }
  //   // If TDS value is valid, update state
  //   setTDSValue(inputValue);
  // };
  const handleSaveTDS = async () => {
    // if (parseFloat(TDSValue) > parseFloat(balAmount)) {
    //   toastError("TDS shouldn't be more than Balance Amount");
    //   // You can also display a message to the user indicating the issue
    //   return;
    // } else {

    const formData = new FormData();

    formData.append("sale_booking_id", tdsFieldSaleBookingId);
    formData.append("tds_status", 1);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales_tds_detail_update",
        formData
      )
      .then((res) => {
        handleCloseTDSFields();
        toastAlert(`TDS Done Successfully`);
        getData();
        handleCloseImageModal();
      });
    // }
  };
  // ==========================

  const sameSalesExecutivecolumn = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = sameSalesExecutiveData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      fieldName: "sale_booking_date",
      field: "Aging",
      renderCell: (params) => {
        const date = new Date(params.row.sale_booking_date);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + " Days";
      },
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "username",
      headerName: "Sales Executive Name",
      renderCell: (params) => params.row.username,
    },
    {
      field: "sale_booking_date",
      headerName: "Sale Booking Date",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.sale_booking_date)}
        </div>
      ),
    },
    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      selector: (params) => params.row.campaign_amount,
    },
    {
      field: "total_paid_amount",
      headerName: "Paid Amount",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {params.row.total_paid_amount ? params.row.total_paid_amount : 0}
        </div>
      ),
    },
    {
      field: "Balance Amount",
      renderCell: (params) =>
        params.row.campaign_amount - params.row.total_paid_amount,
    },
    {
      headerName: "Status",
      cell: (params) => (
        <button
          className="btn btn-sm btn-outline-info"
          onClick={() => handleImageClick(params.row)}
        >
          Balance Update
        </button>
      ),
    },
  ];
  const uniqueSalesExecutivecolumn = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = uniqueSalesExecutiveData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "sale_booking_date",
      headerName: "Aging",
      renderCell: (params) => {
        const date = new Date(params.row.sale_booking_date);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + " Days";
      },
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "username",
      headerName: "Sales Executive Name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameSalesExecutive(params.row.username)}
        >
          {params.row.username}
        </div>
      ),
    },
    {
      field: "sale_booking_date",
      headerName: "Sale Booking Date",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.sale_booking_date)}
        </div>
      ),
    },
    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      renderCell: ({ row }) => {
        const sameCustomers = filterData.filter(
          (e) => e.cust_name === row.cust_name
        );

        const reduceAmt = sameCustomers.reduce(
          (a, b) => a + 1 * b.campaign_amount,
          0
        );

        return <p> &#8377; {reduceAmt}</p>;
      },
    },
    {
      field: "total_paid_amount",
      headerName: "Paid Amount",
      renderCell: ({ row }) => {
        const sameCustomers = filterData.filter(
          (e) => e.cust_name === row.cust_name
        );

        const reduceAmt = sameCustomers.reduce(
          (a, b) => a + 1 * (b.total_paid_amount ? b.total_paid_amount : 0),
          0
        );

        return <p> &#8377; {reduceAmt}</p>;
      },
    },
    {
      field: "Balance Amount",
      renderCell: ({ row }) => {
        const sameCustomers = filterData.filter(
          (e) => e.cust_name === row.cust_name
        );

        const reduceAmt = sameCustomers.reduce(
          (a, b) => a + 1 * (b.total_paid_amount ? b.total_paid_amount : 0),
          0
        );

        return <p> &#8377; {reduceAmt}</p>;
      },
    },
    {
      field: "invoice",
      headerName: "Screen Shot",
      renderCell: (params) =>
        params.row.invoice ? (
          params.row.invoice.includes(".pdf") ? (
            <img
              src={pdfImg}
              onClick={() => {
                setViewImgSrc(
                  params.row.invoice
                    ? `https://sales.creativefuel.io/${params.row.invoice}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
            />
          ) : (
            <img
              onClick={() => {
                setViewImgSrc(
                  params.row.invoice
                    ? `https://sales.creativefuel.io/${params.row.invoice}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
              src={`https://sales.creativefuel.io/${params.row.invoice}`}
              alt="payment screenshot"
              style={{ width: "50px", height: "50px" }}
            />
          )
        ) : (
          "No Image"
        ),
    },
    {
      headerName: "Status",
      cell: (params) => (
        <button
          className="btn btn-sm btn-outline-info"
          onClick={() => handleImageClick(params.row)}
        >
          Balance Update
        </button>
      ),
    },
  ];
  const sameCustomercolumn = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = sameCustomerData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "sale_booking_date",
      headerName: "Aging",
      renderCell: (params) => {
        const date = new Date(params.row.sale_booking_date);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + " Days";
      },
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "username",
      headerName: "Sales Executive Name",
      renderCell: (params) => params.row.username,
    },
    {
      field: "sale_booking_date",
      headerName: "Sale Booking Date",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.sale_booking_date)}
        </div>
      ),
    },
    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      selector: (params) => params.row.campaign_amount,
    },
    {
      field: "total_paid_amount",
      headerName: "Paid Amount",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {params.row.total_paid_amount ? params.row.total_paid_amount : 0}
        </div>
      ),
    },
    {
      field: "Balance Amount",
      renderCell: (params) =>
        params.row.campaign_amount - params.row.total_paid_amount,
    },
    {
      headerName: "Status",
      cell: (params) => (
        <button
          className="btn btn-sm btn-outline-info"
          onClick={() => handleImageClick(params.row)}
        >
          Balance Update
        </button>
      ),
    },
  ];
  const uniqueCustomercolumn = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = uniqueCustomerData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "sale_booking_date",
      headerName: "Aging",
      renderCell: (params) => {
        const date = new Date(params.row.sale_booking_date);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + " Days";
      },
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
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
      field: "username",
      headerName: "Sales Executive Name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameCustomer(params.row.username)}
        >
          {params.row.username}
        </div>
      ),
    },
    {
      field: "sale_booking_date",
      headerName: "Sale Booking Date",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.sale_booking_date)}
        </div>
      ),
    },
    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      renderCell: ({ row }) => {
        const sameCustomers = filterData.filter(
          (e) => e.cust_name === row.cust_name
        );

        const reduceAmt = sameCustomers.reduce(
          (a, b) => a + 1 * b.campaign_amount,
          0
        );

        return <p> &#8377; {reduceAmt}</p>;
      },
    },
    {
      field: "total_paid_amount",
      headerName: "Paid Amount",
      renderCell: ({ row }) => {
        const sameCustomers = filterData.filter(
          (e) => e.cust_name === row.cust_name
        );

        const reduceAmt = sameCustomers.reduce(
          (a, b) => a + 1 * (b.total_paid_amount ? b.total_paid_amount : 0),
          0
        );

        return <p> &#8377; {reduceAmt}</p>;
      },
      // <div style={{ whiteSpace: "normal" }}>
      //   {params.row.total_paid_amount ? params.row.total_paid_amount : 0}
      // </div>
    },
    {
      field: "Balance Amount",
      renderCell: ({ row }) => {
        const sameCustomers = filterData.filter(
          (e) => e.cust_name === row.cust_name
        );

        const reduceAmt = sameCustomers.reduce(
          (a, b) => a + 1 * (b.total_paid_amount ? b.total_paid_amount : 0),
          0
        );

        return <p> &#8377; {reduceAmt}</p>;
      },
    },
    {
      field: "invoice",
      headerName: "Screen Shot",
      renderCell: (params) =>
        params.row.invoice ? (
          params.row.invoice.includes(".pdf") ? (
            <img
              src={pdfImg}
              onClick={() => {
                setViewImgSrc(
                  params.row.invoice
                    ? `https://sales.creativefuel.io/${params.row.invoice}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
            />
          ) : (
            <img
              onClick={() => {
                setViewImgSrc(
                  params.row.invoice
                    ? `https://sales.creativefuel.io/${params.row.invoice}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
              src={`https://sales.creativefuel.io/${params.row.invoice}`}
              alt="payment screenshot"
              style={{ width: "50px", height: "50px" }}
            />
          )
        ) : (
          "No Image"
        ),
    },
    {
      headerName: "Status",
      cell: (params) => (
        <button
          className="btn btn-sm btn-outline-info"
          onClick={() => handleImageClick(params.row)}
        >
          Balance Update
        </button>
      ),
    },
  ];
  const columns = [
    {
      width: 70,
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...datas].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "aging",
      headerName: "Aging",
      renderCell: (params) => {
        const date = new Date(params.row.sale_booking_date);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + " Days";
      },
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      width: 320,
      renderCell: (params) => params.row.cust_name,
      sortable: true,
    },
    {
      field: "username",
      headerName: "Sales Executive Name",
      width: 190,
      fieldName: "username",
      renderCell: (params) => params.row.username,
    },
    {
      field: "party_mnj_name",
      headerName: "Party Name",
      width: 210,
      renderCell: (params) => (
        <div className="flexCenter colGap8">
          {params.row.invoice && params.row.invoice !== "" ? (
            <button
              className="btn tableIconBtn btn_sm "
              onClick={() =>
                handleOpenEditPartyField(params.row.sale_booking_id)
              }
            >
              <EditIcon />
            </button>
          ) : (
            ""
          )}
          {/* <button
            className="btn tableIconBtn btn_sm "
            onClick={() => handleOpenEditPartyField(params.row.sale_booking_id)}
          >
            <EditIcon />
          </button> */}
          {params.row.party_mnj_name}
        </div>
      ),
    },
    {
      field: "invoice_mnj_number",
      headerName: "Invoice Number",
      width: 190,
      renderCell: (params) => (
        <div className="flexCenter colGap8">
          {params.row.invoice && params.row.invoice !== "" ? (
            <button
              className="btn tableIconBtn btn_sm "
              onClick={() =>
                handleOpenEditInvoiceField(params.row.sale_booking_id)
              }
            >
              <EditIcon />
            </button>
          ) : (
            ""
          )}
          {params.row.invoice_mnj_number}
        </div>
      ),
    },
    {
      field: "invoice_mnj_date",
      headerName: "Invoice Date",
      renderCell: (params) =>
        params.row.invoice_mnj_date != "0000-00-00" ? (
          <div style={{ whiteSpace: "normal" }}>
            {moment(params.row.invoice_mnj_date).format("DD/MM/YYYY")}
          </div>
        ) : (
          ""
        ),
      width: 190,
    },
    {
      field: "expected_payment_receive_date",
      headerName: "Expected Payment Receive Date",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.expected_payment_receive_date)}
        </div>
      ),
    },
    {
      field: "sale_booking_date",
      headerName: "Sale Booking Date",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.sale_booking_date)}
        </div>
      ),
    },
    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      width: 190,
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "total_paid_amount",
      headerName: "Paid Amount",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {params.row.total_paid_amount ? params.row.total_paid_amount : 0}
        </div>
      ),
    },
    {
      field: "Balance Amount",
      headerName: "Balance Amount",
      renderCell: (params) =>
        params.row.campaign_amount - params.row.total_paid_amount,
    },
    {
      field: "base_amount",
      headerName: "Base Amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "gst_status",
      headerName: "GST",
      renderCell: (params) =>
        params.row.gst_status === "1" ? "GST" : "Non GST",
    },
    {
      field: "invoice",
      headerName: "Screen Shot",
      width: 190,
      renderCell: (params) =>
        params.row.invoice ? (
          params.row.invoice.includes(".pdf") ? (
            <img
              src={pdfImg}
              onClick={() => {
                setViewImgSrc(
                  params.row.invoice
                    ? `https://sales.creativefuel.io/${params.row.invoice}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
              style={{ width: "40px", height: "40px" }}
            />
          ) : (
            <img
              onClick={() => {
                setViewImgSrc(
                  params.row.invoice
                    ? `https://sales.creativefuel.io/${params.row.invoice}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
              src={`https://sales.creativefuel.io/${params.row.invoice}`}
              alt="payment screenshot"
              style={{ width: "50px", height: "50px" }}
            />
          )
        ) : (
          "No Image"
        ),
    },
    // {
    //   field: "Action",
    //   headerName: "Action",
    //   width: 190,
    //   renderCell: (params) => (
    //     <button
    //       className="btn btn-sm btn-outline-info"
    //       onClick={() => handleOpenTDSFields(params.row)}
    //     >
    //       TDS
    //     </button>
    //   ),
    // },
    {
      field: "status",
      headerName: "Status",
      width: 190,
      renderCell: (params) => (
        <button
          className="btn cmnbtn btn_sm btn-outline-primary"
          onClick={() => handleImageClick(params.row)}
        >
          Balance Update
        </button>
      ),
    },
  ];

  const filterDataBasedOnSelection = (apiData) => {
    console.log(apiData, "api data >>");
    const now = moment();
    switch (dateFilter) {
      case "thisWeek":
        const startOfWeek = now.clone().startOf("week");
        const endOfWeek = now.clone().endOf("week");
        return apiData.filter((item) =>
          moment(item.expected_payment_receive_date).isBetween(
            startOfWeek,
            endOfWeek,
            "day",
            "[]"
          )
        );
      case "nextMonth":
        const startOfNextMonth = now.clone().add(1, "months").startOf("month");
        const endOfNextMonth = now.clone().add(1, "months").endOf("month");
        return apiData.filter((item) =>
          moment(item.expected_payment_receive_date).isBetween(
            startOfNextMonth,
            endOfNextMonth,
            "day",
            "[]"
          )
        );
      case "thisMonth":
        const startOfMonth = now.clone().startOf("month");
        const endOfMonth = now.clone().endOf("month");
        return apiData.filter((item) =>
          moment(item.expected_payment_receive_date).isBetween(
            startOfMonth,
            endOfMonth,
            "day",
            "[]"
          )
        );
      default:
        return apiData; // No filter applied
    }
  };

  const calculatePaidPercentage = () => {
    if (paidAmount !== 0) {
      const percentage =
        ((+paidAmount + +paidAmountData) / +campaignAmountData) * 100;
      // const roundedPercentage = percentage * 10;
      setPaidPercentage(percentage.toFixed(1));
    } else {
      setPaidPercentage(0);
    }
  };

  const calculateTDSPercentage = () => {
    const remainingData = balAmount - paidAmount;
    if (remainingData === 0) {
      setTDSPercentage(0);
    } else {
      const percentage = (baseAmount / remainingData) * 100;
      const roundedPercentage = parseFloat(percentage.toFixed(2)); // Round to two decimal places and convert to float
      const formattedPercentage = (roundedPercentage / 100).toFixed(2); // Divide by 100 and round to two decimal places
      setTDSPercentage(formattedPercentage);
    }
  };

  // gst counts :-
  const gstCounts = filterData.filter((count) => count.gst_status === "1");
  // Total gst - balance amounts
  const totalGstBalanceAmount = gstCounts?.reduce(
    (total, item) =>
      total + parseFloat(item?.campaign_amount - item?.total_paid_amount),
    0
  );
  // total gst - paid amounts
  const totalGstReceivedAmount = gstCounts?.reduce(
    (total, item) => total + parseFloat(item?.total_paid_amount),
    0
  );

  // non gst counts :-
  const nonGstCounts = filterData.filter((count) => count.gst_status === "0");
  // Total non gst - balance amounts
  const totalNonGstBalanceAmount = nonGstCounts?.reduce(
    (total, item) =>
      total + parseFloat(item?.campaign_amount - item?.total_paid_amount),
    0
  );
  // total non gst - paid amounts
  const totalNonGstReceivedAmount = nonGstCounts?.reduce(
    (total, item) => total + parseFloat(item?.total_paid_amount),
    0
  );

  const totalPA = () => {
    return +campaignAmountData - (+paidAmountData + paidAmount);
  };

  return (
    <div>
      <FormContainer
        mainTitle="Sale Booking - Outstanding Payment"
        link="/admin/balance-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        uniqueCustomerCount={uniqueCustomerCount}
        balanceAmountTotal={balanceAmountTotal}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        balancePaymentAdditionalTitles={true}
      />

      {/* Add Icon TDS */}
      <Dialog
        open={closeDialog}
        onClose={handleCloseTDSFields}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>TDS</DialogTitle>
        <IconButton
          aria-label="close"
          s
          onClick={handleCloseTDSFields}
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
          <div className="row">
            <div className="col-md-12 ">
              <div className="form-group">
                <label htmlFor="images">TDS Amount</label>
                <input
                  type="number"
                  className="form-control"
                  id="TDS Amount"
                  name="TDS Amount"
                  value={balAmount - paidAmount}
                  readOnly
                  // onChange={(e) => e.target.value}
                  required
                />
              </div>
            </div>
            <div className="col-md-12 ">
              <div className="form-group">
                <label htmlFor="images">TDS Percentage</label>
                <input
                  type="number"
                  className="form-control"
                  id="TDS Percentage"
                  name="TDS Percentage"
                  value={tdsPercentage}
                  readOnly
                  required
                />
              </div>
            </div>
          </div>
          <div className="pack w-100 mt-3 sb">
            <div></div>
            <div className="pack gap16">
              <Button variant="contained" onClick={handleSaveTDS}>
                YES
              </Button>
              <Button variant="contained" onClick={handleCloseTDSFields}>
                NO
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit Party Name Column field */}
      <Dialog
        open={partyNameDialog}
        onClose={handleCloseEditPartyField}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Edit Column</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseEditPartyField}
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
          <TextField
            id="outlined-basic"
            label="Party Name"
            variant="outlined"
            onChange={(e) => setPartyName(e.target.value)}
          />
          <Button variant="contained" onClick={handleUpdatePartyName}>
            Update
          </Button>
        </DialogContent>
      </Dialog>
      {/* Edit Invoice Number Column */}
      <Dialog
        open={invoiceNumberDialog}
        onClose={handleCloseEditInvoiceField}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Edit Column</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseEditInvoiceField}
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
          <TextField
            id="outlined-basic"
            label="Invoice Number"
            variant="outlined"
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          <Button variant="contained" onClick={handleUpdateInvoiceNumber}>
            Update
          </Button>
        </DialogContent>
      </Dialog>
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
          <DataGrid
            rows={sameSalesExecutiveData}
            columns={sameSalesExecutivecolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => sameSalesExecutiveData.indexOf(row)}
          />
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
          <DataGrid
            rows={uniqueSalesExecutiveData}
            columns={uniqueSalesExecutivecolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => uniqueSalesExecutiveData.indexOf(row)}
          />
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
        <DialogTitle>Same Vendors</DialogTitle>
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
          <DataGrid
            rows={sameCustomerData}
            columns={sameCustomercolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => sameCustomerData.indexOf(row)}
          />
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
          <DataGrid
            rows={uniqueCustomerData}
            columns={uniqueCustomercolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => uniqueCustomerData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>

      <div className="row">
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">
                Invoice Created
                <Link className="link-primary">
                  <span className="iconLink">
                    <i class="bi bi-arrow-up-right"></i>
                  </span>
                </Link>
              </h5>
            </div>
            <div className="card-body">
              <h5 className="mediumText">Balance Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹
                {/* {datas.length > 0
                  ? datas
                      .filter((item) => item.payment_approval_status == 0)
                      .reduce((total, currentItem) => {
                        return total + currentItem.payment_amount_show * 1;
                      }, 0)
                  : ""} */}
              </h4>
              <h5 className="mediumText">Total Due Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹
                {/* {datas.length > 0
                  ? datas
                      .filter((item) => item.payment_approval_status == 0)
                      .reduce((total, currentItem) => {
                        return total + currentItem.payment_amount_show * 1;
                      }, 0)
                  : ""} */}
              </h4>
              <h5 className="mediumText">Received Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹
                {/* {datas.length > 0
                  ? datas
                      .filter((item) => item.payment_approval_status == 0)
                      .reduce((total, currentItem) => {
                        return total + currentItem.payment_amount_show * 1;
                      }, 0)
                  : ""} */}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">
                Non Invoice Created
                <Link className="link-primary">
                  <span className="iconLink">
                    <i class="bi bi-arrow-up-right"></i>
                  </span>
                </Link>
              </h5>
            </div>
            <div className="card-body">
              <h5 className="mediumText">Balance Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹
                {/* {datas.length > 0
                  ? datas
                      .filter((item) => item.payment_approval_status == 0)
                      .reduce((total, currentItem) => {
                        return total + currentItem.payment_amount_show * 1;
                      }, 0)
                  : ""} */}
              </h4>
              <h5 className="mediumText">Total Due Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹
                {/* {datas.length > 0
                  ? datas
                      .filter((item) => item.payment_approval_status == 0)
                      .reduce((total, currentItem) => {
                        return total + currentItem.payment_amount_show * 1;
                      }, 0)
                  : ""} */}
              </h4>
              <h5 className="mediumText">Received Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹
                {/* {datas.length > 0
                  ? datas
                      .filter((item) => item.payment_approval_status == 0)
                      .reduce((total, currentItem) => {
                        return total + currentItem.payment_amount_show * 1;
                      }, 0)
                  : ""} */}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">
                GST
                <Link className="link-primary">
                  <span className="iconLink">
                    <i class="bi bi-arrow-up-right"></i>
                  </span>
                </Link>
              </h5>
            </div>
            <div className="card-body">
              <h5 className="mediumText">GST Count</h5>
              <h4 className="font-weight-bold mt8">{gstCounts?.length}</h4>
              <h5 className="mediumText">Total Balance Amount</h5>
              <h4 className="font-weight-bold mt8">
                {" "}
                ₹ {totalGstBalanceAmount}
              </h4>
              <h5 className="mediumText">Total Received Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹ {totalGstReceivedAmount}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">
                Non GST
                <Link className="link-primary">
                  <span className="iconLink">
                    <i class="bi bi-arrow-up-right"></i>
                  </span>
                </Link>
              </h5>
            </div>
            <div className="card-body">
              <h5 className="mediumText">Non GST Counts</h5>
              <h4 className="font-weight-bold mt8">₹{nonGstCounts?.length}</h4>
              <h5 className="mediumText"> Total Balance Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹{totalNonGstBalanceAmount}
              </h4>
              <h5 className="mediumText">Total Received Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹{totalNonGstReceivedAmount}
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Search by filter</h5>
              <div className="flexCenter colGap12">
                <div className="form-group flexCenter colGap8">
                  <label className="w-100 m0">Select Date Range:</label>
                  <select
                    className="form-control form_sm"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="thisWeek">This Week</option>
                    <option value="nextMonth">Next Month</option>
                    <option value="thisMonth">This Month</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
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
                          label="customer Name"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control",
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Sales Executive Name</label>
                    <Autocomplete
                      value={salesExecutiveName}
                      onChange={(event, newValue) =>
                        setSalesExecutiveName(newValue)
                      }
                      options={Array.from(
                        new Set(datas.map((option) => option.username))
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
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Campaign Amount</label>
                    <input
                      value={campaignAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setCampaignAmountField(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Balance Amount Filter</label>
                    <select
                      value={balanceAmountFilter}
                      className="form-control"
                      onChange={(e) => setBalanceAmountFilter(e.target.value)}
                    >
                      <option value="">Select Amount</option>
                      <option value="greaterThan">Greater Than</option>
                      <option value="lessThan">Less Than</option>
                      <option value="equalTo">Equal To</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Balance Amount</label>
                    <input
                      value={balanceAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setBalanceAmountField(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>GST</label>
                    <select
                      value={gstNonGstData}
                      className="form-control"
                      onChange={(e) => setGstNonGstData(e.target.value)}
                    >
                      <option value="">Select GST</option>
                      <option value="GST">GST</option>
                      <option value="Non GST">Non GST</option>
                    </select>
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
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card" style={{ height: "600px" }}>
            <div className="card-body thm_table">
              <DataGrid
                rows={filterData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                getRowId={(row) => filterData.indexOf(row)}
              />

              {/* Dialog box for balance payment update*/}
              <BootstrapDialog
                onClose={handleCloseImageModal}
                aria-labelledby="customized-dialog-title"
                open={ImageModalOpen}
              >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                  Payment Update
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseImageModal}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                  <div className="row">
                    <div className="col-md-12 ">
                      <form onSubmit={handleSubmit}>
                        <div className="form-group col-12"></div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            className="form-control mt-3"
                            label="Payment Date"
                            value={paymentDate}
                            format="DD/MM/YYYY"
                            onChange={setPaymentDate}
                          />
                        </LocalizationProvider>
                        <div className="form-group mt-3">
                          <label htmlFor="images">Balance Amount</label>
                          <input
                            type="number"
                            className="form-control"
                            id="balance Amount"
                            name="balance Amount"
                            value={balAmount}
                            readOnly
                            // onChange={(e) => setBalAmount(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group mt-3">
                          <label htmlFor="images">Paid Amount</label>
                          <input
                            type="number"
                            className="form-control"
                            id="paid Amount"
                            name="paid Amount"
                            value={paidAmountData}
                            readOnly
                            // onChange={(e) => setBalAmount(e.target.value)}
                            required
                          />
                        </div>
                        <TextField
                          variant="outlined"
                          label="Paid Amount *"
                          className="form-control "
                          value={paidAmount}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            if (!isNaN(inputValue) && inputValue !== "") {
                              const parsedValue = parseFloat(inputValue);
                              if (parsedValue <= balAmount) {
                                setPaidAmount(parsedValue);
                                setShowField(true);

                                setPaymentType(
                                  parsedValue === balAmount
                                    ? { label: "Full", value: "full" }
                                    : { label: "Partial", value: "partial" }
                                );
                              } else {
                                toastError(
                                  "Paid amount should be less than or equal to the balance amount"
                                );
                              }
                            } else {
                              toastError("Please enter a valid numeric value");
                              setPaidAmount("");
                              setShowField(false);
                            }
                          }}
                        />

                        {showField && paidAmount > 0 && (
                          <div className="row">
                            <div className="col-md-12 ">
                              <div className="form-group">
                                <label htmlFor="images">Remaining Amount</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="remaining amount"
                                  name="remaining amount"
                                  value={balAmount - paidAmount}
                                  readOnly
                                  // onChange={(e) => e.target.value}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-12 ">
                              <div className="form-group">
                                <label htmlFor="images">
                                  Paid Percentage %
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="paid %"
                                  name="paid %"
                                  value={paidPercentage}
                                  readOnly
                                  // onChange={(e) => setBalAmount(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="form-group mt-3">
                          <label htmlFor="images">
                            Payment Reference Number:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="images"
                            name="images"
                            value={paymentRefNo}
                            onChange={(e) => setPaymentRefNo(e.target.value)}
                          />
                        </div>
                        <Autocomplete
                          className="my-2 mt-3"
                          id="combo-box-demo"
                          // value={row.statusDropdown}
                          options={dropdownData.map((item) => ({
                            label: item.title,
                            value: item.id,
                          }))}
                          // style={{ width: 180, zIndex: 1, position: "relative" }}
                          onChange={(e, value) => {
                            setPaymentDetails(value);
                          }}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Payment Details *"
                              variant="outlined"
                            />
                          )}
                        />
                        <div className="form-group">
                          <label htmlFor="images">
                            Payment Reference Image:
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            id="images"
                            name="images"
                            accept="image/*"
                            onChange={(e) =>
                              setPaymentRefImg(e.target.files[0])
                            }
                          />
                        </div>
                        <Autocomplete
                          className="my-2 mt-3"
                          id="combo-box-demo"
                          value={paymentType}
                          // disabled
                          readOnly
                          options={[
                            { label: "Full", value: "full" },
                            { label: "Partial", value: "partial" },
                          ]}
                          // style={{ width: 328, zIndex: 1, position: "relative" }}
                          onChange={(e, value) => {
                            setPaymentType(value);
                          }}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Status"
                              variant="outlined"
                            />
                          )}
                        />
                      </form>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={
                      paidAmount === 0 ||
                      paidAmount === "" ||
                      paymentDetails === ""
                    }
                    variant="contained"
                    autoFocus
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                  {paidPercentage === 90 || paidPercentage >= 90 ? (
                    <Button
                      variant="contained"
                      autoFocus
                      onClick={handleOpenTDSFields}
                    >
                      Close
                    </Button>
                  ) : (
                    ""
                  )}
                </DialogActions>
              </BootstrapDialog>
              {viewImgDialog && (
                <ImageView
                  viewImgSrc={viewImgSrc}
                  setViewImgDialog={setViewImgDialog}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalancePaymentList;
