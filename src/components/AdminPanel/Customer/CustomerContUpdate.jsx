import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import Select from "react-select";
import { Navigate, useParams } from "react-router-dom"; 

const CustomerContUpdate = () => {
  const { id } = useParams();
  
  const { toastAlert, toastError } = useGlobalContext();
  const [customerName, setCustomerName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [alternateContact, setAlternateContact] = useState("");
  const [emailId, setEmailId] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const [customersData, setCustomersData] = useState([]);

  const fetchCustomerContactDetails = () => {
    axios.get(`${baseUrl}get_customer_contact/${id}`).then((res) => {
      const data = res.data.data;
      console.log(res.data.data , 'jay siya ram')
      setCustomerName(data[0].customer_id);
      setContactName(data[0].contact_name);
      setContactNo(data[0].contact_no);
      setAlternateContact(data[0].alternative_contact_no);
      setEmailId(data[0].email_id);
      setDepartment(data[0].department);
      setDesignation(data[0].designation);
      setDescription(data[0].description);
    });
  };

  const CustomerData = () => {
    axios.get(baseUrl + "get_all_customer_mast").then((res) => {
      setCustomersData(res.data.customerMastList);
    });
  };

  useEffect(() => {
    CustomerData();
    fetchCustomerContactDetails();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${baseUrl}update_customer_contact/${id}`, {
      customer_id: customerName,
      contact_name: contactName,
      contact_no: contactNo,
      alternative_contact_no: alternateContact,
      email_id: emailId,
      department,
      designation,
      description,
      updated_by: userID, 
    })
    .then(() => {
      setIsFormSubmitted(true);
      toastAlert("Contact updated successfully");
    })
    .catch((error) => {
      toastError("An error occurred: " + error.message);
    });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/customer-cont-overview" />;
  }

  return (
    <FormContainer
      mainTitle="Update Customer Contact"
      title="Update Customer Contact"
      handleSubmit={handleSubmit}
    >
<div className="form-group col-6">
        <label className="form-label">
          Customer Type ID <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={customersData?.map((option) => ({
            value: option.customer_id,
            label: option._id ,
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

      <FieldContainer
        label="Contact Name"
        value={contactName}
        required={true}
        onChange={(e) => setContactName(e.target.value)}
      />
      <FieldContainer
        label="Contact No"
        type="number"
        value={contactNo}
        required={true}
        onChange={(e) => setContactNo(e.target.value)}
      />
      <FieldContainer
        label="Alternate Contact"
        type="number"
        value={alternateContact}
        onChange={(e) => setAlternateContact(e.target.value)}
      />
      <FieldContainer
        label="Email ID"
        value={emailId}
        onChange={(e) => setEmailId(e.target.value)}
      />
      <FieldContainer
        label="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <FieldContainer
        label="Designation"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
      />
      <FieldContainer
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />    </FormContainer>
  );
};

export default CustomerContUpdate;
