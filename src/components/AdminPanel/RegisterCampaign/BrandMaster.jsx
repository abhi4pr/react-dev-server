import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
  DialogContentText,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { toolbarStyles } from "./CampaignCommitment";
import {baseUrl} from '../../../utils/config'

export default function BrandMaster() {
  const { toastAlert, toastError } = useGlobalContext();
  const [reload, setReload] = useState(false);
  const [SubCategoryString, setSubCategoryString] = useState();
  console.log(SubCategoryString);
  const [subcategoryOptions, setSubCategoryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [rows, setRows] = useState([]);
  // const [rowModesModel, setRowModesModel] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPutOpen, setIsPutOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [editData, setEditData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errBrandName, setErrBrandName] = useState();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [postData, setPostData] = useState({
    brand_name: "",
    category_id: "",
    sub_category_id: "",
    igusername: "",
    whatsapp: "",
    major_category: "",
  });
  const majorcategoryoption = [
    { major_cat_id: 1, major_cat_name: "Brands" },
    { major_cat_id: 2, major_cat_name: "Normal" },
    { major_cat_id: 3, major_cat_name: "Negative" },
    { major_cat_id: 4, major_cat_name: "NBFRS" },
    { major_cat_id: 5, major_cat_name: "Entertainment" },
  ];

  const brandURL = baseUrl+"";
  const handleClose = () => {
    setIsModalOpen(false);
  };

  function EditToolbar() {
    const handleClick = () => {
      setIsModalOpen(true);
    };
    return (
      <GridToolbarContainer style={toolbarStyles}>
        <Button
          color="error"
          variant="outlined"
          onClick={handleClick}
        >
          create brand
        </Button>
      </GridToolbarContainer>
    );
  }
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "brand_name") {
      if (!value === "") {
        setErrBrandName("Brand should not be blank.");
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        setErrBrandName("Brand should be characters.");
      } else {
        setErrBrandName(" ");
      }
    }
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (
      !postData.brand_name ||
      !postData.category_id ||
      !postData.sub_category_id ||
      !postData.major_category
    ) {
      toastError(" * Please fill in all required fields ");
    } else {
      axios
        .post(`${brandURL}/add_brand`, postData)
        .then((response) => {
          response.data.message
            ? toastError(response.data.message)
            : toastAlert("Add Successfully");
          setPostData("");
          setReload(!reload);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          toastError("Error adding data. Please try again later.");
        });
      setIsModalOpen(false);
    }
  };

  // get api ------
  const getData = () => {
    axios.get(`${brandURL}/get_brands`).then((res) => {
      const newData = res.data.data;
      const sortedData = newData.sort((a, b) => b.brand_id - a.brand_id);
      setRows(sortedData);
    });
  };

  const categoryData = () => {
    axios.get(baseUrl+"projectxCategory").then((res) => {
      console.log(res.data.data, "-------> cat data");
      setCategoryOptions(res.data.data);
    });
  };
  useEffect(() => {
    getData();
    categoryData();
  }, [reload]);

  const subCategoryDataOnEdit = () => {
    console.log("calling the subcategory data on Edit");
    axios
      .get(baseUrl+"projectxSubCategory")
      .then((res) => {
        console.log(res.data.data, "-------> subcat data");
        const filteredData = res.data.data.filter((item) => {
          return item.category_id == postData.category_id;
        });
        console.log(filteredData, "filteredData meeee");
        setSubCategoryOptions(filteredData);
        setLoading(false);
      });
  };

  useEffect(() => {
    subCategoryDataOnEdit();
  }, [postData.category_id, postData]);
  // put api ------
  const handlePutData = () => {
    const onlyCharacters = /^[A-Za-z]+$/;
    if (
      !editData.brand_name ||
      !editData.category_id ||
      !editData.sub_category_id ||
      !editData.major_category
    ) {
      toastError("Please fill required fields.");
      return;
    }
    if (!onlyCharacters.test(editData.brand_name)) {
      toastError("Brand name should contain only characters.");
      return;
    }

    axios
      .put(`${brandURL}/edit_brand`, {
        brand_id: editData.brand_id,
        brand_name: editData.brand_name,
        category_id: editData.category_id,
        sub_category_id: editData.sub_category_id,
        major_category: editData.major_category,
        igusername: editData.igusername,
        whatsapp: editData.whatsapp,
      })
      .then((res) => {
        if (res.data.success === false) {
          toastError(res.data.message);
        } else {
          toastAlert("Update successfully");
        }
        setIsPutOpen(true);
      })
      .then(() => {
        setIsPutOpen(false);
        setReload(!reload);
      });
  };

  useEffect(() => {
    axios
      .get(baseUrl+"projectxSubCategory")
      .then((res) => {
        console.log(res.data.data, "-------> subcat data");
        const filteredData = res.data.data.filter((item) => {
          return item.category_id == editData.category_id;
        });
        console.log(filteredData, "filteredData meeee");
        setSubCategoryOptions(filteredData);
        setLoading(false);
      });
  }, [editData.category_id]);

  const handleEditClick = (id, row) => () => {
    setLoading(true);
    setEditData(row);
    setIsPutOpen(true);
    setPostData(row);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleDeleteClick = (id) => () => {
    setItemToDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      axios
        .delete(`${brandURL}/delete_brand/${itemToDeleteId}`)
        .then(() => {
          getData();
          console.log("Data deleted successfully");
        })
        // .catch((error) => {
        //   console.error("Error deleting data:", error);
        // })
        .finally(() => {
          setIsDeleteConfirmationOpen(false);
          setItemToDeleteId(null);
        });
    }
  };
  const handleCancle = () => {
    setIsPutOpen(false);
    setReload(!reload);
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "brand_name",
      headerName: "Brand",
      width: 180,
      renderCell: (params) => {
        const brand_name = params.row.brand_name; 
        const BrandName = brand_name.charAt(0).toUpperCase() + brand_name.slice(1);
        return BrandName;
      }
    }
