import React, { useCallback, useEffect, useState } from "react";
import useInvoiceTemplateImages from "./Templates/Hooks/useInvoiceTemplateImages";
import Modal from "react-modal";
import { baseUrl } from "../../../utils/config";
import axios from "axios";
import TemplateAssignedUsers from "./TemplateAssignedUsers";

const templateImages = useInvoiceTemplateImages();

const HRTemplateOverview = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [isTemplatePreviewModalOpen, setIsTemplatePreviewModalOpen] =
    useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isSeletedTemplateUsersModalOpen, setIsSelectedUsersModalOpen] =
    useState(false);
  const [templateWiseData, setTemplateWiseData] = useState([]);

  useEffect(() => {
    const getTemplateData = async () => {
      try {
        const response = await axios.get(
          baseUrl + "get_all_users_with_invoiceno"
        );
        setTemplateWiseData(response.data.message);
      } catch (error) {
        console.error("Data fetching error", error);
      }
    };
    getTemplateData();
  }, []);

  const selectedTemplateUsers = useCallback(
    (templateId) => {
      return templateWiseData.find((item) => item._id == templateId);
    },
    [templateWiseData]
  );

  function openTemplatePreviewModal(image) {
    setPreviewImage(image);
    setIsTemplatePreviewModalOpen(true);
  }

  function closeTemplatePreviewModal() {
    setIsTemplatePreviewModalOpen(false);
  }

  function openSelectedTemplateUsersModal() {
    setIsSelectedUsersModalOpen(true);
  }

  function closeSelectedTemplateUsersModal() {
    setIsSelectedUsersModalOpen(false);
  }

  return (
    <div>
      <div className="transfer_body">
        <div className="transfer_boxes">
          {templateImages.map((d) => (
            <label className="transfer_bx" key={d.temp_id}>
              <input
                type="radio"
                value={selectedTemplate}
                name="transfer-radio"
                checked={selectedTemplate === d.temp_id}
                onChange={() => setSelectedTemplate(d.temp_id)}
              />
              <span className="cstm-radio-btn">
                <i className="bi bi-check2" />
                <div className="boy_img">
                  <img
                    src={d.image}
                    alt="img"
                    onClick={() => openTemplatePreviewModal(d.image)}
                  />
                  <i
                    className="bi bi-eye"
                    onClick={() => openTemplatePreviewModal(d.image)}
                  />
                  <h3>Template No: {d.temp_id}</h3>
                  <div className="d-flex">
                    <h3>
                      Assigned:{" "}
                      {selectedTemplateUsers(d.temp_id)?.count
                        ? selectedTemplateUsers(d.temp_id)?.count
                        : 0}
                    </h3>
                    <i
                      className="bi bi-eye"
                      onClick={() => {
                        openSelectedTemplateUsersModal();
                      }}
                    />
                  </div>
                </div>
              </span>
            </label>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isTemplatePreviewModalOpen}
        onRequestClose={closeTemplatePreviewModal}
        contentLabel="Image Preview"
        appElement={document.getElementById("root")}
        style={{
          content: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            maxWidth: "80vw",
            maxHeight: "80vh",
            overflow: "auto",
          },
        }}
      >
        <div className="d-flex flex-column ">
          <img src={previewImage} alt="Preview" style={{ width: "100%" }} />
          <button
            className="btn btn-secondary"
            onClick={closeTemplatePreviewModal}
          >
            Close
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isSeletedTemplateUsersModalOpen}
        onRequestClose={closeSelectedTemplateUsersModal}
        contentLabel="Users Preview"
        appElement={document.getElementById("root")}
      >
        <TemplateAssignedUsers
          usersData={selectedTemplateUsers(selectedTemplate)?.users}
        />
      </Modal>
    </div>
  );
};

export default HRTemplateOverview;
