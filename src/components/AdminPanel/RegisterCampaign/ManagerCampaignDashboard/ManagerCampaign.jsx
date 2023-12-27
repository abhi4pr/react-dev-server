import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import axios from "axios";
import { data } from "jquery";
import NewPages from "./NewPages";

const ManagerCampaign = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [newPages, setNewPages] = useState([]);

    const Assigndata = async () => {
      try {
        const response = await axios.get(
          `http://34.93.221.166:3000/api/register_campaign`
        );
        console.log(response?.data?.data,"new camp data");
        setNewPages(response?.data?.data)
      } catch (error) {
        console.error(error);
      }
    };
    useEffect(() => {
      Assigndata();
    }, []);

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const tab1 = <NewPages pages={newPages}/>;
  const tab2 = "OldPages";

  const accordionButtons = ["NewPages", "OldPages"];

  return (
    <>
      <FormContainer
        submitButton={false}
        mainTitle="Manager All Campaign"
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
      >
        {activeAccordionIndex === 0 && tab1}
        {activeAccordionIndex === 1 && tab2}
      </FormContainer>
    </>
  );
};

export default ManagerCampaign;
