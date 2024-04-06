import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import Select from "react-select";
import { useParams, Navigate } from "react-router-dom";

const CustomerDocumentUpdate = () => {
  const { id } = useParams(); 
  const { toastAlert, toastError } = useGlobalContext();
 // const [customerName, setCustomerName] = useState("");
  const [docFile, setDocFile] = useState("");
  const [docNo, setDocNo] = useState("");
  const [description, setDescription] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const [customersData, setCustomersData] = useState([]);
  console.log(customersData, "new name");
  
  useEffect(() => {
    axios.get(baseUrl + "get_all_customer_document").then((res) => {
      setCustomersData(res.data.customerMastList);
    });
  }, []);

  useEffect(() => {
    axios.get(baseUrl + `get_customer_document/${id}`).then((res) => {
      const documentData = res.data; 
      setCustomerName(documentData.customer_id);
      setDocNo(documentData.doc_no);
      setDescription(documentData.description);
    }).catch((error) => {
      console.error("Error fetching document data:", error);
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    //formData.append("customer_id", customerName);
    formData.append("doc_upload", docFile);
    formData.append("doc_no", docNo);
    formData.append("description", description);
    formData.append("modified_by", userID);

    axios
      .put(baseUrl + `update_customer_document/${id}`, formData)
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert("Document updated successfully");
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
      mainTitle="Customer Document Update"
      title="Update Customer Document"
      handleSubmit={handleSubmit}
    >
      {/* <div className="form-group col-6">
        <label className="form-label">
          Customer Type ID <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={customersData.map((option) => ({
            value: option.customer_id,
            label: option._id,
          }))}
          value={{
            value: customerName,
            label: customerName,
          }}
          onChange={(e) => {
            setCustomerName(e.value);
          }}
        />
      </div> */}

       <div className="form-group col-6">
        <label className="form-label">
          Doc ID <sup style={{ color: "red" }}>*</sup>
        </label>
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
        required={false}
        onChange={(e) => setDocNo(e.target.value)}
      />

      <FieldContainer
        label="Description"
        value={description}
        required={false}
        onChange={(e) => setDescription(e.target.value)}
      />
    </FormContainer>
  );
};

export default CustomerDocumentUpdate;
