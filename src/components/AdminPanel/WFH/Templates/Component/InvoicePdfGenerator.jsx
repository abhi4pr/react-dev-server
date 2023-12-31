import React, { useRef } from "react";
import InvoiceTemplate1 from "./InvoiceTemplate1";
import { generatePDF } from "../Utils/genratePDF";
import { useGlobalContext } from "../../../../../Context/Context";
import axios from "axios";
const templates = {
  1: InvoiceTemplate1,
};

const InvoicePdfGenerator = ({ data, setIsPreviewModalOpen, handleSubmit }) => {
  const { toastAlert } = useGlobalContext();
  const invoiceRef = useRef();
  const TemplateComponent = templates[data?.invoice_template_no] || null;

  const handleGeneratePDF = async (e, data) => {
    await generatePDF(data, invoiceRef);

    e.preventDefault();

    await axios.put(`http://34.93.221.166:3000/api/update_attendance`, {
      attendence_id: data.attendence_id,
      attendence_status_flow: "Pending for invoice verification",
    });

    await axios.post(`http://34.93.221.166:3000/api/add_finance`, {
      attendence_id: data?.attendence_id,
    });

    await axios.put(`http://34.93.221.166:3000/api/update_salary`, {
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
