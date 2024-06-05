import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField } from "@mui/material";
import { useParams } from "react-router-dom";

const CampPlanOverview = () => {
  const [plan, setPlan] = useState([]);
  const { id } = useParams()
  const getPlan = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}opcampaignplan/${id}`
      );
      setPlan(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlan();
  }, []);

  const handleDelete = (id) => {
    console.log(`Delete row with id: ${id}`);
  };

  const columns = [
    {
      field: "S. no",
      headerName: "S.No",
      width: 90,
      renderCell: (params) => {
        const rowIndex = plan.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    { field: "page_name", headerName: "Page Name ", width: 150 },
    { field: "follower_count", headerName: "Follower Count", width: 120 },
    { field: "page_link", headerName: "Link", width: 250 },
    {
      field: "postPerPage",
      headerName: "Post",
      width: 150,
      renderCell: (params) => {
        return (
          <input
            type="number"
            className="form-control"
            value={params?.row?.postPerPage}
          />
        );
      },
    },
    {
      field: "storyPerPage",
      headerName: "Story",
      width: 150,
      renderCell: (params) => {
        return (
          <input
            className="form-control"
            type="number"
            value={params?.row?.storyPerPage}
          />
        );
      },
    },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            {/* onClick={() => updateSinglePlan(params)}   onClick={() => handleDeleteSinglePlan(params)} */}
            {/* <button className="icon-1" color="primary">
              <i className="bi bi-pencil" />
            </button> */}
            <button className="icon-1" color="error">
              <i className="bi bi-trash" />
            </button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <DataGrid rows={plan} columns={columns} getRowId={(row) => row.p_id} />
    </div>
  );
};

export default CampPlanOverview;
