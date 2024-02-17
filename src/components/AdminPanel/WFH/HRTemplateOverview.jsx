import React, { useEffect, useState } from "react";
import useInvoiceTemplateImages from "./Templates/Hooks/useInvoiceTemplateImages";
import Modal from "react-modal";
import { baseUrl } from "../../../utils/config";
import axios from "axios";

const templateImages = useInvoiceTemplateImages();

const HRTemplateOverview = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
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

  function templateUserCount(templateId) {
    return templateWiseData.find((item) => item._id == templateId)?.count;
  }

  function openModal(image) {
    setPreviewImage(image);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
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
                    onClick={() => openModal(d.image)}
                  />
                  <i className="bi bi-eye" onClick={() => openModal(d.image)} />{" "}
                  <h3>Template No: {d.temp_id}</h3>
                  <h3>Assigned: {templateUserCount(d.temp_id)}</h3>
                </div>
              </span>
            </label>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Preview"
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
          <button className="btn btn-secondary" onClick={closeModal}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default HRTemplateOverview;
