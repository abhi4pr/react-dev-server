import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/config";
import html2pdf from "html2pdf.js";

const OfferLetter = ({data}) => {
  const [userData, setUserData] = useState([]);

  const getData = () => {
    axios.get(baseUrl+`get_single_user/${data.user_id}`)
      .then((res) => {
        setUserData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
    downloadOfferLetter;
  },[])

  const downloadOfferLetter = () => {
    var element = document.getElementById('element-to-print');
    var opt = {
      margin:       1,
      filename:     `${userData.user_name}_offer_letter.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
     
    html2pdf().from(element).set(opt).save();
  }

  return (
    <>
      <body id="element-to-print">
        <header>
          <img
            src="https://media.licdn.com/dms/image/C4D0BAQF6QHYd1myKyw/company-logo_200_200/0/1630521048751/creative_fuel_io_logo?e=2147483647&v=beta&t=E0hyxWgbSM42fPDcFCT-q7Y9LvSuysj-dLMWcVC1aSw"
            alt="Creativefuel Logo" />
        </header>
        <article>
          <p>Date {userData?.joining_date}
          </p>
          <section>
            <p>
              To,<br />
              {userData?.user_name}<br />
              {userData?.permanent_address}
            </p>
          </section>

          <section>
            <h3>Subject: Offer Letter</h3>

            <p>
              Welcome to the squad! We are all here because someone, somewhere, once
              said, "I think marketing could be fun".
            </p>

            <div>
              <p>Dear {userData?.user_name},</p>
              <p>
                We are thrilled to extend this offer letter to you to join
                Creativefuel, a leading marketing agency that thrives on innovation,
                creativity, and collaboration. After a thorough assessment of your
                skills and qualifications, we are confident that you are the perfect
                fit for our team.
              </p>
            </div>
            <div>
              <h5>Position: {userData?.designation_name}
              </h5>
              <h5>Reports to: {userData?.Report_L1N}
              </h5>
              <h5>Start Date: {userData?.joining_date}
              </h5>
              <h5>Location: Indore</h5>
            </div>
            <div>
              <h4>1)Compensation:</h4>
              <p>
                Your remuneration will have a fixed component of INR {userData?.ctc} Lacs
                  per annum (CTC), paid monthly, and a detailed breakdown of your
                  remuneration can be found in [Annexure-A].
              </p>
            </div>
            <div>
              <h4>2)Acceptance:</h4>
              <p>
                To accept this offer, please sign and return a copy of this letter
                within 48 hours. You can scan and email it to,
                onboarding@creativefuel.io CC: fahbir@creativefuel.io or just reply
                back if I accept the offer. We are excited about the prospect of
                having you onboard and look forward to your positive response.
              </p>
            </div>
            <div>
              <h4>3)Probation Period:</h4>
              <p>
                Both parties agree to a probationary period of three months, during
                which either party may terminate the employment relationship with a
                notice period of 7 days. This period is intended to allow both you
                and Creativefuel to assess the mutual fit and alignment of
                expectations.
              </p>
            </div>
            <div>
              <h4>4)Performance Review:</h4>
              <p>
                At the end of the probation period, your performance will be
                reviewed. If your performance aligns with our expectations and you
                are comfortable with the work environment, the probationary status
                will be lifted.
              </p>
            </div>
            <div>
              <h4>5)Employment Relationship:</h4>
              <div>
                <p>
                  A) Your annual leaves will be as per the
                  company's attendance and leave policy. Uninformed or unapproved
                  absence from work for a continuous period of 5 days or beyond the
                  period of approved leave, without prior approval of the reporting
                  manager shall result in automatic termination of your employment
                  without any further notice unless the Company waives such
                  requirement.
                </p>
                <p>
                  B) The company reserves its legal right
                  to terminate you immediately in case of deviation or nonadherence
                  to company's policies and rules as communicated via this letter
                  and in other physical or digital documents provided to you
                  pursuant to your signing of this letter. The Company may also
                  terminate you with immediate effect for any dishonest and
                  malicious practices, poor attendance, violation of company
                  policies, involvement in criminal act or non- performance for a
                  prolonged period.
                </p>
                <p>
                  C) In case of termination, the company,
                  at its sole discretion, will recover such amount, as the case may
                  be, in lieu of notice period against the full and final settlement
                  upon your separation. In such a case, the company will also not be
                  liable to pay you any pending salary. Furthermore, the Company is
                  at liberty to recover any amount in relation to the performance
                  bonus and sign-on bonus, if any, earned by you, in case your
                  employment relationship gets terminated before completion of one
                  year upon joining.
                </p>
                <p>
                  D) You are required to indemnify and keep
                  indemnifying the Company against all claims, damages, losses etc.,
                  which the Company might suffer, on account of any breach by you of
                  any of the terms of your employment or the terms of any policy of
                  the Company. The Company shall, in addition to any other remedies
                  available by law, be entitled to an injunction restraining you
                  from breaching or otherwise violating any terms of your
                  employment.
                </p>
                <p>
                  You shall be bound by all policies and procedures of the Company,
                  which may change from time to time. The management of the Company
                  reserves the right to amend and update the policies and procedures
                  of the Company.
                </p>
              </div>
            </div>
            <div>
              <h4>6)Reimbursement for Expenses:</h4>
              <p>
                You will be reimbursed for reasonable expenses incurred by you in
                performance of your duties, according to the Company's Expense
                Policy.
              </p>
            </div>
            <div>
              <h4>7)Absence/Leave:</h4>
              <p>
                Your annual leaves will be as per the Company's Attendance and Leave
                Policy. Uninformed or unapproved absence from work for a continuous
                period of 3 days or beyond the period of approved leave, without
                prior approval of the reporting manager shall result in automatic
                termination of your employment without any further notice unless the
                Company waives such requirement.
              </p>
            </div>
            <div>
              <h4>8)Indemnity:</h4>
              <p>
                You are required to indemnify and keep indemnifying the Company
                against all claims, damages, losses etc., which the Company might
                suffer, on account of any breach by you of any of the terms of your
                employment or the terms of any policy of the Company. The Company
                shall, in addition to any other remedies available by law, be
                entitled to an injunction restraining you from breaching or
                otherwise violating any terms of your employment.
              </p>
            </div>
            <div>
              <h4>9)Acknowledgement:</h4>
              <p>
                You are required to indemnify and keep indemnifying the Company
                against all claims, damages, losses etc., which the Company might
                suffer, on account of any breach by you of any of the terms of your
                employment or the terms of any policy of the Company. The Company
                shall, in addition to any other remedies available by law, be
                entitled to an injunction restraining you from breaching or
                otherwise violating any terms of your employment.
              </p>
            </div>
            <div>
              <h4>10)Understanding:</h4>
              <p>
                This letter contains the entire understanding between the parties
                and supersedes all previous agreements and/or arrangements relating
                to engagement with the company.
              </p>
            </div>
            <div>
              <h4>11)Company policies:</h4>
              <p>
                You shall be bound by all policies and procedures of the Company,
                which may change from time to time. The management of the Company
                reserves the right to amend and update the policies and procedures
                of the Company.
              </p>
            </div>
          </section>
          <div>
            <div>
              <p>
                Get ready to embark on a marketing adventure where every day brings
                a new challenge, a fresh idea, and a funny meme.
              </p>

              <p>
                We eagerly await your decision and the opportunity to work alongside
                you in pursuit of excellence and innovation. Your acceptance of this
                offer would mark the beginning of an exciting chapter with
                Creativefuel.
              </p>
            </div>
            <div>
              <h5>
                Sincerely, on behalf of Creativefuel Private Limited,<br />
                Authorized Signatory
              </h5>
              <img
                src="data:image/png;base64,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"
                alt="Creativefuel Logo" />
              <h5>
                Pulkita Phadke<br />
                (Chief People Officer)
              </h5>
            </div>
            <div>
              <h2>Acceptance</h2>
              <p>
                I hereby accept the offer along with the terms and conditions of
                employment with Creativefuel Private Limited as stated hereinafter.
                I confirm that I am not breaching any terms or provisions of any
                prior agreement or arrangement by accepting this offer.
              </p>
              <img
              src=""
              alt="" />
              <p>
                {userData?.user_name}<br />
                  {userData?.permanent_address}<br/>
                  Date {userData?.joining_date}
              </p>
            </div>
            <div>
              <h5>Name: - {userData?.user_name}
              </h5>
              <h5>Designation: - {userData?.designation_name}
              </h5>
              <h5>D.O.J: - {userData?.joining_date}
              </h5>
            </div>
          </div>
        </article>
        <footer>
          <h5>CREATIVEFUEL PRIVATE LIMITED</h5>
          <p>
            Registered Office: - 105, Gravity Mall, Vijay Nagar Indore (M.P) 452010,
            India
          </p>
          <p>
            Email:
            <a href="mailto:fahbir@creativefuel.io">fahbir@creativefuel.io</a>
          </p>
          <p>www.creativefuel.io</p>
        </footer>
      </body>
    </>
  );
};

export default OfferLetter;