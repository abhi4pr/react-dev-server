import React, { useState } from "react";
import { useAddBrandCategoryTypeMutation } from "../../../Store/API/Sales/BrandCategoryTypeApi";
import { useGlobalContext } from "../../../../Context/Context";

const CreateBrandCategory = ({ loginUserId, closeModal }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [brandName, setBrandName] = useState("");
  const [addBrandCategoryType, { isLoading, isSuccess, isError }] =
    useAddBrandCategoryTypeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBrandCategoryType({
        brandCategory_name: brandName,
        brand_id: 1,
        created_by: loginUserId,
      }).unwrap();
      setBrandName("");
      closeModal();
      toastAlert("Brand added successfully");
    } catch (err) {
      console.error("Failed to add brand:", err);
      toastError("Failed to add brand");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="brandName">Add Category</label>
          <input
            type="text"
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {isSuccess && <p>Brand added successfully!</p>}
      {isError && <p>Failed to add brand. Please try again.</p>}
    </div>
  );
};

export default CreateBrandCategory;
