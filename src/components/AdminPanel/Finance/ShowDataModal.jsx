import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export default function ShowDataModal({
  handleClose,
  rows,
  columns,
  aknowledgementDialog,
  setAknowledgementDialog,
}) {
  const [acknowledgementMessage, setAcknowledgementMessage] = useState("");

  const handleSendAcknowledgement = (e) => {
    e.preventDefault();
    setAknowledgementDialog(false);
  };

  return (
    <>
      <Dialog open={true} onClose={() => handleClose(false)} maxWidth="lg">
        <DialogTitle>vendor Payment</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleClose(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.remand_id}
          />
        </DialogContent>
      </Dialog>

      {/* Acknowledgement Dialog */}
      {aknowledgementDialog && (
        <Dialog
          open={true}
          onClose={() => setAknowledgementDialog(false)}
          maxWidth="lg"
        >
          <DialogTitle>vendor Payment</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setAknowledgementDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <TextField
              multiline
              rows={5}
              value={acknowledgementMessage}
              onChange={(e) => setAcknowledgementMessage(e.target.value)}
              fullWidth
              label="Acknowledgement Message"
              variant="outlined"
            />
            <DialogActions>
              <Button
                variant="contained"
                onClick={(e) => handleSendAcknowledgement(e)}
              >
                Send
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
