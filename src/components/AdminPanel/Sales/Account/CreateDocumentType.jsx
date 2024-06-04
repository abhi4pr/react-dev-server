import React, { useContext, useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { ApiContextData } from "../../APIContext/APIContext";
import { useAddDocumentTypeMutation } from "../../../Store/API/Sales/DocumentTypeApi";
import { useGlobalContext } from "../../../../Context/Context";
import { useNavigate } from "react-router-dom";

const CreateDocumentType = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [DocumentName, setDocumentName] = useState("");
  const [DocumentDescription, setDocumentDescription] = useState("");
  const [addDocumentType, { data, error, isLoading }] =
    useAddDocumentTypeMutation();
  const { userID } = useContext(ApiContextData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      document_name: DocumentName,
      description: DocumentDescription,
      created_by: userID,
    };
    try {
      await addDocumentType(payload).unwrap();
      setDocumentName("");
      setDocumentDescription("");
      toastAlert("Document Added Sucessfully");
      navigate(-1);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div>
      <FormContainer mainTitle={"Documents Master"} link={"/"} />
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Create Documnent</h3>
        </div>
        <div className="card-body row">
          <FieldContainer
            type="text"
            label="Document Name"
            placeholder="Enter Document Name"
            fieldGrid={4}
            required
            value={DocumentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
          <FieldContainer
            type="text"
            label="Document Description"
            placeholder="Enter Document Description"
            fieldGrid={4}
            required
            value={DocumentDescription}
            onChange={(e) => setDocumentDescription(e.target.value)}
          />
        </div>
      </div>
      <button
        className="btn btn-primary cmnbtn"
        onClick={(e) => handleSubmit(e)}
      >
        Submit
      </button>
    </div>
  );
};

export default CreateDocumentType;
