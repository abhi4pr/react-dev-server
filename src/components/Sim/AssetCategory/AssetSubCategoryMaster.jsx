import { useState, useEffect } from "react";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import axios from "axios";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AssetSubCategoryMaster = () => {
  const { toastAlert } = useGlobalContext();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [categoryName, setCategoryName] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  useEffect(() => {
    axios
      .get("http://34.93.221.166:3000/api/get_all_asset_category")
      .then((res) => {
        setCategoryName(res.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://34.93.221.166:3000/api/add_asset_sub_category",
        {
          sub_category_name: subCategoryName,
          category_id: selectedCat,
          description: description,
          created_by: loginUserId,
          last_updated_by: loginUserId,
        }
      );

      console.log(response.data);
      toastAlert("Data posted successfully!");
      setSubCategoryName("");
      setDescription("");
      if (response.status === 200) {
        navigate("/asset/subCategory/overview");
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
          mainTitle="Sub Category"
          title="create SubCategory "
          handleSubmit={handleSubmit}
          buttonAccess={false}
        >
          <FieldContainer
            label="Sub Category"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
          />

          <div className="form-group col-6">
            <label className="form-label">
              Category Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={categoryName.map((opt) => ({
                value: opt.category_id,
                label: opt.category_name,
              }))}
              value={{
                value: selectedCat,
                label:
                  categoryName.find((user) => user.category_id === selectedCat)
                    ?.category_name || "",
              }}
              onChange={(e) => {
                setSelectedCat(e.value);
              }}
              required
            />
          </div>

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

export default AssetSubCategoryMaster;
