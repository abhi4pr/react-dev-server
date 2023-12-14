import React from "react";
import FormContainer from "../AdminPanel/FormContainer";
import { Button, Paper } from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { GridColumnMenu } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function ExecutionDashboard() {
  const [contextData, setContextData] = useState(false);

  const [pagemode, setPagemode] = useState(1);
  const [copiedData, setCopiedData] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [updatePercentage, setSetUpdatePercentage] = useState([]);
  const [rows, setRows] = useState([]);
  const [alldata, setAlldata] = useState([]);
  const [dataLessThan25, setDataLessThan25] = useState([]);
  const [dataLessThan50, setDataLessThan50] = useState([]);
  const [dataLessThan75, setDataLessThan75] = useState([]);
  const [dataLessThan100, setDataLessThan100] = useState([]);
  const [rowData, setRowData] = useState({});
  const [openExeDialog, setOpenExeDialog] = React.useState(false);
  const [statsUpdateFlag, setSetStatsUpdateFlag] = useState([]);
  const [alert, setAlert] = useState([]);
  const [tableData, setTableData] = useState([]);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const navigate = useNavigate();

  const handleClickOpenExeDialog = () => {
    setOpenExeDialog(true);
  };
  const callDataForLoad = () => {
    const formData = new URLSearchParams();
    formData.append("loggedin_user_id", 36);

    axios
      .get("http://34.93.221.166:3000/api/get_all_purchase_data")
      .then((res) => {
        setAlldata(res.data.result);
        let tempdata = res.data.result.filter((ele) => {
          return ele.platform.toLowerCase() == "instagram";
        });
        setRows(tempdata);
        setTableData(tempdata);
        // for (let i = 0; i < tempdata.length; i++) {
        //   axios
        //     .post(`http://34.93.221.166:3000/api/get_percentage`, {
        //       p_id: tempdata[i].p_id,
        //     })
        //     .then((res) => {
        //       if (res.status == 200) {
        //         setSetUpdatePercentage((prev) => [...prev, res.data]);
        //       }
        //     })
        //     .catch((err) => {
        //       console.log(err, `err for ${tempdata[i].p_id}`);
        //       setSetUpdatePercentage((prev) => [
        //         ...prev,

        //         {
        //           latestEntry: {
        //             p_id: +tempdata[i].p_id,
        //           },
        //           totalPercentage: 0,
        //         },
        //       ]);
        //     });
        // }

        // for (let i = 0; i < tempdata.length; i++) {
        //   axios
        //     .get(
        //       `http://34.93.221.166:3000/api/get_stats_update_flag/${tempdata[i].p_id}`
        //     )
        //     .then((res) => {
        //       if (res.status == 200) {
        //         setSetStatsUpdateFlag((prev) => [...prev, res.data]);
        //       }
        //     });
        // }

        // setTimeout(() => {
        //   console.log("called");
        //   percentageDataCal();
        // }, 3000);
      });
  };

  const handleRowClick = (row) => {
    setRowData(row);
    handleClickOpenExeDialog();
  };

  useEffect(() => {
    callDataForLoad();
    if (userID && contextData == false) {
      axios
        .get(
          `http://34.93.221.166:3000/api/get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          if (res.data[33].view_value == 1) {
            setContextData(true);
            setAlert(res.data);
          }
        });
    }
  }, []);
  function CustomColumnMenu(props) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuColumnsItem: null,
        }}
      />
    );
  }

  const handleHistoryRowClick = (row) => {
    navigate(`/admin/exe-history/${row.p_id}`, { state: row.p_id });
  };

  const handleUpdateRowClick = (row) => {
    axios
      .get(`http://34.93.221.166:3000/api/get_exe_ip_count_history/${row.p_id}`)
      .then((res) => {
        let data = res.data.data.filter((e) => {
          return e.isDeleted !== true;
        });
        data = data[data.length - 1];
        navigate(`/admin/exe-update/${data._id}`, { state: row.p_id });
      });
  };

  const percentageDataCal = () => {
    setDataLessThan100([]);
    setDataLessThan75([]);
    setDataLessThan50([]);
    setDataLessThan25([]);
    let temp25 = [];

    for (let i = 0; i < rows.length; i++) {

      if (rows[i].totalPercentage <= 25) {
        temp25.push(rows[i]);
      }
    }
    setDataLessThan25(temp25);

    let temp50 = [];
    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i].totalPercentage > 25 &&
        rows[i].totalPercentage <= 50
      ) {
        temp50.push(rows[i]);
      }
    }

    setDataLessThan50(temp50);

    let temp75 = [];
    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i].totalPercentage > 50 &&
        rows[i].totalPercentage <= 75
      ) {
        temp75.push(rows[i]);
      }
    }

    setDataLessThan75(temp75);

    let temp100 = [];
    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i].totalPercentage > 75 &&
        rows[i].totalPercentage <= 100
      ) {
        temp100.push(rows[i]);
      }
    }
    setDataLessThan100(temp100);

    return temp25;
  };

  setTimeout(() => {

    percentageDataCal();
  }, 1000);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 40,
      renderCell: (params) => {
        const rowIndex = tableData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "platform",
      headerName: "Platform",
      // width: 150,
    },
    pagemode == 1 || pagemode == 2
      ? {
          field: "page_name",
          headerName: "Page Name",
          width: 250,
          renderCell: (params) => {
            const date = params.row.page_link;
            return (
              <div style={{ color: "blue" }}>
                <a href={date} target="blank">
                  {date == "" ? "" : params.row.page_name}
                </a>
              </div>
            );
          },
        }
      : pagemode == 3 || pagemode == 4
      ? {
          field: "account_name",
          headerName: "Account Name",
          // width: 150,
        }
      : {
          field: "channel_username",
          headerName: "Channel Name",
          // width: 150,
        },
    {
      field: "service_name",
      headerName: "Page Type",
      // width: 150,
    },
    {
      field: "cat_name",
      headerName: "Account Category",
      width: 150,
    },
    pagemode == 1 || pagemode == 2
      ? {
          field: "page_link",
          headerName: "Link",
          renderCell: (params) => {
            const date = params.row.page_link;
            return (
              <div style={{ color: "blue" }}>
                <a href={date} target="blank">
                  {date == "" ? "" : "Link"}
                </a>
              </div>
            );
          },
        }
      : pagemode == 3 || pagemode == 4
      ? {
          field: "account_link",
          headerName: "Link",
          renderCell: (params) => {
            const date = params.row.account_link;

            return (
              <div style={{ color: "blue" }}>
                <a href={date} target="blank">
                  {date == "" ? "" : "Link"}
                </a>
              </div>
            );
          },
        }
      : {
          field: "channel_link",
          headerName: "Link",
          renderCell: (params) => {
            const date = params.row.channel_link;
            return (
              <div style={{ color: "blue" }}>
                <a href={date} target="blank">
                  {date == "" ? "" : "Link"}
                </a>
              </div>
            );
          },
        },
    pagemode == 1 || pagemode == 4
      ? {
          field: "follower_count",
          headerName: "Followers",
        }
      : pagemode == 2
      ? ({
          field: "follower_count",
          headerName: "Followers",
        },
        {
          field: "page_likes",
          headerName: "Page Likes",
        })
      : {
          field: "subscribers",
          headerName: "Subscribers",
        },

    contextData && {
      field: "update",
      headerName: "Update",
      width: 130,
      renderCell: (params) => {
  
        const totalPercentage =params.row.totalPercentage

        return (
          <button
            type="button"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#myModal1"
            disabled={totalPercentage == 0 || totalPercentage == 100 ? false : true}
            onClick={() => handleRowClick(params.row)}
          >
            Set Stats
          </button>
        );
      },
    },
    {
      field: "history",
      width: 150,
      headerName: "History",
      renderCell: (params) => {
        return (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleHistoryRowClick(params.row)}
            disabled={
              params?.row?.latestEntry?.stats_update_flag?!params?.row?.latestEntry.stats_update_flag: true
            }
          >
            See History
          </button>
        );
      },
    },
    {
      field: "statsUpdate",
      width: 150,
      headerName: "Stats Update",
      renderCell: (params) => {
        return (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleUpdateRowClick(params.row)}
            disabled={
              params?.row?.latestEntry?.stats_update_flag?!params?.row?.latestEntry.stats_update_flag: true
            }
          >
            Update
          </button>
        );
      },
    },
    {
      field: "Update percentage",
      width: 150,
      headerName: "Stats Update %",
      renderCell: (params) => {
        return Math.round(+params.row.totalPercentage) + "%";
      },
    },
    {
      field: "statsupdateflag ",
      width: 150,
      headerName: "Stats Update Flag",
      renderCell: (params) => {
        const num =
        params?.row?.latestEntry?.stats_update_flag?params?.row?.latestEntry.stats_update_flag: false
        return num ? "Yes" : "No";
      }
    },
  ];

  const handlesetTableDataByPercentage = (data) => {
    // let a = data.map((e) => e.latestEntry.p_id);
    // const matchingData = rows.filter((item) => a.includes(parseInt(item.p_id)));
    // console.log(matchingData, "matchingData")
    setTableData(data);
  };

  return (
    <div>
      <div style={{ width: "100%", margin: "0 0 0 0" }}>
        <FormContainer mainTitle="Dashboard" link="/ip-master" />
        <div className=" m-auto row gap-5">
          <Paper
            elevation={3}
            style={{ padding: "20px", margin: "20px 0 0 0", width: "20%" }}
          >
            <h3 className="h6">Pages Evalution</h3>
            <div className="w-50 m-auto">
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={25} text={`0-25%`} />
              </div>
            </div>
            <p className="fs-5">
              {" "}
              Page Count :-{" "}
              <Button
                // variant="contained"
                color="primary"
                onClick={() => {
                  handlesetTableDataByPercentage(dataLessThan25);
                }}
              >
                {dataLessThan25.length}
              </Button>
            </p>
          </Paper>

          <Paper
            elevation={3}
            style={{ padding: "20px", margin: "20px 0 0 0", width: "20%" }}
          >
            <h3 className="h6">Pages Evalution</h3>
            <div className="w-50 m-auto">
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={50} text={`26-50%`} />
              </div>
            </div>
            <p className="fs-5">
              {" "}
              Page Count :-{" "}
              <Button
                onClick={() => handlesetTableDataByPercentage(dataLessThan50)}
              >
                {dataLessThan50.length}
              </Button>
            </p>
          </Paper>
          <Paper
            elevation={3}
            style={{ padding: "20px", margin: "20px 0 0 0", width: "20%" }}
          >
            <h3 className="h6">Pages Evalution</h3>
            <div className="w-50 m-auto">
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={75} text={`51-75%`} />
              </div>
            </div>
            <p className="fs-5">
              {" "}
              Page Count :-{" "}
              <Button
                onClick={() => handlesetTableDataByPercentage(dataLessThan75)}
              >
                {dataLessThan75.length}
              </Button>
            </p>
          </Paper>

          <Paper
            elevation={3}
            style={{ padding: "20px", margin: "20px 0 0 0", width: "20%" }}
          >
            <h3 className="h6">Pages Evalution</h3>
            <div className="w-50 m-auto">
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={100} text={`76-100%`} />
              </div>
            </div>
            <p className="fs-5">
              {" "}
              Page Count :-{" "}
              <Button
                onClick={() => handlesetTableDataByPercentage(dataLessThan100)}
              >
                {dataLessThan100.length}
              </Button>
            </p>
          </Paper>
        </div>

        <DataGrid
          rows={tableData}
          columns={columns}
          getRowId={(row) => row.p_id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
          pageSizeOptions={[5, 25, 50, 100, 500]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
          unstable_ignoreValueFormatterDuringExport
        />
      </div>
    </div>
  );
}
