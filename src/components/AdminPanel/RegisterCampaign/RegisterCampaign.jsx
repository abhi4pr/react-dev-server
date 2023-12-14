import {
  Autocomplete,
  Button,
  FormControl,
  Paper,
  TextField,
} from "@mui/material";

import { useEffect, useState } from "react";
import AddPage from "./AddPage";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

export default function RegisterCampaign() {
  const [campaignDetailing, setCampaignDetailing] = useState("");
  const [showBrandName, setShowBrandName] = useState([]);
  const [xlxsData, setXlxsData] = useState([]);
  const [fields, setFields] = useState([{ selectValue: "", textValue: "" }]);
  const [showAlert, setShowAlert] = useState(false);
  const [campignData, setCampignData] = useState([{}]);
  const [campaign, setCampaign] = useState();
  const navigate = useNavigate();
  const createExcel = () => {
    const ws = XLSX.utils.json_to_sheet(xlxsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    // Validation for Brand Name
    if (!brandName) {
      // Handle the case when Brand Name is not selected
      // You can display an error message or take other actions here
      hasError = true;
    }

    if (!campaign) {
      hasError = true;
    }

    // Validation for Date Time
    if (!selectedDate) {
      // Handle the case when Date Time is not selected
      // You can display an error message or take other actions here
      hasError = true;
    }

    // Validation for Commitment
    const hasEmptyCommitment = fields.some(
      (field) => !field.selectValue || !field.textValue
    );
    if (hasEmptyCommitment) {
      // Handle the case when Commitment is not selected or Value is empty
      // You can display an error message or take other actions here
      hasError = true;
    }

    if (hasError) {
      // If there are validation errors, set showAlert to true to display the alert
      setShowAlert(true);
      return;
    }

    setShowAlert(false);

    const blob = createExcel();
    console.log(typeof selectedDate.toString());
    const form = new FormData();
    form.append("brand_id", brandName);
    form.append("brnad_dt", selectedDate);
    form.append("commitment", JSON.stringify(fields));
    form.append("excel_file", blob);
    form.append("exeCmpId", campaign?.value);
    form.append("detailing", campaignDetailing);
    form.append("status", 0);
    form.append("stage", 0);
    console.log(form, "<--------------------this is form");
    axios
      .post("http://34.93.221.166:3000/api/register_campaign", form)
      .then(() => {
        // Reset form fields on successful submission
        setBrandName([]);
        setSelectedDate(null);
        setFields([{ selectValue: "", textValue: "" }]);
        setXlxsData([]);
        setShowBrandName([]);
        setBrandName([]);
        setFields([]);
        navigate("/admin/registered-campaign");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const commitmentOptions = [
    "Reach",
    "Engagement",
    "Story views",
    "Reels views",
  ];

  const handleAddField = () => {
    const newField = { selectValue: "", textValue: "" };
    setFields([...fields, newField]);
  };
  const handleRemoveField = (e, i) => {
    setFields(fields.filter((field, index) => index !== i));
  };

  const handleSelectChange = (event, index) => {
    const updatedFields = [...fields];
    updatedFields[index].selectValue = event.target.value;
    setFields(updatedFields);

    console.log(
      campaignList.filter(
        (e) => !fields.map((e) => e.selectValue).includes(e.campaign_name)
      )
    );
  };

  const handleTextChange = (event, index) => {
    const updatedFields = [...fields];
    const inputValue = event.target.value;

    // Use a regular expression to check if inputValue is a valid number
    const isNumeric = /^[0-9]+$/.test(inputValue);

    if (isNumeric) {
      updatedFields[index].textValue = inputValue;
      setFields(updatedFields);
    } else {
      // Handle the case when inputValue is not a valid number
      // You can display an error message or take other actions here
    }
  };

  const [brandName, setBrandName] = useState([]);
  const [campaignList, setCampignList] = useState([]);
  const handleChange = (event) => {
    setBrandName(
      showBrandName.filter((e) => event.target.value == e.brand_name)[0]
        .brand_id
    );
  };

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    axios
      .get("http://34.93.221.166:3000/api/get_brands")
      .then((response) => {
        const data = response.data.data;
        setShowBrandName(data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://34.93.221.166:3000/api/get_all_commitments")
      .then((response) => {
        setCampignList(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://34.93.221.166:3000/api/exe_campaign")
      .then((response) => {
        const data = response.data.data;
        console.log(data, "<----data");
        setCampignData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <div>
        <div className="form_heading_title">
          <h2 className="form-heading">Register a Campaign</h2>
        </div>
      </div>
      <div style={{ height: "50px" }}>
        {/* Alert to display when there are validation errors */}
        {showAlert && (
          <div className="alert alert-danger" role="alert">
            Please fill in all the required fields.
          </div>
        )}
      </div>
      <div>
        <div className="card ">
          <div className="card-body ">
            <div className="d-flex">
              <Paper
                sx={{ padding: "10px", width: "100vw", marginBottom: "20px" }}
              >
                <div>
                  <FormControl sx={{ width: 300, marginRight: "10px" }}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={showBrandName.map((option) => option.brand_name)}
                      sx={{ width: 300 }}
                      require={true}
                      value={
                        showBrandName.filter((e) => brandName == e.brand_id)[0]
                          ?.brand_name
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Brand Name *" />
                      )}
                      onSelect={handleChange}
                    />
                  </FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date Time *"
                      value={selectedDate}
                      required
                      onChange={(newValue) => handleDateChange(newValue)}
                    />
                  </LocalizationProvider>
                  <FormControl sx={{ width: 300, marginLeft: "10px" }}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={campignData.map((option) => ({
                        label: option.exeCmpName,
                        value: option.exeCmpId,
                      }))}
                      sx={{ width: 300 }}
                      require={true}
                      value={campaign?.label}
                      onChange={(e, newValue) => setCampaign(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="Campaing *" />
                      )}
                    />
                  </FormControl>
                </div>
                <TextField
                  sx={{ width: "49%", mt: 2 }}
                  id="outlined-multiline-static"
                  label="Campaing Detailing"
                  multiline
                  rows={4}
                  value={campaignDetailing}
                  onChange={(e) => setCampaignDetailing(e.target.value)}
                  variant="outlined"
                />
              </Paper>
            </div>
            {fields.length > 0 && (
              <Paper sx={{ padding: "10px", marginBottom: "10px" }}>
                <FormControl>
                  {fields.map((field, index) => (
                    <div key={index} className="mt-2 mb-2 d-flex">
                      <FormControl sx={{ width: "300px", marginRight: "10px" }}>
                        <Autocomplete
                          required
                          disablePortal
                          value={
                            campaignList.filter(
                              (e) => e.cmtName == field.selectValue
                            )[0]?.cmtName
                          }
                          onChange={(event, newValue) => {
                            handleSelectChange(
                              {
                                target: {
                                  value: campaignList.filter(
                                    (e) => e.cmtName == newValue
                                  )[0].cmtId,
                                },
                              },
                              index
                            ),
                              console.log(
                                campaignList.filter(
                                  (e) => e.cmtName == newValue
                                )[0].cmtId,
                                "field.selectValue"
                              );
                          }}
                          options={campaignList
                            .filter(
                              (e) =>
                                !fields
                                  .map((e) => e.selectValue)
                                  .includes(e.cmtId)
                            )
                            .map((option) => option.cmtName)}
                          renderInput={(params) => (
                            <TextField {...params} label="Commitment *" />
                          )}
                        />
                      </FormControl>
                      <TextField
                        required
                        label="Value"
                        value={field.textValue}
                        type="number"
                        onChange={(event) => handleTextChange(event, index)}
                      />
                      <Button onClick={(e) => handleRemoveField(e, index)}>
                        <i className="fas fa-close"></i>
                      </Button>
                    </div>
                  ))}
                </FormControl>
              </Paper>
            )}
            <div className="d-flex justify-content-between">
              <div>
                {commitmentOptions.filter(
                  (e) => !fields.map((e) => e.selectValue).includes(e)
                ).length > 0 && (
                  <Button
                    variant="outlined"
                    sx={{ marginBottom: "10px", marginRight: "10px" }}
                    color="primary"
                    onClick={handleAddField}
                  >
                    Add Row
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
      <AddPage setXlxsData={setXlxsData} />

      <div className="d-flex mt-3 ms-4">
        <Button
          onClick={(e) => {
            handleSubmit(e);
            // e.preventDefault();
            console.log(
              brandName,
              JSON.stringify(fields),
              selectedDate,
              brandName,
              xlxsData
            );
          }}
          sx={{ marginBottom: "10px", marginRight: "10px" }}
          variant="contained"
          size="small"
          color="primary"
        >
          Register
        </Button>
      </div>
    </div>
  );
}
