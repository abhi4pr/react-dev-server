import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Button, Grid, Stack } from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

const PageOverview = () => {
  const [vendorTypes, setVendorTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [platform, setPlatform] = useState([{}]);
  const [cat, setCat] = useState([{}]);
  const [venodr, setVenodr] = useState([{}]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    axios.get(baseUrl + "getPageMastList").then((res) => {
      setVendorTypes(res.data.data);
      setFilterData(res.data.data);
      setLoading(false);
    });
    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatform(res.data.data);
    });
    axios.get(baseUrl + "getPageCatgList").then((res) => {
      setCat(res.data.data);
    });

    axios.get(baseUrl + "vendorAllData").then((res) => {
      setVenodr(res.data.tmsVendorkMastList);
    });
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUser(res.data.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = vendorTypes?.filter((d) => {
      return d.page_user_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const dataGridcolumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => <div>{filterData.indexOf(params.row) + 1}</div>,

      width: 130,
    },
    { field: "page_user_name", headerName: "Page user Name", width: 200 },
    { field: "page_level", headerName: "Page level", width: 200 },
    { field: "page_status", headerName: "Page status", width: 200 },
    { field: "ownership_type", headerName: "Ownership type", width: 200 },
    {
      field: "link",
      header: "Link",
      width: 200,
      renderCell: (params) => (
        <Link to={params.row.link} target="_blank" className="text-primary">
          {params.row.link}
        </Link>
      ),
    },
    {
      field: "platform_id",
      headerName: "Platform",
      renderCell: (params) => {
        let name = platform?.find(
          (item) => item?._id == params.row?.platform_id
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
      field: "Action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <div className="d-flex align-center ">
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

  //  const copySelectedRows = (type) => {
  //   let selectedRows = Array.from(document.getElementsByClassName("MuiDataGrid-row"))
  //     .filter(row => row.classList.contains("Mui-selected"));

  //   let data = selectedRows.map(row => {
  //     let rowData = {};
  //     for (let j = 1; j < row.children.length - 1; j++) {
  //       if (dataGridcolumns[j].field !== "Action") {
  //         rowData[dataGridcolumns[j].field] = row.children[j].innerText;
  //       }
  //     }
  //     return rowData;
  //   });

  //   if (type === 1) {
  //     navigator.clipboard.writeText(JSON.stringify(data));
  //   } else {
  //     let copyData = data.map(row => {
  //       return {
  //         'Page User Name': row.page_user_name,
  //         "Page Level": row.page_level,
  //         "Page Status": row.page_status,
  //         "Ownership Type": row.ownership_type,
  //         "Link": row.link,
  //         Platform: row.platform_id,
  //         "Page Category": row.page_catg_id,
  //         "Followers Count": row.followers_count,
  //         vendorMast: row.vendorMast_id,
  //         "Platform Active On": row.platform_active_on,
  //         "Engagement Rate": row.engagment_rate,
  //        "Page Closed By": row.page_closed_by,
  //         "Page Name Type": row.page_name_type,
  //         "Content Creation": row.content_creation
  //       };
  //     });
  //     navigator.clipboard.writeText(JSON.stringify(copyData));
  //   }
  // };

  // const copySelectedRows = (type) => {
  //   let selectedRows = Array.from(document.getElementsByClassName("MuiDataGrid-row"))

  //     .filter((row) => row.classList.contains("Mui-selected"));

  //   let data = selectedRows.map((row) => {
  //     let rowData = {};
  //     for (let j = 1; j < row.children.length - 1; j++) {
  //       if (dataGridcolumns[j].field !== "Action") {
  //         rowData[dataGridcolumns[j].field] = row.children[j].innerText;
  //       }
  //     }
  //     return rowData;
  //   });

  //   if (type === 1) {
  //     navigator.clipboard.writeText(JSON.stringify(data));
  //   } else {
  //     let copyData = data.map((row) => {
  //       return {
  //         "Page User Name": row.page_user_name,
  //         Link: row.link,
  //       };
  //     });
  //     navigator.clipboard.writeText(JSON.stringify(copyData));
  //   }
  // };

  const copySelectedRows = (type) => {
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

    if (type === 1) {
      let excelData = Object.keys(data[0]).join("\t") + "\n";
      data.forEach((row) => {
        let values = Object.values(row).join("\t");
        excelData += values + "\n";
      });
      navigator.clipboard.writeText(excelData);
    } else {
      let copyData = data.map((row) => {
        return {
          "Page User Name": row.page_user_name,
          Link: row.link,
        };
      });
      let excelData = Object.keys(copyData[0]).join("\t") + "\n";
      copyData.forEach((row) => {
        let values = Object.values(row).join("\t");
        excelData += values + "\n";
      });
      navigator.clipboard.writeText(excelData);
    }
  };

  const copyAllRows = () => {
    let data = [];
    for (let i = 0; i < filterData.length; i++) {
      let row = filterData[i];
      let rowData = {};
      for (let j = 1; j < dataGridcolumns.length - 1; j++) {
        rowData[dataGridcolumns[j].field] = row[dataGridcolumns[j].field];
      }
      data.push(rowData);
    }
    navigator.clipboard.writeText(JSON.stringify(data));
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
          Copy Page Name & Links
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
              </div>
            </div>
          </div>

          {loading ? (
            <Box mt={2} ml={2} mb={3} sx={{ width: "95%" }}>
              <Grid
                container
                spacing={{ xs: 1, md: 10 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {Array.from(Array(5)).map((_, index) => (
                  <Grid item md={1} key={index}>
                    <Skeleton
                      sx={{
                        width: "100%",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {Array.from(Array(30)).map((_, index) => (
                  <Grid item xs={2} sm={2} md={2} key={index}>
                    <Skeleton
                      animation="wave"
                      sx={{
                        width: "100%",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <DataGrid
              title="Page Overview"
              rows={filterData}
              columns={dataGridcolumns}
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
              checkboxSelection
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PageOverview;
