import React, { useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const gstBankList = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const CreatePaymentDetails = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedGstBank, setSelectedGstBank] = useState(null); // Changed state initialization
  const token = getDecodedToken();
  const loginUserId = token.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}sales/add_payment_details`, {
        title: title,
        details: details,
        gst_bank: selectedGstBank,
        created_by: loginUserId,
        managed_by: loginUserId,
        last_updated_by: loginUserId,
      });

      setTitle("");
      setDetails("");
      setSelectedGstBank(null);
      navigate("/admin/view-payment-details");
      toastAlert("Payment Details Updated");
    } catch (error) {
      toastError(error.message);
    }
  };

  return (
    <div>
      <FormContainer
        mainTitle="Payment Mode"
        title="Create"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Mode Title"
          fieldGrid={4}
          astric={true}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <FieldContainer
          label="Details"
          fieldGrid={4}
          astric={true}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <div className="form-group col-4">
          <label className="form-label">
            GST Bank <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={gstBankList}
            value={gstBankList.find((item) => item.value === selectedGstBank)}
            onChange={(e) => setSelectedGstBank(e.value)} // Add onChange handler
            required
          />
        </div>
      </FormContainer>
    </div>
  );
};

export default CreatePaymentDetails;
