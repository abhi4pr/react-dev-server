import { useEffect, useContext, useState, lazy, Suspense } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Container,
  Paper,
  Stack,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import axios from "axios";
import { InstaContext } from "../InstaApiContext";
import CircularWithValueLabel from "../CircularWithValueLabel";
import DownloadContent from "../InstaAdmin/DownloadContent";
import InterpretorPostDashboard from "./InterpretorPostDashboard";
const now = new Date();

let step = 1;

const InterpretorPageDashboard = () => {
  const { contextData, set } = useContext(InstaContext);
  const { creatorName } = useParams();
  const [rows, setRows] = useState([]);
  const [filterarr, setfilterarr] = useState([]);
  const [showaction, setShowaction] = useState(true);
  const [isLoadiing, setLoading] = useState(false);
  const [pageview, setPageview] = useState(true);
  const [promotionalpost, setPromotionalpost] = useState(true);
  const [reloadpage, setReloadpage] = useState(false);
  console.log("started from page");
  // let ftrarr = [];
  // let promotionalarray = [];
  // let nonpromotionalarray = [];
  // let notsurearray = [];
  // const handlepage = () => {
  useEffect(() => {
    axios
      .post("http://34.93.221.166:3000/api/get_posts_from_name", {
        creatorName: creatorName,
      })
      .then((res) => {
        console.log("reload");

        const promotionalarray = [];
        const ftrarr = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].posttype_decision == 1) {
            if (res.data[i].selector_decision == 1) {
              promotionalarray.push(res.data[i]);
            }
            // else if (res.data[i].selector_decision == 2) {
            //   nonpromotionalarray.push(res.data[i]);
            // } else {
            //   notsurearray.push(res.data[i]);
            // }
            ftrarr.push(res.data[i]);
          }
        }
        // console.log(promotionalarray);
        // console.log(nonpromotionalarray);

        // console.log(notsurearray);
        setfilterarr(ftrarr);
        setRows(promotionalarray);
        setLoading(true);
      });
    // };

    // handlepage();
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
    showaction && {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        // console.log(params.row);

        return [
          // <Link to={`/admin/instaapi/interpretor/${creatorName}/post`}>

          <GridActionsCellItem
            icon={<ModeEditIcon />}
            onClick={() => setPageview(!pageview)}
            label="view"
            color="inherit"
          />,
          // </Link>,
        ];
      },
    },
  ];

  const handlepromotional = () => {
    const promotionalarray = filterarr.filter((ele) => {
      return ele.selector_decision == 1;
    });
    // console.log(promotionalarray);
    setRows(promotionalarray);
    setPromotionalpost(true);
    setShowaction(true);
  };
  const handlenonpromotional = () => {
    const nonpromotionalarray = filterarr.filter((ele) => {
      return ele.selector_decision == 2;
    });
    // console.log(nonpromotionalarray);
    setRows(nonpromotionalarray);
    setPromotionalpost(false);
    setShowaction(true);
  };
  const handlenotsure = () => {
    const notsurearray = filterarr.filter((ele) => {
      return ele.selector_decision == 3;
    });
    console.log(notsurearray);
    setRows(notsurearray);
    setPromotionalpost(false);
    setShowaction(true);
  };
  const handleallpost = () => {
    setRows(filterarr);
    setShowaction(false);
  };
  return (
    <>
      <Box component="main">
        {pageview ? (
          <Container maxWidth="xl">
            {isLoadiing ? (
              <>
                <Stack
                  sx={{
                    width: 200,
                    // bgcolor: "red",
                    ml: 30,
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <Link
                    to={`https://www.instagram.com/${creatorName}`}
                    target="_blank"
                  >
                    <Chip
                      avatar={<Avatar alt={creatorName} src="" />}
                      size="medium"
                      label={creatorName}
                      sx={{
                        height: 50,

                        alignSelf: "center",

                        mb: 1,
                        fontSize: 20,
                      }}
                      // color="success"
                      variant="contained"
                    />
                  </Link>
                </Stack>
                <Stack>
                  <ButtonGroup
                    variant="contained"
                    aria-label="text button group"
                  >
                    <Button onClick={handlepromotional} sx={{ width: "25%" }}>
                      {/* <Link
                      to={`/admin/instaapi/interpretor/${creatorName}/post`}
                    > */}
                      Promotional
                      {/* </Link> */}
                    </Button>
                    <Button
                      onClick={handlenonpromotional}
                      sx={{ width: "25%" }}
                    >
                      Non Promotional
                    </Button>
                    <Button onClick={handlenotsure} sx={{ width: "25%" }}>
                      Not Sure
                    </Button>
                    <Button onClick={handleallpost} sx={{ width: "25%" }}>
                      All
                    </Button>
                  </ButtonGroup>
                </Stack>
                <Paper>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row._id}
                    rowHeight={110}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 100,
                        },
                      },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    pageSizeOptions={[5, 25, 50, 100]}
                    // checkboxSelection
                    disableRowSelectionOnClick
                  />
                </Paper>
              </>
            ) : (
              <CircularWithValueLabel />
            )}
          </Container>
        ) : (
          <InterpretorPostDashboard
            rows={rows}
            setRows={setRows}
            promotionalpost={promotionalpost}
            // reloadpage={reloadpage}
            // setReloadpage={setReloadpage}
            pageview={pageview}
            setPageview={setPageview}
            isLoadiing={isLoadiing}
            setLoading={setLoading}
          />
        )}
      </Box>
    </>
  );
};

export default InterpretorPageDashboard;
