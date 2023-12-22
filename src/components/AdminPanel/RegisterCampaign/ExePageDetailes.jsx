import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  borderRadius: "10px",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

const ExePageDetailes = ({
  data,
  setActiveAccordionIndex,
  activeAccordion,
}) => {
  console.log(data, "sAsaSASA");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [singlePhase, setSinglePhase] = useState([]);
  console.log(singlePhase, "new phase");
  const [assignedData, setAssignedData] = useState({});

  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const handleButtonClick = (row) => {
    console.log(row);
    setAssignedData({
      ass_id: row.ass_id,
      campaignId: row.campaignId,
      phase_id: row.phase_id,
    });
    setOpen(true);
  };

  const handleExcute = async () => {
    const response = await axios.get(
      `http://192.168.29.110:3000/api/campaignphase/singlephase/60`
    );
    setSinglePhase(response?.data?.data?.commitment);
    setOpen2(true);
  };

  const handleVerified = () => {
    setActiveAccordionIndex(3);
  };

  const handleAssignedSubmit = async () => {
    const result = await axios.post(
      "http://192.168.29.110:8080/api/assignment/commit",
      assignedData
    );
  };
  const column = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = data?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "page Name",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
    },
    {
      field: "postPerPage",
      headerName: "Post",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => {
        if (activeAccordion == 1) {
          return (
            <Button onClick={() => handleButtonClick(params.row)}>
              Start Execution
            </Button>
          );
        }
        if (activeAccordion == "2") {
          return (
            <div style={{ marginLeft: "5px" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleExcute()}
              >
                update
              </Button>
              <Button variant="outlined" color="secondary">
                Excute
              </Button>
            </div>
          );
        } else if (params.row.ass_status === "verified") {
          return <Button onClick={() => handleVerified()}>res</Button>;
        } else if (params.row.ass_status === "rejected") {
          return <Button onClick={() => handleReject()}>--asdasdasdas-</Button>;
        } else {
          return <Button onClick={() => handleReject()}>--fdgdfg-</Button>;
        }
        // return null;
      },
    },
  ];

  return (
    <>
      <DataGrid
        rows={data}
        columns={column}
        getRowId={(row) => row.p_id}
        pagination
      />
      <>
        {/* frist modal-----------------> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography component="h2" sx={{ padding: "2px" }}>
              Excuation
            </Typography>
            <TextField
              label=" Link"
              type="text"
              onChange={(e) =>
                setAssignedData({ ...assignedData, link: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "8px" }}
              onClick={handleAssignedSubmit}
            >
              Submit
            </Button>
          </Box>
        </Modal>
      </>
      <>
        {/* second modal ============> */}

        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Paper>
              <div className="form-heading">
                <div className="form_heading_title">
                  <h2> Excusion pending </h2>
                </div>
              </div>
            </Paper>
            <Typography>campaign Details</Typography>
            <Box sx={{ display: "flex" }}>
              <TextField
                label="campaign"
                defaultValue="Tiger 3"
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
              />
              <TextField
                label="plan"
                defaultValue="plan name"
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
              />
              <TextField
                label="phase"
                defaultValue="phase 1"
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
              />
            </Box>
            {singlePhase.map((item) => (
              <Box>
                <TextField
                  label="commitment"
                  value={item.commitment}
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="normal"
                />
                <TextField
                  label="value"
                  value={item.value}
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="normal"
                />
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "8px" }}
            // onClick={}
            >
              Submit
            </Button>
          </Box>
        </Modal>
      </>
    </>
  );
};

export default ExePageDetailes;
