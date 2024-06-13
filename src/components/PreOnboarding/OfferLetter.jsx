import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

import logo from "/logo.png";

const OfferLetter = () => {
  const signatureImg =
    "data:image/png;base64,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";
  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header} fixed>
          <Image src={logo} style={styles.logoImage} />
          <Text style={styles.logoText}>
            <Text style={styles.bold}>Creative</Text>fuel
          </Text>
        </View>
        <View style={styles.subjectSection}>
          <Text style={styles.text}>Subject: Offer Letter</Text>
          <Text style={styles.text}>
            Date {new Date().toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.section}>
          <Text>To,</Text>
          <Text>Anmol</Text>
        </View>
        <View style={styles.section}>
          <Text>
            Welcome to the 2squad! We are all here because someone, somewhere,
            once said, “I think marketing could be fun.”
          </Text>
          <View style={styles.section}>
            <Text>Dear New Anmol,</Text>
          </View>
          <View style={styles.section}>
            <Text>
              We are pleased to extend this offer letter to you to join
              Creativefuel, a leading marketing agency that thrives on
              innovation, creativity, and collaboration. After a thorough
              assessment of your skills and qualifications, we are confident
              that you are the perfect fit for our team.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>Position:</Text>
            <Text>Reports to: Delivery Boy</Text>
            <Text>Joining Date: 03-06-2024</Text>
            <Text>Location: Indore</Text>
          </View>
          <View style={styles.section}>
            <Text>1) Compensation:</Text>
            <Text>
              Your remuneration will have a fixed component of INR 300000
              Annually (CTC), paid monthly, and a detailed breakdown of your
              remuneration can be found in [Annexure-A].
            </Text>
          </View>
          <View style={styles.section}>
            <Text>2) Acceptance:</Text>
            <Text>
              To accept this offer, please sign and return a copy of this letter
              within 48 hours. You can scan and email it to,
              onboarding@creativefuel.io CC: fahbir@creativefuel.io or just
              reply back if I accept the offer. We are excited about the
              prospect of having you onboard and look forward to your positive
              response.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>3) Probation Period:</Text>
            <Text>
              Both parties agree to a probationary period of three months,
              during which either party may terminate the employment
              relationship with a notice period of 7 days. This period is
              intended to allow both you and Creativefuel to assess the mutual
              fit and alignment of expectations.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>4) Performance Review:</Text>
            <Text>
              At the end of the probation period, your performance will be
              reviewed. If your performance aligns with our expectations and you
              are comfortable with the work environment, the probationary status
              will be lifted.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>5) Employment Relationship:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              A) Your annual leaves will be as per the company's attendance and
              leave policy. Uninformed or unapproved absence from work for a
              continuous period of 5 days or beyond the period of approved
              leave, without prior approval of the reporting manager shall
              result in automatic termination of your employment without any
              further notice unless the Company waives such requirement.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              B) The company reserves its legal right to terminate you
              immediately in case of deviation or nonadherence to company's
              policies and rules as communicated via this letter and in other
              physical or digital documents provided to you pursuant to your
              signing of this letter. The Company may also terminate you with
              immediate effect for any dishonest and malicious practices, poor
              attendance, violation of company policies, involvement in criminal
              act or non- performance for a prolonged period.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              C) In case of termination, the company, at its sole discretion,
              will recover such amount, as the case may be, in lieu of notice
              period against the full and final settlement upon your separation.
              In such a case, the company will also not be liable to pay you any
              pending salary. Furthermore, the Company is at liberty to recover
              any amount in relation to the performance bonus and sign-on bonus,
              if any, earned by you, in case your employment relationship gets
              terminated before completion of one year upon joining.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              D) You are required to indemnify and keep indemnifying the Company
              against all claims, damages, losses etc., which the Company might
              suffer, on account of any breach by you of any of the terms of
              your employment or the terms of any policy of the Company. The
              Company shall, in addition to any other remedies available by law,
              be entitled to an injunction restraining you from breaching or
              otherwise violating any terms of your employment.
            </Text>
            <Text>
              You shall be bound by all policies and procedures of the Company,
              which may change from time to time. The management of the Company
              reserves the right to amend and update the policies and procedures
              of the Company.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>6) Reimbursement for Expenses:</Text>
            <Text>
              You will be reimbursed for reasonable expenses incurred by you in
              performance of your duties, according to the Company's Expense
              Policy.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>7) Absence/Leave:</Text>
            <Text>
              Your annual leaves will be as per the Company's Attendance and
              Leave Policy. Uninformed or unapproved absence from work for a
              continuous period of 3 days or beyond the period of approved
              leave, without prior approval of the reporting manager shall
              result in automatic termination of your employment without any
              further notice unless the Company waives such requirement.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>8) Indemnity:</Text>
            <Text>
              You are required to indemnify and keep indemnifying the Company
              against all claims, damages, losses etc., which the Company might
              suffer, on account of any breach by you of any of the terms of
              your employment or the terms of any policy of the Company. The
              Company shall, in addition to any other remedies available by law,
              be entitled to an injunction restraining you from breaching or
              otherwise violating any terms of your employment.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>9) Acknowledgement:</Text>
            <Text>
              You are required to indemnify and keep indemnifying the Company
              against all claims, damages, losses etc., which the Company might
              suffer, on account of any breach by you of any of the terms of
              your employment or the terms of any policy of the Company. The
              Company shall, in addition to any other remedies available by law,
              be entitled to an injunction restraining you from breaching or
              otherwise violating any terms of your employment.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>10) Understanding:</Text>
            <Text>
              This letter contains the entire understanding between the parties
              and supersedes all previous agreements and/or arrangements
              relating to engagement with the company.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>11) Company policies:</Text>
            <Text>
              You shall be bound by all policies and procedures of the Company,
              which may change from time to time. The management of the Company
              reserves the right to amend and update the policies and procedures
              of the Company.
            </Text>
            <Text>
              Get ready to embark on a marketing adventure where every day
              brings a new challenge, a fresh idea, and a funny meme.
            </Text>
            <Text>
              We eagerly await your decision and the opportunity to work
              alongside you in pursuit of excellence and innovation. Your
              acceptance of this offer would mark the beginning of an exciting
              chapter with Creativefuel.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>Sincerely, on behalf of Creativefuel Private Limited,</Text>
            <Text>Authorized Signatory</Text>
            <Image
              style={styles.signatureImage}
              src={signatureImg}
              alt="Signature"
            />
            <Text>Pallavi Tomar</Text>
            <Text style={styles.bold}>(HR Manager)</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Acceptance</Text>
            <Text>
              I hereby accept the offer along with the terms and conditions of
              employment with Creativefuel Private Limited as stated
              hereinafter. I confirm that I am not breaching any terms or
              provisions of any prior agreement or arrangement by accepting this
              offer.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Annexure B</Text>
            <Text style={styles.heading}>Creativefuel Private Limited</Text>
            <Text>Employee Name: New Anmol</Text>
            <Text>Designation:</Text>
            <Text>D.O.J : 03-06-2024</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>
              Renumeration Structure & Break-up
            </Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeadRow}>
                <View style={styles.tableHeadCol}>
                  <Text style={styles.tableHeadCell}>EARNINGS</Text>
                </View>
                <View style={styles.tableHeadColSmall}>
                  <Text style={styles.tableHeadCellSmall}>MONTHLY</Text>
                </View>
                <View style={styles.tableHeadColSmall}>
                  <Text style={styles.tableHeadCellSmall}>ANNUALY</Text>
                </View>
              </View>
              {/* Table Content */}
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>Basic Salary</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 180000</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 2160000</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>HRA</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 54000</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 648000</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>Advance Bonus</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 36000</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 432000</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>
                    Monthly Leave Encashment
                  </Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 20769</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 249228</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>Special Allowance</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 9231</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 110772</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>Total Earning</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 300000</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 3600000</Text>
                </View>
              </View>
              {/* Table Header */}
              <View style={styles.tableHeadRow}>
                <View style={styles.tableHeadCol}>
                  <Text style={styles.tableHeadCell}>DEDUCTIONS</Text>
                </View>
                <View style={styles.tableHeadColSmall}>
                  <Text style={styles.tableHeadCellSmall}>MONTHLY</Text>
                </View>
                <View style={styles.tableHeadColSmall}>
                  <Text style={styles.tableHeadCellSmall}>ANNUALY</Text>
                </View>
              </View>
              {/* Table Content */}
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>PF Employee</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 1800</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 21600</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>Net Pay Before Tax</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 298200</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 3578400</Text>
                </View>
              </View>
              {/* Table Header */}
              <View style={styles.tableHeadRow}>
                <View style={styles.tableHeadCol}>
                  <Text style={styles.tableHeadCell}>Contribution</Text>
                </View>
                <View style={styles.tableHeadColSmall}>
                  <Text style={styles.tableHeadCellSmall}>MONTHLY</Text>
                </View>
                <View style={styles.tableHeadColSmall}>
                  <Text style={styles.tableHeadCellSmall}>ANNUALY</Text>
                </View>
              </View>
              {/* Table Content */}
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>PF Employer</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 1800</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 21600</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>Total CTC</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 301800</Text>
                </View>
                <View style={styles.tableColSmall}>
                  <Text style={styles.tableBodyCellSmall}>INR 3621600</Text>
                </View>
              </View>
            </View>
            <Text>
              I, New Anmol acknowledge that i have received, read through and
              understand the contents of this letter and agree to the contents
              here in.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>Signature:</Text>
            <Image
              style={styles.signatureImage}
              src={signatureImg}
              alt="Signature"
            />
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.bold}>CREATIVEFUEL PRIVATE LIMITED</Text>
          <Text style={styles.bold}>
            Registered Office: - 105, Gravity Mall, Vijay Nagar Indore (M.P)
            452010, India
          </Text>
          <Text style={styles.bold}>
            Email: <Text>fahbir@creativefuel.io</Text>
          </Text>
          <Text style={styles.bold}>www.creativefuel.io</Text>
        </View>
      </Page>
    </Document>
  );
};

