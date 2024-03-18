import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import ImageView from "./ImageView";
import { baseUrl } from "../../../utils/config";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Button,
  Checkbox,
  // ButtonGroupButtonContext,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useGlobalContext } from "../../../Context/Context";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function TaskPending() {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const { toastAlert, toastError } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [requestAmountFilter, setRequestAmountFilter] = useState("");
  const [requestedAmountField, setRequestedAmountField] = useState("");
  const [uniqueVendorCount, setUniqueVendorCount] = useState(0);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [uniqueVenderDialog, setUniqueVenderDialog] = useState(false);
  const [uniqueVendorData, setUniqueVendorData] = useState([]);
  const [sameVendorDialog, setSameVendorDialog] = useState(false);
  const [sameVendorData, setSameVendorData] = useState([]);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [bankDetail, setBankDetail] = useState(false);
  const [nodeData, setNodeData] = useState([]);
  const [type, setHistoryType] = useState("");
  const [row, setRowData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [phpData, setPhpData] = useState([]);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [pending, setPending] = useState(false);
  const [dateData, setDateData] = useState("");
  const [remarkData, setRemarkData] = useState("");
  const [rowId, setRowId] = useState("");
  const [bankDetailRowData, setBankDetailRowData] = useState([]);
  const [reqDate, setReqDate] = useState("");
  const [paymentAmout, setPaymentAmount] = useState("");
  const [baseAmount, setBaseAmount] = useState(0);
  const [payDialog, setPayDialog] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [payRemark, setPayRemark] = useState("");
  const [payMentProof, setPayMentProof] = useState("");
  const [TDSDeduction, setTDSDeduction] = useState(false);
  const [gstHold, setGstHold] = useState(false);
  const [GSTHoldAmount, setGSTHoldAmount] = useState(0);
  const [TDSValue, setTDSValue] = useState(0);
  const [TDSPercentage, setTDSPercentage] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState("Fully Paid");
  const [userName, setUserName] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    dayjs(new Date()).add(5, "hours").add(30, "minutes").$d.toGMTString()
  );
  const [paymentModeData, setPaymentModeData] = useState([]);


  const navigate = useNavigate();

  const handleClosePayDialog = () => {
    setPayDialog(false);
    setPaymentMode("");
    setPayRemark("");
    setPayMentProof("");
    setPaymentAmount("");
    setTDSDeduction(false);
    setGstHold(false);
  };

  const handlePayVendorClick = () => {
    // displayRazorpay(paymentAmout);
    // return;
    const formData = new FormData();
    formData.append("request_id", row.request_id);
    formData.append("vendor_id", row.vendor_id);
    formData.append("request_by", row.request_by);
    formData.append("request_amount", row.request_amount);
    formData.append("priority", row.priority);
    formData.append("status", 1); //status will be Change Soon
    formData.append("evidence", payMentProof);
    formData.append("payment_mode", paymentMode);
    formData.append("payment_amount", paymentAmout);
    formData.append("payment_by", userID);
    formData.append("remark_finance", payRemark);
    formData.append("invc_no", row.invc_no);
    formData.append("invc_Date", row.invc_Date);
    formData.append("invc_remark", row.invc_remark);
    formData.append("remark_audit", row.remark_audit);
    formData.append("outstandings", row.outstandings);
    formData.append("vendor_name", row.vendor_name);
    formData.append("name", row.name);
    formData.append("request_date", row.request_date);
    formData.append("payment_date", paymentDate);
    formData.append("gst_hold", row.gst_amount);
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
        phpFormData.append("request_id", row.request_id);
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
        phpFormData.append("gst_hold", row.gst_amount);
        phpFormData.append("gst_hold_amount", GSTHoldAmount);
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
          .then(() => {
            toastAlert("Payment Done Successfully");

            WhatsappAPI.callWhatsAPI(
              "Extend Date by User",
              JSON.stringify(9109266387),
              row.vendor_name,
              [paymentAmout, row.vendor_name, row.mob1]
            );
          });

        setPaymentMode("");
        setPayRemark("");
        setPayMentProof("");
        handleClosePayDialog();
        setPaymentAmount("");
        callApi();
      });
  };

  const accordionButtons = ["Zoho", "GST", "TDS"];

  const callApi = () => {
    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      setNodeData(res.data.modifiedData);
      const x = res.data.modifiedData;

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          setPhpData(res.data.body);

          let y = x.filter((item) => {
            if (item.status == 1) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some((item2) => item.request_id == item2.request_id);
          });
          setData(u);
          setFilterData(u);
          setPendingRequestCount(u.length);
        });
    });
    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      setUserName(res.data.user_name);
    });

  };

  const handleUniqueVendor = () => {
    const uniqueVendors = new Set(filterData.map((item) => item.vendor_name));
    // setUniqueVendorCount(uniqueVendors.size);
    const uvData = [];
    uniqueVendors.forEach((vendorName) => {
      const vendorRows = nodeData.filter(
        (item) => item.vendor_name === vendorName
      );
      uvData.push(vendorRows[0]);
    });
    const uniqueCount = uvData.filter((e) =>
      activeAccordionIndex == 0
        ? e?.zoho_status !== "Done"
        : activeAccordionIndex == 1
        ? e?.gst_status !== "Done"
        : e?.tds_status !== "Done"
    );
    console.log(uniqueCount.length, "uniqueCount");
    console.log(uniqueCount, "COUNT");

    setUniqueVendorData(uvData);
    setUniqueVendorCount(uniqueCount.length);
  };
  // pending data submit
  const handlePendingSubmit = async (id, type) => {
    console.log(id, "ID");
    try {
      let payload = {};

      // Construct payload based on the dialogType and other factors
      if (type === "Zoho") {
        payload = {
          request_id: parseFloat(id),
          zoho_remark: remarkData,
          zoho_date: dateData,
          zoho_status: "Done",
        };
      } else if (type === "GST") {
        payload = {
          request_id: parseFloat(id),
          gst_remark: remarkData,
          gst_date: dateData,
          gst_status: "Done",
        };
      } else if (type === "TDS") {
        payload = {
          request_id: parseFloat(id),
          tds_remark: remarkData,
          tds_date: dateData,
          tds_status: "Done",
        };
      }

      // Make the PUT request using Axios
      const response = await axios
        .put(baseUrl + "phpvendorpaymentrequest", payload)
        .then((res) => {
          console.log(res.data.request_id, "Request ID");
          res.data.success ? navigate(`/admin/finance-task-done/${type}`) : "";
          // setFilterData((prevData) =>
          //   prevData.filter(
          //     (item) => item.request_id !== parseFloat(res.data.request_id)
          //   )
          // );
        });
    } catch (error) {
      // Handle error if the request fails
      console.error("Error:", error);
    }
  };
  // ========================
  useEffect(() => {
    callApi();
  }, []);

  useEffect(() => {
    handleUniqueVendor();
  }, [activeAccordionIndex, filterData]);

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

  // total requested  amount data :-
  const filterPaymentAmount = nodeData.filter((item) =>
    data.some((e) => e.request_id == item.request_id)
  );

  const totalRequestAmount = filterPaymentAmount.reduce(
    (total, item) => total + parseFloat(Math.round(item.payment_amount)),
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

    setHistoryData(type == "FY" ? dataFY : dataTP);
  };
  const handleClosePaymentHistory = () => {
    setPaymentHistory(false);
  };

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  // Dialog For Pending :-
  const handleOpenPendingClick = (id, data) => {
    setPending(true);
    setRowId(id);
    setReqDate(data);
  };

  const YYYYMMDDdateConverter = (date) => {
    let dateObj = new Date(date);
    let month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Month in 2 digits
    let day = String(dateObj.getUTCDate()).padStart(2, "0"); // Day in 2 digits
    let year = dateObj.getUTCFullYear(); // Year in 4 digits
    let newdate = year + "-" + month + "-" + day;
    return newdate;
  };
  const handleClosePending = () => {
    setPending(false);
  };

  const handleOpenBankDetail = (row) => {
    let x = [];
    x.push(row);

    setBankDetailRowData(x);
    setBankDetail(true);
  };
  const handleCloseBankDetail = () => {
    setBankDetail(false);
  };

  // same Vender columns:-
  const sameVenderColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = sameVendorData.indexOf(params.row);
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
        const rowIndex = uniqueVendorData
          .filter((e) =>
            activeAccordionIndex == 0
              ? e.zoho_status !== "Done"
              : activeAccordionIndex == 1
              ? e.gst_status !== "Done"
              : e.tds_status !== "Done"
          )
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
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex =
          activeAccordionIndex === 0
            ? //  filterData.indexOf(params.row)
              filterData
                .filter((item) => {
                  return nodeData.some(
                    (item2) =>
                      item.request_id == item2.request_id &&
                      item2.zoho_status != "Done"
                  );
                })
                .indexOf(params.row)
            : activeAccordionIndex === 1
            ? // filterData.indexOf(params.row)

              filterData
                .filter((item) => {
                  return nodeData.some(
                    (item2) =>
                      item.request_id == item2.request_id &&
                      item2.gst_status != "Done"
                  );
                })
                .indexOf(params.row)
            : activeAccordionIndex === 2
            ? filterData
                .filter((item) => {
                  return nodeData.some(
                    (item2) =>
                      item.request_id == item2.request_id &&
                      item2.tds_status != "Done"
                  );
                })
                .indexOf(params.row)
            : // filterData.indexOf(params.row)
              "";
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "Action",
      width: 160,
      renderCell: (params) => (
        <div>
          <Button
            type="button"
            variant="outlined"
            style={{ cursor: "pointer", marginRight: "20px" }}
            onClick={() => {
              handleOpenPendingClick(
                params.row.request_id,
                params.row.request_date
              );
            }}
          >
            Pending
          </Button>
        </div>
      ),
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
          <>
            <iframe
              allowFullScreen={true}
              src={imgUrl}
              title="PDF Viewer"
              style={{ width: "80px", height: "80px" }}
            />
            <div
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(imgUrl);
              }}
              style={{
                position: "absolute",
                width: "4.4%",
                height: " 94%",
                cursor: "pointer",
                background: "rgba(0, 0, 0, 0)",
                zIndex: 10,
              }}
            ></div>
          </>
        ) : (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={imgUrl}
            alt="Invoice"
            style={{ width: "80px", height: "80px" }}
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
        return params.row.name;
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{ cursor: "pointer", marginRight: "20px" }}
              onClick={() => handleOpenSameVender(params.row.vendor_name)}
            >
              {params.row.vendor_name}
            </div>
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
      field: "total_paid",
      headerName: "Total Paid",
      width: 150,
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
            e.status !== 2
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
      headerName: "PAN",
      width: 200,
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
      field: "gst_Hold_Bool",
      headerName: "GST Hold",
      renderCell: (params) => {
        console.log(params.row.gst_Hold_Bool, "gst_Hold_Bool");
        return params.row.gstHold == 1 ? "Yes" : "No";
      },
    },
  ];

