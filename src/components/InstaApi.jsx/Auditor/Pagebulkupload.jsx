import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogTitle from "@mui/material/DialogTitle";
import { useRef } from "react";
import { Paper, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";

import axios from "axios";
import AlertDialog from "../../LeadManagement/Tools/AlertDialog";
import { useContext } from "react";

export default function Pagebulkupload({ setUpload }) {
  //   const { datalead } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [bulklead, setBulklead] = useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [alert, setAlert] = useState(false);
  const [alerttemp, setAlerttemp] = useState(false);
  let tj = 2;

  const handleClickOpen = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setBulklead(parsedData);
      //   console.log(parsedData);
      checkfieldname(parsedData[0]);
      console.log(parsedData[0]);
      // console.log(parsedData[0]);
    };
  };
  const fieldname = ["pagename"];
  const checkfieldname = (data) => {
    for (let i = 0; i < fieldname.length; i++) {
      if (!data.hasOwnProperty(fieldname[i])) {
        // console.log(fieldname[i]);
        setAlerttemp(true);
        setAlert(true);
        console.log("worng");
        return false;
      }
      setOpen(true);
    }
    return true;
  };
  const handleClose = () => {
    setOpen(false);
    setUpload(false);
  };
  // let count = 0;
  const CheckDuplicacy = () => {
    console.log(bulklead);
    for (let i = 0; i < bulklead.length; i++) {
      const token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY0NmNhOTExZWY5ZTcwNWM3ODc1Nzk0NyIsIm5hbWUiOiJjcmVhdGl2ZWZ1ZWwiLCJleHAiOjE3Mjc0ODg3MzAsInJvbGUiOiJDTElFTlQiLCJwZXJtaXNzaW9ucyI6W10sInNlc3Npb24iOiJhNjUwNDg1MS00ZTgwLTRiZjQtODBkZC02YzgxYWYxNjU2MzAifQ.EP0JfWCsLxaFdCLr6MizEeltnJ4h3s9PLi-GuoCUops"; // Replace with your actual Bearer token
      // Set the Authorization header with the Bearer token
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Adjust the content type as needed
        },
      };
      // Make the POST request
      try {
        axios.post(
          "http://34.93.221.166:3000/api/track_creator_posty",
          {
            connector: "instagram",
            handle: bulklead[i].pagename,
            // cron_expression: "0 10-22/4 * * *",
            cron_expression: "0 2-18 * * *",
            tracking_expiry_at: "2024-12-12 12:12:12.12",
          },
          axiosConfig
        );
        //   .then(() => {
        //     console.log("start tracking", bulklead[i].pagename);
        //   });
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setOpen(false);
    setUpload(false);
  };
  const UpdateExistingCreator = () => {
    console.log(bulklead);
    for (let i = 0; i < bulklead.length; i++) {
      const token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY0NmNhOTExZWY5ZTcwNWM3ODc1Nzk0NyIsIm5hbWUiOiJjcmVhdGl2ZWZ1ZWwiLCJleHAiOjE3Mjc0ODg3MzAsInJvbGUiOiJDTElFTlQiLCJwZXJtaXNzaW9ucyI6W10sInNlc3Npb24iOiJhNjUwNDg1MS00ZTgwLTRiZjQtODBkZC02YzgxYWYxNjU2MzAifQ.EP0JfWCsLxaFdCLr6MizEeltnJ4h3s9PLi-GuoCUops"; // Replace with your actual Bearer token
      // Set the Authorization header with the Bearer token
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Adjust the content type as needed
        },
      };
      // Make the POST request
      try {
        axios.put(
          `http://34.93.221.166:3000/api/track_creator_puty/${bulklead[i].pagename}`,
          {
            cron_expression: "0 2-20 * * *",
            tracking_expiry_at: "2023-12-12 12:12:12.12",
            tracking: true,
          },
          axiosConfig
        );
        //   .then(() => {
        //     console.log("start tracking", bulklead[i].pagename);
        //   });
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setOpen(false);
    setUpload(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  const columns = [
    {
      field: "s_no",
      headerName: "S No",
      width: 90,
    },
    {
      field: "pagename",
      headerName: "First name",
      width: 150,
      type: "text",
      editable: true,
    },
  ];

  return (
    <>
      <TextField
        // id="standard-basic"
        onChange={handleClickOpen}
        sx={{ width: 105 }}
        accept=".xlsx, .xls"
        variant="standard"
        size="small"
        type="file"
      />

      <Dialog
        // fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Preview</DialogTitle>
        <DataGrid
          rows={bulklead}
          columns={columns}
          getRowId={(row) => row.s_no}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 25, 100]}
        />

        <DialogActions>
          <Button onClick={UpdateExistingCreator}>
            {!alerttemp && "Change Cron"}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={CheckDuplicacy}>{!alerttemp && "Upload"}</Button>
        </DialogActions>
      </Dialog>
      <AlertDialog open={alert} setOpen={setAlert} tj={tj} />
    </>
  );
}
