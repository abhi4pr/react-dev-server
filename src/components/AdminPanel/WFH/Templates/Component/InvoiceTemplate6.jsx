import React from "react";

const InvoiceTemplate6 = ({ data }) => {
  return (
    <div className="invoice_wrap photostudio">
      <div className="invoice-container">
        <div className="invoice-content-wrap" id="download_section">
          <header className="invoice-header" id="invo_header">
            <div className="invoice-logo-content">
              <div className="invo-head-content">
                <div className="phtotstudio-img">
                  <img
                    src="assets/images/photostudio/header-img.svg"
                    alt="phtotstudio-img"
                    className="photo-header-img"
                  />
                </div>
              </div>
            </div>
          </header>
          <section className="photo-invoice-details" id="photostudio_invoice">
            <div className="container">
              <div className="invoice-owner-conte-wrap pt-40">
                <div className="invo-to-wrap invo-to-wrap-photo">
                  <div className="invoice-to-content">
                    <p className="font-md color-light-black">Invoice To:</p>
                    <h1 className="d-none">Invoice</h1>
                    <h2 className="color-blue-flight font-lg pt-10">
                      Jordon Smith
                    </h2>
                    <p className="font-md-grey color-grey pt-10">
                      +1-234-567-8899
                      <br />
                      jordon123@gmail.com
                    </p>
                  </div>
                </div>
                <div className="invo-pay-to-wrap invo-pay-to-wrap-photo">
                  <div className="invoice-pay-content">
                    <h1 className="photo-txt">INVOICE</h1>
                    <div className="invo-head-content pt-20  ">
                      <div className="invo-head-wrap invo-head-wrap-photo">
                        <div className="color-light-black font-md">
                          Invoice No:
                        </div>
                        <div className="font-md-grey color-light-black ">
                          #DI56789
                        </div>
                      </div>
                      <div className="invo-head-wrap invo-head-wrap-photo">
                        <div className="color-light-black font-md">
                          Invoice Date:
                        </div>
                        <div className="font-md-grey color-light-black ">
                          15/12/2024
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-wrapper pt-40">
                <table className="invoice-table photostudio-table">
                  <thead>
                    <tr className="invo-tb-header">
                      <th className="font-md color-light-black sno-wid pl-20">
                        S. No.
                      </th>
                      <th className="font-md color-light-black re-desc-wid text-left ">
                        Description
                      </th>
                      <th className="font-md color-light-black re-price-wid">
                        Price
                      </th>
                      <th className="font-md color-light-black re-qty-wid ">
                        Qty
                      </th>
                      <th className="font-md color-light-black tota-wid text-right pr-20 ">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="invo-tb-body table-color">
                    <tr className="paddind-pt-row table-bg">
                      <td className="font-sm">1</td>
                      <td className="font-sm">
                        Large size art with large frame
                      </td>
                      <td className="font-sm">$300</td>
                      <td className="font-sm">2</td>
                      <td className="font-sm">$600.00</td>
                    </tr>
                    <tr className="paddind-pt-row">
                      <td className="font-sm">2</td>
                      <td className="font-sm">
                        Family size photo with medium frame
                      </td>
                      <td className="font-sm">$150</td>
                      <td className="font-sm">1</td>
                      <td className="font-sm">$150.00</td>
                    </tr>
                    <tr className="paddind-pt-row table-bg">
                      <td className="font-sm">3</td>
                      <td className="font-sm">
                        Album size photo with digital print
                      </td>
                      <td className="font-sm">$100</td>
                      <td className="font-sm">4</td>
                      <td className="font-sm">$400.00</td>
                    </tr>
                    <tr className="paddind-pt-row">
                      <td className="font-sm">4</td>
                      <td className="font-sm">Camera rent</td>
                      <td className="font-sm">$50</td>
                      <td className="font-sm">1</td>
                      <td className="font-sm">$50.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="invo-addition-wrap invo-addition-wrap-photo  pt-20">
                <div className="invo-add-info-content"></div>
                <div className="invo-bill-total">
                  <table className="invo-total-table">
                    <tbody>
                      <tr>
                        <td className="font-md color-light-black">
                          Sub Total:
                        </td>
                        <td className="font-md-grey color-grey ">$1200.00</td>
                      </tr>
                      <tr className="tax-row">
                        <td className="font-md color-light-black">
                          Tax{" "}
                          <span className="invo-total-data inter-700 medium-font second-color">
                            (5%)
                          </span>
                        </td>
                        <td className="font-md-grey color-grey">$60.00</td>
                      </tr>
                      <tr className="disc-row bottom-border">
                        <td className="font-md color-light-black">Discount</td>
                        <td className="font-md-grey color-green-photo">
                          $0.00
                        </td>
                      </tr>
                      <tr className="invo-grand-total">
                        <td className="font-18-700 color-blue-flight pt-20">
                          Grand Total:
                        </td>
                        <td className="font-18-500 color-light-black pt-20 ">
                          $1260.00
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
                    <img
                      src="assets/images/signature/sign1.png"
                      alt="signature"
                    />
                  </div>
                </div>
                <div className="footerCol col">
                  <div className="termBox">
                    <h2 className="color-blue-flight">Terms & Condition</h2>
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
            <div className="photo-footer-sec">
              <div className="photo-footer-sec-img">
                <img
                  src="assets/images/photostudio/footer-img.svg"
                  alt="phtotstudio-footer-img"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate6;
