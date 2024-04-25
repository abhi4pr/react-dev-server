import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
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
import { useDispatch } from "react-redux";
import { addRow } from "../../Store/Executon-Slice";
import DateFormattingComponent from "../../DateFormator/DateFormared";

const PageOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [vendorTypes, setVendorTypes] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [cat, setCat] = useState([{}]);
  const [venodr, setVenodr] = useState([{}]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [platformData, setPlatformData] = useState([]);
  const [allPriceTypeList, setAllallPriceTypeList] = useState([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceData, setPriceData] = useState({});
  const [contextData, setContextData] = useState(false);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    navigate(`/admin/exe-history/${row.exepurchasemodel.p_id}`, {
      state: row.exepurchasemodel.p_id,
    });
  };

  const getData = () => {
    setProgress(0);
    setLoading(true);
    setProgress(20);

    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformData(res.data.data);
    });

    axios.get(baseUrl + "getPageMastList").then((res) => {
      setProgress(60);
      setVendorTypes(res.data.data);
      setFilterData(res.data.data.reverse());

      setLoading(false);
    });
    setProgress(80);
    axios.get(baseUrl + "getPageCatgList").then((res) => {
      setCat(res.data.data);
    });

    axios.get(baseUrl + "vendorAllData").then((res) => {
      setVenodr(res.data.tmsVendorkMastList);
    });
    setProgress(90);
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUser(res.data.data);
      setProgress(100);
    });
  };

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
      headerName: "S.NO",
      renderCell: (params) => <div>{filterData.indexOf(params.row) + 1}</div>,

      width: 130,
    },
    {
      field: "page_user_name",
      headerName: "Page user Name",
      width: 200,
      renderCell: (params) => {
        let name = params.row.page_user_name;
        let hideName = name.slice(1, name.length);
        let star = name.slice(0, 1);
        for (let i = 0; i < hideName.length; i++) {
          star += "*";
        }
        return <div>{star}</div>;
      },
    },
    { field: "page_level", headerName: "Page level", width: 200 },
    { field: "page_status", headerName: "Page status", width: 200 },
    { field: "ownership_type", headerName: "Ownership type", width: 200 },
    {
      field: "link",
      headerNa: "Link",
      width: 200,
      renderCell: (params) => (
        <Link to={params.row.link} target="_blank" className="text-primary">
          <OpenInNewIcon />
        </Link>
      ),
    },
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
      headerName: "Platform Active On",
      width: 200,
      renderCell: (params) => {
        let data = platformData.filter((item) => {
          return params.row.platform_active_on.includes(item._id);
        });
        return (
          <div>
            {data.map((item, i) => {
              return (
                <>
                  {item.platform_name}
                  {i !== data.length - 1 && ","}
                </>
              );
            })}
          </div>
        );
      },
    },
    {
      field: "tag_category",
      headerName: "Tag Category",
      width: 200,
      renderCell: (params) => {
        let data = cat.filter((item) => {
          return params.row?.tag_category?.includes(item._id);
        });
        return (
          <div>
            {data?.map((item, i) => {
              return (
                <>
                  {item.page_category}
                  {i !== data.length - 1 && ","}
                </>
              );
            })}
          </div>
        );
      },
    },
    {
      field: "engagment_rate",
      headerName: "Engagment Rate",
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
      headerName: "Page Name Type",
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
    {
      field: "price_type_id",
      headerName: "Price Type",
      renderCell: ({ row }) => {
        let f = allPriceTypeList?.filter((item) =>
          row?.price_type_id?.includes(item?.price_type_id)
        );
        return (
          <>
            {f.map((item, i) => {
              return (
                <>
                  {item?.price_type}
                  {i !== f.length - 1 && ","}
                </>
              );
            })}
          </>
        );
      },
    },
    { field: "price_cal_type", headerName: "Rate Type", width: 200 },
    { field: "variable_type", headerName: "Variable Type", width: 200 },
    {
      field: "purchase_price",
      headerName: "Price",
      width: 200,
      renderCell: ({ row }) => {
        return (
          <div>
            {row.purchase_price && (
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
    { field: "description", headerName: "Description", width: 200 },
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
      header: "Female %",
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
      header: "Male %",
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
        return data ? data : "NA";
      },
    },
    {
      field: "percentage_city2_name",
      width: 150,
      headerName: "City 2 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_city2_name;
        return data ? data : "NA";
      },
    },
    {
      field: "percentage_city3_name",
      width: 150,
      headerName: "City 3 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_city3_name;
        return data ? data : "NA";
      },
    },
    {
      field: "percentage_city4_name",
      width: 150,
      headerName: "City 4 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_city4_name;
        return data ? data : "NA";
      },
    },
    {
      field: "percentage_city5_name",
      width: 150,
      headerName: "City 5 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_city5_name;
        return data ? data : "NA";
      },
    },
    {
      field: "percentage_country1_name",
      width: 150,
      headerName: "Country 1 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_country1_name;
        return data ? data : "NA";
      },
    },
    {
      field: "percentage_country2_name",
      width: 150,
      headerName: "Country 2 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_country2_name;
        return data ? data : "NA";
      },
    },
    {
      field: "percentage_country3_name",
      width: 150,
      headerName: "Country 3 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_country3_name;
        return data ? data : "NA";
      },
    },
    {
      field: "percentage_country4_name",
      width: 150,
      headerName: "Country 4 %",
      renderCell: (
        params
      ) => {
        let data = params.row?.exehistorymodelsData?.percentage_country4_name;
        return data ? data : "NA";
      },
    },
    {
      field: "percentage_country5_name",
      width: 150,
      headerName: "Country 5 %",
      renderCell: (params) => {
        let data = params.row?.exehistorymodelsData?.percentage_country5_name;
        return data ? data : "NA";
      },
    },
{
  field: "profile_visit",
  width: 150,
  headerName: "Profile Visit",
  renderCell: (params) => {
    let data = params.row?.exehistorymodelsData?.profile_visit;
    return data ? data : "NA";
  }
},
{
  field: "quater",
  width: 150,
  headerName: "Quater",
  renderCell: (params) => {
    let data = params.row?.exehistorymodelsData?.quater;
    return data ? data : "NA";
  }
},
{
  field: "reach",
  width: 150,
  headerName: "Reach",
  renderCell: (params) => {
    let data = params.row?.exehistorymodelsData?.reach;
    return data ? data : "NA";
  }
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
  }
},
{
  field: "start_date",
  width: 150,
  headerName: "Start Date",
  renderCell: (params) => {
    let data = params.row?.exehistorymodelsData?.story_click;
    return data ? <DateFormattingComponent  date={data} /> : "NA";
  }
},
{
  field: "stats_for",
  width: 150,
  headerName: "Stats For",
  renderCell: (params) => {
    let data = params.row?.exehistorymodelsData?.stats_for;
    return data ? (
      data) : (
      "NA"
    );}
  },
  {
    field: "story_view",
    width: 150,
    headerName: "Story View",
    renderCell: (params) => {
      let data = params.row?.exehistorymodelsData?.story_view;
      return data ? data : "NA";
    }
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
    }
  }



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

  const copyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const copySelectedRows = (type) => {
    // Your existing code to retrieve the selected rows and format the data
    let selectedRows = Array.from(
      document.getElementsByClassName("MuiDataGrid-row")
    ).filter((row) => row.classList.contains("Mui-selected"));

    let data = selectedRows.map((row) => {
      let rowData = {};
      for (let j = 1; j < row.children.length - 1; j++) {
        if (dataGridcolumns[j].field !== "Action") {
          rowData[dataGridcolumns[j].field] = row.children[j].innerText;
        }
      }
      return rowData;
    });

    if (type === 0) {
      // Copy data without using the clipboard API
      let copyData = data.map((row) => {
        return {
          "Page Name": row.page_level,
          Link: row.platform_id,
        };
      });

      let formattedData = copyData.map((row) => {
        let formattedRow = `Page Name: ${row["Page Name"]}\nPage Link: ${row["Link"]}\n`;
        return formattedRow;
      });

      copyToClipboard(formattedData.join("\n"));
      toastAlert("Data Copied Successfully", "success");
      return;
    }

    // Copy data using the clipboard API
    let formattedData = data.map((row) => {
      let formattedRow = `Page Name: ${row["page_level"]}\nFollowers: ${row["followers_count"]}\nPage Link: ${row["platform_id"]}\nPlatform: ${row["page_catg_id"]}\nCategory: ${row["followers_count"]}\nOwnership Type: ${row["link"]}\nPage Status: ${row["ownership_type"]}\n`;
      return formattedRow;
    });

    copyToClipboard(formattedData.join("\n"));
    toastAlert("Data Copied Successfully", "success");
  };

  const copyAllRows = () => {
    let copyData = filterData.map((row) => {
      return {
        "Page Name": row.page_user_name,
        Followers: row.followers_count,
        "Page Link": row.link,
        Platform: row.PMS_paform_data.platform_name,
        Category: row.PMS_Pagecategories.page_category,
        Vendor: venodr.find((item) => item.vendorMast_id == row.vendorMast_id)
          ?.vendorMast_name,
        "Platform Active On": row.platform_active_on,
        "Engagment Rate": row.engagment_rate,
        "Closed By": row.page_closed_by,
        "Page Name Type": row.page_name_type,
        "Content Creation": row.content_creation,
      };
    });

    let formattedData = copyData.map((row) => {
      let formattedRow = `Page Name: ${row["Page Name"]}\n   Followers: ${row["Followers"]}\n   Page Link: ${row["Page Link"]} \n   Platform: ${row["Platform"]}\n   Category: ${row["Category"]}\n   Vendor: ${row["Vendor"]}\n   Platform Active On: ${row["Platform Active On"]}\n   Engagment Rate: ${row["Engagment Rate"]}\n   Closed By: ${row["Closed By"]}\n   Page Name Type: ${row["Page Name Type"]}\n   Content Creation: ${row["Content Creation"]}\n`;
      return formattedRow;
    });

    navigator.clipboard.writeText(formattedData.join("\n\n"));
    toastAlert("Data Copied Successfully", "success");
  };

  return (
    <>
      <Link to={`/admin/pms-page-master`}>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{ marginBottom: "10px" }}
        >
          Add Page
        </button>
      </Link>
      <Stack direction="row" spacing={1}>
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
                          {item.platform_name}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="row">
                  {/* {
                  allPriceTypeList?.map((item,i) => {
                    return (
                      <div key={i} className="col-md-2">
                        <button
                          onClick={() => {
                            let result = vendorTypes.filter((d) => {
                              return d.price_type_id == item.price_type_id;
                            });
                            setFilterData(result);
                          }}

                          className="btn btn-primary btn-sm"
                          id="pageName"
                        >
                          {item.PMS_Platforms_data.price_type}
                        </button>
                      </div>
                    );
                  })
                
                } */}
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
      {/* } */}
    </>
  );
};

export default PageOverview;
