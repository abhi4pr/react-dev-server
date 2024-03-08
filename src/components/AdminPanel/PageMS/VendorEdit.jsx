import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router";

const VendorEdit = () => {
  const { toastAlert } = useGlobalContext();
  const [cycleName, setCycleName] = useState("");
  const [description, setDescription] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl+"getAllPayCycle")
      .then((res) => {
        
      });
  };

  useEffect(() => {
    getData();
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(baseUrl + "addPayCycle", {
      cycle_name: cycleName,
      description: description,
      created_by: userID
    })
    .then(() => {
      setIsFormSubmitted(true);
      toastAlert("Submitted");
      setCycleName("")
      setDescription("")
      getData()
    });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/pms-vendor-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Vendor Edit"
        title="Vendor Edit"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Pay Cycle Name *"
          value={cycleName}
          required={true}
          onChange={(e) => setCycleName(e.target.value)}
        />
        
        <FieldContainer
          label="Description"
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />

      </FormContainer>
    </>
  );
};

export default VendorEdit;