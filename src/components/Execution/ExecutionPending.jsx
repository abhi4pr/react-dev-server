import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import axios from "axios";
import { Link } from "react-router-dom";

import { Button, TextField } from "@mui/material";
import Confirmation from "./Confirmation";
import jwtDecode from "jwt-decode";
import { GridToolbar } from "@mui/x-data-grid";
import ExecutionUpdate from "./ExecutionUpdate";
import PaymentDetailDailog from "./PaymentDetailDailog";
import PointOfSaleTwoToneIcon from "@mui/icons-material/PointOfSaleTwoTone";
import { baseUrl } from "../../utils/config";

function ExecutionPending() {
  const [snackbar, setSnackbar] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState([]);
  const [reload, setReload] = useState(false);
  const [contextData, setContextData] = useState(false);
  const [executionStatus, setExecutionStatus] = useState();
  // const [date, setDate] = useState(new Date().toGMTString());
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAccept = (row) => {
    setRowData(row);
    setConfirmation(true);
    setExecutionStatus(2);
  };

  const handleDone = (row) => {
    setRowData(row);
    // setConfirmation(true);
    setExecutionStatus(1);
    setReload(true);
  };
  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [reload]);
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
              setAlert(res.data);
            }
          });
      }
      const response = axios
        .get(baseUrl+"get_exe_sum")
        .then((res) => {
          setData(
            res.data.filter(
              (ele) => ele.execution_status == 0 || ele.execution_status == 2
            )
          );
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    axios.post(baseUrl+"exe_sum_post", {
      loggedin_user_id: 52,
    });
  };

  const handleViewClick = (id) => {
    const selected = data.find((ele) => ele.sale_booking_id == id);
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
        if (params.row.execution_status == "0") {
          return (
            <Button
              size="small"
              color="error"
              variant="outlined"
              fontSize="inherit"
            >
              Pending
            </Button>
          );
        } else if (params.row.execution_status == "2") {
          return (
            <Button
              size="small"
              color="success"
              variant="outlined"
              fontSize="inherit"
            >
              In Progress
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
    {
      field: "start_date",
      headerName: "Start Date",
      width: 200,
      renderCell: (params) => {
        if (
          !params.row.start_date ||
          params.row.start_date === "0000-00-00 00:00:00" ||
          params.row.start_date === null ||
          params.row.start_date === undefined
        ) {
          return " ";
        }

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

        return (
          <div>
            <span>{formattedDate}</span> &nbsp;
            <span>{formattedTime}</span>
          </div>
        );
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
      width: 110,
    },
    contextData && {
      field: "payment_type",
      headerName: "Payment Status",
      width: 150,
    },
    contextData && {
      field: "payment_status_show",
      headerName: "Credit Status",
      width: 150,
    },
    {
      field: "Time passed",
      headerName: "Time passed",
      type: "number",
      width: 110,
      renderCell: (params) => {
        if (params.row.execution_status == "2") {
          return (
            Math.floor(
              Math.abs((new Date(params.row.start_date_) - new Date()) / 36e5)
            ) + " hours"
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
            const { id, row } = params; // Destructure the id and row from params
            const executionStatus = row.execution_status; // Get the execution_status

            if (executionStatus == "0") {
              // Show Accept and Reject buttons when execution_status is "0"
              return [
                // <Button key={id}><PointOfSaleTwoToneIcon/></Button>,

                <GridActionsCellItem
                  key={id}
                  icon={<PointOfSaleTwoToneIcon />}
                  onClick={() => handleClickOpenPaymentDetailDialog(params.row)}
                  color="inherit"
                />,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <GridActionsCellItem
                    icon={<ListAltOutlinedIcon />}
                    onClick={handleViewClick(id)}
                    color="inherit"
                  />
                </Link>,
                <GridActionsCellItem
                  key={id}
                  icon={
                    <ExecutionUpdate
                      setReload={setReload}
                      id={id}
                      rowData={row}
                      status={3}
                    />
                  }
                  color="inherit"
                />,
                <GridActionsCellItem
                  key={id}
                  icon={<Button variant="outlined">Accept</Button>}
                  onClick={() => handleAccept(row)}
                  color="inherit"
                />,
              ];
            } else if (executionStatus == "2") {
              // Show "Done" button when execution_status is "2"
              return [
                <GridActionsCellItem
                  key={id}
                  icon={<PointOfSaleTwoToneIcon />}
                  onClick={handleClickOpenPaymentDetailDialog}
                  color="inherit"
                />,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <GridActionsCellItem
                    icon={<ListAltOutlinedIcon />}
                    label="Delete"
                    onClick={handleViewClick(id)}
                    color="inherit"
                  />
                </Link>,
                <GridActionsCellItem
                  key={id}
                  icon={
                    <ExecutionUpdate
                      setReload={setReload}
                      id={id}
                      rowData={row}
                      status={1}
                    />
                  }
                  label="Delete"
                  onClick={() => handleDone(row)}
                  color="inherit"
                />,
              ];
            } else {
              // Default case, no special buttons
              return [
                <GridActionsCellItem
                  key={id}
                  icon={<PointOfSaleTwoToneIcon />}
                  onClick={handleClickOpenPaymentDetailDialog}
                  color="inherit"
                />,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <GridActionsCellItem
                    icon={<ListAltOutlinedIcon />}
                    onClick={handleViewClick(id)}
                    color="inherit"
                  />
                </Link>,
              ];
            }
          },
        }
      : {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 300,
          cellClassName: "actions",
          getActions: (params) => {
            const { id, row } = params; // Destructure the id and row from params
            const executionStatus = row.execution_status; // Get the execution_status

            if (executionStatus == "0") {
              // Show Accept and Reject buttons when execution_status is "0"
              return [
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <GridActionsCellItem
                    icon={<ListAltOutlinedIcon />}
                    onClick={handleViewClick(id)}
                    color="inherit"
                  />
                </Link>,
                <GridActionsCellItem
                  key={id}
                  icon={
                    <ExecutionUpdate
                      setReload={setReload}
                      id={id}
                      rowData={row}
                      status={3}
                    />
                  }
                  color="inherit"
                />,
                <GridActionsCellItem
                  key={id}
                  icon={<Button variant="outlined">Accept</Button>}
                  onClick={() => handleAccept(row)}
                  color="inherit"
                />,
              ];
            } else if (executionStatus == "2") {
              // Show "Done" button when execution_status is "2"
              return [
                // <GridActionsCellItem
                //   key={id}
                //   icon={<PointOfSaleTwoToneIcon />}
                //   onClick={handleClickOpenPaymentDetailDialog}
                //   color="inherit"
                // />,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <GridActionsCellItem
                    icon={<ListAltOutlinedIcon />}
                    label="Delete"
                    onClick={handleViewClick(id)}
                    color="inherit"
                  />
                </Link>,
                <GridActionsCellItem
                  key={id}
                  icon={
                    <ExecutionUpdate
                      setReload={setReload}
                      id={id}
                      rowData={row}
                      status={1}
                    />
                  }
                  label="Delete"
                  onClick={() => handleDone(row)}
                  color="inherit"
                />,
              ];
            } else {
              // Default case, no special buttons
              return [
                // <GridActionsCellItem
                //   key={id}
                //   icon={<PointOfSaleTwoToneIcon />}
                //   onClick={handleClickOpenPaymentDetailDialog}
                //   color="inherit"
                // />,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <GridActionsCellItem
                    icon={<ListAltOutlinedIcon />}
                    onClick={handleViewClick(id)}
                    color="inherit"
                  />
                </Link>,
              ];
            }
          },
        },
  ];
  return (
    <>
      {confirmation && (
        <Confirmation
          rowData={rowData}
          value={new Date()}
          status={executionStatus ? (executionStatus == 2 ? 2 : 3) : 3}
          setReload={setReload}
          confirmation={confirmation}
          setSnackbar={setSnackbar}
          setConfirmation={setConfirmation}
          type={
            executionStatus
              ? executionStatus == 2
                ? "Accept"
                : "Reject"
              : "Reject"
          }
        />
      )}
      <ThemeProvider theme={theme}>
        <div className="form-heading">
          <div className="form_heading_title">
            <h2>Execution Pending Summary</h2>
          </div>
        </div>
        <div>
          <TextField
            label="Search by Client Name"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <DataGrid
            rows={addSerialNumber(data)}
            columns={columns}
            getRowId={(row) => row.sale_booking_execution_id}
            slots={{ toolbar: GridToolbar }}
          >
            {/* <DataGridToolbar> */}
            {/* <div>
            <TextField
              label="Search by Client Name"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
            />

            <TextField
              label="Filter by Date"
              type="date"
              variant="outlined"
              value={dateFilter}
              onChange={handleDateFilterChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div> */}
            {/* </DataGridToolbar> */}
          </DataGrid>
        </div>
      </ThemeProvider>
      <PaymentDetailDailog
        handleClickOpenPaymentDetailDialog={handleClickOpenPaymentDetailDialog}
        handleClosePaymentDetailDialog={handleClosePaymentDetailDialog}
        openPaymentDetailDialog={openPaymentDetailDialog}
        paymentDialogDetails={paymentDialogDetails}
      />
    </>
  );
}

export default ExecutionPending;
