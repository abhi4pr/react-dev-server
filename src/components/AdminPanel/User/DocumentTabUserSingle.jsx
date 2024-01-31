import axios from "axios";
import React, { useEffect, useState } from "react";
import { FcDownload } from "react-icons/fc";
import ApproveReject from "./ApproveReject";
import { useGlobalContext } from "../../../Context/Context";
import {baseUrl} from '../../../utils/config'

const DocumentTabUserSingle = (id) => {
  const { toastAlert } = useGlobalContext();
  const [documentData, setDocumentData] = useState([]);
  const [rejectReasonActive, setRejectReasonActive] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const getDocuments = async () => {
    try {
      const response = await axios.post(
        baseUrl+"get_user_doc",
        {
          user_id: id.id,
        }
      );
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

      console.log(payload);
      const response = await axios.put(
        baseUrl+"update_user_doc",
        payload
      );
      toastAlert("Approved");
      setRejectReason("");
      setRejectReasonActive("");

      getDocuments();
    } catch (error) {
      console.error("Error white Submitting data", error);
    }
  };

  return (
    <>
      <div className="documentCard_view">
        <div className="row align-items-baseline">
          {documentData
            // .filter((item) => item?.status !== "")
            .map((data) => (
              <>
                {console.log(data.status)}
                <div
                  className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                  key={data._id}
                >
                  <div className="card documentCard_bx">
                    <div className="card-body">
                      <div className="img-thumbnail">
                        <img
                          src={data.doc_image_url}
                          alt={`${data.document.doc_type?.toLowerCase()}_photo`}
                        />
                      </div>
                      <div className="documentCard_text">
                        <h3>{data.document.doc_type}</h3>
                        {data.status !== "" && (
                          <div className="documentCard_download">
                            <a href={data.doc_image_url} download>
                              <FcDownload />
                            </a>
                          </div>
                        )}
                      </div>
                      {data.status == "Verification Pending" && (
                        <div className="documentCard_action">
                          <button
                            className="btn  btn-sm btn-success"
                            type="button"
                            onClick={(e) =>
                              handleDocumentUpdate(e, data._id, "Approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            type="button"
                            onClick={() => setRejectReasonActive(data._id)}
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      <ApproveReject data={data.status} />
                      {rejectReasonActive == data._id && (
                        <div className="documentCard_input">
                          <input
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
                                data._id,
                                "Rejected",
                                rejectReason
                              )
                            }
                          >
                            Submit
                          </button>
                        </div>
                      )}
                      {data.status == "" && "N/A"}
                    </div>
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default DocumentTabUserSingle;
