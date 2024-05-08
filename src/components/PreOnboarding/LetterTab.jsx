import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import DigitalSignature from "../DigitalSignature/DigitalSignature";
import { TextField } from "@mui/material";
import { FcDownload } from "react-icons/fc";
import { baseUrl } from "../../utils/config";
import html2pdf from "html2pdf.js";
import logo from "/logo.png";
const LetterTab = ({ allUserData, gettingData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reasonField, setReasonField] = useState(false);
  const [reason, setReason] = useState("");
  const [image64, setImage64] = useState("");

  const [previewOffer, setpreview] = useState(false);
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
      .put(`${baseUrl}` + `update_user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        gettingData();
        setReason("");
      });
  };
  const handelClose = () => {
    setpreview(!previewOffer);
  };
  const downloadOfferLetter = () => {
    console.log(allUserData, "allUserData");
    var element = document.getElementById("element-to-print");
    var opt = {
      margin: 1,
      filename: `${allUserData.user_name}_offer_letter.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  useEffect(() => {
    axios
      .post(baseUrl + "image_to_base64", {
        imageUrl: allUserData.digital_signature_image_url,
      })
      .then((response) => {
        setImage64(response.data.base64String);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  console.log(image64, "image 64");

  return (
    <>
      <div className="dis-none">
        <div
          id="element-to-print"
          style={{ color: "black", background: "white" }}
        >
          <br />
          <header className="header-letter">
            <img src={logo} alt="Creativefuel Logo" width={70} height={70} />
            <div className="brandtext">
              Creative <span>fuel</span>
            </div>
          </header>
          <article>
            <p>
              Date{" "}
              {allUserData?.joining_date
                ? new Date(allUserData.joining_date).toLocaleDateString()
                : ""}
            </p>

            <section>
              <p className="bold">
                To,
                <br />
                {allUserData?.user_name}
                <br />
              </p>
              <p> {allUserData?.permanent_address}</p>
            </section>

            <section>
              <p className="header-letter bold">Subject: Offer Letter</p>
              <p>
                Welcome to the 2squad! We are all here because someone,
                somewhere, once said, “I think marketing could be fun.”
              </p>
              <br />
              <div>
                <p className="bold">Dear {allUserData?.user_name},</p>
                <br />
                <p>
                  We are pleased to extend this offer letter to you to join
                  Creativefuel, a leading marketing agency that thrives on
                  innovation, creativity, and collaboration. After a thorough
                  assessment of your skills and qualifications, we are confident
                  that you are the perfect fit for our team.
                </p>{" "}
                <br />
              </div>
              <div>
                <p className="bold">
                  Position: {allUserData?.designation_name}
                </p>
                <p className="bold">Reports to: {allUserData?.Report_L1N}</p>
                <p className="bold">
                  Start Date:{" "}
                  {allUserData?.joining_date && (
                    <span>
                      Date{" "}
                      {new Date(allUserData.joining_date).toLocaleDateString()}
                    </span>
                  )}
                </p>
                <p className="bold">Location: Indore</p>
              </div>{" "}
              <br />
              <div>
                <p className="bold">1)Compensation:</p>
                <p>
                  Your remuneration will have a fixed component of INR{" "}
                  {allUserData?.ctc} Lacs per annum (CTC), paid monthly, and a
                  detailed breakdown of your remuneration can be found in
                  [Annexure-A].
                </p>
              </div>{" "}
              <br />
              <div>
                <p className="bold">2)Acceptance:</p>
                <p>
                  To accept this offer, please sign and return a copy of this
                  letter within 48 hours. You can scan and email it to,
                  onboarding@creativefuel.io CC: fahbir@creativefuel.io or just
                  reply back if I accept the offer. We are excited about the
                  prospect of having you onboard and look forward to your
                  positive response.
                </p>
              </div>{" "}
              <br />
              <footer
                className="footer-letter "
                style={{ pageBreakAfter: "auto" }}
              >
                <p className="bold">CREATIVEFUEL PRIVATE LIMITED</p>
                <p className="bold">
                  Registered Office: - 105, Gravity Mall, Vijay Nagar Indore
                  (M.P) 452010, India
                </p>
                <p className="bold">
                  Email:
                  <a href="mailto:fahbir@creativefuel.io">
                    fahbir@creativefuel.io
                  </a>
                </p>
                <p className="bold">www.creativefuel.io</p>
              </footer>
              <header className="header-letter mt-2">
                <img
                  src={logo}
                  alt="Creativefuel Logo"
                  width={70}
                  height={70}
                />
                <div className="brandtext">
                  Creative <span>fuel</span>
                </div>
              </header>
              <div>
                <p className="bold">3)Probation Period:</p>
                <p>
                  Both parties agree to a probationary period of three months,
                  during which either party may terminate the employment
                  relationship with a notice period of 7 days. This period is
                  intended to allow both you and Creativefuel to assess the
                  mutual fit and alignment of expectations.
                </p>
              </div>{" "}
              <br />
              <div>
                <p className="bold">4)Performance Review:</p>
                <p>
                  At the end of the probation period, your performance will be
                  reviewed. If your performance aligns with our expectations and
                  you are comfortable with the work environment, the
                  probationary status will be lifted.
                </p>
              </div>{" "}
              <br />
              <div>
                <p className="bold">5)Employment Relationship:</p> <br />
                <div>
                  <p>
                    A) Your annual leaves will be as per the company's
                    attendance and leave policy. Uninformed or unapproved
                    absence from work for a continuous period of 5 days or
                    beyond the period of approved leave, without prior approval
                    of the reporting manager shall result in automatic
                    termination of your employment without any further notice
                    unless the Company waives such requirement.
                  </p>{" "}
                  <br />
                  <p>
                    B) The company reserves its legal right to terminate you
                    immediately in case of deviation or nonadherence to
                    company's policies and rules as communicated via this letter
                    and in other physical or digital documents provided to you
                    pursuant to your signing of this letter. The Company may
                    also terminate you with immediate effect for any dishonest
                    and malicious practices, poor attendance, violation of
                    company policies, involvement in criminal act or non-
                    performance for a prolonged period.
                  </p>{" "}
                  <br />
                  <footer
                    className="footer-letter "
                    style={{ pageBreakAfter: "always" }}
                  >
                    <p className="bold">CREATIVEFUEL PRIVATE LIMITED</p>
                    <p className="bold">
                      Registered Office: - 105, Gravity Mall, Vijay Nagar Indore
                      (M.P) 452010, India
                    </p>
                    <p className="bold">
                      Email:
                      <a href="mailto:fahbir@creativefuel.io">
                        fahbir@creativefuel.io
                      </a>
                    </p>
                    <p className="bold">www.creativefuel.io</p>
                  </footer>
                  <header className="header-letter">
                    <img
                      src={logo}
                      alt="Creativefuel Logo"
                      width={70}
                      height={70}
                    />
                    <div className="brandtext">
                      Creative <span>fuel</span>
                    </div>
                  </header>
                  <p>
                    C) In case of termination, the company, at its sole
                    discretion, will recover such amount, as the case may be, in
                    lieu of notice period against the full and final settlement
                    upon your separation. In such a case, the company will also
                    not be liable to pay you any pending salary. Furthermore,
                    the Company is at liberty to recover any amount in relation
                    to the performance bonus and sign-on bonus, if any, earned
                    by you, in case your employment relationship gets terminated
                    before completion of one year upon joining.
                  </p>{" "}
                  <br />
                  <p>
                    D) You are required to indemnify and keep indemnifying the
                    Company against all claims, damages, losses etc., which the
                    Company might suffer, on account of any breach by you of any
                    of the terms of your employment or the terms of any policy
                    of the Company. The Company shall, in addition to any other
                    remedies available by law, be entitled to an injunction
                    restraining you from breaching or otherwise violating any
                    terms of your employment.
                  </p>
                  <p>
                    You shall be bound by all policies and procedures of the
                    Company, which may change from time to time. The management
                    of the Company reserves the right to amend and update the
                    policies and procedures of the Company.
                  </p>{" "}
                  <br />
                </div>
              </div>
              <div>
                <p className="bold">6)Reimbursement for Expenses:</p>
                <p>
                  You will be reimbursed for reasonable expenses incurred by you
                  in performance of your duties, according to the Company's
                  Expense Policy.
                </p>{" "}
                <br />
              </div>
              <div>
                <p className="bold">7)Absence/Leave:</p>
                <p>
                  Your annual leaves will be as per the Company's Attendance and
                  Leave Policy. Uninformed or unapproved absence from work for a
                  continuous period of 3 days or beyond the period of approved
                  leave, without prior approval of the reporting manager shall
                  result in automatic termination of your employment without any
                  further notice unless the Company waives such requirement.
                </p>{" "}
                <br />
              </div>
              <footer
                className="footer-letter "
                style={{ pageBreakAfter: "always" }}
              >
                <p className="bold">CREATIVEFUEL PRIVATE LIMITED</p>
                <p className="bold">
                  Registered Office: - 105, Gravity Mall, Vijay Nagar Indore
                  (M.P) 452010, India
                </p>
                <p className="bold">
                  Email:
                  <a href="mailto:fahbir@creativefuel.io">
                    fahbir@creativefuel.io
                  </a>
                </p>
                <p className="bold">www.creativefuel.io</p>
              </footer>
              <header className="header-letter">
                <img
                  src={logo}
                  alt="Creativefuel Logo"
                  width={70}
                  height={70}
                />
                <div className="brandtext">
                  Creative <span>fuel</span>
                </div>
              </header>
              <div>
                <p className="bold">8)Indemnity:</p>
                <p>
                  You are required to indemnify and keep indemnifying the
                  Company against all claims, damages, losses etc., which the
                  Company might suffer, on account of any breach by you of any
                  of the terms of your employment or the terms of any policy of
                  the Company. The Company shall, in addition to any other
                  remedies available by law, be entitled to an injunction
                  restraining you from breaching or otherwise violating any
                  terms of your employment.
                </p>{" "}
                <br />
              </div>
              <div>
                <p className="bold">9)Acknowledgement:</p>
                <p>
                  You are required to indemnify and keep indemnifying the
                  Company against all claims, damages, losses etc., which the
                  Company might suffer, on account of any breach by you of any
                  of the terms of your employment or the terms of any policy of
                  the Company. The Company shall, in addition to any other
                  remedies available by law, be entitled to an injunction
                  restraining you from breaching or otherwise violating any
                  terms of your employment.
                </p>{" "}
                <br />
              </div>
              <div>
                <p className="bold">10)Understanding:</p>
                <p>
                  This letter contains the entire understanding between the
                  parties and supersedes all previous agreements and/or
                  arrangements relating to engagement with the company.
                </p>{" "}
                <br />
              </div>
              <div>
                <p className="bold">11)Company policies:</p>
                <p>
                  You shall be bound by all policies and procedures of the
                  Company, which may change from time to time. The management of
                  the Company reserves the right to amend and update the
                  policies and procedures of the Company.
                </p>{" "}
                <br />
              </div>
            </section>
            <footer
              className="footer-letter "
              style={{ pageBreakAfter: "always" }}
            >
              <p className="bold">CREATIVEFUEL PRIVATE LIMITED</p>
              <p className="bold">
                Registered Office: - 105, Gravity Mall, Vijay Nagar Indore (M.P)
                452010, India
              </p>
              <p className="bold">
                Email:
                <a href="mailto:fahbir@creativefuel.io">
                  fahbir@creativefuel.io
                </a>
              </p>
              <p className="bold">www.creativefuel.io</p>
            </footer>
            <header className="header-letter">
              <img src={logo} alt="Creativefuel Logo" width={70} height={70} />
              <div className="brandtext">
                Creative <span>fuel</span>
              </div>
            </header>
            <div>
              <div>
                <p>
                  Get ready to embark on a marketing adventure where every day
                  brings a new challenge, a fresh idea, and a funny meme.
                </p>

                <p>
                  We eagerly await your decision and the opportunity to work
                  alongside you in pursuit of excellence and innovation. Your
                  acceptance of this offer would mark the beginning of an
                  exciting chapter with Creativefuel.
                </p>
              </div>{" "}
              <br />
              <div>
                <p className="bold">
                  Sincerely, on behalf of Creativefuel Private Limited,
                  <br />
                  Authorized Signatory
                </p>
                <br />
                <img
                  className="signature-img"
                  src="data:image/png;base64,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"
                  width={50}
                  alt="Creativefuel Logo"
                />
                <h5 className="bold">
                  Pallavi Tomar
                  <br />
                  (HR Manager)
                </h5>
              </div>
              <div>
                <p className="bold header-letter">Acceptance</p>
                <p>
                  I hereby accept the offer along with the terms and conditions
                  of employment with Creativefuel Private Limited as stated
                  hereinafter. I confirm that I am not breaching any terms or
                  provisions of any prior agreement or arrangement by accepting
                  this offer.
                </p>
                <br />
                <img
                  className="signature-img"
                  src={`data:image/png;base64,${image64}`}
                  alt=""
                />
                <br />
                <p className="bold">
                  {allUserData?.user_name}
                  <br />
                  {allUserData?.permanent_address}
                  <br />
                  {/* Date{" "}
                  {allUserData?.joining_date && (
                    <span>
                      Date{" "}
                      {allUserData.joining_date
                        ? new Date(
                            allUserData.joining_date
                          ).toLocaleDateString()
                        : ""}
                    </span>
                  )} */}
                </p>
              </div>
              {/* <div>
                <h5>Name: - {allUserData?.user_name}</h5>
                <h5>Designation: - {allUserData?.designation_name}</h5>
                <h5>
                  D.O.J: -{" "}
                  {allUserData.joining_date_extend
                    ? new Date(
                        allUserData.joining_date_extend
                      ).toLocaleDateString()
                    : allUserData?.joining_date
                    ? new Date(allUserData.joining_date).toLocaleDateString()
                    : ""}
                </h5>
              </div> */}
            </div>
          </article>
          <footer
            className="footer-letter "
            style={{ pageBreakAfter: "always" }}
          >
            <p className="bold">CREATIVEFUEL PRIVATE LIMITED</p>
            <p className="bold">
              Registered Office: - 105, Gravity Mall, Vijay Nagar Indore (M.P)
              452010, India
            </p>
            <p className="bold ">
              Email:
              <a href="mailto:fahbir@creativefuel.io">fahbir@creativefuel.io</a>
            </p>
            <p className="bold">www.creativefuel.io</p>
          </footer>
        </div>
      </div>
      <div className="letterBoardContainer">
        <div className="cardBoard">
          <div className="cardHeaderBoard">
            <div className="letterBoard">
              <div className="thm_textbx">
                <p>
                  Hello {allUserData.user_name}, Welcome to Creativefuel - The
                  home to the most vibrant & talented individuals! We're to have
                  you join our team of Meme Enthusiasts & Coffee Addicts as a{" "}
                  {allUserData.designation_name}! We believe that your
                  experience & skills will be a great asset to our organisation.
                  Congratulations on your new role, and cheers to a journey full
                  of excitement, growth & achievement!
                  {/* Welcome {allUserData.user_name} to CreativeFuel As our new{" "}
            {allUserData.designation_name}, he/she brings valuable experience to
            our team. <br />
            Based at {allUserData.permanent_address}, {allUserData.user_name}{" "}
            officially joined us on{" "}
            {allUserData.joining_date
              .split("T")[0]
              .split("-")
              .reverse()
              .join("-")}{" "}
            and reports to {allUserData.Report_L1N}. <br />
            We're confident {allUserData.user_name} will seamlessly integrate
            into our collaborative work culture, contributing to our success.{" "}
            <br />
            The competitive compensation package, including a comprehensive
            salary {allUserData.ctc}, reflects his/her value. <br />
            {allUserData.user_name}'s digital signature symbolizes his/her
            commitment. Congratulations on accepting our offer—we look forward
            to achieving great milestones together! */}
                </p>
              </div>

              {/* <span onClick={downloadOfferLetter} className="btn btn-outline-primary">
          <FcDownload />
          Download
        </span> */}

              <div className="letterAction">
                {allUserData.offer_later_status == false &&
                  allUserData.offer_later_reject_reason == "" && (
                    <div className="letterStatus">
                      <button
                        className="btn onboardBtn btn_primary"
                        onClick={() => {
                          setIsModalOpen(true), setReasonField(false);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="btn onboardBtn btn_secondary"
                        onClick={() => {
                          setpreview("true");
                        }}
                      >
                        Preview
                      </button>
                      {/* <button
                  className="btn btn-danger"
                  onClick={() => setReasonField(true)}
                >
                  Reject
                </button> */}
                    </div>
                  )}

                {allUserData.offer_later_reject_reason !== "" && (
                  <p>Reject Reason - {allUserData.offer_later_reject_reason}</p>
                )}
                {allUserData.offer_later_status && (
                  <button
                    onClick={downloadOfferLetter}
                    className="btn onboardBtn btn_primary d-flex align-items-center"
                  >
                    <i class="bi bi-cloud-arrow-down mr-2"></i>
                    Download
                  </button>
                )}
                {reasonField && (
                  <>
                    {allUserData.offer_later_reject_reason == "" && (
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
                        <button
                          className="btn btn-primary"
                          onClick={() => handleReject()}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <Modal
                isOpen={previewOffer}
                onRequestClose={() => setpreview(false)}
                contentLabel="offerletter Modal"
                //sty appElement={}'
                style={{
                  content: {
                    width: "750px",
                    display: "flex",

                    flexDirection: "column",
                    position: "absolute",
                    left: "calc(100vw / 2 - 300px)",
                  },
                }}
              >
                <div className="pack sb">
                  <div></div>
                  <button
                    className="btn cmnbtn btn_sm btn-danger"
                    onClick={handelClose}
                  >
                    close
                  </button>
                </div>
                <div style={{ width: "700px" }}>
                  <div
                    id="element-to-print"
                    style={{ color: "black", background: "white" }}
                  >
                    <br />
                    <header className="header-letter">
                      <img
                        src={logo}
                        alt="Creativefuel Logo"
                        width={70}
                        height={70}
                      />
                      <div className="brandtext">
                        Creative <span>fuel</span>
                      </div>
                    </header>
                    <article>
                      <p>
                        Date{" "}
                        {allUserData?.joining_date
                          ? new Date(
                              allUserData.joining_date
                            ).toLocaleDateString()
                          : ""}
                      </p>

                      <section>
                        <p className="bold">
                          To,
                          <br />
                          {allUserData?.user_name}
                          <br />
                        </p>
                        <p> {allUserData?.permanent_address}</p>
                      </section>

                      <section>
                        <p className="header-letter bold">
                          Subject: Offer Letter
                        </p>
                        <p>
                          Welcome to the 2squad! We are all here because
                          someone, somewhere, once said, “I think marketing
                          could be fun.”
                        </p>
                        <br />
                        <div>
                          <p className="bold">Dear {allUserData?.user_name},</p>
                          <br />
                          <p>
                            We are pleased to extend this offer letter to you to
                            join Creativefuel, a leading marketing agency that
                            thrives on innovation, creativity, and
                            collaboration. After a thorough assessment of your
                            skills and qualifications, we are confident that you
                            are the perfect fit for our team.
                          </p>{" "}
                          <br />
                        </div>
                        <div>
                          <p className="bold">
                            Position: {allUserData?.designation_name}
                          </p>
                          <p className="bold">
                            Reports to: {allUserData?.Report_L1N}
                          </p>
                          <p className="bold">
                            Start Date:{" "}
                            {allUserData?.joining_date && (
                              <span>
                                Date{" "}
                                {new Date(
                                  allUserData.joining_date
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                          <p className="bold">Location: Indore</p>
                        </div>{" "}
                        <br />
                        <div>
                          <p className="bold">1)Compensation:</p>
                          <p>
                            Your remuneration will have a fixed component of INR{" "}
                            {allUserData?.ctc} Lacs per annum (CTC), paid
                            monthly, and a detailed breakdown of your
                            remuneration can be found in [Annexure-A].
                          </p>
                        </div>{" "}
                        <br />
                        <div>
                          <p className="bold">2)Acceptance:</p>
                          <p>
                            To accept this offer, please sign and return a copy
                            of this letter within 48 hours. You can scan and
                            email it to, onboarding@creativefuel.io CC:
                            fahbir@creativefuel.io or just reply back if I
                            accept the offer. We are excited about the prospect
                            of having you onboard and look forward to your
                            positive response.
                          </p>
                        </div>{" "}
                        <br />
                        <footer
                          className="footer-letter "
                          style={{ pageBreakAfter: "auto" }}
                        >
                          <p className="bold">CREATIVEFUEL PRIVATE LIMITED</p>
                          <p className="bold">
                            Registered Office: - 105, Gravity Mall, Vijay Nagar
                            Indore (M.P) 452010, India
                          </p>
                          <p className="bold">
                            Email:
                            <a href="mailto:fahbir@creativefuel.io">
                              fahbir@creativefuel.io
                            </a>
                          </p>
                          <p className="bold">www.creativefuel.io</p>
                        </footer>
                        <div
                          style={{
                            width: "100%",
                            background: "black",
                            height: "2px",
                          }}
                        ></div>
                        <header className="header-letter mt-2">
                          <img
                            src={logo}
                            alt="Creativefuel Logo"
                            width={70}
                            height={70}
                          />
                          <div className="brandtext">
                            Creative <span>fuel</span>
                          </div>
                        </header>
                        <div>
                          <p className="bold">3)Probation Period:</p>
                          <p>
                            Both parties agree to a probationary period of three
                            months, during which either party may terminate the
                            employment relationship with a notice period of 7
                            days. This period is intended to allow both you and
                            Creativefuel to assess the mutual fit and alignment
                            of expectations.
                          </p>
                        </div>{" "}
                        <br />
                        <div>
                          <p className="bold">4)Performance Review:</p>
                          <p>
                            At the end of the probation period, your performance
                            will be reviewed. If your performance aligns with
                            our expectations and you are comfortable with the
                            work environment, the probationary status will be
                            lifted.
                          </p>
                        </div>{" "}
                        <br />
                        <div>
                          <p className="bold">5)Employment Relationship:</p>{" "}
                          <br />
                          <div>
                            <p>
                              A) Your annual leaves will be as per the company's
                              attendance and leave policy. Uninformed or
                              unapproved absence from work for a continuous
                              period of 5 days or beyond the period of approved
                              leave, without prior approval of the reporting
                              manager shall result in automatic termination of
                              your employment without any further notice unless
                              the Company waives such requirement.
                            </p>{" "}
                            <br />
                            <p>
                              B) The company reserves its legal right to
                              terminate you immediately in case of deviation or
                              nonadherence to company's policies and rules as
                              communicated via this letter and in other physical
                              or digital documents provided to you pursuant to
                              your signing of this letter. The Company may also
                              terminate you with immediate effect for any
                              dishonest and malicious practices, poor
                              attendance, violation of company policies,
                              involvement in criminal act or non- performance
                              for a prolonged period.
                            </p>{" "}
                            <br />
                            <footer
                              className="footer-letter "
                              style={{ pageBreakAfter: "always" }}
                            >
                              <p className="bold">
                                CREATIVEFUEL PRIVATE LIMITED
                              </p>
                              <p className="bold">
                                Registered Office: - 105, Gravity Mall, Vijay
                                Nagar Indore (M.P) 452010, India
                              </p>
                              <p className="bold">
                                Email:
                                <a href="mailto:fahbir@creativefuel.io">
                                  fahbir@creativefuel.io
                                </a>
                              </p>
                              <p className="bold">www.creativefuel.io</p>
                            </footer>
                            <div
                              style={{
                                width: "100%",
                                background: "black",
                                height: "2px",
                              }}
                            ></div>
                            <header className="header-letter">
                              <img
                                src={logo}
                                alt="Creativefuel Logo"
                                width={70}
                                height={70}
                              />
                              <div className="brandtext">
                                Creative <span>fuel</span>
                              </div>
                            </header>
                            <p>
                              C) In case of termination, the company, at its
                              sole discretion, will recover such amount, as the
                              case may be, in lieu of notice period against the
                              full and final settlement upon your separation. In
                              such a case, the company will also not be liable
                              to pay you any pending salary. Furthermore, the
                              Company is at liberty to recover any amount in
                              relation to the performance bonus and sign-on
                              bonus, if any, earned by you, in case your
                              employment relationship gets terminated before
                              completion of one year upon joining.
                            </p>{" "}
                            <br />
                            <p>
                              D) You are required to indemnify and keep
                              indemnifying the Company against all claims,
                              damages, losses etc., which the Company might
                              suffer, on account of any breach by you of any of
                              the terms of your employment or the terms of any
                              policy of the Company. The Company shall, in
                              addition to any other remedies available by law,
                              be entitled to an injunction restraining you from
                              breaching or otherwise violating any terms of your
                              employment.
                            </p>
                            <p>
                              You shall be bound by all policies and procedures
                              of the Company, which may change from time to
                              time. The management of the Company reserves the
                              right to amend and update the policies and
                              procedures of the Company.
                            </p>{" "}
                            <br />
                          </div>
                        </div>
                        <div>
                          <p className="bold">6)Reimbursement for Expenses:</p>
                          <p>
                            You will be reimbursed for reasonable expenses
                            incurred by you in performance of your duties,
                            according to the Company's Expense Policy.
                          </p>{" "}
                          <br />
                        </div>
                        <div>
                          <p className="bold">7)Absence/Leave:</p>
                          <p>
                            Your annual leaves will be as per the Company's
                            Attendance and Leave Policy. Uninformed or
                            unapproved absence from work for a continuous period
                            of 3 days or beyond the period of approved leave,
                            without prior approval of the reporting manager
                            shall result in automatic termination of your
                            employment without any further notice unless the
                            Company waives such requirement.
                          </p>{" "}
                          <br />
                        </div>
                        <footer
                          className="footer-letter "
                          style={{ pageBreakAfter: "always" }}
                        >
                          <p className="bold">CREATIVEFUEL PRIVATE LIMITED</p>
                          <p className="bold">
                            Registered Office: - 105, Gravity Mall, Vijay Nagar
                            Indore (M.P) 452010, India
                          </p>
                          <p className="bold">
                            Email:
                            <a href="mailto:fahbir@creativefuel.io">
                              fahbir@creativefuel.io
                            </a>
                          </p>
                          <p className="bold">www.creativefuel.io</p>
                        </footer>
                        <div
                          style={{
                            width: "100%",
                            background: "black",
                            height: "2px",
                          }}
                        ></div>
                        <header className="header-letter">
                          <img
                            src={logo}
                            alt="Creativefuel Logo"
                            width={70}
                            height={70}
                          />
                          <div className="brandtext">
                            Creative <span>fuel</span>
                          </div>
                        </header>
                        <div>
                          <p className="bold">8)Indemnity:</p>
                          <p>
                            You are required to indemnify and keep indemnifying
                            the Company against all claims, damages, losses
                            etc., which the Company might suffer, on account of
                            any breach by you of any of the terms of your
                            employment or the terms of any policy of the
                            Company. The Company shall, in addition to any other
                            remedies available by law, be entitled to an
                            injunction restraining you from breaching or
                            otherwise violating any terms of your employment.
                          </p>{" "}
                          <br />
                        </div>
                        <div>
                          <p className="bold">9)Acknowledgement:</p>
                          <p>
                            You are required to indemnify and keep indemnifying
                            the Company against all claims, damages, losses
                            etc., which the Company might suffer, on account of
                            any breach by you of any of the terms of your
                            employment or the terms of any policy of the
                            Company. The Company shall, in addition to any other
                            remedies available by law, be entitled to an
                            injunction restraining you from breaching or
                            otherwise violating any terms of your employment.
                          </p>{" "}
                          <br />
                        </div>
                        <div>
                          <p className="bold">10)Understanding:</p>
                          <p>
                            This letter contains the entire understanding
                            between the parties and supersedes all previous
                            agreements and/or arrangements relating to
                            engagement with the company.
                          </p>{" "}
                          <br />
                        </div>
                        <div>
                          <p className="bold">11)Company policies:</p>
                          <p>
                            You shall be bound by all policies and procedures of
                            the Company, which may change from time to time. The
                            management of the Company reserves the right to
                            amend and update the policies and procedures of the
                            Company.
                          </p>{" "}
                          <br />
                        </div>
                      </section>
                      <footer
                        className="footer-letter "
                        style={{ pageBreakAfter: "always" }}
                      >
                        <p className="bold">CREATIVEFUEL PRIVATE LIMITED</p>
                        <p className="bold">
                          Registered Office: - 105, Gravity Mall, Vijay Nagar
                          Indore (M.P) 452010, India
                        </p>
                        <p className="bold">
                          Email:
                          <a href="mailto:fahbir@creativefuel.io">
                            fahbir@creativefuel.io
                          </a>
                        </p>
                        <p className="bold">www.creativefuel.io</p>
                      </footer>
                      <div
                        style={{
                          width: "100%",
                          background: "black",
                          height: "2px",
                        }}
                      ></div>
                      <header className="header-letter">
                        <img
                          src={logo}
                          alt="Creativefuel Logo"
                          width={70}
                          height={70}
                        />
                        <div className="brandtext">
                          Creative <span>fuel</span>
                        </div>
                      </header>
                      <div>
                        <div>
                          <p>
                            Get ready to embark on a marketing adventure where
                            every day brings a new challenge, a fresh idea, and
                            a funny meme.
                          </p>

                          <p>
                            We eagerly await your decision and the opportunity
                            to work alongside you in pursuit of excellence and
                            innovation. Your acceptance of this offer would mark
                            the beginning of an exciting chapter with
                            Creativefuel.
                          </p>
                        </div>{" "}
                        <br />
                        <div>
                          <p className="bold">
                            Sincerely, on behalf of Creativefuel Private
                            Limited,
                            <br />
                            Authorized Signatory
                          </p>
                          <br />
                          <img
                            className="signature-img"
                            src="data:image/png;base64,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"
                            width={50}
                            alt="Creativefuel Logo"
                          />
                          <h5 className="bold">
                            Pallavi Tomar
                            <br />
                            (HR Manager)
                          </h5>
                        </div>
                        <div>
                          <p className="bold header-letter">Acceptance</p>
                          <p>
                            I hereby accept the offer along with the terms and
                            conditions of employment with Creativefuel Private
                            Limited as stated hereinafter. I confirm that I am
                            not breaching any terms or provisions of any prior
                            agreement or arrangement by accepting this offer.
                          </p>
                          <br />
                          <br />
                          <p className="bold">
                            {allUserData?.user_name}
                            <br />
                            {allUserData?.permanent_address}
                            <br />
                            {/* Date{" "}
                  {allUserData?.joining_date && (
                    <span>
                      Date{" "}
                      {allUserData.joining_date
                        ? new Date(
                            allUserData.joining_date
                          ).toLocaleDateString()
                        : ""}
                    </span>
                  )} */}
                          </p>
                        </div>
                        {/* <div>
                <h5>Name: - {allUserData?.user_name}</h5>
                <h5>Designation: - {allUserData?.designation_name}</h5>
                <h5>
                  D.O.J: -{" "}
                  {allUserData.joining_date_extend
                    ? new Date(
                        allUserData.joining_date_extend
                      ).toLocaleDateString()
                    : allUserData?.joining_date
                    ? new Date(allUserData.joining_date).toLocaleDateString()
                    : ""}
                </h5>
              </div> */}
                      </div>
                    </article>
                    <footer
                      className="footer-letter "
                      style={{ pageBreakAfter: "always" }}
                    >
                      <p className="bold">CREATIVEFUEL PRIVATE LIMITED</p>
                      <p className="bold">
                        Registered Office: - 105, Gravity Mall, Vijay Nagar
                        Indore (M.P) 452010, India
                      </p>
                      <p className="bold ">
                        Email:
                        <a href="mailto:fahbir@creativefuel.io">
                          fahbir@creativefuel.io
                        </a>
                      </p>
                      <p className="bold">www.creativefuel.io</p>
                    </footer>
                  </div>
                </div>
              </Modal>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LetterTab;
