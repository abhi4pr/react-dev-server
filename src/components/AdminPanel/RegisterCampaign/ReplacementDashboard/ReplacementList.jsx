import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "60%",
  borderRadius: "10px",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

const ReplacementList = ({ replacementData, hardRender }) => {
  const [replacementDetails, setReplacementDetails] = useState([]);
  const newData = replacementDetails?.newPages;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getReplacementDetail = async (id) => {
    const x = await axios.get(
      `http://localhost:3000/api/replacement/${id}`
    );
    setReplacementDetails(x.data.data);
  };

  const replacementUpdate = async (status, id) => {
    getReplacementDetail(id);

    const data = {
      status,
      replacementRecord:replacementDetails,
      approved_by: "123",
    };

    const result = await axios.post(
      "http://localhost:3000/api/replacement/status",
      data
    );
    if (result.status == 200) {
      hardRender();
    }
  };
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = replacementData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "campaignName",
      headerName: "Campgain Name",
      width: 180,
      sortable: true,
    },

    {
      field: "page_name",
      headerName: "Page Name",
      width: 180,
      sortable: true,
    },
    {
      field: "Replacement",
      headerName: "Replacement",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <Button onClick={() => handleOpen(params)} variant="text">
              <ModeCommentTwoToneIcon />
            </Button>
          </div>
        );
      },
    },
    replacementData[0]?.replacement_status == "pending" && {
      field: "action",
      headerName: "Action",
      width: 210,
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="outlined"
              color="success"
              sx={{ mr: 1 }}
              onClick={() => replacementUpdate("approved", params.id)}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => replacementUpdate("rejected", params.id)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  const handleOpen = (props) => {
    getReplacementDetail(props.id);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="data_tbl" style={{ height: "64vh", width: "100%" }}>
        <DataGrid
          rows={replacementData}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </div>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <Typography variant="h6" component="h5" sx={{ mb: 2, mt: 2 }}>
              Old Page
            </Typography>
            <TextField
              label="Page"
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={replacementDetails.old?.page_name}
              sx={{ ml: 1 }}
            />
            <TextField
              label="Category"
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={replacementDetails.old?.cat_name}
              sx={{ ml: 1 }}
            />
            <TextField
              label="Follower"
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={replacementDetails.old?.follower_count}
              sx={{ ml: 1 }}
            />
          </Box>
          <Typography variant="h6" component="h5" sx={{ mt: 4, mb: 2 }}>
            New Pages
          </Typography>
          {newData && newData.length > 0 && (
            <Box>
              {newData?.map((item) => (
                <Box key={item.p_id}>
                  <TextField
                    label="Page"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    value={item?.page_name}
                    sx={{ mb: 2, ml: 1 }}
                  />
                  <TextField
                    label="category"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    value={item?.cat_name}
                    sx={{ mb: 2, ml: 1 }}
                  />
                  <TextField
                    label="Follower"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    value={item?.follower_count}
                    sx={{ mb: 2, ml: 1 }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ReplacementList;
