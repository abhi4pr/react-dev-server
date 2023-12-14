import axios from "axios";
import { useEffect } from "react";
// import AppWebsiteVisits from "../Execution/overview/Overview-website-preview";
import AppWebsiteVisits from "../InstaApi.jsx/Analytics/overview/Overview-website-preview";
import { Avatar, Box, Container, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import CircularWithValueLabel from "./CircularWithValueLabel";

const now = new Date();

let follower = [];
let following = [];
let Post = [];
let NonPaidpost = [];
let Paidpost = [];
const InstaPageDetail = () => {
  // console.log("Post dashboard hitted");
  const { creatorName } = useParams();
  const [rows, setRows] = useState([]);
  const [isLoadiing, setLoading] = useState(false);
  let ftrarr = [];

  useEffect(() => {
    axios
      .post("http://34.93.221.166:3000/api/get_posts_from_name", {
        creatorName: creatorName,
      })
      .then((res) => {
        let count = 1;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].posttype_decision == 2) {
            ftrarr.push(res.data[i]);
            if (Paidpost.length >= 11) {
              Paidpost.shift();
            }
            Paidpost.push(i);
          } else {
            if (NonPaidpost.length >= 11) {
              NonPaidpost.shift();
            }
            NonPaidpost.push(i);
          }
        }
        console.log(Paidpost);
        console.log(NonPaidpost);
        setRows(ftrarr);
        setLoading(true);
      });
  }, []);

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
  ];

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        {isLoadiing ? (
          <Container
            maxWidth="xl"
            sx={{ flexWrap: "wrap", flexDirection: "row" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={4}>
                <AppWebsiteVisits
                  title="Followers Analytics"
                  subheader="(+43%) than last year"
                  chartLabels={[
                    "00:00",
                    "01:00",
                    "02:00",
                    "03:00",
                    "04:00",
                    "05:00",
                    "06:00",
                    "07:00",
                    "08:00",
                    "09:00",
                    "10:00",
                  ]}
                  chartData={[
                    {
                      name: "Followers",
                      type: "area",
                      fill: "gradient",
                      data: follower,
                      //   data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <AppWebsiteVisits
                  title="Following Analytics"
                  subheader="(+43%) than last year"
                  chartLabels={[
                    "00:00",
                    "01:00",
                    "02:00",
                    "03:00",
                    "04:00",
                    "05:00",
                    "06:00",
                    "07:00",
                    "08:00",
                    "09:00",
                    "10:00",
                  ]}
                  chartData={[
                    {
                      name: "Following",
                      type: "area",
                      //   type: "column",
                      fill: "gradient",
                      data: following,
                      //   data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                    },
                  ]}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} lg={4}>
                <AppWebsiteVisits
                  title="Posts Analytics"
                  subheader="(+43%) than last year"
                  chartLabels={[
                    "00:00",
                    "01:00",
                    "02:00",
                    "03:00",
                    "04:00",
                    "05:00",
                    "06:00",
                    "07:00",
                    "08:00",
                    "09:00",
                    "10:00",
                  ]}
                  chartData={[
                    {
                      name: "Post",
                      //   type: "area",
                      type: "column",
                      fill: "gradient",
                      data: Post,
                      //   data: [23, 11, 22, 27, 13, 42, 37, 21, 44, 22, 30],
                    },
                  ]}
                />
              </Grid> */}

              {/* <Grid item xs={12} md={6} lg={12}>
                <AppWebsiteVisits
                  title="Page Analytics"
                  subheader="(+43%) than last year"
                  series: [
                    {
                      name: 'Q1 Budget',
                      group: 'budget',
                      data: [44000, 55000, 41000, 67000, 22000, 43000]
                    },
                    {
                      name: 'Q1 Actual',
                      group: 'actual',
                      data: [48000, 50000, 40000, 65000, 25000, 40000]
                    },
                    {
                      name: 'Q2 Budget',
                      group: 'budget',
                      data: [13000, 36000, 20000, 8000, 13000, 27000]
                    },
                    {
                      name: 'Q2 Actual',
                      group: 'actual',
                      data: [20000, 40000, 25000, 10000, 12000, 28000]
                    }
                  ],
                  options: {
                    chart: {
                      type: 'bar',
                      height: 350,
                      stacked: true,
                    },
                    stroke: {
                      width: 1,
                      colors: ['#fff']
                    },
                    dataLabels: {
                      formatter: (val) => {
                        return val / 1000 + 'K'
                      }
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false
                      }
                    },
                    xaxis: {
                      categories: [
                        'Online advertising',
                        'Sales Training',
                        'Print advertising',
                        'Catalogs',
                        'Meetings',
                        'Public relations'
                      ]
                    },
                    fill: {
                      opacity: 1
                    },
                    colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
                    yaxis: {
                      labels: {
                        formatter: (val) => {
                          return val / 1000 + 'K'
                        }
                      }
                    },
                    legend: {
                      position: 'top',
                      horizontalAlign: 'left'
                    }
                  },
                
                
                };
              }
                />
              </Grid> */}
              <Grid item xs={12} md={6} lg={12}>
                <AppWebsiteVisits
                  title="Page Analytics"
                  subheader="(+43%) than last year"
                  chartLabels={[
                    "00:00",
                    "01:00",
                    "02:00",
                    "03:00",
                    "04:00",
                    "05:00",
                    "06:00",
                    "07:00",
                    "08:00",
                    "09:00",
                    "10:00",
                  ]}
                  chartData={[
                    {
                      name: "Paid",
                      type: "line",
                      fill: "gradient",
                      data: Paidpost,
                      //   data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                    },
                    {
                      name: "Non Paid",
                      //   type: "area",
                      type: "column",
                      fill: "gradient",
                      data: NonPaidpost,
                      //   data: [23, 11, 22, 27, 13, 42, 37, 21, 44, 22, 30],
                    },
                  ]}
                />
              </Grid>
            </Grid>

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
          </Container>
        ) : (
          <CircularWithValueLabel />
        )}
      </Box>
    </>
  );
};

// Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default InstaPageDetail;
