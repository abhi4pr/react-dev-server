import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../../../Context/Context";

let fieldInRows = [];
const OverView = ({ name, data, hardReload }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [isPutOpen, setIsPutOpen] = useState(false);

  const [updatePayload, setUpdatePayload] = useState({});
  const [currentRow, setCurrentRow] = useState({});

  const updateHandler = (params) => {
    setCurrentRow(params.row);
    setIsPutOpen(true);
  };
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState({});

  const deleteHandler = (params) => {
    setDeleteParams(params);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (name == "agency") {
        await axios.delete(
          `http://192.168.29.114:3000/api/agency/${deleteParams.row._id}`
        );
      }
      if (name == "goal") {
        await axios.delete(
          `http://192.168.29.114:3000/api/goal/${deleteParams.row._id}`
        );
      }
      if (name == "industry") {
        await axios.delete(
          `http://192.168.29.114:3000/api/industry/${deleteParams.row._id}`
        );
      }
      if (name == "service") {
        await axios.delete(
          `http://192.168.29.114:3000/api/services/${deleteParams.row._id}`
        );
      }

      hardReload();
      setIsDeleteDialogOpen(false);
    } catch (error) {}
  };
  const floodColumn = () => {
    const x = data[0];
    let val = [];
    for (const key in x) {
      if (key == "_id" || key == "__v") continue;
      const y = {
        field: key,
        headerName: key,
        width: 100,
      };
      fieldInRows.push(key);
      val.push(y);
    }

    const update = {
      field: " action",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() => updateHandler(params)}
              variant="text"
              sx={{ mr: 2 }}
            >
              <BorderColorIcon />
            </Button>
            <Button
              onClick={() => deleteHandler(params)}
              variant="text"
              color="error"
              
            >
              <DeleteOutlineIcon />
            </Button>
          </>
        );
      },
    };
    val.push(update);
    setColumns(val);
    const serialNumberColumn = {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = data.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    };

    val.unshift(serialNumberColumn);
    setColumns(val);
  };
  useEffect(() => {
    floodColumn();
  }, [data]);

  const handleUpdateChange = (e) => {
    setUpdatePayload({ ...updatePayload, [e.target.name]: e.target.value });
  };

  const handleUpdatePayload = async () => {
    try {
      if (name == "agency") {
        const data = await axios.put(
          `http://192.168.29.114:3000/api/agency/${currentRow._id}`,
          updatePayload
        );
      }
      if (name == "goal") {
        const data = await axios.put(
          `http://192.168.29.114:3000/api/goal/${currentRow._id}`,
          updatePayload
        );
      }
      if (name == "industry") {
        const data = await axios.put(
          `http://192.168.29.114:3000/api/industry/${currentRow._id}`,
          updatePayload
        );
      }
      if (name == "service") {
        const data = await axios.put(
          `http://192.168.29.114:3000/api/services/${currentRow._id}`,
          updatePayload
        );
      }
      setUpdatePayload({});
      setIsPutOpen(false);
      hardReload();
      toastAlert("Update Successfully");

    } catch (error) {}
  };
  return (
    <>
      <Paper>
        <div className="form-heading">
          <div className="form_heading_title">
            <h2> {name} Overview</h2>
          </div>
        </div>
      </Paper>
      <Paper sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="error"
          sx={{ m: 1, mr:2 }}
          onClick={() => navigate(`/admin/${name}`)}
        >
          create {name}
        </Button>
      </Paper>
      <DataGrid rows={data} columns={columns} getRowId={(row) => row._id} />

      <Dialog open={isPutOpen} onClose={() => setIsPutOpen(false)}>
        <DialogTitle>Edit Record</DialogTitle>

        <DialogContent>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
          >
            <div>
              {fieldInRows.map((item) => {
                return (
                  <TextField
                    label={item}
                    type="text"
                    name={item}
                    value={
                      updatePayload[item]?.length >= 0
                        ? updatePayload[item]
                        : currentRow[item]
                    }
                    onChange={handleUpdateChange}
                  />
                );
              })}
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsPutOpen(false);
              setUpdatePayload({});
            }}
            color="error"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdatePayload} color="primary" variant="outlined">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <>
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle color="secondary">Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this record
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}  variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="outlined" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </>
    </>
  );
};

export default OverView;
