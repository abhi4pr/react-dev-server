import DataTable from "react-data-table-component";
import DateISOtoNormal from "../../../utils/DateISOtoNormal";
import { baseUrl } from "../../../utils/config";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";

const ManagerDynamicOverview = ({
  filterData,
  hardRender,
  tabOne,
  tabTwo,
  tabThree,
}) => {
  const { toastAlert } = useGlobalContext();

  const handleStatusUpdate = (row, status) => {
    try {
      axios.put(baseUrl + "assetrequest", {
        _id: row.asset_request_id,
        asset_request_status: status,
        // request_by: userID,
      });

      toastAlert("Request Success");
      hardRender();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRepairStatusUpdate = (row, status) => {
    try {
      axios.put("http://34.93.221.166:3000/api/update_repair_request", {
        repair_id: row.repair_id,
        status: status,
        // request_by: userID,
      });

      toastAlert("Request Success");
      hardRender();
    } catch (error) {
      console.log(error);
    }
  };

  const columnsTab1 = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      sortable: true,
      width: "80px",
    },

    {
      name: "Requested By",
      selector: (row) => row.req_by_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row?.asset_repair_request_status === "Requested" ? (
            <span className="badge badge-danger">Requested</span>
          ) : row.asset_repair_request_status === "Approved" ? (
            <span className="badge badge-success">Assigned</span>
          ) : row.asset_repair_request_status === "Rejected" ? (
            <span className="badge badge-warning">Rejected</span>
          ) : row.asset_repair_request_status === "ApprovedByManager" ? (
            <span className="badge badge-warning">Approve By Manager</span>
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
      selector: (row) => row.problem_detailing,
      sortable: true,
    },
    {
      name: "Request Date",
      selector: (row) => row.repair_request_date_time?.split("T")?.[0],
      sortable: true,
    },

    {
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
            onClick={() => handleRepairStatusUpdate(row, "ApprovedByManager")}
            className="btn btn-success btn-sm ml-2"
          >
            Approval
          </button>
        </>
      ),
      sortable: true,
    },
  ];
  const columnsTab2 = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Request By",
      selector: (row) => row.req_by_name,
      sortable: true,
    },
    {
      name: "Request Date",
      selector: (row) => row.req_date?.split("T")?.[0],
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row?.asset_new_request_status === "Requested" ? (
            <span className="badge badge-danger">Requested</span>
          ) : row.asset_new_request_status === "Approved" ? (
            <span className="badge badge-success">Assigned</span>
          ) : row.asset_new_request_status === "Rejected" ? (
            <span className="badge badge-warning">Rejected</span>
          ) : row.asset_new_request_status === "ApprovedByManager" ? (
            <span className="badge badge-warning">Approve By Manager</span>
          ) : row.asset_new_request_status === "RejectedByManager" ? (
            <span className="badge badge-warning">Reject By Manager</span>
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
    },
    {
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
            onClick={() => handleStatusUpdate(row, "ApprovedByManager")}
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
            onClick={() => handleStatusUpdate(row, "RejectedByManager")}
          >
            Reject
          </button>
        </>
      ),
      sortable: true,
    },
  ];

  const columnsTab3 = [
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
  ];

  //   const activeColumns = tabOne ? columnsTab1 : columnsTab2;
  let activeColumns = [];

  if (tabOne) {
    activeColumns = columnsTab1;
  } else if (tabTwo) {
    activeColumns = columnsTab2;
  } else if (tabThree) {
    activeColumns = columnsTab3;
  }

  return (
    <>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Assets"
              columns={activeColumns}
              data={filterData}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
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

export default ManagerDynamicOverview;
