import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";
import DocumentTab from "../../PreOnboarding/DocumentTab";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
const normalUserLayout = true;

const UpdateDocument = () => {
  const [documentData, setDocumentData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [mandatoryFilter, setMandatoryFillter] = useState("");
  const mandatoryOptions = [
    { value: "all", label: "ALL" },
    { value: true, label: "isRequired" },
    { value: false, label: "nonRequired" },
  ];

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { user_id } = useParams();
  const [user, setUser] = useState({});
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();

  async function getDocuments() {
    const response = await axios.post(baseUrl + "get_user_doc", {
      user_id: user_id,
    });
    setDocumentData(response.data.data);
    setFilterData(response.data.data);
  }

  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${user_id}`).then((res) => {
      setUser(res.data);
    });
  };

  useEffect(() => {
    getData();
    getDocuments();
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
      const requiredDocuments = documentData.filter(
        (doc) =>
          doc.document.isRequired &&
          doc.document.job_type.includes(user.job_type)
      );
      const isAnyRequiredDocumentMissing = requiredDocuments.some(
        (doc) => !doc.file
      );

      // if (isAnyRequiredDocumentMissing) {
      //   toastError("Please upload all required documents");
      //   return;
      // }
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
      if (user.att_status == "registered" && isAnyRequiredDocumentMissing) {
        axios.put(baseUrl + "update_user", {
          user_id: user_id,
          att_status: "document_upload",
        });
        navigate("/admin/wfhd-overview");
      }
      toastAlert("Documents Updated");
      getDocuments();
    } catch (error) {
      console.error("Error submitting documents", error);
    }
  };

  // const handleFilterChange = (option) => {
  //   if (option === "all") {
  //     setDocumentData(documentData);
  //   } else if (option === "required") {
  //     const requiredDocs = documentData.filter(
  //       (doc) =>
  //         doc.document.isRequired &&
  //         doc.document.job_type.includes(user.job_type)
  //     );
  //     setDocumentData(requiredDocs);
  //   } else if (option === "nonRequired") {
  //     const nonRequiredDocs = documentData.filter(
  //       (doc) => doc.document.isRequired == false
  //     );
  //     setDocumentData(nonRequiredDocs);
  //   }
  // };

  // useEffect(() => {
  //   const result = filterData.filter((d) => {
  //     const mandatory = !mandatoryFilter || d.document.isRequired;
  //     return mandatory;
  //   });
  //   setDocumentData(result);
  // }, [filterData, mandatoryFilter]);
  useEffect(() => {
    if (mandatoryFilter === "all") {
      getDocuments(); // This resets the document data to its original state
    } else {
      const result = filterData.filter((d) => {
        if (mandatoryFilter === true) {
          return (
            d.document.isRequired && d.document.job_type.includes(user.job_type)
          );
        } else if (mandatoryFilter === false) {
          return !d.document.isRequired;
        }
        return true; // In case there's no filter selected or an unexpected value
      });
      setDocumentData(result);
    }
  }, [mandatoryFilter, filterData, user.job_type]);

  return (
    <>
      <div
        className={`documentarea ${normalUserLayout && "documentareaLight"}`}
      >
        <div className="document_box">
          <h2>Documents</h2>
          {/* <select
            onChange={(e) => handleFilterChange(e.target.value)}
            className="form-select"
            style={{ marginBottom: "2%", width: "20%" }}
          >
            <option value="all">All Documents</option>
            <option value="required">Required Documents</option>
            <option value="nonRequired">Non-Required Documents</option>
          </select> */}
          <Select
            value={mandatoryOptions.find(
              (option) => option.value === mandatoryFilter
            )}
            onChange={(selectedOption) => {
              setMandatoryFillter(selectedOption.value);
            }}
            options={mandatoryOptions}
          />

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
                      {item.document.isRequired &&
                        item.document.job_type.includes(user.job_type) && (
                          <span style={{ color: "red" }}> (Mandatory)</span>
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
          <div className="ml-auto mr-auto text-center">
            <button
              type="submit"
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
};

export default UpdateDocument;
