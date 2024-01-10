import React, { useEffect, useState } from 'react'
import FormContainer from '../FormContainer'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Button } from '@mui/material';
import axios from 'axios';

export default function PaymentDone() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const callApi = () => {
    axios.get("https://production.we-fit.in/webservices/RestController.php?view=getpaymentrequest").then((res) => {
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

  const handleClearDateFilter = () => {
    setFilterData(data);
    setFromDate("");
    setToDate("");
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
      field: "ageing",
      headerName: "Ageing",
      width: 150,
      renderCell: (params) => {
        return <p> {calculateDays(params.row.request_date, new Date())} Days</p>;
      },
    },
    
  ];
  return (
    <div>
      <FormContainer
        mainTitle="Payment Done"
        link="/admin/finance-pruchasemanagement-paymentdone"
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
    </div>
  )
}
