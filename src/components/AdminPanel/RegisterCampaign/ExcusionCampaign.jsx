import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import ExePageDetailes from "./ExePageDetailes";
import axios from "axios";
import jwtDecode from "jwt-decode";
import RequestAssignPage from "./RequestAssignPage";
import {baseUrl} from '../../../utils/config'

const ExcusionCampaign = () => {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);

  console.log(decodedToken);

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [assignmentData, setAssignmentData] = useState([]);
  console.log(assignmentData, "new");
  // const [pendingData, setPendingData] = useState([]);
  const [executedData, setExecutedData] = useState([]);
  const [verifiedData, setVerifiedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [requestAssign, SetRequestAssign] = useState([]);

  const getExpertee = async () => {
    const expert = await axios.get(
      `${baseUrl}`+`expertise/user/${decodedToken.id}`
    );
    getAssignment(expert.data.data.exp_id);
    console.log(expert);
  };
  useEffect(() => {
    getExpertee();
  }, [activeAccordionIndex]);
  const RequestAssign = async () => {
    const reqAss = await axios.get(
      `${baseUrl}`+`preassignment/${decodedToken.id}`
    );
    const data = reqAss?.data?.data.filter((item) => item.status == "pending");
    SetRequestAssign(data);
  };
  useEffect(() => {
    RequestAssign();
  }, []);
  const getAssignment = async (id) => {
    const getData = await axios.get(
      `${baseUrl}`+`assignment/all/${decodedToken.id}`
    );
    const assigned = getData?.data?.data.filter(
      (item) => item.ass_status == "assigned" || item.ass_status == "pending"
    );
    // const pending = getData?.data?.data.filter(
    //   (item) => item.ass_status == "pending"
    // );
    const excuted = getData?.data?.data.filter(
      (item) => item.ass_status == "executed"
    );
    const verified = getData?.data?.data.filter(
      (item) => item.ass_status == "verified"
    );
    const rejected = getData?.data?.data.filter(
      (item) => item.ass_status == "rejected"
    );
    setAssignmentData(assigned);
    // setPendingData(pending);
    setExecutedData(excuted);
    setVerifiedData(verified);
    setRejectedData(rejected);
  };
  useEffect(() => {
    // getAssignment();
    getExpertee();
  }, []);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const tab1 = (
    <RequestAssignPage data={requestAssign} RequestAssign={RequestAssign} />
  );

  const tab2 = (
    <ExePageDetailes
      data={assignmentData}
      // status={"assigned"}
      // setActiveAccordionIndex={setActiveAccordionIndex}
      setActiveAccordionIndex={setActiveAccordionIndex}
      activeAccordion="1"
      getAssignment={getAssignment}
    />
  );
  // const tab3 = (
  //   <ExePageDetailes
  //     data={pendingData}
  //     status={"assigned"}
  //     setActiveAccordionIndex={setActiveAccordionIndex}
  //     activeAccordion="2"
  //     getAssignment={getAssignment}
  //   />
  // );
  const tab3 = (
    <ExePageDetailes
      data={executedData}
      status={"executed"}
      setActiveAccordionIndex={setActiveAccordionIndex}
      activeAccordion="3"
      getAssignment={getAssignment}
    />
  );
  const tab4 = (
    <ExePageDetailes
      data={verifiedData}
      status={"verified"}
      setActiveAccordionIndex={setActiveAccordionIndex}
      activeAccordion="4"
      getAssignment={getAssignment}
    />
  );
  const tab5 = (
    <ExePageDetailes
      data={rejectedData}
      status={"rejected"}
      setActiveAccordionIndex={setActiveAccordionIndex}
      getAssignment={getAssignment}
    />
  );

  const accordionButtons = [
    "Requested Assign",
    "Assignment",
    // "Pending Excuation",
    "Executed",
    "Verified",
    "Rejected",
  ];
  return (
    <div>
      <FormContainer
        submitButton={false}
        mainTitle="Execution Campaign"
        title="Execution Campaign"
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
      >
        {activeAccordionIndex === 0 && tab1}
        {activeAccordionIndex === 1 && tab2}
        {activeAccordionIndex === 2 && tab3}
        {activeAccordionIndex === 3 && tab4}
        {activeAccordionIndex === 4 && tab5}
        {/* {activeAccordionIndex === 5 && tab6} */}
      </FormContainer>
    </div>
  );
};

export default ExcusionCampaign;
