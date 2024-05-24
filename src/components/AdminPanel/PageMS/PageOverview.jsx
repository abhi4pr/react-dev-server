import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Stack, Switch, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
// import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
// import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
// import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useGlobalContext } from "../../../Context/Context";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
import CategoryIcon from "@mui/icons-material/Category";
import {
  openTagCategoriesModal,
  setPlatform,
  setShowPageHealthColumn,
  setShowVendorNotAssignedModal,
  setTagCategories,
} from "../../Store/PageOverview";
import TagCategoryListModal from "./TagCategoryListModal";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { EditTwoTone } from "@mui/icons-material";
import { useGetnotAssignedVendorsQuery } from "../../Store/reduxBaseURL";
import VendorNotAssignedModal from "./VendorNotAssignedModal";
import instaIcon from "../../../assets/img/icon/insta.svg";
import { Dropdown } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import avatarOne from "../../../assets/img/product/Avtrar1.png";

const PageOverview = () => {
  // const { toastAlert } = useGlobalContext();
  const [vendorTypes, setVendorTypes] = useState([]);
  const [pieChart, setPieChart] = useState({
    series: [40, 60],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Male", "Female"],
      colors: ["#FAA7E0", "#DD2590"],
      stroke: {
        show: false,
        width: 0,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "left",
        offsetY: 70,
        offsetX: 0,
        fontSize: "16px",
        fontWeight: 500,
        markers: {
          width: 14,
          height: 14,
          radius: 14,
        },
        itemMargin: {
          horizontal: 0,
          vertical: 5,
        },
      },
    },
  });
  const [columnChartAge, setcolumnChartAge] = useState({
    series: [
      {
        name: "Demographics (Age group)",
        data: [15, 32, 13, 7, 4, 47, 19],
      },
    ],
    tooltip: {
      enabled: false,
    },
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false, // Disables the toolbar
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 7,
          borderRadiusApplication: "end",
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      grid: {
        show: false, // Removes the horizontal grid lines
      },
      colors: ["#DD2590"],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: -25,
        style: {
          fontSize: "14px",
          fontWeight: "400",
          colors: ["#344054"],
        },
      },

      xaxis: {
        categories: [
          "13 - 17",
          "18 - 24",
          "25 - 34",
          "35 - 44",
          "45 - 54",
          "55 - 64",
          "65 Above",
        ],
        position: "bottom",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: false,
          enabled: false,
        },
        tooltip: {
          enabled: false,
          show: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
    },
  });
  const [columnChartCountry, setcolumnChartCountry] = useState({
    series: [
      {
        name: "Top Country",
        data: [43, 12, 26, 14, 44, 20, 25],
      },
    ],
    tooltip: {
      enabled: false,
    },
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false, // Disables the toolbar
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 7,
          borderRadiusApplication: "end",
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      grid: {
        show: false, // Removes the horizontal grid lines
      },
      colors: ["#DD2590"],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: -25,
        style: {
          fontSize: "14px",
          fontWeight: "400",
          colors: ["#344054"],
        },
      },

      xaxis: {
        categories: [
          "India",
          "Myanmar",
          "Philippine",
          "Japan",
          "Korea",
          "Cambodia",
          "Thailand",
        ],
        position: "bottom",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: false,
          enabled: false,
        },
        tooltip: {
          enabled: false,
          show: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
    },
  });

  const [columnChartCity, setcolumnChartCity] = useState({
    series: [
      {
        name: "Top City",
        data: [40, 23, 10, 34, 27, 32, 38],
      },
    ],
    tooltip: {
      enabled: false,
    },
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false, // Disables the toolbar
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 7,
          borderRadiusApplication: "end",
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      grid: {
        show: false, // Removes the horizontal grid lines
      },
      colors: ["#DD2590"],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: -25,
        style: {
          fontSize: "14px",
          fontWeight: "400",
          colors: ["#344054"],
        },
      },

      xaxis: {
        categories: [
          "Bhopal",
          "Indore",
          "Delhi",
          "Noida",
          "Kolkata",
          "Chennai",
          "Pune",
        ],
        position: "bottom",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: false,
          enabled: false,
        },
        tooltip: {
          enabled: false,
          show: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
    },
  });

  const [filterData, setFilterData] = useState([]);
  const [cat, setCat] = useState([{}]);
  const [venodr, setVenodr] = useState([{}]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [platformData, setPlatformData] = useState([]);
  const [allPriceTypeList, setAllallPriceTypeList] = useState([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceData, setPriceData] = useState([]);
  const [contextData, setContextData] = useState(false);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading: isNotAssignedVendorLoading, data: notAssignedVenodrData } =
    useGetnotAssignedVendorsQuery();
  function handleNotAssignedVendorClick() {
    dispatch(setShowVendorNotAssignedModal());
  }
  const handleEditCellChange = (params) => {
    (async () => {
      const updatedRow = {
        ...params.row,
        [params.field]: params.value,
      };

      return axios
        .put(baseUrl + `updatePage/${params.row._id}`, updatedRow)
        .then((res) => {});
    })();

    // Make API call to update the row data
    // Example: fetch('/api/updateRow', { method: 'POST', body: JSON.stringify(updatedRow) })

    // Update the local state with the updated row
    // setUpdatedRows((prevRows) => {
    //   const updatedRows = [...prevRows];
    //   const rowIndex = updatedRows.findIndex((row) => row.id === params.row.id);
    //   updatedRows[rowIndex] = updatedRow;
    //   return updatedRows;
    // });
  };

  const showPageHealthColumn = useSelector(
    (state) => state.PageOverview.showPageHelathColumn
  );
  useEffect(() => {
    if (userID && contextData == false) {
      axios
        .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
        .then((res) => {
          if (res.data[33].view_value == 1) {
            setContextData(true);
          }
        });
    }
    setTimeout(() => {}, 500);
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

  const handleUpdateRowClick = async (row) => {
    await axios
      .get(`${baseUrl}` + `get_exe_history/${row.pageMast_id}`)
      .then((res) => {
        let data = res.data.data.filter((e) => {
          return e.isDeleted !== true;
        });
        data = data[0];

        navigate(`/admin/exe-update/${data._id}`, {
          state: row.pageMast_id,
        });
      });
  };

  const handleHistoryRowClick = (row) => {
    navigate(`/admin/exe-history/${row.pageMast_id}`, {
      state: row.pageMast_id,
    });
  };

  const getData = () => {
    setProgress(0);
    setLoading(true);
    setProgress(20);

    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformData(res.data.data);
    });

    setProgress(30);
    axios.get(baseUrl + "getPageCatgList").then((res) => {
      setCat(res.data.data);
    });

    axios.get(baseUrl + "vendorAllData").then((res) => {
      setVenodr(res.data.tmsVendorkMastList);
    });
    setProgress(40);
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUser(res.data.data);
      setProgress(70);
    });
  };

  useEffect(() => {
    axios.get(baseUrl + "getPageMastList").then((res) => {
      setProgress(100);
      let data = res.data.data;

      data = data.map((e) => {
        return {
          ...e,
          tag_category_name: cat
            .filter((item) => {
              return e.tag_category?.includes(item._id);
            })
            .map((item) => item.page_category)
            .join(","),
        };
      });

      const addPricesToParent = (dataArray) => {
        return dataArray.map((item) => {
          item.purchase_price.forEach((priceObj) => {
            // const keyName = `price_${priceObj.price_type_id}`;
            const keyName = allPriceTypeList?.find(
              (d) => d.price_type_id == priceObj.price_type_id
            )?.price_type;
            console.log(keyName, "keyName");
            console.log(priceObj.price_type_id, "keyName");
            item[keyName] = priceObj.price;
          });
          // delete item.purchase_price;
          return item;
        });
      };

      const updatedData = addPricesToParent(data);

      setVendorTypes(updatedData);
      setFilterData(updatedData.reverse());
      setLoading(false);
    });

    // {
    //   field: "price_type",
    //   headerName: "Price Type",
    //   width: 200,
    //   renderCell: (params) => {
    //     let name = allPriceTypeList?.find(
    //       (item) => item.price_type_id == params.row.price_type_id
    //     )?.price_type;
    //     return <div>{name}</div>;
    //   },
    // },

    // {
    //   field: "price",
    //   headerName: "Price",
    //   width: 200,
    // },
  }, [cat]);

  useEffect(() => {
    axios.get(baseUrl + `get_exe_historyData`).then((res) => {
      let data = vendorTypes.map((e) => {
        let result = res.data.result.filter((d) => {
          return d.pageMast_id == e.pageMast_id;
        });
        let totalPercentage = 0;
        result.forEach((e) => {
          totalPercentage += e.percentage;
        });
        e.totalPercentage = totalPercentage;
        e.latestEntry = result[result.length - 1];
        return e;
      });
      setFilterData(data);
    });
  }, [vendorTypes]);

  useEffect(() => {
    setAllallPriceTypeList([]);
    axios.get(baseUrl + `get_all_data_list`).then((res) => {
      setAllallPriceTypeList(res.data.data);
    });
  }, []);

  const handlePriceClick = (row) => {
    return function () {
      setPriceData(row.purchase_price);
      setShowPriceModal(true);
    };
  };

  const handleClose = () => {
    setShowPriceModal(false);
  };

  const dataGridcolumns = [
    {
      field: "S.NO",
      headerName: "Count",
      renderCell: (params) => <div>{filterData.indexOf(params.row) + 1}</div>,

      width: 80,
    },
    {
      field: "page_user_name",
      headerName: "User Name",
      width: 200,
      editable: true,
      // EditTwoTone: (params) => {
      //   let name = params.row.page_user_name;
      //   // let hideName = name.slice(1, name.length);
      //   // let star = name.slice(0, 1);
      //   // for (let i = 0; i < hideName.length; i++) {
      //   //   star += "*";
      //   // }
      //   return <Link target="__black" to={params.row.link} className="link-primary" >{name}</Link>;
      // },
      renderCell: (params) => {
        let name = params.row.page_user_name;
        return (
          <Link target="__black" to={params.row.link} className="link-primary">
            {name}
          </Link>
        );
      },
    },
    { field: "page_level", headerName: "Level", width: 200 },
    { field: "page_status", headerName: "Status", width: 200 },
    { field: "ownership_type", headerName: "Ownership", width: 200 },
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
        let name = cat?.find(
          (item) => item?._id == params.row?.page_catg_id
        )?.page_category;

        return <div>{name}</div>;
      },
    },
    {
      field: "followers_count",
      headerName: "Followers",
      width: 200,
    },
    {
      field: "vendorMast_id",
      headerName: "Vendor",
      renderCell: (params) => {
        let name = venodr?.find(
          (item) => item?.vendorMast_id == params.row?.vendorMast_id
        )?.vendorMast_name;

        return <div>{name}</div>;
      },
      width: 200,
    },

    {
      field: "platform_active_on",
      headerName: "Active Platform",
      width: 200,
      renderCell: (params) => {
        let data = platformData.filter((item) => {
          return params.row.platform_active_on.includes(item._id);
        });
        return (
          <div>
            {data.length > 0 && (
              <Button
                className="text-center"
                // onClick={handlePlatfrormClick(data)}
                onClick={() => {
                  console.log(params.row);
                }}
              >
                <KeyboardDoubleArrowUpIcon />
              </Button>
            )}
          </div>
        );
      },
    },
    {
      field: "tag_category_name",
      headerName: "Tag Category",
      width: 200,
      renderCell: (params) => {
        let data = cat.filter((item) => {
          return params.row?.tag_category?.includes(item._id);
        });
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
                  {params.row.tag_category_name}
                  {i !== data.length - 1 && ","}
                </p>
              );
            })}
            {/* {data.length > 0 && (
              <Button className="text-center" onClick={handleTagCategory(data)}>
                <CategoryIcon />
              </Button>
            )} */}
          </div>
        );
      },
    },
    {
      field: "engagment_rate",
      headerName: "ER",
      width: 200,
    },
    {
      field: "page_closed_by",
      headerName: "Closed By",
      width: 200,
      renderCell: (params) => {
        let name = user?.find(
          (item) => item?.user_id == params.row?.page_closed_by
        )?.user_name;

        return <div>{name}</div>;
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
    // {
    //   field: "price_type_id",
    //   headerName: "Price Type",
    //   renderCell: ({ row }) => {
    //     let f = allPriceTypeList?.filter((item) =>
    //       row?.price_type_id?.includes(item?.price_type_id)
    //     );
    //     return (
    //       <>
    //         {f.map((item, i) => {
    //           return (
    //             <>
    //               {item?.price_type}
    //               {i !== f.length - 1 && ","}
    //             </>
    //           );
    //         })}
    //       </>
    //     );
    //   },
    // },
    { field: "price_cal_type", headerName: "Rate Type", width: 200 },
    { field: "variable_type", headerName: "Variable Type", width: 200 },
    {
      field: "purchase_price",
      headerName: "Price",
      width: 200,
      renderCell: ({ row }) => {
        return (
          <div>
            {row.purchase_price.length > 0 && (
              <button
                title="Price"
                onClick={handlePriceClick(row)}
                className="btn btn-outline-primary btn-sm user-button"
              >
                <PriceCheckIcon />
              </button>
            )}
          </div>
        );
      },
    },
    { field: "Reel", headerName: "Reel", width: 200 },
    { field: "Post", headerName: "Post", width: 200 },
    { field: "Both", headerName: "Both", width: 200 },
    {
      field: "Action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <div className="d-flex align-center ">
          <Link
            className="mt-2"
            to={`/admin/pms-purchase-price/${params.row.pageMast_id}`}
          >
            <button
              title="Purchase Price"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <RequestPageIcon />{" "}
            </button>
          </Link>
          <Link className="mt-2" to={`/admin/pms-page-edit/${params.row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          <DeleteButton
            endpoint="deletePageMast"
            id={params.row._id}
            getData={getData}
          />
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
          (item) => item.price_type_id == params.row.price_type_id
        )?.price_type;
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
          totalPercentage == 100 ||
          (totalPercentage == 0.0 && (
            <button
              type="button"
              className="btn cmnbtn btn_sm btn-outline-primary"
              data-toggle="modal"
              data-target="#myModal1"
              disabled={
                totalPercentage == 0 || totalPercentage == 100 ? false : true
              }
              onClick={() => {
                dispatch(addRow(params.row));
                navigate(`/admin/stats`);
              }}
            >
              Set Stats
            </button>
          ))
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
            disabled={
              params?.row?.latestEntry?.stats_update_flag
                ? !params?.row?.latestEntry.stats_update_flag
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
            className="btn cmnbtn btn_sm btn-outline-primary"
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
      field: "totalPercentage",
      width: 150,
      headerName: "Stats Update %",
      renderCell: (params) => {
        return params.row.totalPercentage > 0
          ? Math.round(+params.row?.totalPercentage) + "%"
          : params.row.totalPercentageForExeHistory + "%";
      },
    },
    {
      field: "stats_update_flag ",
      width: 150,
      headerName: "Stats Update Flag",
      renderCell: (params) => {
        const num = params?.row?.latestEntry?.stats_update_flag
          ? params?.row?.latestEntry.stats_update_flag
          : false;
        return num ? "Yes" : "No";
      },
    },
    {
      field: "Age_13_17_percent",
      width: 150,
      headerName: "Age 13-17 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.Age_13_17_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_18_24_percent",
      width: 150,
      headerName: "Age 18-24 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.Age_18_24_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_25_34_percent",
      width: 150,
      headerName: "Age 25-34 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.Age_25_34_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_35_44_percent",
      width: 150,
      headerName: "Age 35-44 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.Age_35_44_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_45_54_percent",
      width: 150,
      headerName: "Age 45-54 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.Age_45_54_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_55_64_percent",
      width: 150,
      headerName: "Age 55-64 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.Age_55_64_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_65_plus_percent",
      width: 150,
      headerName: "Age 65+ %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.Age_65_plus_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      field: "Age_upload",
      width: 150,
      headerName: "Age Upload",
      renderCell: (params) => {
        let url = params.row?.exehistorymodelsData?.Age_upload;
        return url ? (
          <img src={url} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
    {
      field: "city1_name",
      width: 150,
      headerName: "City 1",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.city1_name;
        return data ? data : "NA";
      },
    },
    {
      field: "city2_name",
      width: 150,
      headerName: "City 2",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.city2_name;
        return data ? data : "NA";
      },
    },
    {
      field: "city3_name",
      width: 150,
      headerName: "City 3",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.city3_name;
        return data ? data : "NA";
      },
    },
    {
      field: "city4_name",
      width: 150,
      headerName: "City 4",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.city4_name;
        return data ? data : "NA";
      },
    },
    {
      field: "city5_name",
      width: 150,
      headerName: "City 5",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.city5_name;
        return data ? data : "NA";
      },
    },
    {
      field: "city_image_upload",
      width: 150,
      headerName: "City Image",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.city_image_upload;
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
      headerName: "Country 1",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.country1_name;
        return data ? data : "NA";
      },
    },
    {
      field: "country2_name",
      width: 150,
      headerName: "Country 2",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.country2_name;
        return data ? data : "NA";
      },
    },
    {
      field: "country3_name",
      width: 150,
      headerName: "Country 3",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.country3_name;
        return data ? data : "NA";
      },
    },
    {
      field: "country4_name",
      width: 150,
      headerName: "Country 4",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.country4_name;
        return data ? data : "NA";
      },
    },
    {
      field: "country5_name",
      width: 150,
      headerName: "Country 5",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.country5_name;
        return data ? data : "NA";
      },
    },
    {
      field: "country_image_upload",
      width: 150,
      headerName: "Country Image",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.country_image_upload;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
    {
      field: "creation_date",
      width: 150,
      headerName: "Creation Date",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.creation_date;
        return data ? <DateFormattingComponent date={data} /> : "NA";
      },
    },
    {
      field: "end_date",
      width: 150,
      headerName: "End Date",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.end_date;
        return data ? <DateFormattingComponent date={data} /> : "NA";
      },
    },
    {
      field: "engagement",
      width: 150,
      headerName: "Engagement",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.engagement;
        return data ? data : "NA";
      },
    },
    {
      field: "engagement_upload_image",
      width: 150,
      headerName: "Engagement Image",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.engagement_upload_image;
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
      header: "Female",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.female_percent;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "impression",
      width: 150,
      headerName: "Impression",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.impression;
        return data ? data : "NA";
      },
    },
    {
      field: "impression_upload_image",
      width: 150,
      headerName: "Impression Image",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.impression_upload_image;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
    {
      field: "male_percent",
      width: 150,
      header: "Male",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.male_percent;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "percentage_city1_name",
      width: 150,
      headerName: "City 1 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_city1_name;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "percentage_city2_name",
      width: 150,
      headerName: "City 2 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_city2_name;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "percentage_city3_name",
      width: 150,
      headerName: "City 3 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_city3_name;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "percentage_city4_name",
      width: 150,
      headerName: "City 4 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_city4_name;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "percentage_city5_name",
      width: 150,
      headerName: "City 5 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_city5_name;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "percentage_country1_name",
      width: 150,
      headerName: "Country 1 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_country1_name;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "percentage_country2_name",
      width: 150,
      headerName: "Country 2 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_country2_name;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "percentage_country3_name",
      width: 150,
      headerName: "Country 3 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_country3_name;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "percentage_country4_name",
      width: 150,
      headerName: "Country 4 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_country4_name;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "percentage_country5_name",
      width: 150,
      headerName: "Country 5 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_country5_name;
        return data ? data + "%" : "NA";
      },
    },
    {
      field: "profile_visit",
      width: 150,
      headerName: "Profile Visit",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.profile_visit;
        return data ? data : "NA";
      },
    },
    {
      field: "quater",
      width: 150,
      headerName: "Quater",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.quater;
        return data ? data : "NA";
      },
    },
    {
      field: "reach",
      width: 150,
      headerName: "Reach",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.reach;
        return data ? data : "NA";
      },
    },
    {
      field: "reach_upload_image",
      width: 150,
      headerName: "Reach Image",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.reach_upload_image;
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
        let data = params.row?.exehistorymodelsData?.story_click;
        return data ? <DateFormattingComponent date={data} /> : "NA";
      },
    },
    {
      field: "stats_for",
      width: 150,
      headerName: "Stats For",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.stats_for;
        return data ? data : "NA";
      },
    },
    {
      field: "story_view",
      width: 150,
      headerName: "Story View",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.story_view;
        return data ? data : "NA";
      },
    },
    {
      field: "story_view_upload_image",
      width: 150,
      headerName: "Story View Image",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.story_view_upload_image;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
  ];

  if (showPageHealthColumn) {
    dataGridcolumns.push(...pageHealthColumn);
  }

  // const copyToClipboard = (text) => {
  //   const textarea = document.createElement("textarea");
  //   textarea.value = text;
  //   document.body.appendChild(textarea);
  //   textarea.select();
  //   document.execCommand("copy");
  //   document.body.removeChild(textarea);
  // };

  // const copySelectedRows = (type) => {
  //   // Your existing code to retrieve the selected rows and format the data
  //   let selectedRows = Array.from(
  //     document.getElementsByClassName("MuiDataGrid-row")
  //   ).filter((row) => row.classList.contains("Mui-selected"));

  //   let data = selectedRows.map((row) => {
  //     let rowData = {};
  //     for (let j = 1; j < row.children.length - 1; j++) {
  //       if (dataGridcolumns[j].field !== "Action") {
  //         rowData[dataGridcolumns[j].field] = row.children[j].innerText;
  //       }
  //     }
  //     return rowData;
  //   });

  //   if (type === 0) {
  //     // Copy data without using the clipboard API
  //     let copyData = data.map((row) => {
  //       return {
  //         "Page Name": row.page_level,
  //         Link: row.platform_id,
  //       };
  //     });

  //     let formattedData = copyData.map((row) => {
  //       let formattedRow = `Page Name: ${row["Page Name"]}\nPage Link: ${row["Link"]}\n`;
  //       return formattedRow;
  //     });

  //     copyToClipboard(formattedData.join("\n"));
  //     toastAlert("Data Copied Successfully", "success");
  //     return;
  //   }

  //   // Copy data using the clipboard API
  //   let formattedData = data.map((row) => {
  //     let formattedRow = `Page Name: ${row["page_level"]}\nFollowers: ${row["followers_count"]}\nPage Link: ${row["platform_id"]}\nPlatform: ${row["page_catg_id"]}\nCategory: ${row["followers_count"]}\nOwnership Type: ${row["link"]}\nPage Status: ${row["ownership_type"]}\n`;
  //     return formattedRow;
  //   });

  //   copyToClipboard(formattedData.join("\n"));
  //   toastAlert("Data Copied Successfully", "success");
  // };

  // const copyAllRows = () => {
  //   let copyData = filterData.map((row) => {
  //     return {
  //       "Page Name": row.page_user_name,
  //       Followers: row.followers_count,
  //       "Page Link": row.link,
  //       Platform: row.PMS_paform_data.platform_name,
  //       Category: row.PMS_Pagecategories.page_category,
  //       Vendor: venodr.find((item) => item.vendorMast_id == row.vendorMast_id)
  //         ?.vendorMast_name,
  //       "Platform Active On": row.platform_active_on,
  //       "Engagment Rate": row.engagment_rate,
  //       "Closed By": row.page_closed_by,
  //       "Page Name Type": row.page_name_type,
  //       "Content Creation": row.content_creation,
  //     };
  //   });

  //   let formattedData = copyData.map((row) => {
  //     let formattedRow = `Page Name: ${row["Page Name"]}\n   Followers: ${row["Followers"]}\n   Page Link: ${row["Page Link"]} \n   Platform: ${row["Platform"]}\n   Category: ${row["Category"]}\n   Vendor: ${row["Vendor"]}\n   Platform Active On: ${row["Platform Active On"]}\n   Engagment Rate: ${row["Engagment Rate"]}\n   Closed By: ${row["Closed By"]}\n   Page Name Type: ${row["Page Name Type"]}\n   Content Creation: ${row["Content Creation"]}\n`;
  //     return formattedRow;
  //   });

  //   navigator.clipboard.writeText(formattedData.join("\n\n"));
  //   toastAlert("Data Copied Successfully", "success");
  // };

  return (
    <>
      {/* Design Start */}
      <div className="pageOverviewWrapper">
        <div className="pageOverviewWrapperLeft">
          <div className="pageOverviewBoard card">
            <div className="card-body">
              <div className="pageSourceHeader">
                <ul>
                  <li className="active">
                    <a href="#">Instagram</a>
                  </li>
                </ul>
              </div>
              <div className="pageSourceBody">
                <div className="pageInsight">
                  <div className="pageInsightHead">
                    <div className="pageTitle">
                      <span>
                        <img className="logo-img" src={instaIcon} alt="icon" />
                      </span>
                      <h2>Creativefuel</h2>
                    </div>
                    <div className="pageAction">
                      <div className="pageActionUl">
                        <div className="pageActionLi">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="default"
                              id="dropdownStats"
                            >
                              <span>0.00%</span>Stats
                              <button className="btn toggleArrowBtn">
                                <i class="bi bi-chevron-down"></i>
                              </button>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">
                                Set Stats
                              </Dropdown.Item>
                              <Dropdown.Item href="#/action-2">
                                Update Stats
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        <div className="pageActionLi">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="default"
                              id="dropdownMore"
                            >
                              <i class="bi bi-three-dots-vertical"></i> More
                              <button className="btn toggleArrowBtn">
                                <i class="bi bi-chevron-down"></i>
                              </button>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Item id="historyToggle">
                                History
                              </Dropdown.Item>
                              <Dropdown.Item href="#/action-3">
                                Purchase price
                              </Dropdown.Item>
                              <Dropdown.Item
                                href="#/action-4"
                                className="dangerText"
                              >
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pageInsightText">
                    <h2>Instagram Account Insight</h2>
                    <h4>
                      This graph shows the total size of your fanbase across
                      your tracked social & streaming platforms.
                    </h4>
                  </div>
                  <div className="pageInsightChart row">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-12">
                      <div className="pageInsightChartText">
                        <h4>Profile Visit</h4>
                        <h2>12M</h2>
                        <h4>
                          4<small>th</small> Quater
                        </h4>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 col-12">
                      <div className="pageInsightChartData">
                        <div id="chart">
                          <ReactApexChart
                            options={pieChart.options}
                            series={pieChart.series}
                            type="donut"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="pageChart demographic">
                  <div className="pageChartHead">
                    <h2>Demographics (Age Group)</h2>
                    <button className="btn">
                      View image <i class="bi bi-image-fill"></i>
                    </button>
                  </div>
                  <div className="pageChartArea">
                    <div id="chartTwo">
                      <ReactApexChart
                        options={columnChartAge.options}
                        series={columnChartAge.series}
                        type="bar"
                        height={200}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="pageChart country">
                  <div className="pageChartHead">
                    <h2>Top Country</h2>
                    <button className="btn">
                      View image <i class="bi bi-image-fill"></i>
                    </button>
                  </div>
                  <div className="pageChartArea">
                    <div id="chartThree">
                      <ReactApexChart
                        options={columnChartCountry.options}
                        series={columnChartCountry.series}
                        type="bar"
                        height={200}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="pageChart city">
                  <div className="pageChartHead">
                    <h2>Top City</h2>
                    <button className="btn">
                      View image <i class="bi bi-image-fill"></i>
                    </button>
                  </div>
                  <div className="pageChartArea">
                    <div id="chartFour">
                      <ReactApexChart
                        options={columnChartCity.options}
                        series={columnChartCity.series}
                        type="bar"
                        height={200}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="pageStats">
                  <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                      <div className="pageStateBox">
                        <h2>Engagement</h2>
                        <h3>00</h3>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                      <div className="pageStateBox">
                        <h2>Impression</h2>
                        <h3>00</h3>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                      <div className="pageStateBox">
                        <h2>Reach</h2>
                        <h3>00</h3>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                      <div className="pageStateBox">
                        <h2>Stats</h2>
                        <h3>00</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pageOverviewWrapperRight">
          <div className="pageHistoryBoard card">
            <div class="card-header flexCenterBetween">
              <h5 class="card-title">History</h5>
              <button id="closeHistory" className="btn iconBtn">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="card-body">
              <div className="historyUserCardList">
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="stateHistoryWrapper">
        <div className="card">
          <div class="card-body flexCenterBetween">
            <h5 class="card-title">Stats History</h5>
            <div class="form-group flexCenter colGap8 w-40 m0">
              <label class="w-25 m0">Stats for</label>
              <select class="form-control form_sm">
                <option value="">All</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="fortnight">Fortnight</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card">
          <div class="card-header">
            <h5 class="card-title">Followers Bifurcation</h5>
          </div>
          <div className="card-body pb8">
            <div className="row thm_form">
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>
                    Reach <span className="dangerText">*</span>
                  </label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <button
                      class="btn iconBtn btn-outline-border"
                      type="button"
                    >
                      <i class="bi bi-cloud-arrow-up-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>
                    Impressions <span className="dangerText">*</span>
                  </label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <button
                      class="btn iconBtn btn-outline-border"
                      type="button"
                    >
                      <i class="bi bi-cloud-arrow-up-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>
                    Engagement <span className="dangerText">*</span>
                  </label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <button
                      class="btn iconBtn btn-outline-border"
                      type="button"
                    >
                      <i class="bi bi-cloud-arrow-up-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>
                    Story View <span className="dangerText">*</span>
                  </label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <button
                      class="btn iconBtn btn-outline-border"
                      type="button"
                    >
                      <i class="bi bi-cloud-arrow-up-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>Story View Date</label>
                  <input type="date" class="form-control" />
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>Profile Visit</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div class="card-header">
            <h5 class="card-title">City</h5>
          </div>
          <div className="card-body pb8">
            <div className="row thm_form">
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>City 1</label>
                  <div className="row m0">
                    <div className="col-md-9 p0 mr8">
                      <select className="form-control">
                        <option value="">Select City</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                    <div className="col p0">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control pl4 pr4 text-center"
                        />
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>City 2</label>
                  <div className="row m0">
                    <div className="col-md-9 p0 mr8">
                      <select className="form-control">
                        <option value="">Select City</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                    <div className="col p0">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control pl4 pr4 text-center"
                        />
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>City 3</label>
                  <div className="row m0">
                    <div className="col-md-9 p0 mr8">
                      <select className="form-control">
                        <option value="">Select City</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                    <div className="col p0">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control pl4 pr4 text-center"
                        />
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>City 4</label>
                  <div className="row m0">
                    <div className="col-md-9 p0 mr8">
                      <select className="form-control">
                        <option value="">Select City</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                    <div className="col p0">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control pl4 pr4 text-center"
                        />
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>City 5</label>
                  <div className="row m0">
                    <div className="col-md-9 p0 mr8">
                      <select className="form-control">
                        <option value="">Select City</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                    <div className="col p0">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control pl4 pr4 text-center"
                        />
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <button className="btn cmnbtn btn-primary mt24">
                    <i class="bi bi-cloud-arrow-up-fill"></i> Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div class="card-header">
            <h5 class="card-title">Country</h5>
          </div>
          <div className="card-body pb8">
            <div className="row thm_form">
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>Country 1</label>
                  <div className="row m0">
                    <div className="col-md-9 p0 mr8">
                      <select className="form-control">
                        <option value="">Select Country</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                    <div className="col p0">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control pl4 pr4 text-center"
                        />
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>Country 2</label>
                  <div className="row m0">
                    <div className="col-md-9 p0 mr8">
                      <select className="form-control">
                        <option value="">Select Country</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                    <div className="col p0">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control pl4 pr4 text-center"
                        />
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>Country 3</label>
                  <div className="row m0">
                    <div className="col-md-9 p0 mr8">
                      <select className="form-control">
                        <option value="">Select Country</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                    <div className="col p0">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control pl4 pr4 text-center"
                        />
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>Country 4</label>
                  <div className="row m0">
                    <div className="col-md-9 p0 mr8">
                      <select className="form-control">
                        <option value="">Select Country</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                    <div className="col p0">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control pl4 pr4 text-center"
                        />
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>Country 5</label>
                  <div className="row m0">
                    <div className="col-md-9 p0 mr8">
                      <select className="form-control">
                        <option value="">Select Country</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                    <div className="col p0">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control pl4 pr4 text-center"
                        />
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <button className="btn cmnbtn btn-primary mt24">
                    <i class="bi bi-cloud-arrow-up-fill"></i> Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div class="card-header">
            <h5 class="card-title">Age Group</h5>
          </div>
          <div className="card-body pb8">
            <div className="row thm_form">
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>13 - 17</label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>18 - 24</label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>25 - 34</label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>35 - 44</label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>45 - 54</label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>55 - 64</label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>65+</label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <button className="btn cmnbtn btn-primary mt24">
                    <i class="bi bi-cloud-arrow-up-fill"></i> Image
                  </button>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <p className="mt24 dangerText">
                    Note: Total percentage must be at least 98%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div class="card-header">
            <h5 class="card-title">Gender</h5>
          </div>
          <div className="card-body pb8">
            <div className="row thm_form">
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>Male</label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="form-group">
                  <label>Female</label>
                  <div class="input-group">
                    <input type="text" class="form-control" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flexCenter colGap16">
              <button class="btn cmnbtn btn-primary" type="button">
                Save
              </button>
              <button class="btn cmnbtn btn-secondary" type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Design End */}
      <Link to={`/admin/pms-page-master`}>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{ marginBottom: "10px" }}
        >
          Add Page
        </button>
      </Link>
      {/* <Stack direction="row" spacing={1}>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{ marginBottom: "10px" }}
          onClick={() => copySelectedRows(1)}
        >
          <ContentCopyOutlinedIcon />
          Copy Selected Pages
        </button>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{ marginBottom: "10px" }}
          onClick={copyAllRows}
        >
          <CopyAllOutlinedIcon />
          Copy All Pages
        </button>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{ marginBottom: "10px" }}
          onClick={() => copySelectedRows(0)}
        >
          <ContentPasteIcon />
          Copy Selected Page Name & Links
        </button>
      </Stack> */}
      <Stack direction="row" spacing={1}>
        <Switch
          checked={showPageHealthColumn}
          onChange={() =>
            dispatch(setShowPageHealthColumn(!showPageHealthColumn))
          }
          name="Page Health"
          color="primary"
        />
        <Typography variant="h6">Page Health</Typography>
      </Stack>
      <div className="card">
        <div className="data_tbl table-responsive">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Page</h5>
              <div className="card-text">
                <div className="row">
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-profile-type"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Profile Type
                    </Link>
                  </div>
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-page-category"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Page Category
                    </Link>
                  </div>
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-page-category"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Page Ownership
                    </Link>
                  </div>{" "}
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-platform"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Platform
                    </Link>
                  </div>
                  <div className="col-md-2">
                    <Link
                      to="/admin/pms-platform-price-type"
                      className="btn btn-primary btn-sm "
                      id="pageName"
                    >
                      Platform Price
                    </Link>
                  </div>
                </div>
                <div className="row my-2">
                  {platformData?.map((item, i) => {
                    return (
                      <div key={i} className="col-md-2">
                        <button
                          onClick={() => {
                            let result = vendorTypes.filter((d) => {
                              return d.platform_id == item._id;
                            });

                            setFilterData(result);
                          }}
                          className="btn btn-primary btn-sm"
                          id="pageName"
                        >
                          {item.platform_name} (
                          {
                            vendorTypes.filter((d) => {
                              return d.platform_id == item._id;
                            }).length
                          }
                          )
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div>
                  {[
                    ...new Set(
                      vendorTypes.map((item) => {
                        return item?.ownership_type;
                      })
                    ),
                  ].map((item, i) => {
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          let result = vendorTypes.filter((d) => {
                            return d.ownership_type == item;
                          });
                          setFilterData(result);
                        }}
                        className="btn btn-primary btn-sm me-5"
                        id="pageName"
                      >
                        {item} (
                        {
                          vendorTypes.filter((d) => {
                            return d.ownership_type == item;
                          }).length
                        }
                        )
                      </button>
                    );
                  })}
                  <div className="mt-2">
                    <h4>Page Status</h4>

                    {[
                      ...new Set(
                        vendorTypes.map((item) => {
                          return item?.page_status;
                        })
                      ),
                    ].map((item, i) => {
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            let result = vendorTypes.filter((d) => {
                              return d.page_status == item;
                            });
                            setFilterData(result);
                          }}
                          className="btn btn-primary btn-sm me-5 mt-2"
                          id="pageName"
                        >
                          {item} (
                          {
                            vendorTypes.filter((d) => {
                              return d.page_status == item;
                            }).length
                          }
                          )
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <h4>Page Name Type</h4>
                    {[
                      ...new Set(
                        vendorTypes.map((item) => {
                          return item?.page_name_type;
                        })
                      ),
                    ].map((item, i) => {
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            let result = vendorTypes.filter((d) => {
                              return d.page_name_type == item;
                            });
                            setFilterData(result);
                          }}
                          className="btn btn-primary btn-sm me-5 mt-2"
                          id="pageName"
                        >
                          {item} (
                          {
                            vendorTypes.filter((d) => {
                              return d.page_name_type == item;
                            }).length
                          }
                          )
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <h4>Closed By</h4>
                    {[
                      ...new Set(
                        vendorTypes.map((item) => {
                          return item?.page_closed_by;
                        })
                      ),
                    ].map((item, i) => {
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            let result = vendorTypes.filter((d) => {
                              return d.page_closed_by == item;
                            });
                            setFilterData(result);
                          }}
                          className="btn btn-primary btn-sm me-5 mt-2"
                          id="pageName"
                        >
                          {
                            user?.find((e) => {
                              return e.user_id == item;
                            })?.user_name
                          }{" "}
                          (
                          {
                            vendorTypes.filter((d) => {
                              return d.page_closed_by == item;
                            }).length
                          }
                          )
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <h4>Category</h4>
                    {[
                      ...new Set(
                        vendorTypes.map((item) => {
                          return item?.page_catg_id;
                        })
                      ),
                    ].map((item, i) => {
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            let result = vendorTypes.filter((d) => {
                              return d.page_catg_id == item;
                            });
                            setFilterData(result);
                          }}
                          className="btn btn-primary btn-sm me-5 mt-2"
                          id="pageName"
                        >
                          {
                            cat?.find((e) => {
                              return e._id == item;
                            })?.page_category
                          }{" "}
                          (
                          {
                            vendorTypes.filter((d) => {
                              return d.page_catg_id == item;
                            }).length
                          }
                          )
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <h4>Ownership</h4>
                    {[
                      ...new Set(
                        vendorTypes.map((item) => {
                          return item?.ownership_type;
                        })
                      ),
                    ].map((item, i) => {
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            let result = vendorTypes.filter((d) => {
                              return d.ownership_type == item;
                            });
                            setFilterData(result);
                          }}
                          className="btn btn-primary btn-sm me-5 mt-2"
                          id="pageName"
                        >
                          {item} (
                          {
                            vendorTypes.filter((d) => {
                              return d.ownership_type == item;
                            }).length
                          }
                          )
                        </button>
                      );
                    })}
                  </div>
                  <br />
                  <hr />
                  {!isNotAssignedVendorLoading && (
                    <div className="mt-2">
                      <button
                        onClick={handleNotAssignedVendorClick}
                        className="btn btn-primary btn-sm me-5 mt-2"
                        id="pageName"
                      >
                        Not Assigned Vendor {notAssignedVenodrData.length}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <Box
              sx={
                {
                  textAlign: "center",
                  position: "relative",
                  margin: "auto",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }
                // {

                // }
              }
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
            <Box sx={{ height: 400, width: "100%" }}>
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
                onCellEditStop={(params) =>
                  setTimeout(() => handleEditCellChange(params), 1000)
                }
                pageSize={5}
                rowsPerPageOptions={[5]}
                rowHeight={38}
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
      <Dialog
        open={showPriceModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Price Details"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <DataGrid
              rows={priceData}
              columns={priceColumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              getRowId={(row) => row.price_type_id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            />
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
    </>
  );
};

export default PageOverview;
