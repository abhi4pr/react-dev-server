import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Paper, TextField } from "@mui/material";
import axios from "axios";
import { randomId } from "@mui/x-data-grid-generator";

export default function ContentType() {
  const [rows, setRows] = useState([]);
  const [addrows, setAddRows] = useState(false);
  const [reload, setReload] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  console.log(rows, "<----------------");

  let idCounter = 100;

  function EditToolbar() {
    const createRandomRow = () => {
      idCounter += 1;
      return {
        content_type_id: randomId(),
        content_type: "abc",
      };
    };
    const handleAddRecordClick = () => {
      setAddRows(true);
      setRows((oldRows) => [createRandomRow(), ...oldRows]);
      return;
    };

    return (
      <GridToolbarContainer>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddRecordClick}
        >
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  const fff = () => {
    axios.get("http://34.93.221.166:3000/api/content").then((res) => {
      const newData = res.data.data;
      console.log(newData);
      setRows(newData);
    });
    if (reload) {
      console.log("data updated");
    }
  };

  useEffect(() => {
    fff();
  }, [reload]);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => {
    axios
      .delete(`http://34.93.221.166:3000/api/content/${id}`)
      .then(() => {
        console.log(id, "Deleted successfully");
        fff();
      })
      .catch((error) => {
        console.error("Error deleting content:", error);
      });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    console.log("yha id hai", updatedRow.content_type_id);
    if (addrows) {
      setAddRows(false);
      try {
        axios.post("http://34.93.221.166:3000/api/content", {
          // content_type_id:updatedRow.content_type_id,
          content_type: updatedRow.content_type,
          content_value: updatedRow.content_value,
          remarks: updatedRow.remarks,
        });
      } catch (error) {
        console.log(error);
      }
      setReload(!reload);
      return updatedRow;
    } else {
      try {
        axios
          .put("http://34.93.221.166:3000/api/content", {
            content_type_id: updatedRow.content_type_id,
            content_type: updatedRow.content_type,
            content_value: updatedRow.content_value,
            remarks: updatedRow.remarks,
          })
          .then(() => {
            console.log(updatedRow.content_type_id);
            fff();
          });
      } catch (error) {
        console.log(error);
      }
      setReload(!reload);
      return updatedRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "ID",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "content_type",
      headerName: "Content Type ",
      width: 170,
      editable: true,
    },
    {
      field: "content_value",
      headerName: "Value",
      width: 170,
      editable: true,
    },

    {
      field: "remarks",
      headerName: "Remarks",
      width: 170,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<BorderColorRoundedIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="error"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const filterRows = () => {
    const filtered = rows.filter((row) =>
      row.content_type.toLowerCase().includes(searchInput.toLowerCase())
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
            <h2> Content Type </h2>
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
          getRowId={(row) => row.content_type_id}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
    </>
  );
}
