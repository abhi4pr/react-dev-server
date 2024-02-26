import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";
const InvoiceTemplate2 = ({ data }) => {
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
    <div className="invoice_wrap agency1">
      <div className="invoice-container">
        <div className="invoice-content-wrap" id="download_section">
          <header className="invoice-header " id="invo_header">
            <div className="invoice-logo-content bg-black ">
              <div className="invoice-logo">
                <div className="agency-logo">
                  <h1 className="invoice-txt">INVOICE</h1>
                </div>
              </div>
            </div>
            <div className="temp_container">
              <div className="invoice-agency-details">
                <div className="invo-head-wrap">
                  <div className="color-light-black font-md wid-40">
                    Invoice No:
                  </div>
                  <div className="font-md-grey color-grey wid-20">
                    {data?.invoiceNo}
                  </div>
                </div>
                <div className="invo-head-wrap invoi-date-wrap invoi-date-wrap-agency">
                  <div className="color-light-black font-md wid-40">
                    Invoice Date:
                  </div>
                  <div className="font-md-grey color-grey wid-20">
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
          <section className="agency-service-content" id="agency_service">
            <div className="temp_container">
              <div className="invoice-owner-conte-wrap pt-40">
                <div className="invo-to-wrap">
                  <div className="invoice-to-content">
                    <p className="font-md color-light-black">Invoice By</p>
                    <h2 className="font-lg color-blue pt-10">
                      {data?.user_name}
                    </h2>
                    <p className="font-md-grey color-grey pt-10">
                      {data?.user_email_id}
                      <br /> {data?.user_contact_no}
                      <br /> {data?.permanent_address}
                      <br /> {data?.permanent_city} {data?.permanent_state}
                      <br />
                      {data?.permanent_pin_code}
                    </p>
                  </div>
                </div>
                <div className="invo-pay-to-wrap">
                  <div className="invoice-pay-content">
                    <p className="font-md color-light-black">Invoice To:</p>
                    <h2 className="font-lg color-blue pt-10">
                      CREATIVEFUEL PRIVATE LIMITED
                    </h2>
                    <p className="font-md-grey color-grey pt-10">
                      105, Gravity Mall, Vijay Nagar <br />
                      Indore, Madhya Pradesh
                      <br />
                      452010 -India <br />
                      GSTIN 23AAJCC1807B1ZC <br />
                    </p>
                  </div>
                </div>
              </div>
              <div className="table-wrapper agency-service-table pt-32">
                <table className="invoice-table agency-table">
                  <thead>
                    <tr className="invo-tb-header bg-black">
                      <th className="serv-wid pl-10 font-md">Service</th>
                      <th className="desc-wid font-md">Description</th>
                      <th className="pric-wid font-md">Price</th>
                      <th className="tota-wid pr-10 font-md text-right ">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="invo-tb-body">
                    <tr className="invo-tb-row">
                      <td className="font-sm pl-10">Marketing</td>
                      <td className="font-sm"> {data?.billing_header_name}</td>
                      <td className="font-sm">{data?.net_salary}</td>
                      <td className="font-sm text-right pr-10">
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
                        <td className="font-md color-light-black ">
                          Sub Total:
                        </td>
                        <td className="font-md-grey color-grey text-right pr-10 ">
                          {data?.net_salary}
                        </td>
                      </tr>
                      <tr className="tax-row">
                        <td className="font-md color-light-black ">
                          TDS <span className="color-grey"></span>
                        </td>
                        <td className="font-md-grey color-grey text-right pr-10 ">
                          ₹ {data?.tds_deduction}
                        </td>
                      </tr>
                      <tr className="invo-grand-total bg-blue ">
                        <td className="font-18-700 padding">Grand Total:</td>
                        <td className="font-18-500 text-right pr-10 ">
                          ₹ {data?.toPay}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
                    {/* <h2 className="color-bl ue">Terms & Condition</h2> */}
                    <h2 className="color-blue">Account Details</h2>
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

export default InvoiceTemplate2;
