import React, { useState } from "react";
import SaleBookingClose from "./SaleBookingClose";
import SaleBookingVerify from "./SaleBookingVerify";
import FormContainer from "../FormContainer";

const SaleBooking = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const accordionButtons = ["Sale booking close", "Sale Booking Verify"];

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  return (
    <div>
      <FormContainer
        submitButton={false}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        mainTitleRequired={false}
      >
        {activeAccordionIndex === 0 && <SaleBookingClose />}
        {activeAccordionIndex === 1 && <SaleBookingVerify />}
      </FormContainer>
    </div>
  );
};

export default SaleBooking;
