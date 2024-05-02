import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const DepartmentMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [departmentName, setDepartmentName] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [shortName, setShortName] = useState("");
  const [data, setData] = useState([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  useEffect(() => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      setData(res.data);
    });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isModalExists = data.some((d) => d.dept_name === departmentName);
    if (isModalExists) {
      alert("Department already Exists");
    } else {
      await axios
        .post(baseUrl + "add_department", {
          dept_name: departmentName,
          short_name: shortName,
          remark: remark,
          Created_by: loginUserId,
        })
        .then((response) => {
          if (response.data.data == 409) {
            toastError("The department already exists.");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      setDepartmentName("");
      setRemark("");

      toastAlert("Submitted success");
      setIsFormSubmitted(true);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/department-overview" />;
  }

  return (
    <div>
      <FormContainer
        mainTitle="Department"
        title="Department"
        handleSubmit={handleSubmit}
      >
        <div className="mb-4 row">

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
          {/* <FieldContainer
          label="Created By"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          disabled
        /> */}
          <FieldContainer
            label="Remark"
            Tag="textarea"
            value={remark}
            required={false}
            onChange={(e) => setRemark(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </FormContainer>
    </div>
  );
};

export default DepartmentMaster;
