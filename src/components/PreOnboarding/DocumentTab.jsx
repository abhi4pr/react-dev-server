import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from "../../utils/config";
import { useParams, useNavigate } from "react-router-dom";

const DocumentTab = ({
  documentData,
  setDocumentData,
  getDocuments,
  showMandotaryPer,
  showNonMandotaryPer,
  id,
  submitButton = true,
  normalUserLayout = false,
}) => {
  const { toastAlert, toastError } = useGlobalContext();
  const { user_id } = useParams();
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${user_id}`).then((res) => {
      setUser(res.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const updateDocumentData = (documentId, key, value) => {
    setDocumentData((prevDocumentData) =>
      prevDocumentData.map((doc) =>
        doc._id === documentId ? { ...doc, [key]: value } : doc
      )
    );
  };

  const handleFileUpload = (file, documentId) => {
    updateDocumentData(documentId, "file", file);
    updateDocumentData(documentId, "status", "Document Uploaded");
  };

  const handleSubmit = async () => {
    try {
      for (const document of documentData) {
        if (document.file) {
          let formData = new FormData();
          formData.append("doc_image", document.file);
          formData.append("_id", document._id);
          formData.append(
            "status",
            document.status == "Document Uploaded"
              ? "Verification Pending"
              : document.status
          );
          await axios.put(baseUrl + "update_user_doc", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          console.log(`No file uploaded for document ${document._id}`);
        }
      }

      await axios.put(`${baseUrl}` + `update_user`, {
        user_id: id,
        document_percentage_mandatory: showMandotaryPer,
        document_percentage_non_mandatory: showNonMandotaryPer,
      });
      toastAlert("Documents Updated");
      getDocuments();
    } catch (error) {
      console.error("Error submitting documents", error);
    }
  };

  return (
    <>
      <div
        className={`documentarea ${normalUserLayout && "documentareaLight"}`}
      >
        <div className="document_box">
          <h2>Documents</h2>

          <div
            className={`docTable ${
              normalUserLayout && "docTableLight"
            } table-responsive`}
          >
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Document Type</th>
                  <th scope="col">Period (Days)</th>
                  <th scope="col">Time</th>
                  <th scope="col">Upload</th>
                  <th scope="col" className="text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {documentData.map((item) => (
                  <tr key={item._id}>
                    <td scope="row">
                      {item.document.doc_type}
                      {item.document.isRequired && (
                        <span style={{ color: "red" }}> * (Mandatory)</span>
                      )}
                    </td>
                    <td>{item.document.period} days</td>
                    <td>1 Day</td>
                    <td>
                      <div className="uploadDocBtn">
                        <span>
                          <i className="bi bi-cloud-arrow-up" /> Upload
                        </span>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileUpload(e.target.files[0], item._id)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="docStatus">
                        <span
                          className={`warning_badges 
                        ${item.status == "" && "not_uploaded"}
                        ${
                          item.status == "Document Uploaded" &&
                          "document_uploaded"
                        }
                        ${item.status == "Verification Pending" && "pending"}
                        ${item.status == "Approved" && "approve"}
                        ${item.status == "Rejected" && "reject"}
                        `}
                        >
                          <h4>
                            {item.status == "" && "Not Uploaded"}
                            {item.status !== "" && item.status}
                          </h4>
                          {item.status == "Rejected" && (
                            <i
                              class="bi bi-exclamation-circle-fill"
                              title={item.reject_reason}
                            />
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {submitButton && (
            <div className="ml-auto mr-auto text-center">
              <button
                className="btn btn_pill btn_cmn btn_success"
                onClick={handleSubmit}
                style={{ marginBottom: "5%" }}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentTab;
