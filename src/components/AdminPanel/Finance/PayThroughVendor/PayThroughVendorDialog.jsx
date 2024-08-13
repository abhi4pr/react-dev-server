import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios"; // Ensure axios is imported
import React from "react";
import { baseUrl } from "../../../../utils/config";
import { useEffect } from "react";

const PayThroughVendorDialog = (props) => {
  const { payThroughVendor, setPayThroughVendor, rowSelectionModel } = props; // Ensure baseUrl is passed as a prop

  const handleClosePayThroughVendor = () => {
    setPayThroughVendor(false);
  };

  const doPayment = async () => {
    try {
      // Fetch the JWT token required for the payment
      const getTokenResponse = await axios.get(
        baseUrl + `generate_plural_payment_jwt_token`
      );
      const token = getTokenResponse.data.data;
      console.log(token, "getTokenResponse->>>>");

      // Prepare the payment request payload
      const paymentPayload = {
        clientReferenceId: "abcd1234",
        payeeName: "Abhishek", // Corrected name capitalization
        accountNumber: "1234567890", // Use a valid account number
        branchCode: "001122", // Use a valid branch code
        email: "ascs739@gmail.com",
        phone: "7000436496",
        amount: { currency: "INR", value: 3000 },
        remarks: "Payment remarks here", // Add a meaningful remark
        mode: "IMPS", // Options: IMPS, NEFT, RTGS, UPI
        // Optionally add vpa, scheduleAt, and payeeId if required
      };

      // Send the payment request
      const payResponse = await axios.post(
        "https://api-staging.pluralonline.com/v2/payments/banks",
        paymentPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the payment response
      console.log("Payment successful:", payResponse?.data);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error processing payment:", error);
    }
  };

  return (
    <Dialog
      open={payThroughVendor}
      onClose={handleClosePayThroughVendor}
      fullWidth
      maxWidth="md"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DialogTitle>Pay Through Vendor</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClosePayThroughVendor}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={doPayment}
        >
          Pay Through Vendor
        </Button>

        {/* Uncomment and ensure activeAccordionIndex, filterData, and columns are passed as props if needed */}
        {/* <DataGrid
          rows={
            activeAccordionIndex === 0
              ? filterData
              : activeAccordionIndex === 1
              ? filterData
              : []
          }
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => filterData?.indexOf(row)}
        /> */}
      </DialogContent>
    </Dialog>
  );
};

export default PayThroughVendorDialog;
