import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";
const InvoiceTemplate3 = ({ data }) => {
  const handleImageError = (e) => {
    console.error("Image failed to load", e);
    e.target.style.display = "none";
  };
  return (
    <div class="invoice_wrap agency1">
      <div class="invoice-container">
        <div class="invoice-content-wrap" id="download_section">
          <header class="invoice-header " id="invo_header">
            <div class="invoice-logo-content bg-black ">
              <div class="invoice-logo">
                <div class="agency-logo">
                  <h1 class="invoice-txt">INVOICE</h1>
                </div>
              </div>
            </div>
            <div class="temp_container">
              <div class="invoice-agency-details">
                <div class="invo-head-wrap">
                  <div class="color-light-black font-md wid-40">
                    Invoice No:
                  </div>
                  <div class="font-md-grey color-grey wid-20">
                    {data?.invoiceNo}
                  </div>
                </div>
                <div class="invo-head-wrap invoi-date-wrap invoi-date-wrap-agency">
                  <div class="color-light-black font-md wid-40">
                    Invoice Date:
                  </div>
                  <div class="font-md-grey color-grey wid-20">
                    {data?.Creation_date.split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-")}
                  </div>
                </div>
              </div>
            </div>
          </header>
          <section class="agency-service-content" id="agency_service">
            <div class="temp_container">
              <div class="invoice-owner-conte-wrap pt-40">
                <div class="invo-to-wrap">
                  <div class="invoice-to-content">
                    <p class="font-md color-light-black">Invoice By</p>
                    <h2 class="font-lg color-blue pt-10">{data?.user_name}</h2>
                    <p class="font-md-grey color-grey pt-10">
                      {data?.user_email_id}
                      <br /> {data?.user_contact_no}
                      <br /> {data?.permanent_address}
                      <br /> {data?.permanent_city} {data?.permanent_state}
                      <br />
                      {data?.permanent_pin_code}
                    </p>
                  </div>
                </div>
                <div class="invo-pay-to-wrap">
                  <div class="invoice-pay-content">
                    <p class="font-md color-light-black">Invoice To:</p>
                    <h2 class="font-lg color-blue pt-10">
                      CREATIVEFUEL PRIVATE LIMITED
                    </h2>
                    <p class="font-md-grey color-grey pt-10">
                      105, Gravity Mall, Vijay Nagar <br />
                      Indore, Madhya Pradesh
                      <br />
                      452010 -India <br />
                      GSTIN 23AAJCC1807B1ZC <br />
                    </p>
                  </div>
                </div>
              </div>
              <div class="table-wrapper agency-service-table pt-32">
                <table class="invoice-table agency-table">
                  <thead>
                    <tr class="invo-tb-header bg-black">
                      <th class="serv-wid pl-10 font-md">Service</th>
                      <th class="desc-wid font-md">Description</th>
                      <th class="pric-wid font-md">Price</th>
                      <th class="tota-wid pr-10 font-md text-right ">Total</th>
                    </tr>
                  </thead>
                  <tbody class="invo-tb-body">
                    <tr class="invo-tb-row">
                      <td class="font-sm pl-10">Marketing</td>
                      <td class="font-sm"> {data?.billing_header_name}</td>
                      <td class="font-sm">{data?.net_salary}</td>
                      <td class="font-sm text-right pr-10">
                        ₹ {data?.net_salary}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="invo-addition-wrap pt-20">
                <div class="invo-add-info-content"></div>
                <div class="invo-bill-total width-30">
                  <table class="invo-total-table">
                    <tbody>
                      <tr>
                        <td class="font-md color-light-black ">Sub Total:</td>
                        <td class="font-md-grey color-grey text-right pr-10 ">
                          {data?.net_salary}
                        </td>
                      </tr>
                      <tr class="tax-row">
                        <td class="font-md color-light-black ">
                          TDS <span class="color-grey"></span>
                        </td>
                        <td class="font-md-grey color-grey text-right pr-10 ">
                          ₹ {data?.tds_deduction}
                        </td>
                      </tr>
                      <tr class="invo-grand-total bg-blue ">
                        <td class="font-18-700 padding">Grand Total:</td>
                        <td class="font-18-500 text-right pr-10 ">
                          ₹ {data?.toPay}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="agencyFooterSection footerSection">
              <div class="footerRow row alignFlexEnd">
                <div class="footerCol col">
                  <div class="signBox">
                    {data?.digital_signature_image_url && (
                      <img
                        src={data?.digital_signature_image_url}
                        alt="signatures"
                        onError={handleImageError}
                      />
                    )}
                  </div>
                </div>
                <div class="footerCol col">
                  <div class="termBox">
                    <h2 class="color-blue">Terms & Condition</h2>
                    <h3>Account Details</h3>
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
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate3;
