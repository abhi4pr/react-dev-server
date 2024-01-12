import { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import DataTable from "react-data-table-component";
import HrVisibleToHrOverview from "./HrVisibleToHrOverview";
import axios from "axios";
import Modal from "react-modal";

const AssetVisibleToHr = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // toggle button
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = [
    "All",
    "Requested",
    "Accept",
    "Recovered",
    "Resolved",
  ];

  useEffect(() => {}, []);

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

  useEffect(() => {
    getData();
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
      <div className="action_heading">
        <div className="action_title">
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
        </div>
      </div>
    </>
  );
};

export default AssetVisibleToHr;
