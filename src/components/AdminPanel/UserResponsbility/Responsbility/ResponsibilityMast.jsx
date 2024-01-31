import { useState } from "react";
import FieldContainer from "../../FieldContainer";
import FormContainer from "../../FormContainer";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../../Context/Context";
import { Navigate } from "react-router-dom";
import {baseUrl} from '../../../../utils/config'

const ResponsibilityMast = () => {
  const { toastAlert } = useGlobalContext();
  const [responsibility, setResponsibility] = useState("");
  const [description, setDescription] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl+"add_responsibility", {
        respo_name: responsibility,
        description: description,
        created_by: userId,
      });
      setResponsibility("");
      setDescription("");
      toastAlert("Form submitted");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error("An error occurred while submitting the form", error);
      toastAlert("Form submission failed");
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/responsibility-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Responsibility"
        title="Responsiblity"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Responsibility"
          value={responsibility}
          onChange={(e) => setResponsibility(e.target.value)}
        />

        <FieldContainer
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default ResponsibilityMast;
