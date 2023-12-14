import { useEffect, useContext, useState, lazy, Suspense } from "react";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import CircularWithValueLabel from "./CircularWithValueLabel";
// const InstaContext = lazy(() => import("./InstaApiContext"));
import { InstaContext } from "./InstaApiContext";
import axios from "axios";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const now = new Date();

let step = 0;
const InstaPageDashboard = () => {
  const { contextData } = useContext(InstaContext);
  const { creatorName } = useParams();
  const [rows, setRows] = useState([]);
  const [isLoadiing, setLoading] = useState(false);

  // console.log(step);
  let newrow = [];
  // console.log(posts);
  const handlepage = () => {
    axios
      .post("http://34.93.221.166:3000/api/get_posts_from_name", {
        creatorName: creatorName,
      })
      .then((res) => {
        // console.log(res.data);
        const ftrarr = [];

        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].posttype_decision == 0) {
            // console.log("pushed in arr");
            ftrarr.push(res.data[i]);
          }
        }
        console.log(step);
        console.log(ftrarr);
        setRows(ftrarr);
        setLoading(true);
      });
  };
  useEffect(() => {
    handlepage();
  }, [isLoadiing]);

  const other = {
    autoHeight: true,
    showCellVerticalBorder: true,
    showColumnVerticalBorder: true,
    textAlign: "center",
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "S.NO",
      headernewname: "ID",
      width: 50,
      editable: false,

      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        return (
          <div style={{ textAlign: "center", marginLeft: 10 }}>
            {rowIndex + 1}
          </div>
        );
      },
    },
    {
      field: "postedOn",
      headerName: "Date",
      type: "number",
      width: 100,

      renderCell: (params) => {
        const oldDate = params.row.postedOn.split(" ");
        const arr = oldDate[0].toString().split("-");
        const newDate = arr[2] + "-" + arr[1] + "-" + arr[0];
        // date=
        return <div>{newDate}</div>;
      },
    },
    {
      field: "time",
      headerName: "Time",
      type: "number",
      width: 100,
      renderCell: (params) => {
        const oldDate = params.row.postedOn.split(" ");
        const arr = oldDate[1].toString().split(":");
        arr[0] = Number(arr[0]) + 5;
        arr[1] = Number(arr[1]) + 30;
        let newTime = "";
        if (arr[1] > 59) {
          arr[0]++;
          arr[1] = arr[1] - 60;
          if (arr[1] < 10) {
            arr[1] = "0" + arr[1];
          }
        }
        if (arr[0] > 11) {
          arr[0] = arr[0] - 12;
          newTime = arr[0] + ":" + arr[1] + " PM";
        } else {
          newTime = arr[0] + ":" + arr[1] + " AM";
        }
        return <div>{newTime}</div>;
      },
    },

    // {
    //   field: "creatorName",
    //   headerName: "Creator name",
    //   width: 150,
    // },
    {
      field: "postImage",
      headerName: "Post Image",
      width: 200,

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
      field: "postUrl",
      headerName: "Post Url",
      width: 150,
      renderCell: (params) => {
        const url = params.row.postUrl;
        return (
          <div style={{ color: "blue", marginLeft: "40%" }}>
            <a href={url} target="blank">
              Link
            </a>
          </div>
        );
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
          <Link to={`/admin/instaapi/${creatorName}/${params.row.shortCode}`}>
            <GridActionsCellItem
              icon={<ModeEditIcon />}
              label="view"
              color="inherit"
            />
          </Link>,
        ];
      },
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
            <>
              <Link
                to={`https://www.instagram.com/${creatorName}`}
                target="_blank"
              >
                <Stack>
                  <Chip
                    avatar={<Avatar alt={creatorName} src="" />}
                    size="medium"
                    label={creatorName}
                    sx={{
                      height: 50,
                      width: 200,
                      alignSelf: "center",
                      mb: 1,
                      fontSize: 20,
                    }}
                    color="success"
                    variant="contained"
                  />
                </Stack>
              </Link>
              <Paper>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  getRowId={(row) => row._id}
                  rowHeight={120}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 50,
                      },
                    },
                  }}
                  // filterModel={{
                  //   items: [{ field: "postedOn", operator: "=" }],
                  // }}
                  // // slots={{ toolbar: GridToolbar }}
                  // components={{
                  //   Toolbar: () => (
                  //     <div
                  //       style={{
                  //         display: "flex",
                  //         justifyContent: "flex-end",
                  //         // marginBottom: 10,
                  //       }}
                  //     >
                  //       <GridToolbar />
                  //     </div>
                  //   ),
                  // }}
                  pageSizeOptions={[5, 25, 50, 100]}
                  // checkboxSelection
                  disableRowSelectionOnClick
                  // {...other}
                />
              </Paper>
            </>
          ) : (
            <CircularWithValueLabel />
          )}
        </Container>
      </Box>
    </>
  );
};

export default InstaPageDashboard;
