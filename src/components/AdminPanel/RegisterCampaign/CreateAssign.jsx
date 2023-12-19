import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Button,
  TextField,
  Autocomplete,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import CampaignDetailes from "./CampaignDetailes";
import Assigned from "./Assigned";
const CreateAssign = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [allPageData, setAllPageData] = useState([]);
  const [commit, setCommit] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [singlePhaseData, setSinglePhaseData] = useState([]);
  const [expertiseData, setExpertiseData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [getId, setGetId] = useState("");
  const [externalExpert, setExternalExpert] = useState();
  const [loading, setLoading] = useState(false);
  let options = [];
  const Follower_Count = [
    "<10k",
    "10k to 100k ",
    "100k to 1M ",
    "1M to 5M ",
    ">5M ",
  ];
  const getPhaseData = async () => {
    try {
      const response = await axios.get(
        `http://34.93.221.166:3000/api/campaignphase/singlephase/${id}`
      );
      setSinglePhaseData(response?.data?.data?.pages);
      setGetId(response?.data?.data?.pages[0].campaignId);
      setCommit(response?.data?.data?.commitment);
    } catch (error) {
      console.error("Error fetching phase data:", error);
    }
    const pageData = await axios.get(
      `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
    );
    setAllPageData(pageData.data.body);
  };

  const ExpertiseDa = async () => {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/expertise"
      );
      const res = response.data.data;
      setExpertiseData(res);
    } catch {
      console.log("not fatch data");
    }
  };
  const handleSubmitAssign = () => {
    try {
      const createAssignment = axios.post(`http://34.93.221.166:3000/api/assignment`, {
        ass_by: "4444",
        ass_to: expertiseData[0]?.exp_id,
        page: {
          phase_id: singlePhaseData[0]?.phase_id,
          phaseName: singlePhaseData[0]?.phaseName,
          plan_id: singlePhaseData[0]?.plan_id,
          planName: singlePhaseData[0]?.planName,
          vendor_id: singlePhaseData[0]?.vendor_id,
          p_id: singlePhaseData[0]?.p_id,
          postPerPage: singlePhaseData[0]?.postPerPage,
          postRemaining: singlePhaseData[0]?.postRemaining,
          campaignName: singlePhaseData[0]?.campaignName,
          campaignId: getId,
          page_name: singlePhaseData[0]?.page_name,
          cat_name: singlePhaseData[0]?.cat_name,
          platform: singlePhaseData[0]?.platform,
          follower_count: singlePhaseData[0]?.follower_count,
          page_link: singlePhaseData[0]?.page_link,
        },
        ass_status: "assigned",
      });
      console.log(createAssignment,"create assignment");
      navigate("/admin/excusionCampaign");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (externalExpert) {
      const updatedData = singlePhaseData.map((row) => {
        if (selectedRows.includes(row.p_id)) {
          return { ...row, expert: { label: "", value: "" } };
        }
        return row;
      });
      setSinglePhaseData(updatedData);
    }
  }, []);

  useEffect(() => {
    getPhaseData();
    ExpertiseDa();
  }, []);

  const categorySet = () => {
    allPageData?.forEach((data) => {
      if (!options.includes(data.cat_name)) {
        options.push(data.cat_name);
      }
    });
  };
  useEffect(() => {
    if (allPageData.length > 0) {
      categorySet();
    }
  }, [allPageData]);
  const categoryChangeHandler = (e, op) => {
    setSelectedCategory(op);
  };
  const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds);
  };
  const handleExternalExpertChange = (event, newValue) => {
    setExternalExpert(newValue);
    setLoading(true);
    const updatedData = singlePhaseData.map((row) => {
      if (selectedRows.includes(row.p_id)) {
        return {
          ...row,
          expert: newValue
            ? { label: newValue.label, value: newValue.value }
            : null,
        };
      }
      return row;
    });

    setSinglePhaseData(updatedData);
    setLoading(false);
  };

  const handleExpertsChange = (event, newValue, params) => {
    const updatedData = singlePhaseData.map((row) => {
      if (row.p_id === params.row.p_id) {
        return {
          ...row,
          expert: newValue
            ? { label: newValue.label, value: newValue.value }
            : null,
        };
      }
      return row;
    });
    setSinglePhaseData(updatedData);
  };
  const followerChangeHandler = (e, op) => {
    setSelectedFollower(op);
  };
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = singlePhaseData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
      editable: true,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 150,
      editable: true,
    },

    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
      editable: true,
    },
    {
      field: "page_link",
      headerName: "Page Link",
      width: 150,
      editable: true,
    },
    {
      field: "expert",
      headerName: "Experts",
      width: 190,
      renderCell: (params) => {
        return (
          !loading && (
            <Autocomplete
              value={params.row?.expert ? params.row.expert.label : ""}
              isOptionEqualToValue={(option, value) => {
                option.value === value.value && option.value == value.label;
              }}
              options={expertiseData.map((user) => ({
                label: user.exp_name,
                value: user.exp_id,
              }))}
              onChange={(event, newValue) =>
                handleExpertsChange(event, newValue, params)
              }
              renderInput={(params) => <TextField {...params} />}
              fullWidth
            />
          )
        );
      },
    },
    {
      field: "postPerPage",
      headerName: "Post / Page",
      width: 150,
      editable: true,
    },
    {
      field: "postRemaining",
      headerName: "Post Remain",
      width: 150,
      editable: true,
    },
  ];
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>Create Assignment</h2>
        </div>
      </div>
      <Typography variant="h5" component="h5" sx={{ mb: 2 }}>
        Campaign Detailes
      </Typography>
      <CampaignDetailes cid={getId} />
      <Typography
        variant="h5"
        component="h5"
        style={{ marginTop: "10px", marginBottom: "15px" }}
      >
        Phase Detailes
      </Typography>

      <Paper>
        <TextField
          label="Phase "
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{ shrink: true }}
          value={singlePhaseData[0]?.phaseName}
          sx={{ m: 2 }}
        />
        <TextField
          label="plan Name"
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{ shrink: true }}
          value={singlePhaseData[0]?.planName}
          sx={{ m: 2 }}
        />
        {commit?.map((item) => (
          <Box sx={{ display: "flex" }}>
            <TextField
              label="Commitment"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              value={item.commitment}
              sx={{ m: 2 }}
            />
            <TextField
              label="Value"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              value={item.value}
              sx={{ m: 2 }}
            />
          </Box>
        ))}
      </Paper>
      <Box sx={{ display: "flex", m: 2 }}>
        <div className="col-sm-12 col-lg-3">
          <Autocomplete
            value={externalExpert}
            options={expertiseData.map((user) => ({
              label: user.exp_name,
              value: user.exp_id,
            }))}
            onChange={handleExternalExpertChange}
            renderInput={(params) => (
              <TextField {...params} label="External Expert" />
            )}
            fullWidth
          />
        </div>
        <div className="col-sm-12 col-lg-3">
          <Autocomplete
            multiple
            id="combo-box-demo"
            options={options}
            renderInput={(params) => <TextField {...params} label="Category" />}
            onChange={categoryChangeHandler}
          />
        </div>

        <div className="col-sm-12 col-lg-3">
          {" "}
          <Autocomplete
            id="combo-box-demo"
            options={Follower_Count}
            getOptionLabel={(option) => option}
            sx={{ width: 200 }}
            renderInput={(params) => (
              <TextField {...params} label="Follower Count" />
            )}
            onChange={followerChangeHandler}
          />
        </div>
        <Box>
          <Button variant="outlined" onClick={handleOpenModal}>
            {" "}
            Assigned Task
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: loading ? 100 : 500, width: "100%" }}>
        {!loading && (
          <DataGrid
            rows={singlePhaseData}
            columns={columns}
            getRowId={(row) => row.p_id}
            pageSizeOptions={[5]}
            checkboxSelection
            onRowSelectionModelChange={(row) => handleSelectionChange(row)}
            rowSelectionModel={selectedRows.map((row) => row)}
          />
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" sx={{ m: 2 }} onClick={handleSubmitAssign}>
          Create Assignment{" "}
        </Button>
      </Box>
      <Assigned
        open={isModalOpen}
        handleClose={handleCloseModal}
        data={singlePhaseData}
      />
    </>
  );
};

export default CreateAssign;
