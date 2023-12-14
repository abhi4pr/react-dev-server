import React from "react";
import { Paper, Typography, Button, Stack } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

import CircularWithValueLabel from "./CircularWithValueLabel";
import { useContext } from "react";
import { InstaContext } from "./InstaApiContext";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";

function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
    </GridToolbarContainer>
  );
}

function InstaAPIHome() {
  const { creatorNames, creator, contextData, setContextData, step } =
    useContext(InstaContext);

  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [filterModel, setFilterModel] = useState({
    items: [
      {
        id: 1,
        field: "_id",
        // value: [5000, 15000],
        // operator: 'between',
      },
    ],
  });

  useEffect(() => {
    setRows(creatorNames);
    setLoading(true);
  }, [creatorNames]);

  const columns = [
    {
      field: "S_NO",
      headerName: "ID",
      width: 50,
      editable: false,
      renderCell: (params) => {
        const rowIndex = creatorNames.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "action_type",
      type: "actions",
      headerName: "Actions",
      width: 200,

      cellClassName: "actions",
      getActions: (params) => {
        if (step == 0) {
          // console.log("selector work", step);
          return [
            <Link to={`/admin/instaapi/${params.row._id}`}>
              <GridActionsCellItem
                icon={
                  <Button variant="outlined" color="error" size="small">
                    {params.row.decision_0_count}
                  </Button>
                }
                label="Delete"
                color=""
              />
            </Link>,
            <GridActionsCellItem
              icon={
                <Button variant="outlined" color="success" size="small">
                  {params.row.decision_1_count}
                </Button>
              }
              label="Delete"
              color=""
            />,
          ];
        } else if (step == 1) {
          // console.log("interpretor", step);
          return [
            <Link to={`/admin/instaapi/interpretor/${params.row._id}`}>
              <GridActionsCellItem
                icon={
                  <Button variant="outlined" color="error" size="small">
                    {params.row.decision_1_count}
                  </Button>
                }
                label="Delete"
                color=""
              />
            </Link>,
            <GridActionsCellItem
              icon={
                <Button variant="outlined" color="success" size="small">
                  {params.row.decision_2_count}
                </Button>
              }
              label="Delete"
              color=""
            />,
          ];
        } else if (step == 2) {
          // console.log("interpretor", step);
          return [
            <Link to={`/admin/instaapi/auditor/${params.row._id}`}>
              <GridActionsCellItem
                icon={
                  <Button variant="outlined" color="error" size="small">
                    {params.row.decision_2_count}
                  </Button>
                }
                label="Delete"
                color=""
              />
            </Link>,
          ];
        } else {
          return [
            <Link to={`/admin/instaapi/all/${params.row._id}`}>
              <GridActionsCellItem
                icon={
                  <Button variant="contained" size="small">
                    {params.row.decision_1_count +
                      params.row.decision_0_count +
                      params.row.decision_2_count}
                  </Button>
                }
                label="Delete"
                color=""
              />
            </Link>,
            <Link to={`/admin/instaapi/analytics/${params.row._id}`}>
              <GridActionsCellItem
                icon={<AnalyticsOutlinedIcon />}
                label="Analytics"
                color="inherit"
              />
            </Link>,
          ];
        }
      },
    },
    {
      field: "_id",
      headerName: "Page name",
      width: 150,
      editable: true,
    },
  ];

  return (
    <>
      {/* <ThemeProvider theme={theme}> */}
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>Pages</h2>
        </div>
      </div>
      {/* {console.log(contextData)} */}
      {isLoading && contextData ? (
        <Paper
          sx={{
            justifyContent: "space-between",
            flexWrap: "wrap",
            flexDirection: "row",
            p: 3,
            mt: 3,
            mb: 4,
          }}
        >
          <Typography sx={{ mb: 1 }}>Insta Page Summary</Typography>
          {/* {console.log(rows)} */}
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 100,
                },
              },
            }}
            slots={{ toolbar: CustomToolbar }}
            slotProps={{
              panel: {
                anchorEl: filterButtonEl,
                // placement: "bottom-end",
              },
              toolbar: {
                setFilterButtonEl,
              },
            }}
            pageSizeOptions={[5, 25, 50, 100]}
            filterModel={filterModel}
            onFilterModelChange={(model) => setFilterModel(model)}
            disableRowSelectionOnClick
          />
        </Paper>
      ) : (
        <CircularWithValueLabel />
      )}
      {/* </ThemeProvider> */}
    </>
  );
}

export default InstaAPIHome;
