import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { Autocomplete, Button, TextField } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {baseUrl} from '../../../utils/config'
import ImageView from "./ImageView";
import pdfImg from "./pdf-file.png";

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
  const [paymentAmount, setPaymentAmount] = useState();
  const [paymentMode, setPaymetMode] = useState("");
  const [status, setStatus] = useState();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymetMethod, setPaymetMethod] = useState([]);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);

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
        const matchesAmount =
          !paymentAmount ||
          (d.payment_amount &&
            d.payment_amount.toString() === paymentAmount.toString());

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
          matchesAmount &&
          matchesMode &&
          matchesStatus &&
          dateMatch(d.payment_date, fromDate, toDate)
        );
      });

    setFilterData(result);
  };

  const handleClear = () => {
    setRequestedBy("");
    setCustName("");
    setPaymentAmount();
    setPaymetMode("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setFilterData(datas);
  };

  function getData() {
    axios
      .post(baseUrl+"add_php_payment_acc_data_in_node")
      .then((res) => {
        console.log("data save in local success");
      });
    axios
      .get(baseUrl+"get_all_php_finance_data")
      .then((res) => {
        setData(res.data.data);
        setFilterData(res.data.data);
      });

    axios
      .get(baseUrl+"get_all_php_payment_acc_data")
      .then((res) => {
        setPaymetMethod(res.data.data);
        // let x =res.data.data.map(e=>{
        //   setPaymetMethod(prev=>[...prev,{payment_type:e.payment_type}])
        // })
        // console.log(res.data.data)
        // console.log(res.data.data.map(e=>{
        //  return e.payment_type})
        // )
      });
  }
  function convertDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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

  const columns = [
    {
      name: "Id",
      cell: (row, index) => (
        <div style={{ whiteSpace: "normal" }}>{index + 1}</div>
      ),
      width: "7%",
      sortable: true,
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Requested By</div>,
      selector: (row) => (
        <div style={{ whiteSpace: "normal" }}>{row.user_name} </div>
      ),
      width: "8%",
      sortable: false,
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Customer Name</div>,
      selector: (row) => (
        <div style={{ whiteSpace: "normal" }}>{row.cust_name}</div>
      ),
      width: "8%",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Campaign Amount</div>,
      selector: (row) => (
        <div style={{ whiteSpace: "normal" }}>{row.campaign_amount} </div>
      ),
      width: "170px",
    },
    {
      name: (
        <div style={{ whiteSpace: "normal" }}>Campaign Amount Without Gst</div>
      ),
      selector: (row) => row.campaign_amount_without_gst,
      width: "6%",
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
      name: <div style={{ whiteSpace: "normal" }}>Payment Amount</div>,
      selector: (row) => row.payment_amount,
      width: "6%",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Payment Mode</div>,
      selector: (row) => row.payment_mode,
      width: "6%",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Payment View</div>,
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
      name: "Bank Name",
      selector: (row) => (
        <div style={{ whiteSpace: "normal" }}>{row.title} </div>
      ),
    },
    {
      name: "Screenshot",
      cell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {row.payment_screenshot.includes(".pdf") ? (
            <img src={pdfImg} onClick={() => {
              setViewImgSrc(
                row.payment_screenshot
                  ? `https://sales.creativefuel.io/${row.payment_screenshot}`
                  : ""
              ),
                setViewImgDialog(true);
            }} />
          ) : 
            <img
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
            />
          

          }
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
      name: "Bank Detail",
      cell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {row.detail}
          <Button
            // key={row.detail}
            color="secondary"
            onClick={() => handleCopyDetail(row.detail)}
            style={{ marginLeft: "10px" }}
          >
            <ContentCopyIcon />
          </Button>
        </div>
      ),
      width: "200px",
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Reference No</div>,
      selector: (row) => row.payment_ref_no,
      width: "5%",
    },
    {
      name: "Remarks",
      selector: (row) => row.payment_update_remarks,
      width: "8%",
    },
    {
      name: "Status",
      // selector: (row) => "Approved"
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
      width: "4%",
    },
  ];

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
      />
      <div className="row">
        <div className="card col-4">
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
                <Link
                  className="link-primary"
                  to="/admin/finance-pendingapproveupdate"
                >
                  Click Here
                </Link>
              }
            </p>
          </div>
        </div>
        <div className="card col-4">
          <div className="card-header fs-6 lead">Approved</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Approver Amount :- ₹{" "}
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
                <Link
                  className="link-primary"
                  to="/admin/finance-pendingapproveupdate"
                >
                  Click Here
                </Link>
              }
            </p>
          </div>
        </div>
        <div className="card col-4">
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
                <Link
                  className="link-primary"
                  to="/admin/finance-pendingapproveupdate"
                >
                  Click Here
                </Link>
              }
            </p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="data_tbl table-responsive">
          <div className="row ml-2">
            <div className="col-md-2">
              <div className="form-group">
                <label>Requested By</label>
                <input
                  value={requestedBy}
                  type="text"
                  placeholder="Request By"
                  className="form-control"
                  onChange={(e) => {
                    setRequestedBy(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  value={custName}
                  type="text"
                  placeholder="Request By"
                  className="form-control"
                  onChange={(e) => {
                    setCustName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Payment Amount</label>
                <input
                  value={paymentAmount}
                  type="number"
                  placeholder="Request By"
                  className="form-control"
                  onChange={(e) => {
                    setPaymentAmount(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Payment Mode</label>
                {/* <input
                  value={paymentMode}
                  type="text"
                  placeholder="Request By"
                  className="form-control"
                  onChange={(e) => {
                    setPaymetMode(e.target.value);
                  }}
                /> */}

                {/* <select className="form-select" onChange={e=>setPaymetMode(e.target.value)}  >
                  <option value="">Select Payment Mode</option>
                  {paymetMethod.map((item,index)=>{
                    return <option key={index} value={item.title}>{item.title}</option>
                  })}
                </select> */}
               <Autocomplete
  value={paymentMode}
  onChange={(event, newValue) => {
    setPaymetMode(newValue);
  }}
  options={paymetMethod.map((option) => option.payment_type)}
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
        borderRadius: '0.25rem',
        transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
        '&:focus': {
          borderColor: '#80bdff',
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        }
      }}
    />
  )}
/>


              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Status</label>
                {/* <select onChange={e=>setStatus(e.target.value)}  >
                  <option value="">Select Status</option>
                  <option value="0">Pending</option>
                  <option value="1">Approved</option>
                  <option value="2">Rejected</option>
                </select> */}
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
          <DataTable
            title="Dashboard"
            columns={columns}
            data={filterData}
            keyField="index"
            fixedHeader
            // pagination
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
