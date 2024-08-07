import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import DataTable from "react-data-table-component";
import {
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  Skeleton,
  DialogContent,
} from "@mui/material";
import { get } from "jquery";
import ImageView from "./ImageView";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { baseUrl } from "../../../utils/config";
import pdfImg from "./pdf-file.png";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { set } from "date-fns";
import moment from "moment";

const PendingApprovalUpdate = () => {
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [status, setStatus] = useState("");
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [paymentAmountFilter, setPaymentAmountFilter] = useState("");
  const [paymentAmountField, setPaymentAmountField] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [bankName, setBankName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setcampaignAmountField] = useState("");
  const [paymentMode, setPaymetMode] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [nonInvoiceCount, setNonInvoiceCount] = useState(0);
  const [nonGstCount, setNonGstCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleCopyDetail = (detail) => {
    navigator.clipboard.writeText(detail);
    toastAlert("Detail copied");
  };

  const ddmmyyConvesion = (date) => {
    if (date.startsWith("0000-00-00")) {
      return " ";
    }
    const date1 = new Date(date);
    const day = date1.getDate();
    const month = date1.getMonth() + 1;
    const year = date1.getFullYear();
    if (day == "NaN" || month == "NaN" || year == "NaN") {
      return " ";
    } else {
      return `${day}/${month}/${year}`;
    }
  };

  const handleStatusChange = async (row, selectedStatus) => {
    console.log(row, "Row Data >>>");
    setStatus(selectedStatus);

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("payment_update_id", row.payment_update_id);
    formData.append("payment_approval_status", selectedStatus);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("action_reason", "");
    formData.append("change_payment_update_status", 1);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=change_payment_update_status",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toastAlert("Status Updated Successfully");
          getData();
        }
      });

    setIsFormSubmitted(true);
  };

  function getData() {
    setLoading(true);
    axios.post(baseUrl + "add_php_finance_data_in_node").then((res) => {
      const custData = res.data.data.filter(
        (status) => status.payment_approval_status === "0"
      );
      setData(custData);
      setFilterData(custData);
      setLoading(false);
      const uniqueCustomers = new Set(custData.map((item) => item.cust_name));
      setUniqueCustomerCount(uniqueCustomers.size);
      const uniqueCustomerData = Array.from(uniqueCustomers).map(
        (customerName) => {
          return custData.find((item) => item.cust_name === customerName);
        }
      );
      setUniqueCustomerData(uniqueCustomerData);

      const nonGstCount = custData.filter((gst) => gst.gst_status === "0");
      setNonGstCount(nonGstCount.length);

      const withInvoiceImage = custData.filter(
        (item) => item.payment_screenshot && item.payment_screenshot.length > 0
      );
      const withoutInvoiceImage = custData.filter(
        (item) =>
          !item.payment_screenshot || item.payment_screenshot.length === 0
      );
      setInvoiceCount(withInvoiceImage.length);
      setNonInvoiceCount(withoutInvoiceImage.length);

      const dateFilterData = filterDataBasedOnSelection(custData);
      setFilterData(dateFilterData);
    });
  }
  function convertDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    getData();
  }, [dateFilter]);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.user_name?.toLowerCase().match(search.toLowerCase());
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
      const requestedByFilterPassed =
        !requestedBy ||
        item.user_name.toLowerCase().includes(requestedBy.toLowerCase());
      // Bank Name Filter
      const bankNameFilterPassed =
        !bankName || item.detail.toLowerCase().includes(bankName.toLowerCase());
      // Payment Status
      const paymentStatusFilterPassed =
        !paymentStatus ||
        (item.payment_approval_status === 0 &&
          paymentStatus.toLowerCase() === "pending") ||
        (item.payment_approval_status === 1 &&
          paymentStatus.toLowerCase() === "approved") ||
        (item.payment_approval_status === 2 &&
          paymentStatus.toLowerCase() === "rejected");
      //  Payment Mode
      const paymentModeFilterPassed =
        !paymentMode ||
        item.payment_mode.toLowerCase().includes(paymentMode.toLowerCase());
      //  Payment Amount Filter
      const paymentAmountFilterPassed = () => {
        const paymentAmount = parseFloat(paymentAmountField);
        switch (paymentAmountFilter) {
          case "greaterThan":
            return +item.payment_amount > paymentAmount;
          case "lessThan":
            return +item.payment_amount < paymentAmount;
          case "equalTo":
            return +item.payment_amount === paymentAmount;
          default:
            return true;
        }
      };
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
        requestedByFilterPassed &&
        bankNameFilterPassed &&
        paymentStatusFilterPassed &&
        paymentModeFilterPassed &&
        paymentAmountFilterPassed() &&
        campaignAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);

    const uniqueCustomers = new Set(filterData.map((item) => item.cust_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers).map(
      (customerName) => {
        return filterData.find((item) => item.cust_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setCustomerName("");
    setRequestedBy("");
    setBankName("");
    setPaymentAmountFilter("");
    setPaymentAmountField("");
    setcampaignAmountField("");
    setCampaignAmountFilter("");
    setPaymentStatus("");
    setPaymetMode("");

    const uniqueCustomers = new Set(datas.map((item) => item.cust_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers).map(
      (customerName) => {
        return datas.find((item) => item.cust_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
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

  // Call the function to get the total sum of requested amount
  const requestedAmountTotal = filterData.reduce(
    (total, item) => total + parseFloat(item.payment_amount_show),
    0
  );
  // All Counts:-
  const pendingCount = filterData.filter(
    (item) => item.payment_approval_status === "0"
  ).length;
  const approvedCount = datas.filter(
    (item) => item.payment_approval_status === "1"
  ).length;
  const rejectedCount = datas.filter(
    (item) => item.payment_approval_status === "2"
  ).length;

  const sameCustomerColumn = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...sameCustomerData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "user_name",
      headerName: "Requested By",
      name: <div style={{ whiteSpace: "normal" }}>Requested By</div>,
      renderCell: (params, index) => <div>{params.row.user_name} </div>,
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      name: <div style={{ whiteSpace: "normal" }}>Requested By</div>,
      renderCell: (params) => <div>{params.row.cust_name} </div>,
    },
    {
      field: "campaign_amount",
      headerName: "Campaign Amount Without GST",
      renderCell: (params) => <div>{params.row.campaign_amount} </div>,
    },
    {
      field: "campaign_amount_without_gst",
      headerName: "Campaign Amount Without GST",
      renderCell: (params) => (
        <div>{params.row.campaign_amount_without_gst} </div>
      ),
    },
    {
      field: "payment_date",
      headerName: "Payment On Date",
      renderCell: (params, index) => (
        <div>
          {convertDateToDDMMYYYY(params.row.campaign_amount_without_gst)}{" "}
        </div>
      ),
    },
    {
      field: "payment_screenshot",
      headerName: "Payment Screenshot",
      renderCell: (params) =>
        params.row.payment_screenshot ? (
          <div
            onClick={() => {
              setViewImgSrc(
                params.row.payment_screenshot
                  ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                  : ""
              ),
                setViewImgDialog(true);
            }}
            style={{ whiteSpace: "normal" }}
          >
            <img
              src={
                params.row.payment_screenshot.includes(".pdf")
                  ? pdfImg
                  : `https://sales.creativefuel.io/${params.row.payment_screenshot}`
              }
              //   row.payment_screenshot
              //     ? `https://sales.creativefuel.io/${row.payment_screenshot}`
              //     : ""
              // }
            />
          </div>
        ) : (
          "No Screenshot Available"
        ),
    },
    {
      field: "payment_amount",
      headerName: "Payment Amount",
      renderCell: (params) => <div>{params.row.payment_amount} </div>,
    },
    {
      field: "payment_mode",
      headerName: "Payment Mode",
      renderCell: (params) => <div>{params.row.payment_mode} </div>,
    },
    {
      field: "payment_approval_status",
      headerName: "Payment Status",
      renderCell: (params) => (
        <div>
          {params.row.payment_approval_status === 0
            ? "Pending"
            : params.row.payment_approval_status === 1
            ? "Approved"
            : params.row.payment_approval_status === 2
            ? "Rejected"
            : ""}
        </div>
      ),
    },
    {
      field: "title",
      headerName: "Bank Name ",
      renderCell: (params) => <div>{params.row.title} </div>,
    },
    {
      field: "detail",
      headerName: "Bank Detail ",
      renderCell: (params) => (
        <div>
          {params.row.detail}
          <button
            className="btn btn-secondary ml-2"
            onClick={() => handleCopyDetail(params.row.detail)}
          >
            <ContentCopyIcon />
            {/* or any other icon */}
          </button>
        </div>
      ),
    },
    {
      field: "payment_ref_no",
      headerName: "Reference No ",
      renderCell: (params) => <div>{params.row.payment_ref_no} </div>,
    },
    {
      field: "payment_update_remarks",
      headerName: "Remarks ",
      renderCell: (params) => <div>{params.row.payment_update_remarks} </div>,
    },
    {
      field: "balance_payment_ondate",
      headerName: "Payment Requested Date and Time ",
      renderCell: (params) => <div>{params.row.balance_payment_ondate} </div>,
    },
    {
      headerName: "Action ",
      renderCell: (params) => (
        <>
          <Link to={`/admin/payment-summary/${params.row.cust_id}`}>
            <button
              title="Summary"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <i className="bi bi-journal-text"></i>
            </button>
          </Link>
        </>
      ),
    },
  ];
  const uniqueCustomerColumn = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...uniqueCustomerData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "cust_name",
      fieldName: "Customer Name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameCustomer(params.row.cust_name)}
        >
          {params.row.cust_name}{" "}
        </div>
      ),
    },
    {
      field: "user_name",
      headerName: "Requested By",
      name: <div style={{ whiteSpace: "normal" }}>Requested By</div>,
      renderCell: (params, index) => <div>{params.row.user_name} </div>,
    },

    {
      field: "campaign_amount",
      headerName: "Campaign Amount Without GST",
      renderCell: (params) => <div>{params.row.campaign_amount} </div>,
    },
    {
      field: "campaign_amount_without_gst",
      headerName: "Campaign Amount Without GST",
      renderCell: (params) => (
        <div>{params.row.campaign_amount_without_gst} </div>
      ),
    },
    {
      field: "payment_date",
      headerName: "Payment On Date",
      renderCell: (params, index) => (
        <div>
          {convertDateToDDMMYYYY(params.row.campaign_amount_without_gst)}{" "}
        </div>
      ),
    },
    {
      field: "payment_screenshot",
      headerName: "Payment Screenshot",
      renderCell: (params) =>
        params.row.payment_screenshot ? (
          <div
            onClick={() => {
              setViewImgSrc(
                params.row.payment_screenshot
                  ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                  : ""
              ),
                setViewImgDialog(true);
            }}
            style={{ whiteSpace: "normal" }}
          >
            <img
              src={
                params.row.payment_screenshot.includes(".pdf")
                  ? pdfImg
                  : `https://sales.creativefuel.io/${params.row.payment_screenshot}`
              }
              //   row.payment_screenshot
              //     ? `https://sales.creativefuel.io/${row.payment_screenshot}`
              //     : ""
              // }
            />
          </div>
        ) : (
          "No Screenshot Available"
        ),
    },
    {
      field: "payment_amount",
      headerName: "Payment Amount",
      renderCell: (params) => <div>{params.row.payment_amount} </div>,
    },
    {
      field: "payment_mode",
      headerName: "Payment Mode",
      renderCell: (params) => <div>{params.row.payment_mode} </div>,
    },
    {
      field: "payment_approval_status",
      headerName: "Payment Status",
      renderCell: (params) => (
        <div>
          {params.row.payment_approval_status === 0
            ? "Pending"
            : params.row.payment_approval_status === 1
            ? "Approved"
            : params.row.payment_approval_status === 2
            ? "Rejected"
            : ""}
        </div>
      ),
    },
    {
      field: "title",
      headerName: "Bank Name ",
      renderCell: (params) => <div>{params.row.title} </div>,
    },
    {
      field: "detail",
      headerName: "Bank Detail ",
      renderCell: (params) => (
        <div>
          {params.row.detail}
          <button
            className="btn btn-secondary ml-2"
            onClick={() => handleCopyDetail(params.row.detail)}
          >
            <ContentCopyIcon />
            {/* or any other icon */}
          </button>
        </div>
      ),
    },
    {
      field: "payment_ref_no",
      headerName: "Reference No ",
      renderCell: (params) => <div>{params.row.payment_ref_no} </div>,
    },
    {
      field: "payment_update_remarks",
      headerName: "Remarks ",
      renderCell: (params) => <div>{params.row.payment_update_remarks} </div>,
    },
    {
      field: "balance_payment_ondate",
      headerName: "Payment Requested Date and Time ",
      renderCell: (params) => <div>{params.row.balance_payment_ondate} </div>,
    },
    {
      headerName: "Action ",
      renderCell: (params) => (
        <>
          <Link to={`/admin/payment-summary/${params.row.cust_id}`}>
            <button
              title="Summary"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <i className="bi bi-journal-text"></i>
            </button>
          </Link>
        </>
      ),
    },
  ];
  const columns = [
    {
      field: "s_no",
      headerName: "S.NO",
      width: 70,
      renderCell: (params, index) => (
        <div>{[...datas].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      width: 260,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameCustomer(params.row.cust_name)}
        >
          {params.row.cust_name}{" "}
        </div>
      ),
    },
    {
      headerName: "Requested By",
      field: "user_name",
      width: 180,
      name: <div style={{ whiteSpace: "normal" }}>Requested By</div>,
      renderCell: (params, index) => <div>{params.row.user_name} </div>,
    },
    {
      headerName: "Requested Date & Time",
      field: "creation_date",
      width: 180,
      renderCell: (params) => {
        new Date(params.row.creation_date).toLocaleDateString("en-IN") +
          " " +
          new Date(params.row.creation_date).toLocaleTimeString("en-IN");
      },
    },

    {
      headerName: "Campaign Amount",
      field: "campaign_amount",
      width: 180,
      renderCell: (params) => <div>{params.row.campaign_amount} </div>,
    },
    {
      headerName: "Campaign Amount Without GST",
      field: "campaign_amount_without_gst",
      width: 180,
      renderCell: (params) => (
        <div>{params.row.campaign_amount_without_gst} </div>
      ),
    },
    {
      headerName: "Payment On Date",
      field: "payment_date",
      width: 180,
      renderCell: (params, index) => (
        <div>{convertDateToDDMMYYYY(params.row.payment_date)} </div>
      ),
    },
    {
      headerName: "Payment Screenshot",
      field: "payment_screenshot",
      width: 180,
      renderCell: (params) =>
        params.row.payment_screenshot ? (
          <div
            onClick={() => {
              setViewImgSrc(
                params.row.payment_screenshot
                  ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                  : ""
              ),
                setViewImgDialog(true);
            }}
            style={{ whiteSpace: "normal" }}
          >
            <img
              src={
                params.row.payment_screenshot.includes(".pdf")
                  ? pdfImg
                  : `https://sales.creativefuel.io/${params.row.payment_screenshot}`
              }
              //   row.payment_screenshot
              //     ? `https://sales.creativefuel.io/${row.payment_screenshot}`
              //     : ""
              // }
            />
          </div>
        ) : (
          "No Screenshot Available"
        ),
    },
    {
      headerName: "Balance Amount",
      field: "payment_amount",
      width: 180,
      renderCell: (params) => <div>{params.row.payment_amount_show} </div>,
    },
    {
      headerName: "Payment Mode",
      field: "payment_mode",
      width: 180,
      renderCell: (params) => <div>{params.row.payment_mode} </div>,
    },
    {
      headerName: "Payment Status",
      field: "payment_approval_status",
      width: 190,
      renderCell: (params) => (
        <div>
          {params.row.payment_approval_status === "0"
            ? "Pending"
            : params.row.payment_approval_status === "1"
            ? "Approved"
            : params.row.payment_approval_status === "2"
            ? "Rejected"
            : ""}
        </div>
      ),
    },
    {
      headerName: "Bank Name ",
      field: "title",
      width: 180,
      renderCell: (params) => <div>{params.row.title} </div>,
    },
    {
      headerName: "Bank Detail ",
      field: "detail",
      width: 490,
      renderCell: (params) => (
        <div className="flexCenter colGap8">
          <button
            className="btn tableIconBtn btn_sm "
            onClick={() => handleCopyDetail(params.row.detail)}
          >
            <ContentCopyIcon />
            {/* or any other icon */}
          </button>
          {params.row.detail}
        </div>
      ),
      // width: 150,
    },
    {
      headerName: "Reference No ",
      field: "payment_ref_no",
      width: 190,
      renderCell: (params) => <div>{params.row.payment_ref_no} </div>,
    },
    {
      headerName: "Remarks ",
      field: "payment_update_remarks",
      width: 200,
      renderCell: (params) => <div>{params.row.payment_update_remarks} </div>,
    },
    {
      width: 200,
      // field: "Status",
      headerName: "Status",
      renderCell: ({ row }) => (
        <Autocomplete
          className="my-2"
          id="combo-box-demo"
          value={row.statusDropdown}
          options={[
            { label: "Approved", value: 1 },
            { label: "Rejected", value: 2 },
          ]}
          getOptionLabel={(option) => option.label}
          onChange={(event, newValue) => {
            handleStatusChange(row, newValue.value),
              console.log(newValue.value, "value DATA >>>");
          }}
          style={{ width: 180 }}
          renderInput={(params) => (
            <TextField {...params} label="Status" variant="outlined" />
          )}
        />
      ),
    },

    {
      headerName: "Payment Requested Date and Time ",
      field: "balance_payment_ondate",
      width: 180,
      renderCell: (params) => (
        <div>
          {params.row.created_at ? ddmmyyConvesion(params.row.created_at) : ""}{" "}
        </div>
      ),
    },
    {
      field: "Action ",
      renderCell: (params) => (
        <>
          <Link to={`/admin/payment-summary/${params.row.cust_id}`}>
            <button
              title="Summary"
              className="btn tableIconBtn btn_sm btn-outline-primary user-button"
            >
              <i className="bi bi-journal-text"></i>
            </button>
          </Link>
        </>
      ),
    },
  ];
  // monthwise / datewise filter
  const filterDataBasedOnSelection = (apiData) => {
    const now = moment();
    switch (dateFilter) {
      case "last7Days":
        return apiData.filter((item) =>
          moment(item.creation_date).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "last30Days":
        return apiData.filter((item) =>
          moment(item.creation_date).isBetween(
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
          moment(item.creation_date).isBetween(
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
          moment(item.creation_date).isBetween(
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
          moment(item.creation_date).isBetween(
            startOfMonth,
            endOfMonth,
            "day",
            "[]"
          )
        );
      // case "nextMonth":
      //   const startOfNextMonth = now.clone().add(1, "months").startOf("month");
      //   const endOfNextMonth = now.clone().add(1, "months").endOf("month");
      //   return apiData.filter((item) =>
      //     moment(item.request_date).isBetween(
      //       startOfNextMonth,
      //       endOfNextMonth,
      //       "day",
      //       "[]"
      //     )
      //   );
      case "currentQuarter":
        const quarterStart = moment().startOf("quarter");
        const quarterEnd = moment().endOf("quarter");
        return apiData.filter((item) =>
          moment(item.creation_date).isBetween(
            quarterStart,
            quarterEnd,
            "day",
            "[]"
          )
        );
      case "today":
        return apiData.filter((item) =>
          moment(item.creation_date).isSame(now, "day")
        );
      default:
        return apiData;
    }
  };

  return (
    <div>
      <FormContainer
        mainTitle="Pending Approval "
        link="/admin/finance-alltransaction"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        uniqueCustomerCount={uniqueCustomerCount}
        totalRequestAmount={requestedAmountTotal}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
        nonGstCount={nonGstCount}
        invoiceCount={invoiceCount}
        nonInvoiceCount={nonInvoiceCount}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        pendingApprovalAdditionalTitles={true}
      />

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
                    <option value="today">Today</option>
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
                          label="Vendor Name"
                          type="text"
                          style={{ color: "var(--gray-600)" }}
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
                    <label>Requested By</label>
                    <Autocomplete
                      value={requestedBy}
                      onChange={(event, newValue) => setRequestedBy(newValue)}
                      options={Array.from(
                        new Set(datas.map((option) => option.user_name))
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Requested By"
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
                    <label>Bank Name</label>
                    <Autocomplete
                      value={bankName}
                      onChange={(event, newValue) => setBankName(newValue)}
                      options={Array.from(
                        new Set(datas.map((option) => option.detail))
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Bank Name"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control",
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
                    <label>Payment Status</label>
                    <Autocomplete
                      value={paymentStatus}
                      onChange={(event, newValue) => setPaymentStatus(newValue)}
                      options={Array.from(
                        new Set(
                          datas.map((option) =>
                            option.payment_approval_status === 0
                              ? "Pending"
                              : option.payment_approval_status === 1
                              ? "Approved"
                              : option.payment_approval_status === 2
                              ? "Rejected"
                              : ""
                          )
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Status"
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
                    <label>Payment Mode</label>
                    <Autocomplete
                      value={paymentMode}
                      onChange={(event, newValue) => setPaymetMode(newValue)}
                      options={Array.from(
                        new Set(datas.map((option) => option.payment_mode))
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Mode"
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
                    <label>Pay Amount Filter</label>
                    <select
                      value={paymentAmountFilter}
                      className="form-control"
                      onChange={(e) => setPaymentAmountFilter(e.target.value)}
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
                    <label>Payment Amount</label>
                    <input
                      value={paymentAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setPaymentAmountField(e.target.value);
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
                      placeholder="Campaign Amount"
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
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card" style={{ height: "600px" }}>
            <div className="card-body thm_table">
              {/* {!loading ? ( */}
              <DataGrid
                rows={filterData}
                columns={columns}
                // pageSize={5}
                // rowsPerPageOptions={[5]}
                disableSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                getRowId={(row) => filterData.indexOf(row)}
              />
              {/* ) : ( */}
              {/* <Skeleton
                  sx={{ bgcolor: "grey.900", borderRadius: "0.25rem" }}
                  variant="rectangular"
                  width="100%"
                  height={200}
                />
              )} */}
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
            columns={sameCustomerColumn}
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
            columns={uniqueCustomerColumn}
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
            getRowId={(row) => row._id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingApprovalUpdate;
