import DataTable from "react-data-table-component";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";
import FormContainer from "../../AdminPanel/FormContainer";
import { useEffect, useState } from "react";

const NewAssetRequestOverview = () => {
  const { userID } = useAPIGlobalContext();
  const [managerData, setManagerData] = useState([]);
  const { toastAlert } = useGlobalContext();

  const getManagerData = async () => {
    try {
      const response = await axios.get(
        `http://34.93.221.166:3000/api/show_asset_user_data_report/${userID}`
      );
      const data = response.data.data.filter(
        (d) => d.asset_new_request_status == "Requested"
      );
      setManagerData(data);
      // setManagerData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getManagerData();
  }, []);
  const handleStatusUpdate = (row, status) => {
    console.log(row, status, "status cheqe");
    try {
      axios.put("http://34.93.221.166:3000/api/assetrequest", {
        _id: row.asset_request_id,
        asset_request_status: status,
        request_by: userID,
      });

      toastAlert("Request Success");
      getManagerData();
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
      selector: (row) => row.req_by_name,
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
      name: "Request Date",
      selector: (row) => row.req_date?.split("T")?.[0],
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

  return (
    <>
      <FormContainer submitButton={false} mainTitle="New Asset Request Manager">
        <div className="page_height">
          <div className="card mb-4">
            <div className="data_tbl table-responsive">
              <DataTable
                title="Manager Login and show"
                columns={columns}
                data={managerData}
                fixedHeader
                fixedHeaderScrollHeight="50vh"
                exportToCSV
                highlightOnHover
                subHeader
              />
            </div>
          </div>
        </div>
      </FormContainer>
    </>
  );
};

export default NewAssetRequestOverview;
