import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import { Autocomplete, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { Link } from "react-router-dom";
import ImageView from "./ImageView";
import pdf from "./pdf-file.png";
import { baseUrl } from "../../../utils/config";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentHistoryDialog from "../../PaymentHistory/PaymentHistoryDialog";


export default function PurchaseManagementAllTransaction() {
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
          // let y = res.data.body.filter((item) => {
          //   return x.some((item2) =>( item.request_id == item2.request_id));
          // });
          // console.log(res.data.body.filter((item) => {
          //   return x.some((item2) =>( item.request_id == item2.request_id));
          // }),'y')
          let y = res.data.body;
          setData(y);
          setFilterData(y);
          // console.log(y, "y");
          // let y = x;

          // let u = res.data.body.filter((item) => {
          //   return !y.some((item2) => item.request_id == item2.request_id);
          // });
          // console.log(u, "u");
          // setData(u);
          // setFilterData(u);
        });
    });
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

  const handleOpenBankDetail = () => {
    setBankDetail(true);
  };

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
    console.log(dataFY, "dataFY");
    console.log(phpData, "phpData");

    const dataTP = phpData.filter((e) => {
      return (
        e.vendor_name === row.vendor_name && e.status != 0 && e.status != 2
      );
    });
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
        if (params.row.invc_img.length > 0) {
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
        if(params.row.invc_img.length > 0){
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
        )}
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
      // width: "auto",
      width: 370,

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
      field: "Status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const matchingItems = actionFieldData.filter(
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
  return (
    <div>
      <FormContainer
        mainTitle="All Transaction"
        link="/admin/finance-pruchasemanagement-alltransaction"
      />
      <div className="row">
        <div className="card col-4">
          <div className="card-header h4">Pending</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Requested Amount :-{" "}
              {data.length > 0
                ? data
                    .filter((item) => item.payment_approval_status == 0)
                    .reduce((total, currentItem) => {
                      return total + currentItem.request_amount * 1;
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
        <div className="card col-4">
          <div className="card-header h4">Done</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Requested Amount :-{" "}
              {data.length > 0
                ? data
                    .filter((item) => item.status == 1)
                    .reduce((total, currentItem) => {
                      return total + currentItem.request_amount * 1;
                    }, 0)
                : ""}
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
        <div className="card col-4">
          <div className="card-header h4">Discard</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Requested Amount :-{" "}
              {data.length > 0
                ? data
                    .filter((item) => item.status == 0)
                    .reduce((total, currentItem) => {
                      return total + currentItem.request_amount * 1;
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
      </div>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label>Vendor Name</label>
            <Autocomplete
              value={vendorName}
              onChange={(event, newValue) => setVendorName(newValue)}
              options={data.map((option) => option.vendor_name)}
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
      <DataGrid
        rows={filterData}
        columns={columns}
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
        getRowId={(row) => filterData.indexOf(row)}
      />
      {openImageDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setOpenImageDialog}
        />
      )}

{paymentHistory && (
        <PaymentHistoryDialog
          handleClose={setPaymentHistory}
          paymentDetailColumns={paymentDetailColumns}
          filterData={historyData}
        />
      )}

    </div>
  );
}
