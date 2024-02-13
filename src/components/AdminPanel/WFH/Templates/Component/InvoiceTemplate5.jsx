import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";
const InvoiceTemplate5 = ({ data }) => {
  return (
    <div className="invoice_wrap bus-invoice">
      <div className="invoice-container">
        <div className="invoice-content-wrap" id="download_section">
          <header className="bus-header " id="invo_header">
            <div className="bus-header-img">
              <img
                src="assets/images/bus/black-img1.svg"
                alt="background-img"
                className="wid-100"
              />
              <img
                src="assets/images/bus/pink-img.svg"
                alt="background-img"
                className="pink-img"
              />
              <img
                src="assets/images/bus/black-img2.svg"
                alt="background-img"
              />
            </div>
            <div className="container">
              <div className="bus-header-logo res-contact">
                <div className="wid-50">
                  <h1 className="invoice-txt text-left bus-txt">INVOICE</h1>
                  <div className="pt-20">
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
                              stroke="#E11D48"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M15 7C15.5304 7 16.0391 7.21071 16.4142 7.58579C16.7893 7.96086 17 8.46957 17 9"
                              stroke="#E11D48"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M15 3C16.5913 3 18.1174 3.63214 19.2426 4.75736C20.3679 5.88258 21 7.4087 21 9"
                              stroke="#E11D48"
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
                                fill="#E11D48"
                              ></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className="invo-social-name">
                        <a href="#" className="font-18 color-light-black">
                          +1 234 567 8899
                        </a>
                      </div>
                    </div>
                    <div className="invo-cont-wrap pt-10">
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
                              stroke="#E11D48"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M3 7L12 13L21 7"
                              stroke="#E11D48"
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
                                fill="#E11D48"
                              ></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className="invo-social-name">
                        <a href="#" className="font-18 color-light-black">
                          contact@invoice.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wid-50">
                  <div className="invoice-agency-details">
                    <div className="invo-head-wrap">
                      <div className="color-light-black font-md wid-40 ">
                        Invoice No:
                      </div>
                      <div className="font-md-grey color-grey wid-20">
                        #DI56789
                      </div>
                    </div>
                    <div className="invo-head-wrap invoi-date-wrap invoi-date-wrap-agency">
                      <div className="color-light-black font-md wid-40 ">
                        Invoice Date:
                      </div>
                      <div className="font-md-grey color-grey wid-20 ">
                        15/12/2024
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <section className="bus-booking-content" id="bus_booking">
            <div className="container">
              <div className="invoice-owner-conte-wrap pt-40">
                <div className="invo-to-wrap">
                  <div className="invoice-to-content">
                    <p className="font-md color-light-black">Passenger Info:</p>
                    <h2 className="font-lg color-pink pt-10">Jordon Smith</h2>
                    <p className="font-md-grey color-grey pt-10">
                      Phone: +1 562 563 8899 <br /> Email: jordon123@mail.com
                    </p>
                  </div>
                </div>
                <div className="invo-pay-to-wrap">
                  <div className="invoice-pay-content">
                    <p className="font-md color-light-black">Agency Info:</p>
                    <h2 className="font-lg color-pink pt-10">
                      Digital Invoico Busline
                    </h2>
                    <p className="font-md-grey color-grey pt-10">
                      4510 E Dolphine St, IN 3526
                      <br /> Hills Road, New York, USA
                    </p>
                  </div>
                </div>
              </div>
              <div className="invoice-timing-wrap pt-40">
                <div className="invo-time-col">
                  <div className="booking-info column-one">
                    <p className="font-sm">
                      <b className="color-light-black circle font-sm-700">
                        From:{" "}
                      </b>
                      24 Avon street, 4th Parkon, New York
                    </p>
                    <p className="font-sm mtb-14">
                      <b className="color-light-black circle font-sm-700">
                        To:{" "}
                      </b>
                      outhgate LRT Bus Stop 2217, New York
                    </p>
                  </div>
                </div>
                <div className="invo-time-col">
                  <div className="booking-info">
                    <p className="font-sm">
                      <b className="color-light-black circle font-sm-700">
                        Depart Time:{" "}
                      </b>
                      10:00 AM
                    </p>
                    <p className="font-sm mtb-14">
                      <b className="color-light-black circle font-sm-700">
                        Arrive Time:{" "}
                      </b>
                      1:00 PM
                    </p>
                  </div>
                </div>
              </div>
              <div className="bus-detail-wrap bus-detail-sec">
                <div className="bus-detail-col border-bottom">
                  <div className="font-md color-light-black bus-type">
                    Bus Type:
                  </div>
                  <div className="font-md-grey color-grey">Volvo AC</div>
                </div>
                <div className="bus-detail-col border-bottom">
                  <div className="font-md color-light-black bus-type">
                    Bus Number:
                  </div>
                  <div className="font-md-grey color-grey">10DIB</div>
                </div>
                <div className="bus-detail-col seat-col">
                  <div className="font-md color-light-black bus-type">
                    Seat No:
                  </div>
                  <div className="font-md-grey color-grey">A1, A2</div>
                </div>
                <div className="bus-detail-col ticket-col">
                  <div className="font-md color-light-black bus-type">
                    Ticket Pnr:
                  </div>
                  <div className="font-md-grey color-grey">23156-89512</div>
                </div>
              </div>
              <div className="table-wrapper pt-40">
                <table className="invoice-table bus-detail-table">
                  <thead>
                    <tr className="invo-tb-header">
                      <th className="font-md color-light-black width-50 ">
                        Details
                      </th>
                      <th className="font-md color-light-black re-price-wid text-center">
                        Price
                      </th>
                      <th className="font-md color-light-black re-qty-wid text-center">
                        Qty
                      </th>
                      <th className="font-md color-light-black tota-wid text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="invo-tb-body">
                    <tr className="invo-tb-row">
                      <td className="font-sm color-grey">
                        Delux Business Seat - 10:00 AM Sat
                      </td>
                      <td className="font-sm color-grey text-center">$120</td>
                      <td className="font-sm color-grey text-center">2</td>
                      <td className="font-sm color-grey text-right">$240.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="invo-addition-wrap pt-20">
                <div className="invo-add-info-content bus-term-cond-content"></div>
                <div className="invo-bill-total bus-invo-total  ">
                  <table className="invo-total-table">
                    <tbody>
                      <tr>
                        <td className="font-md color-light-black">
                          Sub Total:
                        </td>
                        <td className="font-md-grey color-grey text-right">
                          $240.00
                        </td>
                      </tr>
                      <tr className="tax-row bottom-border">
                        <td className="font-md color-light-black">
                          Tax <span className="font-md color-grey">(18%)</span>
                        </td>
                        <td className="font-md-grey color-grey text-right">
                          $43.20
                        </td>
                      </tr>
                      <tr className="invo-grand-total">
                        <td className="font-18-700 color-pink pt-20">
                          Grand Total:
                        </td>
                        <td className="font-18-500 pt-20 color-light-black text-right">
                          $283.20
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
          <div className="agencyFooterSection footerSection">
            <div className="footerRow row alignFlexEnd">
              <div className="footerCol col">
                <div className="signBox">
                  <img
                    src="assets/images/signature/sign1.png"
                    alt="signature"
                  />
                </div>
              </div>
              <div className="footerCol col">
                <div className="termBox">
                  <h2 className="color-pink">Terms & Condition</h2>
                  <h3>Account Details</h3>
                  <p>
                    <span>Beneficiary name :-</span> WFHD testing user
                  </p>
                  <p>
                    <span>Bank name :-</span> BOI
                  </p>
                  <p>
                    <span>Account no. :-</span> 456985214569
                  </p>
                  <p>
                    <span>IFSC Code :-</span>BOI45689
                  </p>
                  <p>
                    <span>PAN Card No. :-</span>GJWPG5688F
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate5;
