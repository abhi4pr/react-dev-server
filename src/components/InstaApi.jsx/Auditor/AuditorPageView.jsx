import { useEffect, useContext, useState, lazy, Suspense } from "react";
import { Box, Container, Paper } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

import axios from "axios";
import { InstaContext } from "../InstaApiContext";
import CircularWithValueLabel from "../CircularWithValueLabel";

const now = new Date();

let step = 2;
const AuditorPageView = () => {
  const { contextData } = useContext(InstaContext);
  const { creatorName } = useParams();
  const [rows, setRows] = useState([]);
  const [isLoadiing, setLoading] = useState(false);

  console.log(step);
  let newrow = [];
  // console.log(posts);
  const handlepage = () => {
    axios
      .post("http://34.93.221.166:3000/api/get_posts_from_name", {
        creatorName: creatorName,
      })
      .then((res) => {
        console.log(res.data);
        const ftrarr = [];

        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].posttype_decision == 2) {
            // console.log("pushed in arr");
            ftrarr.push(res.data[i]);
          }
        }
        console.log(ftrarr);
        // console.log(ftrarr);
        setRows(ftrarr);
        setLoading(true);
      });
  };
  useEffect(() => {
    handlepage();
  }, [isLoadiing]);

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "S.NO",
      headernewname: "ID",
      width: 50,
      editable: false,
      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        // console.log(params.row);

        return [
          <Link
            to={`/admin/instaapi/interpretor/${creatorName}/${params.row.shortCode}`}
          >
            <GridActionsCellItem
              icon={<ListAltOutlinedIcon />}
              label="view"
              color="inherit"
            />
          </Link>,
        ];
      },
    },
    {
      field: "creatorName",
      headerName: "First name",
      width: 150,
    },
    {
      field: "postImage",
      headerName: "Post Image",
      width: 150,

      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.postImage}
          style={{ width: "100%", height: "auto" }}
        />
      ),
    },
    {
      field: "title",
      headerName: "Title",
      type: "number",
      width: 150,
    },
    {
      field: "postedOn",
      headerName: "Date",
      type: "number",
      width: 200,

      renderCell: (params) => {
        const oldDate = params.row.postedOn.split("T");
        const arr = oldDate[0].toString().split("-");
        const newDate = arr[2] + "-" + arr[1] + "-" + arr[0];
        // date=
        return <div>{params.row.postedOn}</div>;
      },
    },
    {
      field: "postUrl",
      headerName: "Post Url",
      width: 150,
      renderCell: (params) => {
        const url = params.row.postUrl;
        return (
          <div>
            <a href={url} target="blank">
              {url}
            </a>
          </div>
        );
      },
    },
    {
      field: "allComments",
      headerName: "Total Comments",
      type: "number",
      width: 110,
    },
    {
      field: "allLike",
      headerName: "Total Like",
      type: "number",
      width: 110,
    },
    {
      field: "allView",
      headerName: "Total Views",
      type: "number",
      width: 110,
    },
  ];
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          //   ml: 0,
        }}
      >
        <Container maxWidth="xl">
          {isLoadiing ? (
            <Paper>
              <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row._id}
                rowHeight={110}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 50,
                    },
                  },
                }}
                slots={{ toolbar: GridToolbar }}
                pageSizeOptions={[5, 25, 50, 100]}
                // checkboxSelection
                disableRowSelectionOnClick
              />
            </Paper>
          ) : (
            <CircularWithValueLabel />
          )}
        </Container>
      </Box>
    </>
  );
};

export default AuditorPageView;
