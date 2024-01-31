import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import {baseUrl} from '../../../utils/config'

const DepartmentUpdate = () => {
  const { toastAlert } = useGlobalContext();
  const [id, setId] = useState(0);
  const [departmentName, setDepartmentName] = useState("");
  const [remark, setRemark] = useState("");
  const [shortName, setShortName] = useState("");
  const [error, setError] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [lastUpdatedBy, setLastUpdatedBy] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    await axios
      .put(`${baseUrl}`+`update_department`, {
        dept_id: id,
        dept_name: departmentName,
        short_name: shortName,
        remark: remark,
        created_by: createdBy,
      })
      .then(() => {
        setDepartmentName("");
        setRemark("");
      })
      .catch((error) => {
        setError("An error occurred while submitting the form.");
        console.error(error);
      });

    toastAlert("Submit Success");
    setIsFormSubmitted(true);
  };
  useEffect(() => {
    setId(localStorage.getItem("dept_id"));
    setDepartmentName(localStorage.getItem("dept_name"));
    setRemark(localStorage.getItem("Remarks"));
    setCreationDate(localStorage.getItem("Creation_date").substring(0, 10));
    setCreatedBy(localStorage.getItem("created_by"));
    setLastUpdatedBy(localStorage.getItem("Last_updated_by"));
    setLastUpdatedDate(
      localStorage.getItem("Last_updated_date").substring(0, 10)
    );
    setShortName(localStorage.getItem("short_name"));
  }, []);

  if (isFormSubmitted) {
    return <Navigate to="/admin/department-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Department"
        title="Department Update"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Department Name"
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
          label="Remark"
          rows={"4"}
          required={false}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <FieldContainer
          label="Creation Date"
          disabled
          value={creationDate}
          onChange={(e) => setCreationDate(e.target.value)}
        />
        <FieldContainer
          label="Created By"
          disabled
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
        />

        {/* <FieldContainer
          label="Last Updated By"
          disabled
          value={lastUpdatedBy}
          onChange={(e) => setLastUpdatedBy(e.target.value)}
        />

        <FieldContainer
          label="Last Updated By"
          disabled
          value={lastUpdatedDate}
          onChange={(e) => setLastUpdatedBy(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>} */}
      </FormContainer>
    </>
  );
};

export default DepartmentUpdate;
