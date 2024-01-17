import DataTable from "react-data-table-component";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";

const NewAssetRequestOverview = ({ newAssetData, handleRelodenewData }) => {
  const { userID } = useAPIGlobalContext();
  const { toastAlert } = useGlobalContext();

  const handleStatusUpdate = (row, status) => {
    console.log(row, status, "status cheqe");
    try {
      axios.put("http://34.93.221.166:3000/api/assetrequest", {
        _id: row._id,
        asset_request_status: status,
        request_by: userID,
      });

      handleRelodenewData();
      console.log(handleRelodenewData(), "call funtion");
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
      selector: (row) => row.asset_request_status,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row.asset_request_status === "Requested" ? (
            <span className="badge badge-danger">Requested</span>
          ) : row.asset_request_status === "Approved" ? (
            <span className="badge badge-success">Assigned</span>
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
      selector: (row) => row.asset_name,
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

    newAssetData[0].asset_request_status == "Requested" && {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            type="button"
            data-toggle="modal"
            data-target="#resolvedModal"
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleStatusUpdate(row, "Approved")}
            className="btn btn-success btn-sm ml-2"
          >
            Approval
          </button>
          <button
            type="button"
            data-toggle="modal"
            data-target="#exampleModal1"
            size="small"
            variant="contained"
            color="primary"
            className="btn btn-danger btn-sm ml-2"
            onClick={() => handleStatusUpdate(row, "Rejected")}
          >
            Reject
          </button>
        </>
      ),
      sortable: true,
    },
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
    </>
  );
};

export default NewAssetRequestOverview;
