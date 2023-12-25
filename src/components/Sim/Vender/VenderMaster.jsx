import { useState, useEffect } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import axios from "axios";
import UserNav from "../../Pantry/UserPanel/UserNav";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Autocomplete, TextField } from "@mui/material";

const VenderMaster = () => {
  const { toastAlert, categoryDataContext } = useGlobalContext();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [vendorName, setVendorName] = useState("");
  const [vendorContact, setVendorContact] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [secondaryContact, setSecondaryContact] = useState("");
  const [secondaryPersonName, setSecondaryPersonName] = useState("");

  const [type, setType] = useState("");
  // const Type = [
  //   "Current Asset",
  //   "Fixed Asset",
  //   "Tangible Asset",
  //   "Intangible Asset",
  //   "Operating Asset",
  //   "Non Operating Asset",
  // ];
  const Type = ["Sales", "Service", "Both"];
  // const [categoryData, setCategoryData] = useState([]);
  // const getCategoryData = () => {
  //   axios
  //     .get("http://34.93.221.166:3000/api/get_all_asset_category")
  //     .then((res) => {
  //       setCategoryData(res.data);
  //     });
  // };
  // useEffect(() => {
  //   getCategoryData();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://34.93.221.166:3000/api/add_vendor",
        {
          vendor_name: vendorName,
          vendor_type: type,
          vendor_category: selectedCategory.map((category) => category.value),
          vendor_contact_no: vendorContact,
          secondary_contact_no: secondaryContact,
          secondary_person_name: secondaryPersonName,
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

  const categoryChangeHandler = (e, op) => {
    setSelectedCategory(op);
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
          <div className="form-group col-6">
            <label className="form-label">
              Vendor Type <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={Type.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: type,
                label: `${type}`,
              }}
              onChange={(e) => {
                setType(e.value);
              }}
              required
            />
          </div>
          <div className="col-sm-12 col-lg-6 ">
            <Autocomplete
              multiple
              id="combo-box-demo"
              options={categoryDataContext.map((d) => ({
                label: d.category_name,
                value: d.category_id,
              }))}
              InputLabelProps={{ shrink: true }}
              renderInput={(params) => (
                <TextField {...params} label="Vendor Category" />
              )}
              onChange={categoryChangeHandler}
            />
          </div>
          <FieldContainer
            label="Contect"
            value={vendorContact}
            onChange={(e) => setVendorContact(e.target.value)}
          />
          <FieldContainer
            label="Secondary Contect"
            value={secondaryContact}
            onChange={(e) => setSecondaryContact(e.target.value)}
          />
          <FieldContainer
            label="Secondary Peroson Name"
            value={secondaryPersonName}
            onChange={(e) => setSecondaryPersonName(e.target.value)}
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

          {/* <FieldContainer
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          /> */}
        </FormContainer>
      </div>
    </>
  );
};

export default VenderMaster;
