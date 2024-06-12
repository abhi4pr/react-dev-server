import { useState } from 'react'
import FormContainer from '../../FormContainer'
import PageMaster from '../PageMaster';
import PageStats from '../PageStats';

const accordionButtons = ["Edit Page", "Page Health", "Performance"];


export default function EditPage() {
    const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
    const handleAccordionButtonClick = (index) => {
      setActiveAccordionIndex(index);
    };
  return (
    <div>
       <FormContainer
        mainTitle="Page Edit"
        title="Page Edit"
        // handleSubmit={handleSubmit}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        submitButton={false}
      >
        {activeAccordionIndex === 0 && <PageMaster />}
        {activeAccordionIndex === 1 && <PageStats />}
        {/* {activeAccordionIndex === 2 && <PerformanceDashboard />} */}
      </FormContainer>
    </div>
  )
}
