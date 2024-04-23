import { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import SalesDashboard from "./SalesDashboard";
import PurchaseDashboard from "./PurchaseDashboard";

export default function FinanceDashboard() {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const accordionButtons = ["Sales Dashboard", "Purchase Dashboard"];

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  return (
    <div>
      <FormContainer
        mainTitle="Finance Dashboard"
        link="/admin/finance-dashboard"
      />
      <FormContainer
        submitButton={false}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        mainTitleRequired={false}
      >
        {activeAccordionIndex === 0 && <SalesDashboard />}
        {activeAccordionIndex === 1 && <PurchaseDashboard />}
      </FormContainer>
    </div>
  );
}
