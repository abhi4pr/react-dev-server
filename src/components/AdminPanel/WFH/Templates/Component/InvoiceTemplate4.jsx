import React from "react";
import headerImg from "../assets/images/photostudio/header-img.svg";
import footerImg from "../assets/images/photostudio/footer-img.svg";
const InvoiceTemplate6 = ({ data }) => {
  const handleImageError = (e) => {
    console.error("Image failed to load", e);
    e.target.style.display = "none";
  };
  return (
    <div className="invoice_wrap photostudio">
      <div className="invoice-container">
        <div className="invoice-content-wrap" id="download_section">
          <header className="invoice-header" id="invo_header">
            <div className="invoice-logo-content">
              <div className="invo-head-content">
                <div className="phtotstudio-img">
                  <img
                    src={headerImg}
                    alt="phtotstudio-img"
                    className="photo-header-img"
                  />
                </div>
              </div>
            </div>
          </header>
          <section className="photo-invoice-details" id="photostudio_invoice">
            <div className="temp_container">
              <div className="invoice-owner-conte-wrap pt-40">
                <div className="invo-to-wrap invo-to-wrap-photo">
                  <div className="invoice-to-content">
                    <p className="font-md color-light-black">Invoice To:</p>
                    <h1 className="d-none">Invoice</h1>
                    <h2 className="color-blue-flight font-lg pt-10">
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
                <div className="invo-pay-to-wrap invo-pay-to-wrap-photo">
                  <div className="invoice-pay-content">
                    <h1 className="photo-txt">INVOICE</h1>
                    <div className="invo-head-content pt-20  ">
                      <div className="invo-head-wrap invo-head-wrap-photo">
                        <div className="color-light-black font-md">
                          Invoice No:
                        </div>
                        <div className="font-md-grey color-light-black ">
                          {data?.invoiceNo}
                        </div>
                      </div>
                      <div className="invo-head-wrap invo-head-wrap-photo">
                        <div className="color-light-black font-md">
                          Invoice Date:
                        </div>
                        <div className="font-md-grey color-light-black ">
                          {data?.Creation_date.split("T")[0]
                            .split("-")
                            .reverse()
                            .join("-")}
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

                      <th className="font-md color-light-black tota-wid text-right pr-20 ">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="invo-tb-body table-color">
                    <tr className="paddind-pt-row table-bg">
                      <td className="font-sm">1</td>
                      <td className="font-sm">{data?.billing_header_name}</td>
                      <td className="font-sm">₹ {data?.toPay}</td>

                      <td className="font-sm">₹ {data?.toPay}</td>
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
                        <td className="font-md-grey color-grey ">
                          ₹ {data?.total_salary}
                        </td>
                      </tr>
                      <tr className="tax-row">
                        <td className="font-md color-light-black">
                          TDS
                          <span className="invo-total-data inter-700 medium-font second-color"></span>
                        </td>
                        <td className="font-md-grey color-grey">
                          ₹ {data?.tds_deduction}
                        </td>
                      </tr>
                      <tr className="invo-grand-total">
                        <td className="font-18-700 color-blue-flight pt-20">
                          Grand Total:
                        </td>
                        <td className="font-18-500 color-light-black pt-20 ">
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
                    <h2 className="color-blue-flight">Terms & Condition</h2>
                    <h3>Account Details</h3>
                    <p>
                      <span>Beneficiary name :-</span>
                      {data?.user_name}
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
            <div className="photo-footer-sec">
              <div className="photo-footer-sec-img">
                <img src={footerImg} alt="phtotstudio-footer-img" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate6;
