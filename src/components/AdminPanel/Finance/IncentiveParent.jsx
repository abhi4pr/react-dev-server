import React, { useState } from "react";
import IncentivePayment from "./IncentivePayment";
import GstNongstIncentiveReport from "./GstNongstIncentiveReport";
import FormContainer from "../FormContainer";

const IncentiveParent = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const accordionButtons = [
    "Incentive Disbursement Request",
    "Incentive Report",
  ];
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
        {activeAccordionIndex === 0 && <IncentivePayment />}
        {activeAccordionIndex === 1 && <GstNongstIncentiveReport />}
      </FormContainer>
    </div>
  );
};

export default IncentiveParent;