//Create styles
const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "black",
    marginBottom: 10,
  },
  tableHeadRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableHeadCol: {
    width: "52%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "black",
  },
  tableHeadColSmall: {
    width: "24%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "black",
  },
  tableHeadCell: {
    padding: 6,
    fontSize: 12,
    textAlign: "left",
    backgroundColor: "black",
    color: "white",
  },
  tableHeadCellSmall: {
    padding: 6,
    fontSize: 12,
    textAlign: "center",
    backgroundColor: "black",
    color: "white",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "52%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "black",
  },
  tableColSmall: {
    width: "24%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "black",
  },
  tableBodyCell: {
    padding: 6,
    fontSize: 11,
    textAlign: "left",
  },
  tableBodyCellSmall: {
    padding: 6,
    fontSize: 11,
    textAlign: "center",
  },

  body: {
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingBottom: 20,
  },
  logoImage: {
    width: "50px",
    height: "50px",
    objectFit: "contain",
  },
  logoText: {
    fontSize: 15,
    textAlign: "center",
    color: "black",
  },
  subjectSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  text: {
    fontSize: 11,
    color: "black",
  },
  section: {
    paddingBottom: 12,
    fontSize: 11,
    color: "black",
  },
  signatureImage: {
    width: "100px",
    height: "70px",
    objectFit: "contain",
  },
  heading: {
    paddingBottom: 6,
    textAlign: "center",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    padding: 10,
    fontSize: 10,
  },
});

