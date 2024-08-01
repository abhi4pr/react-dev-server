// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   Cell,
// } from "recharts";
// import Modal from "@mui/material/Modal";
// import Typography from "@mui/material/Typography";
// import { Stack, Tabs, Tab, Box } from "@mui/material";
// import FieldContainer from "../../FieldContainer";
// import axios from "axios";
// import { baseUrl } from "../../../../utils/config";

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//   },
//   {
//     name: "Page C",
//     uv: 6000,
//     pv: 1398,
//   },
//   {
//     name: "Page D",
//     uv: 7000,
//     pv: 1896,
//   },
// ];

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
// };

// export default function WFHDUsersGrapf() {
//   const [open, setOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [tabIndex, setTabIndex] = useState(0);

//   const [graphData, setGraphData] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState("");

//   useEffect(() => {
//     axios
//       .post(baseUrl + "get_user_graph_data_of_wfhd", {
//         caseType: "department_wise",
//       })
//       .then((res) => {
//         setGraphData(res.data);
//       });
//   }, []);

//   const handleFilterChange = async (e) => {
//     const newFilter = e.target ? e.target.value : e;
//     setSelectedFilter(newFilter);
//     await axios
//       .post(baseUrl + "get_user_graph_data_of_wfhd", {
//         caseType: e.target.value,
//       })
//       .then((res) => {
//         setGraphData(res.data);
//       });
//   };

