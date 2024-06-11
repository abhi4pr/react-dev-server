import {
  Button,
  TextField,
  Autocomplete,
  FormControl,
  Box,
} from "@mui/material";
import { IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import FormContainer from "../FormContainer";
import CreateCampaign from "./CampaignMaster/CreateCampaign";
import OverViewCampaign from "./CampaignMaster/OverViewCampaign";

export default function RegisterCampaigns() {
  const navigate = useNavigate();
  const location = useLocation();
  const saleBookingId = location.state?.sale_id;
  const [openCamp, setOpenCamp] = useState(false);
  const [openCampView, setOpenCampView] = useState(false);
  const handleOpenCampaign = () => setOpenCamp(true);
  const handleCloseCampaign = () => setOpenCamp(false);

  const handleViewCampaign = () => setOpenCampView(true);
  const handleCloseCampaignView = () => setOpenCampView(false);

  const [salesUsers, setSalesUsers] = useState([]);
  const { toastAlert, toastError } = useGlobalContext();
  const [campaignDetailing, setCampaignDetailing] = useState("");
  const [showBrandName, setShowBrandName] = useState([]);
  const [xlxsData, setXlxsData] = useState([]);
  const [fields, setFields] = useState([{ selectValue: "", textValue: "" }]);
  const [showAlert, setShowAlert] = useState(false);
  const [campignData, setCampignData] = useState([{}]);
  const [campaign, setCampaign] = useState();
  const [industry, setIndustry] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [goal, setGoal] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("");
  const [agencyList, setAgencyList] = useState([]);
  const [campaignClosedBy, setCampaignClosedBy] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [campaignList, setCampignList] = useState([]);

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

    if (!campaignClosedBy) {
      hasError = true;
    }

    if (hasError) {
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    const payload = {
      pre_brand_id: brandName,
      brnad_dt: selectedDate,
      commitments: JSON.stringify(fields),
      pre_campaign_id: campaign?.value,
      details: campaignDetailing,
      captions: caption,
      hash_tag: hashtag,
      pre_agency_id: selectedAgency,
      pre_industry_id: selectedIndustry,
      pre_goal_id: selectedGoal,
      campaign_closed_by: campaignClosedBy,
      sale_booking_id:saleBookingId
    };
    setLoading(true);
    axios
      .post(baseUrl + "opcampaign", payload)
      .then(() => {
        setBrandName([]);
        setSelectedDate(null);
        setFields([{ selectValue: "", textValue: "" }]);
        setXlxsData([]);
        setShowBrandName([]);
        setBrandName([]);
        setFields([]);
        setLoading(false);
        navigate("/admin/op-registered-campaign");
        toastAlert("Campaign Regrister Successfully");
      })
      .catch((err) => {
        setLoading(false);
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
  const handleChange = (event) => {
    setBrandName(
      showBrandName.filter(
        (e) => event.target.value.toLowerCase() == e.brand_name.toLowerCase()
      )[0]?._id
    );
  };

  useEffect(() => {
    setSelectedDate(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    getAllData();
  }, []);

  const getExeCampData = async () => {
    const res = await axios.get(
      `${baseUrl}get_single_sale_booking_data_old_table/${saleBookingId}`
    );
    console.log(res.data.data);
  };

  const getAllData = () => {
    axios
      .get(baseUrl + "get_brands")
      // .get(`http://35.200.154.203:8080/api/insta_brand`)
      .then((response) => {
        const data = response.data.data;
        setShowBrandName(data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(baseUrl + "get_all_commitments")
      .then((response) => {
        setCampignList(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(baseUrl + "exe_campaign")
      .then((response) => {
        const data = response.data.data;
        setCampignData(data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl + "agency")
      .then((response) => {
        const data = response?.data?.result;
        setAgencyList(data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl + "goal")
      .then((response) => {
        const data = response.data.result;
        setGoal(data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl + "industry")
      .then((response) => {
        const data = response.data.result;
        setIndustry(data);
      })
      .catch((err) => {
        console.log(err);
      });
    getExeCampData();
  };

  const handleHashtagChange = (event) => {
    setHashtag(event.target.value);
  };
  const handleAgencyChange = (event) => {
    setSelectedAgency(
      agencyList.filter(
        (e) => event.target.value.toLowerCase() == e.name.toLowerCase()
      )[0]?._id
    );
  };
  const handleGoalChange = (event) => {
    setSelectedGoal(
      goal.filter(
        (e) => event.target.value.toLowerCase() == e.name.toLowerCase()
      )[0]?._id
    );
  };

  const handleIndusrtyChange = (event) => {
    setSelectedIndustry(
      industry.filter(
        (e) => event.target.value.toLowerCase() == e.name.toLowerCase()
      )[0]?._id
    );
  };

  const handleCampaignClose = (event) => {
    setCampaignClosedBy(
      salesUsers.filter(
        (e) => event.target.value.toLowerCase() == e.user_name.toLowerCase()
      )[0]?.user_id
    );
  };

  const fetchSalesUsers = () => {
    axios
      .get(`${baseUrl}get_all_sales_users`)
      .then((response) => {
        setSalesUsers(response.data);
      })
      .catch((err) => {
        console.log(err);
        toastError("Failed to fetch sales users");
      });
  };

  const categoryData = () => {
    axios.get(baseUrl + "projectxCategory").then((res) => {
      setCategoryOptions(res.data.data);
    });
  };
  useEffect(() => {
    categoryData();
    fetchSalesUsers();
    getAllData();
  }, []);

  const formatString = (s) => {
    let formattedString = s?.replace(/^_+/, "");
    if (formattedString) {
      formattedString = formattedString
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    }
    return formattedString;
  };
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle="Register Campaign" link="true" />
        </div>
        <div className="action_btns">
          <Link to="/admin/overview/industry" style={{ marginRight: "5px" }}>
            <button
              type="button"
              className="btn cmnbtn btn-outline-primary btn_sm"
            >
              Industry Master
            </button>
          </Link>
          <Link to="/admin/overview/goal" style={{ marginRight: "5px" }}>
            <button
              type="button"
              className="btn cmnbtn btn-outline-primary btn_sm"
            >
              Goal Master
            </button>
          </Link>
          <Link to="/admin/contentcreater" style={{ marginRight: "5px" }}>
            <button
              type="button"
              className="btn cmnbtn btn-outline-primary btn_sm"
            >
              Commitment Master
            </button>
          </Link>
        </div>
      </div>
      <>
        {showAlert && (
          <div className="alert alert-danger mt-3" role="alert">
            Please fill in all the required fields.
          </div>
        )}
      </>
      <div className="card body-padding" style={{ marginTop: "20px" }}>
        <>
          <Box>
            <Box className="row">
              <div className="col-md-4 mb16">
                <div className="form-group m0">
                  <div className="input-group inputAddGroup">
                    <Autocomplete
                      options={campignData.map((option) => ({
                        label: formatString(option.exe_campaign_name),
                        value: option._id,
                      }))}
                      require={true}
                      value={campaign?.label}
                      onChange={(e, newValue) => setCampaign(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="Campaign *" />
                      )}
                    />

                    <IconButton
                      onClick={handleOpenCampaign}
                      variant="contained"
                      color="primary"
                      aria-label="Add Platform.."
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleViewCampaign}
                      variant="contained"
                      color="primary"
                      aria-label="Platform Info.."
                    >
                      <InfoIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
              <div className="form-group col-4">
                <Autocomplete
                  disablePortal
                  options={showBrandName.map((option) =>
                    formatString(option.brand_name)
                  )}
                  require={true}
                  value={
                    showBrandName.filter((e) => brandName == e._id)[0]
                      ?.brand_name
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Brand Name *" />
                  )}
                  onSelect={handleChange}
                />
              </div>

              <div className="form-group col-4">
                <TextField
                  label="Date and Time *"
                  value={selectedDate}
                  disabled
                  fullWidth
                  sx={{ width: 300 }}
                />
              </div>
              <div className="form-group col-4">
                <Autocomplete
                  options={
                    industry?.length > 0 &&
                    industry.map((option) => option.name)
                  }
                  value={
                    industry.filter((e) => selectedIndustry == e._id)[0]?.name
                  }
                  onSelect={handleIndusrtyChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Industry" />
                  )}
                />
              </div>
              <div className="form-group col-4">
                <Autocomplete
                  options={
                    agencyList?.length > 0 &&
                    agencyList?.map((option) => option?.name)
                  }
                  value={
                    agencyList.filter((e) => selectedAgency == e._id)[0]?.name
                  }
                  onSelect={handleAgencyChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Agency" />
                  )}
                />
              </div>
              <div className="form-group col-4">
                <Autocomplete
                  options={
                    goal?.length > 0 && goal?.map((option) => option?.name)
                  }
                  value={goal.filter((e) => selectedGoal == e._id)[0]?.name}
                  onSelect={handleGoalChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Goal" />
                  )}
                />
              </div>
              <div className="form-group col-4">
                <TextField
                  label="Hashtag"
                  value={hashtag}
                  onChange={handleHashtagChange}
                  variant="outlined"
                  fullWidth
                />
              </div>
              <div className="form-group col-4">
                <Autocomplete
                  options={
                    salesUsers?.length > 0 &&
                    salesUsers?.map((user) => formatString(user.user_name))
                  }
                  value={
                    salesUsers.filter((e) => campaignClosedBy == e._id)[0]
                      ?.user_name
                  }
                  onSelect={handleCampaignClose}
                  renderInput={(params) => (
                    <TextField {...params} label="Campaign Closed By *" />
                  )}
                />
              </div>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
            <TextField
              label="Campaign Detail"
              fullWidth
              multiline
              value={campaignDetailing}
              onChange={(e) => setCampaignDetailing(e.target.value)}
              sx={{ mr: 1 }}
            />

            <TextField
              label="Caption"
              value={caption}
              multiline
              onChange={(e) => setCaption(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
          <>
            {fields.length > 0 && (
              <FormControl sx={{ mr: 1 }}>
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
                      requiredx
                      label="Value"
                      value={field.textValue}
                      type="number"
                      fullWidth
                      onChange={(event) => handleTextChange(event, index)}
                    />
                    {fields.length > 1 && (
                      <Button onClick={(e) => handleRemoveField(e, index)}>
                        <i className="fas fa-close"></i>
                      </Button>
                    )}
                  </div>
                ))}
              </FormControl>
            )}
          </>
        </>

        <div className="d-flex justify-content-between">
          <div>
            {commitmentOptions.filter(
              (e) => !fields.map((e) => e.selectValue).includes(e)
            ).length > 0 && (
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                color="secondary"
                className="btn btn-primary cmnbtn btn_sm"
                onClick={handleAddField}
              >
                Add Row
              </Button>
            )}
          </div>
        </div>
        <br />
      </div>

      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <button
          onClick={(e) => {
            handleSubmit(e);
          }}
          variant="outlined"
          color="secondary"
          className="btn btn-primary cmnbtn  mt-3 mb-3"
          disabled={loading}
        >
          {loading ? "Submitting" : "Submit"}
        </button>
      </Box>
      <>
        <>
          {/* Create Campaign */}
          <CreateCampaign
            openCamp={openCamp}
            handleOpenCampaign={handleOpenCampaign}
            handleCloseCampaign={handleCloseCampaign}
          />
          <OverViewCampaign
            openCamp={openCampView}
            handleOpenCampaign={handleViewCampaign}
            handleCloseCampaign={handleCloseCampaignView}
          />
        </>
      </>
    </div>
  );
}
