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
import Tab from "../../Tab/Tab";
import PendingApprovalUpdate from "./PendingApprovalsUpdate";

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
  const [uniqueNonInvoiceCustomerCount, setUniqueNonInvoiceCustomerCount] =
    useState(0);
  const [uniqueNonInvoiceCustomerData, setUniqueNonInvoiceCustomerData] =
    useState(0);
  const [
    uniqueNonInvoiceSalesExecutiveCount,
    setUniqueNonInvoiceSalesExecutiveCount,
  ] = useState(0);
  const [
    uniqueNonInvoiceSalesExecutiveData,
    setUniqueNonInvoiceSalesExecutiveData,
  ] = useState(0);
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
  const [discardSaleBookingId, setDiscardSaleBookingId] = useState("");
  const [paidPercentage, setPaidPercentage] = useState("");
  const [tdsPercentage, setTDSPercentage] = useState("");
  const [showField, setShowField] = useState(false);
  const [baseAmount, setBaseAmount] = useState();
  const [campaignAmountData, setCampaignAmountData] = useState();
  const [paidAmountData, setPaidAmountData] = useState();
  const [adjustmentAmount, setAdjustmentAmount] = useState();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [salesExecutiveList, setSalesExecutiveList] = useState([]);
  const [nonGstStatus, setNonGstStatus] = useState("");
  const [reason, setReason] = useState("");
  const [discardDialog, setDiscardDialog] = useState(false);
  const [invoiceDateDialog, setInvoiceDateDialog] = useState(false);
  const [invoiceDateData, setInvoiceDate] = useState(dayjs(new Date()));

  const accordionButtons = ["Invoice Created", "Non Invoice Created"];

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  useEffect(() => {
    calculatePaidPercentage();
    calculateTDSPercentage();
  }, [balAmount, paidAmount, baseAmount]);

  const handleDiscard = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("sale_booking_id", discardSaleBookingId);
    formData.append("balance_payment_discard", 1);
    formData.append("reason", reason);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales_balance_payment_discard",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        toastAlert("Data Discard Successfully");
        handleDiscardCloseDialog();
        // getData();
      });
  };

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
    formData.append("payment_date", moment(paymentDate).format("YYYY/MM/DD"));
    formData.append("incentive_adjustment_amount", adjustmentAmount);

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

  const handleDiscardOpenDialog = (e, rowData) => {
    e.preventDefault();
    setDiscardSaleBookingId(rowData.sale_booking_id);
    setDiscardDialog(true);
  };
  const handleDiscardCloseDialog = (e) => {
    // e.preventDefault();
    setDiscardDialog(false);
  };

  const getData = () => {
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

        let sno = res?.data?.body?.map((e, i) => {
          return { ...e, sno: i++ };
        });
        console.log(sno, "sno");
        const invcData = res.data.body.filter((d) => d.invoice !== "");
        const NonInvoiceData = res.data.body.filter((d) => d.invoice === "");
        // For Invoice
        const uniqueCustomers = new Set(invcData.map((item) => item.cust_name));
        setUniqueCustomerCount(uniqueCustomers.size);
        const uniqueCustomerData = Array.from(uniqueCustomers).map(
          (customerName) => {
            return invcData.find((item) => item.cust_name === customerName);
          }
        );
        setUniqueCustomerData(uniqueCustomerData);

        // For Unique Sales Executive
        const uniqueSalesEx = new Set(invcData.map((item) => item.username));
        setUniqueSalesExecutiveCount(uniqueSalesEx.size);
        const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
          return invcData.find((item) => item.username === salesEName);
        });
        setUniqueSalesExecutiveData(uniqueSEData);

        // For Non-Invoice Created :-
        const uniqueNonInvoiceCustomers = new Set(
          NonInvoiceData.map((item) => item.cust_name)
        );
        setUniqueNonInvoiceCustomerCount(uniqueNonInvoiceCustomers.size);
        const uniqueNonInvoiceCustomerData = Array.from(
          uniqueNonInvoiceCustomers
        ).map((customerName) =>
          NonInvoiceData.find((item) => item.cust_name === customerName)
        );
        setUniqueNonInvoiceCustomerData(uniqueNonInvoiceCustomerData);

        const uniqueNonInvoiceSalesExecutives = new Set(
          NonInvoiceData.map((item) => item.username)
        );
        setUniqueNonInvoiceSalesExecutiveCount(
          uniqueNonInvoiceSalesExecutives.size
        );
        const uniqueNonInvoiceSEData = Array.from(
          uniqueNonInvoiceSalesExecutives
        ).map((salesEName) =>
          NonInvoiceData.find((item) => item.username === salesEName)
        );
        setUniqueNonInvoiceSalesExecutiveData(uniqueNonInvoiceSEData);

        const dateFilterData = filterDataBasedOnSelection(res?.data?.body);
        setFilterData(dateFilterData);
      });
  };

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

  const handleImageClick = (e, row) => {
    e.preventDefault();
    setBalAmount(row.campaign_amount - row.total_paid_amount);
    setBaseAmount(row.base_amount);
    setPaidAmountData(row.total_paid_amount);
    setCampaignAmountData(row.campaign_amount);
    setTDSFieldSaleBookingId(row.sale_booking_id);
    setNonGstStatus(row.gst_status);
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

    const invcData = filterData.filter((d) => d.invoice !== "");
    const NonInvoiceData = filterData.filter((d) => d.invoice === "");
    // For Invoice
    const uniqueCustomers = new Set(invcData.map((item) => item.cust_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers).map(
      (customerName) => {
        return invcData.find((item) => item.cust_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);

    // For Unique Sales Executive
    const uniqueSalesEx = new Set(invcData.map((item) => item.username));
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
      return invcData.find((item) => item.username === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);

    // For Non-Invoice Created :-
    const uniqueNonInvoiceCustomers = new Set(
      NonInvoiceData.map((item) => item.cust_name)
    );
    setUniqueNonInvoiceCustomerCount(uniqueNonInvoiceCustomers.size);
    const uniqueNonInvoiceCustomerData = Array.from(
      uniqueNonInvoiceCustomers
    ).map((customerName) =>
      NonInvoiceData.find((item) => item.cust_name === customerName)
    );
    setUniqueNonInvoiceCustomerData(uniqueNonInvoiceCustomerData);

    const uniqueNonInvoiceSalesExecutives = new Set(
      NonInvoiceData.map((item) => item.username)
    );
    setUniqueNonInvoiceSalesExecutiveCount(
      uniqueNonInvoiceSalesExecutives.size
    );
    const uniqueNonInvoiceSEData = Array.from(
      uniqueNonInvoiceSalesExecutives
    ).map((salesEName) =>
      NonInvoiceData.find((item) => item.username === salesEName)
    );
    setUniqueNonInvoiceSalesExecutiveData(uniqueNonInvoiceSEData);
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

    const invcData = datas.filter((d) => d.invoice !== "");
    const NonInvoiceData = datas.filter((d) => d.invoice === "");
    // For Invoice
    const uniqueCustomers = new Set(invcData.map((item) => item.cust_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers).map(
      (customerName) => {
        return invcData.find((item) => item.cust_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);

    // For Unique Sales Executive
    const uniqueSalesEx = new Set(invcData.map((item) => item.username));
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
      return invcData.find((item) => item.username === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);

    // For Non-Invoice Created :-
    const uniqueNonInvoiceCustomers = new Set(
      NonInvoiceData.map((item) => item.cust_name)
    );
    setUniqueNonInvoiceCustomerCount(uniqueNonInvoiceCustomers.size);
    const uniqueNonInvoiceCustomerData = Array.from(
      uniqueNonInvoiceCustomers
    ).map((customerName) =>
      NonInvoiceData.find((item) => item.cust_name === customerName)
    );
    setUniqueNonInvoiceCustomerData(uniqueNonInvoiceCustomerData);

    const uniqueNonInvoiceSalesExecutives = new Set(
      NonInvoiceData.map((item) => item.username)
    );
    setUniqueNonInvoiceSalesExecutiveCount(
      uniqueNonInvoiceSalesExecutives.size
    );
    const uniqueNonInvoiceSEData = Array.from(
      uniqueNonInvoiceSalesExecutives
    ).map((salesEName) =>
      NonInvoiceData.find((item) => item.username === salesEName)
    );
    setUniqueNonInvoiceSalesExecutiveData(uniqueNonInvoiceSEData);
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
    const invc = filterData?.filter((d) => d.invoice !== "");
    let totalAmount = 0;
    invc.forEach((customer) => {
      totalAmount += parseFloat(
        customer.campaign_amount - customer.total_paid_amount
      );
    });

    return totalAmount;
  };

  const calculateNonRequestedAmountTotal = () => {
    const nonInvc = filterData?.filter((d) => d.invoice === "");
    let totalAmount = 0;
    nonInvc.forEach((customer) => {
      totalAmount += parseFloat(
        customer.campaign_amount - customer.total_paid_amount
      );
    });

    return totalAmount;
  };

  // Call the function to get the total sum of requested amount
  const balanceAmountTotal = calculateRequestedAmountTotal();
  const nonInvcbalanceAmountTotal = calculateNonRequestedAmountTotal();
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

  const handleUpdateInvoiceDate = () => {
    const formData = new FormData();

    formData.append("sale_booking_id", saleBookingIdForInvoiceNo);
    formData.append("invoice_mnj_number", invoiceNumber);
    formData.append(
      "invoice_mnj_date",
      moment(invoiceDateData).format("YYYY/MM/DD")
    );

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
        handleCloseEditDateField();
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

  const handleOpenEditDateField = (id) => {
    setInvoiceDateDialog(true);
    setSaleBookingIdForInvoiceNo(id);
  };

  const handleCloseEditDateField = () => {
    setInvoiceDateDialog(false);
  };

  // TDS DIALOG FUNCTION:-
  const handleOpenTDSFields = (row) => {
    if (!paymentDetails) {
      toastError("Please Fill Payment Details");
    } else {
      setCloseDialog(true);
    }
    // setTDSFieldSaleBookingId(row.sale_booking_id);
    // setBalAmount(row.campaign_amount - row.total_paid_amount);
  };

  const handleCloseTDSFields = () => {
    setCloseDialog(false);
  };

  const handleSaveTDS = async (e) => {
    // if (parseFloat(TDSValue) > parseFloat(balAmount)) {
    //   toastError("TDS shouldn't be more than Balance Amount");
    //   // You can also display a message to the user indicating the issue
    //   return;
    // } else {

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
    formData.append("payment_date", paymentDate);
    formData.append("incentive_adjustment_amount", adjustmentAmount);

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
        const formData = new FormData();
        formData.append("sale_booking_id", tdsFieldSaleBookingId);
        formData.append("tds_status", 1);
        formData.append("tds_amount", balAmount - paidAmount);
        formData.append("tds_percent", tdsPercentage);
        axios
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
        const rowIndex =
          activeAccordionIndex == 0
            ? sameSalesExecutiveData
                .filter((d) => d.invoice_mnj_number !== "")
                .indexOf(params.row)
            : activeAccordionIndex == 1
            ? sameSalesExecutiveData
                .filter((d) => d.invoice_mnj_number === "")
                .indexOf(params.row)
            : "";

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
        const rowIndex =
          activeAccordionIndex == 0
            ? uniqueSalesExecutiveData
                .filter((d) => d.invoice_mnj_number !== "")
                .indexOf(params.row)
            : activeAccordionIndex == 1
            ? uniqueSalesExecutiveData
                .filter((d) => d.invoice_mnj_number === "")
                .indexOf(params.row)
            : "";

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
        const rowIndex =
          activeAccordionIndex == 0
            ? sameCustomerData
                .filter((d) => d.invoice_mnj_number !== "")
                .indexOf(params.row)
            : activeAccordionIndex == 1
            ? sameCustomerData
                .filter((d) => d.invoice_mnj_number === "")
                .indexOf(params.row)
            : "";

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
        const rowIndex =
          activeAccordionIndex == 0
            ? uniqueCustomerData
                .filter((d) => d.invoice_mnj_number !== "")
                .indexOf(params.row)
            : activeAccordionIndex == 1
            ? uniqueCustomerData
                .filter((d) => d.invoice_mnj_number === "")
                .indexOf(params.row)
            : "";

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
      field: "sno",
      headerName: "S.No",
      renderCell: (params) => {
        const invcForCreated = filterData.filter(
          (count) => count.invoice !== ""
        );
        const invcForNonCreated = filterData.filter(
          (count) => count.invoice === ""
        );
        const rowIndex =
          activeAccordionIndex == 0
            ? invcForCreated.indexOf(params.row)
            : activeAccordionIndex == 1
            ? invcForNonCreated.indexOf(params.row)
            : "";

        return <div>{rowIndex + 1}</div>;

        // return <div>{params.row.sno}</div>;
      },
      sortable: true,
    },
    {
      field: "sale_booking_id",
      headerName: "Booking Id",
      renderCell: (params) => <div>{params.row.sale_booking_id}</div>,
    },
    {
      field: "aging",
      headerName: "Aging",
      renderCell: (params) => <div>{params.row.aging} days</div>,
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
          <div style={{ whiteSpace: "normal" }} className="flexCenter colGap8">
            {params.row.invoice && params.row.invoice !== "" ? (
              <button
                className="btn tableIconBtn btn_sm "
                onClick={() =>
                  handleOpenEditDateField(params.row.sale_booking_id)
                }
              >
                <EditIcon />
              </button>
            ) : (
              ""
            )}

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
          onClick={(e) => handleImageClick(e, params.row)}
        >
          Balance Update
        </button>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      width: 190,
      renderCell: (params) => (
        <div className="flex-row">
          {params.row.gst_status === "0" ? (
            <button
              variant="contained"
              autoFocus
              className="icon-1"
              title="Discard"
              onClick={(e) => handleDiscardOpenDialog(e, params.row)}
            >
              <i className="bi bi-trash"></i>
            </button>
          ) : (
            ""
          )}
          <Link
            to={`/admin/finance-transaction-list/${params.row.sale_booking_id}`}
            className="link-primary"
          >
            {params.row.total_paid_amount > 0 ? (
              <button className="icon-1" title="Transaction History">
                <i className="bi bi-file-earmark-text-fill"></i>
              </button>
            ) : (
              ""
            )}
          </Link>
        </div>
      ),
    },
  ];

  // const handleRowChange = function (num) {
  //   if (num == 0) {
  //     let data = filterData.filter((invc) => invc.invoice !== "");
  //     console.log(
  //       data.map((e, i) => ({ ...e, sno: i++ })),
  //       "manoj"
  //     );
  //     return data.map((e, i) => ({ ...e, sno: i + 1 }));
  //   }
  // };

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
    console.log(remainingData, "RD------------");
    if (remainingData === 0) {
      setTDSPercentage(0);
    } else {
      const percentage = (remainingData / baseAmount) * 100;
      const roundedPercentage = parseFloat(percentage.toFixed(2));
      setTDSPercentage(roundedPercentage);
    }
  };

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  useEffect(() => {
    if (activeAccordionIndex === 0) {
      const filteredData = datas?.filter((d) => d?.invoice !== "");
      const uniqueCustomersNames = [
        ...new Set(filteredData?.map((d) => d?.cust_name)),
      ];
      const uniqueSalesExeNames = [
        ...new Set(filteredData?.map((d) => d?.username)),
      ];
      setCustomerList(uniqueCustomersNames);
      setSalesExecutiveList(uniqueSalesExeNames);
    } else if (activeAccordionIndex === 1) {
      const filteredData = datas?.filter((d) => d?.invoice === "");
      const uniqueCustomersNames = [
        ...new Set(filteredData?.map((d) => d?.cust_name)),
      ];
      const uniqueSalesExeNames = [
        ...new Set(filteredData?.map((d) => d?.username)),
      ];
      setCustomerList(uniqueCustomersNames);
      setSalesExecutiveList(uniqueSalesExeNames);
    }
  }, [activeAccordionIndex]);

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

  console.log(nonGstCounts, "nongstCOUNT>>>");
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

  // invoice counts :-
  const invoiceCounts = filterData?.filter(
    (count) => count.invoice_mnj_number !== ""
  );

  const totalInvoiceBalanceAmount = invoiceCounts?.reduce(
    (total, item) =>
      total + parseFloat(item?.campaign_amount - item?.total_paid_amount),
    0
  );
  // total gst - paid amounts
  const totalInvoiceReceivedAmount = invoiceCounts?.reduce(
    (total, item) => total + parseFloat(item?.total_paid_amount),
    0
  );

  // Non invoice counts :-
  const nonInvoiceCounts = filterData.filter(
    (count) => count.invoice_mnj_number === ""
  );

  // Total gst - balance amounts
  const totalNonInvoiceBalanceAmount = nonInvoiceCounts?.reduce(
    (total, item) =>
      total + parseFloat(item?.campaign_amount - item?.total_paid_amount),
    0
  );
  // total gst - paid amounts
  const totalNonInvoiceReceivedAmount = nonInvoiceCounts?.reduce(
    (total, item) => total + parseFloat(item?.total_paid_amount),
    0
  );

  const totalPA = () => {
    return +campaignAmountData - (+paidAmountData + paidAmount);
  };
  console.log(filterData, "filterData >>>");

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
        uniqueNonInvoiceCustomerCount={uniqueNonInvoiceCustomerCount}
        uniqueNonInvoiceSalesExecutiveCount={
          uniqueNonInvoiceSalesExecutiveCount
        }
        accIndex={activeAccordionIndex}
        balanceAmountTotal={balanceAmountTotal}
        nonInvcbalanceAmountTotal={nonInvcbalanceAmountTotal}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        balancePaymentAdditionalTitles={true}
      />

      <Button variant="contained" className="mb-4">
        <Link to="/admin/finance-pendingapproveupdate">Pending Approval</Link>
      </Button>

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
              <Button variant="contained" onClick={(e) => handleSaveTDS(e)}>
                YES
              </Button>
              <Button variant="contained" onClick={handleCloseTDSFields}>
                NO
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog For Discard */}
      <Dialog
        open={discardDialog}
        onClose={handleDiscardCloseDialog}
        fullWidth={true}
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>TDS</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleDiscardCloseDialog}
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
            multiline
            label="Reason for Discard"
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
          <div className="pack w-100 mt-3 sb">
            <div></div>
            <div className="pack gap16">
              <Button variant="contained" onClick={(e) => handleDiscard(e)}>
                Submit
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
      {/* Edit Invoice Date Column */}
      <Dialog
        open={invoiceDateDialog}
        onClose={handleCloseEditDateField}
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
          onClick={handleCloseEditDateField}
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
          {/* <TextField
            id="outlined-basic"
            label="Invoice Number"
            variant="outlined"
            onChange={(e) => setInvoiceDate(e.target.value)}
          /> */}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="form-control mt-3"
              label="Payment Date"
              value={invoiceDateData}
              format="DD/MM/YYYY"
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            className="mt-4"
            onClick={handleUpdateInvoiceDate}
          >
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
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">
                Invoice Created
              </h5>
            </div>
            <div className="card-body flex-row sb">
              <div>
                <h5 className="mediumText">Invoice Count</h5>
                <h4
                  className="font-weight-bold mt8"
                  style={{ color: "var(--orange)" }}
                >
                  {invoiceCounts?.length}
                </h4>
              </div>
              <div>
                <h5 className="mediumText"> Total Balance Amount</h5>
                <h4
                  className="font-weight-bold mt8"
                  style={{ color: "var(--yellow)" }}
                >
                  ₹{totalInvoiceBalanceAmount}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">
                Non Invoice Created
              </h5>
            </div>
            <div className="card-body flex-row sb">
              <div>
                <h5 className="mediumText">Non Invoice Count</h5>
                <h4
                  className="font-weight-bold mt8"
                  style={{ color: "var(--orange)" }}
                >
                  {nonInvoiceCounts?.length}
                </h4>
              </div>
              <div>
                <h5 className="mediumText">Total Balance Amount</h5>
                <h4
                  className="font-weight-bold mt8"
                  style={{ color: "var(--yellow)" }}
                >
                  ₹{totalNonInvoiceBalanceAmount}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">GST</h5>
            </div>
            <div className="card-body flex-row sb">
              <div>
                <h5 className="mediumText">GST Count</h5>
                <h4
                  className="font-weight-bold mt8"
                  style={{ color: "var(--orange)" }}
                >
                  {gstCounts?.length}
                </h4>
              </div>

              <div>
                <h5 className="mediumText">Total Balance Amount</h5>
                <h4
                  className="font-weight-bold mt8"
                  style={{ color: "var(--yellow)" }}
                >
                  {" "}
                  ₹ {totalGstBalanceAmount}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">Non GST</h5>
            </div>
            <div className="card-body flex-row sb">
              <div>
                <h5 className="mediumText">Non GST Count</h5>
                <h4
                  className="font-weight-bold mt8"
                  style={{ color: "var(--orange)" }}
                >
                  {nonGstCounts?.length}
                </h4>
              </div>
              <div>
                <h5 className="mediumText"> Total Balance Amount</h5>
                <h4
                  className="font-weight-bold mt8"
                  style={{ color: "var(--bs-yellow)" }}
                >
                  ₹{totalNonGstBalanceAmount}
                </h4>
              </div>
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
                      options={customerList?.map((e) => {
                        return e;
                      })}
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
                      options={salesExecutiveList?.map((e) => {
                        return e;
                      })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sales Executive Name"
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
      <Tab
        tabName={accordionButtons}
        activeTabindex={activeAccordionIndex}
        onTabClick={handleAccordionButtonClick}
      />
      <div className="card">
        <div className="card-body thm_table fx-head">
          {activeAccordionIndex === 0 && (
            <DataGrid
              rows={filterData.filter((invc) => invc.invoice !== "")}
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
          )}
          {activeAccordionIndex === 1 && (
            <DataGrid
              rows={filterData.filter((invc) => invc.invoice === "")}
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
          )}
        </div>
      </div>

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
                        <label htmlFor="images">Paid Percentage %</label>
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
                  <label htmlFor="images">Adjustment Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    id="paid %"
                    name="paid %"
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="images">Payment Reference Number:</label>
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
                  <label htmlFor="images">Payment Reference Image:</label>
                  <input
                    type="file"
                    className="form-control"
                    id="images"
                    name="images"
                    accept="image/*"
                    onChange={(e) => setPaymentRefImg(e.target.files[0])}
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
                    <TextField {...params} label="Status" variant="outlined" />
                  )}
                />
              </form>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              paidAmount === 0 || paidAmount === "" || paymentDetails === ""
            }
            variant="contained"
            autoFocus
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </Button>
          {paidPercentage === 90 || paidPercentage >= 90 ? (
            <Button variant="contained" autoFocus onClick={handleOpenTDSFields}>
              Close
            </Button>
          ) : (
            ""
          )}
          {/* {nonGstStatus === "0" ? (
                    <Button
                      variant="contained"
                      autoFocus
                      onClick={(e) => handleDiscardSubmit(e)}
                    >
                      Discard
                    </Button>
                  ) : (
                    ""
                  )} */}
        </DialogActions>
      </BootstrapDialog>
      {viewImgDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setViewImgDialog}
        />
      )}
      {/* <div className="row">
        <div className="col-12">
          <div className="card" style={{ height: "600px" }}>
            <div className="card-body thm_table">
              <FormContainer
                submitButton={false}
                accordionButtons={accordionButtons}
                activeAccordionIndex={activeAccordionIndex}
                onAccordionButtonClick={handleAccordionButtonClick}
                mainTitleRequired={false}
              >
              </FormContainer>
             

            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default BalancePaymentList;
