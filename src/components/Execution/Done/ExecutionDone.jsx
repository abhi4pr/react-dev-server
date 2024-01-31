import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { createTheme } from "react-data-table-component";
import { Link } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import { Button } from "@mui/material";
import PaymentDetailDailog from "../PaymentDetailDailog";
import PointOfSaleTwoToneIcon from "@mui/icons-material/PointOfSaleTwoTone";
import {baseUrl} from '../../../utils/config'

export default function ExecutionDone() {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const [data, setData] = useState([]);
  const [contextData, setContextData] = useState(false);

  const [openPaymentDetailDialog, setOpenPaymentDetaliDialog] = useState(false);
  const [paymentDialogDetails, setPaymentDialogDetails] = useState([{}]);

  const handleClickOpenPaymentDetailDialog = (data) => {
    console.log(data);
    setPaymentDialogDetails(data);
    setOpenPaymentDetaliDialog(true);
  };
  const handleClosePaymentDetailDialog = () => {
    setOpenPaymentDetaliDialog(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (userID && contextData == false) {
        axios
          .get(
            `${baseUrl}`+`get_single_user_auth_detail/${userID}`
          )
          .then((res) => {
            if (res.data[26].view_value == 1) {
              setContextData(true);
            }
            console.log(res.data[26].view_value);
          });
      }
      const formData = new URLSearchParams();
      formData.append("loggedin_user_id", 36);
      console.log(formData);
      const response = axios
        .get(baseUrl+"get_exe_sum", {
          loggedin_user_id: 52,
        })
        .then((res) => {
          setData(res.data.filter((ele) => ele.execution_status == "1"));
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(13, 110, 253)",
      },
    },
  });

  const addSerialNumber = (rows) => {
    return rows.map((row, index) => ({
      ...row,
      S_No: index + 1,
    }));
  };
  const columns = [
    {
      field: "S_No",
      headerName: "S No",
      width: 90,
    },
    {
      field: "cust_name",
      headerName: "Client Name",
      width: 150,
    },
    {
      field: "sales_executive_name",
      headerName: "Sales Executive",
      width: 150,
    },
    {
      field: "execution_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        if (params.row.execution_status == "1") {
          return (
            <Button size="small" color="success" variant="outlined">
              Done
            </Button>
          );
        }
      },
    },
    {
      field: "sale_booking_date",
      headerName: "Booking Date",
      type: "number",
      width: 110,
      renderCell: (params) => {
        return new Date(params?.row.sale_booking_date).toLocaleDateString(
          "en-GB"
        );
      },
    },
    // {
    //   field: "start_date_",
    //   headerName: "Start Date",
    //   width: 150,
    //   renderCell: (params) => {
    //     return new Date(params?.row.start_date_).toLocaleDateString("en-GB");
    //   },
    // },
    // {
    //   field: "end_date",
    //   headerName: "End Date",
    //   width: 150,
    //   renderCell: (params) => {
    //     return new Date(params?.row.end_date).toLocaleDateString("en-GB");
    //   },
    // },

    {
      field: "start_date",
      headerName: "Start Date",
      width: 200,
      renderCell: (params) => {
        const startDate = new Date(params.row.start_date);
        const dateOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        };
        const timeOptions = {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        };

        const formattedDate = startDate.toLocaleDateString(
          "en-GB",
          dateOptions
        );
        const formattedTime = startDate
          .toISOString()
          .split("T")[1]
          .substring(0, 8);

        if (
          params.row.start_date == "0000-00-00 00:00:00" ||
          params.row.start_date == null ||
          params.row.start_date == undefined
        ) {
          return " ";
        } else {
          return (
            <div>
              <span>{formattedDate}</span> &nbsp;
              <span>{formattedTime}</span>
            </div>
          );
        }
      },
    },

    {
      field: "end_date",
      headerName: "End Date",
      width: 150,
      renderCell: (params) => {
        const startDate = new Date(params.row.end_date);
        const dateOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        };
        const timeOptions = {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        };

        const formattedDate = startDate.toLocaleDateString(
          "en-GB",
          dateOptions
        );
        const formattedTime = startDate
          .toISOString()
          .split("T")[1]
          .substring(0, 8);

        return (
          <div>
            <span>{formattedDate}</span> &nbsp;
            <span>{formattedTime}</span>
          </div>
        );
      },
    },
    contextData && {
      field: "campaign_amount",
      headerName: "Amount",
      width: 120,
    },
    contextData && {
      field: "execution_excel",
      headerName: "Excel",
      width: 150,
      renderCell: (params) => {
        return (
          params.row.execution_excel && (
            <Button
              size="small"
              color="success"
              variant="outlined"
              fontSize="inherit"
              href={params.row.execution_excel}
            >
              Download
            </Button>
          )
        );
      },
    },
    {
      field: "page_ids",
      headerName: "Page Counts",
      width: 100,
      renderCell: (params) => {
        return params?.row?.page_ids
          ? params.row?.page_ids.split(",").length
          : 0;
      },
    },
    {
      field: "summary",
      headerName: "Summary",
      type: "number",
      width: 110,
    },

    {
      field: "Time passed",
      headerName: "Time Taken",
      type: "number",
      width: 110,
      renderCell: (params) => {
        if (params.row.execution_status == "1") {
          return (
            <div>
              {Math.floor(
                Math.abs(
                  (new Date(params.row.start_date_) -
                    new Date(params.row.execution_date)) /
                    36e5
                )
              )}{" "}
              hours
            </div>
          );
        }
      },
    },

    contextData
      ? {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 300,
          cellClassName: "actions",
          getActions: (params) => {
            const { id } = params;
            return [
              <GridActionsCellItem
                key={id}
                icon={<PointOfSaleTwoToneIcon />}
                onClick={() => handleClickOpenPaymentDetailDialog(params.row)}
                color="inherit"
              />,
              <Link key={id} to={`/admin/exeexecution/${id}`}>
                <GridActionsCellItem
                  icon={<ListAltOutlinedIcon />}
                  label="Delete"
                  color="inherit"
                />
              </Link>,
            ];
          },
        }
      : {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 300,
          cellClassName: "actions",
          getActions: (params) => {
            const { id } = params;
            return [
              <Link key={id} to={`/admin/exeexecution/${id}`}>
                <GridActionsCellItem
                  icon={<ListAltOutlinedIcon />}
                  label="Delete"
                  color="inherit"
                />
              </Link>,
            ];
          },
        },
  ];

  return (
    <div>
      <div>
        <div className="form_heading_title">
          <h2 className="form-heading">Execution Executed Summary</h2>
        </div>
      </div>
      <>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={addSerialNumber(data)}
            touchrippleref={false}
            columns={columns}
            getRowId={(row) => row.sale_booking_execution_id}
          />
        </ThemeProvider>
        <PaymentDetailDailog
          handleClickOpenPaymentDetailDialog={
            handleClickOpenPaymentDetailDialog
          }
          handleClosePaymentDetailDialog={handleClosePaymentDetailDialog}
          openPaymentDetailDialog={openPaymentDetailDialog}
          paymentDialogDetails={paymentDialogDetails}
        />
      </>
    </div>
  );
}
