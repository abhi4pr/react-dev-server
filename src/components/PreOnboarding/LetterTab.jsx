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
  const [isLoading, setIsLoading] = useState(false);

  const [previewOffer, setpreview] = useState(false);
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const todayDate = `${year}-${month}-${day}`;

  const monthlySalary = allUserData?.ctc / 12;
  const basicMonthSal = monthlySalary * 0.6;
  const hraMonthSal = monthlySalary * 0.6 * 0.4;
  const advanceMonthSal = monthlySalary * 0.6 * 0.2;
  const monthLeaveEnhance = ((monthlySalary * 0.6) / 26) * 3;
  const monthPf =
    monthlySalary < 9000
      ? 0
      : monthlySalary >= 9000 && monthlySalary < 15000
      ? monthlySalary * 0.12
      : 1800;
  const yearCalPf = monthPf * 12;
  const totalMonthearning =
    basicMonthSal + hraMonthSal + advanceMonthSal + monthLeaveEnhance - monthPf;
  const totalMonthearning1 =
    basicMonthSal + hraMonthSal + advanceMonthSal + monthLeaveEnhance + monthPf;
  const totalAnnualearning =
    (basicMonthSal + hraMonthSal + advanceMonthSal + monthLeaveEnhance) * 12;

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
  // const downloadOfferLetter = () => {
  //   console.log(allUserData, "allUserData");
  //   var element = document.getElementById("element-to-print");
  //   var opt = {
  //     margin: 1,
  //     filename: `${allUserData.user_name}_offer_letter.pdf`,
  //     image: { type: "jpeg", quality: 1.0 },
  //     html2canvas: { scale: 4 },
  //     jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  //   };

  //   html2pdf().from(element).set(opt).save();
  // };

  const downloadOfferLetter = () => {
    setIsLoading(true);
    var element = document.getElementById("element-to-print");
    var opt = {
      margin: 1,
      filename: `${allUserData.user_name}_offer_letter.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();

    // --------------------------------------------------------------

    var element = document.getElementById("element-to-print");
    var opt = {
      margin: 1,
      filename: `${allUserData.user_name}_offer_letter.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .get("pdf")
      .then(function (pdf) {
        var pdfData = new FormData();
        pdfData.append(
          "attachment",
          pdf.output("blob"),
          `${allUserData.user_name}_offer_letter.pdf`
        );
        pdfData.append("email_id", allUserData.PersonalEmail);
        pdfData.append("user_id", parseInt(allUserData.user_id));
        setIsLoading(false);
        axios
          .post(baseUrl + "offer_letter_send_in_mail",  pdfData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.error(error);
          })
          .finally(() => {
            setIsLoading(false); // Set loading state to false after the download process completes
          });
      });
  };

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
                <p className="bold">1) Compensation:</p>
                <p className="pl-3">
                  Your remuneration will have a fixed component of INR{" "}
                  {allUserData?.ctc} Anually (CTC), paid monthly, and a detailed
                  breakdown of your remuneration can be found in [Annexure-A].
                </p>
              </div>{" "}
              <br />
              <div>
                <p className="bold">2) Acceptance:</p>
                <p className="pl-3">
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
                <p className="bold">3) Probation Period:</p>
                <p className="pl-3">
                  Both parties agree to a probationary period of three months,
                  during which either party may terminate the employment
                  relationship with a notice period of 7 days. This period is
                  intended to allow both you and Creativefuel to assess the
                  mutual fit and alignment of expectations.
                </p>
              </div>{" "}
              <br />
              <div>
                <p className="bold">4) Performance Review:</p>
                <p className="pl-3">
                  At the end of the probation period, your performance will be
                  reviewed. If your performance aligns with our expectations and
                  you are comfortable with the work environment, the
                  probationary status will be lifted.
                </p>
              </div>{" "}
              <br />
              <div>
                <p className="bold">5) Employment Relationship:</p> <br />
                <div>
                  <div className="flex-row gap-1">
                    <p>A)</p>
                    <p>
                      Your annual leaves will be as per the company's attendance
                      and leave policy. Uninformed or unapproved absence from
                      work for a continuous period of 5 days or beyond the
                      period of approved leave, without prior approval of the
                      reporting manager shall result in automatic termination of
                      your employment without any further notice unless the
                      Company waives such requirement.
                    </p>{" "}
                  </div>
                  <br />
                  <div className="flex-row gap-1">
                    <p>B)</p>
                    <p>
                      The company reserves its legal right to terminate you
                      immediately in case of deviation or nonadherence to
                      company's policies and rules as communicated via this
                      letter and in other physical or digital documents provided
                      to you pursuant to your signing of this letter. The
                      Company may also terminate you with immediate effect for
                      any dishonest and malicious practices, poor attendance,
                      violation of company policies, involvement in criminal act
                      or non- performance for a prolonged period.
                    </p>{" "}
                  </div>
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
                  <div className="flex-row gap-1">
                    <p>C)</p>
                    <p>
                      In case of termination, the company, at its sole
                      discretion, will recover such amount, as the case may be,
                      in lieu of notice period against the full and final
                      settlement upon your separation. In such a case, the
                      company will also not be liable to pay you any pending
                      salary. Furthermore, the Company is at liberty to recover
                      any amount in relation to the performance bonus and
                      sign-on bonus, if any, earned by you, in case your
                      employment relationship gets terminated before completion
                      of one year upon joining.
                    </p>{" "}
                  </div>
                  <br />
                  <div className="flex-row gap-1">
                    <p>D)</p>
                    <p>
                      You are required to indemnify and keep indemnifying the
                      Company against all claims, damages, losses etc., which
                      the Company might suffer, on account of any breach by you
                      of any of the terms of your employment or the terms of any
                      policy of the Company. The Company shall, in addition to
                      any other remedies available by law, be entitled to an
                      injunction restraining you from breaching or otherwise
                      violating any terms of your employment.
                    </p>
                  </div>
                  <p className="pl-3">
                    You shall be bound by all policies and procedures of the
                    Company, which may change from time to time. The management
                    of the Company reserves the right to amend and update the
                    policies and procedures of the Company.
                  </p>{" "}
                  <br />
                </div>
              </div>
              <div>
                <p className="bold">6) Reimbursement for Expenses:</p>
                <p className="pl-3">
                  You will be reimbursed for reasonable expenses incurred by you
                  in performance of your duties, according to the Company's
                  Expense Policy.
                </p>{" "}
                <br />
              </div>
              <div>
                <p className="bold">7) Absence/Leave:</p>
                <p className="pl-3">
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
                <p className="bold">8) Indemnity:</p>
                <p className="pl-3">
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
                <p className="bold">9) Acknowledgement:</p>
                <p className="pl-3">
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
                <p className="bold">10) Understanding:</p>
                <p className="pl-3">
                  This letter contains the entire understanding between the
                  parties and supersedes all previous agreements and/or
                  arrangements relating to engagement with the company.
                </p>{" "}
                <br />
              </div>
              <div>
                <p className="bold">11) Company policies:</p>
                <p className="pl-3">
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
                  src="data:image/png;base64,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3XSiKIjurvb6Sa++KlftcrksWdpLzyEBR0RERERERERcvAQcEREREREREXHxEnBERERERERExMVLwBERERERERERFy8BR0RERERERERcvAQcEREREREREXHxEnBERERERERExMVLwBERERERERERFy8BR0RERERERERcvAQcEREREREREXHxEnBERERERERExMVLwBERERERERERFy8BR0RERERERERcvAQcEREREREREXHxEnBERERERERExMVLwBERERERERERFy8BR0RERERERERcvAQcEREREREREXHxEnBERERERERExMVLwBERERERERERFy8BR0RERERERERcvAQcEREREREREXHxEnBERERERERExMVLwBERERERERERFy8BR0RERERERERcvAQcEREREREREXHxEnBERERERERExMVLwBERERERERERFy8BR0RERERERERcvAQcEREREREREXHxEnBERERERERExMVLwBERERERERERFy8BR0RERERERERcvAQcEREREREREXHxEnBERERERERExMVLwBER8cf4xa++dnfzsGWxX1LTQKCWcRlkahLVonp+rmUsz3+BJZCQBBjUSEdg8vm1f/Ov//Dd/VwRERERERdq8X2/gYiIC6Y312+ebz7+u64vQcbpdp+O39x/+5yIiIiIiPgWCTgiIv5vzoFGfeN8W+jxbSEIvAYY05vTpytvrhERERER8Tsk4IiI+OO9DSsKGMx/V+vN137f9VzBcQ44jqdzOF3fPhYREREREb9HZnBERPyBtj/7a9Xyo9CipBLyABdQo1mOZiFrKbxAHlIX8ihcsofwEC7UA7nAgmpLE/OEjr1hD+xt9kZ7Mw5Hb/aW3dW9W++8W+/OoYf5l3/6/j6QiIiIiIgfkFRwRET84cS5SsOMai3kWghGuVeF10WvRC+Fl6IXwgupF6Ueohdovs98u7AOpg6gg6lnW8+mnpp6NtpN6Pn0PY/MrSpHXudyfHOGR0RERETEu5WAIyLiD3NuLVkAS2Ap63RYCm2k3ghvhNelXs0hh1eil6VeSr0QvULTUvRyrgDRztR83I9mPDQ8CD0aHmXG6fvuT+ft0NGEGxERERERJwk4IiL45cut5aePLD9cS4shVTGOD6reSz2pa7uwtQavOFVrFKwl1kVvSr0VvZW8Fl5JPoccS/DidJaC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"
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
                  width={60}
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
          <header className="header-letter">
            <img src={logo} alt="Creativefuel Logo" width={70} height={70} />
            <div className="brandtext">
              Creative <span>fuel</span>
            </div>
          </header>
          <br />
          <div className="w-100 header-letter">
            <p className="bold underlined ">Annexure B</p>
            <p className="bold underlined ">Creativefuel Private Limited</p>
          </div>
          <div>
            {/* <p>Basic Salary - {(monthlySalary) * (0.60)}</p>
                    <p>HRA - {(((monthlySalary) * (0.60)) * 0.40)}</p>
                    <p>Advance Bonus - {(((monthlySalary) * (0.60)) / 20)}</p>
                    <p>Monthly Leave Enhancement - {(((monthlySalary * 0.60) / 26) * 3).toFixed(2)}</p>
                    <p>PF - {monthlySalary <= 12000 ? 0 : 1800}</p>
                    <p>PT - {(monthlySalary >= 18500 && monthlySalary <= 25000) ? 125 :
                      (monthlySalary >= 25001 && monthlySalary <= 34999) ? 167 :
                        (monthlySalary >= 35000) ? 208 : 0
                    }
                    </p>
                    <p>ESIC - {monthlySalary <= 21000 ? monthlySalary * (0.0075) : 0}</p> */}
            <p>Employee Name: {allUserData.user_name}</p>
            <p>Designation: {allUserData.designation_name}</p>
            <p>
              D.O.J : {new Date(allUserData.joining_date).toLocaleDateString()}
            </p>
          </div>
          <br />
          <div className="ol-table">
            <p className="underlined bold">
              Renumeration Structure & Break-up{" "}
            </p>
            <br />
            <table>
              <thead>
                <tr>
                  <th>EARNINGS</th>
                  <th>MONTHLY</th>
                  <th>ANNUALY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary</td>
                  <td>INR {(monthlySalary * 0.6).toFixed(0)}</td>
                  <td>INR {(monthlySalary * 0.6 * 12).toFixed(0)}</td>
                </tr>
                <tr>
                  <td>HRA</td>
                  <td>INR {(monthlySalary * 0.6 * 0.4).toFixed(0)}</td>
                  <td>INR {(monthlySalary * 0.6 * 0.4 * 12).toFixed(0)}</td>
                </tr>
                <tr>
                  <td>Advance Bonus</td>
                  <td>INR {(monthlySalary * 0.6 * 0.2).toFixed(0)}</td>
                  <td>INR {(monthlySalary * 0.6 * 0.2 * 12).toFixed(0)}</td>
                </tr>
                <tr>
                  <td>Monthly Leave Enhancement</td>
                  <td>INR {monthLeaveEnhance.toFixed(0)}</td>
                  <td>INR {(monthLeaveEnhance * 12).toFixed(0)}</td>
                </tr>
                <tr>
                  <td>Total Earning</td>
                  <td>
                    INR{" "}
                    {(
                      basicMonthSal +
                      hraMonthSal +
                      advanceMonthSal +
                      monthLeaveEnhance
                    ).toFixed(0)}
                  </td>
                  <td>INR {totalAnnualearning.toFixed(0)}</td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>DEDUCTIONS</th>
                  <th>MONTHLY</th>
                  <th>ANNUALY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PF Employee</td>
                  <td>INR {monthPf}</td>
                  <td>INR {monthPf * 12}</td>
                </tr>
                {/* <tr>
                          <td>PT</td>
                          <td>
                            {monthlySalary >= 18500 && monthlySalary <= 25000
                              ? 125
                              : monthlySalary >= 25001 && monthlySalary <= 34999
                              ? 167
                              : monthlySalary >= 35000
                              ? 208
                              : 0}
                          </td>
                          <td>
                            {monthlySalary >= 18500 && monthlySalary <= 25000
                              ? 125 * 12
                              : monthlySalary >= 25001 && monthlySalary <= 34999
                              ? 167 * 12
                              : monthlySalary >= 35000
                              ? 208 * 12
                              : 0}
                          </td>
                        </tr> */}

                <tr>
                  <td>Net Pay Before Tax</td>
                  <td>
                    INR {totalMonthearning.toFixed(0)}
                    {/* {(monthlySalary <= 12000 ? 0 : 1800) +
                              (monthlySalary >= 18500 && monthlySalary <= 25000
                                ? 125
                                : monthlySalary >= 25001 &&
                                  monthlySalary <= 34999
                                ? 167
                                : monthlySalary >= 35000
                                ? 208
                                : 0) +
                              (monthlySalary <= 21000
                                ? monthlySalary * 0.0075
                                : 0)} */}
                  </td>
                  <td>
                    INR {(totalAnnualearning - yearCalPf).toFixed(0)}
                    {/* {((monthlySalary <= 12000 ? 0 : 1800) +
                              (monthlySalary >= 18500 && monthlySalary <= 25000
                                ? 125
                                : monthlySalary >= 25001 &&
                                  monthlySalary <= 34999
                                ? 167
                                : monthlySalary >= 35000
                                ? 208
                                : 0) +
                              (monthlySalary <= 21000
                                ? monthlySalary * 0.0075
                                : 0)) *
                              12} */}
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>Contribution</th>
                  <th>MONTHLY</th>
                  <th>ANNUALY</th>
                </tr>
              </thead>
              <tbody>
                {/* {monthlySalary <= 21000 && ( */}
                <tr>
                  <td>ESIC</td>
                  <td>
                    INR
                    {(monthlySalary <= 21000
                      ? monthlySalary * 0.0075
                      : 0
                    ).toFixed(0)}
                  </td>
                  <td>
                    INR{" "}
                    {(
                      (monthlySalary <= 21000 ? monthlySalary * 0.0075 : 0) * 12
                    ).toFixed(0)}
                  </td>
                </tr>
                {/* )} */}
                <tr>
                  <td>PF Employer</td>
                  <td>INR {monthPf}</td>
                  <td>INR {monthPf * 12}</td>
                </tr>
                <tr>
                  <td>Total CTC</td>
                  <td>INR {totalMonthearning1.toFixed(0)}</td>
                  <td>INR {(totalAnnualearning + yearCalPf).toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <br style={{ pageBreakAfter: "always" }} />
          <header className="header-letter">
            <img src={logo} alt="Creativefuel Logo" width={70} height={70} />
            <div className="brandtext">
              Creative <span>fuel</span>
            </div>
          </header>
          <p>
            I, {allUserData.user_name} acknowledge that i have recived, read
            through and understand the contents of this letter and agree to the
            contents here in.
          </p>
          <br />
          <img
            className="signature-img"
            src={`data:image/png;base64,${image64}`}
            alt=""
          />
          <p>Signature: _________________</p>
          <footer className="footer-letter ">
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
          <div className="cardBodyBoard">
            <div className="letterBoard">
              <div className="thm_textbx">
                {allUserData.offer_later_status ? (
                  <p>
                    <span className="bold">
                      {" "}
                      Congratulations on accepting the offer letter and becoming
                      a part of Creativefuel team! Your offer letter has been
                      sent to your email address
                    </span>{" "}
                    <br />
                  </p>
                ) : (
                  <p>
                    Hello, <span className="bold">{allUserData.user_name}</span>
                    , Welcome to Creativefuel - The home to the most vibrant &
                    talented individuals! <br /> <br /> We're to have you join
                    our team of Meme Enthusiasts & Coffee Addicts as a{" "}
                    <span className="bold">
                      {allUserData.designation_name}{" "}
                    </span>
                    {/* ! We believe that your experience & skills will be a great
                    asset to our organisation. <br /> <br /> Congratulations on
                    your new role, and cheers to a journey full of excitement,
                    growth & achievement! */}
                  </p>
                )}
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
                    className="btn onboardBtn btn_primary d-flex align-items-center gap-2"
                    disabled={isLoading}
                  >
                    <i class="bi bi-cloud-arrow-down"></i>
                    {isLoading ? " Downloading..." : "Download"}
                    {/* Download */}
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
                // className="hello"
                isOpen={previewOffer}
                onRequestClose={() => setpreview(false)}
                contentLabel="offerletter Modal"
                //sty appElement={}'
                style={{
                  content: {
                    maxWidth: "750px",
                    width: "80%",
                    margin: "auto",
                    inset: "15px",
                  },
                }}
              >
                <div className="pack sb">
                  <div></div>
                  <button
                    className="btn cmnbtn btn_sm btn-danger previewClose mt-1"
                    onClick={handelClose}
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
                <div style={{ width: "100%", padding: "5px" }}>
                  <div id="element-to-print" style={{ color: "black" }}>
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
                          <p className="bold">1) Compensation:</p>
                          <p className="pl-3">
                            Your remuneration will have a fixed component of INR{" "}
                            {allUserData?.ctc} Annually (CTC), paid monthly, and
                            a detailed breakdown of your remuneration can be
                            found in [Annexure-A].
                          </p>
                        </div>{" "}
                        <br />
                        <div>
                          <p className="bold">2) Acceptance:</p>
                          <p className="pl-3">
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
                          <p className="bold">3) Probation Period:</p>
                          <p className="pl-3">
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
                          <p className="bold">4) Performance Review:</p>
                          <p className="pl-3">
                            At the end of the probation period, your performance
                            will be reviewed. If your performance aligns with
                            our expectations and you are comfortable with the
                            work environment, the probationary status will be
                            lifted.
                          </p>
                        </div>{" "}
                        <br />
                        <div>
                          <p className="bold">5) Employment Relationship:</p>{" "}
                          <br />
                          <div>
                            <div className="flex-row gap-1">
                              <p>A)</p>
                              <p>
                                Your annual leaves will be as per the company's
                                attendance and leave policy. Uninformed or
                                unapproved absence from work for a continuous
                                period of 5 days or beyond the period of
                                approved leave, without prior approval of the
                                reporting manager shall result in automatic
                                termination of your employment without any
                                further notice unless the Company waives such
                                requirement.
                              </p>{" "}
                            </div>
                            <br />
                            <div className="flex-row gap-1">
                              <p>B)</p>
                              <p>
                                The company reserves its legal right to
                                terminate you immediately in case of deviation
                                or nonadherence to company's policies and rules
                                as communicated via this letter and in other
                                physical or digital documents provided to you
                                pursuant to your signing of this letter. The
                                Company may also terminate you with immediate
                                effect for any dishonest and malicious
                                practices, poor attendance, violation of company
                                policies, involvement in criminal act or non-
                                performance for a prolonged period.
                              </p>{" "}
                            </div>
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
                            <div className="flex-row gap-1">
                              <p>C)</p>
                              <p>
                                In case of termination, the company, at its sole
                                discretion, will recover such amount, as the
                                case may be, in lieu of notice period against
                                the full and final settlement upon your
                                separation. In such a case, the company will
                                also not be liable to pay you any pending
                                salary. Furthermore, the Company is at liberty
                                to recover any amount in relation to the
                                performance bonus and sign-on bonus, if any,
                                earned by you, in case your employment
                                relationship gets terminated before completion
                                of one year upon joining.
                              </p>{" "}
                            </div>
                            <br />
                            <div className="flex-row gap-1">
                              <p>D)</p>
                              <p>
                                You are required to indemnify and keep
                                indemnifying the Company against all claims,
                                damages, losses etc., which the Company might
                                suffer, on account of any breach by you of any
                                of the terms of your employment or the terms of
                                any policy of the Company. The Company shall, in
                                addition to any other remedies available by law,
                                be entitled to an injunction restraining you
                                from breaching or otherwise violating any terms
                                of your employment.
                              </p>
                            </div>
                            <p className="pl-3">
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
                          <p className="bold">6) Reimbursement for Expenses:</p>
                          <p className="pl-3">
                            You will be reimbursed for reasonable expenses
                            incurred by you in performance of your duties,
                            according to the Company's Expense Policy.
                          </p>{" "}
                          <br />
                        </div>
                        <div>
                          <p className="bold">7) Absence/Leave:</p>
                          <p className="pl-3">
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
                          <p className="bold">8) Indemnity:</p>
                          <p className="pl-3">
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
                          <p className="bold">9) Acknowledgement:</p>
                          <p className="pl-3">
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
                          <p className="bold">10) Understanding:</p>
                          <p className="pl-3">
                            This letter contains the entire understanding
                            between the parties and supersedes all previous
                            agreements and/or arrangements relating to
                            engagement with the company.
                          </p>{" "}
                          <br />
                        </div>
                        <div>
                          <p className="bold">11) Company policies:</p>
                          <p className="pl-3">
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
                    <br />
                    <div className="w-100 header-letter">
                      <p className="bold underlined ">Annexure B</p>
                      <p className="bold underlined ">
                        Creativefuel Private Limited
                      </p>
                    </div>
                  </div>
                  <div>
                    <p>Employee Name: {allUserData.user_name}</p>
                    <p>Designation: {allUserData.designation_name}</p>
                    <p>
                      D.O.J :{" "}
                      {new Date(allUserData.joining_date).toLocaleDateString()}
                    </p>
                  </div>
                  <br />
                  <div className="ol-table">
                    <p className="underlined bold">
                      Renumeration Structure & Break-up{" "}
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th>EARNINGS</th>
                          <th>MONTHLY</th>
                          <th>ANNUALY</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Basic Salary</td>
                          <td>INR {(monthlySalary * 0.6).toFixed(0)}</td>
                          <td>INR {(monthlySalary * 0.6 * 12).toFixed(0)}</td>
                        </tr>
                        <tr>
                          <td>HRA</td>
                          <td>INR {(monthlySalary * 0.6 * 0.4).toFixed(0)}</td>
                          <td>
                            INR {(monthlySalary * 0.6 * 0.4 * 12).toFixed(0)}
                          </td>
                        </tr>
                        <tr>
                          <td>Advance Bonus</td>
                          <td>INR {(monthlySalary * 0.6 * 0.2).toFixed(0)}</td>
                          <td>
                            INR {(monthlySalary * 0.6 * 0.2 * 12).toFixed(0)}
                          </td>
                        </tr>
                        <tr>
                          <td>Monthly Leave Enhancement</td>
                          <td>INR {monthLeaveEnhance.toFixed(0)}</td>
                          <td>INR {(monthLeaveEnhance * 12).toFixed(0)}</td>
                        </tr>
                        <tr>
                          <td>Total Earning</td>
                          <td>
                            INR{" "}
                            {(
                              basicMonthSal +
                              hraMonthSal +
                              advanceMonthSal +
                              monthLeaveEnhance
                            ).toFixed(0)}
                          </td>
                          <td>INR {totalAnnualearning.toFixed(0)}</td>
                        </tr>
                      </tbody>
                      <thead>
                        <tr>
                          <th>DEDUCTIONS</th>
                          <th>MONTHLY</th>
                          <th>ANNUALY</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>PF Employee</td>
                          <td>INR {monthPf}</td>
                          <td>INR {monthPf * 12}</td>
                        </tr>
                        {/* <tr>
                          <td>PT</td>
                          <td>
                            {monthlySalary >= 18500 && monthlySalary <= 25000
                              ? 125
                              : monthlySalary >= 25001 && monthlySalary <= 34999
                              ? 167
                              : monthlySalary >= 35000
                              ? 208
                              : 0}
                          </td>
                          <td>
                            {monthlySalary >= 18500 && monthlySalary <= 25000
                              ? 125 * 12
                              : monthlySalary >= 25001 && monthlySalary <= 34999
                              ? 167 * 12
                              : monthlySalary >= 35000
                              ? 208 * 12
                              : 0}
                          </td>
                        </tr> */}

                        <tr>
                          <td>Net Pay Before Tax</td>
                          <td>
                            INR {totalMonthearning.toFixed(0)}
                            {/* {(monthlySalary <= 12000 ? 0 : 1800) +
                              (monthlySalary >= 18500 && monthlySalary <= 25000
                                ? 125
                                : monthlySalary >= 25001 &&
                                  monthlySalary <= 34999
                                ? 167
                                : monthlySalary >= 35000
                                ? 208
                                : 0) +
                              (monthlySalary <= 21000
                                ? monthlySalary * 0.0075
                                : 0)} */}
                          </td>
                          <td>
                            INR {(totalAnnualearning - yearCalPf).toFixed(0)}
                            {/* {((monthlySalary <= 12000 ? 0 : 1800) +
                              (monthlySalary >= 18500 && monthlySalary <= 25000
                                ? 125
                                : monthlySalary >= 25001 &&
                                  monthlySalary <= 34999
                                ? 167
                                : monthlySalary >= 35000
                                ? 208
                                : 0) +
                              (monthlySalary <= 21000
                                ? monthlySalary * 0.0075
                                : 0)) *
                              12} */}
                          </td>
                        </tr>
                      </tbody>
                      <thead>
                        <tr>
                          <th>Contribution</th>
                          <th>MONTHLY</th>
                          <th>ANNUALY</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlySalary <= 21000 && (
                          <tr>
                            <td>ESIC</td>
                            <td>
                              INR
                              {(monthlySalary <= 21000
                                ? monthlySalary * 0.0075
                                : 0
                              ).toFixed(0)}
                            </td>
                            <td>
                              INR{" "}
                              {(
                                (monthlySalary <= 21000
                                  ? monthlySalary * 0.0075
                                  : 0) * 12
                              ).toFixed(0)}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td>PF Employer</td>
                          <td>INR {monthPf}</td>
                          <td>INR {monthPf * 12}</td>
                        </tr>
                        <tr>
                          <td>Total CTC</td>
                          <td>INR {totalMonthearning1.toFixed(0)}</td>
                          <td>
                            INR {(totalAnnualearning + yearCalPf).toFixed(0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <br />
                  <p>
                    I, {allUserData.user_name} acknowledge that i have recived,
                    read through and understand the contents of this letter and
                    agree to the contents here in.
                  </p>
                  <br />
                  <p>Signature: _________________</p>
                  <footer
                    className="footer-letter "
                    style={{ pageBreakAfter: "always" }}
                  >
                    <p className="bold">CREATIVEFUEL PRIVATE LIMITED</p>
                    <p className="bold">
                      Registered Office: - 105, Gravity Mall, Vijay Nagar Indore
                      (M.P) 452010, India
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
              </Modal>
              <Modal
                className="signModal"
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
