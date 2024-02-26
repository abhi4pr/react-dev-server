import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";
import textImage from "../assets/images/hotel/txt-img.png";

const InvoiceTemplate6 = ({ data }) => {
  const handleImageError = (e) => {
    console.error("Image failed to load", e);
    e.target.style.display = "none";
  };

  function monthNameToNumber(monthName) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = months.findIndex(
      (m) => m.toLowerCase() === monthName.toLowerCase()
    );
    return monthIndex !== -1 ? monthIndex + 1 : null;
  }
  
  function getLastDateOfMonth(monthName) {
    const monthNumber = monthNameToNumber(monthName);
    if (monthNumber === null) {
      return "Invalid month name";
    }
    const currentYear = new Date().getFullYear();
    const lastDate = new Date(currentYear, monthNumber, 0).getDate();
    const formattedMonth = monthNumber < 10 ? '0' + monthNumber : monthNumber;
    const formattedLastDate = lastDate < 10 ? '0' + lastDate : lastDate;
    return `${currentYear}-${formattedMonth}-${formattedLastDate}`;
  }

  return (
    <>
      <div className="invoice_wrap hotel">
        <div className="invoice-container">
          <div className="invoice-content-wrap" id="download_section">
            <header className="hotel-header" id="invo_header">
              <div className="invoice-logo-content pink-bg">
                <div className="invoice-logo invoice-logo-hotel">
                  <h1 className="invoice-txt text-left">INVOICE</h1>
                </div>
                <div className="invo-head-content invoice-logo-hotel-left ">
                  <img src={textImage} className="txt-img" alt="txt-img" />
                  <div className="invo-head-wrap">
                    <div className="color-white font-md wid-40-hotel">
                      Invoice No:
                    </div>
                    <div className="font-md-grey color-white wid-20">
                      {data?.invoiceNo}
                    </div>
                  </div>
                  <div className="invo-head-wrap invoi-date-wrap invoi-date-wrap-agency">
                    <div className="color-white font-md wid-40-hotel">
                      Invoice Date:
                    </div>
                    <div className="font-md-grey color-white wid-20">
                      {/* {data?.Creation_date.split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")} */}
                        {getLastDateOfMonth(data?.month)}
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <section
              className="agency-service-content hotel-booking-content"
              id="hotel_invoice"
            >
              <div className="temp_container">
                <div className="invoice-owner-conte-wrap pt-20">
                  <div className="invo-to-wrap">
                    <div className="invoice-to-content">
                      <p className="font-md color-light-black">Info:</p>
                      <h1 className="font-lg color-purple pt-10">
                        {data?.user_name}
                      </h1>
                      <p className="font-md-grey color-grey pt-10">
                        Phone: {data?.user_contact_no} <br />
                        Email: {data?.user_email_id}
                      </p>
                    </div>
                  </div>
                  <div className="invo-pay-to-wrap">
                    <div className="invoice-pay-content">
                      <p className="font-md color-light-black">Invoice To:</p>
                      <h2 className="font-lg color-purple pt-10">
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
                </div>
                <div className="table-wrapper pt-40">
                  <table className="invoice-table hotel-table">
                    <thead>
                      <tr className="invo-tb-header">
                        <th className="font-md color-light-black desc-wid ">
                          S. No.
                        </th>
                        <th className="font-md color-light-black desc-wid ">
                          Description
                        </th>
                        <th className="font-md color-light-black qty-wid text-center">
                          Amount
                        </th>
                        <th className="font-md color-light-black tota-wid text-right">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="invo-tb-body">
                      <tr className="invo-tb-row">
                        <td className="font-sm">1.</td>
                        <td className="font-sm">{data?.billing_header_name}</td>
                        <td className="font-sm text-center">
                          ₹ {data?.net_salary}
                        </td>
                        <td className="font-sm text-right">
                          ₹ {data?.net_salary}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="invo-addition-wrap pt-20">
                  <div className="invo-add-info-content"></div>
                  <div className="invo-bill-total width-30">
                    <table className="invo-total-table">
                      <tbody>
                        <tr>
                          <td className="font-md color-light-black">
                            Sub Total:
                          </td>
                          <td className="font-md-grey color-grey text-right">
                            ₹ {data?.net_salary}
                          </td>
                        </tr>
                        <tr className="tax-row bottom-border">
                          <td className="font-md color-light-black">
                            TDS{" "}
                            {/* <span className="font-md color-grey">(18%)</span> */}
                          </td>
                          <td className="font-md-grey color-grey text-right">
                            ₹ {data?.tds_deduction}
                          </td>
                        </tr>
                        <tr className="invo-grand-total">
                          <td className="font-18-700 color-purple pt-20">
                            Grand Total:
                          </td>
                          <td className="font-18-500 color-light-black text-right pt-20">
                            ₹ {data?.toPay}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="payment-table-wrap hotel-booking-wrap">
                  <table className="invo-payment-table">
                    <thead>
                      <tr className="invo-tb-header">
                        <th className="font-md color-light-black payemnt-wid">
                          Payment Details
                        </th>
                        <th className="font-md color-light-black date-wid">
                          Date
                        </th>
                        <th className="font-md color-light-black amount-wid text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="invo-paye-row">
                        <td className="font-sm payment-desc second-color">
                          {data?.bank_name}
                        </td>
                        <td className="font-sm payment-desc second-color">
                          {data?.Creation_date.split("T")[0]
                            .split("-")
                            .reverse()
                            .join("-")}
                        </td>

                        <td className="font-sm payment-desc second-color text-right">
                          ₹ {data?.toPay}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="footerSection">
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
                      <h2 className="color-purple">Account Details</h2>
                      <p>
                        <span>Beneficiary name :-</span>{" "}
                        {data?.beneficiary_name}
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
    </>
  );
};

export default InvoiceTemplate6;
