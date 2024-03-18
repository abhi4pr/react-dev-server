import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import FormContainer from "../AdminPanel/FormContainer";
import { baseUrl } from "../../utils/config";
import DateISOtoNormal from "../../utils/DateISOtoNormal";
import Modal from "react-modal";

const RepairRetrunSummary = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);

  async function getData() {
    try {
      const [assetReturnResponse, assetRepairResponse] = await Promise.all([
        axios.get(baseUrl + "get_all_repair_summary_data"),
        axios.get(baseUrl + "get_all_return_summary_data"),
      ]);
      // const response = await axios.get(
      //   baseUrl + "get_summary_of_asset_return"
      //   //"get_summary_for_asset_repair_request"
      // );
      const assetReturns = assetReturnResponse.data.data;
      const assetRepairs = assetRepairResponse.data.data;

      const combieData = [...assetReturns, ...assetRepairs];
      setData(combieData);
      setFilterData(combieData);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  const [returnImageModalOpen, setReturnImageModalOpen] = useState(false);
  const [showReturnImages, setShowReturnImages] = useState("");
  const handleReturnImage = (row) => {
    setShowReturnImages(row);
    setReturnImageModalOpen(true);
  };
  const handleCloseReturnImageModal = () => {
    setReturnImageModalOpen(false);
  };

  const [repairImageModalOpen, setRepairImageModalOpen] = useState(false);
  const [showRepairImages, setShowRepairImages] = useState("");
  const handleRepairImage = (row) => {
    setShowRepairImages(row);
    setRepairImageModalOpen(true);
  };
  const handleCloseRepairImageModal = () => {
    setRepairImageModalOpen(false);
  };

  const columns = [
    {
      name: "S.No",
      // selector: (row) => row.Role_id,
      cell: (row, index) => <div>{index + 1}</div>,
      width: "10%",
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.asset_name,

      sortable: true,
    },

    {
      name: "Asset Return By",
      selector: (row) => row.asset_return_by_name,
    },
    {
      name: "Asset Repair By",
      selector: (row) => row.req_by_name,
    },
    {
      name: "Asset Return Img",
      selector: (row) => (
        <>
          {row?.recover_asset_image_1 && row.recover_asset_image_2 && (
            <>
              {row.recover_asset_image_1 !==
                "https://storage.googleapis.com/dev-backend-bucket/" ||
              row.recover_asset_image_2 !==
                "https://storage.googleapis.com/dev-backend-bucket/" ? (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleReturnImage(row)}
                >
                  <i className="bi bi-images"></i>
                </button>
              ) : (
                "N/A"
              )}
            </>
          )}
        </>
      ),
    },
    {
      name: "Retun Date",
      selector: (row) => row.return_asset_data_time?.split("T")?.[0],
    },
    {
      name: "Retun By Name",
      selector: (row) => row.asset_return_recover_by_name,
    },
    {
      name: "Asset Reocver Img",
      selector: (row) => (
        <>
          {row.recovery_image_upload1 && row.recovery_image_upload2 && (
            <>
              {row.recovery_image_upload1 !==
                "https://storage.googleapis.com/dev-backend-bucket/" ||
              row.recovery_image_upload2 !==
                "https://storage.googleapis.com/dev-backend-bucket/" ? (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleRepairImage(row)}
                >
                  <i className="bi bi-images"></i>
                </button>
              ) : (
                "N/A"
              )}
            </>
          )}
        </>
      ),
    },

    {
      name: "Repair Date",
      selector: (row) => row.repair_request_date_time?.split("T")?.[0],
    },
    {
      name: "Recover By Name",
      selector: (row) => row.recovery_by_name,
    },
    {
      name: "Return Remark",
      selector: (row) => row.asset_return_remark,
    },
    // {
    //   name: "Repair Remark",
    //   selector: (row) => row.recovery_remark,
    // },
  ];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.asset_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  return (
    <>
      {/* <FormContainer mainTitle="Repair & Return" link="" submitButton={false}> */}
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Repair & Return Summary"
            columns={columns}
            data={filterdata}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="62vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>
      {/* </FormContainer> */}

      {/* This is a Retun image modal  */}
      <Modal
        isOpen={returnImageModalOpen}
        onRequestClose={handleCloseReturnImageModal}
        style={{
          content: {
            width: "60%",
            height: "50%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Return Images</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseReturnImageModal}
            >
              X
            </button>
          </div>
        </div>
        <div className="summary_cards flex-row row">
          {typeof showReturnImages?.recover_asset_image_1 === "string" &&
            !showReturnImages.recover_asset_image_1.endsWith("bucket2/") && (
              <div
                className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"
                // onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
              >
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          href={showReturnImages?.recover_asset_image_1}
                          target="blank"
                        >
                          <img
                            src={showReturnImages?.recover_asset_image_1}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {typeof showReturnImages?.recover_asset_image_2 === "string" &&
            !showReturnImages.recover_asset_image_2.endsWith("bucket2/") && (
              <div
                className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"
                // onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
              >
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          href={showReturnImages?.recover_asset_image_2}
                          target="blank"
                        >
                          <img
                            src={showReturnImages?.recover_asset_image_2}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </Modal>

      {/* This is a Repair image modal  */}
      <Modal
        isOpen={repairImageModalOpen}
        onRequestClose={handleCloseRepairImageModal}
        style={{
          content: {
            width: "60%",
            height: "50%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Repair Images</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseRepairImageModal}
            >
              X
            </button>
          </div>
        </div>
        <div className="summary_cards flex-row row">
          {typeof showRepairImages?.recovery_image_upload1 === "string" &&
            !showRepairImages.recovery_image_upload1.endsWith("bucket2/") && (
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          href={showRepairImages?.recovery_image_upload1}
                          target="blank"
                        >
                          <img
                            src={showRepairImages?.recovery_image_upload1}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {typeof showRepairImages?.recovery_image_upload2 === "string" &&
            !showRepairImages.recovery_image_upload2.endsWith("bucket2/") && (
              <div
                className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"
                // onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
              >
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          href={showRepairImages?.recovery_image_upload2}
                          target="blank"
                        >
                          <img
                            src={showRepairImages?.recovery_image_upload2}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </Modal>
    </>
  );
};

export default RepairRetrunSummary;
