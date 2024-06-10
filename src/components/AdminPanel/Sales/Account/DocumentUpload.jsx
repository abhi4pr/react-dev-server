import React from "react";
import FieldContainer from "../../FieldContainer";
import CustomSelect from "../../../ReusableComponents/CustomSelect";

const DocumentUpload = ({ documents, setDocuments, documentTypes }) => {
  const handleDocumentChange = (index, key, value) => {
    const updatedDocuments = documents?.map((doc, docIndex) =>
      docIndex === index ? { ...doc, [key]: value } : doc
    );
    setDocuments(updatedDocuments);
  };
  console.log(documents);

  const handleDeleteDocument = (index) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
  };

  const getSelectedTypeLabel = (selectedId) => {
    const selectedType = documentTypes.find((type) => type._id === selectedId);
    return selectedType ? selectedType.document_name : "";
  };

  const getAvailableDocumentTypes = (currentIndex) => {
    const selectedTypes = documents
      .map((doc) => doc.document_master_id)
      .filter(Boolean);
    return documentTypes.filter(
      (type) =>
        !selectedTypes.includes(type._id) ||
        documents[currentIndex].document_master_id === type._id
    );
  };

  return (
    <>
      {documents?.map((document, index) => (
        <div className="card" key={index}>
          <div className="card-header sb">
            <h4>Document ({index + 1})</h4>
            <button
              className="icon-1"
              onClick={() => handleDeleteDocument(index)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
          <div className="card-body">
            <div className="row document-container">
              <FieldContainer
                label="Document Type"
                type="file"
                fieldGrid={6}
                onChange={(e) =>
                  handleDocumentChange(index, "file", e.target.files[0])
                }
                required
              />

              <CustomSelect
                label="Type"
                fieldGrid={6}
                dataArray={getAvailableDocumentTypes(index)}
                optionId="_id"
                optionLabel="document_name"
                selectedId={document.document_master_id}
                setSelectedId={(value) =>
                  handleDocumentChange(index, "document_master_id", value)
                }
                required
              />

              <FieldContainer
                label={`${getSelectedTypeLabel(
                  document.document_master_id
                )} Number`}
                placeholder={`Enter ${getSelectedTypeLabel(
                  document.document_master_id
                )} number here`}
                type="text"
                fieldGrid={6}
                value={document.document_no || ""}
                onChange={(e) =>
                  handleDocumentChange(index, "document_no", e.target.value)
                }
                required
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default DocumentUpload;
