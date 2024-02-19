import { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../../FormContainer";
import { useParams, useNavigate } from "react-router-dom";
import UpdateDocument from "../UpdateDocument";
import WFHDRegister from "./WFHDRegister";
import { baseUrl } from "../../../../utils/config";

const normalUserLayout = true;
const WFHDUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // New tab
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["Update WFHD User", "Update Document"];
  const [documentData, setDocumentData] = useState([]);

  async function getDocuments() {
    const response = await axios.post(baseUrl + "get_user_doc", {
      user_id: id,
    });
    setDocumentData(response.data.data);
  }

  useEffect(() => {
    getDocuments();
  }, [id]);

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
          const response = await axios.put(
            baseUrl + "update_user_doc",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          console.log(`No file uploaded for document ${document._id}`);
        }
      }
      navigate("/admin/wfhd-overview");
      toastAlert("Documents Updated");
      getDocuments();
      // }
    } catch (error) {
      console.error("Error submitting documents", error);
    }
  };

  const tab1 = <WFHDRegister userUpdateID={id} />;
  const tab2 = (
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
                        <span style={{ color: "red" }}> *</span>
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
                    ${item.status == "Document Uploaded" && "document_uploaded"}
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

          <div className="ml-auto mr-auto text-center">
            <button
              type="button"
              className="btn btn_pill btn_cmn btn_success"
              onClick={handleSubmit}
              style={{ marginBottom: "5%" }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            submitButton={false}
            mainTitle=""
            title=""
            accordionButtons={accordionButtons}
            activeAccordionIndex={activeAccordionIndex}
            onAccordionButtonClick={handleAccordionButtonClick}
          >
            {activeAccordionIndex === 0 && tab1}
            {activeAccordionIndex === 1 && tab2}
          </FormContainer>
        </div>
      </div>
    </>
  );
};

export default WFHDUpdate;
