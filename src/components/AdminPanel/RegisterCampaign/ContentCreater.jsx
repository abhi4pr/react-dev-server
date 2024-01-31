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
import { useGlobalContext } from "../../../Context/Context";
import { toolbarStyles } from "./CampaignCommitment";
import { baseUrl } from "../../../utils/config";

export default function CampaignCommitment() {
  const { toastAlert, toastError } = useGlobalContext();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [reload, setReload] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPutOpen, setIsPutOpen] = useState(false);
  const [postData, setPostData] = useState({
    cmtName: "",
  });

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
         create commitment
        </Button>
      </GridToolbarContainer>
    );
  }
  //post data =======>
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "") {
      setErrorMessage("Please enter a valid name");
    } else if (value.trim() === "") {
      setErrorMessage("Enter Commitment name");
    } else {
      setErrorMessage("");
    }
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!postData.cmtName) {
      setErrorMessage("* fields are required");
      return;
    }
    axios
      .post(baseUrl+"add_commitment", postData)
      .then((response) => {
        setIsModalOpen(false);
        setPostData("");
        setReload(!reload);
        // console.log("Data saved:", response.data);
        if (response.data.success === false) {
          toastError(response.data.message);
        } else {
          toastAlert("Update successfully");
        }
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        toastError(" Add properly");
      });
    setIsModalOpen(false);
  };

  // get api ========>
  const getData = () => {
    axios
      .get(baseUrl+"get_all_commitments")
      .then((res) => {
        const data = res.data.data;
        const uniqueCmtNames = new Set();
        const uniqueRows = data.filter((row) => {
          if (uniqueCmtNames.has(row.cmtName)) {
            console.log(
              "Brand name already exists. Duplicate values are not allowed."
            );
            return false;
          } else {
            uniqueCmtNames.add(row.cmtName);
            return true;
          }
        });
        const sortedData = uniqueRows.sort((a, b) => b.cmtId - a.cmtId);
        setRows(sortedData);
      });
  };

  useEffect(() => {
    getData();
  }, [reload]);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  // put api =============>

  const handlePutData = () => {
    if (editData.cmtName !== "") {
      axios
        .put(`${baseUrl}`+`update_commitment`, {
          cmtId: editData.cmtId,
          cmtName: editData.cmtName,
        })
        .then((res) => {
          if (res.data.success === false) {
            toastError(res.data.message);
          } else {
            toastAlert("Update successfully");
          }
          setIsPutOpen(true);
          setReload(!reload);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        })
        .finally(() => {
          setIsPutOpen(false);
        });
      console.log("put data");
    } else {
      toastError("Commitment name fill");
    }
  };
  const handleEditClick = (id, row) => () => {
    setEditData(row);
    console.log(row);
    setIsPutOpen(true);
  };
  // delete ======>
  const handleDeleteClick = (id) => () => {
    setItemToDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };
  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      axios
        .delete(
          `${baseUrl}`+`delete_commitment/${itemToDeleteId}`
        )
        .then(() => {
          setReload(!reload);
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
      field: "cmtName",
      headerName: "Commitment",
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
      row.cmtName.toLowerCase().includes(searchInput.toLowerCase())
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
            <h2> Commitment </h2>
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
          getRowId={(row) => row.cmtId}
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
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
          >
            <div>
              <>
                <TextField
                  id="outlined-password-input"
                  label="Commitment"
                  name="cmtName"
                  type="text"
                  value={postData.cmtName}
                  onChange={handleChange}
                />
                {errorMessage && (
                  <div style={{ color: "red", marginBottom: "10px" }}>
                    {errorMessage}
                  </div>
                )}
              </>
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
                label="Commitment"
                name="cmtName"
                type="text"
                value={editData.cmtName}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    cmtName: e.target.value,
                  }))
                }
                required={true}
              />
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
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
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
