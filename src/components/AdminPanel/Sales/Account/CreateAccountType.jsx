import React, { useState } from "react";
import { useGlobalContext } from "../../../../Context/Context";
import { useAddAccountTypeMutation } from "../../../Store/API/SalesAccountTypeApi";

const CreateAccountType = ({
  loginUserId,
  closeModal,
  refetchAllAccountTypes,
}) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [accountTypeName, setAccountTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [addAccountType, { isLoading, isSuccess, isError }] =
    useAddAccountTypeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.length < 5) {
      toastError("Description must be at least 5 characters long.");
      return;
    }
    try {
      await addAccountType({
        account_type_name: accountTypeName,
        description,
        created_by: loginUserId,
      }).unwrap();
      setAccountTypeName("");
      setDescription("");
      closeModal();
      // refetchAllAccountTypes();
      toastAlert("Account Type added successfully");
    } catch (err) {
      console.error("Failed to add account type:", err);
      toastError("Failed to add account type");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="accountTypeName">Account Type Name</label>
          <input
            type="text"
            id="accountTypeName"
            value={accountTypeName}
            onChange={(e) => setAccountTypeName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            required
          />
          {description.length < 5 && (
            <small className="text-danger">
              Description must be at least 5 characters long.
            </small>
          )}
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {isError && <p>Failed to add account type. Please try again.</p>}
    </div>
  );
};

export default CreateAccountType;
