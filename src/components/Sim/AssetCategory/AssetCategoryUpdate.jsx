import React, { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";

const AssetCategoryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getData();
  }, [id]);

  const getData = () => {
    axios
      .get(`http://34.93.221.166:3000/api/get_single_asset_category/${id}`)
      .then((res) => {
        const response = res.data.data;
        setCategoryName(response.category_name);
        setDescription(response.description);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://34.93.221.166:3000/api/update_asset_category",
        {
          category_id: id,
          category_name: categoryName,
          description: description,
          last_updated_by: loginUserId,
        }
      );
      toastAlert("Data Updated Successfully");
      setCategoryName("");
      setDescription("");
      if (response.status == 200) {
        navigate("/asset/asset-category-overview");
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
          mainTitle="Asset"
          title="Category Update"
          handleSubmit={handleSubmit}
          buttonAccess={false}
        >
          <FieldContainer
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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

export default AssetCategoryUpdate;
