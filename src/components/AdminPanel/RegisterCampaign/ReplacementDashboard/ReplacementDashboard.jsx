import { useState, useEffect } from "react";
import FormContainer from "../../FormContainer";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import { Box, Button, Modal } from "@mui/material";
import ReplacementList from "./replacementList";
import {
  Autocomplete,

} from "@mui/material";

const ReplacementDashboard = () => {

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [replacementData, setReplacementData] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [singleCampaign, setSingleCampaign] = useState(null);


  const getReplacementData = async () => {
    try {

      const replace = await axios.get('http://localhost:3000/api/replacement/plan')
      setReplacementData(replace?.data?.data)

      const getCampaigns = await axios.get('http://34.93.221.166:3000/api/exe_campaign')
      setAllCampaigns(getCampaigns?.data?.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (singleCampaign) {
      const data = replacementData.filter(pages => pages.campaignId = singleCampaign)
      setReplacementData(data)
    }
  }, [singleCampaign])

  const handleCampaignSelect = (id) => {
    setSingleCampaign(id)
  }
  console.log(replacementData)
  console.log(allCampaigns)

  // const ExpertiesData = async () => {
  //   const Experties = await axios.get(
  //     "http://34.93.221.166:3000/api/expertise"
  //   );

  //   // setReplacementData(Experties?.data?.data);
  // };
  useEffect(() => {
    // ExpertiesData();
    getReplacementData()
  }, []);

  const hardRender = () => {
    getReplacementData();
  }
  const tab1 = (
    <ReplacementList replacementData={replacementData.filter(page => page.replacement_status == 'pending')} hardRender={hardRender} />

  );
  const tab2 = (
    <ReplacementList replacementData={replacementData.filter(page => page.replacement_status == "approved")} hardRender={hardRender} />
  );
  const tab3 = (
    <ReplacementList replacementData={replacementData.filter(page => page.replacement_status == 'rejected')} />
  );


  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["Pending", "Approve", "Reject"];

  return (
    <>
      {/* <div className="col-sm-12 col-lg-3">
        {allCampaigns?.length >0 &&
        <Autocomplete
          multiple
          id="combo-box-demo"
          options={allCampaigns}
          renderInput={(params) => (
            <TextField {...params} label="campaign" />
          )}
          // onChange={() => handleCampaignSelect()}
        />
      }
      </div> */}
      <FormContainer
        submitButton={false}
        mainTitle="Replacement Dashboard"
        title=""
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
      >
        {activeAccordionIndex === 0 && tab1}
        {activeAccordionIndex === 1 && tab2}
        {activeAccordionIndex === 2 && tab3}
      </FormContainer>
    </>
  );
};

export default ReplacementDashboard;
