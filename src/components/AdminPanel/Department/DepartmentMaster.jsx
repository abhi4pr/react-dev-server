import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import {baseUrl} from '../../../utils/config'

const DepartmentMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [departmentName, setDepartmentName] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [shortName, setShortName] = useState("");

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    await axios
      .post(baseUrl+"add_department", {
        dept_name: departmentName,
        short_name: shortName,
        remark: remark,
        created_by: loginUserId,
      })
      .then(() => {
        setDepartmentName("");
        setRemark("");
      })
      .catch((error) => {
        setError("An error occurred while submitting the form.");
        console.error(error);
      });
    setDepartmentName("");
    setRemark("");

    toastAlert("Submitted success");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/department-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Department"
        title="Department"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Deparment Name"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <FieldContainer
          label="Short Name"
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
          required={false}
        />
        <FieldContainer
          label="Created By"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          disabled
        />
        <FieldContainer
          label="Remark"
          Tag="textarea"
          value={remark}
          required={false}
          onChange={(e) => setRemark(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
      </FormContainer>
    </>
  );
};

export default DepartmentMaster;
