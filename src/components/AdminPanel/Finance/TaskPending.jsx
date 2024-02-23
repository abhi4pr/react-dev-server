import React, { useState } from "react";

const accordionButtons = [
  "Zoho",
  "GST",
  "TDS",
  // "TDS",
  // "Non-TDS",
];

export default function TaskPending() {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  return (
    <div>
      {/* {activeAccordionIndex === 2 && (
        // <FormContainer {handleCSVFlieupload}>
        <div className="d-flex">
          <FieldContainer
            // label="Upload UTR"
            type="file"
            fieldGrid={6}
            onChange={(e) => setCSVFile(e.target.files[0])}
          />
          <input
            type="submit"
            value={"Upload utr"}
            className="btn btn-primary h-50 mt-3 "
            disabled={!CSVFile}
          />
        </div>
        // </FormContainer>
      )} */}
    </div>
  );
}
