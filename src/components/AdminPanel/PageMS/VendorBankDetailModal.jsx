import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { setCloseBankDetailsModal } from "../../Store/PageOverview";
import { useGetSingleBankDetailQuery } from "../../Store/reduxBaseURL";
import { DataGrid } from "@mui/x-data-grid";

export default function VendorBankDetailModal() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useDispatch();
  const open = useSelector((state) => state.PageOverview.showBankDetailsModal);
  const vendorRowData = useSelector((state) => state.PageOverview.rowData);

  const handleClose = () => {
    dispatch(setCloseBankDetailsModal());
  };

  const { data, isLoading, isError } = useGetSingleBankDetailQuery(
    vendorRowData._id || null
  );

  const columns = [
    { field: "bank_name", headerName: "Bank Name", width: 200 },
    { field: "account_type", headerName: "Account Type", width: 200 },
    { field: "ifcs", headerName: "IFSC ", width: 200 },
    { field: "account_number", headerName: "Account Number", width: 200 },
    { field: "registered_number", headerName: "Registered Number", width: 200 },
    { field: "upi_id", headerName: "UPI ID", width: 200 },
  ];

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        width="lg"
        fullWidth
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Bank Details"}</DialogTitle>
        <DialogContent>
          {data?.data?.length > 0 ? (
            <DataGrid
              rows={data.data || []}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              getRowId={(row) => row._id}
            />
          ) : (
            <p>No Data Found</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
