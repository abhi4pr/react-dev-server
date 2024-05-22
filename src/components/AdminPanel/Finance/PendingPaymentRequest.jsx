import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import pdf from "./pdf-file.png";
import logo from "./../../../../public/logo.png";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  InputAdornment,
} from "@mui/material";
import DiscardConfirmation from "./DiscardConfirmation";
import jwtDecode from "jwt-decode";
import ImageView from "./ImageView";
import { useGlobalContext } from "../../../Context/Context";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { baseUrl } from "../../../utils/config";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import Badge from "@mui/material/Badge";
import ShowDataModal from "./ShowDataModal";
import Checkbox from "@mui/material/Checkbox";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import moment from "moment";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Overview from "./Overview";
import Loader from "./Loader/Loader";

export default function PendingPaymentRequest() {
  const whatsappApi = WhatsappAPI();

  const { toastAlert, toastError } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [payDialog, setPayDialog] = useState(false);
  const [rowData, setRowData] = useState({});
  const [paymentMode, setPaymentMode] = useState("Razor Pay");
  const [payRemark, setPayRemark] = useState("");
  const [payMentProof, setPayMentProof] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [partialVendorName, setPartialVendorName] = useState("");
  const [showDisCardModal, setShowDiscardModal] = useState(false);
  const [paymentAmout, setPaymentAmount] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    dayjs(new Date()).add(5, "hours").add(30, "minutes").$d.toGMTString()
  );
  const [userName, setUserName] = useState("");
  const [uniqueVendorCount, setUniqueVendorCount] = useState(0);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [uniqueVenderDialog, setUniqueVenderDialog] = useState(false);
  const [uniqueVendorData, setUniqueVendorData] = useState([]);
  const [sameVendorDialog, setSameVendorDialog] = useState(false);
  const [sameVendorData, setSameVendorData] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [requestAmountFilter, setRequestAmountFilter] = useState("");
  const [requestedAmountField, setRequestedAmountField] = useState("");
  const [bankDetail, setBankDetail] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [reminderData, setReminderData] = useState([]);
  const [remainderDialog, setRemainderDialog] = useState(false);
  const [aknowledgementDialog, setAknowledgementDialog] = useState(false);
  const [nodeData, setNodeData] = useState([]);
  const [phpData, setPhpData] = useState([]);
  const [phpRemainderData, setPhpRemainderData] = useState([]);
  const [historyType, setHistoryType] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [TDSDeduction, setTDSDeduction] = useState(false);
  const [gstHold, setGstHold] = useState(false);
  const [GSTHoldAmount, setGSTHoldAmount] = useState(0);
  const [TDSPercentage, setTDSPercentage] = useState(1);
  const [TDSValue, setTDSValue] = useState(0);
  const [baseAmount, setBaseAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Fully Paid");
  const [bankDetailRowData, setBankDetailRowData] = useState([]);
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [nonInvoiceCount, setNonInvoiceCount] = useState(0);
  const [nonGstCount, setNonGstCount] = useState(0);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [vendorNameList, setVendorNameList] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustmentAmt, setAdjustmentAmt] = useState("");
  const [preview, setPreview] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [overviewDialog, setOverviewDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTDSMandatory, setIsTDSMandatory] = useState(false);
  const [isTDSDeducted, setIsTDSDeducted] = useState(false);
  const [netAmount, setNetAmount] = useState("");
  const [tdsDeductedCount, setTdsDeductedCount] = useState(0);
  const accordionButtons = ["All", "Partial", "Instant"];

  var handleAcknowledgeClick = () => {
    setAknowledgementDialog(true);
  };

  const getValidationCSSForRemainder = (params) => {
    const reminder = phpRemainderData.filter(
      (item) => item.request_id == params.row.request_id
    );
    return reminder.length > 2 ? "bg-danger" : "";
  };

  const remainderDialogColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = reminderData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "request_date",
      headerName: "Requested Date",
      width: 150,
      renderCell: (params) => {
        return convertDateToDDMMYYYY(params.row.request_date);
      },
    },
    {
      field: "remind_remark",

      headerName: "Remark",
      width: 150,
      renderCell: (params) => {
        return params.row.remark_audit;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleAcknowledgeClick(params.row)}
            >
              Acknowledge
            </button>
          </div>
        );
      },
    },
  ];

  const callApi = () => {
    //Reminder API
    let remindData = "";
    axios
      .get(
        "https://purchase.creativefuel.io//webservices/RestController.php?view=getpaymentrequestremind"
      )
      .then((res) => {
        setPhpRemainderData(res.data.body);
        remindData = res.data.body;
      });

    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const x = res.data.modifiedData;
      setNodeData(x);
      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          let y = res.data.body.filter((item) => {
            return !x.some((item2) => item.request_id === item2.request_id);
          });
          setPhpData(y); // Setting the filtered data to state

          let c = res.data.body.filter((item) => {
            return remindData.some(
              (item2) => item.request_id === item2.request_id
            );
          });

          y.push(...c); // Merging the filtered items with items matching certain conditions

          let mergedArray = [...y, ...c];

          // Creating a set of unique request_ids from the merged data
          let t = new Set(mergedArray.map((item) => item.request_id));
          mergedArray = Array.from(t).map((request_id) => {
            return mergedArray.find((item) => item.request_id === request_id);
          });

          mergedArray = mergedArray.filter(
            (item) => item.status == 0 || item.status == 3 || item.status == 2
          );

          mergedArray = mergedArray.sort((a, b) => {
            console.log(a, "A--------------------", b, "b data");
            const aReminder = remindData.some(
              (remind) => remind.request_id === a.request_id
            );
            const bReminder = remindData.some(
              (remind) => remind.request_id === b.request_id
            );
            if (aReminder && !bReminder) return -1;
            if (!aReminder && bReminder) return 1;
            // Add aging sorting logic if required
            return new Date(a.request_date) - new Date(b.request_date);
            // return new Date(a.request_date) < new Date(b.request_date) ? -1 : 1;
          });

          setData(mergedArray);
          setFilterData(mergedArray);
          setPendingRequestCount(mergedArray.length);
          const uniqueVendors = new Set(
            mergedArray.map((item) => item.vendor_name)
          );
          setUniqueVendorCount(uniqueVendors.size);
          const uvData = [];
          uniqueVendors.forEach((vendorName) => {
            const vendorRows = mergedArray.filter(
              (item) => item.vendor_name === vendorName
            );
            uvData.push(vendorRows[0]);
          });
          setUniqueVendorData(uvData);

          const nonGstCount = mergedArray.filter((gst) => gst.gstHold === "0");
          setNonGstCount(nonGstCount.length);

          const withInvoiceImage = mergedArray.filter(
            (item) => item.invc_img && item.invc_img.length > 0
          );
          const withoutInvoiceImage = mergedArray.filter(
            (item) => !item.invc_img || item.invc_img.length === 0
          );
          setInvoiceCount(withInvoiceImage.length);
          setNonInvoiceCount(withoutInvoiceImage.length);

          // calculate Partial Data :-
          const dateFilterData = filterDataBasedOnSelection(mergedArray);
          setFilterData(dateFilterData);

          const tdsCount = mergedArray?.filter(
            (data) => data?.TDSDeduction === "1" || data?.TDSDeduction === null
          );
          console.log(tdsCount, "tdsCount--------------");
          setTdsDeductedCount(tdsCount);
        });
    });

    axios.get(`${baseUrl}` + `get_all_payment_mode`).then((res) => {
      setPaymentModeData(res?.data);
    });

    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      setUserName(res.data.user_name);
    });
  };
  const handleRemainderModal = (reaminderData) => {
    setReminderData(reaminderData);
    setRemainderDialog(true);
  };

  useEffect(() => {
    callApi();
  }, [dateFilter]);

  const convertDateToDDMMYYYY = (date) => {
    const date1 = new Date(date);
    const day = String(date1.getDate()).padStart(2, "0");
    const month = String(date1.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date1.getFullYear();

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    handleCalculatePaymentAmount();
  }, [TDSPercentage, GSTHoldAmount, TDSDeduction, gstHold]);

  const handleTDSDeduction = (e) => {
    setTDSDeduction(e.target.checked);
    setTDSPercentage(1);
  };

  const handleGstHold = (e) => {
    setGstHold(e.target.checked);
    setGSTHoldAmount(rowData.gst_amount);
  };

  const handleCalculatePaymentAmount = () => {
    if (gstHold && TDSDeduction) {
      setPaymentStatus("Fully Paid GST Hold and TDS Deduction");
    } else if (gstHold) {
      setPaymentStatus("Fully Paid GST Hold");
    } else if (TDSDeduction) {
      setPaymentStatus("Fully Paid TDS Deduction");
    } else {
      setPaymentStatus("Fully Paid");
    }

    let paymentAmount = rowData.balance_amount;
    let baseamount = baseAmount;
    let tdsvalue = 0;

    if (TDSDeduction) {
      tdsvalue = (baseamount * TDSPercentage) / 100;
      paymentAmount = paymentAmount - tdsvalue;
    }
    if (gstHold) {
      paymentAmount = paymentAmount - GSTHoldAmount;
    }
    console.log(tdsvalue, "------------------------");
    // tdsvalue = Math.round(tdsvalue);
    setTDSValue(tdsvalue);
    setPaymentAmount(paymentAmount);
    setNetAmount(paymentAmount);
  };

  const handleGSTHoldInputChange = (e) => {
    if (e.target.value > rowData.gst_amount) {
      toastError("GST Hold Amount can't be greater than GST Amount");
    } else {
      setGSTHoldAmount(e.target.value);
    }
  };

  GridToolbar.defaultProps = {
    filterRowsButtonText: "Filter",
    filterGridToolbarButton: "Filter",
  };

  function calculateHours(date1, date2) {
    const oneHour = 60 * 60 * 1000; // minutes * seconds * milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    const diffHours = Math.round(Math.abs((firstDate - secondDate) / oneHour));

    return diffHours;
  }

  const totalPendingAmount = filterData?.reduce(
    (total, item) => total + parseFloat(item?.request_amount),
    0
  );

  const totalBalanceAmount = filterData?.reduce(
    (total, item) => total + parseFloat(item?.balance_amount),
    0
  );
  const handlePayVendorClick = (e) => {
    e.preventDefault();
    // displayRazorpay(paymentAmout);
    // return;
    const formData = new FormData();
    formData.append("request_id", rowData.request_id);
    formData.append("vendor_id", rowData.vendor_id);
    formData.append("request_by", rowData.request_by);
    formData.append("request_amount", rowData.request_amount);
    formData.append("priority", rowData.priority);
    formData.append("status", 1); //status will be Change Soon
    formData.append("evidence", payMentProof);
    formData.append("payment_mode", paymentMode);
    formData.append("payment_amount", paymentAmout);
    formData.append("payment_by", userID);
    formData.append("remark_finance", payRemark);
    formData.append("invc_no", rowData.invc_no);
    formData.append("invc_Date", rowData.invc_Date);
    formData.append("invc_remark", rowData.invc_remark);
    formData.append("remark_audit", rowData.remark_audit);
    formData.append("outstandings", rowData.outstandings);
    formData.append("vendor_name", rowData.vendor_name);
    formData.append("name", rowData.name);
    formData.append("request_date", rowData.request_date);
    formData.append("payment_date", paymentDate);
    formData.append("gst_hold", rowData.gst_amount);
    formData.append("gst_hold_amount", GSTHoldAmount);
    formData.append("tds_deduction", TDSValue);
    formData.append("gst_Hold_Bool", gstHold);
    formData.append("tds_Deduction_Bool", TDSDeduction);

    axios
      .post(baseUrl + "phpvendorpaymentrequest", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        const phpFormData = new FormData();
        phpFormData.append("request_id", rowData.request_id);
        phpFormData.append("payment_amount", paymentAmout);
        phpFormData.append(
          "payment_date",
          new Date(paymentDate)?.toISOString().slice(0, 19).replace("T", " ")
        );
        phpFormData.append("payment_by", userName);
        phpFormData.append("evidence", payMentProof);
        phpFormData.append("finance_remark", payRemark);
        phpFormData.append("status", 1);
        phpFormData.append("payment_mode", paymentMode);
        phpFormData.append("gst_hold", rowData.gst_amount);
        phpFormData.append("adjust_amt", TDSValue ? adjustAmount : 0);
        phpFormData.append("gst_hold_amount", GSTHoldAmount);
        phpFormData.append("request_amount", rowData.request_amount);
        phpFormData.append("tds_deduction", TDSValue);
        phpFormData.append("gst_Hold_Bool", gstHold ? 1 : 0);
        phpFormData.append("tds_Deduction_Bool", TDSDeduction ? 1 : 0);
        axios
          .post(
            "https://purchase.creativefuel.io/webservices/RestController.php?view=updatePaymentrequestNew",
            phpFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            toastAlert("Payment Done Successfully");

            whatsappApi.callWhatsAPI(
              "Extend Date by User",
              JSON.stringify(9109266387),
              rowData.vendor_name,
              [paymentAmout, rowData.vendor_name, rowData.mob1]
            );
          });

        setPaymentMode("Razor Pay");
        setPayRemark("");
        setPayMentProof("");
        handleClosePayDialog();
        setPaymentAmount("");
        setNetAmount("");
        callApi();
      });
  };
  //req_id , paymeent_amou ,paydate , payby, screenshot , finance remark

  const handleDiscardClick = (e, row) => {
    e.preventDefault();
    setRowData(row);
    setShowDiscardModal(true);
    // axios.delete(`${baseUrl}` + `delete_demo/${row._id}`).then(() => {
    //   callApi();
    // });
  };

  const handleDateFilter = () => {
    const filterData = data.filter((item) => {
      const date = new Date(item.request_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);

      // Date Range Filter
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);

      // Vender Name Filter
      const vendorNameFilterPassed =
        !vendorName ||
        item.vendor_name.toLowerCase().includes(vendorName.toLowerCase());

      // Priority Filter
      const priorityFilterPassed =
        !priorityFilter || item.priority === priorityFilter;

      // Search Query Filter
      const searchFilterPassed =
        !search ||
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(search.toLowerCase())
        );

      // Requested Amount Filter
      const requestedAmountFilterPassed = () => {
        const numericRequestedAmount = parseFloat(requestedAmountField);
        switch (requestAmountFilter) {
          case "greaterThan":
            return +item.request_amount > numericRequestedAmount;
          case "lessThan":
            return +item.request_amount < numericRequestedAmount;
          case "equalTo":
            return +item.request_amount === numericRequestedAmount;
          default:
            return true;
        }
      };

      const allFiltersPassed =
        dateFilterPassed &&
        vendorNameFilterPassed &&
        priorityFilterPassed &&
        searchFilterPassed &&
        requestedAmountFilterPassed();

      return allFiltersPassed;
    });

    setFilterData(filterData);
    setPendingRequestCount(filterData.length);

    // uniqye vendor count and data
    const uniqueVendors = new Set(filterData.map((item) => item.vendor_name));
    setUniqueVendorCount(uniqueVendors.size);
    const uvData = [];
    uniqueVendors.forEach((vendorName) => {
      const vendorRows = filterData.filter(
        (item) => item.vendor_name === vendorName
      );
      uvData.push(vendorRows[0]);
    });
    setUniqueVendorData(uvData);

    // counts data

    const nonGstCount = filterData.filter((gst) => gst.gstHold === "0");
    setNonGstCount(nonGstCount.length);

    const withInvoiceImage = filterData.filter(
      (item) => item.invc_img && item.invc_img.length > 0
    );
    const withoutInvoiceImage = filterData.filter(
      (item) => !item.invc_img || item.invc_img.length === 0
    );
    setInvoiceCount(withInvoiceImage.length);
    setNonInvoiceCount(withoutInvoiceImage.length);
  };

  const handleClearDateFilter = () => {
    setFilterData(data);
    setFromDate("");
    setToDate("");
    setVendorName("");
    setPriorityFilter("");
    setRequestAmountFilter("");
    setRequestedAmountField("");
    setPendingRequestCount(data.length);
    // unique vendor data
    const uniqueVendors = new Set(data.map((item) => item.vendor_name));
    setUniqueVendorCount(uniqueVendors.size);
    const uvData = [];
    uniqueVendors.forEach((vendorName) => {
      const vendorRows = data.filter((item) => item.vendor_name === vendorName);
      uvData.push(vendorRows[0]);
    });
    setUniqueVendorData(uvData);

    // count data

    const nonGstCount = data.filter((gst) => gst.gstHold === "0");
    setNonGstCount(nonGstCount.length);

    const withInvoiceImage = data.filter(
      (item) => item.invc_img && item.invc_img.length > 0
    );
    const withoutInvoiceImage = data.filter(
      (item) => !item.invc_img || item.invc_img.length === 0
    );
    setInvoiceCount(withInvoiceImage.length);
    setNonInvoiceCount(withoutInvoiceImage.length);
  };
  const handleClosePayDialog = () => {
    setPayDialog(false);
    setPaymentMode("Razor Pay");
    setPayRemark("");
    setPayMentProof("");
    setPaymentAmount("");
    setNetAmount("");
    setTDSDeduction(false);
    setGstHold(false);
  };

  const handlePayClick = (e, row) => {
    console.log(row, "handle pay row data ------------------");
    e.preventDefault();

    let x = phpRemainderData.filter(
      (item) => item?.request_id == row?.request_id
    );
    if (x.length > 0) {
      toastError(
        `You can't pay this request as it has been reminded ${x?.length} times`
      );
      return;
    }
    const enrichedRow = {
      ...row,
      totalFY: calculateTotalFY(row),
    };

    console.log(enrichedRow, "enriched row---------------");
    setRowData(enrichedRow);

    // setRowData(row);
    setPaymentAmount(row?.balance_amount);
    setNetAmount(row?.balance_amount);

    setBaseAmount(
      row?.base_amount != 0 ? row?.base_amount : row?.request_amount
    );
    setLoading(true);
    setPayDialog(true);
  };

  useEffect(() => {
    if (loading == false) return;
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading]);

  const handleOpenUniqueVendorClick = () => {
    setUniqueVenderDialog(true);
  };

  const handleCloseUniqueVendor = () => {
    setUniqueVenderDialog(false);
  };
  // overview functions :----
  const handleOpenOverview = () => {
    setOverviewDialog(true);
  };

  const handleCloseOverview = () => {
    setOverviewDialog(false);
  };
  // --------------------------------------------
  const handleOpenSameVender = (vendorName) => {
    setSameVendorDialog(true);

    const sameNameVendors = data.filter(
      (item) => item.vendor_name === vendorName
    );
    setSameVendorData(sameNameVendors);
  };

  const handleCloseSameVender = () => {
    setSameVendorDialog(false);
  };
  // Bank Details:-

  const handleOpenBankDetail = (row) => {
    let x = [];
    x.push(row);

    setBankDetailRowData(x);
    setBankDetail(true);
  };
  const handleCloseBankDetail = () => {
    setBankDetail(false);
  };

  // Payment history detail:-

  const handleOpenPaymentHistory = (row, type) => {
    setHistoryType(type);
    setRowData(row);
    setPaymentHistory(true);
    const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
    const currentYear = new Date().getFullYear();

    // const startDate = new Date(`04/01/${new Date().getFullYear() -MonthisGraterThenMarch? 0:1}`);
    // const endDate = new Date(`03/31/${new Date().getFullYear()+MonthisGraterThenMarch? 1:0}`);
    const startDate = new Date(
      `04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1}`
    );
    const endDate = new Date(
      `03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear}`
    );

    const dataFY = nodeData.filter((e) => {
      const paymentDate = new Date(e.request_date);
      return (
        paymentDate >= startDate &&
        paymentDate <= endDate &&
        e.vendor_name === row.vendor_name &&
        e.status != 0 &&
        e.status != 2
      );
    });

    const dataTP = nodeData.filter((e) => {
      return (
        e.vendor_name === row.vendor_name && e.status != 0 && e.status != 2
      );
    });
    setHistoryData(type == "FY" ? dataFY : dataTP);
  };
  const handleClosePaymentHistory = () => {
    setPaymentHistory(false);
  };

  // ==============================================================
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay(paymentAmout) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    var options = {
      key: "rzp_test_SIbrnELO2NP7rA", // Enter the Key ID generated from the Dashboard
      amount: paymentAmout * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Your Business Name",
      description: "Payment to " + "Harshit",
      image: { logo },
      handler: function (response) {
        alert(
          "Payment Successful! Payment ID: " + response.razorpay_payment_id
        );
        // Here you can handle the payment success event, e.g., updating the database, sending notifications, etc.
      },
      // default_payment_method:"cash",
      callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9000090000",
        method: "netbanking",
      },
      notes: {
        vendor_name: "Harshit",
        vendor_account_number: "12345678901",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const paymentDetailColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = historyData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "request_amount",
      headerName: "Requested Amount",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.request_amount}</p>;
      },
    },
    {
      field: "outstandings",
      headerName: "OutStanding ",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.outstandings}</p>;
      },
    },
    // {
    //   field: "invc_img",
    //   headerName: "Invoice Image",
    //   renderCell: (params) => {
    //     if (params.row.invc_img) {
    //       // Extract file extension and check if it's a PDF
    //       const fileExtension = params.row.invc_img
    //         .split(".")
    //         .pop()
    //         .toLowerCase();
    //       const isPdf = fileExtension === "pdf";

    //       const imgUrl = `https://purchase.creativefuel.io/${params.row.invc_img}`;

    //       return isPdf ? (
    //         <img
    //           onClick={() => {
    //             setOpenImageDialog(true);
    //             setViewImgSrc(imgUrl);
    //           }}
    //           src={pdf}
    //           style={{ width: "40px", height: "40px" }}
    //           title="PDF Preview"
    //         />
    //       ) : (
    //         <img
    //           onClick={() => {
    //             setOpenImageDialog(true);
    //             setViewImgSrc(imgUrl);
    //           }}
    //           src={imgUrl}
    //           alt="Invoice"
    //           style={{ width: "100px", height: "100px" }}
    //         />
    //       );
    //     } else {
    //       return null;
    //     }
    //   },
    // },
    {
      field: "request_date",
      headerName: "Requested Date",
      width: 150,
      renderCell: (params) => {
        return convertDateToDDMMYYYY(params.row.request_date);
      },
    },
    {
      field: "name",
      headerName: "Requested By",
      width: 150,
      renderCell: (params) => {
        return params.row.name;
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      // width: "auto",
      width: 250,
      renderCell: (params) => {
        return params.row.vendor_name;
      },
    },
    {
      field: "remark_audit",
      headerName: "Remark",
      width: 150,
      renderCell: (params) => {
        return params.row.remark_audit;
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 150,
      renderCell: (params) => {
        return params.row.priority;
      },
    },
    {
      field: "aging",
      headerName: "Aging",
      width: 150,
      renderCell: (params) => {
        return (
          <p>
            {params.row.aging}
            Days
          </p>
        );
      },
    },
    {
      field: "Status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const matchingItems = nodeData.filter(
          (item) => item.request_id == params.row.request_id
        );
        if (matchingItems.length > 0) {
          return matchingItems.map((item, index) => (
            <p key={index}>
              {item.status == 0
                ? "Pending"
                : item.status == 2
                ? "Discarded"
                : "Paid"}
            </p>
          ));
        } else {
          return "Pending"; // Default value if no matching item is found
        }
      },
    },
  ];
  // same Vender columns:-
  const sameVenderColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex =
          activeAccordionIndex == 0
            ? sameVendorData.indexOf(params.row)
            : activeAccordionIndex == 1
            ? sameVendorData.filter((d) => d.status === "3").indexOf(params.row)
            : sameVendorData
                .filter((d) => d.status === "0")
                .indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      // width: "auto",
      width: 250,
      renderCell: (params) => {
        return params.row.vendorName;
      },
    },
    {
      field: "request_amount",
      headerName: "Requested Amount",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.request_amount}</p>;
      },
    },
    {
      field: "balance_amount",
      headerName: "Balance Amount",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.balance_amount}</p>;
      },
    },
    {
      field: "Action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        return (
          <div className="flexCenter colGap8">
            <button
              className="btn cmnbtn btn_sm btn-success"
              onClick={(e) => handlePayClick(e, params.row)}
            >
              Pay
            </button>
            <button
              className="btn cmnbtn btn_sm btn-danger"
              onClick={(e) => handleDiscardClick(e, params.row)}
            >
              Discard
            </button>
          </div>
        );
      },
    },
  ];
  // unique vender column :-
  const uniqueVendorColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex =
          activeAccordionIndex == 0
            ? uniqueVendorData.indexOf(params.row)
            : activeAccordionIndex == 1
            ? uniqueVendorData
                .filter((d) => d.status === "3")
                .indexOf(params.row)
            : uniqueVendorData
                .filter((d) => d.status === "0")
                .indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      width: 250,
      renderCell: (params) => {
        return (
          <a
            href="#"
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => handleOpenSameVender(params.row.vendor_name)}
          >
            {params.row.vendor_name}
          </a>
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      width: 150,
      renderCell: ({ row }) => {
        const sameVendor = filterData.filter(
          (e) => e.vendor_name === row.vendor_name
        );

        const reduceAmt = sameVendor.reduce(
          (a, b) => a + 1 * b.request_amount,
          0
        );

        return <p> &#8377; {reduceAmt}</p>;
      },
    },
    {
      field: "balance_amount",
      headerName: "Balance Amount",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.balance_amount}</p>;
      },
    },
    {
      field: "outstandings",
      headerName: "OutStanding ",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.outstandings}</p>;
      },
    },
  ];

  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Pending";
      case "1":
        return "Paid";
      case "2":
        return "Discard";
      case "3":
        return "Partial";
      default:
        return "";
    }
  };

  const calculateTotalFY = (data) => {
    const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
    const currentYear = new Date().getFullYear();
    const startDate = new Date(
      `04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1}`
    );
    const endDate = new Date(
      `03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear}`
    );

    const dataFY = nodeData.filter((e) => {
      const paymentDate = new Date(e?.request_date);
      return (
        paymentDate >= startDate &&
        paymentDate <= endDate &&
        e?.vendor_name === data?.vendor_name &&
        e.status !== 0 &&
        e.status !== 2 &&
        e.status !== 3
      );
    });

    const totalFY = dataFY.reduce(
      (acc, item) => acc + parseFloat(item.payment_amount),
      0
    );

    return totalFY;
  };
  console.log(filterData, "filter Data------");
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 70,
      editable: false,
      valueGetter: (params) => filterData.indexOf(params.row) + 1,
      renderCell: (params) => {
        // const rowIndex = filterData.indexOf(params.row);
        const rowIndex =
          activeAccordionIndex == 0
            ? filterData.indexOf(params.row)
            : activeAccordionIndex == 1
            ? filterData.filter((d) => d.status === "3").indexOf(params.row)
            : filterData.filter((d) => d.status === "0").indexOf(params.row);

        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "invc_img",
      headerName: "Invoice Image",
      renderCell: (params) => {
        if (!params.row.invc_img) {
          return "No Image";
        }
        // Extract file extension and check if it's a PDF
        const fileExtension = params.row.invc_img
          .split(".")
          .pop()
          .toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${params.row.invc_img}`;

        return isPdf ? (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={pdf}
            style={{ width: "40px", height: "40px" }}
            title="PDF Preview"
          />
        ) : (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={imgUrl}
            alt="Invoice"
            style={{ width: "100px", height: "100px" }}
          />
        );
      },
      width: 130,
    },
    {
      field: "invc_no",
      headerName: "Invoice Number",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.invc_no}</div>;
      },
    },
    {
      field: "invc_Date",
      headerName: "Invoice Date",
      width: 150,
      renderCell: (params) => {
        new Date(params.row.invc_Date).toLocaleDateString("en-IN") +
          " " +
          new Date(params.row.invc_Date).toLocaleTimeString("en-IN");
      },
    },

    {
      field: "request_date",
      headerName: "Requested Date",
      width: 150,
      renderCell: (params) => {
        new Date(params.row.request_date).toLocaleDateString("en-IN") +
          " " +
          new Date(params.row.request_date).toLocaleTimeString("en-IN");
      },
    },
    {
      field: "name",
      headerName: "Requested By",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <span>{params.row.name}</span> &nbsp;{" "}
          </>
        );
      },
    },
    {
      field: "Reminder",
      headerName: "Reminder",
      width: 150,
      valueGetter: (params) => {
        const reminder = phpRemainderData.filter(
          (item) => item.request_id == params.row.request_id
        );
        return reminder.length;
      },
      renderCell: (params) => {
        const reminder = phpRemainderData.filter(
          (item) => item.request_id == params.row.request_id
        );

        return (
          <>
            <span>
              {reminder.length > 0 ? (
                <Badge badgeContent={reminder.length} color="primary">
                  <NotificationsActiveTwoToneIcon
                    onClick={() => handleRemainderModal(reminder)}
                  />
                </Badge>
              ) : (
                0
              )}
            </span>
          </>
        );
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Hold for confirmation of sourabh sir */}
            <Button
              disabled={
                params.row.payment_details
                  ? !params.row.payment_details.length > 0
                  : true
              }
              onClick={() => handleOpenBankDetail(params.row)}
            >
              <AccountBalanceIcon style={{ fontSize: "25px" }} />
            </Button>
            <a
              style={{ cursor: "pointer", marginRight: "20px", color: "blue" }}
              onClick={() => handleOpenSameVender(params.row.vendor_name)}
            >
              {params.row.vendor_name}
            </a>
          </div>
        );
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
    },
    {
      field: "payment_cycle",
      headerName: "Payment Cycle",
      width: 150,
    },
    {
      field: "total_paid",
      headerName: "Total Paid",
      width: 150,
      valueGetter: (params) => {
        const totalPaid = nodeData
          .filter(
            (e) => e.vendor_name === params.row.vendor_name && e.status == 1
          )
          .reduce((acc, item) => acc + +item.payment_amount, 0);
        return totalPaid;
      },
      renderCell: (params) => {
        return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
          .length > 0 ? (
          <span className="row ml-2 ">
            <h5
              onClick={() => handleOpenPaymentHistory(params.row, "TP")}
              style={{ cursor: "pointer" }}
              className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
            >
              {/* Total Paid */}
              {nodeData
                .filter(
                  (e) =>
                    e.vendor_name === params.row.vendor_name && e.status == 1
                )
                .reduce((acc, item) => acc + +item.payment_amount, 0)}
            </h5>
          </span>
        ) : (
          <h5
            style={{ cursor: "pointer" }}
            className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      field: "F.Y",
      headerName: "F.Y",
      width: 150,
      valueGetter: (params) => {
        const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
        const currentYear = new Date().getFullYear();
        const startDate = new Date(
          `04/01/${
            isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
          }`
        );
        const endDate = new Date(
          `03/31/${
            isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
          }`
        );

        const dataFY = nodeData.filter((e) => {
          const paymentDate = new Date(e?.request_date);
          return (
            paymentDate >= startDate &&
            paymentDate <= endDate &&
            e?.vendor_name === params?.row?.vendor_name &&
            e.status !== 0 &&
            e.status !== 2 &&
            e.status !== 3
          );
        });

        const totalFY = dataFY.reduce(
          (acc, item) => acc + parseFloat(item.payment_amount),
          0
        );

        return totalFY;
      },
      renderCell: (params) => {
        const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
        const currentYear = new Date().getFullYear();
        const startDate = new Date(
          `04/01/${
            isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
          }`
        );
        const endDate = new Date(
          `03/31/${
            isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
          }`
        );
        const dataFY = nodeData.filter((e) => {
          const paymentDate = new Date(e.request_date);
          return (
            paymentDate >= startDate &&
            paymentDate <= endDate &&
            e.vendor_name === params.row.vendor_name &&
            e.status !== 0 &&
            e.status !== 2 &&
            e.status !== 3
          );
        });
        return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
          .length > 0 ? (
          <h5
            onClick={() => handleOpenPaymentHistory(params.row, "FY")}
            style={{ cursor: "pointer" }}
            className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
          >
            {/* Financial Year */}

            {dataFY.reduce(
              (acc, item) => acc + parseFloat(item.payment_amount),
              0
            )}
          </h5>
        ) : (
          <h5
            style={{ cursor: "pointer" }}
            className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      field: "Pan Img",
      headerName: "Pan Img",
      valueGetter: (params) =>
        params.row.pan_img.includes("uploads") ? params.row.pan_img : "NA",
      renderCell: (params) => {
        const ImgUrl = `https://purchase.creativefuel.io/${params.row.pan_img}`;
        return params.row.pan_img.includes("uploads") ? (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(ImgUrl);
            }}
            src={ImgUrl}
            alt="Pan"
            style={{ width: "40px", height: "40px" }}
          />
        ) : (
          "NA"
        );
      },
    },
    {
      field: "pan",
      headerName: "Pan",
      width: 150,
    },
    {
      field: "gst",
      headerName: "GST",
      width: 200,
    },
    {
      field: "remark_audit",
      headerName: "Remark",
      width: 150,
      renderCell: (params) => {
        return params.row.remark_audit;
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 150,
      renderCell: (params) => {
        return params.row.priority;
      },
    },
    {
      field: "request_amount",
      headerName: "Requested Amount",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.request_amount}</p>;
      },
    },
    {
      field: "paid_amount",
      headerName: "Paid Amount",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.paid_amount}</p>;
      },
    },
    {
      field: "balance_amount",
      headerName: "Balance Amount",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.balance_amount}</p>;
      },
    },
    {
      field: "base_amount",
      headerName: "Base Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.base_amount ? (
          <p> &#8377; {params.row.base_amount}</p>
        ) : (
          "NA"
        );
      },
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_amount ? (
          <p>&#8377; {params.row.gst_amount}</p>
        ) : (
          "NA"
        );
      },
    },
    {
      field: "outstandings",
      headerName: "OutStanding ",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.outstandings}</p>;
      },
    },
    {
      field: "TDSDeduction",
      headerName: "TDS Deducted ",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.TDSDeduction === "1" ? "Yes" : "No"}</p>;
      },
    },
    {
      field: "aging",
      headerName: "Aging",
      width: 150,
      // valueGetter: (params) => {
      //   const hours = calculateHours(params.row.request_date, new Date());
      //   const days = Math.round(hours / 24);
      //   // console.log(`Calculating aging for request_date ${params.row.request_date}: ${hours} hours, ${days} days`);
      //   return `${days} Days`;
      // },
      renderCell: (params) => (
        <p>
          {params.row.aging}
          Days
        </p>
      ),
    },
    // {
    //   field: "aging",
    //   headerName: "Aging",
    //   width: 150,

    //   renderCell: (params) => {
    //     // const paymentDate = nodeData.filter(
    //     //   (dateData) => dateData.request_id === params.row.request_id
    //     // );
    //     return (
    //       <p>
    //         {" "}
    //         {Math.round(
    //           (
    //             calculateHours(params.row.request_date, new Date()) / 24
    //           ).toFixed(1)
    //         )}
    //         Days
    //       </p>
    //     );
    //   },
    // },
    {
      field: "Status",
      headerName: "Status",
      width: 150,
      valueGetter: (params) => getStatusText(params.row.status),
      renderCell: (params) => (
        <div>
          {params.row.status === "0"
            ? "Pending"
            : params.row.status === "1"
            ? "Paid"
            : params.row.status === "2"
            ? "Discard"
            : params.row.status === "3"
            ? "Partial"
            : ""}
        </div>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        return (
          <div className="flexCenter colGap8">
            <button
              className="btn cmnbtn btn_sm btn-success"
              onClick={(e) => handlePayClick(e, params.row)}
            >
              Pay
            </button>
            <button
              className="btn cmnbtn btn_sm btn-danger"
              onClick={(e) => handleDiscardClick(e, params.row)}
            >
              Discard
            </button>
          </div>
        );
      },
    },
  ];
  const filterDataBasedOnSelection = (apiData) => {
    const now = moment();
    switch (dateFilter) {
      case "last7Days":
        return apiData.filter((item) =>
          moment(item.request_date).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "last30Days":
        return apiData.filter((item) =>
          moment(item.request_date).isBetween(
            now.clone().subtract(30, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "thisWeek":
        const startOfWeek = now.clone().startOf("week");
        const endOfWeek = now.clone().endOf("week");
        return apiData.filter((item) =>
          moment(item.request_date).isBetween(
            startOfWeek,
            endOfWeek,
            "day",
            "[]"
          )
        );
      case "lastWeek":
        const startOfLastWeek = now
          .clone()
          .subtract(1, "weeks")
          .startOf("week");
        const endOfLastWeek = now.clone().subtract(1, "weeks").endOf("week");
        return apiData.filter((item) =>
          moment(item.request_date).isBetween(
            startOfLastWeek,
            endOfLastWeek,
            "day",
            "[]"
          )
        );
      case "currentMonth":
        const startOfMonth = now.clone().startOf("month");
        const endOfMonth = now.clone().endOf("month");
        return apiData.filter((item) =>
          moment(item.request_date).isBetween(
            startOfMonth,
            endOfMonth,
            "day",
            "[]"
          )
        );
      case "nextMonth":
        const startOfNextMonth = now.clone().add(1, "months").startOf("month");
        const endOfNextMonth = now.clone().add(1, "months").endOf("month");
        return apiData.filter((item) =>
          moment(item.request_date).isBetween(
            startOfNextMonth,
            endOfNextMonth,
            "day",
            "[]"
          )
        );
      case "currentQuarter":
        const quarterStart = moment().startOf("quarter");
        const quarterEnd = moment().endOf("quarter");
        return apiData.filter((item) =>
          moment(item.request_date).isBetween(
            quarterStart,
            quarterEnd,
            "day",
            "[]"
          )
        );
      default:
        return apiData; // No filter applied
    }
  };

  const partialData = filterData?.filter((d) => d.status === "3");
  const instantData = filterData?.filter((d) => d.status === "0");

  const pendingPartialcount = partialData?.length;
  const pendingInstantcount = instantData?.length;
  // For partial tab :-
  const uniqueVendorPartialCount = new Set(
    partialData?.map((item) => item.vendor_name)
  );
  const pendingAmountPartial = partialData?.reduce(
    (total, item) => total + parseFloat(item.request_amount),
    0
  );
  const balanceAmountPartial = partialData?.reduce(
    (total, item) => total + parseFloat(item.balance_amount),
    0
  );
  const nonGstPartialCount = partialData?.filter((gst) => gst.gstHold === "0");

  const withInvcPartialImage = partialData?.filter(
    (item) => item.invc_img && item.invc_img.length > 0
  );

  const withoutInvcPartialImage = partialData?.filter(
    (item) => !item.invc_img || item.invc_img.length === 0
  );
  const partialTDSDeduction = partialData?.filter(
    (item) => item?.TDSDeduction === "1" || item?.TDSDeduction === null
  );
  // ===================================================================
  // For Instant tab :-
  const uniqueVendorsInstantCount = new Set(
    instantData?.map((item) => item.vendor_name)
  );
  const pendingAmountInstant = instantData?.reduce(
    (total, item) => total + parseFloat(item.request_amount),
    0
  );
  const balanceAmountInstant = instantData?.reduce(
    (total, item) => total + parseFloat(item.request_amount),
    0
  );
  const nonGstInstantCount = instantData?.filter((gst) => gst.gstHold === "0");

  const withInvcInstantImage = instantData?.filter(
    (item) => item.invc_img && item.invc_img.length > 0
  );
  const withoutInvcInstantImage = instantData?.filter(
    (item) => !item.invc_img || item.invc_img.length === 0
  );
  const instantTDSDeduction = instantData?.filter(
    (item) => item?.TDSDeduction === "1" || item?.TDSDeduction === null
  );
  // ===================================================================

  useEffect(() => {
    if (activeAccordionIndex === 0) {
      const uniqueVendorNames = [...new Set(data?.map((d) => d?.vendor_name))];

      setVendorNameList(uniqueVendorNames);
    } else if (activeAccordionIndex === 1) {
      const filteredData = data.filter((d) => d.status === "3");
      const uniqueVendorNames = [
        ...new Set(filteredData.map((d) => d?.vendor_name)),
      ];

      setVendorNameList(uniqueVendorNames);
    } else if (activeAccordionIndex === 2) {
      const filteredData = data?.filter((d) => d?.status === "0");
      const uniqueVendorNames = [
        ...new Set(filteredData.map((d) => d?.vendor_name)),
      ];
      setVendorNameList(uniqueVendorNames);
    }
  }, [activeAccordionIndex]);

  useEffect(() => {
    if (activeAccordionIndex === 0) {
      const uniqueVendorNames = [...new Set(data?.map((d) => d?.vendor_name))];

      setVendorNameList(uniqueVendorNames);
    }
  }, [data]);

  const handleRowSelectionModelChange = async (rowIds) => {
    // console.log(rowIds, "-----------------");
    setRowSelectionModel(rowIds);
  };

  const handleDownloadInvoices = async () => {
    const zip = new JSZip();

    // Generate PDFs and add them to the zip
    await Promise.all(
      rowSelectionModel.map(async (rowId) => {
        const rowData = filterData[rowId]; // Access the row data using rowId
        // console.log(rowData, "RD-------------");
        if (rowData) {
          const pdf = new jsPDF();

          const keys = Object.keys(rowData);
          const values = Object.values(rowData);

          // Convert data to table format
          const tableData = keys.map((key, index) => [key, values[index]]);

          // Add table to PDF
          pdf.autoTable({
            startY: 10,
            head: [["Key", "Value"]],
            body: tableData,
          });

          zip.file(`invoice_${rowId}.pdf`, pdf.output());
        }
      })
    );

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Save the zip file
    saveAs(zipBlob, "invoices.zip");
  };
  // csv download----
  // const handleDownloadInvoices = async () => {
  //   // Prepare CSV content
  //   let csvContent = ""; // Initialize CSV content

  //   // Generate headers row
  //   const headers = Object.keys(filterData[rowSelectionModel[0]]);
  //   csvContent += headers.join(",") + "\n";

  //   // Generate CSV content for each row
  //   rowSelectionModel.forEach((rowId) => {
  //     const rowData = filterData[rowId]; // Access the row data using rowId
  //     console.log(rowData, "RD-------------");
  //     if (rowData) {
  //       const values = Object.values(rowData);

  //       // Construct CSV row
  //       const rowContent = values.map((value) => `"${value}"`).join(",");
  //       csvContent += `${rowContent}\n`;
  //     }
  //   });

  //   // Create Blob containing the CSV data
  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

  //   // Trigger download
  //   saveAs(blob, "invoices.csv");
  // };

  function CustomColumnMenu(props) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuColumnsItem: null,
        }}
      />
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPayMentProof(file);
    setPreview(URL.createObjectURL(file));
  };

  const openImgDialog = () => {
    setOpenDialog(true);
  };

  // useEffect(() => {
  //   const initialAdjustmentAmt = rowData?.balance_amount - paymentAmout || "";
  //   setAdjustAmount(initialAdjustmentAmt);
  // }, [rowData, TDSValue]);

  useEffect(() => {
    const initialAdjustmentAmt = netAmount - Math.floor(paymentAmout);
    const formattedAdjustmentAmt = initialAdjustmentAmt.toFixed(1);
    setAdjustAmount(formattedAdjustmentAmt);
  }, [rowData, paymentAmout]);

  console.log(
    netAmount,
    "netAmount----------------------------",
    paymentAmout,
    "paymentAmout-----------------"
  );

  // useEffect(() => {
  //   const isTDSMandatory =
  //     rowData?.totalFY > 100000 || rowData?.totalFY > 25000;
  //   const isTDSDeducted = rowData?.TDSDeduction === "1";
  //   setIsTDSMandatory(isTDSMandatory);
  //   setIsTDSDeducted(isTDSDeducted);
  // }, [rowData]);
  useEffect(() => {
    const tdsMandatory = rowData?.totalFY > 100000 || rowData?.totalFY > 25000;
    const isTdsDeductedData = rowData?.TDSDeduction === "1";
    setIsTDSMandatory(tdsMandatory);
    setIsTDSDeducted(isTdsDeductedData);

    // if (tdsMandatory && !isTdsDeductedData) {
    //   setTDSDeduction(true);
    // }
    setTDSDeduction(tdsMandatory || isTdsDeductedData);
  }, [rowData]);

  console.log(
    isTDSMandatory,
    "is mandatory------------------",
    rowData?.totalFY,
    "FY------------ss"
  );
  console.log(isTDSDeducted, "is mandatory------------------");

  return (
    <div>
      <FormContainer
        mainTitle="Pending Payment Request"
        link="/admin/finance-pruchasemanagement-pendingpaymentrequest"
        uniqueVendorCount={uniqueVendorCount}
        totalPendingAmount={totalPendingAmount}
        totalBalanceAmount={totalBalanceAmount}
        pendingRequestCount={pendingRequestCount}
        pendingPartialcount={pendingPartialcount}
        pendingInstantcount={pendingInstantcount}
        uniqueVendorPartialCount={uniqueVendorPartialCount}
        uniqueVendorsInstantCount={uniqueVendorsInstantCount}
        pendingAmountPartial={pendingAmountPartial}
        pendingAmountInstant={pendingAmountInstant}
        balanceAmountPartial={balanceAmountPartial}
        balanceAmountInstant={balanceAmountInstant}
        nonGstPartialCount={nonGstPartialCount}
        nonGstInstantCount={nonGstInstantCount}
        withInvcPartialImage={withInvcPartialImage}
        withInvcInstantImage={withInvcInstantImage}
        withoutInvcPartialImage={withoutInvcPartialImage}
        withoutInvcInstantImage={withoutInvcInstantImage}
        nonGstCount={nonGstCount}
        invoiceCount={invoiceCount}
        nonInvoiceCount={nonInvoiceCount}
        accIndex={activeAccordionIndex}
        handleOpenUniqueVendorClick={handleOpenUniqueVendorClick}
        includeAdditionalTitles={true}
        pendingpaymentRemainder={phpRemainderData.length}
        tdsDeductedCount={tdsDeductedCount}
        partialTDSDeduction={partialTDSDeduction}
        instantTDSDeduction={instantTDSDeduction}
      />
      {/* Bank Details 14 */}
      <Dialog
        open={bankDetail}
        onClose={handleCloseBankDetail}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Bank Details</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseBankDetail}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <TextField
          id="outlined-multiline-static"
          multiline
          value={
            bankDetailRowData[0]?.payment_details +
            "\n" +
            "Mob:" +
            bankDetailRowData[0]?.mob1 +
            "\n" +
            (bankDetailRowData[0]?.email
              ? "Email:" + bankDetailRowData[0]?.email
              : "")
          }
          rows={4}
          defaultValue="Default Value"
          variant="outlined"
        />
        <Button
          onClick={() => {
            navigator.clipboard.writeText(
              bankDetailRowData[0]?.payment_details
            );
            toastAlert("Copied to clipboard");
          }}
        >
          Copy
        </Button>
      </Dialog>
      {/* Payment History */}
      <Dialog
        open={paymentHistory}
        onClose={handleClosePaymentHistory}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Payment History</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClosePaymentHistory}
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
            rows={historyData}
            columns={paymentDetailColumns}
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
            getRowId={(row) => row.request_id}
          />
        </DialogContent>
      </Dialog>
      {/* Same Vendor Dialog Box */}
      <Dialog
        open={sameVendorDialog}
        onClose={handleCloseSameVender}
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
          onClick={handleCloseSameVender}
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
          {activeAccordionIndex === 0 && (
            <DataGrid
              rows={sameVendorData}
              columns={sameVenderColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              checkboxSelection
              slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => sameVendorData.indexOf(row)}
            />
          )}
          {activeAccordionIndex === 1 && (
            <DataGrid
              rows={sameVendorData.filter((d) => d.status === "3")}
              columns={sameVenderColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => sameVendorData.indexOf(row)}
            />
          )}
          {activeAccordionIndex === 2 && (
            <DataGrid
              rows={sameVendorData.filter((d) => d.status === "0")}
              columns={sameVenderColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => sameVendorData.indexOf(row)}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* Unique Vendor Dialog Box */}
      <Dialog
        open={uniqueVenderDialog}
        onClose={handleCloseUniqueVendor}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Vendors</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniqueVendor}
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
          {activeAccordionIndex === 0 && (
            <DataGrid
              rows={uniqueVendorData}
              columns={uniqueVendorColumns}
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
              getRowId={(row) => uniqueVendorData.indexOf(row)}
            />
          )}
          {activeAccordionIndex === 1 && (
            <DataGrid
              rows={uniqueVendorData.filter((d) => d.status === "3")}
              columns={uniqueVendorColumns}
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
              getRowId={(row) => uniqueVendorData.indexOf(row)}
            />
          )}
          {activeAccordionIndex === 2 && (
            <DataGrid
              rows={uniqueVendorData.filter((d) => d.status === "0")}
              columns={uniqueVendorColumns}
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
              getRowId={(row) => uniqueVendorData.indexOf(row)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Overview Dialog Box */}
      <Dialog
        open={overviewDialog}
        onClose={handleCloseOverview}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Overview</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseOverview}
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
          <Overview data={filterData} columns={columns} />
        </DialogContent>
      </Dialog>
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
                    <option value="last7Days">Last 7 Days</option>
                    <option value="last30Days">Last 30 Days</option>
                    <option value="thisWeek">This Week</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="currentMonth">Current Month</option>
                    <option value="nextMonth">Next Month</option>
                    <option value="currentQuarter">This Quarter</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <Autocomplete
                      value={vendorName}
                      onChange={(event, newValue) => setVendorName(newValue)}
                      options={vendorNameList?.map((e) => {
                        return e;
                      })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Vendor Name"
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
                    <label>Priority</label>
                    <select
                      value={priorityFilter}
                      className="form-control"
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <option value="">Select Priority</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Request Amount Filter</label>
                    <select
                      value={requestAmountFilter}
                      className="form-control"
                      onChange={(e) => setRequestAmountFilter(e.target.value)}
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
                    <label>Requested Amount</label>
                    <input
                      value={requestedAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setRequestedAmountField(e.target.value);
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
                  onClick={handleDateFilter}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearDateFilter}
                  className="btn cmnbtn btn-secondary"
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  onClick={handleOpenOverview}
                  className="btn cmnbtn btn-primary"
                >
                  Overview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <>
        <div className="tab">
          {accordionButtons.map((button, index) => (
            <div
              className={`named-tab ${
                activeAccordionIndex === index ? "active-tab" : ""
              }`}
              onClick={() => handleAccordionButtonClick(index)}
            >
              {button}
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header sb">
            <div className="caard-title">Pending Payment Oveview</div>
            {/* <div className="pack w-75">
              {rowSelectionModel.length > 0 && (
                <Button
                  className="btn btn-primary cmnbtn btn_sm"
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleDownloadInvoices}
                >
                  Download PDF Zip
                </Button>
              )}
            </div> */}
          </div>
          <div className="card-body thm_table fx-head">
            {activeAccordionIndex === 0 && (
              <DataGrid
                rows={filterData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowClassName={getValidationCSSForRemainder}
                slots={{ toolbar: GridToolbar }}
                // disableSelectionOnClick
                // checkboxSelection
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                getRowId={(row) => row?.request_id}
                // onRowSelectionModelChange={(rowIds) => {
                //   handleRowSelectionModelChange(rowIds);
                //   console.log(rowIds, "IDS");
                // }}
                // rowSelectionModel={rowSelectionModel}
              />
            )}
            {openImageDialog && (
              <ImageView
                viewImgSrc={viewImgSrc}
                fullWidth={true}
                maxWidth={"md"}
                setViewImgDialog={setOpenImageDialog}
                openImageDialog={openImageDialog}
              />
            )}

            {activeAccordionIndex === 1 && (
              <DataGrid
                rows={filterData.filter((d) => d.status === "3")}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                h
                getRowClassName={getValidationCSSForRemainder}
                slots={{ toolbar: GridToolbar }}
                // checkboxSelection
                // disableSelectionOnClick
                disableColumnMenu
                getRowId={(row) => filterData.indexOf(row)}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                // onRowSelectionModelChange={(rowIds) => {
                //   handleRowSelectionModelChange(rowIds);
                //   console.log(rowIds, "IDS");
                // }}
                // rowSelectionModel={rowSelectionModel}
              />
            )}
            {openImageDialog && (
              <ImageView
                viewImgSrc={viewImgSrc}
                fullWidth={true}
                maxWidth={"md"}
                setViewImgDialog={setOpenImageDialog}
              />
            )}
            {activeAccordionIndex === 2 && (
              <DataGrid
                rows={filterData.filter((d) => d.status === "0")}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowClassName={getValidationCSSForRemainder}
                slots={{ toolbar: GridToolbar }}
                // checkboxSelection
                // disableSelectionOnClick
                disableColumnMenu
                getRowId={(row) => filterData.indexOf(row)}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                // onRowSelectionModelChange={(rowIds) => {
                //   handleRowSelectionModelChange(rowIds);
                //   console.log(rowIds, "IDS");
                // }}
                // rowSelectionModel={rowSelectionModel}
              />
            )}
            {openImageDialog && (
              <ImageView
                viewImgSrc={viewImgSrc}
                fullWidth={true}
                maxWidth={"md"}
                setViewImgDialog={setOpenImageDialog}
              />
            )}
          </div>
        </div>

        {/*Dialog Box */}
        {loading ? (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: "28%",
              width: "50%",
              zIndex: "222",
            }}
          >
            {" "}
            <Loader />
          </div>
        ) : (
          <Dialog open={payDialog} onClose={handleClosePayDialog}>
            <DialogTitle>Vendor Payment</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClosePayDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent>
              <div className="row gap-3">
                <TextField
                  className="col"
                  value={rowData.name}
                  autoFocus
                  margin="dense"
                  id="name"
                  readOnly
                  label="Requested By"
                  type="text"
                  variant="outlined"
                />
                <TextField
                  className="col"
                  value={convertDateToDDMMYYYY(rowData.request_date)}
                  autoFocus
                  margin="dense"
                  id="name"
                  readOnly
                  label="Request Date"
                  type="text"
                  variant="outlined"
                />
              </div>
              <div className="row">
                <TextField
                  // className="col-md-6 me-3"
                  value={rowData.t3}
                  autoFocus
                  margin="dense"
                  id="name"
                  disabled
                  label=" Purchase Remark"
                  type="text"
                  variant="outlined"
                />
              </div>
              <div className="row gap-3">
                <TextField
                  value={rowData.vendor_name}
                  className="col"
                  autoFocus
                  margin="dense"
                  id="name"
                  readOnly={true}
                  label="Vendor Name"
                  type="text"
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  className="col"
                  value={rowData.address}
                  autoFocus
                  margin="dense"
                  id="name"
                  readOnly
                  label="Address"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <div className="row gap-3">
                <TextField
                  className="col"
                  value={rowData.gst}
                  autoFocus
                  margin="dense"
                  // disabled
                  readOnly
                  label="GST"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  className="col"
                  value={`₹${rowData.outstandings}`}
                  autoFocus
                  margin="dense"
                  // disabled
                  readOnly
                  label="Outstanding"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <div className="row gap-3">
                {/* {rowData?.TDSDeduction !== "1" ? ( */}
                {/* {isTDSMandatory || TDSDeduction ? ( */}
                <>
                  <FormControlLabel
                    className="col-md-3"
                    control={
                      <Checkbox
                        onChange={handleTDSDeduction}
                        checked={TDSDeduction}
                        disabled={isTDSDeducted}
                      />
                    }
                    label="TDS Deduction"
                  />
                  {/* {gstHold && (
                      <TextField
                        className="col-md-5 me-3"
                        value={GSTHoldAmount}
                        onChange={handleGSTHoldInputChange}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="GST Hold"
                      />
                    )} */}
                  {TDSDeduction && (
                    <>
                      <Autocomplete
                        onChange={(e, value) => setTDSPercentage(value)}
                        disablePortal
                        className="col-md-3 mt-2"
                        value={TDSPercentage}
                        id="combo-box-demo"
                        options={[1, 2, 10]}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="TDS %"
                            placeholder="TDS %"
                          />
                        )}
                        disable={true}
                      />
                      <TextField
                        className="col-md-3 mt-2"
                        value={TDSValue}
                        autoFocus
                        readOnly
                        margin="dense"
                        variant="outlined"
                        id="name"
                        label="TDS Amount"
                        disable={true}
                      />
                      <TextField
                        InputProps={{
                          readOnly: gstHold,
                        }}
                        onChange={(e) => {
                          rowData.balance_amount;

                          const currentValue = e.target.value;
                          if (
                            /^\d+$/.test(currentValue) ||
                            currentValue === ""
                          ) {
                            // setPaymentAmount(currentValue);
                            if (currentValue <= +rowData.balance_amount) {
                              setNetAmount(currentValue);
                              setPaymentStatus;
                            } else {
                              toastError(
                                "Payment Amount should be less than or equal to Requested Amount"
                              );
                            }
                          } else {
                            setNetAmount("");
                          }
                        }}
                        className="col-md-3 mt-2"
                        disable={true}
                        autoFocus
                        type="number"
                        margin="dense"
                        id="name"
                        label=" Net Amount *"
                        variant="outlined"
                        fullWidth
                        value={netAmount}
                      />
                    </>
                  )}
                </>
                {/* ) : (
                  ""
                )} */}
              </div>
              <div className="row gap-3">
                <TextField
                  className="col"
                  value={`₹${rowData.request_amount}`}
                  autoFocus
                  margin="dense"
                  id="name"
                  // disabled
                  readOnly
                  label="Amount Requested"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  className="col"
                  value={`₹${rowData.balance_amount}`}
                  autoFocus
                  margin="dense"
                  id="name"
                  // disabled
                  readOnly
                  label="Balance Amount"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <div className="row">
                <TextField
                  className="col-md-4 me-3"
                  value={`₹${baseAmount}`}
                  autoFocus
                  margin="dense"
                  id="name"
                  // disabled
                  readOnly
                  label="Base Amount"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <FormControlLabel
                  className="col-md-5"
                  control={
                    <Checkbox
                      onChange={handleGstHold}
                      disabled={rowData.gst_amount == 0}
                    />
                  }
                  label="GST Hold"
                />

                {gstHold && (
                  <TextField
                    className="col"
                    value={GSTHoldAmount}
                    onChange={handleGSTHoldInputChange}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="GST Hold"
                  />
                )}
              </div>
              <div className="row gap-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    className="col mt-2"
                    defaultValue={dayjs()}
                    autoFocus
                    label="Payment Date "
                    onChange={(newValue) => {
                      setPaymentDate(
                        newValue
                          .add(5, "hours")
                          .add(30, "minutes")
                          .$d.toGMTString()
                      );
                    }}
                    disableFuture
                    views={["year", "month", "day"]}
                  />
                </LocalizationProvider>
                <Autocomplete
                  onChange={(e, value) => setPaymentMode(value || null)}
                  disablePortal
                  className="col mt-1"
                  id="combo-box-demo"
                  options={
                    paymentModeData.length > 0
                      ? paymentModeData?.map((item) => item.payment_mode)
                      : []
                  }
                  value={paymentMode}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Payment Mode *"
                      placeholder="Payment Mode"
                    />
                  )}
                />
              </div>
              <div className="row gap-3">
                <TextField
                  InputProps={{
                    readOnly: gstHold,
                  }}
                  onChange={(e) => {
                    rowData.balance_amount;

                    const currentValue = e.target.value;
                    if (/^\d+$/.test(currentValue) || currentValue === "") {
                      // setPaymentAmount(currentValue);
                      if (currentValue <= +rowData.balance_amount) {
                        setPaymentAmount(currentValue);
                        setPaymentStatus;
                      } else {
                        toastError(
                          "Payment Amount should be less than or equal to Requested Amount"
                        );
                      }
                    } else {
                      setPaymentAmount("");
                    }
                  }}
                  className="col"
                  autoFocus
                  type="number"
                  margin="dense"
                  id="name"
                  label=" Paid Amount *"
                  variant="outlined"
                  fullWidth
                  value={Math.floor(paymentAmout)}
                />
                {TDSValue ? (
                  <TextField
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    multiline
                    className="col"
                    autoFocus
                    margin="dense"
                    id="Adjust Amount"
                    label="Adjust Amount"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={TDSValue ? adjustAmount : 0}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="row gap-3">
                <Autocomplete
                  onChange={(e, value) => setPaymentStatus(value)}
                  value={paymentStatus}
                  disablePortal
                  disabled
                  className="col mt-2"
                  id="combo-box-demo"
                  options={[
                    "Fully Paid",
                    "Fully Paid(TDS Deducted)",
                    "Fully Paid(GST Hold)",
                    "Fully Paid(TDS Deducted & GST Hold)",
                    "Partially Paid",
                  ]}
                  fullWidth={true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Payment Status *"
                      placeholder="Payment Status"
                    />
                  )}
                />
                <TextField
                  onChange={(e) => setPayRemark(e.target.value)}
                  multiline
                  className="col mt-2"
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Remark"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={payRemark}
                />
              </div>
              <div className="row">
                <div className="form-group mt-3">
                  <div className="row">
                    <label htmlFor="paymentProof">
                      Payment Proof/ScreenShot
                    </label>

                    <input
                      type="file"
                      className="form-control col-md-6"
                      id="paymentProof"
                      onChange={handleFileChange}
                      // onClick={openImgDialog}
                    />
                    <Button
                      variant="contained"
                      className="col-md-5 ms-3"
                      fullWidth
                      onClick={openImgDialog}
                    >
                      view image
                    </Button>
                    {openDialog && preview && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(0,0,0,0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 9999,
                        }}
                        onClick={() => setOpenDialog(false)}
                      >
                        <img
                          src={preview}
                          alt="Selected file"
                          style={{
                            maxWidth: "50%",
                            maxHeight: "80%",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                className="mx-2"
                fullWidth
                onClick={(e) => handlePayVendorClick(e)}
                disabled={!paymentMode || !paymentAmout}
              >
                Pay Vendor
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {showDisCardModal && (
          <DiscardConfirmation
            userName={userName}
            rowData={rowData}
            setShowDiscardModal={setShowDiscardModal}
            userID={userID}
            callApi={callApi}
          />
        )}

        {remainderDialog && (
          <ShowDataModal
            handleClose={setRemainderDialog}
            rows={reminderData}
            columns={remainderDialogColumns}
            aknowledgementDialog={aknowledgementDialog}
            setAknowledgementDialog={setAknowledgementDialog}
            userName={userName}
            callApi={callApi}
            setRemainderDialo={setRemainderDialog}
          />
        )}
      </>
    </div>
  );
}
