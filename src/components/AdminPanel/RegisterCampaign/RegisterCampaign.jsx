import {
  Button,
  TextField,
  Autocomplete,
  FormControl,
  Paper,
  Box,
} from "@mui/material";

import { useEffect, useState } from "react";
import AddPage from "./AddPage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import axios from "axios";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../utils/config";

export default function RegisterCampaign() {

  const { toastAlert, toastError } = useGlobalContext();

  const [showPageDetails, setShowPageDetails] = useState(false);
  const [campaignDetailing, setCampaignDetailing] = useState("");
  const [showBrandName, setShowBrandName] = useState([]);
  const [xlxsData, setXlxsData] = useState([]);
  const [fields, setFields] = useState([{ selectValue: "", textValue: "" }]);
  const [showAlert, setShowAlert] = useState(false);
  const [campignData, setCampignData] = useState([{}]);
  const [campaign, setCampaign] = useState();
  const [campaignAmount, setCampaignAmount] = useState("");
  const [industry, setIndustry] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [goal, setGoal] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("");
  const [agencyList, setAgencyList] = useState([]);
  //const [service, setService] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const togglePageDetails = () => {
    setShowPageDetails(!showPageDetails);
  };

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
    if (!brandName) {
      hasError = true;
    }

    if (!campaign) {
      hasError = true;
    }

    if (!selectedDate) {
      hasError = true;
    }

    const hasEmptyCommitment = fields.some(
      (field) => !field.selectValue || !field.textValue
    );
    if (hasEmptyCommitment) {
      hasError = true;
    }

    if (hasError) {
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
    form.append("captions", caption);
    form.append("hashtags", hashtag);
    form.append("agency", selectedAgency);
    form.append("industry", selectedIndustry);
    form.append("goal", selectedGoal);
    //form.append("service", selectedService);

    console.log(form, "<--------------------this is form");
    axios
      .post(baseUrl+"register_campaign", form)
      .then(() => {
        setBrandName([]);
        setSelectedDate(null);
        setFields([{ selectValue: "", textValue: "" }]);
        setXlxsData([]);
        setShowBrandName([]);
        setBrandName([]);
        setFields([]);
        navigate("/admin/registered-campaign");
        toastAlert("Campaign Regrister Successfully")   
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
    const isNumeric = /^[0-9]+$/.test(inputValue);

    if (isNumeric) {
      updatedFields[index].textValue = inputValue;
      setFields(updatedFields);
    } else {
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

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    axios
      .get(baseUrl+"get_brands")
      .then((response) => {
        const data = response.data.data;
        setShowBrandName(data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(baseUrl+"get_all_commitments")
      .then((response) => {
        setCampignList(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(baseUrl+"exe_campaign")
      .then((response) => {
        const data = response.data.data;
        console.log(data, "<----data");
        setCampignData(data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl+"agency")
      .then((response) => {
        const data = response.data.result;
        console.log(data, "<----agency");
        setAgencyList(data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl+"goal")
      .then((response) => {
        const data = response.data.result;
        console.log(data, "<----goal");
        setGoal(data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl+"industry")
      .then((response) => {
        const data = response.data.result;
        console.log(data, "<----industry");
        setIndustry(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleHashtagChange = (event) => {
    setHashtag(event.target.value);
  };
  const handleAgencyChange = (event, newValue) => {
    setSelectedAgency(newValue);
  };
  const handleGoalChange = (event, newValue) => {
    setSelectedGoal(newValue);
  };
  const handleIndusrtyChange = (event, newValue) => {
    setSelectedIndustry(newValue);
  };

  return (
    <div>
      <div>
        <div className="form_heading_title">
          <h2 className="form-heading">Register Campaign</h2>
        </div>
      </div>
      <div style={{ height: "30px" }}>
        {/* Alert to display when there are validation errors */}
        {showAlert && (
          <div className="alert alert-danger" role="alert">
            Please fill in all the required fields.
          </div>
        )}
      </div>
      <div>
        <Paper sx={{}}>
          <Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", m: 1 }}
            >
              <Autocomplete
                disablePortal
                options={showBrandName.map((option) => option.brand_name)}
                sx={{ width: 300, mt: 2 }}
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
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={campignData.map((option) => ({
                  label: option.exeCmpName,
                  value: option.exeCmpId,
                }))}
                sx={{ width: 300, mt: 2 }}
                require={true}
                value={campaign?.label}
                onChange={(e, newValue) => setCampaign(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Campaign *" />
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                  label="Date *"
                  value={selectedDate}
                  required
                  sx={{ width: 300, mt: 2 }}
                  onChange={(newValue) => handleDateChange(newValue)}
                  showTimePicker={false}
                />
              </LocalizationProvider>

              <Autocomplete
                disablePortal
                id="agency-dropdown"
                options={
                  industry?.length > 0 && industry.map((option) => option.name)
                }
                sx={{ width: 300,mt: 2 }}
                value={selectedIndustry}
                onChange={handleIndusrtyChange}
                renderInput={(params) => (
                  <TextField {...params} label="Industry *" />
                )}
              />
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <Autocomplete
                disablePortal
                id="agency-dropdown"
                options={
                  agencyList?.length > 0 &&
                  agencyList.map((option) => option.name)
                }
                sx={{ width: 400,mt:1 }}
                value={selectedAgency}
                onChange={handleAgencyChange}
                renderInput={(params) => (
                  <TextField {...params} label="Agency *" />
                )}
              />

              <Autocomplete
                disablePortal
                id="agency-dropdown"
                options={
                  goal?.length > 0 &&
                  goal.map((option) => option.name)
                }
                sx={{ width: 400,mt:1 }}
                value={selectedGoal}
                onChange={handleGoalChange}
                renderInput={(params) => (
                  <TextField {...params} label="Goal *" />
                )}
              />

              <TextField
                label="Hashtag *"
                value={hashtag}
                onChange={handleHashtagChange}
                sx={{ width: 400, mt:1}}
                variant="outlined"
              />

              {/* <TextField
                label="Campaign Amount"
                value={campaignAmount}
                onChange={(e) => setCampaignAmount(e.target.value)}
                type="number"
                sx={{ width: "300px", marginLeft: "10px" }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: 0,
                }}
              /> */}
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
            <TextField
              label="Campaign Detail"
              fullWidth
              multiline
              value={campaignDetailing}
              onChange={(e) => setCampaignDetailing(e.target.value)}
              sx={{ mt:2,mr:1,ml:1 }}
            />

            <TextField
              label="Caption"
              value={caption}
              multiline
              onChange={(e) => setCaption(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mt: 2,mr:1 }}
            />
          </Box>
          <>
            {fields.length > 0 && (
              <FormControl sx={{ mr: 1, ml: 1 }}>
                {fields.map((field, index) => (
                  <div key={index} className="mt-2 mb-2 d-flex">
                    <FormControl sx={{ width: "900px", marginRight: "10px" }}>
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
                      fullWidth
                      onChange={(event) => handleTextChange(event, index)}
                    />
                    <Button onClick={(e) => handleRemoveField(e, index)}>
                      <i className="fas fa-close"></i>
                    </Button>
                  </div>
                ))}
              </FormControl>
            )}
          </>
        </Paper>

        <div className="d-flex justify-content-between">
          <div>
            {commitmentOptions.filter(
              (e) => !fields.map((e) => e.selectValue).includes(e)
            ).length > 0 && (
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                color="secondary"
                onClick={handleAddField}
              >
                Add Row
              </Button>
            )}
            {/* <Button
              variant="outlined"
              onClick={togglePageDetails}
              sx={{ mt: 2, ml: 2 }}
            >
              {showPageDetails ? " Remove Excel " : " Fetch Excel"}
            </Button> */}
          </div>
        </div>

        <br />
      </div>

      {/* {showPageDetails && <AddPage setXlxsData={setXlxsData} />} */}

      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
  <Button
    onClick={(e) => {
      handleSubmit(e);
    }}
    variant="outlined"
    size="large"
    color="secondary"
    sx={{
      mt: 1,
      borderColor: "red",
      fontWeight: 'bold',
      textTransform: 'none',
      transition: 'all 0.5s ease-in-out',
      '&:hover': {
        backgroundColor: "white",
        borderColor: "primary.dark",
        transform: 'scale(1.05)',
      },
    }}
  >
    Register
  </Button>
</Box>

    </div>
  );
}
