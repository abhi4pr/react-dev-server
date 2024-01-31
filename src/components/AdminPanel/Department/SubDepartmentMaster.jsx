import { useState } from "react";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import Select from "react-select";
import {baseUrl} from '../../../utils/config'

export default function SubDepartmentMaster() {
  const { DepartmentContext } = useAPIGlobalContext();
  const { toastAlert } = useGlobalContext();
  const [subDepartmentName, setSubDepartmentName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [remark, setRemark] = useState("");

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  // const [departmentdata, getDepartmentData] = useState([]);
  // useEffect(() => {
  //   axios.get(baseUrl+"get_all_departments").then((res) => {
  //     getDepartmentData(res.data).catch((error) => console.log(error));
  //   });
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl+"add_sub_department", {
        sub_dept_name: subDepartmentName,
        dept_id: departmentName,
        remark: remark,
        created_by: loginUserId,
      });

      setSubDepartmentName("");
      setDepartmentName("");
      setRemark("");
      toastAlert("Submitted success");
      setIsFormSubmitted(true);
    } catch (error) {
      toastAlert(
        "Error occurred: " +
          (error.response ? error.response.data.message : "Unknown error")
      );
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/sub-department-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Sub-Department"
        title="Sub-Department"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Sub-Department Name"
          value={subDepartmentName}
          onChange={(e) => setSubDepartmentName(e.target.value)}
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
}
