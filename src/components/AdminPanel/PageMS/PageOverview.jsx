import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
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
import { render } from "react-dom";

const PageOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [vendorTypes, setVendorTypes] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [platform, setPlatform] = useState([{}]);
  const [cat, setCat] = useState([{}]);
  const [venodr, setVenodr] = useState([{}]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [platformData, setPlatformData] = useState([]);
  const [allPriceTypeList, setAllallPriceTypeList] = useState([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceData, setPriceData] = useState({});

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
    setAllallPriceTypeList([]);
    axios.get(baseUrl + `get_all_data_list`).then((res) => {
      setAllallPriceTypeList(res.data.data);
    });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const handlePriceClick = (row) => {
    return function () {
      console.log(row.purchase_price, "row._id by Manoj");
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
        let name = platform?.find(
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
        console.log(params.row.platform_active_on, "platform_active_on");
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
      headerName: "Colosed By",
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
        // console.log(row.purchase_price,"purchase_price")
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
