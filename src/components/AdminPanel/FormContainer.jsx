import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

const FormContainer = ({
  mainTitle,
  title,
  uniqueVendorCount,
  totalPendingAmount,
  pendingRequestCount,
  uniqueCustomerCount,
  discardCount,
  discardedRequestCount,
  paidRequestCount,
  totalRequestAmount,
  handleOpenUniqueVendorClick,
  link,
  buttonAccess,
  newbutton,
  newbuttonRouting,
  newbuttonName,
  children,
  handleSubmit,
  handleOpenUniqueCustomerClick,
  submitButton = true,
  addNewButtonName,
  accordionButtons = [],
  activeAccordionIndex,
  onAccordionButtonClick,
  refundAmountTotal,
  balanceAmountTotal,
  requestedAmountTotal,
  pendingCount,
  approvedCount,
  rejectedCount,
  baseAmountTotal,
  campaignAmountTotal,
  uniqueSalesExecutiveCount,
  handleOpenUniqueSalesExecutive,
  pendingApprovalAdditionalTitles = false,
  includeAdditionalTitles = false,
  paymentDoneAdditionalTitles = false,
  allTransactionAdditionalTitles = false,
  discardAdditionalTitles = false,
  dashboardAdditionalTitles = false,
  refundReqAdditionalTitles = false,
  saleBookingClosePaymentAdditionalTitles = false,
  invoiceCreatedPaymentAdditionalTitles = false,
  pendingApprovalRefundAdditionalTitles = false,
  balancePaymentAdditionalTitles = false,
  incentivePaymentAdditionalTitles = false,
  saleBookingVerifyPaymentAdditionalTitles = false,
  pendingInvoicePaymentAdditionalTitles = false,
  loading = false,
  pendingpaymentRemainder = 0,
  mainTitleRequired = true,
}) => {
  return (
    <>
      {mainTitleRequired && (
        <div className="form-heading">
          <div className="form_heading_title ">
            <h2>{mainTitle}</h2>
          </div>
          {includeAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vender : <a href="#">{uniqueVendorCount}</a>
              </h2>
              <h2>
                Pending Amount : <a href="#"> {totalPendingAmount}</a>
              </h2>
              <h2>
                Pending Request : <a href="#"> {pendingRequestCount}</a>
              </h2>
              <h2>
                Reminder : <a href="#">{pendingpaymentRemainder}</a>
              </h2>
            </div>
          )}
          {paymentDoneAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vender : <a href="#">{uniqueVendorCount}</a>
              </h2>
              <h2>
                Payment Done Amount : <a href="#"> {totalRequestAmount}</a>
              </h2>
              <h2>
                Payment Done : <a href="#"> {pendingRequestCount}</a>
              </h2>
            </div>
          )}
          {allTransactionAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vender : <a href="#">{uniqueVendorCount}</a>
              </h2>
              <h2>
                Requested Amount : <a href="#"> {totalRequestAmount}</a>
              </h2>
              <h2>
                Pending Request Count : <a href="#"> {pendingRequestCount}</a>
              </h2>
              <h2>
                Paid Count : <a href="#"> {paidRequestCount}</a>
              </h2>
              <h2>
                Discard Count : <a href="#"> {discardedRequestCount}</a>
              </h2>
            </div>
          )}
          {discardAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vender : <a href="#">{uniqueVendorCount}</a>
              </h2>
              <h2>
                Requested Amount : <a href="#"> {totalRequestAmount}</a>
              </h2>
              <h2>
                Discard Count : <a href="#"> {discardCount}</a>
              </h2>
            </div>
          )}
          {pendingApprovalAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customer : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Payment Amount : <a href="#">{totalRequestAmount}</a>
              </h2>
              <h2>
                Pending count : <a href="#"> {pendingCount}</a>
              </h2>
              <h2>
                Approved Count : <a href="#"> {approvedCount}</a>
              </h2>
              <h2>
                Rejected Count : <a href="#">{rejectedCount}</a>
              </h2>
            </div>
          )}
          {dashboardAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customer : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Payment Amount : <a href="#">{totalRequestAmount}</a>
              </h2>
              <h2>
                Pending Count : <a href="#">{pendingCount}</a>
              </h2>
              <h2>
                Approved Count : <a href="#">{approvedCount}</a>
              </h2>
              <h2>
                Rejected Count : <a href="#">{rejectedCount}</a>
              </h2>
            </div>
          )}
          {pendingApprovalRefundAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customer : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Refund Amount : <a href="#">{refundAmountTotal}</a>
              </h2>
            </div>
          )}
          {refundReqAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customer : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Refund Amount : <a href="#">{refundAmountTotal}</a>
              </h2>
              <h2>
                Approved Count : <a href="#">{approvedCount}</a>
              </h2>
              <h2>
                Rejected Count : <a href="#">{rejectedCount}</a>
              </h2>
            </div>
          )}
          {balancePaymentAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customer : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2>
                Balance Amount : <a href="#">{balanceAmountTotal}</a>
              </h2>
            </div>
          )}
          {incentivePaymentAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2>
                Requested Amount : <a href="#">{requestedAmountTotal}</a>
              </h2>
            </div>
          )}
          {pendingInvoicePaymentAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customers : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Base Amount : <a href="#">{baseAmountTotal}</a>
              </h2>
            </div>
          )}
          {invoiceCreatedPaymentAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customers : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Campaign Amount : <a href="#">{campaignAmountTotal}</a>
              </h2>
            </div>
          )}
          {saleBookingClosePaymentAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customers : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Base Amount : <a href="#">{baseAmountTotal}</a>
              </h2>
            </div>
          )}
          {saleBookingVerifyPaymentAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customers : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Base Amount : <a href="#">{baseAmountTotal}</a>
              </h2>
            </div>
          )}
          {link && buttonAccess && (
            <div className="form_heading_action d-flex ">
              <Link to={link}>
                <button
                  title={"Add New " + mainTitle}
                  className={`btn btn-primary ${
                    addNewButtonName && "text_button"
                  }`}
                >
                  {addNewButtonName ? addNewButtonName : <FaUserPlus />}
                </button>
              </Link>
              {link && newbutton && (
                <Link to={newbuttonRouting}>
                  <button
                    title={"Add " + mainTitle}
                    className={`btn btn-success ml-2 ${
                      newbuttonName && "text_button"
                    }`}
                  >
                    {newbuttonName ? newbuttonName : <FaUserPlus />}
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {!link && (
        <div className="card shadow mb24">
          <div className="card-header d-flex flex-row align-items-center justify-content-between">
            {accordionButtons.length === 0 && (
              <div className="card_header_title tabbtn_header">
                <h2>{title}</h2>
              </div>
            )}

            <div className="btn-group w-100">
              {accordionButtons.map((buttonName, index) => (
                <button
                  key={index}
                  className={
                    activeAccordionIndex === index
                      ? `btn btn-primary`
                      : "btn btn-outline-primary"
                  }
                  onClick={() => onAccordionButtonClick(index)}
                >
                  {buttonName}
                </button>
              ))}
            </div>
          </div>

          <div className="card-body">
            <div className="thm_form">
              <form onSubmit={handleSubmit} className="needs-validation">
                <div className="row">{children}</div>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    {accordionButtons.length == 0 && submitButton && (
                      <button
                        className="btn btn btn-primary"
                        style={{ marginRight: "5px" }}
                        type="submit"
                      >
                        Submit
                      </button>
                    )}

                    {activeAccordionIndex === accordionButtons.length - 1 &&
                      submitButton && (
                        <button
                          className={`btn btn ${
                            loading ? "btn-danger" : "btn-success"
                          }`}
                          style={{ marginRight: "5px" }}
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Submiting" : "Submit"}
                        </button>
                      )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormContainer;
