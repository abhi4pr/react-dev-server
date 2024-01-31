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
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { baseUrl } from "../../../utils/config";

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
  const [paymentDate, setPaymentDate] = useState("");
  const [userName, setUserName] = useState("");

  const callApi = () => {
    axios
      .get(`${baseUrl}`+`addPhpVendorPaymentRequest`)
      .then((res) => {
        console.log(res);
      });

    axios
      .get(baseUrl+"phpvendorpaymentrequest")
      .then((res) => {
        console.log(res.data.modifiedData, "node");
        const x = res.data.modifiedData;

        axios
          .get(
            "https://production.we-fit.in/webservices/RestController.php?view=getpaymentrequest"
          )
          .then((res) => {
            console.log(res.data.body, "php");
            let y = res.data.body.filter((item) => {
              return !x.some((item2) => item.request_id == item2.request_id);
            });
            setData(y);
            setFilterData(y);
          });
      });

    axios
      .get(`${baseUrl}`+`get_single_user/${userID}`)
      .then((res) => {
        setUserName(res.data.user_name);
      });
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
    // formData.append("invc_image", payMentProof);//invc_no will be Change Soon
    formData.append("remark_audit", rowData.remark_audit);
    formData.append("outstandings", rowData.outstandings);
    formData.append("vendor_name", rowData.vendor_name);
    formData.append("name", rowData.name);
    formData.append("request_date", rowData.request_date);
    formData.append("payment_date", paymentDate);

    axios
      .post(baseUrl+"phpvendorpaymentrequest", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const phpFormData = new FormData();
        phpFormData.append("request_id", rowData.request_id);
        phpFormData.append("payment_amount", paymentAmout);
        phpFormData.append("payment_date", paymentDate);
        phpFormData.append("payment_by", userName);
        phpFormData.append("evidence", payMentProof);
        phpFormData.append("finance_remark", payRemark);
        phpFormData.append("status", 1);
        phpFormData.append("payment_mode", paymentMode);
        axios
          .post(
            "https://production.we-fit.in/webservices/RestController.php?view=updatePaymentrequestNew",
            phpFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            console.log(res);
            toastAlert("Payment Done Successfully");
          });
        console.log(res);
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
      if (
        (date >= fromDate1 && date <= toDate1) ||
        item.vendor_name.toLowerCase().includes(vendorName.toLowerCase())
      ) {
        return item;
      }
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
  };

  const handlePayClick = (row) => {
    setRowData(row);
    setPayDialog(true);
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
        // Extract file extension and check if it's a PDF
        const fileExtension = params.row.invc_img
          .split(".")
          .pop()
          .toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://production.we-fit.in/uploads/payment_proof/${params.row.invc_img}`;

        return isPdf ? (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={pdf}
            style={{ width: "100px", height: "100px" }}
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
      />
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label>Vendor Name</label>
            <input
              value={vendorName}
              type="text"
              placeholder="Name"
              className="form-control"
              onChange={(e) => {
                setVendorName(e.target.value);
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

      {/*Dialog Box */}
      <Dialog open={payDialog} onClose={handleClosePayDialog}>
        <DialogTitle>vendor Payment</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClosePayDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        ><CloseIcon /></IconButton>
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
                  console.log(
                    new Date(
                      newValue
                        .add(5, "hours")
                        .add(30, "minutes")
                        .$d.toGMTString()
                    )
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
          setViewImgDialog={setOpenImageDialog}
        />
      )}
    </div>
  );
}
