import React, { useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate } from "react-router-dom";

const CreatePaymentMode = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const token = getDecodedToken();
  const loginUserId = token.id;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}sales/add_sale_payment_mode`,
        {
          payment_mode_name: title,
          created_by: loginUserId,
          managed_by: loginUserId,
          last_updated_by: loginUserId,
        }
      );

      setTitle("");
      navigate("/admin/view-payment-mode");
      toastAlert("Payment Mode Created");
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
      </FormContainer>
    </div>
  );
};

export default CreatePaymentMode;
