import { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import DataTable from "react-data-table-component";
import HrVisibleToHrOverview from "./HrVisibleToHrOverview";
import axios from "axios";
import Modal from "react-modal";
import NewAssetRequestOverview from "./NewAssetRequestOverview";
import DateISOtoNormal from "../../../utils/DateISOtoNormal";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const AssetVisibleToHr = () => {
  const { toastAlert } = useGlobalContext();
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [newAsseRequesttData, setNewAsseRequesttData] = useState([]);
  const [returnAssetData, setReturnAssetData] = useState([]);

  // Parent Toggle Button section start------------------------------------------------
  const handleAccordionButtonClickParent = (index) => {
    setActiveAccordionIndexParent(index);
  };
  const accordionButtonsParent = [
    "Repair Asset Request",
    "New Asset Request",
    "Return Asset",
  ];
  const [activeAccordionIndexParent, setActiveAccordionIndexParent] =
    useState(0);

  const isButton1Active = activeAccordionIndexParent === 0;
  const isButton2Active = activeAccordionIndexParent === 1;
  const isButton3Active = activeAccordionIndexParent === 2;

  const accordionButtons1 = ["All", "Requested", "Assigned", "Rejected"];

  const handleRelodenewData = () => {
    getNewAssetData();
  };

  const newAssetTab1 = (
    <NewAssetRequestOverview newAssetData={newAsseRequesttData} />
  );
  const newAssetTab2 = (
    <NewAssetRequestOverview
      newAssetData={newAsseRequesttData?.filter(
        (d) =>
          d.asset_request_status == "ApprovedByManager" ||
          d.asset_request_status == "Requested"
      )}
      handleRelodenewData={handleRelodenewData}
    />
  );
  const newAssetTab3 = (
    <NewAssetRequestOverview
      newAssetData={newAsseRequesttData?.filter(
        (d) => d.asset_request_status == "Approved"
      )}
      handleRelodenewData={handleRelodenewData}
    />
  );
  const newAssetTab4 = (
    <NewAssetRequestOverview
      newAssetData={newAsseRequesttData?.filter(
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
      hrOverviewData={data?.filter(
        (d) => d.status == "Requested" || d.status == "ApprovedByManager"
      )}
      hardRender={hardRender}
    />
  );
  const tab3 = (
    <HrVisibleToHrOverview
      hrOverviewData={data?.filter((d) => d.status == "Accept")}
      hardRender={hardRender}
    />
  );
  const tab4 = (
    <HrVisibleToHrOverview
      hrOverviewData={data?.filter((d) => d.status == "Recovered")}
      hardRender={hardRender}
    />
  );
  const tab5 = (
    <HrVisibleToHrOverview
      hrOverviewData={data?.filter((d) => d.status == "Resolved")}
      hardRender={hardRender}
    />
  );
  const getNewAssetData = () => {
    axios.get(baseUrl+"assetrequest").then((res) => {
      setNewAsseRequesttData(res.data.data);
    });
  };

  const getReturnAssetData = () => {
    axios.get(baseUrl+"assetreturn").then((res) => {
      setReturnAssetData(res.data.singleAssetReturnRequest);
    });
  };
  useEffect(() => {
    getData();
    getNewAssetData();
    getReturnAssetData();
  }, []);

  useEffect(() => {
    const result = data?.filter((d) => {
      return d?.asset_name?.toLowerCase()?.match(search?.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  async function getData() {
    try {
      const response = await axios.get(
        baseUrl+"show_asset_hr_data"
      );
      setFilterData(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleReturnAsset = (row) => {
    try {
      axios.put(baseUrl+"update_sim", {
        id: row.sim_id,
        status: "Available",
      });

      toastAlert("Status Update");
      getReturnAssetData();
    } catch (error) {
      console.log("", error);
    }
  };

  const returnDataColumns = [
    {
      name: "Return By",
      selector: (row) => row.asset_return_by_name,
    },
    {
      name: "Asset Name",
      selector: (row) => row.assetName,
    },
    {
      name: "Return Date",
      selector: (row) => DateISOtoNormal(row.return_asset_data_time),
    },
    {
      name: "Remark",
      selector: (row) => row.asset_return_remark,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="btn btn-outline-success  btn-sm"
            // onClick={() => handleReturnAsset(row)}

            // title="return status approve and this asset status available"
          >
            Recover
          </button>
        </>
      ),
    },
  ];

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
          {isButton3Active && (
            <div className="page_height">
              <div className="card mb-4">
                <div className="data_tbl table-responsive">
                  <DataTable
                    title="Asset Return Request"
                    columns={returnDataColumns}
                    data={returnAssetData}
                    fixedHeader
                    fixedHeaderScrollHeight="64vh"
                    exportToCSV
                    highlightOnHover
                    subHeader
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AssetVisibleToHr;
