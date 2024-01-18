import React from "react";
import Stack from "@mui/material/Stack";
import {
  Autocomplete,
  Button,
  Checkbox,
  InputAdornment,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useState } from "react";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useGlobalContext } from "../../Context/Context";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { Country, City } from "country-state-city";
import UserNav from "../Pantry/UserPanel/UserNav";
import FormContainer from "../AdminPanel/FormContainer";
import { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { set } from "date-fns";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import jwtDecode from "jwt-decode";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ExeUPdate() {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const location = useLocation();

  const { toastAlert } = useGlobalContext();
  const [rows, setRows] = useState([]);
  const [pagemode, setPagemode] = useState(1);
  const [alldata, setAlldata] = useState([]);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [reach, setReach] = useState(0);
  const [impression, setImpression] = useState(0);
  const [engagement, setEngagement] = useState(0);
  const [storyView, setStoryView] = useState(0);
  const [rowData, setRowData] = useState({});
  const [statesFor, setStatesFor] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [demoFile, setDemoFile] = useState();
  const [stateForIsValid, setStateForIsValid] = useState(false);
  const [stateForIsNotQuater, setStateForIsNotQuater] = useState(false);
  const [quater, setQuater] = useState("");
  const [quaterIsValid, setQuaterIsValid] = useState(false);

  const [endDateIsValid, setEndDateIsValid] = useState(false);
  const [reachValidation, setReachValidation] = useState(true);
  const [impressionValidation, setImpressionValidation] = useState(true);
  const [engagementValidation, setEngagementValidation] = useState(true);
  const [storyViewValidation, setStoryViewValidation] = useState(true);
  const [impressionImg, setImpressionImg] = useState();
  const [engagementImg, setEngagementImg] = useState();
  const [storyViewImg, setStoryViewImg] = useState();
  const [storyViewVideo, setStoryViewVideo] = useState(null);
  const [city1, setCity1] = useState(null);
  const [city2, setCity2] = useState(null);
  const [city3, setCity3] = useState(null);
  const [city4, setCity4] = useState(null);
  const [city5, setCity5] = useState(null);
  const [city1Percentage, setCity1Percentage] = useState(0);
  const [city2Percentage, setCity2Percentage] = useState(0);
  const [city3Percentage, setCity3Percentage] = useState(0);
  const [city4Percentage, setCity4Percentage] = useState(0);
  const [city5Percentage, setCity5Percentage] = useState(0);
  const [cityImg, setCityImg] = useState(null);
  const [malePercentage, setMalePercentage] = useState(0);
  const [femalePercentage, setFemalePercentage] = useState(0);
  const [age1Percentage, setAge1Percentage] = useState(0);
  const [age2Percentage, setAge2Percentage] = useState(0);
  const [age3Percentage, setAge3Percentage] = useState(0);
  const [age4Percentage, setAge4Percentage] = useState(0);
  const [age5Percentage, setAge5Percentage] = useState(0);
  const [age6percentage, setAge6Percentage] = useState(0);
  const [age7Percentage, setAge7Percentage] = useState(0);
  const [ageImg, setAgeImg] = useState("");
  const [profileVisit, setProfileVisit] = useState(0);
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [country1, setCountry1] = useState(null);
  const [country2, setCountry2] = useState(null);
  const [country3, setCountry3] = useState(null);
  const [country4, setCountry4] = useState(null);
  const [country5, setCountry5] = useState(null);
  const [country1Percentage, setCountry1Percentage] = useState(0);
  const [country2Percentage, setCountry2Percentage] = useState(0);
  const [country3Percentage, setCountry3Percentage] = useState(0);
  const [country4Percentage, setCountry4Percentage] = useState(0);
  const [country5Percentage, setCountry5Percentage] = useState(0);
  const [countryImg, setCountryImg] = useState();
  const [impressionimgSrc, setImpressionimgSrc] = useState(null);
  const [engagementImgSrc, setEngagementImgSrc] = useState(null);
  const [storyViewImgSrc, setStoryViewImgSrc] = useState(null);
  const [storyViewVideoSrc, setStoryViewVideoSrc] = useState(null);
  const [countryImgSrc, setCountryImgSrc] = useState(null);
  const [cityImgSrc, setCityImgSrc] = useState(null);
  const [ageImgSrc, setAgeImgSrc] = useState(null);
  const [reachImgSrc, setReachImgSrc] = useState(null);
  const [reachImg, setReachImg] = useState(null);
  const [storyViewDate, setStoryViewDate] = useState("");

  const navigate = useNavigate();
  const saveStats = async (e) => {
    console.log(storyViewDate);
    e.preventDefault();

    const formData = new FormData();
    formData.append("_id", id.id);
    formData.append("reach", reach);
    formData.append("impression", impression);
    formData.append("engagement", engagement);
    formData.append("story_view", storyView);
    demoFile ? formData.append("media", demoFile) : "";
    quater ? formData.append("quater", quater) : "";
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("stats_for", statesFor);
    formData.append("impression_upload_image", impressionImg);
    formData.append("reach_upload_image", reachImg);
    formData.append("engagement_upload_image", engagementImg);
    formData.append("story_view_upload_image", storyViewImg);
    formData.append("story_view_upload_video", storyViewVideo);
    formData.append("city_image_upload", cityImg);
    formData.append("Age_upload", ageImg);
    formData.append("city1_name", city1);
    formData.append("city2_name", city2);
    formData.append("city3_name", city3);
    formData.append("city4_name", city4);
    formData.append("city5_name", city5);
    formData.append("percentage_city1_name", city1Percentage);
    formData.append("percentage_city2_name", city2Percentage);
    formData.append("percentage_city3_name", city3Percentage);
    formData.append("percentage_city4_name", city4Percentage);
    formData.append("percentage_city5_name", city5Percentage);
    formData.append("male_percent", malePercentage);
    formData.append("female_percent", femalePercentage);
    formData.append("Age_13_17_percent", age1Percentage);
    formData.append("Age_18_24_percent", age2Percentage);
    formData.append("Age_25_34_percent", age3Percentage);
    formData.append("Age_35_44_percent", age4Percentage);
    formData.append("Age_45_54_percent", age5Percentage);
    formData.append("Age_55_64_percent", age6percentage);
    formData.append("Age_65_plus_percent", age7Percentage);

    formData.append("profile_visit", profileVisit);
    formData.append("country1_name", country1);
    formData.append("country2_name", country2);
    formData.append("country3_name", country3);
    formData.append("country4_name", country4);
    formData.append("country5_name", country5);
    formData.append("percentage_country1_name", country1Percentage);
    formData.append("percentage_country2_name", country2Percentage);
    formData.append("percentage_country3_name", country3Percentage);
    formData.append("percentage_country4_name", country4Percentage);
    formData.append("percentage_country5_name", country5Percentage);
    formData.append("country_image_upload", countryImg);
    formData.append("user_id", userID);
    formData.append("story_view_date", storyViewDate);

    axios
      .put(
        `http://34.93.221.166:3000/api/edit_exe_ip_count_history`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        navigate("/admin/exeexecution/all");
        toastAlert("Form Submitted success");
      });
  };

  const apiCall = () => {
    axios
      .get(
        `http://34.93.221.166:3000/api/get_exe_ip_count_history/${location.state}`
      )
      .then((res) => {
        let data = res.data.data.filter((e) => {
          return e.isDeleted !== true;
        });
        data = data[data.length - 1];
        setReach(data.reach);
        setProfileVisit(data.profile_visit);
        setAge1Percentage(data.Age_13_17_percent);
        setAge2Percentage(data.Age_18_24_percent);
        setAge3Percentage(data.Age_25_34_percent);
        setAge4Percentage(data.Age_35_44_percent);
        setAge5Percentage(data.Age_45_54_percent);
        setAge6Percentage(data.Age_55_64_percent);
        setAge7Percentage(data.Age_65_plus_percent);
        // setAgeImg(data.Age_upload_url);
        setAgeImgSrc(data.Age_upload_url);
        setCity1(data.city1_name);
        setCity2(data.city2_name);
        setCity3(data.city3_name);
        setCity4(data.city4_name);
        setCity5(data.city5_name);
        // setCityImg(data.city_image_upload_url);
        setCityImgSrc(data.city_image_upload_url);
        setEndDate(data.end_date);
        setEndDate(dayjs(new Date(data.end_date?.split("T")[0])));
        setStartDate(dayjs(new Date(data.start_date?.split("T")[0])));
        setStoryViewDate(
          data.story_view_date != null
            ? dayjs(new Date(data.story_view_date?.split("T")[0]))
            : ""
        );
        setEngagement(data.engagement);
        // setEngagementImg(data.engagement_upload_image_url);
        setEngagementImgSrc(data.engagement_upload_image_url);
        setFemalePercentage(data.female_percent);
        setImpression(data.impression);
        setMalePercentage(data.male_percent);
        setCity1Percentage(data.percentage_city1_name);
        setCity2Percentage(data.percentage_city2_name);
        setCity3Percentage(data.percentage_city3_name);
        setCity4Percentage(data.percentage_city4_name);
        setCity5Percentage(data.percentage_city5_name);
        setQuater(data.quater);
        impressionImg(data.impression_upload_image_url);
        impressionimgSrc(data.impression_upload_image_url);
        setStatesFor(data.stats_for);
        setStoryView(data.story_view);
        // setStoryViewImg(data.story_view_upload_image_url);
        // setStoryViewVideo(data.story_view_upload_video_url);
        setStoryViewVideoSrc(data.story_view_upload_video_url);
        setStoryViewImgSrc(data.story_view_upload_image_url);
        setCountry1(data.country1_name);
        setCountry2(data.country2_name);
        setCountry3(data.country3_name);
        setCountry4(data.country4_name);
        setCountry5(data.country5_name);
        setCountry1Percentage(data.percentage_country1_name);
        setCountry2Percentage(data.percentage_country2_name);
        setCountry3Percentage(data.percentage_country3_name);
        setCountry4Percentage(data.percentage_country4_name);
        setCountry5Percentage(data.percentage_country5_name);
        // setCountryImg(data.country_image_upload_url);
        setCountryImgSrc(data.country_image_upload_url);
        // setReachImg(data.reach_upload_image_url);
        setReachImgSrc(data.reach_upload_image_url);
        // setImpressionImg(data.impression_upload_image_url);
        setImpressionimgSrc(data.impression_upload_image_url);
      });
  };

  useEffect(() => {
    apiCall();
  }, []);

  const [totalPercentage, setTotalPercentage] = useState(0);

  const handlePercentageChange = (value, setter) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setter(newValue);
    }
  };

  useEffect(() => {
    setCountryList(Country.getAllCountries());
    axios.get("http://34.93.221.166:3000/api/get_all_cities").then((res) => {
      console.log(res.data.data);
      setCityList(res.data.data.map((city) => city.city_name));
    });
    // setCityList([
    //   ...new Set(City.getCitiesOfCountry("IN").map((city) => city.name)),
    // ]);
  }, []);

  const cityCopyValidation = (value) => {
    setTimeout(() => {
      let tempCityList = cityList;
      tempCityList = tempCityList.filter((city) => !value.includes(city));
      setCityList(tempCityList);
    }, 400);
  };

  const countryCopyValidation = (value) => {
    setTimeout(() => {
      let tempCountryList = countryList;
      tempCountryList = tempCountryList.filter(
        (country) => !value.includes(country.name)
      );
      setCountryList(tempCountryList);
    }, 400);
  };
  const handleEndDateChange = (newValue) => {
    const date = new Date(newValue.$d);

    // Adjusting for the local time zone offset
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);

    setEndDate(newValue);
  };

  const dropdownStaticData = [
    "Daily",
    "Weekly",
    "Fortnight",
    "Monthly",
    "Quarterly",
  ];

  const QuarterStaticData = [
    "Quater 1 (Jan-Mar)",
    "Quater 2 (Apr-Jun)",
    "Quater 3 (Jul-Sep)",
    "Quater 4 (Oct-Dec)",
  ];
  useEffect(() => {
    const sum =
      age1Percentage +
      age2Percentage +
      age3Percentage +
      age4Percentage +
      age5Percentage +
      +age6percentage +
      +age7Percentage;

    setTotalPercentage(sum);
  }, [
    age1Percentage,
    age2Percentage,
    age3Percentage,
    age4Percentage,
    age5Percentage,
    age6percentage,
    age7Percentage,
  ]);

  const handleStartDateChange = (newValue) => {
    const date = new Date(newValue.$d);

    // Adjusting for the local time zone offset
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);

    setStartDate(newValue);
  };
  const handleStoryViewDateChange = (newValue) => {
    const date = new Date(newValue.$d);

    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);

    setStoryViewDate(newValue);
  };

  const id = useParams();

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 0" }}>
        <UserNav />
        <FormContainer
          mainTitle="Stats History"
          link="/ip-master"
          //   buttonAccess={buttonAccess}
        />
      </div>

      <div className="modal-body">
        <div className="d-flex" style={{ height: "100px" }}>
          <Autocomplete
            className="mb-1 me-3 p-1 "
            disablePortal
            id="combo-box-demo"
            options={dropdownStaticData}
            onChange={(e, value) => {
              setStatesFor(value),
                value !== "Quarterly"
                  ? setStateForIsNotQuater(true)
                  : setStateForIsNotQuater(false);
              value?.length > 0
                ? setStateForIsValid(true)
                : setStateForIsValid(false);
              value == "Daily" ? setStartDate(dayjs()) : setStartDate("");
              value == "Daily" ? setEndDate(dayjs()) : setEndDate("");
            }}
            value={statesFor}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Stats for *"
                helperText={!stateForIsValid ? "Please select an option" : ""}
              />
            )}
          />
          {statesFor !== "Quarterly" && statesFor !== null && (
            // stateForIsNotQuater &&
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="my-1"
                label="Start Date *"
                format="DD/MM/YY"
                value={startDate}
                onChange={(newValue) => {
                  handleStartDateChange(newValue);
                  statesFor == "Daily" ? setEndDate(newValue) : "";
                }}
              />
            </LocalizationProvider>
          )}

          {statesFor !== null && statesFor !== "Quarterly" && (
            // stateForIsNotQuater &&
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="my-1 mx-3"
                label="End Date *"
                format="DD/MM/YY"
                value={endDate}
                onChange={(newValue) => {
                  handleEndDateChange(newValue);
                }}
              />
            </LocalizationProvider>
          )}
          {statesFor == "Quarterly" && (
            // !stateForIsNotQuater &&
            <Autocomplete
              className="my-1"
              disablePortal
              id="combo-box-demo"
              options={QuarterStaticData}
              onChange={(e, value) => {
                setQuater(value);
                value?.length > 0
                  ? setQuaterIsValid(true)
                  : setQuaterIsValid(false);
              }}
              value={quater}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Quater *"
                  // error={!quaterIsValid}
                  // helperText={!quaterIsValid ? "Please select an option" : ""}
                />
              )}
            />
          )}
        </div>
        <h4 className="h3 text-center">Followers Bifurcation</h4>
        <div className="row">
          <div className="card col-md-12 col-lg-3">
            <div className="card-body">
              <div className="col-md-3 col-lg-12  my-2">
                <TextField
                  label="Reach *"
                  type="number"
                  value={reach}
                  onChange={(e) => {
                    e.target.value > 0
                      ? setReachValidation(true)
                      : setReachValidation(false),
                      setReach(e.target.value);
                  }}
                  error={!reachValidation}
                  helperText={
                    !reachValidation ? "Please enter a valid Count" : ""
                  }
                />
                <div className="col-md-3 py-1 mb-2  ">
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    size="small"
                    title="Reach"
                  >
                    Image
                    <VisuallyHiddenInput
                      onChange={(e) => {
                        const uploadedFile = e.target.files[0];
                        if (uploadedFile) {
                          const imageUrl = URL.createObjectURL(uploadedFile);
                          setReachImgSrc(imageUrl);
                          setReachImg(uploadedFile);
                        }
                      }}
                      type="file"
                      accept="image/png, image/jpeg"
                    />
                  </Button>

                  {reachImgSrc && (
                    <div className="d-flex">
                      <img
                        style={{ width: "50px", height: "50px" }}
                        src={reachImgSrc}
                        className="mt-1"
                        alt="Uploaded"
                      />{" "}
                      <Button
                        size="small"
                        onClick={() => {
                          setReachImgSrc(null);
                          setReachImg(null);
                        }}
                      >
                        <CloseTwoToneIcon />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-lg-12 d-block my-2">
                <TextField
                  label="Impressions *"
                  type="number"
                  value={impression}
                  // fieldGrid={4}
                  onChange={(e) => {
                    e.target.value > 0
                      ? setImpressionValidation(true)
                      : setImpressionValidation(false),
                      setImpression(e.target.value);
                  }}
                  error={!impressionValidation}
                  helperText={
                    !impressionValidation ? "Please enter a valid Count" : ""
                  }
                />
              </div>
              <div className="col-md-3 py-1 mb-2  ">
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  title="Impression"
                >
                  Image
                  <VisuallyHiddenInput
                    onChange={(e) => {
                      const uploadedFile = e.target.files[0];
                      if (uploadedFile) {
                        const imageUrl = URL.createObjectURL(uploadedFile);
                        setImpressionimgSrc(imageUrl);
                        setImpressionImg(uploadedFile);
                      }
                    }}
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </Button>

                {impressionimgSrc && (
                  <div className="d-flex">
                    <img
                      style={{ width: "50px", height: "50px" }}
                      src={impressionimgSrc}
                      className="mt-1"
                      alt="Uploaded"
                    />{" "}
                    <Button
                      size="small"
                      onClick={() => {
                        setImpressionimgSrc(null);
                        setImpressionImg(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
              </div>

              <div className="col-md-3 col-lg-12 d-block my-2">
                <TextField
                  label="Engagement *"
                  type="number"
                  value={engagement}
                  // fieldGrid={4}
                  onChange={(e) => {
                    e.target.value > 0
                      ? setEngagementValidation(true)
                      : setEndDateIsValid(false),
                      setEngagement(e.target.value);
                  }}
                  error={!engagementValidation}
                  helperText={
                    !engagementValidation ? "Please enter a valid Count" : ""
                  }
                />
              </div>
              <div className="col-md-3 py-1 mb-2">
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                >
                  Image
                  <VisuallyHiddenInput
                    onChange={(e) => {
                      const uploadedFile = e.target.files[0];
                      if (uploadedFile) {
                        const imageUrl = URL.createObjectURL(uploadedFile);
                        setEngagementImgSrc(imageUrl);
                        setEngagementImg(uploadedFile);
                      }
                    }}
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </Button>
                {engagementImgSrc && (
                  <div className="d-flex">
                    <img
                      style={{ width: "50px", height: "50px" }}
                      src={engagementImgSrc}
                      className="mt-1"
                      alt="Uploaded"
                    />{" "}
                    <Button
                      size="small"
                      onClick={() => {
                        setEngagementImgSrc(null);
                        setEngagementImg(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
              </div>
              <div className="col-md-3 col-lg-12 d-block my-2">
                <TextField
                  label="Story View *"
                  type="number"
                  value={storyView}
                  // fieldGrid={4}
                  onChange={(e) => {
                    e.target.value > 0
                      ? setStoryViewValidation(true)
                      : setStoryViewValidation(false),
                      setStoryView(e.target.value);
                  }}
                  error={!storyViewValidation}
                  helperText={
                    !storyViewValidation ? "Please enter a valid Count" : ""
                  }
                />
              </div>
              <div className="col-md-3 col-lg-12 py-1 mb-2">
                <Button
                  className="me-1"
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                >
                  image
                  <VisuallyHiddenInput
                    onChange={(e) => {
                      const uploadedFile = e.target.files[0];
                      if (uploadedFile) {
                        const imageUrl = URL.createObjectURL(uploadedFile);
                        setStoryViewImgSrc(imageUrl);
                        setStoryViewImg(uploadedFile);
                      }
                    }}
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </Button>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                >
                  Video
                  <VisuallyHiddenInput
                    onChange={(e) => {
                      const uploadedFile = e.target.files[0];
                      if (uploadedFile) {
                        const videoUrl = URL.createObjectURL(uploadedFile);
                        setStoryViewVideoSrc(videoUrl); // Set the video URL in state for preview
                        setStoryViewVideo(uploadedFile); // Set the uploaded video in state
                      }
                    }}
                    type="file"
                    accept="video/mp4,video/avi"
                  />
                </Button>
                <div className="my-2 d-block ">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="my-1"
                      label="Story View Date"
                      format="DD/MM/YY"
                      value={storyViewDate}
                      onChange={(newValue) => {
                        handleStoryViewDateChange(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div>
                  {storyViewImgSrc && (
                    <div className="d-flex">
                      <img
                        style={{ height: "50px", width: "50px" }}
                        src={storyViewImgSrc}
                        className="mt-1"
                        alt="Uploaded"
                      />{" "}
                      <Button
                        size="small"
                        onClick={() => {
                          setStoryViewImgSrc(null);
                          setStoryViewImg(null);
                        }}
                      >
                        <CloseTwoToneIcon />
                      </Button>
                    </div>
                  )}
                  {storyViewVideoSrc && (
                    <div className="d-flex align-items-center">
                      <video
                        style={{ height: "50px", width: "50px" }}
                        src={storyViewVideoSrc}
                        // controls
                        className="mt-1"
                        alt="Uploaded Video"
                      />
                      <Button
                        size="small"
                        onClick={() => {
                          setStoryViewVideoSrc(null);
                          setStoryViewVideo(null);
                        }}
                      >
                        <CloseTwoToneIcon />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-lg-12 d-block my-2">
                <TextField
                  label="Profile Visit"
                  type="number"
                  value={profileVisit}
                  onChange={(e) => setProfileVisit(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card col-md-12 col-lg-3">
            <div className="card-body">
              <label className="mt-3 h6">City</label>
              <Autocomplete
                id="combo-box-demo"
                value={city1}
                options={cityList.map((city) => city)}
                onChange={(e, value) => {
                  cityCopyValidation(value);
                  setCity1(value);
                }}
                sx={{ width: 150 }}
                renderInput={(params) => (
                  <TextField {...params} label="City 1" />
                )}
              />
              <TextField
                className="mb-2 "
                type="number"
                value={city1Percentage}
                onChange={(e) => {
                  setCity1Percentage(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
              <Autocomplete
                id="combo-box-demo"
                value={city2}
                options={cityList.map((city) => city)}
                onChange={(e, value) => {
                  setCity2(value);
                  cityCopyValidation(value);
                }}
                sx={{ width: 150 }}
                renderInput={(params) => (
                  <TextField {...params} label="City 2" />
                )}
              />
              <TextField
                className="mb-2"
                value={city2Percentage}
                onChange={(e) => {
                  setCity2Percentage(e.target.value);
                }}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
              <Autocomplete
                id="combo-box-demo"
                value={city3}
                options={cityList.map((city) => city)}
                onChange={(e, value) => {
                  setCity3(value);
                  cityCopyValidation(value);
                }}
                sx={{ width: 150 }}
                renderInput={(params) => (
                  <TextField {...params} label="City 3" />
                )}
              />
              <TextField
                className="mb-2"
                type="number"
                value={city3Percentage}
                onChange={(e) => {
                  setCity3Percentage(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
              <Autocomplete
                id="combo-box-demo"
                value={city4}
                options={cityList.map((city) => city)}
                onChange={(e, value) => {
                  setCity4(value);
                  cityCopyValidation(value);
                }}
                sx={{ width: 150 }}
                renderInput={(params) => (
                  <TextField {...params} label="City 4" />
                )}
              />
              <TextField
                className="mb-2"
                type="number"
                value={city4Percentage}
                onChange={(e) => {
                  setCity4Percentage(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
              <Autocomplete
                id="combo-box-demo"
                value={city5}
                options={cityList.map((city) => city)}
                onChange={(e, value) => {
                  setCity5(value);
                  cityCopyValidation(value);
                }}
                sx={{ width: 150 }}
                renderInput={(params) => (
                  <TextField {...params} label="City 5" />
                )}
              />
              <TextField
                className="mb-2 "
                type="number"
                value={city5Percentage}
                onChange={(e) => {
                  setCity5Percentage(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
              <div>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  className="mt-4"
                  onChange={(e) => {
                    const uploadedFile = e.target.files[0];
                    if (uploadedFile) {
                      const imageUrl = URL.createObjectURL(uploadedFile);
                      setCityImgSrc(imageUrl);
                      setCityImg(uploadedFile);
                    }
                  }}
                >
                  Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </Button>

                {cityImgSrc && (
                  <div className="d-flex align-items-center">
                    <img
                      style={{ height: "50px", width: "50px" }}
                      src={cityImgSrc}
                      className="mt-1"
                      alt="Image Uploaded"
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        setCityImgSrc(null);
                        setCityImg(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card col-md-12 col-lg-3">
            <div className="card-body">
              <label className="mt-3 h6">Country</label>
              <div>
                <Autocomplete
                  id="combo-box-demo"
                  value={country1}
                  options={countryList.map((country) => country.name)}
                  onChange={(e, value) => {
                    countryCopyValidation(value);
                    setCountry1(value);
                  }}
                  // sx={{ width: 250 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country 1" />
                  )}
                />
                <TextField
                  // style={{ width: "10%" }}
                  className="mb-2"
                  type="number"
                  value={country1Percentage}
                  onChange={(e) => {
                    setCountry1Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
                <Autocomplete
                  disablePortal
                  value={country2}
                  onChange={(e, value) => {
                    countryCopyValidation(value);
                    setCountry2(value);
                  }}
                  id="combo-box-demo"
                  options={countryList.map((country) => country.name)}
                  // sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country 2" />
                  )}
                />
                <TextField
                  // style={{ width: "10%" }}
                  className="mb-2"
                  value={country2Percentage}
                  onChange={(e) => {
                    setCountry2Percentage(e.target.value);
                  }}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
                <Autocomplete
                  disablePortal
                  value={country3}
                  onChange={(e, value) => {
                    setCountry3(value);
                    countryCopyValidation(value);
                  }}
                  id="combo-box-demo"
                  options={countryList.map((country) => country.name)}
                  // sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country 3" />
                  )}
                />
                <TextField
                  // style={{ width: "10%" }}
                  className="mb-2"
                  type="number"
                  value={country3Percentage}
                  onChange={(e) => {
                    setCountry3Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={countryList.map((country) => country.name)}
                  value={country4}
                  onChange={(e, value) => {
                    setCountry4(value);
                    countryCopyValidation(value);
                  }}
                  // sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country 4" />
                  )}
                />
                <TextField
                  // style={{ width: "10%" }}
                  className="mb-2"
                  type="number"
                  value={country4Percentage}
                  onChange={(e) => {
                    setCountry4Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={countryList.map((country) => country.name)}
                  value={country5}
                  onChange={(e, value) => {
                    setCountry5(value);
                    countryCopyValidation(value);
                  }}
                  // sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country 5" />
                  )}
                />
                <TextField
                  // style={{ width: "10%" }}
                  className="me-2"
                  type="number"
                  value={country5Percentage}
                  onChange={(e) => {
                    setCountry5Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
                <div>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    size="small"
                    className="mt-3"
                    onChange={(e) => {
                      const uploadedFile = e.target.files[0];
                      if (uploadedFile) {
                        const imageUrl = URL.createObjectURL(uploadedFile);
                        setCountryImgSrc(imageUrl);
                        setCountryImg(uploadedFile);
                      }
                    }}
                  >
                    Image
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/png, image/jpeg"
                    />
                  </Button>
                  {countryImgSrc && (
                    <div className="d-flex align-items-center">
                      <img
                        style={{ height: "50px", width: "50px" }}
                        src={countryImgSrc}
                        className="mt-1"
                        alt="Country Image Uploaded"
                      />
                      <Button
                        size="small"
                        onClick={() => {
                          setCountryImg(null);
                          setCountryImgSrc(null);
                        }}
                      >
                        <CloseTwoToneIcon />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-lg-3">
            <div className="card">
              <div className="card-body">
                <label className="h6 d-block">Age Group</label>
                <div className="col-md-3 col-lg-12 my-2">
                  <TextField
                    label="13-17"
                    type="number"
                    className="mx-1"
                    value={age1Percentage}
                    onChange={(e) =>
                      handlePercentageChange(e.target.value, setAge1Percentage)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      inputProps: {
                        min: 0,
                        max: 100,
                      },
                    }}
                  />
                </div>
                <div className="col-md-3 col-lg-12 my-2">
                  <TextField
                    label="18-24"
                    type="number"
                    className="mx-1"
                    value={age2Percentage}
                    onChange={(e) =>
                      handlePercentageChange(e.target.value, setAge2Percentage)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      inputProps: {
                        min: 0,
                        max: 100,
                      },
                    }}
                  />
                </div>
                <div className="col-md-3 col-lg-12 my-2">
                  <TextField
                    label="25-34"
                    type="number"
                    className="mx-1"
                    value={age3Percentage}
                    onChange={(e) =>
                      handlePercentageChange(e.target.value, setAge3Percentage)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      inputProps: {
                        min: 0,
                        max: 100,
                      },
                    }}
                  />
                </div>
                <div className="col-md-3 col-lg-12 my-2">
                  <TextField
                    label="35-44"
                    type="number"
                    className="mx-1"
                    value={age4Percentage}
                    onChange={(e) =>
                      handlePercentageChange(e.target.value, setAge4Percentage)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      inputProps: {
                        min: 0,
                        max: 100,
                      },
                    }}
                  />
                </div>
                <div className="col-md-3 col-lg-12 my-2">
                  <TextField
                    label="45-54"
                    type="number"
                    className="mx-1"
                    value={age5Percentage}
                    onChange={(e) =>
                      handlePercentageChange(e.target.value, setAge5Percentage)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      inputProps: {
                        min: 0,
                        max: 100,
                      },
                    }}
                  />
                </div>
                <div className="col-md-3 col-lg-12 my-2">
                  <TextField
                    label="55-64"
                    type="number"
                    className="mx-1"
                    value={age6percentage}
                    onChange={(e) => {
                      setAge6Percentage(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      inputProps: {
                        min: 0,
                        max: 100,
                      },
                    }}
                  />
                </div>
                <div className="col-md-3 col-lg-12 my-2">
                  <TextField
                    label="65+"
                    type="number"
                    className="mx-1"
                    value={age7Percentage}
                    onChange={(e) => {
                      setAge7Percentage(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      inputProps: {
                        min: 0,
                        max: 100,
                      },
                    }}
                  />
                </div>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  className="mt-4"
                  onChange={(e) => {
                    const uploadedFile = e.target.files[0];
                    if (uploadedFile) {
                      const imageUrl = URL.createObjectURL(uploadedFile);
                      setAgeImgSrc(imageUrl);
                      setAgeImg(uploadedFile);
                    }
                  }}
                >
                  Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </Button>

                {ageImgSrc && (
                  <div className="d-flex align-items-center">
                    <img
                      style={{ height: "50px", width: "50px" }}
                      src={ageImgSrc}
                      className="mt-1"
                      alt="Age Image Uploaded"
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        setAgeImgSrc(null);
                        setAgeImg(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
              </div>
              {totalPercentage < 98 && (
                <span style={{ color: "red" }}>
                  Total percentage must be at least 98%
                </span>
              )}
              {totalPercentage > 100 && (
                <span style={{ color: "red" }}>
                  Total percentage cannot exceed 100%
                </span>
              )}
            </div>
            <div></div>
            <label className="h6 d-block">Gender</label>
            <TextField
              label="Male"
              type="number"
              value={malePercentage}
              onChange={(e) => {
                setMalePercentage(e.target.value);
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: {
                  min: 0,
                  max: 100,
                },
              }}
            />
            <TextField
              label="Female"
              type="number"
              className="mx-3"
              value={femalePercentage}
              onChange={(e) => {
                setFemalePercentage(e.target.value);
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: {
                  min: 0,
                  max: 100,
                },
              }}
            />
          </div>
        </div>
      </div>
      <button
        onClick={saveStats}
        type="button"
        className="btn btn-success"
        data-dismiss="modal"
      >
        Save
      </button>
    </div>
  );
}
