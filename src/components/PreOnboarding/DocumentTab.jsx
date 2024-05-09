import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from "../../utils/config";
import { useParams, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

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
  const [diffDate, setDiffDate] = useState("");
  const navigate = useNavigate();

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      setUser(res.data);
      var currentDate = new Date();
      var joiningDate = new Date(user.joining_date);
      var difference = joiningDate - currentDate;
      var daysDifference = Math.floor(difference / (1000 * 3600 * 24));
      setDiffDate(daysDifference);
    });
  };

  const handleDocDelete = async (item) => {
    // console.log(item, "item here");
    await axios
      .put(`${baseUrl}` + `update_doc_user`, {
        _id: item._id,
        // status: "unapprove",
      })
      .then((res) => {
        getDocuments();
        toastAlert("Document Deleted Successfully");
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

  // const handleFileUpload = (file, documentId) => {
  //   updateDocumentData(documentId, "file", file);
  //   updateDocumentData(documentId, "status", "Document Uploaded");
  // };

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

  const handleNotAvail = async (item) => {
    await axios.put(baseUrl + "update_user_doc", {
      _id: item._id,
      status: "Not Available",
    });
    toastAlert("Documents Updated");
    getDocuments();
  };

  const handleFileUpload = async (file, documentId) => {
    const document = documentData.find(
      (item) => item._id === documentId
    )?.document;
    if (document && document.doc_name == `Last 3 Months Salary Slip's`) {
      if (file && file.type !== "application/pdf") {
        toastError(
          'Please upload single pdf file which has "Last 3 month salary slip"'
        );
        return;
      }
    }

    updateDocumentData(documentId, "file", file);
    updateDocumentData(documentId, "status", "Document Uploaded");

    try {
      let formData = new FormData();
      formData.append("doc_image", file);
      formData.append("_id", documentId);
      formData.append("status", "Verification Pending");
      await axios.put(baseUrl + "update_user_doc", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toastAlert("Document Uploaded Successfully");
    } catch (error) {
      console.error("Error uploading document", error);
      toastError("Failed to upload document");
    }
  };

  return (
    <>
      <div
        className={`documentarea cardBoard ${
          normalUserLayout && "documentareaLight"
        }`}
      >
        <div className="cardHeaderBoard">
          <h5 className="cardTitle">Documents</h5>
        </div>
        <div className="cardBodyBoard p0">
          <div className="document_box">
            <div
              className={`docTable ${
                normalUserLayout && "docTableLight"
              } table-responsive`}
            >
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Document Name</th>
                    <th scope="col">Document Type</th>
                    <th scope="col">Period (Days)</th>
                    <th scope="col">Time Left</th>
                    <th scope="col">Upload</th>
                    <th scope="col" className="text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documentData
                  .slice()
                  .sort((a, b) => {
                    if (a.document.isRequired && !b.document.isRequired) {
                      return -1; 
                    } else if (!a.document.isRequired && b.document.isRequired) {
                      return 1; 
                    } else {
                      return 0;
                    }
                  })
                  .map((item) => (
                    <tr key={item._id}>
                      <td style={{ width: "20%" }}>
                        {item.document.doc_name}
                        {item.document.isRequired && (
                          <span style={{ color: "red" }}> * (Mandatory)</span>
                        )}
                      </td>
                      <td scope="row">{item.document.doc_type}</td>
                      <td>{item.document.period} days</td>
                      {/* <td>1 Day</td> */}
                      <td>{diffDate < 0 ? "Please Upload Docs" : diffDate}</td>
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
                                className="bi bi-exclamation-circle-fill"
                                title={item.reject_reason}
                              />
                            )}
                            {item.status == "Approved" && (
                              <button
                                type="button"
                                style={{ borderRadius: 17, padding: 7 }}
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDocDelete(item)}
                              >
                                Unapprove
                              </button>
                            )}
                            {item?.status == "Not Available" || item?.status !== '' ? (
                              ""
                            ) : (
                              <button
                                type="button"
                                style={{ borderRadius: 17, padding: 7 }}
                                className="btn btn-danger btn-sm"
                                onClick={() => handleNotAvail(item)}
                              >
                                N/A
                              </button>
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* {submitButton && (
            <div className="ml-auto mr-auto text-center">
              <button
                className="btn onboardBtn btn_primary"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentTab;
