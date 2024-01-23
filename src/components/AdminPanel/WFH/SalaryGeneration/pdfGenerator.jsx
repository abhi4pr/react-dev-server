import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js";
import React from "react";
import InvoiceTemplate1 from "./InvoiceTemplate1";

const templates = {
  1: InvoiceTemplate1,
};

export const generatePDF = async (rowData) => {
  const TemplateComponent = templates[rowData?.invoice_template_no];

  if (!TemplateComponent) {
    console.error(
      "Template not found for invoice_template_no:",
      rowData.invoice_template_no
    );
    return;
  }

  const signatureImageUrl = rowData?.digital_signature_image_url;

  const dataWithImage = {
    ...rowData,
    signatureImageUrl,
  };

  const templateHTML = ReactDOMServer.renderToStaticMarkup(
    <TemplateComponent data={dataWithImage} />
  );

  const element = document.createElement("div");
  element.innerHTML = templateHTML;
  document.body.appendChild(element);

  const images = Array.from(element.getElementsByTagName("img"));
  await Promise.all(
    images.map((img) => {
      if (img.complete) {
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    })
  );

  const options = {
    margin: 10,
    filename: `${rowData.user_name}_${rowData.month}_invoice.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, logging: true, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().from(element).set(options).save();

  document.body.removeChild(element);
};
