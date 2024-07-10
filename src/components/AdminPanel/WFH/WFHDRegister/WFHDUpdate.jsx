import { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../../FormContainer";
import { useParams, useNavigate } from "react-router-dom";
import UpdateDocument from "../UpdateDocument";
import WFHDRegister from "./WFHDRegister";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";

const normalUserLayout = true;
const WFHDUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUpdaing, setIsUpdating] = useState(false);
  const [user, setUser] = useState({});
  const { toastAlert, toastError } = useGlobalContext();

  // New tab
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["Update WFHD User"];

  const tab1 = <WFHDRegister userUpdateID={id} />;


  return (
    <>
      <div className="action_heading master-card-css">
        <div className="action_title">
          <FormContainer
            submitButton={false}
            mainTitle="Update"
            title=""
            link="admin/wfhd-overview"
          />
        </div>
        <div className="tab">
          {accordionButtons.map((button, index) => (
            <div
              className={`named-tab ${
                activeAccordionIndex === index ? "active-tab" : ""
              }`}
              onClick={() => {
                handleAccordionButtonClick(index);
              }}
            >
              {button}
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header ">
            <h5>{accordionButtons[activeAccordionIndex]}</h5>
          </div>
          <div className="card-body">
            {activeAccordionIndex === 0 && tab1}
            {/* {activeAccordionIndex === 1 && tab2} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default WFHDUpdate;
