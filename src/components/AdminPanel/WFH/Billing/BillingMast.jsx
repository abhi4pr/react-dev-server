import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../../../../Context/Context";
import FieldContainer from "../../FieldContainer";
import FormContainer from "../../FormContainer";
import {baseUrl} from '../../../../utils/config'

const BillingMast = () => {
  const { toastAlert } = useGlobalContext();
  const [bilingName, setBillingName] = useState("");
  const [department, setDepartment] = useState("");
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [allWFHDepartments, setAllWFHDepartments] = useState([]);
  const [unassignedWFHDepartments, setUnassignedWFHDepartments] = useState([]);
  const [seeMoreButtonActive, setSeeMoreButtonActive] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const assignedDepartmentResponse = await axios.get(
          baseUrl+"get_all_billingheaders"
        );
        const wfhDepartmentsResponse = await axios.get(
          baseUrl+"dept_with_wfh"
        );

        const assignedDepartments = assignedDepartmentResponse.data.result;
        const wfhDepartments = wfhDepartmentsResponse.data;

        const assignedDeptIds = new Set(
          assignedDepartments.map((dept) => dept.dept_id)
        );

        const unassignedWfhDepartments = wfhDepartments.filter(
          (dept) => !assignedDeptIds.has(dept.dept_id)
        );

        setUnassignedWFHDepartments(unassignedWfhDepartments);
        setAllWFHDepartments(wfhDepartments);
        if (unassignedWfhDepartments.length == wfhDepartments.length) {
          setSeeMoreButtonActive(false);
        }
      } catch (error) {
        console.error("Error Fetching Data", error);
      }
    }

    fetchData();
  }, []);

  const toggleDepartmentList = () => {
    setShowAllDepartments((prev) => !prev);
  };

  const DepartmentMenuList = (props) => (
    <>
      {props.children}
      {seeMoreButtonActive && (
        <button className="btn btn-primary" onClick={toggleDepartmentList}>
          {showAllDepartments ? "Show Less" : "See More"}
        </button>
      )}
    </>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl+"add_billingheader", {
        billing_header_name: bilingName,
        dept_id: department,
      })
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert("Submitted");
      });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/billing-overview" />;
  }

  const options = showAllDepartments
    ? allWFHDepartments
    : unassignedWFHDepartments;

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
            options={options.map((option) => ({
              value: option.dept_id,
              label: option.dept_name,
            }))}
            value={{
              value: department,
              label:
                options.find((opt) => opt.dept_id === department)?.dept_name ||
                "",
            }}
            onChange={(selectedOption) => setDepartment(selectedOption.value)}
            components={{ MenuList: DepartmentMenuList }}
            required
          />
        </div>
      </FormContainer>
    </>
  );
};

export default BillingMast;
