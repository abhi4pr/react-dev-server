import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";

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
  const [assignedData, setAssignedData] = useState({});

  const handleClose = () => setOpen(false);

  const handleButtonClick = (row) => {
    console.log(row);
    setAssignedData({
      ass_id: row.ass_id,
      campaignId: row.campaignId,
      phase_id: row.phase_id,
    });
    setOpen(true);
  };
  const handleExcute = () => {
    setOpen(true)
    // setActiveAccordionIndex(2);
  };
  const handleVerified = () => {
    setActiveAccordionIndex(3);
  };

  const handleAssignedSubmit = async () => {
    const result = await axios.post(
      "http://192.168.29.110:8080/api/assignment/commit",
      assignedData
    );
    console.log(result);
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
    // {
    //   field: "",
    //   headerName: "pages",
    //   width: 150,
    // },
    {
      field: "page_name",
      headerName: "page Name",
      width: 150,
    },
    // {
    //   field: "age",
    //   headerName: "Follower Count",
    //   width: 150,
    // },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
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
              <Button onClick={() => handleExcute()}>update</Button>
              <Button>Excute</Button>
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
            {/* <TextField type="file" /> */}
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
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography component="h2" sx={{ padding: "2px" }}>
              Excution Pending
            </Typography>
            {/* <TextField type="file" /> */}
            <TextField
              label=" Link"
              type="text"
              // onChange={(e) =>
              //   setAssignedData({ ...assignedData, link: e.target.value })
              // }
            />

            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "8px" }}
              // onClick={handleAssignedSubmit}
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
