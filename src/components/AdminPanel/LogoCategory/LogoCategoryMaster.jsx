import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";

const LogoCategoryMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [categoryName, setCategoryName] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserID = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    await axios
      .post("http://34.93.221.166:3000/api/add_logo_category", {
        cat_name: categoryName,
        remark: remark,
        created_by: loginUserID,
      })
      
    setCategoryName("");
    setRemark("");

    toastAlert("Submitted success");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/logo-category-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Logo Category"
        title="Logo Category Master"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <FieldContainer
          label="Remark"
          Tag="textarea"
          required={false}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default LogoCategoryMaster;
