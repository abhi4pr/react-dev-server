import { useEffect, useContext, useState, lazy, Suspense } from "react";
import {
  Avatar,
  Box,
  Button,
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
import { InstaInterpretorContext } from "../Interpretor/InterpretorContext";

const now = new Date();

let step = 1;
const InterpretorPageDashboard = () => {
  const { bradcat, agency, brands } = useContext(InstaInterpretorContext);
  const { creatorName } = useParams();
  const [rows, setRows] = useState([]);
  const [isLoadiing, setLoading] = useState(false);
  console.log(bradcat);
  const handlepage = () => {
    axios
      .post("http://34.93.221.166:3000/api/get_posts_from_name", {
        creatorName: creatorName,
      })
      .then((res) => {
        // console.log(res.data);
        const ftrarr = [];
        let count = 1;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].posttype_decision == 1) {
            // // console.log("pushed in arr");
            res.data[i].agency_id = count;
            res.data[i].brand_majorcat_name = bradcat[count - 1];
            count++;
            ftrarr.push(res.data[i]);
          }
        }
        console.log(ftrarr);

        setRows(ftrarr);
        setLoading(true);
      });
  };
  useEffect(() => {
    handlepage();
  }, [isLoadiing]);

  const handlepostcontent = () => {
    console.log(bradcat);
    for (let i = 0; i < bradcat.length - 2; i++) {
      console.log(bradcat[i]);
      axios
        .delete(`http://34.93.221.166:3000/api/delete_brand/${bradcat[i]}`)
        .then((res) => {
          console.log(res.status);
        });
    }
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
      field: "brand_subcat_id",
      headerName: "Cat ID",
      width: 200,
    },
    {
      field: "brand_subcat_name",
      headerName: "Category Name",
      type: "number",
      width: 150,
    },

    // {
    //   field: "allComments",
    //   headerName: "Total Comments",
    //   type: "number",
    //   width: 110,
    // },
    // {
    //   field: "allLike",
    //   headerName: "Total Like",
    //   type: "number",
    //   width: 110,
    // },
    // {
    //   field: "allView",
    //   headerName: "Total Views",
    //   type: "number",
    //   width: 110,
    // },
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
              <Button onClick={handlepostcontent}>Post content</Button>
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
      </Box>
    </>
  );
};

export default InterpretorPageDashboard;
