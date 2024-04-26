import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const gstBankList = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const EditPaymentDetails = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedGstBank, setSelectedGstBank] = useState(null);
  const token = getDecodedToken();
  const loginUserId = token.id;

  const getData = async () => {
    const response = await axios.get(
      `${baseUrl}sales/get_payment_details/${id}`
    );
    const res = response.data.data;
    setTitle(res.title);
    setDetails(res.details);
    setSelectedGstBank(res.gst_bank);
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${baseUrl}sales/update_payment_details/${id}`,
        {
          title: title,
          details: details,
          gst_bank: selectedGstBank,
          last_updated_by: loginUserId,
        }
      );

      setTitle("");
      setDetails("");
      setSelectedGstBank(null);
      navigate("/admin/view-payment-details");
      toastAlert("Payment Details Created");
    } catch (error) {
      toastError(error.message);
    }
  };

  console.log(selectedGstBank);
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
            onChange={(e) => setSelectedGstBank(e.value)}
            required
          />
        </div>
      </FormContainer>
    </div>
  );
};

export default EditPaymentDetails;
