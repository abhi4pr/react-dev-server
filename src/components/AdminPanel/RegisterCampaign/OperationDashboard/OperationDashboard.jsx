import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import {baseUrl} from '../../../../utils/config';

const OperationDashboard = () => {
  const countData = [1, 2, 3];
  const today = new Date().toISOString().split("T")[0];

  const [data, setData] = useState([]);
  const [selectDate, setSelectDate] = useState("");
  const [openAccordion, setOpenAccordion] = useState(null);

  const getAllOperationData = async () => {
    try {
      if(selectDate){
        const res = await axios.get(
          `${baseUrl}operation_dashboard_api?date=${selectDate}`
        );
        setData(res.data.data);
      }else{
        const res = await axios.get(
          `${baseUrl}operation_dashboard_api`
        );
        setData(res.data.data);
      }
    } catch (err) {
      console.log(err, "error");
    }
  };

  useEffect(() => {
    getAllOperationData();
  }, [selectDate]);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <>
      <FormContainer
        submitButton={false}
        mainTitle="Operation Dashboard"
        handleSubmit={false}
        link={true}
      ></FormContainer>
      <div>
        <FieldContainer
          type="date"
          fieldGrid={3}
          label="Date"
          value={selectDate}
          onChange={(e) => setSelectDate(e.target.value)}
          // max={today}
          required={false}
        />
        <div className="accordion" id="accordionExample">
          {data.length > 0 &&
            data.map((item, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button
                    className="accordion-button"
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={openAccordion === index ? "true" : "false"}
                    aria-controls={`collapse${index}`}
                  >
                    {index + 1} - {item.registercampaign_Data.campaignName}
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className={`accordion-collapse collapse ${
                    openAccordion === index ? "show" : ""
                  }`}
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <h3>Campaign details</h3>
                    <p>Industry - {item.registercampaign_Data.industry}</p>
                    <p>Agency - {item.registercampaign_Data.agency}</p>
                    <p>Goal - {item.registercampaign_Data.goal}</p>
                    <p>Brand Name - {item.registercampaign_Data.brandData.brand_name}</p>
                    {item?.campaignplansData?.length > 0 ? (
                      <>
                        <h3>Campaign Plan details</h3>
                        {item.campaignplansData.map((item, planIndex) => (
                          <div key={planIndex}>
                            <p>Plan Name - {item.planName}</p>
                            <p>Page name - {item.page_name}</p>
                            <p>post Per Page - {item.postPerPage}</p>
                            <p>Post remaining - {item.postRemaining}</p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p style={{ color: "red" }}>Plan not created yet</p>
                    )}
                    {item.campaignphaseData?.length > 0 ? (
                      <>
                        <h3>Campaign Phase details</h3>
                        {item.campaignphaseData.map((item, phaseIndex) => (
                          <div key={phaseIndex}>
                            <p>Phase Name - {item.phaseName}</p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p style={{ color: "red" }}>Phase not created yet</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default OperationDashboard;