export default OfferLetter;
{
  /* <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Date {new Date().toLocaleDateString()}</Text>
            <View>
              <Text style={styles.bold}>To,</Text>
              <Text>input data</Text>
              <Text>input data</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.bold, styles.header]}>
              Subject: Offer Letter
            </Text>
            <Text>
              Welcome to the 2squad! We are all here because someone, somewhere,
              once said, “I think marketing could be fun.”
            </Text>
            <View>
              <Text style={styles.bold}>Dear input data,</Text>
              <Text>
                We are pleased to extend this offer letter to you to join
                Creativefuel, a leading marketing agency that thrives on
                innovation, creativity, and collaboration. After a thorough
                assessment of your skills and qualifications, we are confident
                that you are the perfect fit for our team.
              </Text>
            </View>
            <View>
              <Text style={styles.bold}>Position: input data</Text>
              <Text style={styles.bold}>Reports to:input data</Text>
              <Text style={styles.bold}>Joining Date: input data</Text>
              <Text style={styles.bold}>Location: Indore</Text>
            </View>
            <View>
              <Text style={styles.bold}>1) Compensation:</Text>
              <Text>
                Your remuneration will have a fixed component of INR input data
                Annually (CTC), paid monthly, and a detailed breakdown of your
                remuneration can be found in [Annexure-A].
              </Text>
            </View>
            <View>
              <Text style={styles.bold}>2) Acceptance:</Text>
              <Text>
                To accept this offer, please sign and return a copy of this
                letter within 48 hours. You can scan and email it to,
                onboarding@creativefuel.io CC: fahbir@creativefuel.io or just
                reply back if I accept the offer. We are excited about the
                prospect of having you onboard and look forward to your positive
                response.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.bold}>3) Probation Period:</Text>
            <Text>
              Both parties agree to a probationary period of three months,
              during which either party may terminate the employment
              relationship with a notice period of 7 days. This period is
              intended to allow both you and Creativefuel to assess the mutual
              fit and alignment of expectations.
            </Text>
            <Text style={styles.bold}>4) Performance Review:</Text>
            <Text>
              At the end of the probation period, your performance will be
              reviewed. If your performance aligns with our expectations and you
              are comfortable with the work environment, the probationary status
              will be lifted.
            </Text>
            <Text style={styles.bold}>5) Employment Relationship:</Text>
            <View>
              <View style={styles.section}>
                <Text style={styles.bold}>A)</Text>
                <Text>
                  Your annual leaves will be as per the company's attendance and
                  leave policy. Uninformed or unapproved absence from work for a
                  continuous period of 5 days or beyond the period of approved
                  leave, without prior approval of the reporting manager shall
                  result in automatic termination of your employment without any
                  further notice unless the Company waives such requirement.
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.bold}>B)</Text>
                <Text>
                  The company reserves its legal right to terminate you
                  immediately in case of deviation or nonadherence to company's
                  policies and rules as communicated via this letter and in
                  other physical or digital documents provided to you pursuant
                  to your signing of this letter. The Company may also terminate
                  you with immediate effect for any dishonest and malicious
                  practices, poor attendance, violation of company policies,
                  involvement in criminal act or non- performance for a
                  prolonged period.
                </Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.bold}>CREATIVEFUEL PRIVATE LIMITED</Text>
                <Text style={styles.bold}>
                  Registered Office: - 105, Gravity Mall, Vijay Nagar Indore
                  (M.P) 452010, India
                </Text>
                <Text style={styles.bold}>
                  Email:{" "}
                  <Text>
                    <a href="mailto:fahbir@creativefuel.io">
                      fahbir@creativefuel.io
                    </a>
                  </Text>
                </Text>
                <Text style={styles.bold}>www.creativefuel.io</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.bold}>6) Reimbursement for Expenses:</Text>
            <Text>
              You will be reimbursed for reasonable expenses incurred by you in
              performance of your duties, according to the Company's Expense
              Policy.
            </Text>
            <Text style={styles.bold}>7) Absence/Leave:</Text>
            <Text>
              Your annual leaves will be as per the Company's Attendance and
              Leave Policy. Uninformed or unapproved absence from work for a
              continuous period of 3 days or beyond the period of approved
              leave, without prior approval of the reporting manager shall
              result in automatic termination of your employment without any
              further notice unless the Company waives such requirement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.bold}>8) Non-Disclosure Agreement (NDA):</Text>
            <Text>
              As a condition of employment with Creativefuel, you will be
              required to sign the company's standard NDA, a copy of which is
              attached hereto as [Annexure B] and incorporated into this letter
              by reference.
            </Text>
            <Text style={styles.bold}>9) Data Protection:</Text>
            <Text>
              By signing this offer letter, you agree to the terms of our
              Privacy Policy, which is available on our website. You consent to
              the collection, use, and processing of your personal data in
              accordance with our Privacy Policy.
            </Text>
            <View style={styles.signature}>
              <Text>For Creativefuel Pvt. Ltd.</Text>
              <Image src={logo} style={styles.signatureImg} />
            </View>
          </View>
        </Page> */
}
