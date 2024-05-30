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

  const handleDeleteDocument = (index) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
  };

  return (
    <>
      {documents?.map((document, index) => (
        <div className="card" key={index}>
          <div className="card-header">
            <h4>Document ({index + 1})</h4>
            <button
              className="btn cmnbtn btn-danger"
              onClick={() => handleDeleteDocument(index)}
            >
              Delete
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
                dataArray={documentTypes}
                optionId="id"
                optionLabel="type"
                selectedId={document.type}
                setSelectedId={(value) =>
                  handleDocumentChange(index, "type", value)
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
