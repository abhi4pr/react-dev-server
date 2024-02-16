import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import pdf from "./pdf-file.png";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
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
import HistoryIcon from "@mui/icons-material/History";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import Badge from "@mui/material/Badge";
import ShowDataModal from "./ShowDataModal";

const convertDateToDDMMYYYY = (date) => {
  const date1 = new Date(date);
  const day = String(date1.getDate()).padStart(2, "0");
  const month = String(date1.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = date1.getFullYear();

  return `${day}/${month}/${year}`;
};

export default function PendingPaymentRequest() {
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
  const [paymentMode, setPaymentMode] = useState("");
  const [payRemark, setPayRemark] = useState("");
  const [payMentProof, setPayMentProof] = useState("");
  const [vendorName, setVendorName] = useState("");
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

  var handleAcknowledgeClick = (row) => {
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
    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const x = res.data.modifiedData;
      setNodeData(x);
      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          let y = res.data.body.filter((item) => {
            return !x.some((item2) => item.request_id == item2.request_id);
          });
          setPhpData(res.data.body);
          setData(y);
          setFilterData(y);
          setPendingRequestCount(y.length);
          const uniqueVendors = new Set(y.map((item) => item.vendor_name));
          setUniqueVendorCount(uniqueVendors.size);
          const uvData = [];
          uniqueVendors.forEach((vendorName) => {
            const vendorRows = y.filter(
              (item) => item.vendor_name === vendorName
            );
            uvData.push(vendorRows[0]);
          });
          setUniqueVendorData(uvData);
        });
    });

    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      setUserName(res.data.user_name);
    });

    //Reminder API
    axios
      .get(
        "https://purchase.creativefuel.io//webservices/RestController.php?view=getpaymentrequestremind"
      )
      .then((res) => {
        setPhpRemainderData(res.data.body);
      });
  };

  const handleRemainderModal = (reaminderData) => {
    setReminderData(reaminderData);
    setRemainderDialog(true);
  };

  useEffect(() => {
    callApi();
  }, []);

  const convertDateToDDMMYYYY = (date) => {
    const date1 = new Date(date);
    const day = String(date1.getDate()).padStart(2, "0");
    const month = String(date1.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date1.getFullYear();

    return `${day}/${month}/${year}`;
  };

  GridToolbar.defaultProps = {
    filterRowsButtonText: "Filter",
    filterGridToolbarButton: "Filter",
  };

  function calculateDays(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    return diffDays;
  }

  const totalPendingAmount = data.reduce(
    (total, item) => total + parseFloat(item.request_amount),
    0
  );

  const handlePayVendorClick = () => {
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
    axios
      .post(baseUrl + "phpvendorpaymentrequest", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
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
          .then(() => {
            toastAlert("Payment Done Successfully");
          });

        setPaymentMode("");
        setPayRemark("");
        setPayMentProof("");
        setPayDialog(false);
        setPaymentAmount("");
        callApi();
      });
  };
  //req_id , paymeent_amou ,paydate , payby, screenshot , finance remark

  const handleDiscardClick = (row) => {
    setRowData(row);
    setShowDiscardModal(true);
    // axios
    //   .delete(`${baseUrl}`+`delete_demo/${row._id}`)
    //   .then(() => {
    //     callApi();
    //   });
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
  };

  const handleClosePayDialog = () => {
    setPayDialog(false);
    setPaymentMode("");
    setPayRemark("");
    setPayMentProof("");
    setPaymentAmount("");
  };

  const handleClearDateFilter = () => {
    setFilterData(data);
    setFromDate("");
    setToDate("");
    setVendorName("");
    setPriorityFilter("");
    setRequestAmountFilter("");
    setRequestedAmountField("");
  };

  const handlePayClick = (row) => {
    setRowData(row);
    setPayDialog(true);
  };

  const handleOpenUniqueVendorClick = () => {
    setUniqueVenderDialog(true);
  };

  const handleCloseUniqueVendor = () => {
    setUniqueVenderDialog(false);
  };

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

  const handleOpenBankDetail = () => {
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

    const startDate = new Date(`04/01/${new Date().getFullYear() - 1}`);
    const endDate = new Date(`03/31/${new Date().getFullYear()}`);

    const dataFY = phpData.filter((e) => {
      const paymentDate = new Date(e.request_date);
      return (
        paymentDate >= startDate &&
        paymentDate <= endDate &&
        e.vendor_name === row.vendor_name &&
        e.status != 0 &&
        e.status != 2
      );
    });

    const dataTP = phpData.filter((e) => {
      return (
        e.vendor_name === row.vendor_name && e.status != 0 && e.status != 2
      );
    });



    
    // let outstandings = 0;
    // let request_amount = 0;

    // type=="FY"?dataFY:dataTP.forEach((row) => {
    //   outstandings += +row.outstandings;
    //   request_amount += +row.request_amount || 0;
    // });

    // // Create total row
    // const totalRow = {
    //   outstandings: outstandings,
    //   request_amount: request_amount,
    //   vendor_name: "Total",

    // };

    // setHistoryData(type === "FY" ? [...dataFY, totalRow] : [...dataTP, totalRow]);


     setHistoryData(type=="FY"?dataFY:dataTP);

  };

  const handleClosePaymentHistory = () => {
    setPaymentHistory(false);
  };

  // ==============================================================
  //iterate for totalAmount of same name venders :-
  const vendorAmounts = [];
  uniqueVendorData.forEach((item) => {
    const vendorName = item.vendor_name;
    const requestAmount = item.request_amount;

    if (vendorAmounts[vendorName]) {
      vendorAmounts[vendorName] += requestAmount; // Add request amount to existing total
    } else {
      vendorAmounts[vendorName] = requestAmount; // Initialize with request amount
    }
  });

  // calculate the total amount for vendors with the same name
  let totalSameVendorAmount = Object.values(vendorAmounts).reduce(
    (total, amount) => total + amount,
    0
  );
  // ================================================================
  // Bank Detail columns:-
  const bankDetailColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = filterData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "account_number",
      headerName: "Account Number",
      width: 150,
      renderCell: (params) => {
        return <p>12345647321 </p>;
      },
    },
    {
      field: "bank_name",
      headerName: "Bank Name",
      width: 150,
      renderCell: (params) => {
        return <p>Axis Bank</p>;
      },
    },
    {
      field: "ifsc",
      headerName: "IFSC Number",
      width: 150,
      renderCell: (params) => {
        return <p>AXIS1234</p>;
      },
    },
    {
      field: "gst",
      headerName: "GST",
      width: 150,
      renderCell: (params) => {
        return <p> 1 </p>;
      },
    },
    {
      field: "pan_number",
      headerName: "Pan Number",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377;ABCD12345G </p>;
      },
    },
  ];
  // bank Payment Detail column:-
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
    {
      field: "invc_img",
      headerName: "Invoice Image",
      renderCell: (params) => {
        if (params.row.invc_img) {
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
        } else {
          return null;
        }
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
          <p> {calculateDays(params.row.request_date, new Date())} Days</p>
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
        const rowIndex = filterData.indexOf(params.row);
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
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button
              className="btn btn-sm btn-success"
              onClick={() => handlePayClick(params.row)}
            >
              Pay
            </button>
            <button
              className="btn btn-sm btn-danger mx-2"
              onClick={() => handleDiscardClick(params.row)}
            >
              discard
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
        const rowIndex = filterData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      // width: "auto",
      width: 250,
      renderCell: (params) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenSameVender(params.row.vendor_name)}
          >
            {params.row.vendor_name}
          </div>
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      width: 150,
      renderCell: () => {
        return <p> &#8377; {totalSameVendorAmount}</p>;
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
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = filterData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "invc_img",
      headerName: "Invoice Image",
      renderCell: (params) => {
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
      width: 250,
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
      field: "name",
      headerName: "Requested By",
      width: 150,
      renderCell: (params) => {
        const reminder = phpRemainderData.filter(
          (item) => item.request_id == params.row.request_id
        );

        return (
          <>
            <span>{params.row.name}</span> &nbsp;{" "}
            <span>
              {reminder.length > 0 ? (
                <Badge badgeContent={reminder.length} color="primary">
                  <NotificationsActiveTwoToneIcon
                    onClick={() => handleRemainderModal(reminder)}
                  />{" "}
                </Badge>
              ) : (
                ""
              )}
            </span>
          </>
        );
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      width: 320,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{ cursor: "pointer", marginRight: "20px" }}
              onClick={() => handleOpenSameVender(params.row.vendor_name)}
            >
              {params.row.vendor_name}
            </div>
            <div onClick={() => handleOpenBankDetail()}>
              <AccountBalanceIcon style={{ fontSize: "25px" }} />
            </div>
            <div>
              {nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
                .length > 0 ? (
                <span className="row ml-2 ">
                  <h5
                    onClick={() => handleOpenPaymentHistory(params.row, "TP")}
                    style={{ cursor: "pointer" }}
                    className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
                  >
                    Total Paid
                  </h5>
                  <h5
                    onClick={() => handleOpenPaymentHistory(params.row, "FY")}
                    style={{ cursor: "pointer" }}
                    className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
                  >
                    {/* Financial Year */}
                    FY
                  </h5>
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      },
    },
    {
      field:"pan",
      headerName:"Pan",
      width:150,
    },
    {
      field:"gst",
      headerName:"GST",
      width:200,
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
      field: "outstandings",
      headerName: "OutStanding ",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.outstandings}</p>;
      },
    },
    {
      field: "aging",
      headerName: "Aging",
      width: 150,
      renderCell: (params) => {
        return (
          <p> {calculateDays(params.row.request_date, new Date())} Days</p>
        );
      },
    },
    {
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button
              className="btn btn-sm btn-success"
              onClick={() => handlePayClick(params.row)}
            >
              Pay
            </button>
            <button
              className="btn btn-sm btn-danger mx-2"
              onClick={() => handleDiscardClick(params.row)}
            >
              discard
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <FormContainer
        mainTitle="Pending Payment Request"
        link="/admin/finance-pruchasemanagement-pendingpaymentrequest"
        uniqueVendorCount={uniqueVendorCount}
        totalPendingAmount={totalPendingAmount}
        pendingRequestCount={pendingRequestCount}
        handleOpenUniqueVendorClick={handleOpenUniqueVendorClick}
        includeAdditionalTitles={true}
        pendingpaymentRemainder={phpRemainderData.length}
      />
      {/* Bank Details */}
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

        <DataGrid
          rows={filterData}
          columns={bankDetailColumns}
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
          getRowId={(row) => filterData.indexOf(row)}
        />
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

        <DataGrid
          rows={historyData}
          columns={paymentDetailColumns}
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
          getRowId={(row) => row.request_id}
        />
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

        <DataGrid
          rows={sameVendorData}
          columns={sameVenderColumns}
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
          getRowId={(row) => sameVendorData.indexOf(row)}
        />
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

        <DataGrid
          rows={uniqueVendorData}
          columns={uniqueVendorColumns}
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
          getRowId={(row) => uniqueVendorData.indexOf(row)}
        />
      </Dialog>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label>Vendor Name</label>
            {/* <input
              value={vendorName}
              type="text"
              placeholder="Name"
              className="form-control"
              onChange={(e) => {
                setVendorName(e.target.value);
              }}
            /> */}
            <Autocomplete
              value={vendorName}
              onChange={(event, newValue) => setVendorName(newValue)}
              options={data.map((option) => option.vendor_name)}
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
        <div className="col-md-3">
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
        <div className="col-md-3">
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
        {/* </div> */}
        <div className="col-md-1 mt-4 me-2">
          <Button variant="contained" onClick={handleDateFilter}>
            <i className="fas fa-search"></i> Search
          </Button>
        </div>
        <div className="col-md-1 mt-4">
          <Button variant="contained" onClick={handleClearDateFilter}>
            Clear
          </Button>
        </div>
      </div>

      <DataGrid
        rows={filterData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowClassName={getValidationCSSForRemainder}
        slots={{ toolbar: GridToolbar }}
        disableSelectionOnClick
        autoHeight
        disableColumnMenu
        getRowId={(row) => filterData.indexOf(row)}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />

      {/*Dialog Box */}
      <Dialog open={payDialog} onClose={handleClosePayDialog}>
        <DialogTitle>vendor Payment</DialogTitle>
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
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={rowData.vendor_name}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="Vendor Name"
              type="text"
              variant="outlined"
            />
            <TextField
              className="col-md-5 ml-2"
              value={rowData.address}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="Address"
              type="text"
              variant="outlined"
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={rowData.mob1}
              autoFocus
              margin="dense"
              // disabledreadOnly
              readOnly
              label="Mobile"
              type="text"
              variant="outlined"
            />
            <TextField
              className="col-md-5 ml-2"
              value={rowData.pan}
              autoFocus
              margin="dense"
              // disabled
              readOnly
              label="Pan"
              type="text"
              variant="outlined"
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={rowData.gst}
              autoFocus
              margin="dense"
              // disabled
              readOnly
              label="GST"
              type="text"
              variant="outlined"
            />
            <TextField
              className="col-md-5 ml-2"
              value={`₹${rowData.outstandings}`}
              autoFocus
              margin="dense"
              // disabled
              readOnly
              label="Outstanding"
              type="text"
              variant="outlined"
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={`₹${rowData.request_amount}`}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="Amount Requested"
              type="text"
              variant="outlined"
            />
            <TextField
              className="col-md-5 ml-2"
              value={rowData.name}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="Requested By"
              type="text"
              variant="outlined"
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={convertDateToDDMMYYYY(rowData.request_date)}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="Request Date"
              type="text"
              variant="outlined"
            />
            <TextField
              className="col-md-5 ml-2"
              value={rowData.t3}
              autoFocus
              margin="dense"
              id="name"
              disabled
              label="Remark"
              type="text"
              variant="outlined"
            />
          </div>
          <div className="me-3">
            <Autocomplete
              onChange={(e, value) => setPaymentMode(value)}
              disablePortal
              className=" mt-2"
              id="combo-box-demo"
              options={[
                "Cash",
                "Crypto",
                "Transfer from CF",
                "Transfer from other Account",
              ]}
              fullWidth={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Mode *"
                  placeholder="Payment Mode"
                />
              )}
            />
            <TextField
              onChange={(e) => {
                rowData.request_amount;

                const currentValue = e.target.value;
                if (/^\d+$/.test(currentValue) || currentValue === "") {
                  // setPaymentAmount(currentValue);
                  if (currentValue <= +rowData.request_amount) {
                    setPaymentAmount(currentValue);
                  } else {
                    toastError(
                      "Payment Amount should be less than or equal to Requested Amount"
                    );
                  }
                }
              }}
              className="mt-3"
              autoFocus
              type="number"
              margin="dense"
              id="name"
              label="Amount *"
              variant="outlined"
              fullWidth
              value={paymentAmout}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                className="mt-3"
                defaultValue={dayjs()}
                autoFocus
                label="Payment Date "
                onChange={(newValue) => {
                  setPaymentDate(
                    newValue.add(5, "hours").add(30, "minutes").$d.toGMTString()
                  );
                }}
                disableFuture
                views={["year", "month", "day"]}
              />
            </LocalizationProvider>

            <TextField
              onChange={(e) => setPayRemark(e.target.value)}
              multiline
              className="mt-3"
              autoFocus
              margin="dense"
              id="name"
              label="Remark"
              type="text"
              variant="outlined"
              fullWidth
              value={payRemark}
            />
            <div className="form-group mt-3">
              <label htmlFor="paymentProof">Payment Proof/ScreenShot</label>
              <input
                type="file"
                className="form-control"
                id="paymentProof"
                onChange={(e) => setPayMentProof(e.target.files[0])}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClosePayDialog}>Cancel</Button> */}
          <Button
            variant="contained"
            className="mx-2"
            fullWidth
            onClick={handlePayVendorClick}
            disabled={!paymentMode || !paymentAmout}
          >
            Pay Vendor
          </Button>
        </DialogActions>
      </Dialog>

      {showDisCardModal && (
        <DiscardConfirmation
          rowData={rowData}
          setShowDiscardModal={setShowDiscardModal}
          userID={userID}
          callApi={callApi}
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

      {remainderDialog && (
        <ShowDataModal
          handleClose={setRemainderDialog}
          rows={reminderData}
          columns={remainderDialogColumns}
          aknowledgementDialog={aknowledgementDialog}
          setAknowledgementDialog={setAknowledgementDialog}
        />
      )}
    </div>
  );
}
