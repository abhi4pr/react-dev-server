import React, { useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { useGlobalContext } from "../../Context/Context";

const DigitalSignature = ({
  userID,
  closeModal,
  offetLetterAcceptanceDate,
  offerLetterStatus,
  gettingData,
}) => {
  const { toastAlert } = useGlobalContext();

  const [signature, setSignature] = useState();

  const handleClear = () => {
    signature.clear();
  };

  const handleGenerate = () => {
    const canvas = signature.getTrimmedCanvas();
    canvas.toBlob((blob) => {
      if (blob) {
        const formData = new FormData();
        formData.append("user_id", userID);

        // Get current date and time in ISO format
        const currentDateTime = new Date().toISOString();

        // Create a file name with the current date and time
        const fileName = `digital_signature_${currentDateTime}.png`;

        // Create a File object from the blob with the new file name
        const file = new File([blob], fileName, {
          type: "image/png",
        });

        formData.append("digital_signature_image", file);

        {
          offetLetterAcceptanceDate &&
            formData.append(
              "offer_later_acceptance_date",
              offetLetterAcceptanceDate
            );
        }
        {
          offerLetterStatus &&
            formData.append("offer_later_status", offerLetterStatus);
        }

        axios
          .put(`http://192.168.29.68:3000/api/update_user`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            closeModal();
            gettingData();
            toastAlert("Submitted");
          });
        signature.clear();
      }
    }, "image/png");
  };

  return (
    <>
      <h1>Digital Signature</h1>
      <div
        style={{ border: "2px solid black", height: "200px", width: "500px" }}
      >
        <SignatureCanvas
          ref={(data) => setSignature(data)}
          canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
        />
      </div>
      <div className="mt-3">
        <button className="btn btn-outline-danger mr-3" onClick={handleClear}>
          Clear
        </button>
        <button className="btn btn-primary" onClick={handleGenerate}>
          Save
        </button>
      </div>
      <br />
    </>
  );
};

export default DigitalSignature;
