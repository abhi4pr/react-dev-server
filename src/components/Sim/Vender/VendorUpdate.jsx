import { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Select from "react-select";
import { Autocomplete, TextField } from "@mui/material";
import { baseUrl } from "../../../utils/config";

const VendorUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert, categoryDataContext } = useGlobalContext();
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

  const Type = ["Self", "Service", "Both"];
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 1000);
  }, [categoryDataContext]);

  // const [categoryData, setCategoryData] = useState([]);
  // const getCategoryData = () => {
  //   axios
  //     .get(baseUrl+"get_all_asset_category")
  //     .then((res) => {
  //       console.log(res.data, "category");
  //       setCategoryData(res.data);
  //     });
  // };
  // useEffect(() => {
  //   getCategoryData();
  // }, []);

  const getData = () => {
    axios
      .get(`${baseUrl}`+`get_single_vendor/${id}`)
      .then((res) => {
        const response = res.data.data;

        const selectedCategories =
          categoryDataContext.length > 0
            ? response.vendor_category?.map((category) => ({
                label: categoryDataContext.find(
                  (e) => e.category_id == category
                )?.category_name,
                value: category ? +category : "",
              }))
            : [];

        setSelectedCategory(selectedCategories);

        const availableCategories = categoryDataContext.filter(
          (category) =>
            !selectedCategories.find(
              (selected) => selected.value === category.category_id
            )
        );
        setFilteredCategories(availableCategories);

        setVendorName(response.vendor_name);
        setVendorContact(response.vendor_contact_no);
        setVendorEmail(response.vendor_email_id);
        setVendorAddress(response.vendor_address);
        setDescription(response.description);
        setSecondaryContact(response.secondary_contact_no);
        setSecondaryPersonName(response.secondary_person_name);
        setType(response.vendor_type);

        // console.log(
        //   response.vendor_category?.map((category) => ({
        //     label: categoryData?.filter((e) => {
        //       return e.category_id == category;
        //     })[0]?.category_name,
        //     value: +category,
        //   }))
        // );
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        baseUrl+"update_vendor",
        {
          vendor_id: id,
          vendor_name: vendorName,
          vendor_contact_no: vendorContact,
          vendor_email_id: vendorEmail,
          vendor_address: vendorAddress,
          description: description,
          created_by: loginUserId,
          last_updated_by: loginUserId,
          secondary_contact_no: secondaryContact,
          secondary_person_name: secondaryPersonName,
          vendor_type: type,
          vendor_category: selectedCategory.map((category) => category.value),
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
  // const categoryChangeHandler = (e, op) => {
  //   setSelectedCategory(op);
  // };
  const categoryChangeHandler = (e, op) => {
    setSelectedCategory(op);

    const newFilteredCategories = categoryDataContext.filter(
      (category) =>
        !op.find((selected) => selected.value === category.category_id)
    );
    setFilteredCategories(newFilteredCategories);
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
              value={selectedCategory}
              options={filteredCategories.map((d) => ({
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

export default VendorUpdate;
