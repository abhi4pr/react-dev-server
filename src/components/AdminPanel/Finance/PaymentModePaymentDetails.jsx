import React, { useState } from "react";
import FormContainer from "../FormContainer";
import { Button } from "@mui/material";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";
import { baseUrl } from "../../../utils/config";

const PaymentModePaymentDetails = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [gstBanks, setGSTBanks] = useState(0);
  const { toastAlert, toastError } = useGlobalContext();

  const handleAddPaymentDetails = async () => {
    const paymentDetails = {
      title: title,
      payment_type: type,
      detail: details,
      gst_bank: gstBanks,
    };

    await axios
      .post(baseUrl + "add_payment_acc_data", paymentDetails)
      .then((res) => {
        console.log(res, "response>>>");
        toastAlert("Data Created Successfully");
      });
  };

  return (
    <div>
      <FormContainer
        mainTitle=" Add Payment Details"
        link="/admin/finance-paymentmode"
      />

      <div className="card-body pb4">
        <div className="row thm_form">
          <div className="form-group">
            <label>Title</label>
            <input
              // value={requestedAmountField}
              type="text"
              placeholder="Request Amount"
              className="form-control"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              className="form-control"
              type="text"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Priority</option>
              <option value="NEFT">NEFT</option>
              <option value="UPI">UPI</option>
              <option value="PayPal">PAYPAL</option>
              <option value="Kotak">KOTAK</option>
            </select>
          </div>
          <div className="form-group">
            <label>Details</label>
            <input
              // value={requestedAmountField}
              type="text"
              placeholder="Request Amount"
              className="form-control"
              onChange={(e) => {
                setDetails(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>GST Banks</label>
            <select
              // value={priorityFilter}
              className="form-control"
              type="number"
              onChange={(e) => setGSTBanks(e.target.value)}
            >
              <option value="">Select GST Bank</option>
              <option value="1">YES</option>
              <option value="0">NO</option>
            </select>
          </div>
          <div className="card-footer">
            <div className="flexCenter colGap16">
              <Button
                variant="contained"
                className="btn cmnbtn btn-primary"
                onClick={handleAddPaymentDetails}
              >
                Save
              </Button>
              <Button variant="contained" className="btn cmnbtn btn-secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModePaymentDetails;
