import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import { TextField, Button, Modal, Typography, Box } from "@mui/material";
import { baseUrl } from "../../../utils/config";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteButton from "../DeleteButton";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useParams } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "60%",
  borderRadius: "10px",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};
const filterRange = [
  { value: "", label: "All" },
  { value: 1, label: "Today" },
  { value: 7, label: " This week" },
  { value: 30, label: "This Month" },
  { value: 12, label: "This Year" },
];
const RegisteredCampaigns = () => {
  const navigate = useNavigate();
  const [allCampaign, setAllCampaign] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [commitmentModalData, setCommitmentModalData] = useState([{}]);
  const [commitment, setCommitment] = useState([]);
  const [filterCampaign, setFilterCampaign] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [count, setCount] = useState();

  const getRegisterCampaign = async () => {
    const res = await axios.get(`${baseUrl}opcampaign`);
    setCount(res.data.length);
    setAllCampaign(res.data);
  };
  const getCommitment = async () => {
    const CommitmentData = await axios.get(`${baseUrl}get_all_commitments`);
    setCommitment(CommitmentData.data.data);
  };
  const getFilterCampaign = async () => {
    const filterCampaign = await axios.post(`${baseUrl}get_filter_campaign`, {
      rangeType: selectedFilter,
    });
  };

  useEffect(() => {
    getFilterCampaign();
  }, [selectedFilter]);
  useEffect(() => {
    getRegisterCampaign();
    getCommitment();
  }, []);

  const handleOpen = (params) => {
    setCommitmentModalData(params.row.commitments);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handlePlan = (event) => {
    const path = `/admin/op-plan-creation/${event._id}`;
    navigate(path);
  };
  const handleShowPlan = (event) => {
    const path = `/admin/op-plan-overview/${event._id}`;
    navigate(path);
  };
  const handlePhase = (event) => {
    const path = `/admin/op-phase-creation/${event._id}`;
    navigate(path);
  };

  const formatString = (s) => {
    let formattedString = s?.replace(/^_+/, "");
    if (formattedString) {
      formattedString = formattedString
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    }
    return formattedString;
  };

  const Column = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = allCampaign.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "Campaign",
      headerName: "Campaign",
      width: 150,
      renderCell: (params) => {
        return formatString(params.row.campaign_data?.exeCmpName) || "N/A";
      },
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 150,
      renderCell: (params) => {
        return formatString(params.row.brand_data?.brand_name) || "N/A";
      },
    },
    {
      field: "created_date",
      headerName: "Date | Time",
      width: 150,
      renderCell: (params) => {
        return new Date(params.row.created_date)
          .toLocaleString("en-GB", { timeZone: "UTC" })
          .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+).*/, "$3/$2/$1 $4");
      },
    },
    {
      field: "Goal",
      headerName: "Goal",
      width: 150,
      renderCell: (params) => {
        return params.row.goal_data?.name || "N/A";
      },
    },
    {
      field: "Industry",
      headerName: "Industry",
      width: 150,
      renderCell: (params) => {
        return params.row.industry_data?.name || "N/A";
      },
    },
    {
      field: "agency_data",
      headerName: "Agency",
      width: 150,
      renderCell: (params) => {
        return params.row.agency_data?.name || "N/A";
      },
    },
    {
      field: "hash_tag",
      headerName: "Hashtag",
      width: 120,
      renderCell: (params) => {
        return formatString(params.row.hash_tag) || "N/A";
      },
    },
    {
      field: "captions",
      headerName: "Caption",
      width: 90,
      renderCell: (params) => {
        return formatString(params.row.captions) || "N/A";
      },
    },
    {
      field: "commits",
      headerName: "Commit",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button
              onClick={() => handleOpen(params)}
              className="icon-1"
              variant="text"
            >
              <i className="bi bi-chat-left-text"></i>
            </button>
          </div>
        );
      },
    },
    {
      field: "plan_creation",
      headerName: "Plan Creation",
      renderCell: (params) => (
        <PlanCreationComponent
          params={params}
          handlePlan={handlePlan}
          handleShowPlan={handleShowPlan}
        />
      ),
      width: 200,
    },
    {
      field: "phase_creation",
      headerName: "Phase Creation",
      renderCell: (params) => (
        <PhaseCreationComponent {...params} handlePhase={handlePhase} />
      ),
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <DeleteButton
            endpoint="opcampaign"
            id={params.row._id}
            getData={getRegisterCampaign}
          />
        );
      },
    },
  ];
  const commitColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 120,
      renderCell: (params) => {
        const rowIndex = commitmentModalData?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "selectValue",
      headerName: "Commits",
      width: 250,
      renderCell: (params) => {
        const commit = commitment.filter(
          (e) => e.cmtId === params.row.selectValue
        )[0];
        return formatString(commit?.cmtName || "N/A");
      },
    },
    {
      field: "textValue",
      headerName: "Value",
      width: 250,
    },
  ];
  // search filter
  const filteredData = allCampaign.filter((item) =>
    item.campaign_data?.exeCmpName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="action_heading master-card-css">
        <div className="action_title">
          <FormContainer
            submitButton={false}
            mainTitle="Vendor Sales Campaign"
            title="Vendor Sales Campaign"
            link="Admin/Registered Campaign"
          />
        </div>
        <div className="action_btns ">
          <Link to="/admin/op-register-campaign">
            <button
              type="button"
              className="btn btn btn_sm btn-outline-primary btn-sm"
            >
              Add campagin{" "}
            </button>
          </Link>
        </div>
      </div>
      <div className="card">
        <div className="card-header sb">
          <h5> Vendor Sales Campaign</h5>
          <div className="pack w-75 gap-4">
            <div className=" border border-danger rounded-pill p-2 ">
              Total Campaign: {count}
            </div>

            <div className="search-bar">
              <div className="form-group col-2">
                <label className="form-label">Filter Range</label>
                <Select
                  options={filterRange.map((option) => ({
                    value: option.value,
                    label: `${option.label}`,
                  }))}
                  onChange={(selectedOption) => {
                    setSelectedFilter(selectedOption.value);
                  }}
                />
              </div>
            </div>
            <TextField
              type="text"
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="card-body body-padding fx-head thm_table">
          <DataGrid
            rows={filteredData}
            columns={Column}
            getRowId={(row) => row?._id}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ padding: "2px" }}
          >
            Commitment
          </Typography>
          <div id="modal-modal-description" className=" mt-4">
            <div className="card">
              <DataGrid
                rows={commitmentModalData}
                columns={commitColumns}
                getRowId={(row) => row?._id}
              />
            </div>
            <button
              className="btn cmnbtn btn-outline-primary btn_sm mt-2"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
