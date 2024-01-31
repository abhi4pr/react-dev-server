import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import DigitalSignature from "../DigitalSignature/DigitalSignature";
import { TextField } from "@mui/material";
import { FcDownload } from "react-icons/fc";
import { baseUrl } from "../../utils/config";

const LetterTab = ({ allUserData, gettingData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reasonField, setReasonField] = useState(false);
  const [reason, setReason] = useState("");

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const todayDate = `${year}-${month}-${day}`;

  const handleReject = () => {
    const formData = new FormData();
    formData.append("user_id", allUserData.user_id);
    formData.append("offer_later_status", false);
    formData.append("offer_later_reject_reason", reason);

    axios
      .put(`${baseUrl}`+`update_user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        gettingData();
        setReason("");
      });
  };

  console.log(allUserData);

  return (
    <>
      <div className="letterBoard">
        {allUserData.offer_letter_send == true ? (
          <div className="thm_textbx">
            <p>
              Welcome {allUserData.user_name} to CreativeFuel As our new{" "}
              {allUserData.designation_name}, he/she brings valuable experience
              to our team. <br />
              Based at {allUserData.permanent_address}, {allUserData.user_name}{" "}
              officially joined us on{" "}
              {allUserData.joining_date
                .split("T")[0]
                .split("-")
                .reverse()
                .join("-")}{" "}
              and reports to {allUserData.user_report_to_id}. <br />
              We're confident {allUserData.user_name} will seamlessly integrate
              into our collaborative work culture, contributing to our success.{" "}
              <br />
              The competitive compensation package, including a comprehensive
              salary {allUserData.ctc}, reflects his/her value. <br />
              {allUserData.user_name}'s digital signature symbolizes his/her
              commitment. Congratulations on accepting our offer—we look forward
              to achieving great milestones together!
            </p>
          </div>
        ) : (
          ""
        )}
        <div className="letterAction">
          {allUserData.offer_later_status == false ? (
            <div className="letterStatus">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsModalOpen(true), setReasonField(false);
                }}
              >
                Accept
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setReasonField(true)}
              >
                Reject
              </button>
            </div>
          ) : (
            ""
          )}

          {allUserData.offer_letter_send == true ? (
            <span className="btn btn-outline-primary">
              <FcDownload
                onClick={() =>
                  window.open(
                    allUserData.offer_later_pdf_url,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              />
              Download
            </span>
          ) : (
            ""
          )}
        </div>
      </div>

      {reasonField && (
        <>
          <div className="rejectReason board_form">
            <div className="form-group">
              <TextField
                id="outlined-basic"
                label="Reason"
                variant="outlined"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={() => handleReject()}>
              Submit
            </button>
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Example Modal"
        appElement={document.getElementById("root")}
      >
        <DigitalSignature
          userID={allUserData.user_id}
          closeModal={() => setIsModalOpen(false)}
          offetLetterAcceptanceDate={todayDate}
          offerLetterStatus={true}
          gettingData={gettingData}
        />
      </Modal>
    </>
  );
};

export default LetterTab;
