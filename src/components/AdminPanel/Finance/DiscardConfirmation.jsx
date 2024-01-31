import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import React from "react";
import axios from "axios";
import { set } from "date-fns";
import {baseUrl} from '../../../utils/config'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DiscardConfirmation({
  rowData,
  setShowDiscardModal,
  userID,
  callApi,
}) {
  console.log(rowData);
  const [open, setOpen] = React.useState(true);
  const [discardRemark, setDiscardRemark] = React.useState("");
  const handleClose = () => {
    setShowDiscardModal(false);
  };

  const handleConfirm = () => {
    axios
      .post(baseUrl+"phpvendorpaymentrequest", {
        request_id: rowData.request_id,
        vendor_id: rowData.vendor_id,
        request_by: rowData.request_by,
        request_amount: rowData.request_amount,
        priority: rowData.priority,
        status: 2,
        payment_by: userID,
        remark_finance: discardRemark,
        invc_no: rowData.invc_no,
        invc_remark: rowData.invc_remark,
        outstandings: rowData.outstandings,
        invc_Date: rowData.invc_Date,
        vendor_name: rowData.vendor_name,
        name: rowData.name,
        request_date: rowData.request_date,

      })
      .then((res) => {
        console.log(res);
        callApi();
        setShowDiscardModal(false);
        setDiscardRemark("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Are you sure you want to discard this transaction?
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <TextField
            multiline
            label="Reason for Discard"
            value={discardRemark}
            onChange={(e) => setDiscardRemark(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            autoFocus
            onClick={handleClose}
          >
            NO
          </Button>
          <Button
            variant="contained"
            color="error"
            autoFocus
            onClick={handleConfirm}
          >
            Yes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
