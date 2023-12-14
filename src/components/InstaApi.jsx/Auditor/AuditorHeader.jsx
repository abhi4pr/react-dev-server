import * as React from "react";
import {
  Paper,
  Autocomplete,
  Stack,
  Modal,
  TextField,
  Badge,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import AlertTitle from "@mui/material/AlertTitle";
import { memo } from "react";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import AlertDialog from "../../LeadManagement/Tools/AlertDialog";
import axios from "axios";
import BulkUpload from "../../LeadManagement/Tools/BulkUpload";
import PageTemplate from "./PageTemplate";
import Pagebulkupload from "./Pagebulkupload";

let tj = 0;
function AuditorHeader({
  rowSelectionModel,
  rows,
  setRows,
  newleadcount,
  setRowSelectionModel,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [ind, setInd] = useState(0);
  const [input, setInput] = useState(0);
  const [alert, setAlert] = useState(false);
  const [upload, setUpload] = useState(false);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : 1;
  let N = rowSelectionModel.length;
  let n = input;

  const handletrack = () => {
    // console.log(rowSelectionModel);
    if (rowSelectionModel.length == 0) {
      setAlert(true);
      return;
    }

    let set = new Set();
    for (let i = 0; i < rowSelectionModel.length; i++) {
      set.add(rowSelectionModel[i]);
    }
    let postcreatorarray = [];
    for (let i = 0; i < rows.length; i++) {
      if (set.has(rows[i].page_id)) {
        postcreatorarray.push(rows[i].page_name);
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
              handle: rows[i].page_name,
              // cron_expression: "0 10-22/4 * * *",
              cron_expression: "0 2-20 * * *",
              tracking_expiry_at: "2024-12-12 12:12:12.12",
            },
            axiosConfig
          );
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
    setRowSelectionModel([]);
    // console.log(postcreatorarray);
  };

  return (
    <Stack direction="row" sx={{ p: 1 }}>
      <AlertDialog open={alert} setOpen={setAlert} tj={5} />
      <Badge badgeContent={newleadcount} color="success">
        <FiberNewOutlinedIcon />
      </Badge>
      <TextField
        id="standard-basic"
        // label="Standard"
        placeholder="number of leads"
        sx={{ ml: 5, width: 125 }}
        variant="standard"
        size="small"
        // type="number"
        title="No. of page selected for tracking"
        value={rowSelectionModel.length}
      />

      <Button
        sx={{ ml: 1, mr: 1 }}
        variant="contained"
        color="success"
        size="small"
        button="1"
        aria-describedby={id}
        aria-haspopup="true"
        title="Will distribute leads equally between selected representative"
        onClick={handletrack}
      >
        Track
      </Button>
      <Stack direction="row" sx={{ ml: 4 }} spacing={2}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => {
            setUpload(!upload);
          }}
        >
          Upload..
        </Button>
        {upload && <Pagebulkupload setUpload={setUpload} />}
        <PageTemplate />
      </Stack>
    </Stack>
  );
}
export default AuditorHeader;
