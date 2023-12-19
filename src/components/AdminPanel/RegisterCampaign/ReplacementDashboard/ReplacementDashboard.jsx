import { useState, useEffect } from "react";
import FormContainer from "../../FormContainer";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import { Box, Button, Modal } from "@mui/material";

const ReplacementDashboard = () => {
  const [open2, setOpen2] = useState(false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [replacementData, setReplacementData] = useState([]);

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
  const handleOpen2 = (params) => {
    setOpen2(true);
    setExpertieAreaData(params.row.area_of_expertise.category);
    setFollowerCount(params.row.area_of_expertise.follower_count);
    setPlatform(params.row.area_of_expertise.platform);
  };
  const handleClose2 = () => setOpen2(false);

  const ExpertiesData = async () => {
    const Experties = await axios.get(
      "http://34.93.221.166:3000/api/expertise"
    );
    console.log(Experties, "replacemnt data hai");
    setReplacementData(Experties?.data?.data);
  };
  useEffect(() => {
    ExpertiesData();
  }, []);

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
      field: "Campgain",
      headerName: "Campgain Name",
      width: 180,
      sortable: true,
    },
    {
      field: "Plan",
      headerName: "Plan Name",
      width: 180,
      sortable: true,
    },
    {
      field: "Phase",
      headerName: "Phase Name",
      width: 180,
      sortable: true,
    },
    {
      field: "Page",
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
            <Button onClick={() => handleOpen2(params)} variant="text">
              <ModeCommentTwoToneIcon />
            </Button>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 210,
      renderCell: (params) => {
        return (
          <div>
            <Button variant="outlined" color="success" sx={{ mr: 1 }}>
              Approve
            </Button>
            <Button variant="outlined" color="error">
              Reject
            </Button>
          </div>
        );
      },
    },
  ];
  const tab1 = (
    <div>
      <div className="data_tbl" style={{ height: "64vh", width: "100%" }}>
        <DataGrid
          rows={replacementData}
          columns={columns}
          getRowId={(row) => row.exp_id}
        />
      </div>
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2>Category</h2>
          {/* {replacementData.map((d) => (
            <h4>{d}</h4>
          ))} */}
          <h2>welocme lalit</h2>
          {/* <h2>Follower Count</h2>
          {followercount.map((d) => (
            <h4>{d}</h4>
          ))}
          <h2>Platform</h2>
          {platform.map((d) => (
            <h4>{d}</h4>
          ))} */}
        </Box>
      </Modal>
    </div>
  );
  const tab2 = "two";
  const tab3 = "three";

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["Pending", "Approve", "Reject"];

  return (
    <FormContainer
      submitButton={false}
      mainTitle="Replacement Dashboard"
      title=""
      accordionButtons={accordionButtons}
      activeAccordionIndex={activeAccordionIndex}
      onAccordionButtonClick={handleAccordionButtonClick}
    >
      {activeAccordionIndex === 0 && tab1}
      {activeAccordionIndex === 1 && tab2}
      {activeAccordionIndex === 2 && tab3}
    </FormContainer>
  );
};

export default ReplacementDashboard;
