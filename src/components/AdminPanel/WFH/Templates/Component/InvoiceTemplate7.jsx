import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";

const InvoiceTemplate7 = ({ data }) => {
  return (
    <div class="invoice_wrap domain-invoice">
      <div class="invoice-container">
        <div class="invoice-content-wrap" id="download_section">
          <header class="domain-header" id="invo_header">
            <div class="invoice-logo-content invoice-logo-content-domain">
              <div class="invoice-logo invoice-logo-domain"></div>
              <div class="domain-img">
                <h1 class="domain-txt">INVOICE</h1>
                <div class="invoice-agency-details">
                  <div class="invo-head-wrap">
                    <div class="color-light-black font-md">Invoice No:</div>
                    <div class="font-md-grey color-grey">#DI56789</div>
                  </div>
                  <div class="invo-head-wrap invoi-date-wrap invoi-date-wrap-agency">
                    <div class="color-light-black font-md">Invoice Date:</div>
                    <div class="font-md-grey color-grey">15/12/2024</div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <section class="bus-booking-content" id="domain_invoice">
            <div class="container">
              <div class="invoice-owner-conte-wrap domain-owner">
                <div class="invo-to-wrap">
                  <div class="invoice-to-content">
                    <p class="font-md color-light-black">Bill To:</p>
                    <h2 class="font-lg domain-color pt-10 ">Jordon Smith</h2>
                    <p class="font-md-grey color-grey pt-10">
                      Phone: +1 562 563 8899 <br /> Email: jordon123@mail.com
                    </p>
                  </div>
                </div>
                <div class="invo-pay-to-wrap">
                  <div class="invoice-pay-content">
                    <p class="font-md color-light-black">Host Info:</p>
                    <h2 class="font-lg domain-color pt-10">
                      Digital Invoico Hosting
                    </h2>
                    <p class="font-md-grey color-grey pt-10">
                      4510 E Dolphine St, IN 3526
                      <br /> Hills Road, New York, USA
                    </p>
                  </div>
                </div>
              </div>
              <div class="invoice-timing-wrap domain-mt pt-40">
                <div class="invo-time-col">
                  <div class="booking-info column-one">
                    <p class="font-sm ">
                      <b class="font-sm-700 color-light-black circle">
                        Domain Start Date:{" "}
                      </b>
                      24 April 2023
                    </p>
                    <p class="font-sm mtb-14 ">
                      <b class="font-sm-700 color-light-black circle">
                        Domain End Date:{" "}
                      </b>
                      23 April 2024
                    </p>
                  </div>
                </div>
                <div class="invo-time-col">
                  <div class="booking-info">
                    <p class="font-sm">
                      <b class="font-sm-700 color-light-black circle">
                        Hosting Start Date:{" "}
                      </b>{" "}
                      24 April 2023
                    </p>
                    <p class="font-sm mtb-14">
                      <b class="font-sm-700 color-light-black circle">
                        Hosting End Date{" "}
                      </b>{" "}
                      23 April 2025
                    </p>
                  </div>
                </div>
              </div>
              <div class="bus-detail-wrap domain-detail-wrap">
                <div class="bus-detail-col border-bottom">
                  <div class="bus-type font-md color-light-black">
                    Customer ID:
                  </div>
                  <div class="font-md-grey color-grey">DI982563</div>
                </div>
                <div class="bus-detail-col border-bottom">
                  <div class="bus-type font-md color-light-black">
                    Transaction No:
                  </div>
                  <div class="font-md-grey color-grey">TN635241</div>
                </div>
                <div class="bus-detail-col seat-col">
                  <div class="bus-type font-md color-light-black">
                    Total Amount:
                  </div>
                  <div class="font-md-grey color-grey">A1, A2</div>
                </div>
                <div class="bus-detail-col">
                  <div class="bus-type font-md color-light-black">
                    Payment By:
                  </div>
                  <div class="font-md-grey color-grey">Visa **** **95</div>
                </div>
              </div>
              <div class="table-wrapper pt-40">
                <table class="invoice-table domain-table">
                  <thead>
                    <tr class="invo-tb-header">
                      <th class="font-md color-light-black">Item Details</th>
                      <th class="font-md color-light-black">Rate</th>
                      <th class="font-md color-light-black">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="invo-tb-body">
                    <tr class="invo-tb-row">
                      <td class="font-sm">
                        1 Domain - (yourdomain.com Registration with SSL)
                      </td>
                      <td class="font-sm">1 Year x $40.00</td>
                      <td class="font-sm ">$40.00</td>
                    </tr>
                    <tr class="invo-tb-row">
                      <td class="font-sm">
                        25 GB Hosting - (Business Package #SHP2564874)
                      </td>
                      <td class="font-sm ">2 Years x $100.00</td>
                      <td class="font-sm  ">$200.00</td>
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
                        <td class="font-md color-light-black">Sub Total:</td>
                        <td class="font-md-grey color-grey text-right">
                          $240.00
                        </td>
                      </tr>
                      <tr class="tax-row bottom-border">
                        <td class="font-md color-light-black">
                          Tax <span class="color-grey">(18%)</span>
                        </td>
                        <td class="font-md-grey color-grey text-right">
                          $43.20
                        </td>
                      </tr>
                      <tr class="invo-grand-total">
                        <td class="font-md domain-color pt-20">Grand Total:</td>
                        <td class="font-18-500 color-light-black pt-20 text-right">
                          $283.20
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="agencyFooterSection footerSection">
                <div class="footerRow row alignFlexEnd">
                  <div class="footerCol col">
                    <div class="signBox">
                      <img
                        src="assets/images/signature/sign1.png"
                        alt="signature"
                      />
                    </div>
                  </div>
                  <div class="footerCol col">
                    <div class="termBox">
                      <h2 class="domain-color">Terms & Condition</h2>
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
              <div class="hospital-contact pt-40 domain-footer-image">
                <div class=""></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate7;
