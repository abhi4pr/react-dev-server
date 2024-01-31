import React from "react";
import FormContainer from "../AdminPanel/FormContainer";
import { Button, Paper, TextField } from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { GridColumnMenu } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import ContentLoader from "react-content-loader";
import {baseUrl} from '../../utils/config'

export default function ExecutionDashboard() {
  const [contextData, setContextData] = useState(false);
  const [pagemode, setPagemode] = useState(1);
  const [copiedData, setCopiedData] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [rows, setRows] = useState([]);
  const [alldata, setAlldata] = useState([]);
  const [dataLessThan25, setDataLessThan25] = useState([]);
  const [dataLessThan50, setDataLessThan50] = useState([]);
  const [dataLessThan75, setDataLessThan75] = useState([]);
  const [dataLessThan100, setDataLessThan100] = useState([]);
  const [rowData, setRowData] = useState({});
  const [openExeDialog, setOpenExeDialog] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const navigate = useNavigate();

  const handleClickOpenExeDialog = () => {
    setOpenExeDialog(true);
  };

  const formatNumberIndian = (num) => {
    if (!num) return "";
    var x = num.toString();
    var afterPoint = '';
    if(x.indexOf('.') > 0)
       afterPoint = x.substring(x.indexOf('.'),x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res;
  };
  

  const callDataForLoad = () => {
    const formData = new URLSearchParams();
    formData.append("loggedin_user_id", 36);
    setLoading(true);
    axios
      .get(baseUrl+"get_all_purchase_data")
      .then((res) => {
        setAlldata(res.data.result);
        let tempdata = res.data.result.filter((ele) => {
          setLoading(false);
          return ele.platform.toLowerCase() == "instagram";
        });
        setRows(tempdata);
        setTableData(tempdata);
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
          `${baseUrl}`+`get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          if (res.data[33].view_value == 1) {
            setContextData(true);
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
      .get(`${baseUrl}`+`get_exe_ip_count_history/${row.p_id}`)
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
      if (rows[i].totalPercentage > 25 && rows[i].totalPercentage <= 50) {
        temp50.push(rows[i]);
      }
    }

    setDataLessThan50(temp50);

    let temp75 = [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].totalPercentage > 50 && rows[i].totalPercentage <= 75) {
        temp75.push(rows[i]);
      }
    }

    setDataLessThan75(temp75);

    let temp100 = [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].totalPercentage > 75 && rows[i].totalPercentage <= 100) {
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
        }
      : {
          field: "channel_username",
          headerName: "Channel Name",
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
        valueFormatter: (params) => formatNumberIndian(params.value),
      }
      : pagemode == 2
      ? ({
        field: "follower_count",
        headerName: "Followers",
        valueFormatter: (params) => formatNumberIndian(params.value),
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
        const totalPercentage = params.row.totalPercentage;

        return (
          <button
            type="button"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#myModal1"
            disabled={
              totalPercentage == 0 || totalPercentage == 100 ? false : true
            }
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
              params?.row?.latestEntry?.stats_update_flag
                ? !params?.row?.latestEntry.stats_update_flag ||
                  params?.row?.latestEntry?.isDeleted === true
                : true
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
              params?.row?.latestEntry?.stats_update_flag
                ? !params?.row?.latestEntry.stats_update_flag
                : true
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
        const num = params?.row?.latestEntry?.stats_update_flag
          ? params?.row?.latestEntry.stats_update_flag
          : false;
        return num ? "Yes" : "No";
      },
    },
  ];

  const handlesetTableDataByPercentage = (data) => {
    setTableData(data);
  };

  const SkeletonLoading = () => {
    return (
      <ContentLoader
        width={1200}
        height={400}
        viewBox="0 0 1200 400"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="27" y="139" rx="4" ry="4" width="20" height="20" />
        <rect x="67" y="140" rx="10" ry="10" width="85" height="19" />
        <rect x="188" y="141" rx="10" ry="10" width="169" height="19" />
        <rect x="402" y="140" rx="10" ry="10" width="85" height="19" />
        <rect x="523" y="141" rx="10" ry="10" width="169" height="19" />
        <rect x="731" y="139" rx="10" ry="10" width="85" height="19" />
        <rect x="852" y="138" rx="10" ry="10" width="85" height="19" />

        <rect x="26" y="196" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="197" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="198" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="197" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="198" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="196" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="195" rx="10" ry="10" width="85" height="19" />

        <rect x="26" y="258" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="259" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="260" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="259" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="260" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="258" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="257" rx="10" ry="10" width="85" height="19" />

        <rect x="26" y="316" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="317" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="318" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="317" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="318" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="316" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="315" rx="10" ry="10" width="85" height="19" />

        <rect x="26" y="379" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="380" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="381" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="380" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="381" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="379" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="378" rx="10" ry="10" width="85" height="19" />

        <rect x="978" y="138" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="195" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="257" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="315" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="378" rx="10" ry="10" width="169" height="19" />

        <circle cx="37" cy="97" r="11" />
        <rect x="26" y="23" rx="5" ry="5" width="153" height="30" />
        <circle cx="77" cy="96" r="11" />
      </ContentLoader>
    );
  };
  const [searchInput, setSearchInput] = useState("");
  const filterRows = () => {
    const filtered = alldata.filter((row) =>
      row.page_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setTableData(filtered);
  };

  useEffect(() => {
    filterRows();
  }, [searchInput, alldata]);
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
        <>
          <TextField
            label="Search"
            variant="outlined"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
        </>

        {!loading && (
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
        )}
        {loading && <SkeletonLoading />}
      </div>
    </div>
  );
}
