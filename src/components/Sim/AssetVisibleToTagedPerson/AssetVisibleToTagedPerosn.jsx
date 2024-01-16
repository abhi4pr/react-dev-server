import { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import axios from "axios";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import TagedPersonOverview from "./TagedPersonOverview";

const AssetVisibleToTagedPerosn = () => {
  const { userID } = useAPIGlobalContext();
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // New tab
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["Asset Repair Request", "New Asset Request"];

  const tab1 = <TagedPersonOverview filterData={filterData} tabOne="tabOne" />;
  const tab2 = <TagedPersonOverview filterData={filterData} tabTwo="tabTwo" />;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.asset_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://34.93.221.166:3000/api/show_asset_user_data/${userID}`
      );
      setFilterData(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            submitButton={false}
            mainTitle="Taged Asset Request"
            title=""
            accordionButtons={accordionButtons}
            activeAccordionIndex={activeAccordionIndex}
            onAccordionButtonClick={handleAccordionButtonClick}
          >
            {activeAccordionIndex === 0 && tab1}
            {activeAccordionIndex === 1 && tab2}
          </FormContainer>
        </div>
      </div>
    </>
  );
};

export default AssetVisibleToTagedPerosn;
