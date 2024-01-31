import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import axios from "axios";
import {baseUrl} from '../../../utils/config'

const RequestAssignPage = ({ data, RequestAssign }) => {
  console.log(data[0]?.ass_page?.campaignName, "reuset");
  const processedData = data.map((item) => ({
    ...item,
    campaignName: item?.ass_page?.campaignName,
    pageName: item?.ass_page?.page_name,
    post: item?.ass_page?.postPerPage,
    category: item?.ass_page?.cat_name,
    story: item?.ass_page?.storyPerPage,
  }));

  const handleAccept = async (row) => {
    const x = await axios.post(
      `${baseUrl}`+`preassignment/phase/update`,
      {
        pre_ass_id: row.pre_ass_id,
        status: "accepted",
        phase_id: row.phase_id,
        p_id: row.ass_page.p_id,
      }
    );
    RequestAssign();
  };
  const handleReject = async (row) => {
    const x = await axios.post(
      `${baseUrl}`+`preassignment/phase/update`,
      {
        pre_ass_id: row.pre_ass_id,
        status: "rejected",
        phase_id: row.phase_id,
        p_id: row.ass_page.p_id,
      }
    );
    RequestAssign();
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = processedData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "campaignName",
      headerName: "Campaign",
      width: 150,
    },
    {
      field: "pageName",
      headerName: "Page Name",
      width: 150,
    },
    {
      field: "post",
      headerName: "Post/Page",
      width: 150,
    },
    {
      field: "story",
      headerName: "Story/Page",
      width: 150,
    },

    {
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => (
        <div>
          <Button
            style={{ marginRight: "10px" }}
            onClick={() => handleAccept(params.row)}
            variant="outlined"
            color="secondary"
          >
            Accept
          </Button>
          <Button
            onClick={() => handleReject(params.row)}
            variant="outlined"
            color="error"
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataGrid
        rows={processedData}
        columns={columns}
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default RequestAssignPage;
