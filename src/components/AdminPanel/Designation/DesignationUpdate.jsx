import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Navigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import {baseUrl} from '../../../utils/config'

const DesignationUpdate = () => {
  const { toastAlert } = useGlobalContext();
  const { desi_id } = useParams();
  const [designationData, setDesignationData] = useState({
    id: 0,
    desi_name: "",
    dept_id: "",
    remark: "",
  });
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await axios.get(
          baseUrl+"get_all_departments"
        );
        const departmentOptions = response.data.map((dept) => ({
          value: dept.dept_id,
          label: dept.dept_name,
        }));
        setDepartmentOptions(departmentOptions);
      } catch (error) {
        console.error("Error fetching departments: ", error);
        toastAlert("Failed to fetch departments");
      }
    };

    const fetchDesignationData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}`+`get_single_designation/${desi_id}`
        );
        setDesignationData(response.data.data);
      } catch (error) {
        console.error("Error fetching designation: ", error);
        toastAlert("Failed to fetch designation");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentData();
    fetchDesignationData();
  }, [desi_id, toastAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        baseUrl+"update_designation",
        designationData
      );
      toastAlert("Updated success");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error("Error updating data: ", error);
      toastAlert("Update failed");
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/designation-overview" />;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <FormContainer
      mainTitle="Designation Update"
      title="Designation Update"
      handleSubmit={handleSubmit}
    >
      <FieldContainer
        label="Designation Name"
        value={designationData.desi_name}
        onChange={(e) =>
          setDesignationData({ ...designationData, desi_name: e.target.value })
        }
      />
      <div className="form-group col-6">
        <label className="form-label">
          Department Name <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={departmentOptions}
          value={departmentOptions.find(
            (option) => option.value === designationData.dept_id
          )}
          onChange={(selectedOption) =>
            setDesignationData({
              ...designationData,
              dept_id: selectedOption ? selectedOption.value : "",
            })
          }
        />
      </div>
      <FieldContainer
        label="Remark"
        required={false}
        value={designationData.remark}
        Tag="textarea"
        onChange={(e) =>
          setDesignationData({ ...designationData, remark: e.target.value })
        }
      />
    </FormContainer>
  );
};

export default DesignationUpdate;
