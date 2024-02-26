import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";

const InvoiceTemplate8 = ({ data }) => {
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
      <div className="invoice_wrap money-invoice">
        <div className="invoice-container">
          <div className="invoice-content-wrap" id="download_section">
            <section className="money-exchange-content" id="money_exchange">
              <div className="temp_container">
                <header
                  className="invoice-header money-header"
                  id="invo_header"
                >
                  <div className="invoice-logo-content">
                    <div className="money-img">
                      <h1 className="money-txt">INVOICE</h1>
                    </div>
                    <div className="money-img">
                      <div className="invo-head-wrap">
                        <div className="color-dark font-md wid-40-hotel">
                          Invoice No:
                        </div>
                        <div className="font-md-grey color-dark">
                          {data?.invoiceNo}
                        </div>
                      </div>
                      <div className="invo-head-wrap">
                        <div className="color-dark font-md wid-40-hotel">
                          Invoice Date:
                        </div>
                        <div className="font-md-grey color-dark">
                          {/* {data?.Creation_date.split("T")[0]
                            .split("-")
                            .reverse()
                            .join("-")} */}
                            {getLastDateOfMonth(data?.month)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="money-boder-sec pt-20">
                    <div className="black-boder"></div>
                    <div className="green-boder"></div>
                  </div>
                </header>
                <div className="invoice-owner-conte-wrap pt-40">
                  <div className="invo-to-wrap">
                    <div className="invoice-to-content">
                      <p className="font-md color-light-black">Invoice By:</p>
                      <h2 className="font-lg color-green pt-10">
                        {data?.user_name}
                      </h2>
                      <p className="font-md-grey color-grey pt-10">
                        Phone: {data?.user_contact_no}
                        <br /> Email: {data?.user_email_id}
                      </p>
                    </div>
                  </div>
                  <div className="invo-pay-to-wrap">
                    <div className="invoice-pay-content">
                      <p className="font-md color-light-black">Agency Info:</p>
                      <h2 className="font-lg color-green pt-10">
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
                        <th className="font-md color-light-black item-wid pl-10 ">
                          S.No
                        </th>
                        <th className="font-md color-light-black desc-wid ">
                          Description
                        </th>

                        <th className="font-md color-light-black tota-wid text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="invo-tb-body">
                      <tr className="invo-tb-row">
                        <td className="font-sm pl-10">1.</td>
                        <td className="font-sm">{data?.billing_header_name}</td>
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
                            TDS
                            {/* <span className="font-md color-grey">(18%)</span> */}
                          </td>
                          <td className="font-md-grey color-grey text-right">
                            - ₹ {data?.tds_deduction}
                          </td>
                        </tr>
                        <tr className="invo-grand-total">
                          <td className="font-18-700 color-green pt-20">
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
                      <h2 className="color-green">Account Details</h2>
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

export default InvoiceTemplate8;
