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

export default function BrandMaster() {
  const [SubCategoryString, setSubCategoryString] = useState();
  const [subcategoryOptions, setSubCategoryOptions] = useState([]);
  console.log(SubCategoryString, "SubCategoryString");
  const [categoryOptions, setCategoryOptions] = useState([]);
  // const [majorOptions, setMajorOptions] = useState([]);
  const [majorString, setMajorString] = useState([]);

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPutOpen, setIsPutOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [editData, setEditData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  //-----------------------
  const handleClose = () => {
    setIsModalOpen(false);
    // setCategoryString();
    // setSubCategoryString();
  };

  function EditToolbar() {
    const handleClick = () => {
      setIsModalOpen(true);
    };
    return (
      <GridToolbarContainer>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleClick}
        >
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }
  // const [brad, setbrad] = useState();
  // post data =========>
  const handleChange = (event) => {
    const { name, value } = event.target;

    // // Reset the error state
    // setError("");

    // const isBrandNameValid = /^[A-Za-z\s]+$/.test(value);
    // const isBrandNameNotEmpty = value.trim() !== "";
    // const isIgusernameValid = /^[A-Za-z0-9]+$/.test(value);
    // const isWhatsappValid = /^[A-Za-z\s]+$/.test(value);

    // if (name === "brand_name") {
    //   if (!isBrandNameValid) {
    //     setbrad("Brand name should only contain letters.");
    //   } else if (!isBrandNameNotEmpty) {
    //     setbrad("Brand name is required.");
    //   }
    // } else if (name === "igusername") {
    //   if (!isIgusernameValid) {
    //     setError("IG username should only contain letters and numbers.");
    //   }
    // } else if (name === "whatsapp") {
    //   if (!isWhatsappValid) {
    //     setError("WhatsApp should only contain numbers.");
    //   }
    // }

    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    for (const key in postData) {
      if (postData[key] === "") {
        setError(`* All fields required`);
        return;
      }
    }
    setError("");

    axios
      .post("http://34.93.221.166:3000/api/add_brand", postData)
      .then((response) => {
        console.log(response.data, "Data saved:");
        setIsModalOpen(false);
        getData();
        // setPostData({
        //   brand_name: "",
        //   category_id: "",
        //   sub_category_id: "",
        //   igusername: "",
        //   whatsapp: "",
        //   major_category: "",
        // });
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
    setIsModalOpen(false);
    setPostData("");
  };

  // get api ------
  const getData = () => {
    axios.get("http://34.93.221.166:3000/api/get_brands").then((res) => {
      const newData = res.data.data;
      const sortedData = newData.sort((a, b) => b.brand_id - a.brand_id);

      setRows(sortedData);
    });
  };

  const categoryData = () => {
    axios.get("http://34.93.221.166:3000/api/projectxCategory").then((res) => {
      console.log(res.data.data, "-------> cat data");
      setCategoryOptions(res.data.data);
    });
  };
  const subCategoryData = () => {
    console.log("calling the subcategory data");
    axios
      .get("http://34.93.221.166:3000/api/projectxSubCategory")
      .then((res) => {
        console.log(res.data.data, "-------> subcat data");
        const filteredData = res.data.data.filter((item) => {
          return item.category_id == postData.category_id;
        });
        const x = filteredData.filter((item) => {
          return item.sub_category_id == postData.sub_category_id;
        })[0].sub_category_id;
        console.log(x, "filteredData meeee");
        // setSubCategoryOptions(filteredData);
      });
  };
  console.log(rows);
  useEffect(() => {
    getData();
    categoryData();
    // subCategoryData()
  }, []);

  useEffect(() => {
    console.log("postData.category_id", postData.category_id);
    subCategoryData();
  }, [postData?.category_id, postData]);

  const subCategoryDataOnEdit = () => {
    console.log("calling the subcategory data on Edit");
    axios
      .get("http://34.93.221.166:3000/api/projectxSubCategory")
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
    console.log("postData.category_id", postData.category_id);
    subCategoryDataOnEdit();
  }, [postData.category_id, postData]);
  // put api ------
  const handlePutData = () => {
    axios
      .put(`http://34.93.221.166:3000/api/edit_brand`, {
        brand_id: editData.brand_id,
        brand_name: editData.brand_name,
        category_id: editData.category_id,
        sub_category_id: editData.sub_category_id,
        igusername: editData.igusername,
        whatsapp: editData.whatsapp,
        // user_id: editData.user_id,
        // updated_at: editData.updated_at,
      })
      .then((res) => {
        console.log(res.data);
        setIsPutOpen(true);
      })
      .then(() => {
        setIsPutOpen(false);
        getData();
      });
    console.log("put data");
  };

  useEffect(() => {
    axios
      .get("http://34.93.221.166:3000/api/projectxSubCategory")
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
    // console.log(row);
    // console.log(
    //   subcategoryOptions.find(
    //     (option) => option.sub_category_id == row.sub_category_id
    //   )
    // );
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
        .delete(`http://34.93.221.166:3000/api/delete_brand/${itemToDeleteId}`)
        .then(() => {
          getData();
          console.log("Data deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
        })
        .finally(() => {
          setIsDeleteConfirmationOpen(false);
          setItemToDeleteId(null);
        });
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
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
    },
    {
      field: "projectx_category_name",
      headerName: "Category",
      width: 180,
    },
    {
      field: "projectx_subcategory_name",
      headerName: "Sub Category",
      width: 180,
    },
    {
      field: "major_category",
      headerName: "Major category",
      width: 180,
    },

    {
      field: "igusername",
      headerName: "ig user name",
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
            color="success"
          />,
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
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
      <Box
        sx={{
          height: 500,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
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
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <>
                <TextField
                  id="outlined-password-input"
                  label="Brand"
                  name="brand_name"
                  type="text"
                  value={postData.brand_name}
                  onChange={handleChange}
                />
                {error && <div style={{ color: "red" }}>{error}</div>}
              </>
              <>
                <Autocomplete
                  id="combo-box-demo"
                  // value={majorString}
                  options={majorcategoryoption.map((item) => ({
                    label: item.major_cat_name,
                    value: item.major_cat_id,
                  }))}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Major Category" />
                  )}
                  onChange={(event, newValue) => {
                    console.log(newValue.value);
                    if (newValue) {
                      setPostData({
                        ...postData,
                        major_category: newValue.label,
                      });
                      // setMajorString(newValue.label);
                    } else {
                      setPostData({
                        ...postData,
                        major_cat_id: "",
                      });
                    }
                  }}
                />

                {error && <div style={{ color: "red" }}>{error}</div>}
              </>
              <>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={categoryOptions.map((option) => ({
                    label: option.category_name,
                    value: option.category_id,
                  }))}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" />
                  )}
                  onChange={(event, newValue) => {
                    console.log(newValue.value);
                    setPostData({
                      ...postData,
                      category_id: newValue.value,
                    });
                  }}
                />

                {error && <div style={{ color: "red" }}>{error}</div>}
              </>
              <>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={subcategoryOptions.map((item) => ({
                    label: item.sub_category_name,
                    value: item.sub_category_id,
                  }))}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Subcategory" />
                  )}
                  onChange={(event, newValue) => {
                    console.log(newValue.value);
                    if (newValue) {
                      setPostData({
                        ...postData,
                        sub_category_id: newValue.value,
                      });
                      setSubCategoryString(newValue.label);
                    } else {
                      setPostData({
                        ...postData,
                        sub_category_id: "",
                      });
                    }
                  }}
                />
                {error && <div style={{ color: "red" }}>{error}</div>}
              </>
              <>
                <TextField
                  id="outlined-password-input"
                  label="Igusername"
                  name="igusername"
                  type="text"
                  value={postData.igusername}
                  onChange={handleChange}
                />
                {error && <div style={{ color: "red" }}>{error}</div>}
              </>
              <>
                <TextField
                  id="outlined-password-input"
                  label="Whatsapp"
                  name="whatsapp"
                  type="text"
                  value={postData.whatsapp}
                  onChange={handleChange}
                />
                {error && <div style={{ color: "red" }}>{error}</div>}
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
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            {!loading && (
              <div>
                <TextField
                  id="outlined-password-input"
                  label="Brand"
                  name="brand_name"
                  type="text"
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
                  sx={{ width: 300 }}
                  value={
                    categoryOptions.find(
                      (option) => option.category_id == editData.category_id
                    )?.category_name
                  }
                  renderInput={(params) => (
                    <TextField {...params} label=" Category" />
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
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Sub Category" />
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
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Major Category" />
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
                  id="outlined-password-input"
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
                  id="outlined-password-input"
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
          <Button onClick={() => setIsPutOpen(false)} color="primary">
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
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
