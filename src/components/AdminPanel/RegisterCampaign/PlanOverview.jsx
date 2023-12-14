import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {  Paper, Button, Box } from "@mui/material";//Tooltip
import DeleteIcon from "@mui/icons-material/Delete";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ReplacePagesModal from "./ReplacePagesModal";
import CampaignDetailes from "./CampaignDetailes";

const PlanOverview = () => {
  const [selectData, setSelectData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const param = useParams();
  const id = param.id;
  console.log(selectData);
  const getSelectPage = async () => {
    const newPlan = await axios.get(
      `http://34.93.221.166:3000/api/campaignplan/${id}`
    );
    setSelectData(newPlan.data.data);
  };

  useEffect(() => {
    getSelectPage();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = selectData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
    },

    {
      field: "cat_name",
      headerName: "Category Name",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower Count",
      width: 150,
    },
    {
      field: "postPerPage",
      headerName: "post / Page",
      width: 150,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      editable: true,
      renderCell: () => {
        return (
          <Button>
            <DeleteIcon />
          </Button>
        );
      },
    },
    {
      field: "replace",
      headerName: "Replace Pages",
      width: 150,
      editable: true,
      renderCell: () => {
        return (
          <Button onClick={handleOpenModal}>
            <PublishedWithChangesIcon />
          </Button>
        );
      },
    },
  ];

  return (
    <Paper>
      <div>
        <div className="form_heading_title">
          <h2 className="form-heading">Plan Overview</h2>
        </div>
      </div>
      <CampaignDetailes cid={id} />
  <Box sx={{ height: 400, width: "100%", mt:2 }}>      <DataGrid
        rows={selectData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.p_id}
      />
      <ReplacePagesModal open={isModalOpen} handleClose={handleCloseModal} />
      </Box>

    </Paper>
  );
};

export default PlanOverview;
