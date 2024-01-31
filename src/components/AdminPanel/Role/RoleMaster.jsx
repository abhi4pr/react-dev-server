import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import {baseUrl} from '../../../utils/config'

const RoleMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [roleName, setRoleName] = useState("");
  const [remark, setRemark] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl+"add_role", {
        created_by: loginUserId,
        role_name: roleName,
        remark: remark,
      });
      setRoleName("");
      setRemark("");
      setCreatedBy("");
      toastAlert("Form Submitted success");
      setIsFormSubmitted(true);
    } catch (error) {
      toastAlert();
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/role-overview" />;
  }
  return (
    <>
      <FormContainer mainTitle="Role" title="Role" handleSubmit={handleSubmit}>
        <FieldContainer
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
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
          rows="3"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default RoleMaster;
