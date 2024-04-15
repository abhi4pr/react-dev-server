import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import Select from "react-select";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import FieldContainer from "../FieldContainer";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useGlobalContext } from "../../../Context/Context";

export default function PurchasePrice() {
  const { id } = useParams();
  const { toastAlert, toastError } = useGlobalContext();

  const [priceTypeList, setPriceTypeList] = useState([]);
  const [priceTypeId, setPriceTypeId] = useState("");
  const [rateType, setRateType] = useState({ value: "Fixed", label: "Fixed" });
  const [variableType, setVariableType] = useState({
    value: "Per Thousand",
    label: "Per Thousand",
  });
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [platformData, setPlatformData] = useState([]);
  const [platformId, setPlatformId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [allPriceList, setAllPriceList] = useState([]);
  const [allPriceTypeList, setAllallPriceTypeList] = useState([]);

  const getData = () => {
    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformData(res.data.data);
    });

    axios.get(baseUrl + `get_page_purchase_price/${+id}`).then((res) => {
      setTableData(res.data.data);
    });
    axios.get(baseUrl + `get_all_data_list`).then((res) => {
      setAllallPriceTypeList(res.data.data);
      console.log(res.data.data, "price type list api");
    });
  };

  useEffect(() => {
    if (tableData.length > 0) {
      axios.get(baseUrl + `getPriceList`).then((res) => {
        setAllPriceList(res.data.data);
      });
    }
  }, [tableData]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (platformId) {
      setPriceTypeId("")
      setPriceTypeList([]);
      let priceData = platformData.find((role) => role._id == platformId)?._id;
      axios
        .get(baseUrl + `data/${priceData}`)
        .then((res) => {
          setPriceTypeList(res.data.data);
        });
    }
  }, [platformId]);

  const handlePriceTypeChange = (selectedOption) => {
    setPriceTypeId(selectedOption.value);
  };

  const handleRateTypeChange = (selectedOption) => {
    setRateType(selectedOption);
  };

  const handleVariableTypeChange = (selectedOption) => {
    setVariableType(selectedOption);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let copyData = tableData.find(
      (e) =>
        e.PMS_PageMast_data.platform_id == platformId &&
        e.price_type_id == priceTypeId
    );
    if (copyData) {
      toastError("Data already exists");
      return;
    }

    if (!priceTypeId || !priceTypeId || !rateType || !price) {
      toastAlert("Please fill all the fields");
      return;
    }
    let data = {
      platform_id: platformId,
      pageMast_id: id,
      price_cal_type: rateType.value,
      price_type_id: priceTypeId,
      variable_type: rateType.value == "Variable" ? variableType.value : null,
      purchase_price: price,
      description: description,
    };
    axios
      .post(baseUrl + "add_page_purchase_price", data)
      .then((res) => {
        if (res.data.status === 200) {
          toastAlert("Data added successfully");
          setPriceTypeId("");
          setRateType({ value: "Fixed", label: "Fixed" });
          setVariableType({ value: "Per Thousand", label: "Per Thousand" });
          setPrice("");
          setDescription("");
          setPlatformId("");

          getData();
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => {
        toastError(err.response.data.message);
      });
  };

  const columns = [
    {
      field: "S.No",
      headerName: "S.No",
      width: 90,
      renderCell: (params) => (
        <strong>{tableData.indexOf(params.row) + 1}</strong>
      ),
    },
    {
      field: "PMS_Platforms_data.platform_name",
      headerName: "Platform Name",
      width: 200,
      renderCell: (params) => (
        <strong>
          {
            platformData.find(
              (e) => e._id == params.row?.PMS_PageMast_data.platform_id
            )?.platform_name
          }
        </strong>
      ),
    },
    {
      field: "PMS_Platforms_data.price_type",
      headerName: "Price Type",
      width: 200,
      renderCell: ({ row }) => {
        let f = allPriceTypeList?.filter((item) =>
          row?.price_type_id?.includes(item?.price_type_id)
        );
        return (
          <>
            {f.map((item, i) => {
              return (
                <>
                  {item?.price_type}
                  {i !== f.length - 1 && ","}
                </>
              );
            })}
          </>
        );
      },
    },
    { field: "price_cal_type", headerName: "Rate Type", width: 200 },
    { field: "variable_type", headerName: "Variable Type", width: 200 },
    { field: "purchase_price", headerName: "Price", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Page Master"
        title="Page Master"
        handleSubmit={handleSubmit}
        submitButton={false}
      >
        <div className="form-group col-6">
          <label className="form-label">
            Platform ID <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformData.map((option) => ({
              value: option._id,
              label: option.platform_name,
            }))}
            value={{
              value: platformId,
              label:
                platformData.find((role) => role._id === platformId)
                  ?.platform_name || "",
            }}
            onChange={(e) => {
              setPlatformId(e.value);
            }}
          ></Select>
        </div>
        <div className="form-group col-6 row">
          <label className="form-label">
            Price Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            isMulti
            options={priceTypeList.map((option) => ({
              value: option.price_type_id,
              label: option.price_type,
            }))}
            required={true}
            value={priceTypeId}
            onChange={handlePriceTypeChange}
          />
        </div>

        <div className="form-group col-6 row">
          <label className="form-label">
            Rate Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={["Fixed", "Variable"].map((option) => ({
              value: option,
              label: option,
            }))}
            required={true}
            value={{
              value: rateType.value,
              label: rateType.label,
            }}
            onChange={handleRateTypeChange}
          />
        </div>
        {rateType.label == "Variable" && (
          <div className="form-group col-6 row">
            <label className="form-label">
              Variable Type <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={["Per Thousand", "Per Million"].map((option) => ({
                value: option,
                label: option,
              }))}
              required={true}
              value={{
                value: variableType.value,
                label: variableType.label,
              }}
              onChange={handleVariableTypeChange}
            />
          </div>
        )}
        <FieldContainer
          label=" Price *"
          required={true}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <FieldContainer
          label="Discription "
          type="text"
          required={false}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#3f51b5",
              color: "white",
              marginTop: "20px",
              mb: "20px",
            }}
          >
            Submit
          </Button>
        </div>
        <DataGrid
          rows={tableData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row._id}
        />
      </FormContainer>
    </>
  );
}
