import html2pdf from "html2pdf.js";
import React from "react";
import ReactDOMServer from "react-dom/server";
import InvoiceTemplate1 from "./InvoiceTemplate1";
import JSZip from "jszip";

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
    console.log("Generated PDF:", pdf); // Log the generated PDF
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
