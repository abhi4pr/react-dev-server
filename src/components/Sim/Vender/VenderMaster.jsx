import { useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import axios from "axios";
import UserNav from "../../Pantry/UserPanel/UserNav";
import { useNavigate } from "react-router-dom";

const VenderMaster = () => {
  const { toastAlert } = useGlobalContext();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [vendorName, setVendorName] = useState("");
  const [vendorContact, setVendorContact] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://34.93.221.166:3000/api/add_vendor",
        {
          vendor_name: vendorName,
          vendor_contact_no: vendorContact,
          vendor_email_id: vendorEmail,
          vendor_address: vendorAddress,
          description: description,
          created_by: loginUserId,
          last_updated_by: loginUserId,
        }
      );
      toastAlert("Data posted successfully!");
      setVendorName("");
      setDescription("");
      setVendorAddress("");
      setVendorContact("");
      setVendorEmail("");
      if (response.status == 200) {
        navigate("/venderOverView");
      }
    } catch (error) {
      toastAlert(error.mesaage);
    }
  };
  return (
    <>
      <UserNav />
      <div style={{ width: "80%", margin: "40px 0 0 10%" }}>
        <FormContainer
          mainTitle="Vendor "
          title="Vendor Create"
          handleSubmit={handleSubmit}
          buttonAccess={false}
        >
          <FieldContainer
            label=" Vendor Name"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
          />
          <FieldContainer
            label="Contect"
            value={vendorContact}
            onChange={(e) => setVendorContact(e.target.value)}
          />
          <FieldContainer
            label="Email"
            value={vendorEmail}
            onChange={(e) => setVendorEmail(e.target.value)}
          />
          <FieldContainer
            label="Address"
            value={vendorAddress}
            onChange={(e) => setVendorAddress(e.target.value)}
          />
          <FieldContainer
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormContainer>
      </div>
    </>
  );
};

export default VenderMaster;
