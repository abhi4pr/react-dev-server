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
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CategoryMaster() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [isPutOpen, setIsPutOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [postData, setPostData] = useState({
    category_name: "",
    // brand_id: "",
  });

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
  //post data =======>

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    axios
      .post("http://34.93.221.166:3000/api/projectxCategory", postData)
      .then((response) => {
        setIsModalOpen(false);
        getData();
        console.log("Data saved:", response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
    setIsModalOpen(false);
    setPostData("");
  };

  // get api ========>
  const getData = () => {
    axios.get("http://34.93.221.166:3000/api/projectxCategory").then((res) => {
      console.log(res.data.data);
      const sortedData = res.data.data.sort(
        (a, b) => b.category_id - a.category_id
      );
      setRows(sortedData);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  // put api =============>
  const handlePutData = () => {
    axios
      .put(`http://34.93.221.166:3000/api/projectxCategory`, {
        id: editData.category_id,
        category_name: editData.category_name,
        // brand_id: editData.brand_id,
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
  const handleEditClick = (id, row) => () => {
    console.log(row);
    setEditData(row);
    setIsPutOpen(true);
  };

  // delete ======>
  // const handleDeleteClick = (id) => () => {
  //   axios.delete(`http://34.93.221.166:3000/api/projectxCategory/${id}`).then((res) => {
  //     getData();
  //     console.log("re data ", res.data);
  //   });
  // };

  const handleDeleteClick = (id) => () => {
    setItemToDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      axios
        .delete(
          `http://34.93.221.166:3000/api/projectxCategory/${itemToDeleteId}`
        )
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
      field: "category_name",
      headerName: "Category Name",
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
            color="inherit"
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
  const filterRows = () => {
    const filtered = rows.filter((row) =>
      row.category_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  // useEffect(() => {
  //   getData();
  // }, []);

  useEffect(() => {
    filterRows();
  }, [searchInput, rows]);

  return (
    <>
      <Paper>
        <div className="form-heading">
          <div className="form_heading_title">
            <h2> Category Master</h2>
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
      // sx={{
      //   height: 500,
      //   width: "100%",
      //   "& .actions": {
      //     color: "text.secondary",
      //   },
      //   "& .textPrimary": {
      //     color: "text.primary",
      //   },
      // }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          editMode="row"
          getRowId={(row) => row.category_id}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>

      {/* AddRecordModal post data */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
              <TextField
                id="outlined-password-input"
                label="Category"
                name="category_name"
                type="text"
                value={postData.category_name}
                onChange={handleChange}
              />

              {/* <TextField
                id="outlined-password-input"
                label="brand_id"
                name="brand_id"
                type="text"
                value={postData.brand_id}
                onChange={handleChange}
              /> */}
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* perform put data */}
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
            <div>
              <TextField
                id="outlined-password-input"
                label="Category Name"
                name="category_name"
                type="text"
                value={editData.category_name}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    category_name: e.target.value,
                  }))
                }
              />

              {/* <TextField
                id="outlined-password-input"
                label="brand_id"
                name="brand_id"
                type="text"
                value={editData.brand_id}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    brand_id: e.target.value,
                  }))
                }
              /> */}
            </div>
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
