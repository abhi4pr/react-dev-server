import { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Select from "react-select";

const AssetSubCategoryUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toastAlert } = useGlobalContext();
    const token = sessionStorage.getItem("token");
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");
    const [selectedCat, setSelectedCat] = useState("");

    useEffect(() => {
        axios.get("http://34.93.221.166:3000/api/get_all_asset_category")
            .then((res) => setCategories(res.data))
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    const getData = () => {
        axios.get(`http://34.93.221.166:3000/api/get_single_asset_sub_category/${id}`)
            .then((res) => {
                const response = res.data;
                console.log(response[0], "lalit is here")
                setSelectedCat(response[0].category_id); 
                setSubCategoryName(response[0].sub_category_name);
                setDescription(response[0].description);
            })
            .catch((error) => console.error("Error fetching subcategory:", error));
    };

    useEffect(() => {
        getData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const decodedToken = token ? jwtDecode(token) : null;
            const loginUserId = decodedToken ? decodedToken.id : null;
            
            const response = await axios.put("http://34.93.221.166:3000/api/update_asset_sub_category", {
                category_id: selectedCat,
                sub_category_id: id,
                sub_category_name: subCategoryName,
                description: description,
                created_by: loginUserId,
                last_updated_by: loginUserId,
            });

            if (response.status === 200) {
                toastAlert("Data Updated Successfully");
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
                    mainTitle="Asset Sub Category"
                    title="Sub Category Update"
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
                            options={categories.map((opt) => ({
                                value: opt.category_id,
                                label: opt.category_name,
                            }))}
                            value={{
                                value: selectedCat,
                                label: categories.find((cat) => cat.category_id === selectedCat)?.category_name || "",
                            }}
                            onChange={(e) => setSelectedCat(e.value)}
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

export default AssetSubCategoryUpdate;
