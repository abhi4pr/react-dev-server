import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import axios from "axios";
import { Link } from "react-router-dom";

import { Button } from "@mui/material";
import Confirmation from "./Confirmation";
import jwtDecode from "jwt-decode";
import { GridToolbar } from "@mui/x-data-grid";
import ExecutionUpdate from "./ExecutionUpdate";
import PaymentDetailDailog from "./PaymentDetailDailog";
import PointOfSaleTwoToneIcon from "@mui/icons-material/PointOfSaleTwoTone";
import { baseUrl } from "../../utils/config";
import FormContainer from "../AdminPanel/FormContainer";

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
  const [openPaymentDetailDialog, setOpenPaymentDetaliDialog] = useState(false);
  const [paymentDialogDetails, setPaymentDialogDetails] = useState([{}]);
  const [multipleToken, setMultipleToken] = useState("");

  const handleClickOpenPaymentDetailDialog = (data) => {
    setPaymentDialogDetails(data);
    setOpenPaymentDetaliDialog(true);
  };
  const handleClosePaymentDetailDialog = () => {
    setOpenPaymentDetaliDialog(false);
  };

  const handleMultipleVerification = (e) => {
    e.preventDefault();
    axios
      .put(baseUrl + `update_all_list_token/${multipleToken}`)
      .then((res) => {
        let data = res.data.data;
        const payload = {
          loggedin_user_id: userID,
          sale_booking_id: data.sale_booking_id,
          sale_booking_execution_id: data.sale_booking_execution_id,
          start_date_: new Date(),
          execution_status: 2,
        };
        axios
          .put(`${baseUrl}` + `edit_exe_sum`, payload)
          .then((res) => {
            console.log(res);
            setReload((preVal) => !preVal);
          })
          .catch((err) => {
            console.log(err);
          });
  
  
        const payload1 = {
          loggedin_user_id: userID,
          sale_booking_execution_id: data.sale_booking_execution_id,
          execution_date_time: new Date().toISOString().split("T")[0],
          execution_time: "0.00",
          execution_remark: "Accepted",
          execution_status: 2,
        };
        axios
          .post(
            `https://sales.creativefuel.io/webservices/RestController.php?view=executionSummaryUpdate`,
            payload1
          )
          .then((res) => {
            console.log(res);
  
            setReload((preVal) => !preVal);
          })
          .catch((err) => {
            console.log(err);
            setSnackbar({
              open: true,
              message: "Error Updating",
              severity: "error",
            });
          });
  
        setConfirmation(false);
        fetchData();
      });
  };
  const handleAccept = (row) => {
    setRowData(row);
    setConfirmation(true);
    setExecutionStatus(2);
  };

  const handleDone = (row) => {
    setRowData(row);
    // setConfirmation(true);
    setExecutionStatus(3);
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
          .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
          .then((res) => {
            if (res.data[26].view_value == 1) {
              setContextData(true);
              setAlert(res.data);
            }
          });
      }
      const response = axios.get(baseUrl + "get_exe_sum").then((res) => {
        setData(
          res.data
            .filter(
              (ele) => ele.execution_status == 1 || ele.execution_status == 2
            )
            .reverse()
        );
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    axios.post(baseUrl + "exe_sum_post", {
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
        if (params.row.execution_status == "1") {
          return (
            <Button
              size="small"
              color="error"
              className="btn btn_sm cmnbtn"
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
              className="btn btn_sm cmnbtn"
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
    {
      field: "execution_excel",
      headerName: "Excel",
      width: 150,
      renderCell: (params) => {
        return (
          params.row.execution_excel && (
            <Button
              size="small"
              color="success"
              className="btn btn_sm cmnbtn"
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
          let time =
            Math.abs(
              (new Date(params.row.start_date) - new Date()) / 36e5
            ).toFixed(1) + " hours";
          return time.includes(".0") ? time.split(".")[0] : time;
        }
      },
    },
    contextData
      ? {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 400,
          cellClassName: "actions",
          getActions: (params) => {
            const { id, row } = params; // Destructure the id and row from params
            const executionStatus = row.execution_status; // Get the execution_status

            if (executionStatus == "1") {
              // Show Accept and Reject buttons when execution_status is "0"
              return [
                // <Button key={id}><PointOfSaleTwoToneIcon/></Button>,
                <div className="icon-1">
                  <GridActionsCellItem
                    key={id}
                    icon={<PointOfSaleTwoToneIcon />}
                    onClick={() =>
                      handleClickOpenPaymentDetailDialog(params.row)
                    }
                    color="inherit"
                    title="Payment Detail"
                  />
                </div>,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                      title="Record Service Detail"
                    />
                  </div>
                </Link>,

                <GridActionsCellItem
                  key={id}
                  icon={
                    <Button className="btn btn_sm cmnbtn" variant="outlined">
                      Accept
                    </Button>
                  }
                  onClick={() => handleAccept(row)}
                  color="inherit"
                />,

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
              ];
            } else if (executionStatus == "2") {
              // Show "Done" button when execution_status is "2"
              return [
                <div className="icon-1">
                  <GridActionsCellItem
                    key={id}
                    icon={<PointOfSaleTwoToneIcon />}
                    onClick={() =>
                      handleClickOpenPaymentDetailDialog(params.row)
                    }
                    color="inherit"
                    title="Payment Detail"
                  />
                </div>,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                      title="Record Service Detail"
                    />
                  </div>
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
                <div className="icon-1">
                  <GridActionsCellItem
                    key={id}
                    icon={<PointOfSaleTwoToneIcon />}
                    onClick={handleClickOpenPaymentDetailDialog}
                    color="inherit"
                  />
                </div>,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                    />
                  </div>
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

            if (executionStatus == "1") {
              // Show Accept and Reject buttons when execution_status is "0"
              return [
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                    />
                  </div>
                </Link>,
                <GridActionsCellItem
                  key={id}
                  icon={
                    <ExecutionUpdate
                      setReload={setReload}
                      id={id}
                      rowData={row}
                      status={4}
                    />
                  }
                  color="inherit"
                />,
                <GridActionsCellItem
                  key={id}
                  icon={
                    <Button variant="outlined" className="btn btn_sm cmnbtn">
                      Accept
                    </Button>
                  }
                  onClick={() => handleAccept(row)}
                  color="inherit"
                />,
              ];
            } else if (executionStatus == "2") {
              // Show "Done" button when execution_status is "2"
              return [
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      label="Delete"
                      onClick={handleViewClick(id)}
                      color="inherit"
                    />
                  </div>
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
              return [
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                    />
                  </div>
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
        <div>
          <FormContainer mainTitle={"Execution Pending Summary"} link={true} />

          <div className="thm_table card body-padding fx-head thm_row">
            <form onSubmit={handleMultipleVerification}>
              <input
                type="text"
                placeholder="Search here"
                className="w-25 form-control"
                value={multipleToken}
                onChange={(e) => setMultipleToken(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="btn btn_sm cmnbtn"
              >
                Add
              </Button>
            </form>
            <DataGrid
              rows={addSerialNumber(data)}
              columns={columns}
              getRowId={(row) => row._id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            ></DataGrid>
          </div>
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
