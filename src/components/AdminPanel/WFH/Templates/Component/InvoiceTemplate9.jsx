import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";

const InvoiceTemplate9 = ({ data }) => {
  const handleImageError = (e) => {
    console.error("Image failed to load", e);
    e.target.style.display = "none";
  };
  return (
    <>
      <div className="invoice_wrap hospital-invoice">
        <div className="invoice-container">
          <div className="invoice-content-wrap" id="download_section">
            <header
              className="invoice-header hospital-header bg-black"
              id="invo_header"
            >
              <div className="invoice-logo-content">
                <div className="invoice-logo">
                  <h1 className="invoice-txt text-left">INVOICE</h1>
                </div>
              </div>
            </header>
            <section className="hospital-service-content" id="hospital_invoice">
              <div className="temp_container">
                <div className="hospital-contact-wrap">
                  <div className="hospital-contact">
                    <div className="pt-20 hospital-contact-details">
                      <div className="invo-cont-wrap invo-contact-wrap">
                        <div className="invo-social-icon">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_6_94)">
                              <path
                                d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4"
                                stroke="#12151C"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                              <path
                                d="M15 7C15.5304 7 16.0391 7.21071 16.4142 7.58579C16.7893 7.96086 17 8.46957 17 9"
                                stroke="#12151C"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                              <path
                                d="M15 3C16.5913 3 18.1174 3.63214 19.2426 4.75736C20.3679 5.88258 21 7.4087 21 9"
                                stroke="#12151C"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_6_94">
                                <rect
                                  width="24"
                                  height="24"
                                  fill="#12151C"
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div className="invo-social-name">
                          <a
                            href="tel:+12345678899"
                            className="font-18 color-grey"
                          >
                            {data?.user_contact_no}
                          </a>
                        </div>
                      </div>
                      <div className="invo-cont-wrap ">
                        <div className="invo-social-icon">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_6_108)">
                              <path
                                d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                                stroke="#12151C"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                              <path
                                d="M3 7L12 13L21 7"
                                stroke="#12151C"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_6_108">
                                <rect
                                  width="24"
                                  height="24"
                                  fill="#12151C"
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div className="invo-social-name">
                          <a
                            href="mailto:contact@invoice.com"
                            className="font-18 color-grey"
                          >
                            {data?.user_email_id}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="invo-cont-wrap invo-contact-wrap pt-20">
                      <div className="invo-social-icon">
                        {/* <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_31_653)">
                            <path
                              d="M3 21H21"
                              stroke="#12151C"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21"
                              stroke="#12151C"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M9 21V17C9 16.4696 9.21071 15.9609 9.58579 15.5858C9.96086 15.2107 10.4696 15 11 15H13C13.5304 15 14.0391 15.2107 14.4142 15.5858C14.7893 15.9609 15 16.4696 15 17V21"
                              stroke="#12151C"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10 9H14"
                              stroke="#12151C"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12 7V11"
                              stroke="#12151C"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_31_653">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg> */}
                      </div>
                      <div className="invo-social-name"></div>
                    </div>
                  </div>
                  <div className="hospital-second">
                    <div className="hospital-green-box">
                      <div className="wid-100">
                        <div className="invo-head-wrap invo-head-wrap-hospital">
                          <div className="color-light font-md">Invoice No:</div>
                          <div className="font-md-grey color-white ">
                            {data?.invoiceNo}
                          </div>
                        </div>
                        <div className="invo-head-wrap invo-head-wrap-hospital">
                          <div className="color-light font-md">
                            Invoice Date:
                          </div>
                          <div className="font-md-grey color-white ">
                            {data?.Creation_date.split("T")[0]
                              .split("-")
                              .reverse()
                              .join("/")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="invoice-owner-conte-wrap pt-40">
                  <div className="invo-to-wrap width-70">
                    <div className="invoice-to-content">
                      <p className="font-md color-light-black">My Info:</p>
                      <h2 className="color-green-hospital font-lg pt-10">
                        {data?.user_name}
                      </h2>
                      <p className="font-md-grey color-grey pt-10">
                        Phone: {data?.user_contact_no}
                        <br />
                        Address : {data?.permanent_address} <br />
                        City: {data?.permanent_city} <br />
                        State: {data?.permanent_state}
                        <br />
                        Pincode : {data?.permanent_pin_code}
                      </p>
                    </div>
                  </div>
                  <div className="invo-pay-to-wrap width-30">
                    <div className="invoice-to-content">
                      <p className="font-md color-light-black">Agency Info:</p>
                      <h2 className="color-green-hospital font-lg pt-10">
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
                <div className="table-wrapper mt-40">
                  <table className="invoice-table hospital-table">
                    <thead className="mt-40">
                      <tr className="invo-tb-header bg-green-hospital ">
                        <th className="font-md color-light-black hospital-wid1 pl-10 ">
                          S No.
                        </th>
                        <th className="font-md color-light-black hospital-wid2 ">
                          Description
                        </th>

                        <th className="font-md color-light-black hospital-wid4 ">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="invo-tb-body">
                      <tr className="invo-tb-row">
                        <td className="invo-tb-data font-sm">1</td>
                        <td className="invo-tb-data rate-data font-sm">
                          {data?.billing_header_name}
                        </td>

                        <td className="invo-tb-data total-data font-sm text-right pr-10">
                          ₹ {data?.net_salary}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="invo-addition-wrap pt-20 hospital-rule">
                  <div className="invo-add-info-content bus-term-cond-content"></div>
                  <div className="invo-bill-total w-40">
                    <table className="invo-total-table ">
                      <tbody>
                        <tr>
                          <td className="font-md color-light-black ">
                            Sub Total:
                          </td>
                          <td className="font-md-grey color-grey text-right pr-10">
                            ₹ {data?.net_salary}
                          </td>
                        </tr>
                        <tr className="tax-row bottom-border">
                          <td className="font-md color-light-black  ">
                            TDS
                            {/* <span className="color-grey">(18%)</span> */}
                          </td>
                          <td className="font-md-grey color-grey text-right pr-10">
                            - ₹ {data?.tds_deduction}
                          </td>
                        </tr>
                        <tr className="invo-grand-total">
                          <td className="color-green-hospital  font-18-700 pt-20">
                            Grand Total:
                          </td>
                          <td className="font-18-500 color-light-black text-right pr-10 pt-20">
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
                      <h2 className="color-green-hospital">Account Details</h2>

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
                        <span>IFSC Code :-</span> {data?.ifsc_code}
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

export default InvoiceTemplate9;
