import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import jwtDecode from "jwt-decode";
import {baseUrl} from '../../utils/config'

const Confirmation = ({
  confirmation,
  setSnackbar,
  setConfirmation,
  rowData,
  value,
  remark,
  setReload,
  status,
}) => {
  const [open, setOpen] = useState(confirmation);
  const [data, setData] = useState(rowData);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  useEffect(() => {
    setData(rowData);
    console.log(rowData, "this is row data");
  }, []);

  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  const handleYes = () => {
    const date = new Date();
    const datePart = date.toDateString();
    const timePart = date.toLocaleTimeString();

    console.log(`Date: ${datePart}, Time: ${timePart}`);

    if (status == 2) {
      const payload = {
        loggedin_user_id: userID,
        sale_booking_id: data.sale_booking_id,
        sale_booking_execution_id: data.sale_booking_execution_id,
        start_date_: new Date(),
        execution_status: 2,
      };
      axios
        .put(`${baseUrl}`+`edit_exe_sum`, payload)
        .then((res) => {
          console.log(res);
          setReload((preVal) => !preVal);
        })
        .catch((err) => {
          console.log(err);
        });

      setOpen(false);
      setConfirmation(false);

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

      setOpen(false);
      setConfirmation(false);
    } else if (status == 3) {
      const payload = {
        loggedin_user_id: userID,
        sale_booking_id: data.sale_booking_id,
        execution_remark: remark,
        execution_status: 3,
        start_date_: data.start_date_,
        sale_booking_execution_id: data.sale_booking_execution_id,
        end_date: new Date(),
      };
      axios
        .put(`${baseUrl}`+`edit_exe_sum`, payload)
        .then((res) => {
          console.log(res);
          setReload((preVal) => !preVal);
        })
        .catch((err) => {
          console.log(err);
        });

      setOpen(false);
      setConfirmation(false);
      const payload1 = {
        loggedin_user_id: userID,
        sale_booking_execution_id: data.sale_booking_execution_id,
        execution_date_time: new Date().toISOString().split("T")[0],
        execution_time: "0.00",
        execution_remark: remark ? remark : "Rejected",
        execution_status: 4,
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

      setOpen(false);
      setConfirmation(false);
    } else if (status == 1) {
      const currentDateTime = new Date(getCurrentDateTime());
      const start_date = new Date(data.start_date_);
      const end_date = currentDateTime;
      const timeDifference = end_date - start_date;
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      console.log(hoursDifference.toFixed(2), "hours difference");
      const payload = {
        loggedin_user_id: userID,
        sale_booking_id: data.sale_booking_id,
        execution_date: value ? value : new Date(),
        execution_remark: remark,
        execution_status: 1,
        start_date_: data.start_date_,
        end_date: currentDateTime,
        sale_booking_execution_id: data.sale_booking_execution_id,
        execution_time: hoursDifference.toFixed(2),
      };
      axios
        .put(`${baseUrl}`+`edit_exe_sum`, payload)
        .then((res) => {
          console.log(res);
          setReload((preVal) => !preVal);
        })
        .catch((err) => {
          console.log(err);
        });

      setOpen(false);
      setConfirmation(false);
      // const payload1 = {
      //   loggedin_user_id: userID,
      //   sale_booking_execution_id: data.sale_booking_execution_id,
      //   execution_date_time: value ? new Date(value).toLocaleDateString('en-GB') : new Date().toISOString().split("T")[0],
      //   execution_time: hoursDifference.toFixed(2),
      //   execution_remark: remark ? remark : "Done",
      //   execution_status: 3,
      // };
      console.log(value, "value");
      const payload1 = {
        loggedin_user_id: userID,
        sale_booking_execution_id: data.sale_booking_execution_id,
        execution_date_time: new Date(value).toISOString().split("T")[0],
        execution_time: new Date(value).toLocaleTimeString("en-GB", {
          hour12: false,
        }),
        execution_remark: remark ? remark : "Done",
        execution_status: 3,
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

      setOpen(false);
      setConfirmation(false);
    }
  };
  const handleNo = () => {
    setOpen(false);
    setSnackbar(null);
    setConfirmation(false);
  };
  return (
    <Dialog
      maxWidth="xs"
      open={open}
      // TransitionProps={{ onEntered: handleEntered }}
      // open={!!promiseArguments}
    >
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent dividers>
        {`Pressing 'Yes' will Update the status.`}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleYes}>Yes</Button>
        <Button onClick={handleNo}>No</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirmation;
