import { Autocomplete, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { set } from "date-fns";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import { useNavigate } from "react-router-dom";

export default function PagePerformanceAnalytics() {
  const [loading, setLoading] = useState(false);
  const [intervalFlag, setIntervalFlag] = useState({
    label: "Current Month",
    value: "1",
  });
  const [pageHistory, setPageHistory] = React.useState([]);
  const [rowData, setRowData] = useState([]);
  const [followerCountFilter, setFollowerCoutFilter] = useState(0);
  const [reachFilter, setReachFilter] = useState(0);
  const [impressionFilter, setImpressionFilter] = useState(0);
  const [followerCoutnCompareFlag, setFollowerCoutnCompareFlag] = useState({ label: "Greater than", value: ">" });
  const [reachCompareFlag, setReachCompareFlag] = useState({ label: "Greater than", value: ">" });
  const [impressionCompareFlag, setImpressionCompareFlag] = useState({ label: "Greater than", value: ">" });

  const callApi = () => {
    axios
      .post("http://34.93.135.33:8080/api/page_health_dashboard", {
        intervalFlag: intervalFlag.value,
      })
      .then((res) => {
        setPageHistory(res.data.data);
        setRowData(res.data.data);
      });
  };

  useEffect(() => {
    setLoading(true);
    callApi();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (intervalFlag.value === 4) {
      return;
    }
    setLoading(true);
    callApi();
    setLoading(false);
  }, [intervalFlag]);

  const intervalFlagOptions = [
    { label: "Current Month", value: 1 },
    { label: "Last Three months", value: 3 },
    { label: "Last six months", value: 6 },
    { label: "Last one year", value: 10 },
    { label: "All Data", value: 2 },
    { label: "Custom", value: 4 },
  ];

const compareFlagOptions = [
  {label:"Greater than",value:">"},
  {label:"Less than",value:"<"},
  {label:"Equal to",value:"=="},
  {label:"Greater than or Equal to",value:">="},
  {label:"Less than or Equal to",value:"<="},
  {label:"Not Equal to",value:"!="},
]

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      width: 40,
      renderCell: (params) => {
        const rowIndex = pageHistory.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    { field: "page_name", headerName: "Page Name", width: 200 },
    { field: "follower_count", headerName: "Follower Count", width: 200 },
    { field: "maxReach", headerName: "Highest Reach", width: 200 },
    { field: "maxImpression", headerName: "Hightest Impression", width: 200 },
    { field: "maxEngagement", headerName: "Hightest Engagement", width: 200 },
    { field: "maxStoryView", headerName: "Hightest Story view", width: 200 },
    {
      field: "maxStoryViewDate",
      headerName: "Hightest Story view Date",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.maxStoryViewDate ? (
              <>
                {new Date(params.row.maxStoryViewDate)
                  .toISOString()
                  .substr(8, 2)}
                /
                {new Date(params.row.maxStoryViewDate)
                  .toISOString()
                  .substr(5, 2)}
                /
                {new Date(params.row.maxStoryViewDate)
                  .toISOString()
                  .substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    { field: "avgReach", headerName: "Avg Reach", width: 200 },
    { field: "avgImpression", headerName: "Avg Impression", width: 200 },
    { field: "avgEngagement", headerName: "Avg Engagement", width: 200 },
    {
      field: "avgStoryView",
      headerName: "Avg Story view",
      width: 200,
      renderCell: (params) => {
        const storyView = params.row.avgStoryView;
        if (storyView % 1 !== 0) {
          return (
            <>
              <span>{storyView.toFixed(2)}</span>
            </>
          );
        }
        // return <>
        //  <span>{storyView.toFixed(2)}</span>
        //  </>;
      },
    },
    {
      field: "avgStoryViewDate",
      headerName: "Avg Story view Date",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.avgStoryViewDate ? (
              <>
                {new Date(params.row.avgStoryViewDate)
                  .toISOString()
                  .substr(8, 2)}
                /
                {new Date(params.row.avgStoryViewDate)
                  .toISOString()
                  .substr(5, 2)}
                /
                {new Date(params.row.avgStoryViewDate)
                  .toISOString()
                  .substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    { field: "minReach", headerName: "Lowest Reach", width: 200 },
    { field: "minImpression", headerName: "Lowest Impression", width: 200 },
    { field: "minEngagement", headerName: "Lowest Engagement", width: 200 },
    { field: "minStoryView", headerName: "Lowest Story view", width: 200 },
    {
      field: "minStoryViewDate",
      headerName: "Lowest Story view Date",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.minStoryViewDate ? (
              <>
                {new Date(params.row.minStoryViewDate)
                  .toISOString()
                  .substr(8, 2)}
                /
                {new Date(params.row.minStoryViewDate)
                  .toISOString()
                  .substr(5, 2)}
                /
                {new Date(params.row.minStoryViewDate)
                  .toISOString()
                  .substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "top5AgeGroupPercentage",
      headerName: "Top 5 Age Group",
      width: 400,
      renderCell: (params) => {
        const ageGroup = params.row.top5AgeGroupPercentage;
        return (
          <>
            <span>
              <span className="text-danger">{ageGroup[0].ageGroup}</span>={" "}
              <span className="text-success">
                {ageGroup[0].percentage % 1 == 0
                  ? ageGroup[0].percentage
                  : ageGroup[0].percentage.toFixed(2)}
              </span>
              &nbsp;
            </span>
            <span>
              {ageGroup[1].ageGroup}={" "}
              {ageGroup[1].percentage % 1 == 0
                ? ageGroup[1].percentage
                : ageGroup[1].percentage.toFixed(2)}
              &nbsp;{" "}
            </span>
            <span>
              {ageGroup[2].ageGroup}={" "}
              {ageGroup[2].percentage % 1 == 0
                ? ageGroup[2].percentage
                : ageGroup[2].percentage.toFixed(2)}
              &nbsp;{" "}
            </span>
            <span>
              {ageGroup[3].ageGroup}={" "}
              {ageGroup[3].percentage % 1 == 0
                ? ageGroup[3].percentage
                : ageGroup[3].percentage.toFixed(2)}
              &nbsp;{" "}
            </span>
            <span>
              {ageGroup[4].ageGroup}={" "}
              {ageGroup[4].percentage % 1 == 0
                ? ageGroup[4].percentage
                : ageGroup[4].percentage.toFixed(2)}
              &nbsp;{" "}
            </span>
          </>
        );
      },
    },
    {
      field: "avgMalePercent",
      headerName: "Avg Male Per",
      width: 200,
    },
    {
      field: "avgFemalePercent",
      headerName: "Avg Female Per",
      width: 200,
    },
  ];

  const handleFilterFollowerCount = (e) => {

      setFollowerCoutFilter(e.target.value);
      filterData();

  };
  
  const handleFilterReach = (e) => {

      setReachFilter(e.target.value);
      filterData();

  };
  
  const handleFilterImpression = (e) => {

      setImpressionFilter(e.target.value);
      filterData();
    
  };
  
  const filterData = () => {
    const filteredRows = pageHistory.filter((row) => {
      return row.follower_count >= followerCountFilter &&
             row.reach >= reachFilter &&
             row.impression >= impressionFilter;
    });
    console.log(filteredRows);
    setRowData(filteredRows);
};


  return (
    <div>
      <div className="d-flex">
        <Autocomplete
          className="me-2"
          disablePortal
          value={intervalFlag.label}
          defaultValue={intervalFlagOptions[0].label}
          id="combo-box-demo"
          options={intervalFlagOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          onChange={(event, newValue) => {
            if (newValue === null) {
              return setIntervalFlag({ label: "Current Month", value: 1 });
            }
            console.log(newValue);
            setIntervalFlag(newValue);
          }}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Filter Date" />
          )}
        />
        {intervalFlag.value === 4 && (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker onChange={(e) => console.log(e)} label="From" />
            </LocalizationProvider>
            <span className="ms-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker onChange={(e) => console.log(e)} label="To" />
              </LocalizationProvider>
            </span>
          </>
        )}
        <TextField
          label="Follower Count"
          type="number"
          variant="outlined"
          inputProps={{
            min: 0, // minimum value allowed
            step: 1, // only integer increments
            onInput: (e) => {
              // prevent non-numeric input
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            },
          }}
          onChange={handleFilterFollowerCount}
        />
        <Autocomplete
          // className="ms-2"
          disablePortal
          value={followerCoutnCompareFlag.label}
          defaultValue={compareFlagOptions[0].label}
          id="combo-box-demo"
          options={compareFlagOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          onChange={(event, newValue) => {
            if (newValue === null) {
              return setIntervalFlag({ label: "Greater than", value: ">" });
            }
            console.log(newValue);
            setFollowerCoutnCompareFlag(newValue);
          }}
          sx={{ width: 100 }}
          renderInput={(params) => (
            <TextField {...params} />
          )}
        />
        <TextField
          label="Reach"
          type="number"
          variant="outlined"
          inputProps={{
            min: 0, // minimum value allowed
            step: 1, // only integer increments
            onInput: (e) => {
              // prevent non-numeric input
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            },
          }}
          onChange={handleFilterReach}
        />
         <Autocomplete
          // className="ms-2"
          disablePortal
          value={reachCompareFlag.label}
          defaultValue={compareFlagOptions[0].label}
          id="combo-box-demo"
          options={compareFlagOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          onChange={(event, newValue) => {
            if (newValue === null) {
              return setReachCompareFlag({ label: "Greater than", value: ">" });
            }
            console.log(newValue);
            setFollowerCoutnCompareFlag(newValue);
          }}
          sx={{ width: 100 }}
          renderInput={(params) => (
            <TextField {...params} />
          )}
        />
        <TextField
          label="Impression"
          type="number"
          variant="outlined"
          inputProps={{
            min: 0, // minimum value allowed
            step: 1, // only integer increments
            onInput: (e) => {
              // prevent non-numeric input
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            },
          }}
          onChange={handleFilterImpression}
        />
         <Autocomplete
          // className="ms-2"
          disablePortal
          value={impressionCompareFlag.label}
          defaultValue={compareFlagOptions[0].label}
          id="combo-box-demo"
          options={compareFlagOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          onChange={(event, newValue) => {
            if (newValue === null) {
              return setImpressionCompareFlag({ label: "Greater than", value: ">" });
            }
            console.log(newValue);
            setFollowerCoutnCompareFlag(newValue);
          }}
          sx={{ width: 100 }}
          renderInput={(params) => (
            <TextField {...params} />
          )}
        />
      </div>
      {!loading ? (
        <DataGrid
          rows={rowData}
          columns={columns}
          // onRowClick={handleRowClick}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          getRowId={(row) => row._id}
        />
      ) : (
        <ContentLoader
          width={2000}
          height={700}
          viewBox="0 30 2000 700"
          backgroundColor="#f0f0f0"
          foregroundColor="#dedede"
        >
          <rect x="42" y="77" rx="10" ry="10" width="1100" height="600" />
        </ContentLoader>
      )}
    </div>
  );
}
