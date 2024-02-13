import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { Autocomplete, TextField } from "@mui/material";
import { get } from "jquery";
import ImageView from "./ImageView";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { baseUrl } from "../../../utils/config";
import pdfImg from "./pdf-file.png";
import { Button } from "@mui/material";

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
  // const []

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleCopyDetail = (detail) => {
    navigator.clipboard.writeText(detail);
    toastAlert("Detail copied");
  };

  const handleStatusChange = async (row, selectedStatus) => {
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
        console.log(res);
        getData();
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  function getData() {
    axios.post(baseUrl + "add_php_finance_data_in_node").then((res) => {
      console.log("data save in local success");
    });
    setTimeout(() => {
      axios.get(baseUrl + "get_all_php_finance_data_pending").then((res) => {
        setData(res.data.data);
        setFilterData(res.data.data);
      });
    }, 1000);
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
    // handleAllFilters();
  }, []);
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

      //  Payment Amount Filter
      const paymentAmountFilterPassed = () => {
        const paymentAmount = parseFloat(paymentAmountField);
        console.log("switch");
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
      const allFiltersPassed =
        dateFilterPassed &&
        customerNameFilterPassed &&
        requestedByFilterPassed &&
        bankNameFilterPassed &&
        paymentAmountFilterPassed();

      return allFiltersPassed;
    });
    console.log(filterData, "FD??????????????");
    setFilterData(filterData);
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
  };
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...filterData].reverse().indexOf(row) + 1}</div>
      ),
      width: "80px",
      sortable: true,
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Requested By</div>,
      selector: (row) => (
        <div style={{ whiteSpace: "normal" }}>{row.user_name} </div>
      ),
      width: "100px",
      sortable: false,
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Customer Name</div>,
      selector: (row) => (
        <div style={{ whiteSpace: "normal" }}>{row.cust_name}</div>
      ),
      width: "200px",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Campaign Amount</div>,
      selector: (row) => (
        <div style={{ whiteSpace: "normal" }}>{row.campaign_amount} </div>
      ),
      width: "150px",
    },
    {
      name: (
        <div style={{ whiteSpace: "normal" }}>Campaign Amount Without Gst</div>
      ),
      selector: (row) => row.campaign_amount_without_gst,
      width: "200px",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Payment On Date</div>,
      // selector: (row) => row.payment_date,
      cell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(row.payment_date)}
        </div>
      ),
      width: "150px",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Screenshot</div>,
      // selector: (row) => row.payment_time,
      cell: (row) => (
        <div
          onClick={() => {
            setViewImgSrc(
              row.payment_screenshot
                ? `https://sales.creativefuel.io/${row.payment_screenshot}`
                : ""
            ),
              setViewImgDialog(true);
          }}
          style={{ whiteSpace: "normal" }}
        >
          <img
            src={
              row.payment_screenshot.includes(".pdf")
                ? pdfImg
                : `https://sales.creativefuel.io/${row.payment_screenshot}`
            }
            //   row.payment_screenshot
            //     ? `https://sales.creativefuel.io/${row.payment_screenshot}`
            //     : ""
            // }
          />
        </div>
      ),
      width: "150px",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Payment Amount</div>,
      selector: (row) => row.payment_amount,
      width: "150px",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Payment Mode</div>,
      selector: (row) => row.payment_mode,
      width: "150px",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Payment Status</div>,
      // selector: (row) => row.payment_approval_status, // 0 = pending, 1 = approved, 2 = rejected
      cell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {row.payment_approval_status === 0
            ? "Pending"
            : row.payment_approval_status === 1
            ? "Approved"
            : row.payment_approval_status === 2
            ? "Rejected"
            : ""}
        </div>
      ),
    },
    {
      name: "Bank Name",
      selector: (row) => (
        <div style={{ whiteSpace: "normal" }}>{row.title} </div>
      ),
    },
    {
      name: "Bank Detail",
      cell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {row.detail}
          <button
            className="btn btn-secondary ml-2"
            onClick={() => handleCopyDetail(row.detail)}
          >
            <ContentCopyIcon />
            {/* or any other icon */}
          </button>
        </div>
      ),
      width: "250px",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Reference No</div>,
      selector: (row) => row.payment_ref_no,
      width: "150px",
    },
    {
      name: "Remarks",
      selector: (row) => row.payment_update_remarks,
      width: "200px",
    },
    {
      name: "Status",
      selector: (row) => (
        // <select
        //   className="form-control"
        //   value={row.statusDropdown}
        //   onChange={(e) => handleStatusChange(row, e.target.value)}
        // >
        //   <option value="">Select</option>
        //   <option value="1">Approved</option>
        //   <option value="0">Rejected</option>
        // </select>

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
              console.log(newValue.value);
          }}
          style={{ width: 180 }}
          renderInput={(params) => (
            <TextField {...params} label="Status" variant="outlined" />
          )}
        />
      ),
      width: "230px",
    },
    // {
    //   name: "Payment Requested Date and Time",
    //   selector: (row) => row.balance_payment_ondate,
    //   width: "200px",
    // },
    {
      name: "Action",
      selector: (row) => (
        <>
          <Link to={`/admin/payment-summary/${row.cust_id}`}>
            <button
              title="Summary"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <i className="bi bi-journal-text"></i>
            </button>
          </Link>
        </>
      ),
      width: "150px",
    },
  ];
  // console.log(fromDate, "HIIIIIIIIIIIIIIIIIIIIIIIII", toDate);
  return (
    <>
      <FormContainer
        mainTitle="Pending Approval "
        link="/admin/finance-alltransaction"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label>Customer Name</label>
            <input
              value={customerName}
              type="text"
              placeholder="Name"
              className="form-control"
              onChange={(e) => {
                setCustomerName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Requested By</label>
            <input
              value={requestedBy}
              type="text"
              placeholder="Name"
              className="form-control"
              onChange={(e) => {
                setRequestedBy(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Bank Name</label>
            <input
              value={bankName}
              type="text"
              placeholder="Name"
              className="form-control"
              onChange={(e) => {
                setBankName(e.target.value);
              }}
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

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Pending Approval"
            columns={columns}
            data={[...filterData].reverse()}
            keyField="_id"
            fixedHeader
            pagination
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
        {viewImgDialog && (
          <ImageView
            viewImgSrc={viewImgSrc}
            setViewImgDialog={setViewImgDialog}
          />
        )}
      </div>
    </>
  );
};

export default PendingApprovalUpdate;
