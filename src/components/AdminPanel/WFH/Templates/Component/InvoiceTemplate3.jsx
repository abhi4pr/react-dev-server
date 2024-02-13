import React from "react";
import "../assets/css/Template.css";
import "../assets/css/media-query.css";
const InvoiceTemplate3 = ({ data }) => {
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
            <div class="container">
              <div class="invoice-agency-details">
                <div class="invo-head-wrap">
                  <div class="color-light-black font-md wid-40">
                    Invoice No:
                  </div>
                  <div class="font-md-grey color-grey wid-20">#DI56789</div>
                </div>
                <div class="invo-head-wrap invoi-date-wrap invoi-date-wrap-agency">
                  <div class="color-light-black font-md wid-40">
                    Invoice Date:
                  </div>
                  <div class="font-md-grey color-grey wid-20">15/12/2024</div>
                </div>
              </div>
            </div>
          </header>
          <section class="agency-service-content" id="agency_service">
            <div class="container">
              <div class="invoice-owner-conte-wrap pt-40">
                <div class="invo-to-wrap">
                  <div class="invoice-to-content">
                    <p class="font-md color-light-black">Invoice To:</p>
                    <h2 class="font-lg color-blue pt-10">Jordon Smith</h2>
                    <p class="font-md-grey color-grey pt-10">
                      121 E Parkview St, IN 45240
                      <br /> Toronto, Ontario
                      <br /> Canada
                    </p>
                  </div>
                </div>
                <div class="invo-pay-to-wrap">
                  <div class="invoice-pay-content">
                    <p class="font-md color-light-black">Pay To:</p>
                    <h2 class="font-lg color-blue pt-10">Digital Invoica</h2>
                    <p class="font-md-grey color-grey pt-10">
                      4510 E Dolphine St, IN 3526 <br /> Hills Road, New York
                      <br />
                      United States
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
                      <th class="qty-wid font-md">Qty</th>
                      <th class="pric-wid font-md">Price</th>
                      <th class="tota-wid pr-10 font-md text-right ">Total</th>
                    </tr>
                  </thead>
                  <tbody class="invo-tb-body">
                    <tr class="invo-tb-row">
                      <td class="font-sm pl-10">Marketing</td>
                      <td class="font-sm">Digital Marketing & SEO</td>
                      <td class="font-sm">2</td>
                      <td class="font-sm">$120</td>
                      <td class="font-sm text-right pr-10">$240.00</td>
                    </tr>
                    <tr class="invo-tb-row">
                      <td class="font-sm pl-10">Web Design & Development</td>
                      <td class="font-sm">Dektop & Mobile Web App Design</td>
                      <td class="font-sm">2</td>
                      <td class="font-sm">$250</td>
                      <td class="font-sm text-right pr-10">$500.00</td>
                    </tr>
                    <tr class="invo-tb-row">
                      <td class="font-sm pl-10">UI/UX Design</td>
                      <td class="font-sm">Mobile Adroid & iOS App Design</td>
                      <td class="font-sm">1</td>
                      <td class="font-sm">$80</td>
                      <td class="font-sm text-right pr-10">$80.00</td>
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
                          $820.00
                        </td>
                      </tr>
                      <tr class="tax-row">
                        <td class="font-md color-light-black ">
                          Tax <span class="color-grey">(18%)</span>
                        </td>
                        <td class="font-md-grey color-grey text-right pr-10 ">
                          $147.60
                        </td>
                      </tr>
                      <tr class="invo-grand-total bg-blue ">
                        <td class="font-18-700 padding">Grand Total:</td>
                        <td class="font-18-500 text-right pr-10 ">$967.60</td>
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
                    <img
                      src="assets/images/signature/sign1.png"
                      alt="signature"
                    />
                  </div>
                </div>
                <div class="footerCol col">
                  <div class="termBox">
                    <h2 class="color-blue">Terms & Condition</h2>
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
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate3;
