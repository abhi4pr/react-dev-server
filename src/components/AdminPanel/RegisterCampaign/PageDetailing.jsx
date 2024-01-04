import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import {
  TextField,
  Button,
  DialogActions,
  DialogContentText,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { Paper, Autocomplete, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGlobalContext } from "../../../Context/Context";

let options = [];
const PageDetaling = ({
  pageName,
  realPageData,
  pages,
  search,
  searchedpages,
  data,
  setFilteredPages,
  phaseInfo,
  setPhaseDataError,
  payload,
  payloadChange,
}) => {
  const { toastAlert, toastError } = useGlobalContext();

  const navigate = useNavigate();
  const [allPages, setAllPages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletingPageId, setDeletingPageId] = useState(null);
  const [remainingPages, setRemainingPages] = useState([]);
  const [smallPostPerPage, setSmallPostPerPage] = useState(
    Number.MAX_SAFE_INTEGER
  );
  const [totalCountsByCategory, setTotalCountsByCategory] = useState({});

  // console.log(pages);

  useEffect(() => {
    if (pages?.length > 0) {
      const addPost = pages.map((page) => {
        if (!page.postPerPage) {
          return { ...page, postPerPage: 0 };
        } else return page;
      });
      setAllPages([...addPost]);
      const differenceArray = realPageData?.filter((element) => {
        if (!pages.includes(element)) {
          options.push(element.page_name);
          return !pages.includes(element);
        }
      });
      setRemainingPages(differenceArray);
    }
  }, [pages]);

  useEffect(() => {
    if (pageName == "phaseCreation") {
      let smallest = Number.MAX_SAFE_INTEGER;
      console.log(pages);
      pages.forEach((page) => {
        if (Number(page.postRemaining) < smallest) {
          smallest = Number(page.postRemaining);
        }
      });
      // console.log(smallest)
      setSmallPostPerPage(smallest);
    }
  }, [pages]);

  const pageReplacement = (e, params, index) => {
    // console.log(e.target.innerText,params,index)

    const pageReplacement = realPageData.find((page) => {
      return page.page_name == e.target.innerText;
    });
    // console.log(pageReplacement)
    const z = [...allPages];
    z.splice(index, 1, pageReplacement);
    // console.log(z)
    setAllPages(z);
  };

  const handlePostPerPageChange = (e, params) => {
    let updatedValue = e.target.value;
    if (e.target.value > Number(params.row.postRemaining)) {
      updatedValue = params.row.postRemaining;
    }

    // Check if the input value is being set or cleared
    if (updatedValue !== params.value || updatedValue === "") {
      const updatedPages = allPages.map((page) =>
        page.p_id === params.row.p_id
          ? { ...page, postPerPage: updatedValue, value: null }
          : page
      );
      console.log(updatedPages);
      setAllPages(updatedPages);
      const x = payload.map((page) => {
        if (page.p_id === params.row.p_id) {
          return { ...page, postPerPage: updatedValue };
        } else return page;
      });
      if (pageName == "planCreation") {
      }
      // console.log(x)
      payloadChange(x, updatedPages);
    }
  };
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = allPages.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Pages",
      width: 150,
      editable: true,
      renderCell: (params) => {
        // console.log(params)
        return params?.row?.status == false ? (
          <Autocomplete
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option}
            sx={{ width: 300 }}
            renderInput={(param) => (
              <TextField {...param} label={params.row.page_name} />
            )}
            onChange={(e) =>
              pageReplacement(e, params.row, allPages.indexOf(params.row))
            }
          />
        ) : (
          params.page_name
        );
      },
    },
    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
      editable: true,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 150,
      editable: true,
    },
    {
      field: "post_page",
      headerName: "Post / Page",
      width: 150,

      renderCell: (params) => {
        return (
          <input
            style={{ width: "60%" }}
            type="number"
            value={
              params.row.postPerPage !== null
                ? params.row.postPerPage
                : params.value || ""
            }
            placeholder={params.row.postPerPage || ""}
            onChange={(e) => handlePostPerPageChange(e, params)}
          />
        );
      },
    },
    {
      field: "remainingPages",
      headerName: "remainingPages",
      width: 150,
      renderCell: (params) => {
        return (
          <input
            style={{ width: "60%" }}
            type="number"
            disabled
            placeholder={params.row.postRemaining}
          />
        );
      },
    },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      editable: true,
      renderCell: (params) => {
        return (
          <Button onClick={() => removePage(params)}>
            <DeleteIcon />
          </Button>
        );
      },
    },
  ];
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalFollowerCount, setTotalFollowerCount] = useState(0);
  const [totalPostPerPage, setTotalPostPerPage] = useState(0);

  // const handleSelectedRowData = (catName) => {
  //   let x = selectedRows.filter((e) => e.cat_name === catName);
  //   let y = new Set(x.map((item) => item.cat_name));
  //   // if (y.has(catName)) {
  //     const total = x.reduce((sum, current) => {
  //       return sum + Number(current.follower_count);
  //     }, 0);
  //     const totalPost = x.reduce((sum, current) => {
  //       return sum + Number(current.postPerPage);
  //     }, 0);
  //     setTable2Data(x);
  //     setTotalFollowerCount(total);
  //     setTotalPostPerPage(totalPost);
  //   // }
  // };
  const handleSelectedRowData = (catName) => {
    let x = selectedRows.filter((e) => e.cat_name === catName);
    let y = new Set(x.map((item) => item.cat_name));

    const total = x.reduce((sum, current) => {
      return sum + Number(current.follower_count);
    }, 0);

    const totalPost = x.reduce((sum, current) => {
      return sum + Number(current.postPerPage);
    }, 0);

    x = x.map((row) => ({
      ...row,
      total_follower_count: total,
    }));

    setTable2Data(x);
    setTotalFollowerCount(total);
    setTotalPostPerPage(totalPost);
  };

  const removePage = (params) => {
    setOpenDialog(true);
    setDeletingPageId(params.id);
  };
  const confirmDelete = () => {
    const newData = allPages.filter((page) => page.p_id != deletingPageId);
    setFilteredPages(newData);
    setOpenDialog(false);
  };
  const handlePost = (e) => {
    let updatedValue = e.target.value;
    console.log(smallPostPerPage);
    if (e.target.value >= smallPostPerPage) {
      updatedValue = smallPostPerPage;
    }

    const postperpage = allPages.map((page) => {
      return { ...page, postPerPage: updatedValue };
    });

    setAllPages(postperpage);
    payloadChange(postperpage, postperpage);
  };
  const submitPlan = async (e) => {
    if (pageName == "planCreation") {
      const planName = data.campaignName + "plan";

      const newdata = {
        planName,
        campaignName: data.campaignName,
        campaignId: data.campaignId,
        pages: allPages,
      };
      try {
        const result = await axios.post(
          "http://34.93.221.166:3000/api/campaignplan",
          newdata
        );
        toastAlert("Plan Created SuccessFully");
        setTimeout(() => {
          navigate("/admin/registered-campaign");
        }, 2000);
      } catch (error) {
        toastError("Plan not Created");
      }
    }
    if (pageName == "phaseCreation") {
      if (phaseInfo.phaseDataError === "") {
        setPhaseDataError("Phase ID is Required");
      }
      const planName = data.campaignName + "plan";
      e.preventDefault();
      const finalPages = allPages.map((page) => {
        return {
          ...page,
          postRemaining: page.postRemaining - page.postPerPage,
        };
      });
      const newdata = {
        planName,
        campaignName: data.campaignName,
        campaignId: data.campaignId,
        pages: finalPages,
        phaseName: phaseInfo.phaseName,
        desciption: phaseInfo.description,
        commitment: phaseInfo.commitment,
      };
      try {
        const result = await axios.post(
          "http://34.93.221.166:3000/api/campaignphase",
          newdata
        );
        toastAlert("Phase Created SuccessFully");
        setTimeout(() => {
          navigate("/admin/registered-campaign");
        }, 2000);
      } catch (error) {
        toastError("Plan not Created");
      }
    }
  };

  const [catNameLengths, setCatNameLengths] = useState({});
  const [table2Data, setTable2Data] = useState([]);
  const [summaryData, setSummaryData] = useState({
    total: 0,
    totalPost: 0,
    lent: 0,
  });
  console.log(summaryData.total, " follower");
  const handleSelectionChange = (params) => {
    let paramsSet = new Set(params);
    let selectedRows = allPages.filter((f) => paramsSet.has(f.p_id));
    setSelectedRows(selectedRows);
    setTable2Data(selectedRows);

    const updatedCatNameLengths = {};
    selectedRows.forEach((entry) => {
      const catName = entry.cat_name;
      updatedCatNameLengths[catName] =
        (updatedCatNameLengths[catName] || 0) + 1;
    });
    setCatNameLengths(updatedCatNameLengths);
    const total = selectedRows.reduce(
      (sum, current) => sum + Number(current.follower_count),
      0
    );
    const totalPost = selectedRows.reduce(
      (sum, current) => sum + Number(current.postPerPage),
      0
    );
    const lent = selectedRows.length;

    setSummaryData({ total, totalPost, lent });
  };

  const col = [
    {
      field: "page_name",
      headerName: "Pages",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
      editable: true,
    },
    {
      field: "postPerPage",
      headerName: "Post / Page",
      width: 150,
      editable: true,
    },
    {
      field: "total_follower_count",
      headerName: "Total Follower Count",
      width: 200,
      renderCell: (params) => (
        <strong>{params.row.total_follower_count}</strong>
      ),
    },
  ];

  return (
    <Paper>
      <Box sx={{ p: 2 }}>
        <TextField
          id="outlined-basic"
          InputLabelProps={{ shrink: true }}
          label="Post/pages"
          variant="outlined"
          onChange={handlePost}
        />
      </Box>
      <Paper sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Box sx={{ height: 700, width: "65%" }}>
          <DataGrid
            rows={allPages || []}
            columns={columns}
            getRowId={(row) => row.p_id}
            pageSizeOptions={[5]}
            checkboxSelection
            onRowSelectionModelChange={(params) => {
              handleSelectionChange(params);
            }}
            getRowClassName={(params) => {
              return params.row.status == false ? "unavailable" : "available";
            }}
            sx={{
              ml: 2,
              ".unavailable": {
                bgcolor: " #FF4433",
                "&:hover": {
                  bgcolor: "#E30B5C",
                },
              },
            }}
          />
        </Box>
        <Box sx={{ height: 577, width: "35%" }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", justifyContent: "center", mb: 1 }}
          >
            Summary
          </Typography>
          <Box
            sx={{
              textAlign: "right",
              display: "flex",
              gap: 4,
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Pages: {summaryData.lent}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Followers : {summaryData.total}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Posts: {summaryData.totalPost}
            </Typography>
          </Box>
          <Paper>
            <Box>
              <ul>
                {Object.entries(catNameLengths).map(([catName, count]) => (
                  <li key={catName}>
                    <Button
                      onClick={(e) => handleSelectedRowData(catName)}
                      variant="outlined"
                      color="secondary"
                      sx={{ marginBottom: 1, display: "flex" }}
                    >
                      {catName}: {count}
                    </Button>
                  </li>
                ))}
              </ul>
            </Box>

            <Box sx={{ textAlign: "right", display: "flex", gap: 2, m: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                Total Followers: {totalFollowerCount}
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                Total Post / Page: {totalPostPerPage}
              </Typography>
            </Box>
          </Paper>

          {selectedRows.length > 0 && (
            <Box mt={2}>
              <DataGrid
                rows={table2Data}
                columns={col}
                getRowId={(row) => row.p_id}
                pageSizeOptions={[5]}
              />
            </Box>
          )}
        </Box>
      </Paper>
      {!search && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 4 }}>
          <Button variant="contained" onClick={submitPlan}>
            submit
          </Button>
        </Box>
      )}
      <>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Remove Page</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Remove this page?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="outlined" color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </Paper>
  );
};

export default PageDetaling;
