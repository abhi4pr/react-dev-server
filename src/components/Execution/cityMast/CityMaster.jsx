import React, { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import Typography from "@mui/material/Typography";

import { DataGrid } from "@mui/x-data-grid";

import { Page } from "@react-pdf/renderer";
import { TextField } from "@mui/material";

import { useGlobalContext } from "../../../Context/Context";
import DeleteCity from "./DeleteCity";
import EditCity from "./EditCity";
import {baseUrl} from '../../../utils/config'

export default function CityMaster() {
  const [city, setCity] = useState([]);
  const [row, setRow] = useState([]);
  const [addCity, setAddCity] = useState("");
  const [openEditCity, setOpenEditCity] = useState(false);
  const [editCityName, setEditCityName] = useState("");

  const { toastAlert } = useGlobalContext();
  const [rowData, setRowData] = useState({});
  const [openDeleteCityName, setOpenDeleteCityName] = React.useState(false);


  const handleClickOpenDeleteCityName = (row) => {
    setOpenDeleteCityName(true);
    setRowData(row);
  };
  const handleEditCity = (e) => {
    setEditCityName(e.target.value);
  };
  const handleSaveEditCityName = () => {
    axios
      .put(baseUrl+"update_city", {
        _id: rowData._id,
        city_name: editCityName,
      })
      .then((res) => {
        if (res.status === 200) {
          toastAlert(`${editCityName} updated successfully`);
          setEditCityName("");
          setOpenEditCity(false);
        } else {
          toastAlert("Something went wrong");
        }
        res.status === 200 && callApi();
      });
  };
  const handleCloseDeleteCityName = () => {
    setOpenDeleteCityName(false);
  };

  const handleEditClick = (row) => {
    setOpenEditCity(true);
    setEditCityName(row.city_name);
    setRowData(row);
  };
  const handleCloseEditCityName = () => {
    setOpenEditCity(false);
  };

  const callApi = () => {
    axios.get(baseUrl+"get_all_cities").then((res) => {
      console.log(res);
      setCity(res.data.data);
      setRow(res.data.data);
    });
  };

  useEffect(() => {
    callApi();
  }, []);
  const cityColumns = [

    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = row.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "city_name",
      headerName: "City Name",
      width: 180,
      require: true,
      renderCell: (params) => {
        const name = params.value;
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        return <div>{capitalized}</div>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => handleEditClick(params.row)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => handleClickOpenDeleteCityName(params.row)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // const handleSaveEditCityName = () => {
  //   axios
  //     .put(baseUrl+"update_city", {
  //       _id: rowData._id,
  //       city_name: editCityName,
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         toastAlert(`${editCityName} updated successfully`);
  //         setEditCityName("");
  //         setOpenEditCity(false);
  //       } else {
  //         toastAlert("Something went wrong");
  //       }
  //       res.status === 200 && callApi();
  //     });
  // };

  const handleCityInputChange = (e) => {
    const a = city.filter((ele) => {
      return ele.city_name
        .toLowerCase()
        .includes(e.target.value.toLowerCase().trim());
    });
    setRow(a);
    setAddCity(e.target.value);
  };

  const handleClickAddCity = () => {
    axios
      .post(baseUrl+"add_city", { city_name: addCity })
      .then((res) => {
        if (res.status === 200) {
          toastAlert(`${addCity} added successfully`);
          setAddCity("");
        } else {
          toastAlert("Something went wrong");
        }
        res.status === 200 && callApi();
      });
  };

  return (
    <>
      <FormContainer mainTitle="City Master" link="/ip-master" />
      <Page>
        <Typography variant="h6">Add City</Typography>
        <TextField
          type="text"
          variant="outlined"
          label="City Name"
          value={addCity}
          onChange={handleCityInputChange}
        />
        <button
          className="btn btn-primary btn-lg"
          style={{ marginLeft: 16 }}
          disabled={row.length > 0}
          onClick={handleClickAddCity}
        >
          Add
        </button>
      </Page>

      <Box>
        <DataGrid
          rows={row}
          columns={cityColumns}
          getRowId={(row) => row._id}
        />
      </Box>

      <DeleteCity
        handleCloseDeleteCityName={handleCloseDeleteCityName}
        handleClickOpenDeleteCityName={handleClickOpenDeleteCityName}
        openDeleteCityName={openDeleteCityName}
        rowData={rowData}
        toastAlert={toastAlert}
        callApi={callApi}
      />
      {openEditCity && (
        <EditCity
          handleCloseEditCityName={handleCloseEditCityName}
          openEditCity={openEditCity}
          callApi={callApi}
          editCityName={editCityName}
          handleEditCity={handleEditCity}
          rowData={rowData}
          toastAlert={toastAlert}
          handleSaveEditCityName={handleSaveEditCityName}
        />
      )}
    </>
  );
}
