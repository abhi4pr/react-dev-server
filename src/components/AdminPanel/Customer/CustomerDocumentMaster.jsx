import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import Select from "react-select";
import { Navigate } from "react-router-dom";

const CustomerDocumentMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [customerName, setCustomerName] = useState("");
  const [docFile, setDocFile] = useState("");
  const [docNo, setDocNo] = useState("");
  const [description, setDescription] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const [customersData, setCustomersData] = useState([]);
  console.log(customersData, "new name");
  const CustomerData = () => {
    axios.get(baseUrl + "get_all_customer_mast").then((res) => {
      setCustomersData(res.data.customerMastList);
    });
  };

  const DocIdData = () => {
    axios.get(baseUrl + "get_all_customer_mast").then((res) => {
      setCustomersData(res.data.customerMastList);
    });
  };

  useEffect(() => {
    CustomerData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(customerName, "customerName");
    const formData = new FormData();
    formData.append("customer_id", customerName);
    formData.append("doc_id", "65f539b586cbd6416a3fd633");
    formData.append("doc_upload", docFile);
    formData.append("doc_no", docNo);
    formData.append("description", description);
    formData.append("created_by", userID);

    axios
      .post(baseUrl + "add_customer_document", formData)
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert("Contact added successfully");
      })
      .catch((error) => {
        toastError("An error occurred: " + error.message);
      });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/customer-document-overview" />;
  }

  return (
    <FormContainer
      mainTitle="Customer Contact Master"
      title="Add Customer Contact"
      handleSubmit={handleSubmit}
    >
      <div className="form-group col-6">
        <label className="form-label">
          Customer Type ID <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={customersData?.map((option) => ({
            value: option.customer_id,
            label: option._id,
          }))}
          value={{
            value: customerName,
            label:
              customersData?.find((cust) => cust.customer_id === customerName)
                ?._id || "",
          }}
          onChange={(e) => {
            setCustomerName(e.value);
          }}
        ></Select>
      </div>
      <div className="form-group col-6">
        <label className="form-label">
          Doc ID <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
        //   options={customersData?.map((option) => ({
        //     value: option.customer_id,
        //     label: option._id ,
        //   }))}
        //   value={{
        //     value: customerName,
        //     label:
        //       customersData?.find((cust) => cust.customer_id === customerName)
        //         ?._id || "",
        //   }}
        //   onChange={(e) => {
        //     setCustomerName(e.value);
        //   }}
        ></Select>
      </div>

      <FieldContainer
        type="file"
        label="Doc File"
        onChange={(e) => setDocFile(e.target.files[0])}
      />
      <FieldContainer
        label="Doc No"
        type="number"
        value={docNo}
        required={true}
        onChange={(e) => setDocNo(e.target.value)}
      />

      <FieldContainer
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </FormContainer>
  );
};

export default CustomerDocumentMaster;
