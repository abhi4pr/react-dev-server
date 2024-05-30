import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useAddPageStateMutation,
  useGetAllCitiesQuery,
  useGetPageStateByIdQuery,
  useUpdatePageStateMutation,
} from "../../Store/PageBaseURL";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { Country } from "country-state-city";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import { useSelector } from "react-redux";
// import avatarOne from "../../../assets/img/product/Avtrar1.png";
// import { Dropdown } from "react-bootstrap";
// import instaIcon from "../../../assets/img/icon/insta.svg";
// import ReactApexChart from "react-apexcharts";

export default function PageStats() {
  const update = useSelector((state) => state.pageMaster.statsUpdate);

  const navitage = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const { data: cities } = useGetAllCitiesQuery();
  const { id } = useParams();
  const { data: pageStateData } = useGetPageStateByIdQuery(id);
  const countryList = Country.getAllCountries();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm();
  let isStatsFor = watch("statsFor");
  switch (isStatsFor) {
    case "daily":
      setValue("startDate", new Date().toISOString().split("T")[0]);
      setValue("endDate", new Date().toISOString().split("T")[0]);
      break;
    case "monthly":
      setValue("startDate", null);
      setValue("endDate", null);
      break;
    case "fortnight":
      setValue("startDate", null);
      setValue("endDate", null);
      break;
    case "quarterly":
      setValue("startDate", null);
      setValue("endDate", null);
      break;
    default:
      setValue("startDate", null);
      setValue("endDate", null);
      break;
  }

  const [addPageState] = useAddPageStateMutation();
  const [updatePageState] = useUpdatePageStateMutation();

  useEffect(() => {
    if (update && pageStateData) {
      setValue("reach", pageStateData?.reach);
      setValue("impressions", pageStateData?.impression);
      setValue("engagement", pageStateData?.engagement);
      setValue("storyView", pageStateData?.story_view);
      // setValue("storyViewDate", pageStateData?.story_view_date);

      setValue(
        "city1",
        cities?.find((city) => city.city_name === pageStateData?.city1_name)
          ?.city_name
      );
     
      setValue("city1Percentage", pageStateData?.percentage_city1_name);
      setValue("city2", pageStateData?.city2_name);
      setValue("city2Percentage", pageStateData?.percentage_city2_name);
      setValue("city3", pageStateData?.city3_name);
      setValue("city3Percentage", pageStateData?.percentage_city3_name);
      setValue("city4", pageStateData?.city4_name);
      setValue("city4Percentage", pageStateData?.percentage_city4_name);
      setValue("city5", pageStateData?.city5_name);
      setValue("city5Percentage", pageStateData?.percentage_city5_name);

      setValue("country1", pageStateData?.country1_name);
      setValue("country1Percentage", pageStateData?.percentage_country1_name);
      setValue("country2", pageStateData?.country2_name);

      setValue("country2Percentage", pageStateData?.percentage_country2_name);
      setValue("country3", pageStateData?.country3_name);
      setValue("country3Percentage", pageStateData?.percentage_country3_name);
      setValue("country4", pageStateData?.country4_name);
      setValue("country4Percentage", pageStateData?.percentage_country4_name);
      setValue("country5", pageStateData?.country5_name);
      setValue("country5Percentage", pageStateData?.percentage_country5_name);

      setValue("statsFor", pageStateData?.stats_for);
      setValue("startDate", pageStateData?.start_date.split("T")[0]);
      setValue("endDate", pageStateData?.end_date.split("T")[0]);
      setValue("storyViewDate", pageStateData?.story_view_date.split("T")[0]);
      setValue("profileVisit", pageStateData?.profile_visit);
      setValue("womenPercentage", pageStateData?.female_percent);
      setValue("menPercentage", pageStateData?.male_percent);
      setValue("ageGroup1", pageStateData?.Age_13_17_percent);
      setValue("ageGroup2", pageStateData?.Age_18_24_percent);
      setValue("ageGroup3", pageStateData?.Age_25_34_percent);
      setValue("ageGroup4", pageStateData?.Age_35_44_percent);
      setValue("ageGroup5", pageStateData?.Age_45_54_percent);
      setValue("ageGroup6", pageStateData?.Age_55_64_percent);
      setValue("ageGroup7", pageStateData?.Age_65_plus_percent);
    }
  }, [update]);
  const handleSubmitForm = (data) => {
    const formData = new FormData();
    formData.append("page_master_id", id);
    formData.append("reach", data.reach);
    formData.append("impression", data.impressions);
    formData.append("engagement", data.engagement);
    formData.append("story_view", data.storyView);
    formData.append("story_view_date", data.storyViewDate);
    formData.append("profile_visit", data.profileVisit);

    formData.append("city1_name", data.city1);
    formData.append("percentage_city1_name", data.city1Percentage);
    formData.append("city2_name", data.city2);
    formData.append("percentage_city2_name", data.city2Percentage);
    formData.append("city3_name", data.city3);
    formData.append("percentage_city3_name", data.city3Percentage);
    formData.append("city4_name", data.city4);
    formData.append("percentage_city4_name", data.city4Percentage);
    formData.append("city5_name", data.city5);
    formData.append("percentage_city5_name", data.city5Percentage);

    formData.append("country1_name", data.country1);
    formData.append("percentage_country1_name", data.country1Percentage);
    formData.append("country2_name", data.country2);
    formData.append("percentage_country2_name", data.country2Percentage);
    formData.append("country3_name", data.country3);
    formData.append("percentage_country3_name", data.country3Percentage);
    formData.append("country4_name", data.country4);
    formData.append("percentage_country4_name", data.country4Percentage);
    formData.append("country5_name", data.country5);
    formData.append("percentage_country5_name", data.country5Percentage);

    formData.append("stats_for", data.statsFor);
    formData.append("start_date", data.startDate);
    formData.append("end_date", data.endDate);

    formData.append("male_percent", data.menPercentage);
    formData.append("female_percent", data.womenPercentage);

    formData.append("Age_13_17_percent", data.ageGroup1);
    formData.append("Age_18_24_percent", data.ageGroup2);
    formData.append("Age_25_34_percent", data.ageGroup3);
    formData.append("Age_35_44_percent", data.ageGroup4);
    formData.append("Age_45_54_percent", data.ageGroup5);
    formData.append("Age_55_64_percent", data.ageGroup6);
    formData.append("Age_65_plus_percent", data.ageGroup7);

    formData.append("created_by", userID);

    // "reach_image": "download (10).jpg",
    // "impression_image": "download (1).jpg",
    // "engagement_image": "download (6).jpg",
    // "story_view_image": "download (16).jpg",
    // city_image
    // Age_upload
    // country_image

    formData.append("reach_image", data.reachImage[0]);
    formData.append("impression_image", data.impressionsImage[0]);
    formData.append("engagement_image", data.engagementImage[0]);
    formData.append("story_view_image", data.storyViewImage[0]);
    formData.append("city_image", data.cityImage[0]);
    formData.append("Age_upload", data.ageGroupImage[0]);
    formData.append("country_image", data.countryImage[0]);
    if (!update) {
      addPageState(formData)
        .unwrap()
        .then((res) => {
          toastAlert("Stats Added Successfully");
          navitage(`/admin/pms-page-overview`);
        })
        .catch((err) => {
          toastError(`Something Went Wrong ${err.message}`);
        });
    } else {

      updatePageState({
        id,
        formData})
        .unwrap()
        .then((res) => {
          toastAlert("Stats Updated Successfully");
          navitage(`/admin/pms-page-overview`);
        })
        .catch((err) => {
          toastError(`Something Went Wrong ${err.message}`);
        });
    }
  };

  // const [pieChart, setPieChart] = useState({
  //     series: [40, 60],
  //     options: {
  //       chart: {
  //         type: "donut",
  //       },
  //       labels: ["Male", "Female"],
  //       colors: ["#FAA7E0", "#DD2590"],
  //       stroke: {
  //         show: false,
  //         width: 0,
  //       },
  //       dataLabels: {
  //         enabled: false,
  //       },
  //       legend: {
  //         position: "left",
  //         offsetY: 70,
  //         offsetX: 0,
  //         fontSize: "16px",
  //         fontWeight: 500,
  //         markers: {
  //           width: 14,
  //           height: 14,
  //           radius: 14,
  //         },
  //         itemMargin: {
  //           horizontal: 0,
  //           vertical: 5,
  //         },
  //       },
  //     },
  //   });
  //   const [columnChartAge, setcolumnChartAge] = useState({
  //     series: [
  //       {
  //         name: "Demographics (Age group)",
  //         data: [15, 32, 13, 7, 4, 47, 19],
  //       },
  //     ],
  //     tooltip: {
  //       enabled: false,
  //     },
  //     options: {
  //       chart: {
  //         type: "bar",
  //         toolbar: {
  //           show: false, // Disables the toolbar
  //         },
  //       },
  //       plotOptions: {
  //         bar: {
  //           borderRadius: 7,
  //           borderRadiusApplication: "end",
  //           dataLabels: {
  //             position: "top", // top, center, bottom
  //           },
  //         },
  //       },
  //       grid: {
  //         show: false, // Removes the horizontal grid lines
  //       },
  //       colors: ["#DD2590"],
  //       dataLabels: {
  //         enabled: true,
  //         formatter: function (val) {
  //           return val + "%";
  //         },
  //         offsetY: -25,
  //         style: {
  //           fontSize: "14px",
  //           fontWeight: "400",
  //           colors: ["#344054"],
  //         },
  //       },

  //       xaxis: {
  //         categories: [
  //           "13 - 17",
  //           "18 - 24",
  //           "25 - 34",
  //           "35 - 44",
  //           "45 - 54",
  //           "55 - 64",
  //           "65 Above",
  //         ],
  //         position: "bottom",
  //         axisBorder: {
  //           show: false,
  //         },
  //         axisTicks: {
  //           show: false,
  //         },
  //         crosshairs: {
  //           show: false,
  //           enabled: false,
  //         },
  //         tooltip: {
  //           enabled: false,
  //           show: false,
  //         },
  //       },
  //       yaxis: {
  //         axisBorder: {
  //           show: false,
  //         },
  //         axisTicks: {
  //           show: false,
  //         },
  //         labels: {
  //           show: false,
  //         },
  //       },
  //     },
  //   });
  //   const [columnChartCountry, setcolumnChartCountry] = useState({
  //     series: [
  //       {
  //         name: "Top Country",
  //         data: [43, 12, 26, 14, 44, 20, 25],
  //       },
  //     ],
  //     tooltip: {
  //       enabled: false,
  //     },
  //     options: {
  //       chart: {
  //         type: "bar",
  //         toolbar: {
  //           show: false, // Disables the toolbar
  //         },
  //       },
  //       plotOptions: {
  //         bar: {
  //           borderRadius: 7,
  //           borderRadiusApplication: "end",
  //           dataLabels: {
  //             position: "top", // top, center, bottom
  //           },
  //         },
  //       },
  //       grid: {
  //         show: false, // Removes the horizontal grid lines
  //       },
  //       colors: ["#DD2590"],
  //       dataLabels: {
  //         enabled: true,
  //         formatter: function (val) {
  //           return val + "%";
  //         },
  //         offsetY: -25,
  //         style: {
  //           fontSize: "14px",
  //           fontWeight: "400",
  //           colors: ["#344054"],
  //         },
  //       },

  //       xaxis: {
  //         categories: [
  //           "India",
  //           "Myanmar",
  //           "Philippine",
  //           "Japan",
  //           "Korea",
  //           "Cambodia",
  //           "Thailand",
  //         ],
  //         position: "bottom",
  //         axisBorder: {
  //           show: false,
  //         },
  //         axisTicks: {
  //           show: false,
  //         },
  //         crosshairs: {
  //           show: false,
  //           enabled: false,
  //         },
  //         tooltip: {
  //           enabled: false,
  //           show: false,
  //         },
  //       },
  //       yaxis: {
  //         axisBorder: {
  //           show: false,
  //         },
  //         axisTicks: {
  //           show: false,
  //         },
  //         labels: {
  //           show: false,
  //         },
  //       },
  //     },
  //   });

  //   const [columnChartCity, setcolumnChartCity] = useState({
  //     series: [
  //       {
  //         name: "Top City",
  //         data: [40, 23, 10, 34, 27, 32, 38],
  //       },
  //     ],
  //     tooltip: {
  //       enabled: false,
  //     },
  //     options: {
  //       chart: {
  //         type: "bar",
  //         toolbar: {
  //           show: false, // Disables the toolbar
  //         },
  //       },
  //       plotOptions: {
  //         bar: {
  //           borderRadius: 7,
  //           borderRadiusApplication: "end",
  //           dataLabels: {
  //             position: "top", // top, center, bottom
  //           },
  //         },
  //       },
  //       grid: {
  //         show: false, // Removes the horizontal grid lines
  //       },
  //       colors: ["#DD2590"],
  //       dataLabels: {
  //         enabled: true,
  //         formatter: function (val) {
  //           return val + "%";
  //         },
  //         offsetY: -25,
  //         style: {
  //           fontSize: "14px",
  //           fontWeight: "400",
  //           colors: ["#344054"],
  //         },
  //       },

  //       xaxis: {
  //         categories: [
  //           "Bhopal",
  //           "Indore",
  //           "Delhi",
  //           "Noida",
  //           "Kolkata",
  //           "Chennai",
  //           "Pune",
  //         ],
  //         position: "bottom",
  //         axisBorder: {
  //           show: false,
  //         },
  //         axisTicks: {
  //           show: false,
  //         },
  //         crosshairs: {
  //           show: false,
  //           enabled: false,
  //         },
  //         tooltip: {
  //           enabled: false,
  //           show: false,
  //         },
  //       },
  //       yaxis: {
  //         axisBorder: {
  //           show: false,
  //         },
  //         axisTicks: {
  //           show: false,
  //         },
  //         labels: {
  //           show: false,
  //         },
  //       },
  //     },
  //   });
  return (
    <>
      {/* <div className="pageOverviewWrapper">
        <div className="pageOverviewWrapperLeft">
          <div className="pageOverviewBoard card">
            <div className="card-body">
              <div className="pageSourceHeader">
                <ul>
                  <li className="active">
                    <a href="#">Instagram</a>
                  </li>
                </ul>
              </div>
              <div className="pageSourceBody">
                <div className="pageInsight">
                  <div className="pageInsightHead">
                    <div className="pageTitle">
                      <span>
                        <img className="logo-img" src={instaIcon} alt="icon" />
                      </span>
                      <h2>Creativefuel</h2>
                    </div>
                    <div className="pageAction">
                      <div className="pageActionUl">
                        <div className="pageActionLi">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="default"
                              id="dropdownStats"
                            >
                              <span>0.00%</span>Stats
                              <button className="btn toggleArrowBtn">
                                <i className="bi bi-chevron-down"></i>
                              </button>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">
                                Set Stats
                              </Dropdown.Item>
                              <Dropdown.Item href="#/action-2">
                                Update Stats
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        <div className="pageActionLi">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="default"
                              id="dropdownMore"
                            >
                              <i className="bi bi-three-dots-vertical"></i> More
                              <button className="btn toggleArrowBtn">
                                <i className="bi bi-chevron-down"></i>
                              </button>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Item id="historyToggle">
                                History
                              </Dropdown.Item>
                              <Dropdown.Item href="#/action-3">
                                Purchase price
                              </Dropdown.Item>
                              <Dropdown.Item
                                href="#/action-4"
                                className="dangerText"
                              >
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pageInsightText">
                    <h2>Instagram Account Insight</h2>
                    <h4>
                      This graph shows the total size of your fanbase across
                      your tracked social & streaming platforms.
                    </h4>
                  </div>
                  <div className="pageInsightChart row">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-12">
                      <div className="pageInsightChartText">
                        <h4>Profile Visit</h4>
                        <h2>12M</h2>
                        <h4>
                          4<small>th</small> Quater
                        </h4>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 col-12">
                      <div className="pageInsightChartData">
                        <div id="chart">
                          <ReactApexChart
                            options={pieChart.options}
                            series={pieChart.series}
                            type="donut"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="pageChart demographic">
                  <div className="pageChartHead">
                    <h2>Demographics (Age Group)</h2>
                    <button className="btn">
                      View image <i className="bi bi-image-fill"></i>
                    </button>
                  </div>
                  <div className="pageChartArea">
                    <div id="chartTwo">
                      <ReactApexChart
                        options={columnChartAge.options}
                        series={columnChartAge.series}
                        type="bar"
                        height={200}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="pageChart country">
                  <div className="pageChartHead">
                    <h2>Top Country</h2>
                    <button className="btn">
                      View image <i className="bi bi-image-fill"></i>
                    </button>
                  </div>
                  <div className="pageChartArea">
                    <div id="chartThree">
                      <ReactApexChart
                        options={columnChartCountry.options}
                        series={columnChartCountry.series}
                        type="bar"
                        height={200}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="pageChart city">
                  <div className="pageChartHead">
                    <h2>Top City</h2>
                    <button className="btn">
                      View image <i className="bi bi-image-fill"></i>
                    </button>
                  </div>
                  <div className="pageChartArea">
                    <div id="chartFour">
                      <ReactApexChart
                        options={columnChartCity.options}
                        series={columnChartCity.series}
                        type="bar"
                        height={200}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="pageStats">
                  <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                      <div className="pageStateBox">
                        <h2>Engagement</h2>
                        <h3>00</h3>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                      <div className="pageStateBox">
                        <h2>Impression</h2>
                        <h3>00</h3>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                      <div className="pageStateBox">
                        <h2>Reach</h2>
                        <h3>00</h3>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                      <div className="pageStateBox">
                        <h2>Stats</h2>
                        <h3>00</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pageOverviewWrapperRight">
          <div className="pageHistoryBoard card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">History</h5>
              <button id="closeHistory" className="btn iconBtn">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="card-body">
              <div className="historyUserCardList">
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
                <div className="historyUserCard">
                  <img className="img-profile" src={avatarOne} />
                  <div className="historyUserCardText">
                    <h2>Ashia Kashyap</h2>
                    <h3>13/03/2024</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="stateHistoryWrapper">
        <FormControl
          component={"form"}
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <div className="card">
            <div className="card-body flexCenterBetween">
              <h5 className="card-title">Stats History</h5>
              <div className="form-group flexCenter colGap8 w-40 m0">
                <label className="w-25 m0">Stats for</label>
                <select
                  className="form-control form_sm"
                  {...register("statsFor", {
                    required: "Please Select The Stats For",
                  })}
                  aria-invalid={errors.statsFor ? "true" : "false"}
                >
                  <option value="">All</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="fortnight">Fortnight</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <div className="h-2">
                  {errors.statsFor && (
                    <span role="alert" className="text-danger">
                      {errors.statsFor.message}
                    </span>
                  )}
                </div>
              </div>
              {isStatsFor && (
                <>
                  <div className="col-md-4 col-sm-12">
                    <div className="form-group">
                      <label>Start Date*</label>
                      <input
                        type="date"
                        className="form-control"
                        {...register("startDate", {
                          required: "Please Select The Start Date",
                        })}
                        aria-invalid={errors.startDate ? "true" : "false"}
                      />

                      <div className="h-3">
                        {errors.startDate && (
                          <span role="alert" className="text-danger">
                            {errors.startDate.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12">
                    <div className="form-group">
                      <label>End Date*</label>
                      <input
                        type="date"
                        className="form-control"
                        {...register("endDate", {
                          required: "Please Select The End Date",
                        })}
                        aria-invalid={errors.endDate ? "true" : "false"}
                      />
                      <div className="h-3">
                        {errors.endDate && (
                          <span role="alert" className="text-danger">
                            {errors.endDate.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Followers Bifurcation</h5>
            </div>
            <div className="card-body pb8">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>
                      Reach <span className="dangerText">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        {...register("reach")}
                        aria-invalid={errors.reach ? "true" : "false"}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <label className="btn iconBtn btn-outline-border">
                        <input
                          type="file"
                          style={{ display: "none" }}
                          {...register("reachImage")}
                        />
                        <i className="bi bi-cloud-arrow-up-fill"></i>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>
                      Impressions <span className="dangerText">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        {...register("impressions")}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <label className="btn iconBtn btn-outline-border">
                        <input
                          type="file"
                          style={{ display: "none" }}
                          {...register("impressionsImage")}
                        />
                        <i className="bi bi-cloud-arrow-up-fill"></i>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>
                      Engagement <span className="dangerText">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        {...register("engagement", {
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Please Enter Valid Engagement",
                          },
                        })}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        aria-invalid={errors.engagement ? "true" : "false"}
                      />
                      <label className="btn iconBtn btn-outline-border">
                        <input
                          type="file"
                          style={{ display: "none" }}
                          {...register("engagementImage")}
                        />
                        <i className="bi bi-cloud-arrow-up-fill"></i>
                      </label>
                    </div>
                  </div>
                  <div className="h-2">
                    {errors.engagement && (
                      <span role="alert" className="text-danger">
                        {errors.engagement.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>
                      Story View <span className="dangerText">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        {...register("storyView", {
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Please Enter Valid Story View",
                          },
                        })}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <label className="btn iconBtn btn-outline-border">
                        <input
                          type="file"
                          style={{ display: "none" }}
                          {...register("storyViewImage")}
                        />
                        <i className="bi bi-cloud-arrow-up-fill"></i>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Story View Date</label>
                    <input
                      type="date"
                      className="form-control"
                      {...register("storyViewDate")}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Profile Visit</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("profileVisit")}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="card">
            <div className="card-header">
              <h5 className="card-title">City</h5>
            </div>
            <div className="card-body pb8">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>City 1</label>
                    <div className="row m0">
                      <div className="col-md-9 p0 mr8">
                        { <select className="form-control">
                          <option value="">Select City</option>
                          <option value="Bhopal">Bhopal</option>
                          <option value="Indore">Indore</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Noida">Noida</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Pune">Pune</option>
                        </select> *
                        <Autocomplete
                          options={cities}
                          getOptionLabel={(option) => option.city_name}
                          {...register("city1")}
                          onChange={(e, value) => {
                            setValue("city1", value.city_name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select City"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col p0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control pl4 pr4 text-center"
                            {...register("city1Percentage")}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>City 2</label>
                    <div className="row m0">
                      <div className="col-md-9 p0 mr8">
                         <select className="form-control">
                          <option value="">Select City</option>
                          <option value="Bhopal">Bhopal</option>
                          <option value="Indore">Indore</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Noida">Noida</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Pune">Pune</option>
                        </select> 
                        <Autocomplete
                          options={cities}
                          getOptionLabel={(option) => option.city_name}
                          {...register("city2")}
                          onChange={(e, value) => {
                            setValue("city2", value.city_name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select City"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col p0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control pl4 pr4 text-center"
                            {...register("city2Percentage")}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>City 3</label>
                    <div className="row m0">
                      <div className="col-md-9 p0 mr8">
                        <select className="form-control">
                          <option value="">Select City</option>
                          <option value="Bhopal">Bhopal</option>
                          <option value="Indore">Indore</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Noida">Noida</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Pune">Pune</option>
                        </select> 
                        <Autocomplete
                          options={cities}
                          getOptionLabel={(option) => option.city_name}
                          {...register("city3")}
                          onChange={(e, value) => {
                            setValue("city3", value.city_name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select City"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col p0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control pl4 pr4 text-center"
                            {...register("city3Percentage")}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>City 4</label>
                    <div className="row m0">
                      <div className="col-md-9 p0 mr8">
                         <select className="form-control">
                          <option value="">Select City</option>
                          <option value="Bhopal">Bhopal</option>
                          <option value="Indore">Indore</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Noida">Noida</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Pune">Pune</option>
                        </select> 
                        <Autocomplete
                          options={cities}
                          getOptionLabel={(option) => option.city_name}
                          {...register("city4")}
                          onChange={(e, value) => {
                            setValue("city4", value.city_name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select City"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col p0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control pl4 pr4 text-center"
                            {...register("city4Percentage")}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>City 5</label>
                    <div className="row m0">
                      <div className="col-md-9 p0 mr8">
                        <select className="form-control"> 
                         <option value="">Select City</option>
                          <option value="Bhopal">Bhopal</option>
                          <option value="Indore">Indore</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Noida">Noida</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Pune">Pune</option>
                        </select> 
                        <Autocomplete
                          options={cities}
                          getOptionLabel={(option) => option.city_name}
                          {...register("city5")}
                          onChange={(e, value) => {
                            setValue("city5", value.city_name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select City"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col p0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control pl4 pr4 text-center"
                            {...register("city5Percentage")}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <input
                      type="file"
                      id="cityFileInput"
                      style={{ display: "none" }}
                      {...register("cityImage")}
                    />
                    <button
                      type="button"
                      className="btn cmnbtn btn-primary mt24"
                      onClick={() =>
                        document.getElementById("cityFileInput").click()
                      }
                    >
                      <i className="bi bi-cloud-arrow-up-fill"></i> Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">City</h5>
            </div>
            <div className="card-body pb8">
              {cities && (
                <div className="row thm_form">
                  {["city1", "city2", "city3", "city4", "city5"].map(
                    (city, index) => (
                      <div className="col-md-4 col-sm-12" key={city}>
                        <div className="form-group">
                          <label>{`City ${index + 1}`}</label>
                          <div className="row m0">
                            <div className="col-md-9 p0 mr8">
                              <Controller
                                name={city}
                                control={control}
                                render={({ field }) => (
                                  <Autocomplete
                                    {...field}
                                    options={cities}
                                    getOptionLabel={(option) =>
                                      option.city_name || ""
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                      option.city_name === value?.city_name
                                    }
                                    onChange={(event, value) =>
                                      setValue(city, value?.city_name || "")
                                    }
                                    value={
                                      cities?.find(
                                        (cityItem) =>
                                          cityItem.city_name === watch(city)
                                      ) || null
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select City"
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                )}
                              />
                            </div>
                            <div className="col p0">
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control pl4 pr4 text-center"
                                  {...register(`${city}Percentage`)}
                                />
                                <span className="input-group-text">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  <div className="col-md-4 col-sm-12">
                    <div className="form-group">
                      <input
                        type="file"
                        id="cityFileInput"
                        style={{ display: "none" }}
                        {...register("cityImage")}
                      />
                      <button
                        type="button"
                        className="btn cmnbtn btn-primary mt24"
                        onClick={() =>
                          document.getElementById("cityFileInput").click()
                        }
                      >
                        <i className="bi bi-cloud-arrow-up-fill"></i> Image
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Country</h5>
            </div>
            <div className="card-body pb8">
              <div className="row thm_form">
                {/*  <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Country 1</label>
                    <div className="row m0">
                      <div className="col-md-9 p0 mr8">
                      
                        <Autocomplete
                          options={countryList}
                          getOptionLabel={(option) => option.name}
                          {...register("country1")}
                          onChange={(e, value) => {
                            setValue("country1", value.name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Country"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col p0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control pl4 pr4 text-center"
                            {...register("country1Percentage")}
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Country 2</label>
                    <div className="row m0">
                      <div className="col-md-9 p0 mr8">
                       
                        <Autocomplete
                          options={countryList}
                          getOptionLabel={(option) => option.name}
                          {...register("country2")}
                          onChange={(e, value) => {
                            setValue("country2", value.name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Country"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col p0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control pl4 pr4 text-center"
                            {...register("country2Percentage")}
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Country 3</label>
                    <div className="row m0">
                      <div className="col-md-9 p0 mr8">
                       
                        <Autocomplete
                          options={countryList}
                          getOptionLabel={(option) => option.name}
                          {...register("country3")}
                          onChange={(e, value) => {
                            setValue("country3", value.name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Country"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col p0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control pl4 pr4 text-center"
                            {...register("country3Percentage")}
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Country 4</label>
                    <div className="row m0">
                      <div className="col-md-9 p0 mr8">
                       
                        <Autocomplete
                          options={countryList}
                          getOptionLabel={(option) => option.name}
                          {...register("country4")}
                          onChange={(e, value) => {
                            setValue("country4", value.name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Country"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col p0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control pl4 pr4 text-center"
                            {...register("country4Percentage")}
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Country 5</label>
                    <div className="row m0">
                      <div className="col-md-9 p0 mr8">
                       
                        <Autocomplete
                          options={countryList}
                          getOptionLabel={(option) => option.name}
                          {...register("country5")}
                          onChange={(e, value) => {
                            setValue("country5", value.name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Country"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col p0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control pl4 pr4 text-center"
                            {...register("country5Percentage")}
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>*/}
                {[
                  "country1",
                  "country2",
                  "country3",
                  "country4",
                  "country5",
                ].map((country, index) => (
                  <div className="col-md-4 col-sm-12" key={country}>
                    <div className="form-group">
                      <label>{`Country ${index + 1}`}</label>
                      <div className="row m0">
                        <div className="col-md-9 p0 mr8">
                          <Controller
                            name={country}
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                {...field}
                                options={countryList}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) =>
                                  option.name === value?.name
                                }
                                onChange={(event, value) =>
                                  setValue(country, value?.name || "")
                                }
                                value={
                                  countryList?.find(
                                    (countryItem) =>
                                      countryItem.name === watch(country)
                                  ) || null
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Country"
                                    variant="outlined"
                                  />
                                )}
                              />
                            )}
                          />
                        </div>
                        <div className="col p0">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control pl4 pr4 text-center"
                              {...register(`${country}Percentage`)}
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                            <span className="input-group-text">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    {/* <button className="btn cmnbtn btn-primary mt24">
                      <i className="bi bi-cloud-arrow-up-fill"></i> Image
                    </button> */}
                    <input
                      type="file"
                      id="countryFileInput"
                      style={{ display: "none" }}
                      {...register("countryImage")}
                    />

                    <button
                      type="button"
                      className="btn cmnbtn btn-primary mt24"
                      onClick={() =>
                        document.getElementById("countryFileInput").click()
                      }
                    >
                      <i className="bi bi-cloud-arrow-up-fill"></i> Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Age Group</h5>
            </div>
            <div className="card-body pb8">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>13 - 17</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        {...register("ageGroup1")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>18 - 24</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        {...register("ageGroup2")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>25 - 34</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        {...register("ageGroup3")}
                      />

                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>35 - 44</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        {...register("ageGroup4")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>45 - 54</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        {...register("ageGroup5")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>55 - 64</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        {...register("ageGroup6")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>65+</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        {...register("ageGroup7")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    {/* <button className="btn cmnbtn btn-primary mt24">
                      <i className="bi bi-cloud-arrow-up-fill"></i> Image
                    </button> */}
                    <input
                      type="file"
                      id="ageFileInput"
                      style={{ display: "none" }}
                      {...register("ageGroupImage")}
                    />

                    <button
                      type="button"
                      className="btn cmnbtn btn-primary mt24"
                      onClick={() =>
                        document.getElementById("ageFileInput").click()
                      }
                    >
                      <i className="bi bi-cloud-arrow-up-fill"></i> Image
                    </button>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <p className="mt24 dangerText">
                      Note: Total percentage must be at least 98%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Gender</h5>
            </div>
            <div className="card-body pb8">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Male</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        {...register("menPercentage")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Female</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        {...register("womenPercentage")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flexCenter colGap16">
                <button className="btn cmnbtn btn-primary" type="submit">
                  Save
                </button>
                <button className="btn cmnbtn btn-secondary" type="button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </FormControl>
      </div>
    </>
  );
}
