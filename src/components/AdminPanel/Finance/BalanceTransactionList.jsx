import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import FormContainer from "../FormContainer";
import { useParams } from "react-router-dom";

const BalanceTransactionList = () => {
  const [transactionData, setTransactionData] = useState([]);
  const { sale_booking_id } = useParams();
  console.log(sale_booking_id, "sale_booking_id");

  function handleSubmitTransactionData() {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("status", "approved");
    formData.append("sale_booking_id", sale_booking_id);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=pending_payment_list",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setTransactionData(res.data.body);
      });
  }
  console.log(transactionData, "Transaction data >>>>");

  useEffect(() => {
    handleSubmitTransactionData();
  }, []);

  const convertDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  console.log(transactionData, "transaction data >>>");

  const columns = [
    {
      width: 70,
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...transactionData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    // {
    //   field: "aging",
    //   headerName: "Aging",
    //   renderCell: (params) => {
    //    <div>{params.row}</div>
    //   },
    // },
    {
      field: "cust_name",
      headerName: "Customer Name",
      width: 320,
      renderCell: (params) => params.row.cust_name,
      sortable: true,
    },
    {
      field: "user_name",
      headerName: "Sales Executive Name",
      width: 190,
      renderCell: (params) => params.row.user_name,
    },
    {
      field: "sale_booking_date",
      headerName: "Sale Booking Date",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.sale_booking_date)}
        </div>
      ),
    },
    {
      field: "payment_date",
      headerName: "Payment Date",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.payment_date)}
        </div>
      ),
    },
    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      width: 190,
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "total_paid_amount",
      headerName: "Paid Amount",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {params.row.payment_amount_show ? params.row.payment_amount_show : 0}
        </div>
      ),
    },
    {
      field: "gst_status",
      headerName: "GST",
      renderCell: (params) =>
        params.row.gst_status === "1" ? "GST" : "Non GST",
    },
    {
      field: "payment_mode",
      headerName: "Payment Mode",
      renderCell: (params) => params.row.payment_mode,
    },
    {
      field: "payment_ref_no",
      headerName: "Reference Number",
      renderCell: (params) => params.row.payment_ref_no,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 190,
    //   renderCell: (params) => (
    //     <button
    //       className="btn cmnbtn btn_sm btn-outline-primary"
    //       onClick={() => handleImageClick(params.row)}
    //     >
    //       Balance Update
    //     </button>
    //   ),
    // },
  ];
  console.log("HII-----");
  return (
    <div>
      <FormContainer
        mainTitle="Transaction List"
        link="/admin/finance-transaction-list"
      />
      <div className="card" style={{ height: "600px" }}>
        <div className="card-body thm_table">
          <DataGrid
            rows={transactionData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => transactionData.indexOf(row)}
          />
        </div>
      </div>
    </div>
  );
};

export default BalanceTransactionList;
