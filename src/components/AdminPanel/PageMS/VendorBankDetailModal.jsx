import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { setCloseBankDetailsModal } from "../../Store/PageOverview";
import {
  useGetBankNameDetailQuery,
  useGetPmsPaymentMethodQuery,
  useGetSingleBankDetailQuery,
} from "../../Store/reduxBaseURL";
import { DataGrid } from "@mui/x-data-grid";

export default function VendorBankDetailModal() {
  const { data: payData } = useGetPmsPaymentMethodQuery();
  const { data: bankNameData } = useGetBankNameDetailQuery();
  const bankName = bankNameData?.data;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useDispatch();
  const open = useSelector((state) => state.PageOverview.showBankDetailsModal);
  const vendorRowData = useSelector((state) => state.PageOverview.rowData);

  const handleClose = () => {
    dispatch(setCloseBankDetailsModal());
  };

  const { data, isLoading, isError } = useGetSingleBankDetailQuery(
    vendorRowData._id ,{
      skip: !vendorRowData._id,
    }
  );

  const columns = [
    {
      field: "payment_method",
      headerName: "Payment Method",
      width: 200,
      valueGetter: ({ row }) =>
        row.payment_method ? payData?.find(ele=>ele._id== row.payment_method)?.payMethod_name : "NA",
    },
    {
      field: "bank_name",
      headerName: "Bank Name",
      width: 200,
      valueGetter: (params) =>
        params.row.bank_name?   bankName?.find((item) => item._id === params.row.bank_name)?.bank_name:"NA",
    },
    {
      field: "account_type",
      headerName: "Account Type",
      width: 200,
      valueGetter: ({ row }) => (row.account_type ? row.account_type : "NA"),
    },
    {
      field: "ifcs",
      headerName: "IFSC ",
      width: 200,
      valueGetter: ({ row }) => (row.ifcs ? row.ifcs : "NA"),
    },
    {
      field: "account_number",
      headerName: "Account Number",
      width: 200,
      valueGetter: ({ row }) =>
        row.account_number ? row.account_number : "NA",
    },
    {
      field: "registered_number",
      headerName: "Registered Number",
      width: 200,
      valueGetter: ({ row }) =>
        row.registered_number ? row.registered_number : "NA",
    },
    {
      field: "upi_id",
      headerName: "UPI ID",
      width: 200,
      valueGetter: ({ row }) => (row.upi_id ? row.upi_id : "NA"),
    },
    
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
          {data?.length > 0 ? (
            <DataGrid
              rows={data || []}
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