export default RegisteredCampaigns;

// plan --
const PlanCreationComponent = ({ params, handlePlan, handleShowPlan }) => {
  const { id } = useParams();
  const [planData, setPlanData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await axios.get(
          // `${baseUrl}` + `campaignplan/${row._id}`
          `${baseUrl}opcampaignplan/${params.row._id}`
        );
        setPlanData(newData);
        console.log(newData, "newData");
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="d-flex text-center align-item-center justify-content-center">
      {planData?.data?.data?.length > 0 ? (
        <Button
          className="btn cmnbtn btn-outline-primary btn_sm"
          variant="outlined"
          onClick={() => handleShowPlan(params.row)}
        >
          Show plan
        </Button>
      ) : (
        <button
          className="icon-1"
          type="button"
          onClick={() => handlePlan(params.row)}
        >
          <i className="bi bi-send"></i>
        </button>
      )}
    </div>
  );
};

// phase --
const PhaseCreationComponent = ({ row, handlePhase }) => {
  const [planData, setPlanData] = useState([]);
  const rowId = row._id;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await axios.get(`${baseUrl}` + `campaignplan/${rowId}`);
        setPlanData(newData);
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };

    fetchData();
  }, [rowId]);

  return (
    <div className="d-flex text-center align-item-center justify-content-center">
      {planData?.data?.data.length > 0 ? (
        <button
          className="icon-1"
          type="button"
          onClick={() => handlePhase(row)}
        >
          <i className="bi bi-send"></i>
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link to={`/admin/op-phase-creation/${rowId}`}><i className="bi bi-send"></i></Link>
        </div>
      )}
    </div>
  );
};
