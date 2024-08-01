import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {
  Autocomplete,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addRow } from "../../Store/Executon-Slice";
import DateFormattingComponent from "../../DateFormator/DateFormared";
import {
  openTagCategoriesModal,
  setPlatform,
  setShowPageHealthColumn,
  setShowVendorNotAssignedModal,
  setTagCategories,
} from "../../Store/PageOverview";
import TagCategoryListModal from "./TagCategoryListModal";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
  useGetnotAssignedVendorsQuery,
} from "../../Store/reduxBaseURL";
import VendorNotAssignedModal from "./VendorNotAssignedModal";
import instaIcon from "../../../assets/img/icon/insta.svg";
import { Dropdown } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import avatarOne from "../../../assets/img/product/Avtrar1.png";
import {
  useGetAllCitiesQuery,
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
  useGetAllPriceListQuery,
  useGetMultiplePagePriceQuery,
  useGetOwnershipTypeQuery,
  useGetPageStateQuery,
  useGetpagePriceTypeQuery,
} from "../../Store/PageBaseURL";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setStatsUpdate } from "../../Store/PageMaster";
import PageDetail from "./PageOverview/PageDetail";
import { setPageRow, setShowPageInfoModal } from "../../Store/Page-slice";

const PageOverview = () => {
  // const { toastAlert } = useGlobalContext();
  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery();
  const { data: pageStates } = useGetPageStateQuery();
  const [vendorTypes, setVendorTypes] = useState([]);
  // const [pieChart, setPieChart] = useState({
  //   series: [40, 60],
  //   options: {
  //     chart: {
  //       type: "donut",
  //     },
  //     labels: ["Male", "Female"],
  //     colors: ["#FAA7E0", "#DD2590"],
  //     stroke: {
  //       show: false,
  //       width: 0,
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     legend: {
  //       position: "left",
  //       offsetY: 70,
  //       offsetX: 0,
  //       fontSize: "16px",
  //       fontWeight: 500,
  //       markers: {
  //         width: 14,
  //         height: 14,
  //         radius: 14,
  //       },
  //       itemMargin: {
  //         horizontal: 0,
  //         vertical: 5,
  //       },
  //     },
  //   },
  // });
  // const [columnChartAge, setcolumnChartAge] = useState({
  //   series: [
  //     {
  //       name: "Demographics (Age group)",
  //       data: [15, 32, 13, 7, 4, 47, 19],
  //     },
  //   ],
  //   tooltip: {
  //     enabled: false,
  //   },
  //   options: {
  //     chart: {
  //       type: "bar",
  //       toolbar: {
  //         show: false, // Disables the toolbar
  //       },
  //     },
  //     plotOptions: {
  //       bar: {
  //         borderRadius: 7,
  //         borderRadiusApplication: "end",
  //         dataLabels: {
  //           position: "top", // top, center, bottom
  //         },
  //       },
  //     },
  //     grid: {
  //       show: false, // Removes the horizontal grid lines
  //     },
  //     colors: ["#DD2590"],
  //     dataLabels: {
  //       enabled: true,
  //       formatter: function (val) {
  //         return val + "%";
  //       },
  //       offsetY: -25,
  //       style: {
  //         fontSize: "14px",
  //         fontWeight: "400",
  //         colors: ["#344054"],
  //       },
  //     },

  //     xaxis: {
  //       categories: [
  //         "13 - 17",
  //         "18 - 24",
  //         "25 - 34",
  //         "35 - 44",
  //         "45 - 54",
  //         "55 - 64",
  //         "65 Above",
  //       ],
  //       position: "bottom",
  //       axisBorder: {
  //         show: false,
  //       },
  //       axisTicks: {
  //         show: false,
  //       },
  //       crosshairs: {
  //         show: false,
  //         enabled: false,
  //       },
  //       tooltip: {
  //         enabled: false,
  //         show: false,
  //       },
  //     },
  //     yaxis: {
  //       axisBorder: {
  //         show: false,
  //       },
  //       axisTicks: {
  //         show: false,
  //       },
  //       labels: {
  //         show: false,
  //       },
  //     },
  //   },
  // });
  // const [columnChartCountry, setcolumnChartCountry] = useState({
  //   series: [
  //     {
  //       name: "Top Country",
  //       data: [43, 12, 26, 14, 44, 20, 25],
  //     },
  //   ],
  //   tooltip: {
  //     enabled: false,
  //   },
  //   options: {
  //     chart: {
  //       type: "bar",
  //       toolbar: {
  //         show: false, // Disables the toolbar
  //       },
  //     },
  //     plotOptions: {
  //       bar: {
  //         borderRadius: 7,
  //         borderRadiusApplication: "end",
  //         dataLabels: {
  //           position: "top", // top, center, bottom
  //         },
  //       },
  //     },
  //     grid: {
  //       show: false, // Removes the horizontal grid lines
  //     },
  //     colors: ["#DD2590"],
  //     dataLabels: {
  //       enabled: true,
  //       formatter: function (val) {
  //         return val + "%";
  //       },
  //       offsetY: -25,
  //       style: {
  //         fontSize: "14px",
  //         fontWeight: "400",
  //         colors: ["#344054"],
  //       },
  //     },

  //     xaxis: {
  //       categories: [
  //         "India",
  //         "Myanmar",
  //         "Philippine",
  //         "Japan",
  //         "Korea",
  //         "Cambodia",
  //         "Thailand",
  //       ],
  //       position: "bottom",
  //       axisBorder: {
  //         show: false,
  //       },
  //       axisTicks: {
  //         show: false,
  //       },
  //       crosshairs: {
  //         show: false,
  //         enabled: false,
  //       },
  //       tooltip: {
  //         enabled: false,
  //         show: false,
  //       },
  //     },
  //     yaxis: {
  //       axisBorder: {
  //         show: false,
  //       },
  //       axisTicks: {
  //         show: false,
  //       },
  //       labels: {
  //         show: false,
  //       },
  //     },
  //   },
  // });

  // const [columnChartCity, setcolumnChartCity] = useState({
  //   series: [
  //     {
  //       name: "Top City",
  //       data: [40, 23, 10, 34, 27, 32, 38],
  //     },
  //   ],
  //   tooltip: {
  //     enabled: false,
  //   },
  //   options: {
  //     chart: {
  //       type: "bar",
  //       toolbar: {
  //         show: false, // Disables the toolbar
  //       },
  //     },
  //     plotOptions: {
  //       bar: {
  //         borderRadius: 7,
  //         borderRadiusApplication: "end",
  //         dataLabels: {
  //           position: "top", // top, center, bottom
  //         },
  //       },
  //     },
  //     grid: {
  //       show: false, // Removes the horizontal grid lines
  //     },
  //     colors: ["#DD2590"],
  //     dataLabels: {
  //       enabled: true,
  //       formatter: function (val) {
  //         return val + "%";
  //       },
  //       offsetY: -25,
  //       style: {
  //         fontSize: "14px",
  //         fontWeight: "400",
  //         colors: ["#344054"],
  //       },
  //     },

  //     xaxis: {
  //       categories: [
  //         "Bhopal",
  //         "Indore",
  //         "Delhi",
  //         "Noida",
  //         "Kolkata",
  //         "Chennai",
  //         "Pune",
  //       ],
  //       position: "bottom",
  //       axisBorder: {
  //         show: false,
  //       },
  //       axisTicks: {
  //         show: false,
  //       },
  //       crosshairs: {
  //         show: false,
  //         enabled: false,
  //       },
  //       tooltip: {
  //         enabled: false,
  //         show: false,
  //       },
  //     },
  //     yaxis: {
  //       axisBorder: {
  //         show: false,
  //       },
  //       axisTicks: {
  //         show: false,
  //       },
  //       labels: {
  //         show: false,
  //       },
  //     },
  //   },
  // });

  const [filterData, setFilterData] = useState([]);
  const [venodr, setVenodr] = useState([{}]);
  const [user, setUser] = useState();
  const [progress, setProgress] = useState(10);
  // const [allPriceTypeList, setAllallPriceTypeList] = useState([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  // const [priceData, setPriceData] = useState([]);
  const [contextData, setContextData] = useState(false);
  const [pageUpdateAuth, setPageUpdateAuth] = useState(false);
  const [pageStatsAuth, setPageStatsAuth] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const { isLoading: isNotAssignedVendorLoading, data: notAssignedVenodrData } =
  //   useGetnotAssignedVendorsQuery();
  // function handleNotAssignedVendorClick() {
  //   dispatch(setShowVendorNotAssignedModal());
  // }

  // const handlePageChange = ()=>{
  //   // if()

  // }

  const { data: allPriceTypeList } = useGetpagePriceTypeQuery();
  const { data: ownerShipData } = useGetOwnershipTypeQuery();
  // const handleEditCellChange = (params) => {
  //   (async () => {
  //     const updatedRow = {
  //       ...params.row,
  //       [params.field]: params.value,
  //     };

  //     return axios
  //       .put(baseUrl + `updatePage/${params.row._id}`, updatedRow)
  //       .then((res) => {});
  //   })();

  //   // Make API call to update the row data
  //   // Example: fetch('/api/updateRow', { method: 'POST', body: JSON.stringify(updatedRow) })

  //   // Update the local state with the updated row
  //   // setUpdatedRows((prevRows) => {
  //   //   const updatedRows = [...prevRows];
  //   //   const rowIndex = updatedRows.findIndex((row) => row.id === params.row.id);
  //   //   updatedRows[rowIndex] = updatedRow;
  //   //   return updatedRows;
  //   // });
  // };

  const showPageHealthColumn = useSelector(
    (state) => state.PageOverview.showPageHelathColumn
  );

  const { data: cities } = useGetAllCitiesQuery();
  function pageHealthToggleCheck() {
    if (showPageHealthColumn) {
      const data = filterData?.map((item) => {
        const matchingState = pageStates?.find(
          (state) => state?.page_master_id === item?._id
        );
        return {
          ...item,
          pageId: matchingState?._id,
          ...matchingState,
          _id: item._id,
        };
      });

      setFilterData(data);
    }
  }

  useEffect(() => {
    pageHealthToggleCheck();
  }, [showPageHealthColumn, filterData]);
  useEffect(() => {
    // if (showPageHealthColumn) {
    //   dispatch(setShowPageHealthColumn(false));
    // }
    if (userID && !contextData) {
      axios
        .get(`${baseUrl}get_single_user_auth_detail/${userID}`)
        .then((res) => {
          if (res.data[33].view_value === 1) {
            setContextData(true);
          }
          if (res.data[57].view_value === 1) {
            setPageUpdateAuth(true);
          }
          if (res.data[56].view_value === 1) {
            setPageStatsAuth(true);
          }
        });
    }

    getData();
  }, []);

  const handleTagCategory = (params) => {
    return function () {
      dispatch(setTagCategories(params));
      dispatch(openTagCategoriesModal());
    };
  };

  const handlePlatfrormClick = (data) => {
    return function () {
      dispatch(setPlatform(data));
      dispatch(openTagCategoriesModal());
    };
  };
  const handleSetState = () => {
    dispatch(addRow(false));
    dispatch(setStatsUpdate(false));
  };
  const handleUpdateRowClick = async (row) => {
    // await axios
    //   .get(`${baseUrl}` + `get_exe_history/${row.pageMast_id}`)
    //   .then((res) => {
    //     let data = res.data.data.filter((e) => {
    //       return e.isDeleted !== true;
    //     });
    //     data = data[0];

    //     navigate(`/admin/exe-update/${data._id}`, {
    //       state: row.pageMast_id,
    //     });
    //   });
    dispatch(setStatsUpdate(true));
  };

  const handleHistoryRowClick = (row) => {
    navigate(`/admin/exe-history/${row._id}`, {
      state: row.pageMast_id,
    });
  };

  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;

  const { data: pageCate } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: vendor } = useGetAllVendorQuery();
  const vendorData = vendor?.data;
  const getData = () => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUser(res.data.data);
      setProgress(70);
    });
  };

  useEffect(() => {
    if (pageList) {
      setVendorTypes(pageList.data);
      setFilterData(pageList.data);
    }
  }, [pageList]);

  const { data: priceData, isLoading: isPriceLoading } =
    useGetMultiplePagePriceQuery(selectedRow,{
      skip:!selectedRow
    });

  const handlePriceClick = (row) => {
    return function () {
      setSelectedRow(row._id);
      // setPriceData(row.purchase_price);
      setShowPriceModal(true);
    };
  };

  const handleClose = () => {
    setShowPriceModal(false);
  };

  const handlePageDetailClick = (params) => {
    return () => {
      dispatch(setShowPageInfoModal(true));
      dispatch(setPageRow(params.row));
    };
  };

  const dataGridcolumns = [
    {
      field: "S.NO",
      headerName: "Count",
      renderCell: (params) => (
        <div onClick={handlePageDetailClick(params)}>
          {filterData.indexOf(params.row) + 1}
        </div>
      ),

      width: 80,
    },
    {
      field: "page_name",
      headerName: "User Name",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let name = params.row.page_name;
        return (
          <a
            target="_blank"
            rel="noreferrer"
            href={params.row.page_link}
            className="link-primary"
          >
            {name}
          </a>
        );
      },
    },
  ];

  const pageDetailColumn = [
    { field: "preference_level", headerName: "Level", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      valueGetter: (params) => (params.row.status == 1 ? "Active" : "Inactive"),
    },
    {
      field: "ownership_type",
      headerName: "Ownership",
      width: 200,
      // valueGetter: (params) => {
      //   if (!ownerShipData) {
      //     return <div>Unknown</div>;
      //   }

      //   const ownership = ownerShipData?.find(
      //     (item) => item._id === params.row.ownership_type
      //   )?.company_type_name;
      //   const finalName = ownership ? ownership : "NA";

      //   return finalName;
      // },
    },

    // {
    //   field: "link",
    //   headerNa: "Link",
    //   width: 200,
    //   renderCell: (params) => (
    //     <Link to={params.row.link} target="_blank" className="text-primary">
    //       <OpenInNewIcon />
    //     </Link>
    //   ),
    // },
    {
      field: "platform_id",
      headerName: "Platform",
      renderCell: (params) => {
        let name = platformData?.find(
          (item) => item?._id == params.row.platform_id
        )?.platform_name;
        return <div>{name}</div>;
      },
      width: 200,
    },
    {
      field: "page_catg_id",
      headerName: "Category",
      width: 200,
      renderCell: (params) => {
        // let name = cat?.find((item) => item?.page_category_id == params.row?.temp_page_cat_id)?.page_category;
        let name = cat?.find((item) => item?._id == params.row?.page_category_id)?.page_category;
        return <div>{name}</div>;
      },
    },
    {
      field: "followers_count",
      headerName: "Followers",
      width: 200,
    },
    {
      field: "vendor_id",
      headerName: "Vendor",
      renderCell: (params) => {
        let name = vendorData?.find(
          (item) => item?.vendor_id == params.row?.temp_vendor_id
        )?.vendor_name;

        return <div>{name}</div>;
      },
      width: 200,
    },

    {
      field: "platform_active_on",
      headerName: "Active Platform",
      width: 200,
      // renderCell: (params) => {
      //   let data = platformData?.filter((item) => {
      //     return params.row.platform_active_on.includes(item._id);
      //   });
      //   return (
      //     <div>
      //       {data.length > 0 && (
      //         <Button
      //           className="text-center"
      //           onClick={handlePlatfrormClick(data)}
      //         >
      //           <KeyboardDoubleArrowUpIcon />
      //         </Button>
      //       )}
      //     </div>
      //   );
      // },
      valueGetter: (params) => {
        let data = platformData?.filter((item) => {
          return params.row.platform_active_on.includes(item._id);
        });
        return data?.map((item) => item.platform_name).join(", ");
      },
    },
    {
      field: "tags_page_category",
      headerName: "Tag Category",
      width: 200,
      renderCell: (params) => {
        let data = cat
          ?.filter((item) => {
            return params.row?.tags_page_category?.includes(item._id);
          })
          .map((item) => item.category_name);
        return (
          <div
            style={{
              width: "200px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.map((item, i) => {
              return (
                <p
                  key={i}
                  onClick={handleTagCategory(data)}
                  style={{ display: "inline", cursor: "pointer" }}
                >
                  {item}
                  {i !== data?.length - 1 && ","}
                </p>
              );
            })}
          </div>
        );
      },
    },
    // {
    //   field: "engagment_rate",
    //   headerName: "ER",
    //   width: 200,
    // },
    {
      field: "page_closed_by",
      headerName: "Closed By",
      width: 200,
      renderCell: (params) => {
        let name = user?.find(
          (item) => item?.user_id == params?.row?.page_closed_by
        )?.user_name;
        return <div>{name ?? "NA"}</div>;
      },
    },
    {
      field: "page_name_type",
      headerName: "Name Type",
      width: 200,
      renderCell: (params) => {
        return params.row.page_name_type != 0 ? params.row.page_name_type : "";
      },
    },
    {
      field: "content_creation",
      headerName: "Content Creation",
      renderCell: ({ row }) => {
        return row.content_creation != 0 ? row.content_creation : "";
      },
      width: 200,
    },

    { field: "rate_type", headerName: "Rate Type", width: 200 },
    { field: "variable_type", headerName: "Variable Type", width: 200 },
    {
      field: "m_post_price",
      headerName: "Post Price",
      width: 200,
      valueGetter: ({ row }) => {
        let mPostPrice = row.m_post_price;
        let postPrice = row.post;
        return postPrice ?? mPostPrice;
      },
    },
    {
      field: "m_story_price",
      headerName: "Story Price",
      width: 200,
      valueGetter: ({ row }) => {
        let mStoryPrice = row.m_story_price;
        let storyPrice = row.story;
        return storyPrice ?? mStoryPrice;
      },
    },
    {
      field: "m_both_price",
      headerName: "Both Price",
      width: 200,
      valueGetter: ({ row }) => {
        let mBothPrice = row.m_both_price;
        let bothPrice = row.both_;
        return bothPrice ?? mBothPrice;
      },
    },
    {
      field: "page_price_multiple",
      headerName: "Price",
      width: 200,
      renderCell: ({ row }) => {
        return (
          <div>
            {
              <button
                title="Price"
                onClick={handlePriceClick(row)}
                className="btn btn-outline-primary btn-sm user-button"
              >
                <PriceCheckIcon />
              </button>
            }
          </div>
        );
      },
    },
    {
      field: "Action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <div className="d-flex align-center ">
          {/* <Link
            className="mt-2"
            to={`/admin/pms-purchase-price/${params.row.pageMast_id}`}
          >
            <button
              title="Purchase Price"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <RequestPageIcon />{" "}
            </button>
          </Link> */}
          {pageUpdateAuth && (
            <Link
              className="mt-2"
              to={`/admin/pms-page-edit/${params.row._id}`}
            >
              <button
                title="Edit"
                className="btn btn-outline-primary btn-sm user-button"
              >
                <FaEdit />{" "}
              </button>
            </Link>
          )}
          {decodedToken.role_id ==1 && (
            <DeleteButton
              endpoint="v1/pageMaster"
              id={params.row._id}
              getData={refetchPageList}
            />
          )}
        </div>
      ),
    },
  ];

  const priceColumn = [
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => <div>{priceData.indexOf(params.row) + 1}</div>,
      width: 130,
    },
    {
      field: "price_type",
      headerName: "Price Type",
      width: 200,
      renderCell: (params) => {
        let name = allPriceTypeList?.find(
          (item) => item._id == params.row.page_price_type_id
        )?.name;
        return <div>{name}</div>;
      },
    },

    {
      field: "price",
      headerName: "Price",
      width: 200,
    },
  ];

  const pageHealthColumn = [
    contextData && {
      field: "update",
      headerName: "Update",
      width: 130,
      renderCell: (params) => {
        const totalPercentage = params.row.totalPercentage;
        return (
          // totalPercentage == 100 ||
          // (totalPercentage == 0.0 && (
          <>
            {/* <button
              type="button"
              className="btn cmnbtn btn_sm btn-outline-primary"
              data-toggle="modal"
              data-target="#myModal1"
              // disabled={
              //   totalPercentage == 0 || totalPercentage == 100 ? false : true
              // }
              onClick={() => {
                dispatch(addRow(params.row));
                navigate(`/admin/stats`);
              }}
            >
              Set Stats
            </button> */}
            <Link
              to={{
                pathname: `/admin/pageStats/${params.row._id}`,
              }}
            >
              <button
                type="button"
                className="btn cmnbtn btn_sm btn-outline-primary"
                onClick={handleSetState()}
              >
                Page Stats
              </button>
            </Link>
          </>
          // )
          // )
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
            className="btn cmnbtn btn_sm btn-outline-primary"
            onClick={() => handleHistoryRowClick(params.row)}
            // disabled={
            //   params?.row?.latestEntry?.stats_update_flag
            //     ? !params?.row?.latestEntry.stats_update_flag
            //     : true
            // }
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
          params.row?.pageId && (
            <Link
              to={{
                pathname: `/admin/pageStats/${params.row.pageId}`,
                state: { update: true },
              }}
            >
              <button
                type="button"
                className="btn cmnbtn btn_sm btn-outline-primary"
                onClick={handleUpdateRowClick}
              >
                Update
              </button>
            </Link>
          )
        );
      },
    },
    // {
    //   field: "totalPercentage",
    //   width: 150,
    //   headerName: "Stats Update %",
    //   renderCell: (params) => {
    //     return params.row.totalPercentage > 0
    //       ? Math.round(+params.row?.totalPercentage) + "%"
    //       : params.row.totalPercentageForExeHistory + "%";
    //   },
    // },
    // {
    //   field: "stats_update_flag ",
    //   width: 150,
    //   headerName: "Stats Update Flag",
    //   renderCell: (params) => {
    //     const num = params?.row?.latestEntry?.stats_update_flag
    //       ? params?.row?.latestEntry.stats_update_flag
    //       : false;
    //     return num ? "Yes" : "No";
    //   },
    // },
    {
      field: "Age_13_17_percent",
      width: 150,
      headerName: "Age 13-17 %",
      renderCell: (params) => {
        let data = params.row?.Age_13_17_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_18_24_percent",
      width: 150,
      headerName: "Age 18-24 %",
      renderCell: (params) => {
        let data = params.row?.Age_18_24_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_25_34_percent",
      width: 150,
      headerName: "Age 25-34 %",
      renderCell: (params) => {
        let data = params.row?.Age_25_34_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_35_44_percent",
      width: 150,
      headerName: "Age 35-44 %",
      renderCell: (params) => {
        let data = params.row?.Age_35_44_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_45_54_percent",
      width: 150,
      headerName: "Age 45-54 %",
      renderCell: (params) => {
        let data = params.row?.Age_45_54_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_55_64_percent",
      width: 150,
      headerName: "Age 55-64 %",
      renderCell: (params) => {
        let data = params.row?.Age_55_64_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_65_plus_percent",
      width: 150,
      headerName: "Age 65+ %",
      renderCell: (params) => {
        let data = params.row?.Age_65_plus_percent;
        return +data ? data + "%" : "NA";
      },
    },
    // {
    //   field: "Age_upload",
    //   width: 150,
    //   headerName: "Age Upload",
    //   renderCell: (params) => {
    //     let url = params.row?.Age_upload;
    //     return url ? (
    //       <img src={url} style={{ width: "50px", height: "50px" }} />
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },
    {
      field: "city1_name",
      width: 150,
      headerName: "City 1 and %",
      // renderCell: (params) => {
      //   let data = params.row?.city1_name;
      //   return data ? data : "NA";
      // },
      valueGetter: (params) => {
        let data = params.row?.city1_name;
        let percentage = params.row?.percentage_city1_name;
        return data ? data + ` (${percentage}%)` : "NA";
      },
    },
    {
      field: "city2_name",
      width: 150,
      headerName: "City 2 and %",
      valueGetter: (params) => {
        let data = params.row?.city2_name;
        let percentage = params.row?.percentage_city2_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "city3_name",
      width: 150,
      headerName: "City 3 and %",
      valueGetter: (params) => {
        let data = params.row?.city3_name;
        let percentage = params.row?.percentage_city3_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "city4_name",
      width: 150,
      headerName: "City 4 and %",
      renderCell: (params) => {
        let data = params.row?.city4_name;
        let percentage = params.row?.percentage_city4_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "city5_name",
      width: 150,
      headerName: "City 5 and %",
      renderCell: (params) => {
        let data = params.row?.city5_name;
        let percentage = params.row?.percentage_city5_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "city_image_url",
      width: 150,
      headerName: "City Image",
      renderCell: (params) => {
        let data = params.row?.city_image_url;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
    {
      field: "country1_name",
      width: 150,
      headerName: "Country 1  and %",
      renderCell: (params) => {
        let data = params.row?.country1_name;
        let percentage = params.row?.percentage_country1_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "country2_name",
      width: 150,
      headerName: "Country 2 and %",
      renderCell: (params) => {
        let data = params.row?.country2_name;
        let percentage = params.row?.percentage_country2_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "country3_name",
      width: 150,
      headerName: "Country 3 and %",
      renderCell: (params) => {
        let data = params.row?.country3_name;
        let percentage = params.row?.percentage_country3_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "country4_name",
      width: 150,
      headerName: "Country 4 and %",
      renderCell: (params) => {
        let data = params.row?.country4_name;
        let percentage = params.row?.percentage_country4_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "country5_name",
      width: 150,
      headerName: "Country 5 and %",
      renderCell: (params) => {
        let data = params.row?.country5_name;
        let percentage = params.row?.percentage_country5_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "country_image_url",
      width: 150,
      headerName: "Country Image",
      renderCell: (params) => {
        let data = params.row?.country_image_url;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
    {
      field: "createdAt",
      width: 150,
      headerName: "Creation Date",
      renderCell: (params) => {
        let data = params.row?.createdAt;
        return data
          ? Intl.DateTimeFormat("en-GB").format(new Date(data))
          : "NA";
      },
    },

    {
      field: "engagement",
      width: 150,
      headerName: "Engagement",
      renderCell: (params) => {
        let data = params.row?.engagement;
        return data ? data : "NA";
      },
    },
    {
      field: "engagement_image_url",
      width: 150,
      headerName: "Engagement Image",
      renderCell: (params) => {
        let data = params.row?.engagement_image_url;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },

    {
      field: "impression",
      width: 150,
      headerName: "Impression",
      renderCell: (params) => {
        let data = params.row?.impression;
        return data ? data : "NA";
      },
    },
    {
      field: "impression_image_url",
      width: 150,
      headerName: "Impression Image",
      renderCell: (params) => {
        let data = params.row?.impression_image_url;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
    {
      field: "female_percent",
      width: 150,
      headerName: "Female Percentage",
      renderCell: (params) => {
        let data = params.row?.female_percent;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "male_percent",
      width: 150,
      headerName: "Male Percentage",
      renderCell: (params) => {
        let data = params.row?.male_percent;
        return data ? data + "%" : "NA";
      },
    },
    // {
    //   field: "percentage_city1_name",
    //   width: 150,
    //   headerName: "City 1 %",
    //   renderCell: (params) => {
    //     let data = params.row?.percentage_city1_name;
    //     return data ? data + "%" : "NA";
    //   },
    // },
    // {
    //   field: "percentage_city2_name",
    //   width: 150,
    //   headerName: "City 2 %",
    //   renderCell: (params) => {
    //     let data = params.row?.percentage_city2_name;
    //     return data ? data + "%" : "NA";
    //   },
    // },
    // {
    //   field: "percentage_city3_name",
    //   width: 150,
    //   headerName: "City 3 %",
    //   renderCell: (params) => {
    //     let data = params.row?.percentage_city3_name;
    //     return data ? data + "%" : "NA";
    //   },
    // },
    // {
    //   field: "percentage_city4_name",
    //   width: 150,
    //   headerName: "City 4 %",
    //   renderCell: (params) => {
    //     let data = params.row?.percentage_city4_name;
    //     return data ? data + "%" : "NA";
    //   },
    // },
    // {
    //   field: "percentage_city5_name",
    //   width: 150,
    //   headerName: "City 5 %",
    //   renderCell: (params) => {
    //     let data = params.row?.percentage_city5_name;
    //     return data ? data + "%" : "NA";
    //   },
    // },
    // {
    //   field: "percentage_country1_name",
    //   width: 150,
    //   headerName: "Country 1 %",
    //   renderCell: (params) => {
    //     let data = params.row?.percentage_country1_name;
    //     return data ? data + "%" : "NA";
    //   },
    // },
    // {
    //   field: "percentage_country2_name",
    //   width: 150,
    //   headerName: "Country 2 %",
    //   renderCell: (params) => {
    //     let data = params.row?.percentage_country2_name;
    //     return data ? data + "%" : "NA";
    //   },
    // },
    // {
    //   field: "percentage_country3_name",
    //   width: 150,
    //   headerName: "Country 3 %",
    //   renderCell: (params) => {
    //     let data = params.row?.percentage_country3_name;
    //     return data ? data + "%" : "NA";
    //   },
    // },
    // {
    //   field: "percentage_country4_name",
    //   width: 150,
    //   headerName: "Country 4 %",
    //   renderCell: (params) => {
    //     let data = params.row?.percentage_country4_name;
    //     return data ? data + "%" : "NA";
    //   },
    // },
    // {
    //   field: "percentage_country5_name",
    //   width: 150,
    //   headerName: "Country 5 %",
    //   renderCell: (params) => {
    //     let data = params.row?.percentage_country5_name;
    //     return data ? data + "%" : "NA";
    //   },
    // },
    {
      field: "profile_visit",
      width: 150,
      headerName: "Profile Visit",
      renderCell: (params) => {
        let data = params.row?.profile_visit;
        return data ? data : "NA";
      },
    },
    // {
    //   field: "quater",
    //   width: 150,
    //   headerName: "Quater",
    //   renderCell: (params) => {
    //     let data = params.row?.quater;
    //     return data ? data : "NA";
    //   },
    // },
    {
      field: "reach",
      width: 150,
      headerName: "Reach",
      renderCell: (params) => {
        let data = params.row?.reach;
        return data ? data : "NA";
      },
    },
    {
      field: "reach_image_url",
      width: 150,
      headerName: "Reach Image",
      renderCell: (params) => {
        let data = params.row?.reach_image_url;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
    {
      field: "start_date",
      width: 150,
      headerName: "Start Date",
      renderCell: (params) => {
        let data = params.row?.start_date;
        return data ? <DateFormattingComponent date={data} /> : "NA";
      },
    },
    {
      field: "endDate",
      width: 150,
      headerName: "End Date",
      renderCell: (params) => {
        let data = params.row?.end_date;
        return data ? <DateFormattingComponent date={data} /> : "NA";
      },
    },
    // {
    //   field: "stats_for",
    //   width: 150,
    //   headerName: "Stats For",
    //   renderCell: (params) => {
    //     let data = params.row?.stats_for;
    //     return data ? data : "NA";
    //   },
    // },
    {
      field: "story_view",
      width: 150,
      headerName: "Story View",
      renderCell: (params) => {
        let data = params.row?.story_view;
        return data ? data : "NA";
      },
    },
    {
      field: "story_view_image_url",
      width: 150,
      headerName: "Story View Image",
      renderCell: (params) => {
        let data = params.row?.story_view_image_url;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
  ];

  // if(pageStatsAuth){
  //       dispatch(setShowPageHealthColumn(true));

  //     }else{
  //       dispatch(setShowPageHealthColumn(false));
  //       dataGridcolumns.push(...pageDetailColumn)

  //     }

  //   useEffect(() => {
  //     // Directly dispatch the value of pageStatsAuth
  //     console.log(...pageDetailColumn)
  //   console.log('pageStatsAuth', pageStatsAuth);
  // }, [pageStatsAuth]);

  if (!pageStatsAuth || decodedToken?.role_id === 1) {
    dataGridcolumns.push(...pageDetailColumn);
  }
  !decodedToken?.role_id === 1 &&
    dispatch(setShowPageHealthColumn(pageStatsAuth));
  // !decodedToken?.role_id === 1&&  dispatch(setShowPageHealthColumn(pageStatsAuth));

  if (showPageHealthColumn) {
    dataGridcolumns.push(...pageHealthColumn);
  }
  return (
    <>
      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title flexCenterBetween">
            {pageStatsAuth && (
              <Switch
                checked={showPageHealthColumn}
                value={showPageHealthColumn}
                onChange={() =>
                  dispatch(setShowPageHealthColumn(!showPageHealthColumn))
                }
                name="Page Health"
                color="primary"
              />
            )}
            <Typography>Page Health</Typography>
            <Typography>: {filterData?.length}</Typography>
          </h5>
          <div className="flexCenter colGap8">
            <Link
              to={`/admin/pms-page-master`}
              className="btn cmnbtn btn_sm btn-outline-primary"
            >
              Add Page <AddIcon />
            </Link>
            <Link
              to={`/admin/pms-vendor-overview`}
              className="btn cmnbtn btn_sm btn-outline-primary"
            >
              Vendor <KeyboardArrowRightIcon />
            </Link>
          </div>
        </div>
        <div className="card-body pb4">
          <div className="row thm_form">
            <div className="col-md-3 mb4">
              <Autocomplete
                id="platform-autocomplete"
                options={platformData}
                getOptionLabel={(option) => {
                  const count = vendorTypes.filter(
                    (d) => d.platform_id == option._id
                  )?.length;
                  return `${option.platform_name} (${count})`;
                }}
                style={{ width: 270 }}
                renderInput={(params) => (
                  <TextField {...params} label="Platform" variant="outlined" />
                )}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    // Reset the data when the clear button is clicked
                    setFilterData(vendorTypes);
                  } else {
                    let result = vendorTypes.filter(
                      (d) => d.platform_id == newValue._id
                    );
                    setFilterData(result);
                  }
                }}
              />
            </div>
            <div className="col-md-3 mb4">
              {/* <Autocomplete
                id="ownership-type-autocomplete"
                options={[
                  ...new Set(
                    vendorTypes?.map((item) => {
                      return item?.ownership_type;
                    })
                  ),
                ]}
                getOptionLabel={(option) => {
                  const count = vendorTypes.filter(
                    (d) => d.ownership_type == option
                  )?.length;
                  let item = ownerShipData?.find((item) => item._id == option);
                  let name = item ? item.company_type_name : "NA"; // Access the name property of the item
                  return `${name} (${count})`;
                }}
                style={{ width: 270 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ownership "
                    variant="outlined"
                  />
                )}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    setFilterData(vendorTypes);
                  } else {
                    let result = vendorTypes.filter(
                      (d) => d.ownership_type == newValue
                    );
                    setFilterData(result);
                  }
                }}
              /> */}
              <Autocomplete
                id="ownership-type-autocomplete"
                options={['Solo', 'PartnerShip', 'Vendor']}
                style={{ width: 270 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ownership"
                    variant="outlined"
                  />
                )}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    setFilterData(vendorTypes);
                  } else {
                    let result = vendorTypes.filter((d) => d.ownership_type === newValue );
                    setFilterData(result);
                  }
                }}
              />
            </div>
            <div className="col-md-3 mb4">
              <Autocomplete
                id="page-status-autocomplete"
                options={[
                  ...new Set(
                    vendorTypes?.map((item) => {
                      return item?.status;
                    })
                  ),
                ]}
                getOptionLabel={(option) => {
                  const count = vendorTypes.filter(
                    (d) => d.status == option
                  )?.length;
                  let name = option == 1 ? "Active" : "Inactive";
                  return `${name} (${count})`;
                }}
                style={{ width: 270 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Page Status"
                    variant="outlined"
                  />
                )}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    setFilterData(vendorTypes);
                  } else {
                    let result = vendorTypes.filter(
                      (d) => d.status == newValue
                    );
                    setFilterData(result);
                  }
                }}
              />
            </div>
            <div className="col-md-3 mb4">
              <Autocomplete
                id="pagename-type-autocomplete"
                options={[
                  ...new Set(
                    vendorTypes?.map((item) => {
                      return item?.page_name_type;
                    })
                  ),
                ]}
                getOptionLabel={(option) => {
                  const count = vendorTypes.filter(
                    (d) => d.page_name_type == option
                  )?.length;
                  return `${option} (${count})`;
                }}
                style={{ width: 270 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Page Name Type"
                    variant="outlined"
                  />
                )}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    setFilterData(vendorTypes);
                  } else {
                    let result = vendorTypes.filter(
                      (d) => d.page_name_type == newValue
                    );
                    setFilterData(result);
                  }
                }}
              />
            </div>
            <div className="col-md-3 mb4">
              <Autocomplete
                id="closedby-autocomplete"
                options={[
                  ...new Set(
                    vendorTypes?.map((item) => {
                      return item?.page_closed_by;
                    })
                  ),
                ]}
                getOptionLabel={(option) => {
                  const users = user?.find((e) => e.user_id == option);
                  const count = vendorTypes.filter(
                    (d) => d.page_closed_by == option
                  )?.length;
                  return `${users?.user_name} (${count})`;
                }}
                style={{ width: 270 }}
                renderInput={(params) => (
                  <TextField {...params} label="Closed By" variant="outlined" />
                )}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    setFilterData(vendorTypes);
                  } else {
                    let result = vendorTypes.filter(
                      (d) => d.page_closed_by == newValue
                    );
                    setFilterData(result);
                  }
                }}
              />
            </div>
            <div className="col-md-3 mb4">
              <Autocomplete
                id="category-autocomplete"
                options={[
                  ...new Set(vendorTypes?.map(item => item?.page_category_id))
                ]}
                getOptionLabel={(option) => {
                  const category = cat?.find(e => e?._id === option);
                  const count = vendorTypes?.filter(
                    d => d?.page_category_id === option
                  ).length;
                  return `${category?.page_category || 'Unknown Category'} (${count})`;
                }}
                renderInput={(params) => <TextField {...params} label="Select Category" variant="outlined" />}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    setFilterData(vendorTypes);
                  } else {
                    let result = vendorTypes.filter(
                      (d) => d.page_category_id == newValue
                    );
                    setFilterData(result);
                  }
                }}
              />
            </div>
            {/* <div className="col-md-3 mb4">
              <Autocomplete
                id="ownership-autocomplete"
                options={[
                  ...new Set(
                    vendorTypes?.map((item) => {
                      return item?.ownership_type;
                    })
                  ),
                ]}
                getOptionLabel={(option) => {
                  const count = vendorTypes.filter(
                    (d) => d.ownership_type == option
                  )?.length;
                  return `${option} (${count})`;
                }}
                style={{ width: 270 }}
                renderInput={(params) => (
                  <TextField {...params} label="Ownership" variant="outlined" />
                )}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    setFilterData(vendorTypes);
                  } else {
                    let result = vendorTypes.filter(
                      (d) => d.ownership_type == newValue
                    );
                    setFilterData(result);
                  }
                }}
              />
            </div> */}
          </div>
        </div>
        <div className="card-body p0">
          <div className="data_tbl thm_table table-responsive">
            {isPageListLoading ? (
              <Box
                sx={{
                  textAlign: "center",
                  position: "relative",
                  margin: "auto",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress variant="determinate" value={progress} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="text-primary"
                  >
                    {`${Math.round(progress)}%`}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ height: 700, width: "100%" }}>
                <DataGrid
                  title="Page Overview"
                  rows={filterData}
                  columns={dataGridcolumns}
                  // processRowUpdate={handleEditCellChange}
                  // onCellEditStop={handleEditCellChange}
                  // onCellEditStart={handleEditCellChange}
                  // onEditCellChange={handleEditCellChange}
                  onRowDoubleClick={(params) => {
                    navigate(`/admin/pms-page-edit/${params.row._id}`);
                  }}
                  // onCellEditStop={(params) =>
                  //   setTimeout(() => handleEditCellChange(params), 1000)
                  // }

                  // onPaginationModelChange={handlePageChange}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  // rowHeight={38}
                  disableSelectionOnClick
                  getRowId={(row) => row._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>
            )}
          </div>
        </div>
      </div>
      <Dialog
        open={showPriceModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Price Details"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {!isPriceLoading && (
              <DataGrid
                rows={priceData}
                columns={priceColumn}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                getRowId={(row) => row._id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <TagCategoryListModal />
      <VendorNotAssignedModal />
      <PageDetail />
    </>
  );
};

export default PageOverview;
