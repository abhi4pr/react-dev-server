import axios from "axios";
import React, { useEffect, useState } from "react";
import { FcDownload } from "react-icons/fc";
import ApproveReject from "./ApproveReject";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const DocumentTabUserSingle = (id) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [documentData, setDocumentData] = useState([]);
  const [rejectReasonActive, setRejectReasonActive] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const getDocuments = async () => {
    try {
      const response = await axios.post(baseUrl + "get_user_doc", {
        user_id: id.id,
      });
      setDocumentData(response.data.data);
    } catch (error) {
      console.log(error, "Error Fetching data");
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  const handleDocumentUpdate = async (e, id, status, reason) => {
    e.preventDefault();
    try {
      const payload = {
        _id: id,
        status: status,
      };

      if (reason) {
        payload.reject_reason = reason;
      }

      const response = await axios.put(baseUrl + "update_user_doc", payload);
      setRejectReason("");
      setRejectReasonActive("");
      status == "Approved" && toastAlert(status);
      status == "Rejected" && toastError(status);
      getDocuments();
    } catch (error) {
      console.error("Error white Submitting data", error);
    }
  };

  return (
    <>
      <div className={`documentarea  "documentareaLight"`}>
        <div className="document_box">
          <div
            className={`docTable 
               docTableLight
             table-responsive`}
          >
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Document Type</th>
                  <th scope="col">View</th>
                  <th scope="col" className="text-center">
                    Action
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
                    <td>
                      <div className="uploadDocBtn">
                        <span>
                          {item?.doc_image ? (
                            <a
                              href={item.doc_image_url}
                              target="_blank"
                              download
                            >
                              <img src={item.doc_image_url} alt="doc image" />
                              <i class="fa-solid fa-eye" />
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <ApproveReject data={item.status} />
                      {item.status == "Verification Pending" && (
                        <div className="docStatus warning_badges warning_badgesTwo">
                          <button
                            type="button"
                            onClick={(e) =>
                              handleDocumentUpdate(e, item._id, "Approved")
                            }
                            className="btn btn-success btn-sm mr-2"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectReasonActive(item._id)}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
                          </button>

                          {/* <span
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
                            </span> */}
                        </div>
                      )}
                      {rejectReasonActive == item._id && (
                        <div className="documentCard_input">
                          <input
                            required
                            type="text"
                            className="form-control"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                          />
                          <button
                            className="btn btn-sm btn-primary"
                            type="submit"
                            onClick={(e) =>
                              handleDocumentUpdate(
                                e,
                                item._id,
                                "Rejected",
                                rejectReason
                              )
                            }
                          >
                            Submit
                          </button>
                        </div>
                      )}
                      {item.status == "" && "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentTabUserSingle;