//  {activeAccordionIndex == 1 && columns.push({
    
//       field: "Action",
//       headerName: "Action",
//       width: 250,
//       renderCell: (params) => {
//         return (
//           <div>
//             <button
//               className="btn btn-sm btn-success"
//               onClick={() => handlePayClick(params.row)}
//             >
//               Pay
//             </button>
//             <button
//               className="btn btn-sm btn-danger mx-2"
//               onClick={() => handleDiscardClick(params.row)}
//             >
//               discard
//             </button>
//           </div>
//         );
//       },
    
//   });}

const handleGSTHoldInputChange = (e) => {
  if (e.target.value > row.gst_amount) {
    toastError("GST Hold Amount can't be greater than GST Amount");
  } else {
    setGSTHoldAmount(e.target.value);
  }
};
const handleTDSDeduction = (e) => {
  setTDSDeduction(e.target.checked);
  setTDSPercentage(1);
};
const handleGstHold = (e) => {
  console.log(e.target.checked, "checked");
  setGstHold(e.target.checked);
  setGSTHoldAmount(row.gst_amount);
};

const handlePayClick = (row,e) => {
e.preventDefault()
  setRowData(row);
  setPaymentAmount(row.request_amount);
  setBaseAmount(row.base_amount != 0 ? row.base_amount : row.request_amount);
  setPayDialog(true);
};


  {activeAccordionIndex == 1 && columns.splice(1  , 1,    {
    field: "Action",
    headerName: "Action",
    width: 250,
    renderCell: (params) => {
      return (
        <div>
          <button
            className="btn btn-sm btn-success"
            onClick={(e) => handlePayClick(params.row,e)}
          >
            Pay
          </button>
          {/* <button
            className="btn btn-sm btn-danger mx-2"
            onClick={() => handleDiscardClick(params.row)}
          >
            discard
          </button> */}
        </div>
      );
    },
  },)}
  return (
    <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
      <FormContainer
        mainTitle="Pending"
        link="/admin/finance-pruchasemanagement-paymentdone"
        uniqueVendorCount={uniqueVendorCount}
        totalRequestAmount={totalRequestAmount}
        pendingRequestCount={pendingRequestCount}
        handleOpenUniqueVendorClick={handleOpenUniqueVendorClick}
        paymentDoneAdditionalTitles={true}
      />
      {/* Dialog For Pending */}
      <Dialog
        open={pending}
        onClose={handleClosePending}
        fullWidth={"sm"}
        maxWidth={"sm"}
        sx={{
          // display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Pending</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClosePending}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <div className="row ms-2 me-2">
          <div className="col ">
            <div className="form-group ">
              <label>Date</label>
              <input
                // value={fromDate}
                type="date"
                className="form-control"
                onChange={(e) => setDateData(e.target.value)}
                min={YYYYMMDDdateConverter(reqDate)}
              />
            </div>
          </div>
        </div>
        <div className="row ms-2 me-2">
          <div className="col">
            <div className="form-group">
              <label>Remark</label>
              <textarea
                // value={requestedAmountField}
                type="number"
                placeholder="Request Amount"
                className="form-control"
                onChange={(e) => {
                  setRemarkData(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="row ms-2">
          <div className="col">
            <div className="form-group">
              {activeAccordionIndex === 0 ? (
                <Button
                  variant="contained"
                  onClick={() => handlePendingSubmit(rowId, "Zoho")}
                >
                  Submit
                </Button>
              ) : (
                ""
              )}
              {activeAccordionIndex === 1 ? (
                <Button
                  variant="contained"
                  onClick={() => handlePendingSubmit(rowId, "GST")}
                >
                  Submit
                </Button>
              ) : (
                ""
              )}
              {activeAccordionIndex === 2 ? (
                <Button
                  variant="contained"
                  onClick={() => handlePendingSubmit(rowId, "TDS")}
                >
                  Submit
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Dialog>
      {/* Same Vendors Dialog */}
      <Dialog
        open={sameVendorDialog}
        onClose={handleCloseSameVender}
        fullWidth={"md"}
        maxWidth={"md"}
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
            // rows={uniqueVendorData}
            rows={uniqueVendorData.filter((e) =>
              activeAccordionIndex == 0
                ? e.zoho_status !== "Done"
                : activeAccordionIndex == 1
                ? e.gst_status !== "Done"
                : e.tds_status !== "Done"
            )}
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
      <FormContainer
        submitButton={false}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        mainTitleRequired={false}
      >
        <div className="tab-content">
          {activeAccordionIndex === 0 && (
            <div className="mt-3">
              <DataGrid
                rows={filterData.filter((item) => {
                  return nodeData.some(
                    (item2) =>
                      item.request_id == item2.request_id &&
                      item2.zoho_status != "Done"
                  );
                })}
                columns={columns}
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
                getRowId={(row) => filterData.indexOf(row)}
              />
            </div>
          )}
          {activeAccordionIndex === 1 && (
            <div className="mt-3">
              {filterData.some(
                (row) =>
                  row.gstHold !== undefined &&
                  row.gstHold !== null &&
                  row.gstHold === 1
              ) ||
              nodeData.some(
                (row) =>
                  row.gst_Hold_Bool !== undefined &&
                  row.gst_Hold_Bool !== null &&
                  row.gst_Hold_Bool === true
              ) ? (
                <DataGrid
                  rows={filterData.filter((item) => {
                    return nodeData.some(
                      (item2) =>
                        item.request_id == item2.request_id &&
                        item2.gst_status != "Done"
                    );
                  })}
                  columns={columns}
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
                  getRowId={(row) => filterData.indexOf(row)}
                />
              ) : (
                ""
              )}
            </div>
          )}
          {activeAccordionIndex === 2 && (
            <div className="mt-3">
              {filterData.some(
                (row) =>
                  row.TDSDeduction !== undefined &&
                  row.TDSDeduction !== null &&
                  row.TDSDeduction === 1
              ) ||
              nodeData.some(
                (row) =>
                  row.tds_Deduction_Bool !== undefined &&
                  row.tds_Deduction_Bool !== null &&
                  row.tds_Deduction_Bool === true
              ) ? (
                <DataGrid
                  rows={filterData.filter((item) => {
                    return nodeData.some(
                      (item2) =>
                        item.request_id == item2.request_id &&
                        item2.tds_status != "Done"
                    );
                  })}
                  columns={columns}
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
                  getRowId={(row) => filterData.indexOf(row)}
                />
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </FormContainer>

      {openImageDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setOpenImageDialog}
        />
      )}
      {/* Bank Detail dialog */}
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

        {/* <DataGrid
          rows={bankDetailRowData}
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
        /> */}

        <TextField
          id="outlined-multiline-static"
          // label="Multiline"
          multiline
          value={bankDetailRowData[0]?.payment_details}
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
      {/* Pyament History */}
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
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={(row) => row.request_id}
        />
      </Dialog>


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
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={row.vendor_name}
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
              className="col-md-5 ml-2"
              value={row.address}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="Address"
              type="text"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={row.mob1}
              autoFocus
              margin="dense"
              // disabledreadOnly
              readOnly
              label="Mobile"
              type="text"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              className="col-md-5 ml-2"
              value={row.pan}
              autoFocus
              margin="dense"
              // disabled
              readOnly
              label="Pan"
              type="text"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={row.gst}
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
              className="col-md-5 ml-2"
              value={`₹${row.outstandings}`}
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
          <div className="row">
            <TextField
              className="col-md-3 me-3"
              value={`₹${row.request_amount}`}
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
            <TextField
              className="col-md-4 "
              value={`₹${row.gst_amount ? row.gst_amount : 0}`}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="GST Amount"
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
                  disabled={row.gst_amount == 0}
                />
              }
              label="GST Hold"
            />
            <FormControlLabel
              className="col-md-5"
              control={<Checkbox onChange={handleTDSDeduction} />}
              label="TDS Deduction"
            />
            {gstHold && (
              <TextField
                className="col-md-5 me-3"
                value={GSTHoldAmount}
                onChange={handleGSTHoldInputChange}
                autoFocus
                margin="dense"
                id="name"
                label="GST Hold"
              />
            )}
            {TDSDeduction && (
              <>
                <Autocomplete
                  onChange={(e, value) => setTDSPercentage(value)}
                  disablePortal
                  className="col-md-3 mt-2"
                  value={TDSPercentage}
                  id="combo-box-demo"
                  options={[
                    1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                    19, 20,
                  ]}
                  renderInput={(params) => (
                    <TextField {...params} label="TDS %" placeholder="TDS %" />
                  )}
                />
                <TextField
                  className="col-md-3 mt-2"
                  value={TDSValue}
                  autoFocus
                  readOnly
                  margin="dense"
                  id="name"
                  label="TDS Amount"
                />
              </>
            )}

            <TextField
              className="col-md-6 me-3"
              value={row.name}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="Requested By"
              type="text"
              variant="outlined"
            />
            <TextField
              className="col-md-5 ml-2"
              value={convertDateToDDMMYYYY(row.request_date)}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="Request Date"
              type="text"
              variant="outlined"
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-11 ml-3"
              value={row.t3}
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
              options={
                paymentModeData.length > 0
                  ? paymentModeData.map((item) => item.payment_mode)
                  : []
              }
              fullWidth={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Mode *"
                  placeholder="Payment Mode"
                />
              )}
            />

            <Autocomplete
              onChange={(e, value) => setPaymentStatus(value)}
              value={paymentStatus}
              disablePortal
              disabled
              className=" mt-2"
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
              InputProps={{
                readOnly: gstHold || TDSDeduction,
              }}
              onChange={(e) => {
                row.request_amount;

                const currentValue = e.target.value;
                if (/^\d+$/.test(currentValue) || currentValue === "") {
                  // setPaymentAmount(currentValue);
                  if (currentValue <= +row.request_amount) {
                    setPaymentAmount(currentValue);
                    setPaymentStatus;
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


    </div>
  );
}
