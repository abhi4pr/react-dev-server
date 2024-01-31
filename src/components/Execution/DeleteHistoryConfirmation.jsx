import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {baseUrl} from '../../utils/config'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DeleteHistoryConfirmation(props) {
  const {
    handleCloseDeleteHistoryConFirmation,
    openDeleteHistoryConFirmation,
    rowData,
    apiCall,
  } = props;

  const handleDeleteConfirmation = () => {
    axios
      .delete(
        `${baseUrl}`+`delete_exe_ip_count_history/${rowData._id}`
      )
      .then((res) => {
        if (res.data.isDeleted) {
          handleCloseDeleteHistoryConFirmation();
          apiCall();
        }
      });
  };
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={() => handleCloseDeleteHistoryConFirmation()}
        aria-labelledby="customized-dialog-title"
        open={openDeleteHistoryConFirmation}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Delete
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleCloseDeleteHistoryConFirmation()}
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
          <Typography gutterBottom>
            Are you Sure ? Want to Delete the History
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            autoFocus
            onClick={handleCloseDeleteHistoryConFirmation}
          >
            No
          </Button>
          <Button
            color="success"
            autoFocus
            onClick={() => handleDeleteConfirmation()}
          >
            Yes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