//   const handleOpen = (data) => {
//     setModalData(data);
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleTabChange = (event, newValue) => {
//     setTabIndex(newValue);
//   };

//   return (
//     <div>
//       <div className="col-4">
//         <FieldContainer
//           Tag="select"
//           label="Select Filter"
//           fieldGrid={6}
//           value={selectedFilter}
//           required={false}
//           onChange={(e) => handleFilterChange(e)}
//         >
//           {/* <option value=""> Select To See Graph </option> */}
//           <option value="department_wise"> Department </option>
//           <option value="year"> Joined in year </option>
//           <option value="age"> Age </option>
//         </FieldContainer>
//       </div>

//       <BarChart
//         width={500}
//         height={300}
//         data={graphData}
//         margin={{
//           top: 5,
//           right: 30,
//           left: 20,
//           bottom: 5,
//         }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar
//           dataKey="dept_name"
//           fill="#8884d8"
//           onClick={(entry) => handleOpen(entry)}
//         >
//           {data?.map((entry, index) => (
//             <Cell key={`cell-${index}`} />
//           ))}
//         </Bar>
//         <Bar
//           dataKey="maleCount"
//           label={"ok"}
//           fill="#82ca9d"
//           onClick={(entry) => handleOpen(entry)}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} />
//           ))}
//         </Bar>
//         <Bar
//           dataKey="femaleCount"
//           fill="#FF5733"
//           onClick={(entry) => handleOpen(entry)}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} />
//           ))}
//         </Bar>
//         <Bar
//           dataKey="age"
//           fill="#259DFA"
//           onClick={(entry) => handleOpen(entry)}
//         >
//           {data.map((entry, index) => (
//             <>
//               <Cell key={`cell-${index}`} />
//             </>
//           ))}
//         </Bar>
//         <Bar
//           dataKey="userCount"
//           fill="#82ca9d"
//           onClick={(entry) => handleOpen(entry)}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} />
//           ))}
//         </Bar>
//         <Bar
//           dataKey="userjoined"
//           fill="#B027F5"
//           onClick={(entry) => handleOpen(entry)}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} />
//           ))}
//         </Bar>
//         <Bar
//           dataKey="year"
//           fill="#B027F5"
//           onClick={(entry) => handleOpen(entry)}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} />
//           ))}
//         </Bar>
//       </BarChart>

//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-title"
//         aria-describedby="modal-description"
//       >
//         <Stack sx={style}>
//           <Typography id="modal-title" variant="h6" component="h2">
//             {modalData?.name}
//           </Typography>
//           <Tabs value={tabIndex} onChange={handleTabChange}>
//             {/* <Tab label="UV" />
//             <Tab label="PV" /> */}
//             <Tab label="Department" />
//             <Tab label="Age" />
//           </Tabs>
//           <Box sx={{ mt: 2 }}>
//             {tabIndex === 0 && (
//               <Typography id="modal-description">
//                 UV: {modalData?.uv}
//               </Typography>
//             )}
//             {tabIndex === 1 && (
//               <Typography id="modal-description">
//                 PV: {modalData?.pv}
//               </Typography>
//             )}
//           </Box>
//         </Stack>
//       </Modal>
//     </div>
//   );
// }

import { Autocomplete, Stack, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";


function WFHDUsersGrapf() {
    const [graphData, setGraphData] = useState([]);
  // const { creatorName } = useParams();
  const [viewOption, setViewOption] = useState("male");
  const [state, setState] = useState({
    series: [
      {
        name: "Followers",
        data: [],
      },
    ],
    
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: 'end', // 'around', 'end'
          borderRadiusWhenStacked: 'last', // 'all', 'last'
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          }
        },
      },
      xaxis: {
        type: "number",
        categories: [],
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    },
  });

    useEffect(() => {
    axios
      .post(baseUrl + "get_user_graph_data_of_wfhd", {
        caseType: "department_wise",
      })
      .then((res) => {
        setGraphData(res.data);
      });
  }, []);

  const createSeriesData = (option) => {
    const categoriesdata = [],
      male = [],
      female = [],
      tempmedia = [],
      tempposting = [];

    if (graphData && graphData.length > 0) {
      graphData.forEach((dayData) => {
        if ( dayData.dept_name) {
          categoriesdata.push(dayData.dept_name);

          male.push(dayData.maleCount);
          female.push(dayData.femaleCount);
          // tempmedia.push(dayData.mediaCount);
          // tempposting.push(dayData.todayPostCount);
        }
      });
console.log(categoriesdata,"categoriesdata")
      let selectedData = male ;
      let selectedDatas = female ;
      // if (option === "Followers") {
      //   selectedData = male;
      // } else if (option === "Following") {
      //   selectedData = female;
      // } else if (option === "Media") {
      //   selectedData = tempmedia;
      // } else if (option === "Posting") {
      //   selectedData = tempposting;
      // }

      const apexobj = {
        series: [
          {
            name: "Male",
            data: selectedData,
          },
          {
            name: "Female",
            data: selectedDatas,
          },
        ],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 10,
              borderRadiusApplication: 'end', // 'around', 'end'
              borderRadiusWhenStacked: 'last', // 'all', 'last'
              dataLabels: {
                total: {
                  enabled: true,
                  style: {
                    fontSize: '13px',
                    fontWeight: 900
                  }
                }
              },
              columnWidth: '80px'
            },
          },
          xaxis: {
            type: "number",
            categories: categoriesdata,
          },
          legend: {
            position: 'right',
            offsetY: 40
          },
          fill: {
            opacity: 1
          }
        },
      };
      return apexobj;
    }
  };

  // const handleViewChange = (event, option) => {
  //   if (option) {
  //     setViewOption(option);
  //   }
  // };

  useEffect(() => {
    const apexobject = createSeriesData(viewOption);
    setState(apexobject);
  }, [graphData, viewOption]);

  return (
    <div className="row">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="card">
          <div className="card-body pb0">
           {state && graphData.length > 0 &&  <div className="allSelChart thmChart">
              <Stack direction="row">
                {/* <Autocomplete
                  disablePortal
                  clearIcon={false}
                  sx={{ width: "20%" }}
                  value={viewOption}
                  onChange={handleViewChange}
                  options={["Followers", "Media", "Following", "Posting"]}
                  renderInput={(params) => (
                    <>
                      <TextField {...params} label="Options" />
                    </>
                  )}
                /> */}
              </Stack>
              <ReactApexChart
                options={state.options}
                series={state.series}
                type="bar"
                height={250}
              />
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WFHDUsersGrapf;

