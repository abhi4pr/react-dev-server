import { useState } from "react";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { Navigate } from "react-router-dom";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";

const Designation = () => {
  const { toastAlert } = useGlobalContext();
  const { DepartmentContext } = useAPIGlobalContext();

  const [designationName, setDesignationName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [remark, setRemark] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // useEffect(() => {
  //   axios
  //     .get(baseUrl+"get_all_departments")
  //     .then((res) => {
  //       getDepartmentData(res.data).catch((error) => console.log(error));
  //     });
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl+"add_designation", {
        desi_name: designationName,
        dept_id: departmentName,
        remark: remark,
      });
      setDesignationName("");
      setDepartmentName("");
      setRemark("");
      toastAlert("Submitted successfully");
      setIsFormSubmitted(true);
    } catch (error) {
      const errorMessage = error?.response?.data?.sms
        ? error?.response?.data?.sms
        : "An error occurred while submitting the form.";
      toastAlert(errorMessage);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/designation-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Designation"
        title="Designation"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Designation Name"
          value={designationName}
          onChange={(e) => setDesignationName(e.target.value)}
        />
        <div className="form-group col-6">
          <label className="form-label">
            Department Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={DepartmentContext.map((option) => ({
              value: option.dept_id,
              label: `${option.dept_name}`,
            }))}
            value={{
              value: departmentName,
              label:
                DepartmentContext.find(
                  (user) => user.dept_id === departmentName
                )?.dept_name || "",
            }}
            onChange={(e) => {
              setDepartmentName(e.value);
            }}
            required
          />
        </div>
        <FieldContainer
          label="Remark"
          value={remark}
          required={false}
          Tag="textarea"
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default Designation;
