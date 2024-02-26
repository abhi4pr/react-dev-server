import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";

const InvoiceTemplate7 = ({ data }) => {
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
      <div className="invoice_wrap restaurant">
        <div className="invoice-container">
          <div className="invoice-content-wrap" id="download_section">
            <header className="bg-yellow restaurant-header" id="invo_header">
              <div className="invoice-logo-content pt-20 pb-20">
                <div className="invoice-logo-details wid-50">
                  <h1 className="invoice-txt text-left">INVOICE</h1>
                </div>
                <div className="invoice-logo-res wid-50">
                  <div className="res-contact pt-0"></div>
                </div>
              </div>
            </header>
            <section
              className="agency-service-content restaurant-invoice-content"
              id="restaurant_bill"
            >
              <div className="temp_container">
                <div className="bus-invo-no-date-wrap">
                  <div className="bus-invo-num">
                    <span className="font-md color-light-black">
                      Invoice No:
                    </span>
                    <span className="font-md-grey color-light-black">
                      {data?.invoiceNo}
                    </span>
                  </div>
                  <div className="bus-invo-date">
                    <span className="font-md color-light-black">
                      Invoice Date:
                    </span>
                    <span className="font-md-grey color-light-black">
                      {/* {data?.Creation_date.split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")} */}
                        {getLastDateOfMonth(data?.month)}
                    </span>
                  </div>
                </div>
                <div className="invoice-owner-conte-wrap pt-20">
                  <div className="invo-to-wrap">
                    <div className="invoice-to-content">
                      <p className="font-md color-light-black">Invoice:</p>
                      <h1 className="font-lg color-yellow pt-10">
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
                      <p className="font-md color-light-black">Pay To:</p>
                      <h2 className="font-lg color-yellow pt-10">
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
                <div className="table-wrapper res-contact">
                  <table className="invoice-table restaurant-table">
                    <thead>
                      <tr className="invo-tb-header bg-yellow">
                        <th className="font-md color-light-black res-no  pl-10">
                          S. No.
                        </th>
                        <th className="font-md color-light-black w-40">
                          Description
                        </th>
                        <th className="font-md color-light-black res-pric text-center">
                          Amount
                        </th>
                        <th className="font-md color-light-black res-total text-center ">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="invo-tb-body">
                      <tr className="invo-tb-row">
                        <td className="font-sm color-grey">1</td>
                        <td className="font-sm color-grey">
                          {data?.billing_header_name}
                        </td>
                        <td className="font-sm color-grey text-center">
                          ₹ {data?.net_salary}
                        </td>
                        <td className="font-sm color-grey text-center">
                          ₹ {data?.net_salary}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="invo-addition-wrap pt-20">
                  <div className="invo-add-info-content"></div>
                  <div className="invo-bill-total desc-wid">
                    <table className="invo-total-table">
                      <tbody>
                        <tr>
                          <td className="font-md color-light-black">
                            Sub Total:
                          </td>
                          <td className="font-md-grey color-grey text-center">
                            ₹ {data?.net_salary}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="font-md color-light-black">
                            TDS
                            <span className="font-md color-grey">(18%)</span>
                          </td>
                          <td className="font-md-grey color-grey text-center">
                            - ₹ {data?.tds_deduction}
                          </td>
                        </tr>
                        <tr className="invo-grand-total">
                          <td className="color-yellow font-18-700 pt-20">
                            Grand Total:
                          </td>
                          <td className="font-18-500 color-light-black pt-20 text-center">
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
                        <h2 className="color-yellow">Account Details</h2>
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
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceTemplate7;
