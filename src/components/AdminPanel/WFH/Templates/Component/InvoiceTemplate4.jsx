import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";

import "../assets/css/Template.css";
import "../assets/css/media-query.css";

const InvoiceTemplate4 = ({ data }) => {
  return (
    <div className="invoice_wrap hotel">
      <div className="invoice-container">
        <div className="invoice-content-wrap" id="download_section">
          <header className="hotel-header" id="invo_header">
            <div className="invoice-logo-content pink-bg">
              <div className="invoice-logo invoice-logo-hotel">
                <h1 className="invoice-txt text-left">INVOICE</h1>
              </div>
              <div className="invo-head-content invoice-logo-hotel-left">
                <img
                  src="assets/images/hotel/txt-img.png"
                  className="txt-img"
                  alt="txt-img"
                />
                <div className="invo-head-wrap">
                  <div className="color-white font-md wid-40-hotel">
                    Invoice No:
                  </div>
                  <div className="font-md-grey color-white wid-20">
                    #DI56789
                  </div>
                </div>
                <div className="invo-head-wrap invoi-date-wrap invoi-date-wrap-agency">
                  <div className="color-white font-md wid-40-hotel">
                    Invoice Date:
                  </div>
                  <div className="font-md-grey color-white wid-20">
                    15/12/2024
                  </div>
                </div>
              </div>
            </div>
          </header>
          <section
            className="agency-service-content hotel-booking-content"
            id="hotel_invoice"
          >
            <div className="container">
              <div className="invoice-owner-conte-wrap pt-20">
                <div className="invo-to-wrap">
                  <div className="invoice-to-content">
                    <p className="font-md color-light-black">Guest Info:</p>
                    <h1 className="font-lg color-purple pt-10">Jordon Smith</h1>
                    <p className="font-md-grey color-grey pt-10">
                      Phone: +1 562 563 8899 <br /> Email: jordon123@mail.com
                    </p>
                  </div>
                </div>
                <div className="invo-pay-to-wrap">
                  <div className="invoice-pay-content">
                    <p className="font-md color-light-black">Hotel Details:</p>
                    <h2 className="font-lg color-purple pt-10">
                      Digital Invoico Star Hotel
                    </h2>
                    <p className="font-md-grey color-grey pt-10">
                      4510 E Dolphine St, IN 3526
                      <br /> Hills Road, New York, USA
                    </p>
                  </div>
                </div>
              </div>
              <div className="invo-hotel-book-wrap pt-40">
                <div className="booking-content-wrap">
                  <div className="invo-book-detail detail-col">
                    <span className="font-sm-700 color-light-black">
                      Booking ID:
                    </span>
                    <span className="font-sm">DIH56321</span>
                  </div>
                  <div className="invo-book-detail detail-col">
                    <span className="font-sm-700 color-light-black">
                      Check In:
                    </span>
                    <span className="font-sm">30/11/2022</span>
                  </div>
                  <div className="invo-book-detail detail-col">
                    <span className="font-sm-700 color-light-black">
                      Nights:
                    </span>
                    <span className="font-sm">3</span>
                  </div>
                </div>
                <div className="booking-content-wrap second-row">
                  <div className="invo-book-detail detail-col">
                    <span className="font-sm-700 color-light-black">
                      Room No:
                    </span>
                    <span className="font-sm">101</span>
                  </div>
                  <div className="invo-book-detail detail-col">
                    <span className="font-sm-700 color-light-black">
                      Check Out:
                    </span>
                    <span className="font-sm">02/12/2022</span>
                  </div>
                  <div className="invo-book-detail detail-col">
                    <span className="font-sm-700 color-light-black">
                      Room Type:{" "}
                    </span>
                    <span className="font-sm">Delux</span>
                  </div>
                </div>
              </div>
              <div className="table-wrapper pt-40">
                <table className="invoice-table hotel-table">
                  <thead>
                    <tr className="invo-tb-header">
                      <th className="font-md color-light-black item-wid pl-10">
                        Items
                      </th>
                      <th className="font-md color-light-black desc-wid">
                        Description
                      </th>
                      <th className="font-md color-light-black qty-wid text-center">
                        Rate
                      </th>
                      <th className="font-md color-light-black tota-wid text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="invo-tb-body">
                    <tr className="invo-tb-row">
                      <td className="font-sm pl-10">Delux Room</td>
                      <td className="font-sm">
                        Double bedroom with private bathroom
                      </td>
                      <td className="font-sm text-center">
                        1 Rooms x 3 Nights x $300.00
                      </td>
                      <td className="font-sm text-right">$900.00</td>
                    </tr>
                    <tr className="invo-tb-row table-bg">
                      <td className="font-sm pl-10">Room Service</td>
                      <td className="font-sm">Breakfast + Dinner</td>
                      <td className="font-sm text-center">$30.00 X One Time</td>
                      <td className="font-sm text-right">$180.00</td>
                    </tr>
                    <tr className="invo-tb-row">
                      <td className="font-sm pl-10">Promotional Code</td>
                      <td className="font-sm">
                        HOLYSUMMER - One Time Discount
                      </td>
                      <td className="font-sm text-center">20% OFF</td>
                      <td className="font-sm text-right">-$216.00</td>
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
                          $864.00
                        </td>
                      </tr>
                      <tr className="tax-row bottom-border">
                        <td className="font-md color-light-black">
                          Tax <span className="font-md color-grey">(18%)</span>
                        </td>
                        <td className="font-md-grey color-grey text-right">
                          $155.52
                        </td>
                      </tr>
                      <tr className="invo-grand-total">
                        <td className="font-18-700 color-purple pt-20">
                          Grand Total:
                        </td>
                        <td className="font-18-500 color-light-black text-right pt-20">
                          $1019.52
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
                      <th className="font-md color-light-black trans-wid">
                        Transaction ID
                      </th>
                      <th className="font-md color-light-black amount-wid text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="invo-paye-row">
                      <td className="font-sm payment-desc second-color">
                        American Express
                      </td>
                      <td className="font-sm payment-desc second-color">
                        25/11/2022
                      </td>
                      <td className="font-sm payment-desc second-color">
                        TD52369815
                      </td>
                      <td className="font-sm payment-desc second-color text-right">
                        $1019.52
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate4;
