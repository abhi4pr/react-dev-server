import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import DigitalSignature from "../../../DigitalSignature/DigitalSignature";
import getDecodedToken from "../../../../utils/DecodedToken";
import axios from "axios";

const ViewEditDigiSignature = () => {
  const token = getDecodedToken();
  const loginUserId = token.id;
  const [digitalSingatureImage, setDigitalSignatureImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const gettingData = async () => {
    const response = await axios.get(
      `http://192.168.29.68:3000/api/get_single_user/${loginUserId}`
    );
    const DSImage = await response?.data?.digital_signature_image_url;
    setDigitalSignatureImage(DSImage);
  };

  useEffect(() => {
    gettingData();
  }, [loginUserId]);

  return (
    <>
      <div>
        Your Digital Signature is:
        <img
          src={digitalSingatureImage}
          alt="Digital Signature Preview"
          style={{ maxWidth: "600px", height: "300px" }}
        />
      </div>

      <button className="btn btn-primary mr-3" onClick={openModal}>
        Add New Digital Signature
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        appElement={document.getElementById("root")}
      >
        <DigitalSignature
          userID={token.id}
          closeModal={closeModal}
          gettingData={gettingData}
        />
        <button onClick={closeModal}>Close Modal</button>
      </Modal>
    </>
  );
};

export default ViewEditDigiSignature;
