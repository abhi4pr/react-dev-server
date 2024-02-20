import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";

const InvoiceTemplate5 = ({ data }) => {
  const handleImageError = (e) => {
    console.error("Image failed to load", e);
    e.target.style.display = "none";
  };
  return (
    <div className="invoice_wrap domain-invoice">
      <div className="invoice-container">
        <div className="invoice-content-wrap" id="download_section">
          <header className="domain-header" id="invo_header">
            <div className="invoice-logo-content invoice-logo-content-domain">
              <div className="invoice-logo invoice-logo-domain"></div>
              <div className="domain-img">
                <h1 className="domain-txt">INVOICE</h1>
                <div className="invoice-agency-details">
                  <div className="invo-head-wrap">
                    <div className="color-light-black font-md">Invoice No:</div>
                    <div className="font-md-grey color-grey">
                      {data?.invoiceNo}
                    </div>
                  </div>
                  <div className="invo-head-wrap invoi-date-wrap invoi-date-wrap-agency">
                    <div className="color-light-black font-md">
                      Invoice Date:
                    </div>
                    <div className="font-md-grey color-grey">
                      {data?.Creation_date.split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <section className="bus-booking-content" id="domain_invoice">
            <div className="temp_container">
              <div className="invoice-owner-conte-wrap domain-owner">
                <div className="invo-to-wrap">
                  <div className="invoice-to-content">
                    <p className="font-md color-light-black">Bill To:</p>
                    <h2 className="font-lg domain-color pt-10 ">
                      CREATIVEFUEL PRIVATE LIMITED
                    </h2>
                    <p className="font-md-grey color-grey pt-10">
                      105, Gravity Mall, Vijay Nagar
                      <br />
                      Indore, Madhya Pradesh
                      <br />
                      452010 -India
                      <br />
                      GSTIN 23AAJCC1807B1ZC
                    </p>
                  </div>
                </div>
                <div className="invo-pay-to-wrap">
                  <div className="invoice-pay-content">
                    <p className="font-md color-light-black">Host Info:</p>
                    <h2 className="font-lg domain-color pt-10">
                      {data?.user_name}
                    </h2>
                    <p className="font-md-grey color-grey pt-10">
                      {data?.user_contact_no}
                      <br />
                      {data?.user_email_id}
                      <br />
                      {data?.permanent_address} <br />
                      {data?.permanent_city} <br />
                      {data?.permanent_state}
                    </p>
                  </div>
                </div>
              </div>

              <div className="table-wrapper pt-40">
                <table className="invoice-table domain-table">
                  <thead>
                    <tr className="invo-tb-header">
                      <th className="font-md color-light-black">
                        Item Details
                      </th>
                      <th className="font-md color-light-black">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="invo-tb-body">
                    <tr className="invo-tb-row">
                      <td className="font-sm">{data?.billing_header_name}</td>
                      <td className="font-sm ">₹ {data?.toPay}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="invo-addition-wrap pt-20">
                <div className="invo-add-info-content"></div>
                <div className="invo-bill-total width-30">
                  <table className="invo-total-table">
                    <tbody>
                      <tr className="invo-grand-total">
                        <td className="font-md domain-color pt-20">TDS:</td>
                        <td className="font-18-500 color-light-black pt-20 text-right">
                          - ₹ {data?.tds_deduction}
                        </td>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr className="invo-grand-total">
                        <td className="font-md domain-color pt-20">
                          Grand Total:
                        </td>
                        <td className="font-18-500 color-light-black pt-20 text-right">
                          ₹ {data?.toPay}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="agencyFooterSection footerSection">
                <div className="footerRow row alignFlexEnd">
                  <div className="footerCol col">
                    <div className="signBox">
                      {data?.digital_signature_image_url && (
                        <img
                          src={data?.digital_signature_image_url}
                          alt="signatures"
                          onError={handleImageError}
                        />
                      )}
                    </div>
                  </div>
                  <div className="footerCol col">
                    <div className="termBox">
                      <h2 className="domain-color">Account Details</h2>
                      <p>
                        <span>Beneficiary name :-</span> {data?.user_name}
                      </p>
                      <p>
                        <span>Bank name :-</span> {data?.bank_name}
                      </p>
                      <p>
                        <span>Account no. :-</span> {data?.account_no}
                      </p>
                      <p>
                        <span>IFSC Code :-</span>
                        {data?.ifsc_code}
                      </p>
                      <p>
                        <span>PAN Card No. :-</span>
                        {data?.pan_no}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hospital-contact pt-40 domain-footer-image">
                <div className=""></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate5;
