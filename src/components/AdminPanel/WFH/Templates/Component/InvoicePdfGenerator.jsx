import React, { useRef } from "react";
import { generatePDF } from "../Utils/genratePDF";
import { useGlobalContext } from "../../../../../Context/Context";
import axios from "axios";
import { baseUrl } from "../../../../../utils/config";
import InvoiceTemplate1 from "./InvoiceTemplate1";
import InvoiceTemplate2 from "./InvoiceTemplate2";
import InvoiceTemplate3 from "./InvoiceTemplate3";
import InvoiceTemplate4 from "./InvoiceTemplate4";
import InvoiceTemplate5 from "./InvoiceTemplate5";

const templates = {
  1: InvoiceTemplate1,
  2: InvoiceTemplate2,
  3: InvoiceTemplate3,
  4: InvoiceTemplate4,
  5: InvoiceTemplate5,
};

const InvoicePdfGenerator = ({ data, setIsPreviewModalOpen, handleSubmit }) => {
  const { toastAlert } = useGlobalContext();
  const invoiceRef = useRef();
  const TemplateComponent = templates[data?.invoice_template_no] || null;
  const handleGeneratePDF = async (e, data) => {
    await generatePDF(data, invoiceRef);

    e.preventDefault();

    await axios.put(`${baseUrl}` + `update_attendance`, {
      attendence_id: data.attendence_id,
      month: data.month,
      year: data.year,
      attendence_status_flow: "Pending for invoice verification",
    });

    await axios.post(`${baseUrl}` + `add_finance`, {
      attendence_id: data?.attendence_id,
    });

    await axios.put(`${baseUrl}` + `update_salary`, {
      attendence_id: data?.attendence_id,
      sendToFinance: 1,
    });

    setIsPreviewModalOpen && (await setIsPreviewModalOpen(false));
    handleSubmit && handleSubmit();
    toastAlert("Sent To Finance");
  };

  return (
    <div>
      <div ref={invoiceRef}>
        {TemplateComponent ? (
          <TemplateComponent data={data} />
        ) : (
          <p>No template available</p>
        )}
      </div>
      {data?.digital_signature_image_url && (
        <button
          className="btn btn-secondary"
          onClick={(e) => handleGeneratePDF(e, data)}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default InvoicePdfGenerator;
