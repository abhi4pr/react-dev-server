import  { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export default function PendingPaymentRequest() {
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

  const callApi = () => {
    axios.get("https://production.we-fit.in/webservices/RestController.php?view=getpaymentrequest").then((res) => {
      console.log(res.data.body)
      setData(res.data.body);
      setFilterData(res.data.body);
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

  const handleDiscardClick = (row) => {
    axios
      .delete(`http://34.93.221.166:3000/api/delete_demo/${row._id}`)
      .then(() => {
        callApi();
      });
  };

  const handleDateFilter = () => {
    const filterData = data.filter((item) => {
      const date = new Date(item.t10);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      if (date >= fromDate1 && date <= toDate1) {
        return item;
      }
    });
    setFilterData(filterData);
  };

  const handleClosePayDialog = () => {
    setPayDialog(false);
  };

  const handleClearDateFilter = () => {
    setFilterData(data);
    setFromDate("");
    setToDate("");
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
      field: "t10",
      headerName: "Requested Date",
      width: 150,
      renderCell: (params) => {
        return convertDateToDDMMYYYY(params.row.request_date);
      },
    },
    {
      field: "t1",
      headerName: "Requested By",
      width: 150,
      renderCell: (params) => {
        return params.row.t1;
      },
    },
    {
      field: "t2",
      headerName: "Vendor Name",
      width: 150,
      renderCell: (params) => {
        return params.row.t2;
      },
    },
    {
      field: "t3",
      headerName: "Remark",
      width: 150,
      renderCell: (params) => {
        return params.row.t3;
      },
    },
    {
      field: "t13",
      headerName: "Priority",
      width: 150,
      renderCell: (params) => {
        return params.row.t13;
      },
    },
    {
      field: "t4",
      headerName: "Requested Amount",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.t4}</p>;
      },
    },
    {
      field: "t5",
      headerName: "OutStanding ",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.t5}</p>;
      },
    },
    {
      field: "t11",
      headerName: "Ageing",
      width: 150,
      renderCell: (params) => {
        return <p> {calculateDays(params.row.t10, new Date())} Days</p>;
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
        <div className="col-md-4">
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
        <div className="col-md-4">
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
        <div className="col-md-3 mt-4">
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
        // checkboxSelection
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
        getRowId={(row) => row._id}
      />

      {/*Dialog Box */}
      <Dialog open={payDialog} onClose={handleClosePayDialog}>
        <DialogTitle>vendor Payment</DialogTitle>
        <DialogContent>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={rowData.t2}
              autoFocus
              margin="dense"
              id="name"
              disabled
              label="Vendor Name"
              type="text"
              variant="outlined"
            />
            <TextField
              className="col-md-5 ml-2"
              value={rowData.t2}
              autoFocus
              margin="dense"
              id="name"
              disabled
              label="Address"
              type="text"
              variant="outlined"
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={9109266387}
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
              value={"GRDEM8721E"}
              autoFocus
              margin="dense"
              disabled
              label="Pan"
              type="text"
              variant="outlined"
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={"GST"}
              autoFocus
              margin="dense"
              id="name"
              disabled
              label="GST"
              type="text"
              variant="outlined"
            />
            <TextField
              className="col-md-5 ml-2"
              value={`₹${rowData.t5}`}
              autoFocus
              margin="dense"
              id="GST"
              disabled
              label="Outstanding"
              type="text"
              variant="outlined"
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={`₹${rowData.t4}`}
              autoFocus
              margin="dense"
              id="name"
              disabled
              label="Amount Requested"
              type="text"
              variant="outlined"
            />
            <TextField
              className="col-md-5 ml-2"
              value={rowData.t1}
              autoFocus
              margin="dense"
              id="name"
              disabled
              label="Requested By"
              type="text"
              variant="outlined"
            />
          </div>
          <div className="row">
            <TextField
              className="col-md-6 me-3"
              value={convertDateToDDMMYYYY(rowData.t10)}
              autoFocus
              margin="dense"
              id="name"
              disabled
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
              fullWidth ={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Mode"
                  placeholder="Payment Mode"
                />
              )}
            />
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
            />
            <TextField
            onChange={(e) => setPayMentProof(e.target.files[0])}
              className="mt-3"
              autoFocus
              margin="dense"
              id="name"
              label="Payment Proof/ScreenShot"
              type="file"
              variant="outlined"
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClosePayDialog}>Cancel</Button> */}
          <Button variant="contained" className="mx-2" fullWidth onClick={handleClosePayDialog}>Pay Vendor</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
