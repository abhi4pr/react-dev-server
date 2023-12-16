import { useState } from "react";
import FieldContainer from "../../FieldContainer";
import FormContainer from "../../FormContainer";
import Select from "react-select";
import { useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../../../../Context/Context";

const BillingMast = () => {
  const { toastAlert } = useGlobalContext();
  const [bilingName, setBillingName] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentdata, setDepartmentData] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const assignedDepartmentResponse = await axios.get(
          "http://34.93.221.166:3000/api/get_all_billingheaders"
        );
        const allDepartmentsResponse = await axios.get(
          "http://34.93.221.166:3000/api/get_all_departments"
        );

        const assignedDepartment = assignedDepartmentResponse.data;
        const allDepartments = allDepartmentsResponse.data;

        if (!assignedDepartment || !assignedDepartment.length) {
          setDepartment(departmentdata);
        } else {
          // Create a set of dept_ids from assignedDepartment
          const assignedDeptIds = new Set(
            assignedDepartment.map((item) => item.dept_id)
          );

          // Filter allDepartments to exclude those present in assignedDeptIds
          const filteredDepartments = allDepartments.filter(
            (dept) => !assignedDeptIds.has(dept.dept_id)
          );

          setDepartmentData(filteredDepartments);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://34.93.221.166:3000/api/add_billingheader", {
        billing_header_name: bilingName,
        dept_id: department,
      })
      .then(() => {
        setIsFormSubmitted(true), toastAlert("Submitted");
      });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/billing-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Billing Register"
        title="Billing"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Billing Header Name"
          value={bilingName}
          onChange={(e) => setBillingName(e.target.value)}
        />

        <div className="form-group col-6">
          <label className="form-label">
            Department Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={departmentdata.map((option) => ({
              value: option.dept_id,
              label: `${option.dept_name}`,
            }))}
            value={{
              value: department,
              label:
                departmentdata.find((user) => user.dept_id === department)
                  ?.dept_name || "",
            }}
            onChange={(e) => {
              setDepartment(e.value);
            }}
            required
          />
        </div>
      </FormContainer>
    </>
  );
};

export default BillingMast;
