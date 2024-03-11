import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import DataTable from "react-data-table-component";
import { Autocomplete, TextField } from "@mui/material";

export default function PMSplatformPriceTypeMast() {
  const { toastAlert } = useGlobalContext();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [priceTypeId, setPriceTypeId] = useState("");
  const [platformUpdateId, setPlatformUpdateId] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");
  const [rowData, setRowData] = useState({});
  const [platformPriceType, setPlatformPriceType] = useState({
    value: "",
    priceType: "",
  });
  const [description, setDescription] = useState("");
  const [priceList, setPriceList] = useState([]);
  const [platformList, setPlatformList] = useState([]);
  const [Platform, setPlatform] = useState({
    value: "",
    platformName: "",
  });
  const token = sessionStorage.getItem("token");
  const userID = jwtDecode(token).id;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.price_type?.toLowerCase().includes(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + "addPlatformPrice", {
        price_type_id: platformPriceType.value,
        platform_id: Platform.value,
        description: description,
        created_by: userID,
      })
      .then(() => {
        toastAlert("Submitted");
        setPlatformPriceType({ value: "", priceType: "" });
        setDescription("");
        setPlatform("");
        setPriceTypeId("");
        setDescriptionUpdate("");
        setPlatformUpdateId("");
        setPlatform({ value: "", platformName: "" });
        getData();
      });
  };

  const getData = () => {
    axios.get(baseUrl + "getPlatformPriceList").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });

    axios.get(baseUrl + "getPriceList").then((res) => {
      setPriceList(res.data.data);
    });

    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformList(res.data.data);
    });
  };

  const handleRowData = (row) => {
    let platform = platformList.find((option) => option._id === row.PMS_Platform_data.pmsPlatform_id,"platformList")
    setPlatformUpdateId({
      platformName: platform.platform_name,
      value: row.PMS_Platform_data.pmsPlatform_id,
    });
    console.log({
      platformName:  platform.platform_name,
      value: row.PMS_Platform_data.pmsPlatform_id,
    });
    setPriceTypeId(row.PMS_Pricetypes_data.pmsPriceType_id);
    setDescriptionUpdate(row.description);
    setRowData(row);
  };

  const handleModalUpdate = () => {
    axios
      .put(baseUrl + `updatePlatformPrice/${rowData._id}`, {
        platform_id: Platform.value,
        price_type_id: priceTypeId.value,
        description: descriptionUpdate,
        updated_by: userID,
      })
      .then(() => {
        toastAlert("Successfully Update");
        setPlatformUpdateId(" ");
        setPriceTypeId(" ");
        setDescriptionUpdate(" ");
        getData();
      });
  };

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Price Type",
      selector: (row) => row.PMS_Pricetypes_data.price_type,
    },
    {
      name: "Platform",
      selector: (row) => row.PMS_Platform_data.platform_name,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by_name,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handleRowData(row)}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="deletePlatformPrice"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Platform Price Master"
        title="Platform Price Master"
        handleSubmit={handleSubmit}
      >
        <Autocomplete
          id="price-type-autocomplete"
          options={priceList.map((option) => ({
            priceType: option.price_type,
            value: option._id,
          }))}
          value={priceList.find(
            (option) => option._id === platformPriceType.value
          )}
          getOptionLabel={(option) => option.priceType}
          style={{ width: 300 }}
          onChange={(e, value) => {
            setPlatformPriceType(value);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Price Type *" variant="outlined" />
          )}
        />

        <Autocomplete
          id="platform-autocomplete"
          options={platformList.map((option) => ({
            platformName: option.platform_name,
            value: option._id,
          }))}
          value={platformList.find((option) => option._id === Platform.value)}
          getOptionLabel={(option) => option.platformName || ""}
          style={{ width: 300 }}
          onChange={(e, value) => {
            setPlatform(value);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Platform *" variant="outlined" />
          )}
        />

        <FieldContainer
          label="Description"
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Pay Cycle Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search Here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>

      {/* <div id="myModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Update</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <Autocomplete
                id="price-type-autocomplete-update"
                options={priceList.map((option) => ({
                  priceType: option.price_type,
                  value: option._id,
                }))}
                
                value={priceList?.find((option) => option?._id === priceTypeId)}
                getOptionLabel={(option) => option.priceType}
                style={{ width: 300 }}
                onChange={(e, value) => {
                  setPriceTypeId(value.value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Price Type *"
                    variant="outlined"
                  />
                )}
              />

              <Autocomplete
                id="platform-autocomplete-update"
                options={platformList.map((option) => ({
                  platformName: option.platform_name,
                  value: option._id,
                }))}
                value={platformList.find(
                  (option) => option._id === platformUpdateId
                )}
                getOptionLabel={(option) => option.platformName}
                style={{ width: 300 }}
                onChange={(e, value) => {
                  setPlatform(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Platform *"
                    variant="outlined"
                  />
                )}
              />
              <FieldContainer
                label="Description"
                value={descriptionUpdate}
                required={false}
                onChange={(e) => setDescriptionUpdate(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleModalUpdate}
                data-dismiss="modal"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div> */}

<div id="myModal" className="modal fade" role="dialog">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h4 className="modal-title">Update</h4>
        <button type="button" className="close" data-dismiss="modal">
          &times;
        </button>
      </div>
      <div className="modal-body">
        <Autocomplete
          id="price-type-autocomplete-update"
          options={priceList.map((option) => ({
            priceType: option.price_type,
            value: option._id,
          }))}
          value={priceList.find((option) => option._id === priceTypeId)}
          getOptionLabel={(option) => option.priceType}
          style={{ width: 300 }}
          onChange={(e, value) => {
            setPriceTypeId(value ? value.value : ''); // Ensure to handle the case when value is null
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Price Type *"
              variant="outlined"
            />
          )}
        />
{/* 
<Autocomplete
  id="platform-autocomplete-update"
  options={platformList.map((option) => ({
    platformName: option.platform_name,
    value: option._id,
  }))}
  // inputValue={Platform.platformName}
  value={platformList.find((option) => option._id === platformUpdateId)} // Set default value to null if not found
  getOptionLabel={(option) => option.platformName}
  style={{ width: 300 }}
  onChange={(e, value) => {
    setPlatform(value ? value : ''); // Ensure to handle the case when value is null
    console.log(value)
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Platform *"
      variant="outlined"
    />
  )}
/> */}

<Autocomplete
  id="platform-autocomplete-update"
  options={platformList.map((option) => ({
    platformName: option.platform_name,
    value: option._id,
  }))}
  inputValue={Platform.platformName}
  value={platformList.find((option) => option._id === platformUpdateId.value)}
  getOptionLabel={(option) => option.platformName}
  style={{ width: 300 }}
  onChange={(e, value) => {
    setPlatformUpdateId(value);
  }

  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Platform *"
      variant="outlined"

    />  
  )}
/>



        <FieldContainer
          label="Description"
          value={descriptionUpdate}
          required={false}
          onChange={(e) => setDescriptionUpdate(e.target.value)}
        />
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-primary"
          data-dismiss="modal"
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleModalUpdate}
          data-dismiss="modal"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</div>

    </>
  );
}
