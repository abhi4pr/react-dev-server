import html2pdf from "html2pdf.js";
import React from "react";
import ReactDOMServer from "react-dom/server";
import InvoiceTemplate1 from "../Templates/Component/InvoiceTemplate1";
import InvoiceTemplate2 from "../Templates/Component/InvoiceTemplate2";
import InvoiceTemplate3 from "../Templates/Component/InvoiceTemplate3";
import InvoiceTemplate4 from "../Templates/Component/InvoiceTemplate4";
import InvoiceTemplate5 from "../Templates/Component/InvoiceTemplate5";
import InvoiceTemplate6 from "../Templates/Component/InvoiceTemplate6";
import InvoiceTemplate7 from "../Templates/Component/InvoiceTemplate7";
import InvoiceTemplate8 from "../Templates/Component/InvoiceTemplate8";
import InvoiceTemplate9 from "../Templates/Component/InvoiceTemplate9";
import JSZip from "jszip";

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
  const TemplateComponent = templates[rowData?.invoice_template_no];

  if (!TemplateComponent) {
    console.error(
      "Template not found for invoice_template_no:",
      rowData.invoice_template_no
    );
    return null;
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

  const images = Array.from(element.getElementsByTagName("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        })
    )
  );

  const options = {
    margin: 10,
    filename: `${rowData.user_name}_${rowData.month}_invoice.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, logging: true, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  try {
    const pdf = await html2pdf().from(element).set(options).outputPdf();
    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
};

export const downloadSelectedInvoices = async (data) => {
  const zip = new JSZip();
  const pdfPromises = [];

  for (const row of data) {
    if (row?.invoice_template_no !== "0") {
      const invoicePromise = generatePDF(row);
      pdfPromises.push(invoicePromise);
    }
  }

  try {
    const pdfs = await Promise.all(pdfPromises);

    pdfs.forEach((pdf, index) => {
      if (pdf) {
        const row = data[index];
        const fileName = `${row.user_name}_${row.month}_invoice.pdf`;
        zip.file(fileName, pdf, { binary: true });
      }
    });

    if (Object.keys(zip.files).length > 0) {
      const content = await zip.generateAsync({ type: "blob" });
      const element = document.createElement("a");
      const url = URL.createObjectURL(content);
      element.href = url;
      element.download = "selected_invoices.zip";

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      console.error("No valid PDFs generated to create ZIP.");
    }
  } catch (error) {
    console.error("Error generating ZIP file:", error);
    // Handle any errors in ZIP file creation here
  }
};
