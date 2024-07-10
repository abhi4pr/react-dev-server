import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const DepartmentUpdate = () => {
  const { toastAlert, toastError } = useGlobalContext();
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

    if (!departmentName) {
      return toastError("Fill Required Field");
    }
    if (!shortName) {
      return toastError("Fill Required Field");
    }

    try {
      await axios.put(`${baseUrl}update_department`, {
        dept_id: id,
        dept_name: departmentName,
        short_name: shortName,
        remark: remark,
        // Created_by: createdBy,
      });
      setDepartmentName("");
      setRemark("");
      toastAlert("Updated Successfully");
      setIsFormSubmitted(true);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    console.log(localStorage.getItem("short_name"),"kkk");
    setId(localStorage.getItem("dept_id"));
    setDepartmentName(localStorage.getItem("dept_name"));
    setShortName(localStorage.getItem("short_name"));
    setRemark(localStorage.getItem("Remarks"));
    setCreationDate(localStorage.getItem("Creation_date").substring(0, 10));
    // setCreatedBy(localStorage.getItem("Created_by"));
    setCreatedBy(localStorage.getItem("created_by_name"));
    setLastUpdatedBy(localStorage.getItem("Last_updated_by"));
    setLastUpdatedDate(
      localStorage.getItem("Last_updated_date").substring(0, 10)
    );
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
          astric
          required={false}
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <FieldContainer
          label="Short Name"
          astric
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
        {/* <FieldContainer
          label="Created By"
          disabled
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
        /> */}
      </FormContainer>
    </>
  );
};

export default DepartmentUpdate;