,    
    {
      field: "projectx_category_name",
      headerName: "Category",
      width: 180,
    },
    {
      field: "projectx_subcategory_name",
      headerName: "SubCategory",
      width: 180,
    },
    {
      field: "major_category",
      headerName: "Major Category",
      width: 180,
    },

    {
      field: "igusername",
      headerName: "User Name",
      width: 180,
    },
    {
      field: "whatsapp",
      headerName: "Whatsapp",
      width: 180,
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        const { id, row } = params;
        return [
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id, row)}
            color="primary"
          />,
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            sx={{ color: "red" }}
          />,
        ];
      },
    },
  ];

  // add filter
  const filterRows = () => {
    const filtered = rows.filter((row) =>
      row.brand_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  useEffect(() => {
    filterRows();
  }, [searchInput, rows]);

  return (
    <>
      <Paper>
        <div className="form-heading">
          <div className="form_heading_title">
            <h2> Brand </h2>
          </div>
        </div>
      </Paper>
      <TextField
        label="Search"
        variant="outlined"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Box>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          editMode="row"
          onRowEditStop={handleRowEditStop}
          getRowId={(row) => row.brand_id}
          slots={{
            toolbar: EditToolbar,
          }}
        />
      </Box>

      {/* AddRecordModal post data */}
      <Dialog open={isModalOpen} onClose={handleClose}>
        <DialogTitle>Add Record</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <div>
              <>
                <TextField
                  id="outlined-password-input"
                  label="  * Brand"
                  name="brand_name"
                  type="text"
                  value={postData.brand_name}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
                <span style={{ color: "red" }}>{errBrandName}</span>
              </>
              <Autocomplete
                id="combo-box-demo"
                options={majorcategoryoption.map((item) => ({
                  label: item.major_cat_name,
                  value: item.major_cat_id,
                }))}
                renderInput={(params) => (
                  <TextField {...params} label="  * Major Category" />
                )}
                onChange={(event, newValue) => {
                  console.log(newValue.value);
                  if (newValue) {
                    setPostData({
                      ...postData,
                      major_category: newValue.label,
                    });
                  }
                }}
              />

              <>
                <Autocomplete
                  disablePortal
                  options={categoryOptions.map((option) => ({
                    label: option.category_name,
                    value: option.category_id,
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="  * Category" />
                  )}
                  onChange={(event, newValue) => {
                    console.log(newValue.value);
                    setPostData({
                      ...postData,
                      category_id: newValue.value,
                    });
                  }}
                />
              </>
              <>
                <Autocomplete
                  disablePortal
                  options={subcategoryOptions.map((item) => ({
                    label: item.sub_category_name,
                    value: item.sub_category_id,
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="  * Subcategory" />
                  )}
                  onChange={(event, newValue) => {
                    console.log(newValue.value);
                    if (newValue) {
                      setPostData({
                        ...postData,
                        sub_category_id: newValue.value,
                      });
                      setSubCategoryString(newValue.label);
                    }
                  }}
                />
              </>
              <>
                <TextField
                  label="Igusername"
                  name="igusername"
                  type="text"
                  value={postData.igusername}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </>
              <>
                <TextField
                  label="Whatsapp"
                  name="whatsapp"
                  type="text"
                  value={postData.whatsapp}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* AddRecordModal put data */}
      <Dialog open={isPutOpen} onClose={() => setIsPutOpen(false)}>
        <DialogTitle>Edit Record</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            {!loading && (
              <div>
                <TextField
                  label="Brand *"
                  name="brand_name"
                  type="text"
                  sx={{ width: "100%" }}
                  value={editData.brand_name}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      brand_name: e.target.value,
                    }))
                  }
                />

                <Autocomplete
                  disablePortal
                  options={categoryOptions.map((item) => ({
                    label: item.category_name,
                    value: item.category_id,
                  }))}
                  value={
                    categoryOptions.find(
                      (option) => option.category_id == editData.category_id
                    )?.category_name
                  }
                  renderInput={(params) => (
                    <TextField {...params} label=" Category *" />
                  )}
                  onChange={(event, newValue) => {
                    setEditData((prev) => ({
                      ...prev,
                      category_id: newValue ? newValue.value : "",
                    }));
                  }}
                />
                <Autocomplete
                  disablePortal
                  options={subcategoryOptions?.map((item) => ({
                    label: item.sub_category_name,
                    value: item.sub_category_id,
                  }))}
                  value={
                    subcategoryOptions?.find((option) => {
                      return (
                        option?.sub_category_id == editData?.sub_category_id
                      );
                    })?.sub_category_name
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Sub Category *" />
                  )}
                  onChange={(event, newValue) => {
                    setEditData((prev) => ({
                      ...prev,
                      sub_category_id: newValue ? newValue.value : "",
                    }));
                  }}
                />
                <Autocomplete
                  disablePortal
                  options={majorcategoryoption}
                  getOptionLabel={(option) => option.major_cat_name}
                  renderInput={(params) => (
                    <TextField {...params} label="Major Category *" />
                  )}
                  value={majorcategoryoption.find(
                    (option) =>
                      option.major_cat_name === editData.major_category
                  )}
                  onChange={(event, newValue) => {
                    setEditData((prev) => ({
                      ...prev,
                      major_category: newValue && newValue.major_cat_name,
                    }));
                  }}
                />

                <TextField
                  label="Iguser Name"
                  name="igusername"
                  type="text"
                  value={editData.igusername}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      igusername: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Whatsapp"
                  name="whatsapp"
                  type="text"
                  value={editData.whatsapp}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      whatsapp: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancle} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePutData} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure ...?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteConfirmationOpen(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="outlined">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
