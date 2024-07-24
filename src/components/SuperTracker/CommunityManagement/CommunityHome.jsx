import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Skeleton,
  Stack,
  Tab,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import clsx from "clsx";
import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import LogoLoader from "../../InstaApi.jsx/LogoLoader";
import CommunityTeamCreation from "./CommunityTeamCreation";
import { ApiContextData } from "../../AdminPanel/APIContext/APIContext";
import formatString from "../../../utils/formatString";
import CommunityHeader from "./CommunityHeader";
import { formatNumber } from "../../../utils/formatNumber";
import TableSkeleton from "../../CommonTool/TableSkeleton";
import DatePickerCf from "../../CommonTool/DatePickerCf";
import { TabContext, TabList } from "@mui/lab";
import dayjs from "dayjs";
import { formatDate } from "../../../utils/formatDate";
import { formatUTCDate } from "../../../utils/formatUTCDate";

function CustomToolbar({
  setFilterButtonEl,
  setOpenTeam,
  rowSelectionModel,
  setLeft,
  setRight,
  setSelectedManager,
  setUserNumbers,
  setEditMode,setTeamDetail
}) {
  const { userContextData } = useContext(ApiContextData);

  const handleTeam = useCallback(async () => {
    if (rowSelectionModel.length === 0) {
      alert("Please select the Page first.");
      return;
    } else if (rowSelectionModel.length > 1) {
      alert("Please select only one Page.");
      return;
    }
    const pageName = rowSelectionModel[0].toLowerCase();
    try {
      const res = await axios.get(
        `https://insights.ist:8080/api/v1/community/team_by_page_name/${pageName}`
      );
      if (res.data.success) {

        alert("Team is already created for this page.");
      } else {
        
       
        setOpenTeam(true);
      }
      
    } catch (error) {
      console.log(error);
    }
  }, [rowSelectionModel, setOpenTeam]);

  const handleEditTeam = useCallback(async () => {
    if (rowSelectionModel.length === 0) {
      alert("Please select the Page first.");
      return;
    } else if (rowSelectionModel.length > 1) {
      alert("Please select only one Page.");
      return;
    }
    const pageName = rowSelectionModel[0].toLowerCase();
    try {
      const response = await axios.get(
        `https://insights.ist:8080/api/v1/community/team_by_page_name/${pageName}`
      );
      if (!response.data.success) {
        alert("Team is not created yet.");
      } else {
        const res = await axios.post(
          `https://insights.ist:8080/api/v1/community/team_users`,
          { page_name: pageName }
        );
        const teamData = res.data.data;
        const tempUserNumber = {};
        const detailedTeamData = teamData.map((teamUser) => {
          const userDetails = userContextData?.find(
            (user) => user.user_id === teamUser.user_id
          );
          tempUserNumber[teamUser.user_id] = teamUser?.cost_of_running;
          return {
            ...teamUser,
            ...userDetails,
            teamID: response.data.data?._id,
          };
        });
        setUserNumbers(tempUserNumber);
        const manager = detailedTeamData?.find((user) => user.role === 1);
        if (manager) setSelectedManager(manager);
        setRight(detailedTeamData);
        setTeamDetail(response.data.data);
        setOpenTeam(true);
        setEditMode(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    rowSelectionModel,
    setEditMode,
    setOpenTeam,
    setRight,
    setSelectedManager,
    setUserNumbers,
    userContextData,
  ]);

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <Button variant="contained" onClick={handleTeam}>
        Create Team
      </Button>
      <Button variant="contained" onClick={handleEditTeam}>
        Show/Edit Team
      </Button>
    </GridToolbarContainer>
  );
}

function CommunityHome() {
  const { userContextData } = useContext(ApiContextData);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [reload, setReload] = useState(true);
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [openTeam, setOpenTeam] = useState(false);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [userNumbers, setUserNumbers] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [overViewvalue, setOverViewValue] = useState(2);
  const [filterModel, setFilterModel] = useState({
    items: [{ id: 1, field: "creatorName", operator: "contains" }],
  });
  const [pagecategory, setPageCategory] = useState([]);
  const [reloadpagecategory, setReloadpagecategory] = useState(false);
  const [projectxpages, setProjectxpages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [teamDetail,setTeamDetail] = useState(null)
  const minSelectableDate = dayjs("2023-11-01");

  const fetchRows = async () => {
    try {
      const res = await axios.post(
        "https://insights.ist:8080/api/v1/community/super_tracker_post_analytics",{
          startDate:startDate,endDate:endDate
        }
      );
      if (res.status === 200) {
        setRows(res.data.data);
        setAllRows(res.data.data);
        // console.log(res.data.data, "res.data.data");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        `https://insights.ist:8080/api/projectxpagecategory`
      );

      if (res.status === 200) {
        setPageCategory(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
  if(startDate){

    fetchRows();
    setRowSelectionModel([])
  }
  }, [reload,startDate,endDate]);
  useEffect(() => {
    handleOverViewChange("e",2)
    fetchCategory();
  }, [reloadpagecategory]);

  

  useEffect(() => {
    try {
      axios.get("https://insights.ist:8080/api/getallprojectx").then((res) => {
        if (res.status === 200) {
          setProjectxpages(res.data.data);
        }
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }, []);

  const columns = [
    {
      field: "sno",
      headerName: "S_No",
      width: 70,
      valueGetter: (params) => rows.indexOf(params.row),
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
      field: "avatar",
      headerName: "Avatar",
      width: 70,
      renderCell: (params) => {
        const instagramProfileUrl = `https://www.instagram.com/${params.row.creatorName}/`;
        return (
          <Link
            to={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar
              src={`https://storage.googleapis.com/insights_backend_bucket/cr/${params.row.creatorName.toLowerCase()}.jpeg`}
            />
          </Link>
        );
      },
    },
    {
      field: "creatorName",
      headerName: "Page name",
      width: 220,
      valueGetter: (params) => formatString(params.row.creatorName) || "",
      renderCell: (params) => {
        const instagramProfileUrl = `/admin/instaapi/community/manager/${params.row.creatorName}`;
        return (
          <Link to={instagramProfileUrl} rel="noopener noreferrer">
            {formatString(params.row.creatorName)}
          </Link>
        );
      },
    },
    {
      field: "reportStatus.previousDay.pageCategoryId",
      headerName: "Category",
      width: 220,
      valueGetter: (params) =>
        params.row?.projectxRecord?.pageCategoryId || 0,
      renderCell: (params) => {
        const CategoryName = pagecategory.find(
          (category) =>
            category.category_id ===
            params.row.projectxRecord?.pageCategoryId
        );
        return CategoryName?.category_name;
      },
    },
    {
      field: "teammanager",
      headerName: "Manager",
      width: 200,
      valueGetter: (params) => params.row.teamInfo?.teamManager?.user_id || 0,
      renderCell: (params) =>
        userContextData?.find(
          (user) => user.user_id === params.row.teamInfo?.teamManager?.user_id
        )?.user_name || "N/A",
    },
    {
      field: "teamtype",
      headerName: "Page Type",
      width: 200,
      valueGetter: (params) => params.row.teamInfo?.team?.team_count || 0,
      renderCell: (params) => {
        const pageType =
          params.row.teamInfo?.team?.team_count > 1
            ? "Team"
            : params.row.teamInfo?.team?.team_count == 1
            ? "Individual"
            : "Team Not Created";
        return pageType;
      },
    },
    {
      field: "teamcount",
      headerName: "Team-Count",
      width: 100,
      valueGetter: (params) => params.row.teamInfo?.team?.team_count || 0,
    },
    {
      field: "teamcost",
      headerName: "COR",
      width: 100,
      valueGetter: (params) => params.row.teamInfo?.team?.cost_of_running || 0,
    },
    // { field: "postcount", headerName: "StorePost", width: 100 },
    {
      field: "followersCount",
      headerName: "Follower",
      width: 100,
      valueGetter: (params) => params.row.creatorInfo?.followersCount || 0,
      renderCell: (params) => {
        const instagramfollowerCount =
          params.row.creatorInfo?.followersCount || 0;
        return formatNumber(instagramfollowerCount);
      },
    },
    {
      field: "followingCount",
      headerName: "Following",
      width: 100,
      valueGetter: (params) => params.row.creatorInfo?.followingCount || 0,
      renderCell: (params) => {
        const instagramfollowingCount =
          params.row.creatorInfo?.followingCount || 0;
        return formatNumber(instagramfollowingCount);
      },
    },
    {
      field: "mediaCount",
      headerName: "Media",
      width: 100,
      valueGetter: (params) => params.row.creatorInfo?.postCount || 0,
      renderCell: (params) => {
        const mediaCount = params.row.creatorInfo?.postCount || 0;
        return formatNumber(mediaCount);
      },
    },
    {
      field: "nonPaidPosts.allLikes",
      headerName: "Np-Likes",
      width: 100,
      valueGetter: (params) => params.row.nonPaidPosts?.allLikes || 0,
      renderCell: (params) => {
        const nonpaidlikes = params.row.nonPaidPosts?.allLikes || 0;
        return formatNumber(nonpaidlikes);
      },
    },
    {
      field: "allViews",
      headerName: "Np-Views",
      width: 100,
      valueGetter: (params) => params.row.nonPaidPosts?.allViews || 0,
      renderCell: (params) => {
        const npViews = params.row.nonPaidPosts?.allViews || 0;
        return formatNumber(npViews);
      },
    },
    {
      field: "allComments",
      headerName: "Np-Comments",
      width: 100,
      valueGetter: (params) => params.row.nonPaidPosts?.allComments || 0,
      renderCell: (params) => {
        const allComments = params.row.nonPaidPosts?.allComments || 0;
        return formatNumber(allComments);
      },
    },
    {
      field: "yesterdaypost",
      headerName: "YesterDay-Post-Count",
      width: 150,
      valueGetter: (params) =>
        params.row.reportStatus?.previousDay?.todayPostCount || 0,
    },
    {
      field: "yesterdayFollowerGrowth",
      headerName: "YesterDay-Follower-Growth",
      width: 150,
      valueGetter: (params) =>
        params.row.reportStatus?.previousDay
          ?.todayVsYesterdayFollowersCountDiff || 0,
      renderCell: (params) => {
        const growth = params.value || 0;
        return (
          <div
            style={{
              color : growth > 0 ? "green" : growth < 0 ? "red" : "black",
            }}
          >
            {growth}
          </div>
        );
      },
    },
    {
      field: "followerdiff",
      headerName: "FollowerDifference",
      width: 100,
      // valueGetter: (params) => params.row.creatorInfo?.followersCount || 0,
      renderCell: (params) => {
        const instagramfollowerCount =
          params.row?.reportStatus?.startDate?.followersCount - params.row?.reportStatus?.endDate?.followersCount;
        return formatNumber(instagramfollowerCount);
      },
    },
    {
      field: "followerStartdate",
      headerName: "StartDate-Follower",
      width: 100,
      // valueGetter: (params) => params.row.creatorInfo?.followersCount || 0,
      renderCell: (params) => {
        const instagramfollowerCount =
          params.row?.reportStatus?.startDate?.followersCount || 0 ;
        return (instagramfollowerCount);
      },
    },
    {
      field: "followerEnddate",
      headerName: "EndDate-Follower",
      width: 100,
      // valueGetter: (params) => params.row.creatorInfo?.followersCount || 0,
      renderCell: (params) => {
        const instagramfollowerCount =
          params.row?.reportStatus?.endDate?.followersCount || 0 ;
        return (instagramfollowerCount);
      },
    },
  ];


  const handleOverViewChange = (event, newValue) => {
    const now = new Date();
    // let startDate, endDate;

    if (newValue == 0) {
      // Today
      setStartDate(new Date(now.setHours(0, 0, 0, 0)));
      setEndDate(new Date(now.setDate(now.getDate() + 1)));
      // console.log(new Date(now.setHours(0, 0, 0, 0)));
      // console.log(new Date(now.setDate(now.getDate() + 1)));
      // setEndDate(new Date(now.setHours(23, 59, 59, 999)));
    } else if (newValue == 1) {
      // This Week

      setStartDate(new Date(now.setDate(now.getDate() - now.getDay())));
      setEndDate(new Date(now.setDate(now.getDate() + 6 - now.getDay())));
    } else if (newValue == 2) {
      // This Month
      setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    } else if (newValue == 3) {
      // This Year
      setStartDate(new Date(now.getFullYear(), 0, 1));
      setEndDate(new Date(now.getFullYear(), 11, 31));
    } else if (newValue == 4) {
      // Previous Week
      setStartDate(new Date(now.setDate(now.getDate() - now.getDay() - 7)));
      setEndDate(new Date(now.setDate(now.getDate() + 6 - now.getDay())));
    } else if (newValue == 5) {
      // Previous Month
      setStartDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth(), 0));
    } else if (newValue == 6) {
      // Previous Year
      setStartDate(new Date(now.getFullYear() - 1, 0, 1));
      setEndDate(new Date(now.getFullYear() - 1, 11, 31));
    } else if (newValue == 7) {
      // Custom (Example: Last 30 days)
      setStartDate(new Date(now.setDate(now.getDate() - 30)));
      setEndDate(new Date());
    } else if (newValue === 8) {
      // Yesterday
      setStartDate(new Date(now.setDate(now.getDate() - 1))); // Yesterday
      setEndDate(new Date(now.setDate(now.getDate()))); // Today (end of day)
      //  console.log((new Date(now.setDate(now.getDate() - 1))),"Start Date");
      // console.log((new Date(now.setDate(now.getDate()+1 ))),"End Date");
    } else if (newValue === 9) {
      // Yesterday
      setStartDate(null); // Yesterday
      setEndDate(null); // Today (end of day)
    }else if (newValue === 10) {
      // Previous Three Months
      setStartDate(new Date(now.getFullYear(), now.getMonth() - 3, 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth(), 0));
    } else if (newValue === 11) {
      // Previous Six Months
      setStartDate(new Date(now.getFullYear(), now.getMonth() - 6, 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth(), 0));
    }

    setOverViewValue(newValue);
  };

  return (
    <div className="workWrapper">
      {allRows.length > 0 ? (
        <div className="card">
          <CommunityHeader
            setRows={setRows}
            rows={rows}
            allRows={allRows}
            reload={reload}
            setReload={setReload}
            pagecategory={pagecategory}
            rowSelectionModel={rowSelectionModel}
            projectxpages={projectxpages}
            setReloadpagecategory={setReloadpagecategory}
            reloadpagecategory={reloadpagecategory}
          />
           <div >
        <TabContext value={overViewvalue}>
          <div className="card-header flex_center_between">
            <h5 className="cardHeaderTitle">Page Overview From : {formatUTCDate(startDate)} To : {formatUTCDate(endDate)} </h5>
            <TabList
              className="tabSM"
              onChange={handleOverViewChange}
              aria-label="lab API tabs example"
            >
              {/* <Tab label="All" value={9} /> */}
              <Tab label="Today" value={0} />
              <Tab label="This Week" value={1} />
              <Tab label="This Month" value={2} />
              <Tab label="This Year" value={3} />
              {/* <Tab label="Yesterday" value={8} /> */}
              <Tab label="Last Week" value={4} />
              <Tab label="Last Month" value={5} />
              <Tab label="Quaterly" value={10} />
              <Tab label="Half Yearly" value={11} />
              <Tab label="Last Year" value={6} />
              <Tab label="Custom" value={7} />
            </TabList>
          </div>
          {overViewvalue == 7 && (
            <DatePickerCf
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              minSelectableDate={minSelectableDate}
            />
          )}
          
        </TabContext>
      </div>
          <Stack>
            {openTeam && (
              <CommunityTeamCreation
                rowSelectionModel={rowSelectionModel}
                setRowSelectionModel={setRowSelectionModel}
                openTeam={openTeam}
                setOpenTeam={setOpenTeam}
                left={left}
                setLeft={setLeft}
                right={right}
                setRight={setRight}
                selectedManager={selectedManager}
                setSelectedManager={setSelectedManager}
                userNumbers={userNumbers}
                setUserNumbers={setUserNumbers}
                reload={reload}
                setReload={setReload}
                editShowMode={editMode}
                setRows={setRows}
                teamDetail={teamDetail}
              />
            )}
          </Stack>
          <div className="card-header flex_center_between">
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.creatorName}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              slots={{ toolbar: CustomToolbar }}
              slotProps={{
                panel: { anchorEl: filterButtonEl },
                toolbar: {
                  setFilterButtonEl,
                  setOpenTeam,
                  rowSelectionModel,
                  setLeft,
                  setRight,
                  setSelectedManager,
                  setUserNumbers,
                  setEditMode,setTeamDetail
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              checkboxSelection
              filterModel={filterModel}
              onFilterModelChange={(model) => setFilterModel(model)}
              onRowSelectionModelChange={(newRowSelectionModel) =>
                setRowSelectionModel(newRowSelectionModel)
              }
              rowSelectionModel={rowSelectionModel}
            />
          </div>
        </div>
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
}

export default CommunityHome;
