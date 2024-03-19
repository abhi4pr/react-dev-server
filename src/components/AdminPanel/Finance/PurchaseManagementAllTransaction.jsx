import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import {
  Autocomplete,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  Badge,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { Link } from "react-router-dom";
import ImageView from "./ImageView";
import pdf from "./pdf-file.png";
import { baseUrl } from "../../../utils/config";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentHistoryDialog from "../../PaymentHistory/PaymentHistoryDialog";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useGlobalContext } from "../../../Context/Context";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import ShowDataModal from "./ShowDataModal";
import jwtDecode from "jwt-decode";

export default function PurchaseManagementAllTransaction() {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [aknowledgementDialog, setAknowledgementDialog] = useState(false);
  const [remainderDialog, setRemainderDialog] = useState(false);
  const [reminderData, setReminderData] = useState([]);
  const [phpRemainderData, setPhpRemainderData] = useState([]);
  const [userName, setUserName] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [actionFieldData, setActionFieldData] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [requestAmountFilter, setRequestAmountFilter] = useState("");
  const [requestedAmountField, setRequestedAmountField] = useState("");
  const [sameVendorDialog, setSameVendorDialog] = useState(false);
  const [sameVendorData, setSameVendorData] = useState([]);
  const [bankDetail, setBankDetail] = useState(false);
  const [nodeData, setNodeData] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyType, setHistoryType] = useState("");
  const [phpData, setPhpData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [bankDetailRowData, setBankDetailRowData] = useState([]);
  const { toastAlert, toastError } = useGlobalContext();

  const [uniqueVenderDialog, setUniqueVenderDialog] = useState(false);
  const [uniqueVendorData, setUniqueVendorData] = useState([]);
  // const [sameVendorDialog, setSameVendorDialog] = useState(false);
  // const [sameVendorData, setSameVendorData] = useState([]);
  const [uniqueVendorCount, setUniqueVendorCount] = useState(0);
  const [withInvoiceCount, setWithInvoiceCount] = useState(0);
  const [withoutInvoiceCount, setWithoutInvoiceCount] = useState(0);
  const [withInvoiceData, setWithInvoiceData] = useState([]);
  const [withoutInvoiceData, setWithoutInvoiceData] = useState([]);

  const handleCloseBankDetail = () => {
    setBankDetail(false);
  };

  const callApi = () => {
    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      setNodeData(res.data.modifiedData);
      const x = res.data.modifiedData;
      setActionFieldData(x);

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          setPhpData(res.data.body);

          let y = res.data.body;
          setData(y);
          setFilterData(y);
          // Filter data to find counts
          const withInvoiceImage = y.filter(
            (item) => item.invc_img && item.invc_img.length > 0
          );
          const withoutInvoiceImage = y.filter(
            (item) => !item.invc_img || item.invc_img.length === 0
          );
          const withInvoice = y.filter(
            (item) => item.invc_img && item.invc_img.trim() !== ""
          );
          const withoutInvoice = y.filter(
            (item) => !item.invc_img || item.invc_img.trim() === ""
          );

          // Update state with the filtered data
          setWithInvoiceData(withInvoice);
          setWithoutInvoiceData(withoutInvoice);
          setWithInvoiceCount(withInvoiceImage.length);
          setWithoutInvoiceCount(withoutInvoiceImage.length);
          // setPendingRequestCount(y.length);

          // =========================================
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

      axios
        .get(
          "https://purchase.creativefuel.io//webservices/RestController.php?view=getpaymentrequestremind"
        )
        .then((res) => {
          setPhpRemainderData(res.data.body);
        });

      axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
        setUserName(res.data.user_name);
      });
    });
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

  var handleAcknowledgeClick = () => {
    setAknowledgementDialog(true);
  };

  const handleRemainderModal = (reaminderData) => {
    setReminderData(reaminderData);
    setRemainderDialog(true);
  };

  const handleOpenBankDetail = (row) => {
    let x = [];
    x.push(row);
    setBankDetailRowData(x);
    setBankDetail(true);
  };

  const handleOpenPaymentHistory = (row, type) => {
    setHistoryType(type);
    setRowData(row);
    setPaymentHistory(true);
    const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
    const currentYear = new Date().getFullYear();
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
    console.log(dataFY, "dataFY");

    setHistoryData(type == "FY" ? dataFY : dataTP);
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
    {
      field: "invc_img",
      headerName: "Invoice Image",
      renderCell: (params) => {
        if (params.row.invc_img?.length > 0) {
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
              style={{ width: "30px", height: "30px" }}
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
              style={{ width: "30px", height: "30px" }}
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
  // Function to calculate the difference in days between two dates
  // function calculateDays(startDate, endDate) {
  //   const diffInMilliseconds = Math.abs(endDate - new Date(startDate));
  //   return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
  // }

  const handleDateFilter = () => {
    const filterData = data.filter((item) => {
      const date = new Date(item.request_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);

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

    // Unique vendors count and data :-
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
    // ================================
  };
  const handleClearDateFilter = () => {
    setFilterData(data);
    setFromDate("");
    setToDate("");
    setVendorName("");
    setPriorityFilter("");
    setRequestAmountFilter("");
    setRequestedAmountField("");

    const uniqueVendors = new Set(data.map((item) => item.vendor_name));
    setUniqueVendorCount(uniqueVendors.size);

    const uvData = [];
    uniqueVendors.forEach((vendorName) => {
      const vendorRows = data.filter((item) => item.vendor_name === vendorName);
      uvData.push(vendorRows[0]);
    });

    setUniqueVendorData(uvData);
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
    // Calculate the total amount for vendors with the same name
    // const totalAmount = sameNameVendors.reduce(
    //   (total, item) => total + item.request_amount,
    //   0
    // );

    // Set the selected vendor data including the vendor name, data, and total amount
    setSameVendorData(sameNameVendors);
  };

  const handleCloseSameVender = () => {
    setSameVendorDialog(false);
  };

  // According to status count :-

  const pendingRequestCount = data.filter(
    (item) => parseInt(item.status) == 0
  ).length;
  const discardedRequestCount = data.filter(
    (item) => parseInt(item.status) == 2
  ).length;
  const paidRequestCount = data.filter(
    (item) => parseInt(item.status) == 1
  ).length;

  // total pending  amount data :-
  const totalRequestAmount = filterData.reduce(
    (total, item) => total + parseFloat(item.request_amount),
    0
  );

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
  // Calculate GST hold amount and count
  // const gstHoldData = data.filter((item) => item.gst_amount); // Assuming 'gstApplied' is a boolean field indicating if GST is applied
  // const gstHoldCount = gstHoldData.length;
  // const gstHoldAmount = gstHoldData.reduce(
  //   (total, item) => total + parseFloat(item.gst_amount),
  //   0
  // );

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
    // {
    //   headerName: "Action",
    //   width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         <button
    //           className="btn btn-sm btn-success"
    //           onClick={() => handlePayClick(params.row)}
    //         >
    //           Pay
    //         </button>
    //         <button
    //           className="btn btn-sm btn-danger mx-2"
    //           onClick={() => handleDiscardClick(params.row)}
    //         >
    //           discard
    //         </button>
    //       </div>
    //     );
    //   },
    // },
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
      width: 50,
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
        if (params.row.invc_img?.length > 0) {
          // Extract file extension and check if it's a PDF
          const fileExtension = params.row.invc_img
            .split(".")
            .pop()
            .toLowerCase();
          const isPdf = fileExtension === "pdf";

          const imgUrl = `https://purchase.creativefuel.io/${params.row.invc_img}`;
          return isPdf ? (
            // <iframe
            //   onClick={() => {
            //     setOpenImageDialog(true);
            //     setViewImgSrc(imgUrl);
            //   }}
            //   src={imgUrl}
            //   style={{ width: "100px", height: "100px" }}
            //   title="PDF Preview"
            // />
            <img
              src={pdf}
              alt="pdf"
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(imgUrl);
              }}
              style={{ width: "40px", height: "40px" }}
            />
          ) : (
            <img
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(imgUrl);
              }}
              src={imgUrl}
              alt="Invoice"
              style={{ width: "60px", height: "60px" }}
            />
          );
        }
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
            <div
              style={{ cursor: "pointer", marginRight: "20px" }}
              onClick={() => handleOpenSameVender(params.row.vendor_name)}
            >
              {params.row.vendor_name}
            </div>
          </div>
        );
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
    },
    // {
    //   field: "total_paid",
    //   headerName: "Total Paid",
    //   width: 150,
    //   renderCell: (params) => {
    //     return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
    //       .length > 0 ? (
    //       <span className="row ml-2 ">
    //         <h5
    //           onClick={() => handleOpenPaymentHistory(params.row, "TP")}
    //           style={{ cursor: "pointer" }}
    //           className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
    //         >
    //           {/* Total Paid */}
    //           {nodeData
    //             .filter(
    //               (e) =>
    //                 e.vendor_name === params.row.vendor_name && e.status == 1
    //             )
    //             .reduce((acc, item) => acc + +item.request_amount, 0)}
    //         </h5>
    //       </span>
    //     ) : (
    //       <h5
    //         style={{ cursor: "pointer" }}
    //         className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
    //       >
    //         0
    //       </h5>
    //     );
    //   },
    // },
    // {
    //   field: "F.Y",
    //   headerName: "F.Y",
    //   width: 150,
    //   renderCell: (params) => {
    //     const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
    //     const currentYear = new Date().getFullYear();
    //     const startDate = new Date(
    //       `04/01/${
    //         isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
    //       }`
    //     );
    //     const endDate = new Date(
    //       `03/31/${
    //         isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
    //       }`
    //     );
    //     const dataFY = nodeData.filter((e) => {
    //       const paymentDate = new Date(e.request_date);
    //       return (
    //         paymentDate >= startDate &&
    //         paymentDate <= endDate &&
    //         e.vendor_name === params.row.vendor_name &&
    //         e.status !== 0 &&
    //         e.status !== 2
    //       );
    //     });
    //     return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
    //       .length > 0 ? (
    //       <h5
    //         onClick={() => handleOpenPaymentHistory(params.row, "FY")}
    //         style={{ cursor: "pointer" }}
    //         className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
    //       >
    //         {/* Financial Year */}

    //         {dataFY.reduce(
    //           (acc, item) => acc + parseFloat(item.request_amount),
    //           0
    //         )}
    //       </h5>
    //     ) : (
    //       <h5
    //         style={{ cursor: "pointer" }}
    //         className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
    //       >
    //         0
    //       </h5>
    //     );
    //   },
    // },
    {
      field: "Pan Img",
      headerName: "Pan Img",
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
      field: "gst_hold_amount",
      headerName: "GST Hold Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_hold_amount ? (
          <p>&#8377; {params.row.gst_hold_amount}</p>
        ) : (
          "NA"
        );
      },
    },
    {
      field: "tds_deduction",
      headerName: "TDS Amount",
      width: 150,
      renderCell: (params) => {
        console.log(params.row.tds_deduction, "tds_deduction");
        return params.row.tds_deduction ? (
          <p>&#8377; {params.row.tds_deduction}</p>
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
      filed: "payment_amount",
      headerName: "Payment Amount",
      width: 150,
      renderCell: (params) => {
        const paymentAmount = nodeData.filter(
          (e) => e.request_id == params.row.request_id
        )[0]?.payment_amount;
        return paymentAmount ? <p>&#8377; {paymentAmount}</p> : "NA";
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
        const matchingItems = actionFieldData.filter(
          (item) => item.request_id == params.row.request_id
        );
        if (matchingItems.length > 0) {
          return matchingItems.map((item, index) => (
            <p key={params.row.request_id}>
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
    {
      field: "gst_Hold_Bool",
      headerName: "GST Hold",
      renderCell: (params) => {
        return params.row.gst_Hold_Bool ? "Yes" : "No";
      },
    },
  ];

  // Combine aging data from filterData and nodeData
  const allData = [...filterData];
  const agingFilterData = allData.map((item) =>
    calculateDays(item.request_date, new Date())
  );

  // Calculate aging sum
  const agingSum = agingFilterData.reduce((sum, value) => sum + value, 0);

  // Calculate total number of aging count
  const agingCount = agingFilterData.length;

  // Calculate average aging
  const averageAging = Math.round(agingSum / agingCount);

  // Output the results
  console.log("Aging Sum:", agingSum);
  console.log("Aging Count:", agingCount);
  console.log("Average Aging:", averageAging);

  // Calculate GST amount and count

  const mergedData = data;

  // Calculate GST amount and count from merged data
  const gstHoldDataMerged = mergedData.filter((item) => {
    return item.gstHold == 1;
  });
  console.log(gstHoldDataMerged, "sdfsmanoj");
  const totalGstHoldCount = gstHoldDataMerged.length;
  const totalGstHoldAmount = gstHoldDataMerged.reduce(
    (total, item) => total + parseFloat(item.gst_hold),
    0
  );

  // Calculate total deducted amount and count from merged data
  const totalDeductedAmountMerged = data.filter(
    (item) => item.TDSDeduction == 1
  );
  const totalTDSDeductedCount = totalDeductedAmountMerged.length;
  const totalTDSDeductedAmount = totalDeductedAmountMerged.reduce(
    (total, item) => total + parseFloat(item.tds_deduction),
    0
  );

  // Function to filter data based on GST hold
  const filterDataByGstHold = () => {
    const filtered = data.filter((item) => item.gst_hold);
    setFilterData(gstHoldDataMerged);
  };

  // Function to filter data based on total deducted amount
  const filterDataByTotalDeductedAmount = () => {
    const filtered = mergedData.filter((item) => item.tds_deduction);
    setFilterData(totalDeductedAmountMerged);
  };

  // Function to filter data based on invoice presence
  const filterDataByInvoice = (withInvoice) => {
    if (withInvoice) {
      setFilterData(withInvoiceData);
    } else {
      setFilterData(withoutInvoiceData);
    }
  };

  // Event handler for the "With Invoice" button click
  const handleWithInvoiceButtonClick = () => {
    filterDataByInvoice(true);
  };

  // Event handler for the "Without Invoice" button click
  const handleWithoutInvoiceButtonClick = () => {
    filterDataByInvoice(false);
  };

  return (
    <div style={{ display: "flex", gap: "16px", flexDirection: "column" }} p>
      <FormContainer
        mainTitle="Purchase Dashboard"
        link="/admin/finance-pruchasemanagement-alltransaction"
        uniqueVendorCount={uniqueVendorCount}
        totalRequestAmount={totalRequestAmount}
        pendingRequestCount={pendingRequestCount}
        discardedRequestCount={discardedRequestCount}
        paidRequestCount={paidRequestCount}
        handleOpenUniqueVendorClick={handleOpenUniqueVendorClick}
        allTransactionAdditionalTitles={true}
      />

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
          <DataGrid
            rows={sameVendorData}
            columns={sameVenderColumns}
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
            getRowId={(row) => sameVendorData.indexOf(row)}
          />
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
        </DialogContent>
      </Dialog>
      <div className="card body-padding">
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label>Vendor Name</label>
              <Autocomplete
                value={vendorName}
                onChange={(event, newValue) => setVendorName(newValue)}
                options={Array.from(
                  new Set(data.map((option) => option.vendor_name))
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
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
      </div>
      <div className="row">
        <div className="card col-2 ms-2">
          <div className="card-header h4  fs-5">Pending</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Requested Amount :-{" "}
              {/* {filterData.length > 0
                ? filterData
                    .filter((item) => item.status == 0)
                    .reduce((total, currentItem) => {
                      return total + currentItem.request_amount * 1;
                    }, 0)
                : ""} */}
              {filterData.length > 0
                ? filterData
                    .filter((item) => {
                      return !nodeData.some(
                        (item2) => item.request_id == item2.request_id
                      );
                    })
                    .reduce((total, currentItem) => {
                      return total + parseFloat(currentItem.request_amount);
                    }, 0)
                : ""}
            </p>
            <p className="fs-6 lead ">
              {
                <Link
                  className="link-primary"
                  to="/admin/finance-pruchasemanagement-pendingpaymentrequest"
                >
                  Click Here
                </Link>
              }
            </p>
          </div>{" "}
        </div>{" "}
        <div className="card col-2 ms-2">
          <div className="card-header h4  fs-5">Done</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Requested Amount :-{" "}
              {/* {filterData.length > 0
                ? filterData
                    .filter((item) => item.status == 1)
                    .reduce((total, currentItem) => {
                      return total + currentItem.request_amount * 1;
                    }, 0)
                : ""} */}
              {/* {filterData.length > 0
                ? filterData
                    .filter((item) => {
                      // Adjust condition to filter for paid requests (assuming status code for paid requests is 1)
                      return (
                        parseFloat(item.status) === 1 &&
                        !nodeData.some(
                          (item2) => item.request_id === item2.request_id
                        )
                      );
                      // This condition checks if the item is paid and if its request_id is not found in nodeData
                    })
                    .reduce((total, currentItem) => {
                      return total + parseFloat(currentItem.request_amount);
                    }, 0)
                : ""} */}
              {filterData.length > 0
                ? filterData
                    .filter(
                      (item) =>
                        parseInt(item.status) === 1 &&
                        !nodeData.some(
                          (item2) => item.request_id === item2.request_id
                        )
                    )
                    .reduce(
                      (total, currentItem) =>
                        total + parseFloat(currentItem.request_amount),
                      0
                    )
                : 0}
            </p>
            <p className="fs-6 lead ">
              {
                <Link
                  className="link-primary"
                  to="/admin/finance-pruchasemanagement-paymentdone"
                >
                  Click Here
                </Link>
              }
            </p>
          </div>{" "}
        </div>{" "}
        <div className="card col-2 ms-2">
          <div className="card-header h4  fs-5">Discard</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Requested Amount :-{" "}
              {/* {filterData.length > 0
                ? filterData
                    .filter((item) => item.status == 0)
                    .reduce((total, currentItem) => {
                      return total + currentItem.request_amount * 1;
                    }, 0)
                : ""} */}
              {filterData.length > 0
                ? filterData
                    .filter((item) => {
                      // Adjust condition to filter for paid requests (assuming status code for paid requests is 1)
                      return (
                        parseFloat(item.status) === 2 &&
                        !nodeData.some(
                          (item2) => item.request_id === item2.request_id
                        )
                      );
                      // This condition checks if the item is paid and if its request_id is not found in nodeData
                    })
                    .reduce((total, currentItem) => {
                      return total + parseFloat(currentItem.request_amount);
                    }, 0)
                : ""}
            </p>
            <p className="fs-6 lead ">
              {
                <Link
                  className="link-primary"
                  to="/admin/finance-pruchasemanagement-discardpayment"
                >
                  Click Here
                </Link>
              }
            </p>
          </div>
        </div>
        <div className="card col-2 ms-2">
          <div className="card-header h4  fs-5">With Invoice</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              With Invoice Count :- {withInvoiceCount}
            </p>
            <p className="fs-6 lead ">
              <Link
                className="link-primary"
                onClick={handleWithInvoiceButtonClick}
              >
                Click Here
              </Link>
            </p>
          </div>
        </div>
        <div className="card col-2 ms-2">
          <div className="card-header h4 fs-5">Without Invoice</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Without Invoice Count :- {withoutInvoiceCount}
            </p>
            <p className="fs-6 lead ">
              <Link
                className="link-primary"
                onClick={handleWithoutInvoiceButtonClick}
              >
                Click Here
              </Link>
            </p>
          </div>
        </div>
        <div className="card col-2 ms-2">
          <div className="card-header h4 fs-5">GST Hold </div>
          <div className="card-body">
            <p className="fs-6 lead ">
              GST Hold Amount :- {totalGstHoldAmount}
            </p>
            <p className="fs-6 lead ">GST Hold Count :- {totalGstHoldCount}</p>
            <p className="fs-6 lead ">
              <Link className="link-primary" onClick={filterDataByGstHold}>
                Click Here
              </Link>
            </p>
          </div>
        </div>
        <div className="card col-2 ms-2">
          <div className="card-header h4 fs-5"> Average Payment Aging </div>
          <div className="card-body">
            <p className="fs-6 lead ">Average Aging :- {averageAging}</p>
          </div>
        </div>
        <div className="card col-2 ms-2">
          <div className="card-header h4 fs-5">TDS Deducted</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total TDS Deduction amount :-{Math.round(totalTDSDeductedAmount)}
            </p>
            <p className="fs-6 lead ">
              {" "}
              Total TDS Deduction Count :- {totalTDSDeductedCount}
            </p>
            <p className="fs-6 lead ">
              <Link
                className="link-primary"
                onClick={filterDataByTotalDeductedAmount}
              >
                Click Here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="card mt-3">
        <DataGrid
          rows={filterData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          disableMultipleColumnsSorting
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={(row) => row.request_id}
        />
      </div>
      {paymentHistory && (
        <PaymentHistoryDialog
          handleClose={setPaymentHistory}
          paymentDetailColumns={paymentDetailColumns}
          filterData={historyData}
        />
      )}

      {openImageDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setOpenImageDialog}
        />
      )}

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
    </div>
  );
}
