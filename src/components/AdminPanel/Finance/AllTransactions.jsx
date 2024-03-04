import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DataTable from "react-data-table-component";
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogTitle,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { baseUrl } from "../../../utils/config";
import ImageView from "./ImageView";
import pdfImg from "./pdf-file.png";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const AllTransactions = () => {
  const { toastAlert } = useGlobalContext();
  const [displaySeq, setDisplaySeq] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [requestedBy, setRequestedBy] = useState("");
  const [custName, setCustName] = useState("");
  const [paymentAmountFilter, setPaymentAmountFilter] = useState();
  const [paymentAmountField, setPaymentAmountField] = useState();
  const [paymentMode, setPaymetMode] = useState("");
  const [status, setStatus] = useState();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymetMethod, setPaymetMethod] = useState([]);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  // const [priorityFilter, setPriorityFilter] = useState("");
  // const [requestAmountFilter, setRequestAmountFilter] = useState("");
  // const [requestedAmountField, setRequestedAmountField] = useState("");

  const handleFilter = () => {
    const result = datas
      .map((d, index) => ({
        ...d,
        key: index,
      }))
      .filter((d) => {
        const matchesUser =
          !requestedBy ||
          (d.user_name &&
            d.user_name.toLowerCase().includes(requestedBy.toLowerCase()));
        const matchesCust =
          !custName ||
          (d.cust_name &&
            d.cust_name.toLowerCase().includes(custName.toLowerCase()));

        const paymentAmountFilterPassed = () => {
          const paymentAmount = parseFloat(paymentAmountField);
          switch (paymentAmountFilter) {
            case "greaterThan":
              return +d.payment_amount > paymentAmount;
            case "lessThan":
              return +d.payment_amount < paymentAmount;
            case "equalTo":
              return +d.payment_amount === paymentAmount;
            default:
              return true;
          }
        };

        const matchesMode =
          !paymentMode ||
          (d.payment_mode &&
            d.payment_mode.toLowerCase().includes(paymentMode.toLowerCase()));
        const matchesStatus = status
          ? d.payment_approval_status === status.value
          : true;
        const dateMatch = (date, fromDate, toDate) => {
          const dateToCheck = new Date(date);
          const startDate = new Date(fromDate);
          const endDate = new Date(toDate);
          return (
            (dateToCheck.getTime() >= startDate.getTime() &&
              dateToCheck.getTime() <= endDate.getTime()) ||
            !fromDate ||
            !toDate
          );
        };

        return (
          matchesUser &&
          matchesCust &&
          matchesMode &&
          matchesStatus &&
          dateMatch(d.payment_date, fromDate, toDate) &&
          paymentAmountFilterPassed()
        );
      });

    setFilterData(result);
  };

  const handleClear = () => {
    setRequestedBy("");
    setCustName("");
    setPaymentAmountFilter("");
    setPaymentAmountField("");
    setPaymetMode("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setFilterData(datas);
  };

  function getData() {
    axios.post(baseUrl + "add_php_payment_acc_data_in_node").then((res) => {});
    axios.get(baseUrl + "get_all_php_finance_data").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
      const custData = res.data.data;
      const uniqueCustomers = new Set(custData.map((item) => item.cust_name));
      setUniqueCustomerCount(uniqueCustomers.size);
      const uniqueCustomerData = Array.from(uniqueCustomers).map(
        (customerName) => {
          return custData.find((item) => item.cust_name === customerName);
        }
      );
      setUniqueCustomerData(uniqueCustomerData);
    });

    axios.get(baseUrl + "get_all_php_payment_acc_data").then((res) => {
      setPaymetMethod(res.data.data);
      // let x =res.data.data.map(e=>{
      //   setPaymetMethod(prev=>[...prev,{payment_type:e.payment_type}])
      // })
      // console.log(res.data.data.map(e=>{
      //  return e.payment_type})
      // )
    });
  }
  function convertDateToDDMMYYYY(dateString) {
    if (String(dateString).startsWith("0000-00-00")) {
      return " ";
    }
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    if (day == "NaN" || month == "NaN" || year == "NaN") {
      return " ";
    } else {
      return `${day}/${month}/${year}`;
    }
  }

  const handleCopyDetail = (detail) => {
    navigator.clipboard.writeText(detail);
    toastAlert("Detail copied");
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.assetsName?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
    console.log(uniqueCustomerData, "unique cust data");
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

  const calculateRequestedAmountTotal = () => {
    let totalAmount = 0;
    uniqueCustomerData.forEach((customer) => {
      totalAmount += parseFloat(customer.payment_amount);
    });
    return totalAmount;
  };

  // Call the function to get the total sum of requested amount
  const requestedAmountTotal = calculateRequestedAmountTotal();
  console.log("Total Requested Amount Total:", requestedAmountTotal);

  // Counts According to status:-
  const pendingCount = filterData.filter(
    (item) => item.payment_approval_status === 0
  ).length;
  const approvedCount = filterData.filter(
    (item) => item.payment_approval_status === 1
  ).length;
  const rejectedCount = filterData.filter(
    (item) => item.payment_approval_status === 2
  ).length;

  const sameCustomerColumn = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...filterData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
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
      field: "title",
      headerName: "Bank Name ",
      renderCell: (params) => <div>{params.row.title} </div>,
    },
    {
      field: "payment_screenshot",
      headerName: "Screenshot ",
      renderCell: (params) => (
        <div>
          {params.row.payment_screenshot.includes(".pdf") ? (
            <img
              src={pdfImg}
              onClick={() => {
                setViewImgSrc(
                  params.row.payment_screenshot
                    ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
            />
          ) : (
            <img
              onClick={() => {
                setViewImgSrc(
                  params.row.payment_screenshot
                    ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
              src={
                params.row.payment_screenshot
                  ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                  : ""
              }
            />
          )}
        </div>
      ),
    },
    {
      field: "detail",
      headerName: "Bank Detail ",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {params.row.detail}
          <Button
            // key={row.detail}
            color="secondary"
            onClick={() => handleCopyDetail(params.row.detail)}
            style={{ marginLeft: "10px" }}
          >
            <ContentCopyIcon />
          </Button>
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

        <div>{[...filterData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
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
      field: "title",
      headerName: "Bank Name ",
      renderCell: (params) => <div>{params.row.title} </div>,
    },
    {
      field: "payment_screenshot",
      headerName: "Screenshot ",
      renderCell: (params) => (
        <div>
          {params.row.payment_screenshot.includes(".pdf") ? (
            <img
              src={pdfImg}
              onClick={() => {
                setViewImgSrc(
                  params.row.payment_screenshot
                    ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
            />
          ) : (
            <img
              onClick={() => {
                setViewImgSrc(
                  params.row.payment_screenshot
                    ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
              src={
                params.row.payment_screenshot
                  ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                  : ""
              }
            />
          )}
        </div>
      ),
    },
    {
      field: "detail",
      headerName: "Bank Detail ",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {params.row.detail}
          <Button
            // key={row.detail}
            color="secondary"
            onClick={() => handleCopyDetail(params.row.detail)}
            style={{ marginLeft: "10px" }}
          >
            <ContentCopyIcon />
          </Button>
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
      headerName: "S.No",
      renderCell: ({ row }) => <div>{filterData.indexOf(row) + 1}</div>,
      width: 70,
    },
    {
      headerName: "Requested By",
      field: "user_name",
      renderCell: (params) => <div>{params.row.user_name} </div>,
    },
    {
      headerName: " Customer Name",
      field: "cust_name",
      renderCell: (params) => <div>{params.row.cust_name}</div>,
    },
    {
      headerName: "Campaign Amount",
      field: "campaign_amount",
      renderCell: (params) => <div>{params.row.campaign_amount} </div>,
    },
    {
      headerName: "Campaign Amount Without Gst",
      field: "campaign_amount_without_gst",
      renderCell: (params) => params.row.campaign_amount_without_gst,
    },
    {
      headerName: "Payment On Date",
      field: "payment_date",
      renderCell: (params) => (
        <div>{convertDateToDDMMYYYY(params.row.payment_date)}</div>
      ),
    },
    {
      headerName: "Payment Amount",
      field: "payment_amount",
      renderCell: (params) => params.row.payment_amount,
    },
    {
      headerName: " Payment Mode",
      field: "payment_mode",
      renderCell: (params) => params.row.payment_mode,
    },
    {
      headerName: "Payment View",
      // selector: (row) => row.payment_approval_status,
      // cell: (row) => (
      //   <div style={{ whiteSpace: "normal" }}>
      //   {row.payment_approval_status === 0
      //     ? "Pending"
      //     : row.payment_approval_status === 1
      //     ? "Approved"
      //     : row.payment_approval_status === 2
      //     ? "Rejected"
      //     : ""}
      // </div>)
    },
    {
      headerName: "Bank Name",
      field: "payment_mode",
      renderCell: (params) => <div>{params.row.title} </div>,
      width: 150,
    },
    {
      headerName: "Screenshot",
      renderCell: (params) => (
        <div>
          {params.row.payment_screenshot.includes(".pdf") ? (
            <img
              src={pdfImg}
              onClick={() => {
                setViewImgSrc(
                  params.row.payment_screenshot
                    ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
            />
          ) : (
            <img
              onClick={() => {
                setViewImgSrc(
                  params.row.payment_screenshot
                    ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
              src={
                params.row.payment_screenshot
                  ? `https://sales.creativefuel.io/${params.row.payment_screenshot}`
                  : ""
              }
            />
          )}
          {/* <img
            onClick={() => {
              setViewImgSrc(
                row.payment_screenshot
                  ? `https://sales.creativefuel.io/${row.payment_screenshot}`
                  : ""
              ),
                setViewImgDialog(true);
            }}
            src={
              row.payment_screenshot
                ? `https://sales.creativefuel.io/${row.payment_screenshot}`
                : ""
            }
          /> */}
        </div>
      ),
    },
    {
      width: 250,
      headerName: "Bank Detail",
      field: "detail",
      renderCell: (params) => (
        <div>
          <Button
            // key={row.detail}
            color="secondary"
            onClick={() => handleCopyDetail(params.row.detail)}
            // style={{ marginLeft: "10px" }}
          >
            <ContentCopyIcon />
          </Button>{" "}
          {params.row.detail}
        </div>
      ),
    },
    {
      headerName: "Reference No",
      field: "payment_ref_no",
      renderCell: (params) => params.row.payment_ref_no,
    },
    {
      headerName: "Remarks",
      field: "payment_update_remarks",
      renderCell: (params) => params.row.payment_update_remarks,
    },
    {
      headerName: "Status",
      field: "payment_approval_status",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
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
      headerName: "Action",
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

  const handlePendingClick = () => {
    const filtered = datas.filter((item) => item.payment_approval_status === 0);
    setFilterData(filtered);
  };
  const handleApprovedClick = () => {
    const filtered = datas.filter((item) => item.payment_approval_status === 1);
    setFilterData(filtered);
  };
  const handleRejectedClick = () => {
    const filtered = datas.filter((item) => item.payment_approval_status === 2);
    setFilterData(filtered);
  };
  return (
    <>
      <FormContainer
        mainTitle="Dashboard"
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
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        dashboardAdditionalTitles={true}
      />
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
      </Dialog>
      <div className="row ms-2 me-1">
        <div className="card col-4  ">
          <div className="card-header fs-6 lead">Pending</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Requested Amount :- ₹{" "}
              {datas.length > 0
                ? datas
                    .filter((item) => item.payment_approval_status == 0)
                    .reduce((total, currentItem) => {
                      return total + currentItem.payment_amount * 1;
                    }, 0)
                : ""}
            </p>
            <p className="fs-6 lead ">
              {
                <Link className="link-primary" onClick={handlePendingClick}>
                  Click Here
                </Link>
              }
            </p>
          </div>
        </div>
        <div className="card col-4  ">
          <div className="card-header fs-6 lead">Approved</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Approved Amount :- ₹{" "}
              {datas.length > 0
                ? datas
                    .filter((item) => item.payment_approval_status == 1)
                    .reduce((total, currentItem) => {
                      return total + currentItem.payment_amount * 1;
                    }, 0)
                : ""}
            </p>
            <p className="fs-6 lead ">
              {
                <Link className="link-primary" onClick={handleApprovedClick}>
                  Click Here
                </Link>
              }
            </p>
          </div>
        </div>
        <div className="card col-4 ">
          <div className="card-header fs-6 lead">Rejected</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Rejected Amount :- ₹{" "}
              {datas.length > 0
                ? datas
                    .filter((item) => item.payment_approval_status == 2)
                    .reduce((total, currentItem) => {
                      return total + currentItem.payment_amount * 1;
                    }, 0)
                : ""}
            </p>
            <p className="fs-6 lead ">
              {
                <Link className="link-primary" onClick={handleRejectedClick}>
                  Click Here
                </Link>
              }
            </p>
          </div>
        </div>
      </div>
      <div className="card mt-3">
        <div className="data_tbl table-responsive">
          <div className="row ml-2 mt-4 me-3">
            <div className="col-md-2">
              <div className="form-group">
                <label>Requested By</label>
                <Autocomplete
                  value={requestedBy}
                  onChange={(event, newValue) => {
                    setRequestedBy(newValue);
                  }}
                  options={Array.from(
                    new Set(datas.map((option) => option.user_name))
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Payment Mode"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        className: "form-control", // Apply Bootstrap's form-control class
                      }}
                      // Applying inline styles to match Bootstrap's form-control as closely as possible
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
            <div className="col-md-2">
              <div className="form-group">
                <label>Customer Name</label>
                <Autocomplete
                  value={custName}
                  onChange={(event, newValue) => {
                    setCustName(newValue);
                  }}
                  options={Array.from(
                    new Set(datas.map((option) => option.cust_name))
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Payment Mode"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        className: "form-control", // Apply Bootstrap's form-control class
                      }}
                      // Applying inline styles to match Bootstrap's form-control as closely as possible
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
                <label>Payment Amount Filter</label>
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
            <div className="col-md-3">
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
            <div className="col-md-2">
              <div className="form-group">
                <label>Payment Mode</label>
                <Autocomplete
                  value={paymentMode}
                  onChange={(event, newValue) => {
                    setPaymetMode(newValue);
                  }}
                  options={Array.from(
                    new Set(paymetMethod.map((option) => option.payment_type))
                  )}
                  getOptionLabel={(option) => (option ? option : "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Payment Mode"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        className: "form-control", // Apply Bootstrap's form-control class
                      }}
                      // Applying inline styles to match Bootstrap's form-control as closely as possible
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
            <div className="col-md-2">
              <div className="form-group">
                <label>Status</label>
                <Autocomplete
                  value={status?.title}
                  onChange={(event, newValue) => {
                    setStatus(newValue);
                  }}
                  options={[
                    { title: "Pending", value: 0 },
                    { title: "Approved", value: 1 },
                    { title: "Rejected", value: 2 },
                  ]}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        type="text"
                        {...params.inputProps}
                        className="form-control"
                        placeholder="Select Status"
                      />
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>From Date</label>
                <input
                  value={fromDate}
                  className="form-control"
                  type="date"
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>To Date</label>
                <input
                  value={toDate}
                  className="form-control"
                  type="date"
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-1 mt-4">
              <div className="form-group">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFilter}
                >
                  {" "}
                  Search{" "}
                </Button>
              </div>
            </div>
            <div className="col-md-1 mt-4">
              <div className="form-group">
                <Button variant="contained" color="error" onClick={handleClear}>
                  {" "}
                  Clear{" "}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="card mt-3">
          <DataGrid
            rows={filterData}
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
      </div>
      {viewImgDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setViewImgDialog}
        />
      )}
    </>
  );
};

export default AllTransactions;
