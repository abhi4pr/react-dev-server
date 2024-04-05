import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { baseUrl } from "../../../../utils/config";
import FieldContainer from "../../FieldContainer";
import FormContainer from "../../FormContainer";
import DynamicSelect from "../SalesServices/DynamicSelectManualy";
import { useGlobalContext } from "../../../../Context/Context";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const IncentiveUpdate = () => {
  const { id } = useParams();
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { userID } = useAPIGlobalContext();
  const [servicename, setServiceName] = useState("");
  const [incentiveType, setIncentiveType] = useState("");
  const [values, setValues] = useState("");
  const [salesServiceData, setSalesServiceData] = useState([]);
  const IncentiveTypeData = ["fixed", "variable"];

  const getData = async () => {
    try {
      const response = await axios.get(
        baseUrl + "sales/getlist_sale_service_master"
      );
      const data = response.data.data;
      setSalesServiceData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const ServiceData = () => {
    axios.get(`${baseUrl}` + `sales/get_incentive_plan/${id}`).then((res) => {
      const response = res.data.data;
      setServiceName(response[0]?.sales_service_master_id);
      setIncentiveType(response[0]?.incentive_type);
      setValues(response[0]?.value);
    });
  };
  useEffect(() => {
    ServiceData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!servicename || servicename == "") {
      return toastError("Service Name is Required");
    } else if (!incentiveType || incentiveType == "") {
      return toastError("Incentive Type is Required");
    } else if (!values || values == "") {
      return toastError("Value is Required");
    }
    try {
      const response = await axios.put(
        baseUrl + `sales/update_incentive_plan/${id}`,
        {
          sales_service_master_id: servicename,
          incentive_type: incentiveType,
          value: values,
          created_by: userID,
        }
      );

      toastAlert("Submited Succesfully");
      setServiceName("");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };
  if (isFormSubmitted) {
    return <Navigate to="/admin/sales-incentive-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Incentive Plan"
        title="Incentive Plan"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-4">
          <label className="form-label">
            Service Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={salesServiceData?.map((opt) => ({
              value: opt._id,
              label: opt.service_name,
            }))}
            value={{
              value: servicename,
              label:
                salesServiceData?.find((user) => user._id === servicename)
                  ?.service_name || "",
            }}
            onChange={(e) => {
              setServiceName(e.value);
            }}
            required
          />
        </div>
        <DynamicSelect
          lable="Incentive Type"
          astric={true}
          data={IncentiveTypeData}
          value={incentiveType}
          cols={4}
          onChange={(e) => setIncentiveType(e.value)}
        />
        <FieldContainer
          label="Value"
          astric={true}
          type="number"
          fieldGrid={4}
          value={values}
          required={false}
          onChange={(e) => setValues(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default IncentiveUpdate;
