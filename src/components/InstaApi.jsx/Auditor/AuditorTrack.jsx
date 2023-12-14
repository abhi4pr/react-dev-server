import React from "react";
import { Button, Chip, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import AuditorHeader from "./AuditorHeader";
import axios from "axios";

function AuditorTrack() {
  const [rows, setRows] = useState([{ page_id: 1, cust_name: "test" }]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [creatorname, setCreatorName] = useState([]);

  const category = new Map();
  category.set(14, "Bollywood");
  category.set(15, "Tollywood");
  category.set(16, "Fitness");
  category.set(17, "Meme Page");
  category.set(18, "Sport Page");
  category.set(19, "Recpmmendation Page");

  // console.log(category);
  useEffect(() => {
    (async () => {
      try {
        const userdata = await axios.get(
          "http://34.93.221.166:3000/api/getallprojectx"
        );

        const ftrrow = [];
        for (let i = 0; i < userdata.data.length; i++) {
          if (userdata.data[i].track == 0) {
            ftrrow.push(userdata[i]);
          }
        }
        setCreatorName(userdata.data);
        setRows(userdata.data);
        console.log(userdata.data);
      } catch (error) {
        // console.log(error);
      }
    })();
  }, []);

  const columns = [
    {
      field: "S.NO",
      headernewname: "ID",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    {
      field: "page_name",
      headerName: "Page name",
      width: 150,
    },
    {
      field: "followers_count",
      headerName: "Followers",
      type: "number",
      width: 110,
    },
    {
      field: "page_category_id",
      headerName: "Category",
      type: "number",
      width: 180,
      renderCell: (params) => {
        let Categoryno = params.row.page_category_id;

        // console.log(typeof category);
        return (
          <div style={{ color: "Green" }}>
            {category.has(Categoryno) ? (
              <Chip label={category.get(Categoryno)} />
            ) : (
              Categoryno
            )}
          </div>
        );
      },
    },

    {
      field: "page_link",
      headerName: "Link",
      renderCell: (params) => {
        const url = params.row.page_link;
        return (
          <div style={{ color: "blue" }}>
            <a href={url} target="blank">
              {url == "" ? "" : "Link"}
            </a>
          </div>
        );
      },
    },
  ];
  const handleCheckBox = () => {
    // console.log("work");
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(13, 110, 253)",
      },
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="form-heading">
          <div className="form_heading_title">
            <h2>Track Creator</h2>
          </div>
        </div>
        <AuditorHeader
          // hm={hm}
          rowSelectionModel={rowSelectionModel}
          setRowSelectionModel={setRowSelectionModel}
          rows={rows}
          setRows={setRows}
          newleadcount={rows.length}
        />
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.page_id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          pageSizeOptions={[5, 25, 100]}
          checkboxSelection
          onRowClick={handleCheckBox}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          isRowSelectable={(params) => params.row.track != 1}
          disableRowSelectionOnClick
          columnBuffer={400}
        />
      </ThemeProvider>
    </>
  );
}

export default AuditorTrack;
