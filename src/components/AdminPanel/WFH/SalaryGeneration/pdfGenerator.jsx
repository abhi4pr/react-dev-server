import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js";
import React from "react";
import InvoiceTemplate1 from "../Templates/Component/InvoiceTemplate1";
import InvoiceTemplate2 from "../Templates/Component/InvoiceTemplate2";
import InvoiceTemplate3 from "../Templates/Component/InvoiceTemplate3";
import InvoiceTemplate4 from "../Templates/Component/InvoiceTemplate4";
import InvoiceTemplate5 from "../Templates/Component/InvoiceTemplate5";
import InvoiceTemplate6 from "../Templates/Component/InvoiceTemplate6";
import InvoiceTemplate7 from "../Templates/Component/InvoiceTemplate7";
import InvoiceTemplate8 from "../Templates/Component/InvoiceTemplate8";
import InvoiceTemplate9 from "../Templates/Component/InvoiceTemplate9";

const templates = {
  1: InvoiceTemplate1,
  2: InvoiceTemplate2,
  3: InvoiceTemplate3,
  4: InvoiceTemplate4,
  5: InvoiceTemplate5,
  6: InvoiceTemplate6,
  7: InvoiceTemplate7,
  8: InvoiceTemplate8,
  9: InvoiceTemplate9,
};

export const generatePDF = async (rowData) => {
  const TemplateComponent = templates[rowData?.invoice_template_no] || null;

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
