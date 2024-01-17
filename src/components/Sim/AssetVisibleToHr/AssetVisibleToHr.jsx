import { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import DataTable from "react-data-table-component";
import HrVisibleToHrOverview from "./HrVisibleToHrOverview";
import axios from "axios";
import Modal from "react-modal";
import NewAssetRequestOverview from "./NewAssetRequestOverview";

const AssetVisibleToHr = () => {
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [newAsseRequesttData, setNewAsseRequesttData] = useState([]);

  // Parent Toggle Button section start------------------------------------------------
  const handleAccordionButtonClickParent = (index) => {
    setActiveAccordionIndexParent(index);
  };
  const accordionButtonsParent = ["Repair Asset Request", "New Asset Request"];
  const [activeAccordionIndexParent, setActiveAccordionIndexParent] =
    useState(0);

  const isButton1Active = activeAccordionIndexParent === 0;
  const isButton2Active = activeAccordionIndexParent === 1;

  const accordionButtons1 = ["All", "Requested", "Assigned", "Rejected"];

  const handleRelodenewData = () => {
    getNewAssetData();
  };

  const newAssetTab1 = (
    <NewAssetRequestOverview newAssetData={newAsseRequesttData} />
  );
  const newAssetTab2 = (
    <NewAssetRequestOverview
      newAssetData={newAsseRequesttData.filter(
        (d) => d.asset_request_status == "Requested"
      )}
      handleRelodenewData={handleRelodenewData}
    />
  );
  const newAssetTab3 = (
    <NewAssetRequestOverview
      newAssetData={newAsseRequesttData.filter(
        (d) => d.asset_request_status == "Approved"
      )}
      handleRelodenewData={handleRelodenewData}
    />
  );
  const newAssetTab4 = (
    <NewAssetRequestOverview
      newAssetData={newAsseRequesttData.filter(
        (d) => d.asset_request_status == "Rejected"
      )}
      handleRelodenewData={handleRelodenewData}
    />
  );
  // Parent Toggle Button section End

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = [
    "All",
    "Requested",
    "Accepted",
    "Recovered",
    "Resolved",
  ];

  const [activeAccordionIndex1, setActiveAccordionIndex1] = useState(0);

  // toggle button
  const handleAccordionButtonClick1 = (index) => {
    setActiveAccordionIndex1(index);
  };

  const hardRender = () => {
    return getData();
  };
  const tab1 = (
    <HrVisibleToHrOverview hrOverviewData={data} hardRender={hardRender} />
  );
  const tab2 = (
    <HrVisibleToHrOverview
      hrOverviewData={data.filter((d) => d.status == "Requested")}
      hardRender={hardRender}
    />
  );
  const tab3 = (
    <HrVisibleToHrOverview
      hrOverviewData={data.filter((d) => d.status == "Accept")}
      hardRender={hardRender}
    />
  );
  const tab4 = (
    <HrVisibleToHrOverview
      hrOverviewData={data.filter((d) => d.status == "Recovered")}
      hardRender={hardRender}
    />
  );
  const tab5 = (
    <HrVisibleToHrOverview
      hrOverviewData={data.filter((d) => d.status == "Resolved")}
      hardRender={hardRender}
    />
  );
  const getNewAssetData = () => {
    axios.get("http://34.93.221.166:3000/api/assetrequest").then((res) => {
      setNewAsseRequesttData(res.data.data);
    });
  };
  useEffect(() => {
    getData();
    getNewAssetData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.asset_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  async function getData() {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/show_asset_hr_data"
      );
      setFilterData(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* parent toggle */}
      <FormContainer
        submitButton={false}
        mainTitle=""
        title=""
        accordionButtons={accordionButtonsParent}
        activeAccordionIndex={activeAccordionIndexParent}
        onAccordionButtonClick={handleAccordionButtonClickParent}
      ></FormContainer>
      <div className="action_heading">
        <div className="action_title">
          {isButton1Active && (
            <FormContainer
              submitButton={false}
              mainTitle="Repair Request To Hr"
              title=""
              accordionButtons={accordionButtons}
              activeAccordionIndex={activeAccordionIndex}
              onAccordionButtonClick={handleAccordionButtonClick}
            >
              {activeAccordionIndex === 0 && tab1}
              {activeAccordionIndex === 1 && tab2}
              {activeAccordionIndex === 2 && tab3}
              {activeAccordionIndex === 3 && tab4}
              {activeAccordionIndex === 4 && tab5}
            </FormContainer>
          )}
          {isButton2Active && (
            <FormContainer
              submitButton={false}
              mainTitle="New Asset Request"
              title=""
              accordionButtons={accordionButtons1}
              activeAccordionIndex={activeAccordionIndex1}
              onAccordionButtonClick={handleAccordionButtonClick1}
            >
              {activeAccordionIndex1 === 0 && newAssetTab1}
              {activeAccordionIndex1 === 1 && newAssetTab2}
              {activeAccordionIndex1 === 2 && newAssetTab3}
              {activeAccordionIndex1 === 3 && newAssetTab4}
            </FormContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default AssetVisibleToHr;
