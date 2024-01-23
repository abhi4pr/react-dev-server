import DataTable from "react-data-table-component";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";

const NewAssetRequestOverview = ({ newAssetData, handleRelodenewData }) => {
  // const { getAssetDataContext } = useGlobalContext();
  const { userID } = useAPIGlobalContext();
  const { toastAlert } = useGlobalContext();
  const [assetsName, setAssetName] = useState("");
  const [assetStatus, setAssetStatus] = useState("");
  const [row, setRow] = useState("");
  const [getAssetDataContext, setAssetData] = useState([]);

  const handleStatusUpdate = (row, status) => {
    setAssetStatus(status);
    setRow(row);
  };

  async function getShowAssetWithStatus() {
    const res = await axios.get(
      "http://34.93.221.166:3000/api/show_asset_with_status"
    );
    setAssetData(res?.data.data);
  }
  useEffect(() => {
    getShowAssetWithStatus();
  }, []);

  const handleRejectStatus = async (row, status) => {
    try {
      await axios.put("http://34.93.221.166:3000/api/assetrequest", {
        _id: row._id,
        asset_request_status: status,
        request_by: userID,
      });

      handleRelodenewData();
      toastAlert("Request Success");
      newRequestAPIRender();
    } catch (error) {
      console.log(error);
    }
  };
  const handleAssignedSubmit = async () => {
    try {
      await axios.put("http://34.93.221.166:3000/api/assetrequest", {
        _id: row._id,
        asset_request_status: assetStatus,
        request_by: userID,
      });

      await axios.post("http://34.93.221.166:3000/api/add_sim_allocation", {
        user_id: row.request_by,
        status: "Allocated",
        sim_id: assetsName,
        created_by: userID,
      });

      await axios.put("http://34.93.221.166:3000/api/update_sim", {
        id: assetsName,
        status: "Allocated",
      });

      handleRelodenewData();
      toastAlert("Request Success");
      newRequestAPIRender();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      sortable: true,
      width: "80px",
    },
    {
      name: "Requested By",
      selector: (row) => row.request_by_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row?.asset_request_status === "ApprovedByManager" ? (
            <span className="badge badge-warning">ApproveByManager</span>
          ) : row.asset_request_status === "Approved" ? (
            <span className="badge badge-success">Assigned</span>
          ) : row.asset_request_status === "RejectedByManager" ? (
            <span className="badge badge-warning">RejectedByManager</span>
          ) : row.asset_request_status === "Requested" ? (
            <span className="badge badge-danger">Requested</span>
          ) : row.asset_request_status === "Rejected" ? (
            <span className="badge badge-warning">Rejected</span>
          ) : null}
        </>
      ),
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },

    {
      name: "Asset Name",
      selector: (row) => row.sub_category_name,
      sortable: true,
      width: "150px",
    },

    {
      name: "Detail",
      selector: (row) => row.detail,
      sortable: true,
    },
    {
      name: "Request Time",
      selector: (row) => row.date_and_time_of_asset_request?.split("T")?.[0],
      sortable: true,
    },

    newAssetData[0]?.asset_request_status === "ApprovedByManager" ||
      (newAssetData[0]?.asset_request_status === "Requested" && {
        name: "Actions",
        cell: (row) => (
          <>
            <button
              type="button"
              data-toggle="modal"
              data-target="#sidebar-right"
              size="small"
              onClick={() => handleStatusUpdate(row, "Approved")}
              className="btn btn-success btn-sm ml-2"
            >
              Assigned
            </button>
            <button
              type="button"
              data-toggle="modal"
              data-target="#exampleModal1"
              size="small"
              variant="contained"
              color="primary"
              className="btn btn-danger btn-sm ml-2"
              onClick={() => handleRejectStatus(row, "Rejected")}
            >
              Reject
            </button>
          </>
        ),
      }),
  ];

  return (
    <>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="New Asset Request Overview"
              columns={columns}
              data={newAssetData}
              fixedHeader
              fixedHeaderScrollHeight="50vh"
              exportToCSV
              highlightOnHover
              subHeader
            />
          </div>
        </div>
      </div>

      {/* Sidebar Right */}
      <div className="right-modal">
        <div
          className="modal fade right"
          id="sidebar-right"
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true" style={{ marginRight: "250px" }}>
                    ×
                  </span>
                </button>
                <h4 className="modal-title">Assigned By HR</h4>
              </div>
              <div className="modal-body">
                <div className="form-group col-12">
                  <label className="form-label">
                    Asset Name <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={getAssetDataContext.map((opt) => ({
                      value: opt.sim_id,
                      label: opt.assetName,
                    }))}
                    value={{
                      value: assetsName,
                      label:
                        getAssetDataContext.find(
                          (user) => user.sim_id === assetsName
                        )?.assetName || "",
                    }}
                    onChange={(e) => {
                      setAssetName(e.value);
                    }}
                    required
                  />
                </div>
                <button
                  type="button"
                  data-dismiss="modal"
                  className=" btn btn-primary ml-2"
                  onClick={handleAssignedSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewAssetRequestOverview;
