import { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";

const VendorUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [vendorName, setVendorName] = useState("");
  const [vendorContact, setVendorContact] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getData();
  }, [id]);

  const getData = () => {
    axios
      .get(`http://34.93.221.166:3000/api/get_single_vendor/${id}`)
      .then((res) => {
        const response = res.data.data;
        setVendorName(response.vendor_name);
        setVendorContact(response.vendor_contact_no);
        setVendorEmail(response.vendor_email_id);
        setVendorAddress(response.vendor_address);
        setDescription(response.description);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://34.93.221.166:3000/api/update_vendor",
        {
          vendor_id: id,
          vendor_name: vendorName,
          vendor_contact_no: vendorContact,
          vendor_email_id: vendorEmail,
          vendor_address: vendorAddress,
          description: description,
          created_by: loginUserId,
          last_updated_by: loginUserId,
        }
      );
      toastAlert("Data Updated Successfully");
      setVendorName("");
      setDescription("");
      setVendorAddress("");
      setVendorContact("");
      setVendorEmail("");
      if (response.status == 200) {
        navigate("/venderOverView");
      }
    } catch (error) {
      toastAlert(error.message);
    }
  };

  return (
    <>
      <UserNav />
      <div style={{ width: "80%", margin: "40px 0 0 10%" }}>
        <FormContainer
          mainTitle="Vendor"
          title="Vendor Update"
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

export default VendorUpdate;
