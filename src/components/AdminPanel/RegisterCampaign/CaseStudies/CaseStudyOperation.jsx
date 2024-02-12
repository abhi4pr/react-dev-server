import { useEffect, useState } from "react";
import axios from "axios";
import { FcDownload } from "react-icons/fc";
import jwtDecode from "jwt-decode";
import Modal from "react-modal";
import { Autocomplete, Slider, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FormContainer from "../../FormContainer";
import ExpendModal from "../../../Datas/ExpendModal";
import { Link } from "react-router-dom";
import UserNav from "../../../Pantry/UserPanel/UserNav";
import DeleteButton from "../../DeleteButton";
import { baseUrl } from "../../../../utils/config";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const CaseStudyOperation = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [backupData, setBackupData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [contentData, setContentData] = useState([]);
  const [selectedContent, setSelectedContent] = useState("");
  const [platformData, setPlatformData] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [countData, setCountData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);

  const [designedData, setDesignedData] = useState([]);
  const [designed, setDesigned] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enlargedFileType, setEnlargedFileType] = useState("");
  const [enlargedFileUrl, setEnlargedFileUrl] = useState("");
  const [rowData, setRowData] = useState([{}]);
  const [expendModalOpen, setExpendModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState();
  const [brandCategory, setBrandCategory] = useState([]);
  const [brandSubCatData, setBrandSubCatData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  console.log(fromDate, "  ", toDate);

  const handleFileClick = (fileType, fileUrl) => {
    setEnlargedFileType(fileType);
    setEnlargedFileUrl(fileUrl);
    setIsModalOpen(true);
  };

  const HandleExpen = (detail, index) => {
    setRowData(detail);
    setExpendModalOpen(!expendModalOpen);
    setModalIndex(index);
  };

  const handleChange = (event, newValue) => {
    setCountData(newValue);
  };

  const renderEnlargedContent = () => {
    switch (enlargedFileType) {
      case "image":
        return (
          <img
            src={enlargedFileUrl}
            alt="Enlarged Image"
            style={{ maxWidth: "100%", maxHeight: "auto" }}
          />
        );
      case "pdf":
        return (
          <iframe
            src={enlargedFileUrl}
            title="file"
            width="100%"
            height="100%"
          ></iframe>
        );
      case "video":
        return (
          <video src={enlargedFileUrl} controls width="50%" height="auto" />
        );
      default:
        return null;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEnlargedFileType("");
    setEnlargedFileUrl("");
  };

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const RoleIDContext = decodedToken.role_id;

  const dateConvert = (date) => {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const newDate = day + "/" + month + "/" + year;
    return newDate;
  };

  async function getData() {
    await axios.get(baseUrl + "dataoperation").then((res) => {
      setCountData(res.data);
      const responseData = res.data;

      const uniqueBrandName = new Set();
      const filteredData = responseData.filter((item) => {
        if (!uniqueBrandName.has(item.data_name)) {
          uniqueBrandName.add(item.data_name);
          return true;
        }
        return false;
      });
      if (RoleIDContext == 2 || RoleIDContext == 1) {
        console.log(filteredData, "filteredData")
        setData(filteredData);
      } else {
        setData(filteredData.filter((d) => d.created_by === userID));
      }
      setBackupData(filteredData);
    });

    axios
      .get(baseUrl + "projectxCategory")
      .then((res) => setCategoryData(res.data.data));

    axios
      .get(baseUrl + "get_all_data_brands")
      .then((res) => setBrandData(res.data));

    axios
      .get(baseUrl + "distinct_created_by")
      .then((res) => setEmployeeData(res.data.data));
    axios
      .get(baseUrl + "distinct_designed_by")
      .then((res) => setDesignedData(res.data.data));

    axios
      .get(baseUrl + "get_all_data_platforms")
      .then((res) => setPlatformData(res.data));
    axios

      .get(baseUrl + "get_all_data_content_types")
      .then((res) => setContentData(res.data));

    axios
      .get(baseUrl + "projectxCategory")
      .then((res) => {
        setBrandCategory(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(baseUrl + "projectxSubCategory").then((res) => {
      setBrandSubCatData(res.data.data);
    });
  }

  const getBrandCount = (brandName, data) => {
    const count = countData.filter(
      (item) => item.data_name === brandName
    ).length;
    return count;
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (
      selectedCategory === "" &&
      selectedUser === "" &&
      selectedBrand === "" &&
      selectedContent === "" &&
      selectedPlatform === "" &&
      designed === ""
    ) {
      setData(backupData);
    } else {
      const filteredData = backupData.filter(
        (item) =>
          (selectedCategory === "" || item.cat_id === selectedCategory) &&
          (selectedUser === "" || item.created_by == selectedUser) &&
          (selectedBrand === "" || item.brand_id === selectedBrand) &&
          (designed === "" || item.designed_by == designed) &&
          (selectedContent === "" ||
            item.content_type_id === selectedContent) &&
          (selectedPlatform === "" || item.platform_id === selectedPlatform)
      );
      setData(filteredData);
    }
  }, [
    selectedCategory,
    selectedUser,
    selectedBrand,
    selectedContent,
    selectedPlatform,
    designed,
  ]);

  const deleteBrand = async (brand_name) => {
    await axios
      .delete(`${baseUrl}` + `delete_data_based_data/${brand_name}`)
      .then((res) => {
        getData();
      })
      .catch((error) => {
        console.error("Error deleting brand:", error);
      });
  };

  useEffect(() => {
    const filteredData = backupData.filter((item) => {
      const itemDate = dayjs(item.created_at);
      const isAfterFromDate = fromDate
        ? itemDate.isAfter(fromDate.startOf("day")) ||
          itemDate.isSame(fromDate.startOf("day"), "day")
        : true;
      const isBeforeToDate = toDate
        ? itemDate.isBefore(toDate.endOf("day")) ||
          itemDate.isSame(toDate.endOf("day"), "day")
        : true;

      return (
        (selectedCategory === "" || item.cat_id === selectedCategory) &&
        (selectedUser === "" || item.created_by == selectedUser) &&
        (selectedBrand === "" || item.brand_id === selectedBrand) &&
        (designed === "" || item.designed_by == designed) &&
        (selectedContent === "" || item.content_type_id === selectedContent) &&
        (selectedPlatform === "" || item.platform_id === selectedPlatform) &&
        isAfterFromDate &&
        isBeforeToDate
      );
    });
    setData(filteredData);
  }, [
    selectedCategory,
    selectedUser,
    selectedBrand,
    selectedContent,
    selectedPlatform,
    designed,
    fromDate,
    toDate,
    backupData,
  ]);

  return (
    <>
      <div>
        <UserNav />
        <div className="section section_padding sec_bg h100vh">
          <div className="container">
            <div className="action_heading">
              <div className="action_title">
                <FormContainer mainTitle="Data" link="/data-brand-master" />
              </div>
              <div className="action_btns">
                <Link to="/casestudy-dashboard">
                  <button type="button" className="btn btn-primary btn-sm">
                    Dashboard
                  </button>
                </Link>{" "}
                <Link to="/case-platform">
                  <button type="button" className="btn btn-primary btn-sm">
                    Platform
                  </button>
                </Link>
                <Link to="/admin/brandmaster">
                  <button type="button" className="btn btn-primary btn-sm">
                    Brand
                  </button>
                </Link>
                <Link to="/case-study/brand">
                  <button type="button" className="btn btn-primary btn-sm">
                    Create Data
                  </button>
                </Link>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-body pb0 pb4">
                <div className="row thm_form">
                  <Autocomplete
                    className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12"
                    id="combo-box-demo"
                    options={categoryData}
                    getOptionLabel={(option) => option.category_name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=" Brand Category"
                        variant="outlined"
                      />
                    )}
                    onChange={(e, value) => setSelectedCategory(value?._id)}
                  />
                  <Autocomplete
                    className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12"
                    id="combo-box-demo"
                    options={brandData}
                    getOptionLabel={(option) => option.brand_name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Brand" variant="outlined" />
                    )}
                    onChange={(e, value) => setSelectedBrand(value?._id)}
                  />
                  <Autocomplete
                    className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 my-2"
                    id="combo-box-demo"
                    options={platformData}
                    getOptionLabel={(option) => option.platform_name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Platform"
                        variant="outlined"
                      />
                    )}
                    onChange={(e, value) => setSelectedPlatform(value?._id)}
                  />

                  <Autocomplete
                    id="combo-box-demo"
                    className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 my-2"
                    options={employeeData}
                    getOptionLabel={(option) => option.user_name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Created By"
                        variant="outlined"
                      />
                    )}
                    onChange={(e, value) => setSelectedUser(value?._id)}
                  />
                  <Autocomplete
                    className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 my-2"
                    id="combo-box-demo"
                    options={designedData}
                    getOptionLabel={(option) => option.user_name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Designed By"
                        variant="outlined"
                      />
                    )}
                    onChange={(e, value) => setDesigned(value?._id)}
                  />
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                    <TextField
                      id="outlined-basic"
                      label="Search"
                      variant="outlined"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by brand name"
                    />
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="From Date"
                          value={fromDate}
                          onChange={(newValue) => {
                            setFromDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="To Date"
                          value={toDate}
                          onChange={(newValue) => {
                            setToDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="summary_cards flex-row row">
              {data.length > 0 &&
                data
                  .filter(
                    (detail) =>
                      detail.data_name
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                      detail.data_type
                        ?.toLowerCase()
                        .includes(search.toLowerCase())
                  )
                  .map((detail, index) => {
                    return (
                      <div
                        key={index}
                        className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                      >
                        <div className="summary_card">
                          <div className="summary_cardtitle">
                            <h5>
                              <span>
                                {/* { detail.data_name } */}
                              </span>
                            </h5>
                            <div className="summary_cardaction">
                              <Link to={`/caseStudy-view/${detail.data_id}`}>
                                <button className="btn btn-warning btn-sm">
                                  View
                                </button>
                              </Link>
                              <Link to={`/casestudy-update/${detail.data_id}`}>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </Link>

                              <DeleteButton
                                endpoint="dataoperationwithdataname"
                                id={detail.data_name}
                                getData={getData}
                              />
                            </div>
                          </div>
                          <div className="summary_cardbody">
                            <div className="d-flex">
                              <div className="documentCard_download">
                                <a
                                  href={detail.data_image}
                                  target="_bank"
                                  download
                                >
                                  <FcDownload />
                                </a>
                              </div>
                            </div>
                            <div className="summary_cardrow flex-column">
                              <div className="summary_box text-center ml-auto mr-auto">
                                {detail.data_type === "jpg" ||
                                detail.data_type === "png" ||
                                detail.data_type === "jpeg" ? (
                                  <div
                                    id={`carouselExampleControls_${index}`}
                                    className="carousel slide"
                                    data-ride="carousel"
                                  >
                                    <div className="carousel-inner">
                                      {countData
                                        .filter(
                                          (item) =>
                                            item.data_name ===
                                              detail.data_name &&
                                            item.data_image != null
                                        )
                                        .map((filteredItem, index) => (
                                          <div
                                            key={index}
                                            className={`carousel-item ${
                                              index === 0 ? "active" : ""
                                            }`}
                                            data-interval="10000"
                                          >
                                            {filteredItem.data_type === "jpg" ||
                                            filteredItem.data_type === "png" ||
                                            filteredItem.data_type ===
                                              "jpeg" ? (
                                              <img
                                                onClick={() =>
                                                  handleFileClick(
                                                    "image",
                                                    filteredItem.data_image
                                                  )
                                                }
                                                className="d-block w-100"
                                                src={filteredItem.data_image}
                                                alt={`Slide ${index + 1}`}
                                              />
                                            ) : filteredItem.data_type ===
                                              "pdf" ? (
                                              // <img
                                              //   onClick={() =>
                                              //     handleFileClick(
                                              //       "pdf",
                                              //       filteredItem.data_image
                                              //     )
                                              //   }
                                              //   className="d-block w-100"
                                              //   src={"pdf"}
                                              //   alt={`Slide ${index + 1}`}
                                              // />
                                              <div
                                                style={{
                                                  position: "relative",
                                                  width: "100%",
                                                  height: "auto",
                                                }}
                                              >
                                                {" "}
                                                {/* Adjust the height as needed */}
                                                <iframe
                                                  allowFullScreen={true}
                                                  src={filteredItem.data_image}
                                                  title="PDF Viewer"
                                                  style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    border: "none",
                                                    overflow: "hidden",
                                                  }}
                                                />
                                                <div
                                                  onClick={() =>
                                                    handleFileClick(
                                                      "pdf",
                                                      filteredItem.data_image
                                                    )
                                                  }
                                                  style={{
                                                    position: "absolute",
                                                    width: "64%",
                                                    height: "71%",
                                                    top: 0,
                                                    left: "21px",
                                                    cursor: "pointer",
                                                    background:
                                                      "rgba(0, 0, 0, 0)", // This makes the div transparent
                                                    zIndex: 10, // This ensures the div is placed over the iframe
                                                  }}
                                                ></div>
                                              </div>
                                            ) : filteredItem.data_type ===
                                              "mp4" ? (
                                              <video
                                                className=""
                                                controls
                                                width="100%"
                                                height="auto"
                                              >
                                                <source
                                                  src={filteredItem.data_image}
                                                  type={`video/mp4`}
                                                />
                                                Your browser does not support
                                                the video tag.
                                              </video>
                                            ) : (
                                              <img
                                                className="d-block w-100"
                                                src={"video"}
                                                alt={`Slide ${index + 1}`}
                                              />
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                    <button
                                      className="carousel-control-prev"
                                      type="button"
                                      data-target={`#carouselExampleControls_${index}`}
                                      data-slide="prev"
                                    >
                                      <span
                                        className="carousel-control-prev-icon"
                                        aria-hidden="true"
                                      ></span>
                                      <span className="sr-only">Previous</span>
                                    </button>
                                    <button
                                      className="carousel-control-next"
                                      type="button"
                                      data-target={`#carouselExampleControls_${index}`}
                                      data-slide="next"
                                    >
                                      <span
                                        className="carousel-control-next-icon"
                                        aria-hidden="true"
                                      ></span>
                                      <span className="sr-only">Next</span>
                                    </button>
                                  </div>
                                ) : detail.data_type === "pdf" ? (
                                  <img
                                    onClick={() =>
                                      handleFileClick("pdf", detail.data_image)
                                    }
                                    src={"video"}
                                    width="80px"
                                    height="80px"
                                  />
                                ) : detail.data_type === "mp4" ? (
                                  <img
                                    onClick={() =>
                                      handleFileClick(
                                        "video",
                                        detail.data_image
                                      )
                                    }
                                    src={"video"}
                                    width="80px"
                                    height="80px"
                                  />
                                ) : (
                                  <img
                                    src={"video"}
                                    width="80px"
                                    height="80px"
                                  />
                                )}
                              </div>

                              <div className="summary_box col">
                                <h4>
                                  <span>Type</span>
                                  {detail.data_type}
                                </h4>
                              </div>
                              <div className="summary_box col">
                                <h4>
                                  <span>Category</span>
                                  {detail.category_name}
                                </h4>
                              </div>
                              <div className="summary_box col">
                                <h4>
                                  <span>Content type</span>
                                  {detail.content_type_name}
                                </h4>
                              </div>
                              <div className="summary_box col">
                                <h4>
                                  <span>Platform</span>
                                  {detail.platform_name}
                                </h4>
                              </div>
                              <div className="summary_box col">
                                <h4>
                                  <span>Date</span>
                                  {detail.created_at.split("T")[0]}
                                </h4>
                              </div>
                              <div className="summary_box col">
                                <h4>
                                  <span>Image count</span>
                                  {getBrandCount(detail.data_name)}
                                </h4>
                              </div>
                              <div className="summary_box col">
                                <h4>
                                  <span>Uploaded by</span>
                                  {detail.created_by_name}
                                </h4>
                              </div>
                              <div className="summary_box col">
                                <h4>
                                  <span>Designed by</span>
                                  {detail.designed_by_name}
                                </h4>
                              </div>
                              <div
                                style={{
                                  height:
                                    expendModalOpen && modalIndex === index
                                      ? "auto"
                                      : "50px",
                                }}
                              >
                                {detail.content_type_id ==
                                  "65a663ccef8a81593f418836" && (
                                  <>
                                    <div className="text-center">
                                      <h4
                                        onClick={() =>
                                          HandleExpen(detail, index)
                                        }
                                      >
                                        {expendModalOpen &&
                                        modalIndex === index ? (
                                          <ExpandLessIcon />
                                        ) : (
                                          <ExpandMoreIcon />
                                        )}
                                      </h4>
                                    </div>
                                    {expendModalOpen && modalIndex == index && (
                                      <>
                                        <div className="summary_box text-center ml-auto mr-auto">
                                          <h3 className="lead fs-6 text-start text-black-50">
                                            MMC
                                          </h3>
                                          {detail.data_type === "jpg" ||
                                          detail.data_type === "png" ||
                                          detail.data_type === "jpeg" ? (
                                            <div
                                              id={`carouselExampleControls_${detail.data_name}_${index}`} // Changed to use both detail.data_name and index for uniqueness
                                              className="carousel slide"
                                              data-ride="carousel"
                                            >
                                              <div className="carousel-inner">
                                                {countData
                                                  .filter(
                                                    (item) =>
                                                      item.data_name ===
                                                        detail.data_name &&
                                                      item.mmc_image != null
                                                  )
                                                  .map(
                                                    (filteredItem, index) => (
                                                      <div
                                                        key={index}
                                                        className={`carousel-item ${
                                                          index === 0
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                        data-interval="10000"
                                                      >
                                                        {filteredItem.data_type ===
                                                          "jpg" ||
                                                        filteredItem.data_type ===
                                                          "png" ||
                                                        filteredItem.data_type ===
                                                          "jpeg" ? (
                                                          <img
                                                            onClick={() =>
                                                              handleFileClick(
                                                                "image",
                                                                filteredItem.mmc_image
                                                              )
                                                            }
                                                            className="d-block w-100"
                                                            src={
                                                              filteredItem.mmc_image
                                                            }
                                                            alt={`Slide ${
                                                              index + 1
                                                            }`}
                                                          />
                                                        ) : filteredItem.data_type ===
                                                          "pdf" ? (
                                                          // <img
                                                          //   onClick={() =>
                                                          //     handleFileClick(
                                                          //       "pdf",
                                                          //       filteredItem.mmc_image
                                                          //     )
                                                          //   }
                                                          //   className="d-block w-100"
                                                          //   src={pdf}
                                                          //   alt={`Slide ${index + 1
                                                          //     }`}
                                                          // />
                                                          <div
                                                            style={{
                                                              position:
                                                                "relative",
                                                              width: "100%",
                                                              height: "auto",
                                                            }}
                                                          >
                                                            {" "}
                                                            {/* Adjust the height as needed */}
                                                            <iframe
                                                              allowFullScreen={
                                                                true
                                                              }
                                                              src={
                                                                filteredItem.mmc_image
                                                              }
                                                              title="PDF Viewer"
                                                              style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                border: "none",
                                                                overflow:
                                                                  "hidden",
                                                              }}
                                                            />
                                                            <div
                                                              onClick={() =>
                                                                handleFileClick(
                                                                  "pdf",
                                                                  filteredItem.mmc_image
                                                                )
                                                              }
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                width: "64%",
                                                                height: "71%",
                                                                top: 0,
                                                                left: "21px",
                                                                cursor:
                                                                  "pointer",
                                                                background:
                                                                  "rgba(0, 0, 0, 0)", // This makes the div transparent
                                                                zIndex: 10, // This ensures the div is placed over the iframe
                                                              }}
                                                            ></div>
                                                          </div>
                                                        ) : filteredItem.data_type ===
                                                          "mp4" ? (
                                                          // <img
                                                          //   onClick={() =>
                                                          //     handleFileClick(
                                                          //       "video",
                                                          //       filteredItem.mmc_image
                                                          //     )
                                                          //   }
                                                          //   className="d-block w-100"
                                                          //   src={video}
                                                          //   alt={`Slide ${
                                                          //     index + 1
                                                          //   }`}
                                                          // />
                                                          <video
                                                            className=""
                                                            controls
                                                            width="100%"
                                                            height="auto"
                                                          >
                                                            <source
                                                              src={
                                                                filteredItem.mmc_image
                                                              }
                                                              type={`video/mp4`}
                                                            />
                                                            Your browser does
                                                            not support the
                                                            video tag.
                                                          </video>
                                                        ) : (
                                                          // <img
                                                          //   className="d-block w-100"
                                                          //   src={video}
                                                          //   alt={`Slide ${
                                                          //     index + 1
                                                          //   }`}
                                                          // />
                                                          <video
                                                            className=""
                                                            controls
                                                            width="100%"
                                                            height="auto"
                                                          >
                                                            <source
                                                              src={
                                                                filteredItem.mmc_image
                                                              }
                                                              type={`video/mp4`}
                                                            />
                                                            Your browser does
                                                            not support the
                                                            video tag.
                                                          </video>
                                                        )}
                                                      </div>
                                                    )
                                                  )}
                                              </div>
                                              <button
                                                className="carousel-control-prev"
                                                type="button"
                                                data-target={`#carouselExampleControls_${detail.data_name}_${index}`} // Updated to match the new id format
                                                data-slide="prev"
                                              >
                                                <span
                                                  className="carousel-control-prev-icon"
                                                  aria-hidden="true"
                                                ></span>
                                                <span className="sr-only">
                                                  Previous
                                                </span>
                                              </button>
                                              <button
                                                className="carousel-control-next"
                                                type="button"
                                                data-target={`#carouselExampleControls_${detail.data_name}_${index}`} // Updated to match the new id format
                                                data-slide="next"
                                              >
                                                <span
                                                  className="carousel-control-next-icon"
                                                  aria-hidden="true"
                                                ></span>
                                                <span className="sr-only">
                                                  Next
                                                </span>
                                              </button>
                                            </div>
                                          ) : detail.data_type === "pdf" ? (
                                            // <img
                                            //   onClick={() =>
                                            //     handleFileClick(
                                            //       "pdf",
                                            //       detail.mmc_image
                                            //     )
                                            //   }
                                            //   src={video}
                                            //   width="80px"
                                            //   height="80px"
                                            // />
                                            <div
                                              style={{
                                                position: "relative",
                                                width: "100%",
                                                height: "auto",
                                              }}
                                            >
                                              {" "}
                                              {/* Adjust the height as needed */}
                                              <iframe

                                                allowFullScreen={true}
                                                src={detail.mmc_image}
                                                title="PDF Viewer"
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                  border: "none",
                                                  overflow: "hidden",
                                                }}
                                              />
                                              <div

                                                onClick={() =>
                                                  handleFileClick(
                                                    "pdf",
                                                    detail.mmc_image
                                                  )
                                                }
                                                style={{
                                                  position: "absolute",
                                                  width: "64%",
                                                  height: "71%",
                                                  top: 0,
                                                  left: "21px",
                                                  cursor: "pointer",
                                                  background: "rgba(0, 0, 0, 0)", // This makes the div transparent
                                                  zIndex: 10, // This ensures the div is placed over the iframe
                                                }}
                                              ></div>
                                            </div>

                                          ) : detail.data_type === "mp4" ? (
                                            // <img
                                            //   onClick={() =>
                                            //     handleFileClick(
                                            //       "video",
                                            //       detail.mmc_image
                                            //     )
                                            //   }
                                            //   src={video}
                                            //   width="80px"
                                            //   height="80px"
                                            // />
                                            <video
                                              className=""
                                              controls
                                              width="100%"
                                              height="auto"
                                            >
                                              <source
                                                src={detail.mmc_image}
                                                type={`video/mp4`}
                                              />
                                              Your browser does not support the
                                              video tag.
                                            </video>
                                            
                                          ) : (
                                            <img
                                              src={video}
                                              width="80px"
                                              height="80px"
                                            />
                                          )}
                                        </div>

                                        <div className="summary_box text-center ml-auto mr-auto">
                                          {detail.data_type === "jpg" ||
                                          detail.data_type === "png" ||
                                          detail.data_type === "jpeg" ? (
                                            <div
                                              id={`carouselSarcasmControls_${detail.data_name}_${index}`} // Ensure unique ID by prefixing with "carouselSarcasmControls_"
                                              className="carousel slide"
                                              data-ride="carousel"
                                            >
                                              <div className="carousel-inner">
                                                {countData
                                                  .filter(
                                                    (item) =>
                                                      item.data_name ===
                                                        detail.data_name &&
                                                      item.sarcasm_image != null
                                                  )
                                                  .map(
                                                    (filteredItem, index) => (
                                                      <div
                                                        key={index}
                                                        className={`carousel-item ${
                                                          index === 0
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                        data-interval="10000"
                                                      >
                                                        <h3 className="lead text-start fs-6 text-black-50">
                                                          Sarcasm
                                                        </h3>
                                                        {filteredItem.data_type ===
                                                          "jpg" ||
                                                        filteredItem.data_type ===
                                                          "png" ||
                                                        filteredItem.data_type ===
                                                          "jpeg" ? (
                                                          <img
                                                            onClick={() =>
                                                              handleFileClick(
                                                                "image",
                                                                filteredItem.sarcasm_image
                                                              )
                                                            }
                                                            className="d-block w-100"
                                                            src={
                                                              filteredItem.sarcasm_image
                                                            } // Use sarcasm_image for the src
                                                            alt={`Slide ${
                                                              index + 1
                                                            }`}
                                                          />
                                                        ) : filteredItem.data_type ===
                                                          "pdf" ? (
                                                          // <img
                                                          //   onClick={() =>
                                                          //     handleFileClick(
                                                          //       "pdf",
                                                          //       filteredItem.sarcasm_image
                                                          //     )
                                                          //   }
                                                          //   className="d-block w-100"
                                                          //   src={pdf} // Assuming pdf is a placeholder image for PDF files
                                                          //   alt={`Slide ${index + 1
                                                          //     }`}
                                                          // />
                                                          <div
                                                            style={{
                                                              position:
                                                                "relative",
                                                              width: "100%",
                                                              height: "auto",
                                                            }}
                                                          >
                                                            {" "}
                                                            {/* Adjust the height as needed */}
                                                            <iframe
                                                              allowFullScreen={
                                                                true
                                                              }
                                                              src={
                                                                filteredItem.sarcasm_image
                                                              }
                                                              title="PDF Viewer"
                                                              style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                border: "none",
                                                                overflow:
                                                                  "hidden",
                                                              }}
                                                            />
                                                            <div
                                                              onClick={() =>
                                                                handleFileClick(
                                                                  "pdf",
                                                                  filteredItem.sarcasm_image
                                                                )
                                                              }
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                width: "64%",
                                                                height: "71%",
                                                                top: 0,
                                                                left: "21px",
                                                                cursor:
                                                                  "pointer",
                                                                background:
                                                                  "rgba(0, 0, 0, 0)", // This makes the div transparent
                                                                zIndex: 10, // This ensures the div is placed over the iframe
                                                              }}
                                                            ></div>
                                                          </div>
                                                        ) : filteredItem.data_type ===
                                                          "mp4" ? (
                                                          // <img
                                                          //   onClick={() =>
                                                          //     handleFileClick(
                                                          //       "video",
                                                          //       filteredItem.sarcasm_image
                                                          //     )
                                                          //   }
                                                          //   className="d-block w-100"
                                                          //   src={video} // Assuming video is a placeholder image for video files
                                                          //   alt={`Slide ${
                                                          //     index + 1
                                                          //   }`}
                                                          // />
                                                          <div
                                                            style={{
                                                              position:
                                                                "relative",
                                                              width: "100%",
                                                              height: "auto",
                                                            }}
                                                          >
                                                            {" "}
                                                            {/* Adjust the height as needed */}
                                                            <iframe
                                                              allowFullScreen={
                                                                true
                                                              }
                                                              src={
                                                                filteredItem.sarcasm_image
                                                              }
                                                              title="PDF Viewer"
                                                              style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                border: "none",
                                                                overflow:
                                                                  "hidden",
                                                              }}
                                                            />
                                                            <div
                                                              onClick={() =>
                                                                handleFileClick(
                                                                  "pdf",
                                                                  filteredItem.sarcasm_image
                                                                )
                                                              }
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                width: "64%",
                                                                height: "71%",
                                                                top: 0,
                                                                left: "21px",
                                                                cursor:
                                                                  "pointer",
                                                                background:
                                                                  "rgba(0, 0, 0, 0)", // This makes the div transparent
                                                                zIndex: 10, // This ensures the div is placed over the iframe
                                                              }}
                                                            ></div>
                                                          </div>
                                                        ) : (
                                                          <img
                                                            className="d-block w-100"
                                                            src={video} // Default case, though this seems to be an oversight as there's no alternative case for other data types
                                                            alt={`Slide ${
                                                              index + 1
                                                            }`}
                                                          />
                                                        )}
                                                      </div>
                                                    )
                                                  )}
                                              </div>
                                              <button
                                                className="carousel-control-prev"
                                                type="button"
                                                data-target={`#carouselSarcasmControls_${detail.data_name}_${index}`} // Match the unique ID
                                                data-slide="prev"
                                              >
                                                <span
                                                  className="carousel-control-prev-icon"
                                                  aria-hidden="true"
                                                ></span>
                                                <span className="sr-only">
                                                  Previous
                                                </span>
                                              </button>
                                              <button
                                                className="carousel-control-next"
                                                type="button"
                                                data-target={`#carouselSarcasmControls_${detail.data_name}_${index}`} // Match the unique ID
                                                data-slide="next"
                                              >
                                                <span
                                                  className="carousel-control-next-icon"
                                                  aria-hidden="true"
                                                ></span>
                                                <span className="sr-only">
                                                  Next
                                                </span>
                                              </button>
                                            </div>
                                          ) : detail.data_type === "pdf" ? (
                                            // <img
                                            //   onClick={() =>
                                            //     handleFileClick(
                                            //       "pdf",
                                            //       detail.sarcasm_image
                                            //     )
                                            //   }
                                            //   src={video} // Placeholder for PDF
                                            //   width="80px"
                                            //   height="80px"
                                            // />

                                            <div
                                              style={{
                                                position: "relative",
                                                width: "100%",
                                                height: "auto",
                                              }}
                                            >
                                              {" "}
                                              {/* Adjust the height as needed */}
                                              <iframe
                                                allowFullScreen={true}
                                                src={detail.sarcasm_image}
                                                title="PDF Viewer"
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                  border: "none",
                                                  overflow: "hidden",
                                                }}
                                              />
                                              <div
                                                onClick={() =>
                                                  handleFileClick(
                                                    "pdf",
                                                    detail.sarcasm_image
                                                  )
                                                }
                                                style={{
                                                  position: "absolute",
                                                  width: "64%",
                                                  height: "71%",
                                                  top: 0,
                                                  left: "21px",
                                                  cursor: "pointer",
                                                  background:
                                                    "rgba(0, 0, 0, 0)", // This makes the div transparent
                                                  zIndex: 10, // This ensures the div is placed over the iframe
                                                }}
                                              ></div>
                                            </div>
                                          ) : detail.data_type === "mp4" ? (
                                            // <img
                                            //   onClick={() =>
                                            //     handleFileClick(
                                            //       "video",
                                            //       detail.sarcasm_image
                                            //     )
                                            //   }
                                            //   src={video} // Placeholder for video
                                            //   width="80px"
                                            //   height="80px"
                                            // />
                                            <video
                                              className=""
                                              controls
                                              width="100%"
                                              height="auto"
                                            >
                                              <source
                                                src={detail.sarcasm_image}
                                                type={`video/mp4`}
                                              />
                                              Your browser does not support the
                                              video tag.
                                            </video>
                                          ) : (
                                            <img
                                              src={video} // This case may need to be adjusted since it doesn't handle sarcasm_image
                                              width="80px"
                                              height="80px"
                                            />
                                          )}
                                        </div>

                                        <div className="summary_box text-center ml-auto mr-auto">
                                          {detail.data_type === "jpg" ||
                                          detail.data_type === "png" ||
                                          detail.data_type === "jpeg" ? (
                                            <div
                                              id={`carouselNoLogoControls_${detail.data_name}_${index}`} // Changed ID prefix to "carouselNoLogoControls_"
                                              className="carousel slide"
                                              data-ride="carousel"
                                            >
                                              <div className="carousel-inner">
                                                {countData
                                                  .filter(
                                                    (item) =>
                                                      item.data_name ===
                                                        detail.data_name &&
                                                      item.no_logo_image != null
                                                  )
                                                  .map(
                                                    (filteredItem, index) => (
                                                      <div
                                                        key={index}
                                                        className={`carousel-item ${
                                                          index === 0
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                        data-interval="10000"
                                                      >
                                                        <h3 className="lead fs-6 text-start text-black-50">
                                                          No Logo
                                                        </h3>

                                                        {filteredItem.data_type ===
                                                          "jpg" ||
                                                        filteredItem.data_type ===
                                                          "png" ||
                                                        filteredItem.data_type ===
                                                          "jpeg" ? (
                                                          <img
                                                            onClick={() =>
                                                              handleFileClick(
                                                                "image",
                                                                filteredItem.no_logo_image
                                                              )
                                                            }
                                                            className="d-block w-100"
                                                            src={
                                                              filteredItem.no_logo_image
                                                            } // Correctly using no_logo_image for the src
                                                            alt={`Slide ${
                                                              index + 1
                                                            }`}
                                                          />
                                                        ) : filteredItem.data_type ===
                                                          "pdf" ? (
                                                          // <img
                                                          //   onClick={() =>
                                                          //     handleFileClick(
                                                          //       "pdf",
                                                          //       filteredItem.no_logo_image
                                                          //     )
                                                          //   }
                                                          //   className="d-block w-100"
                                                          //   src={pdf} // Assuming pdf is a placeholder image for PDF files
                                                          //   alt={`Slide ${
                                                          //     index + 1
                                                          //   }`}
                                                          // />
                                                          <div
                                                            style={{
                                                              position:
                                                                "relative",
                                                              width: "100%",
                                                              height: "auto",
                                                            }}
                                                          >
                                                            {" "}
                                                            {/* Adjust the height as needed */}
                                                            <iframe
                                                              allowFullScreen={
                                                                true
                                                              }
                                                              src={
                                                                filteredItem.no_logo_image
                                                              }
                                                              title="PDF Viewer"
                                                              style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                border: "none",
                                                                overflow:
                                                                  "hidden",
                                                              }}
                                                            />
                                                            <div
                                                              onClick={() =>
                                                                handleFileClick(
                                                                  "pdf",
                                                                  filteredItem.no_logo_image
                                                                )
                                                              }
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                width: "64%",
                                                                height: "71%",
                                                                top: 0,
                                                                left: "21px",
                                                                cursor:
                                                                  "pointer",
                                                                background:
                                                                  "rgba(0, 0, 0, 0)", // This makes the div transparent
                                                                zIndex: 10, // This ensures the div is placed over the iframe
                                                              }}
                                                            ></div>
                                                          </div>
                                                        ) : filteredItem.data_type ===
                                                          "mp4" ? (
                                                          // <img
                                                          //   onClick={() =>
                                                          //     handleFileClick(
                                                          //       "video",
                                                          //       filteredItem.no_logo_image
                                                          //     )
                                                          //   }
                                                          //   className="d-block w-100"
                                                          //   src={video} // Assuming video is a placeholder image for video files
                                                          //   alt={`Slide ${
                                                          //     index + 1
                                                          //   }`}
                                                          // />
                                                          <div
                                                            style={{
                                                              position:
                                                                "relative",
                                                              width: "100%",
                                                              height: "auto",
                                                            }}
                                                          >
                                                            {" "}
                                                            {/* Adjust the height as needed */}
                                                            <iframe
                                                              allowFullScreen={
                                                                true
                                                              }
                                                              src={
                                                                filteredItem.no_logo_image
                                                              }
                                                              title="PDF Viewer"
                                                              style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                border: "none",
                                                                overflow:
                                                                  "hidden",
                                                              }}
                                                            />
                                                            <div
                                                              onClick={() =>
                                                                handleFileClick(
                                                                  "pdf",
                                                                  filteredItem.no_logo_image
                                                                )
                                                              }
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                width: "64%",
                                                                height: "71%",
                                                                top: 0,
                                                                left: "21px",
                                                                cursor:
                                                                  "pointer",
                                                                background:
                                                                  "rgba(0, 0, 0, 0)", // This makes the div transparent
                                                                zIndex: 10, // This ensures the div is placed over the iframe
                                                              }}
                                                            ></div>
                                                          </div>
                                                        ) : (
                                                          // <img
                                                          //   className="d-block w-100"
                                                          //   src={video} // Default case, though this seems to be an oversight as there's no alternative case for other data types
                                                          //   alt={`Slide ${
                                                          //     index + 1
                                                          //   }`}
                                                          // />
                                                          <video
                                                            className=""
                                                            controls
                                                            width="100%"
                                                            height="auto"
                                                          >
                                                            <source
                                                              src={
                                                                filteredItem.no_logo_image
                                                              }
                                                              type={`video/mp4`}
                                                            />
                                                            Your browser does not
                                                            support the video tag.
                                                          </video>

                                                        )}
                                                      </div>
                                                    )
                                                  )}
                                              </div>
                                              <button
                                                className="carousel-control-prev"
                                                type="button"
                                                data-target={`#carouselNoLogoControls_${detail.data_name}_${index}`} // Updated to match the new ID format
                                                data-slide="prev"
                                              >
                                                <span
                                                  className="carousel-control-prev-icon"
                                                  aria-hidden="true"
                                                ></span>
                                                <span className="sr-only">
                                                  Previous
                                                </span>
                                              </button>
                                              <button
                                                className="carousel-control-next"
                                                type="button"
                                                data-target={`#carouselNoLogoControls_${detail.data_name}_${index}`} // Updated to match the new ID format
                                                data-slide="next"
                                              >
                                                <span
                                                  className="carousel-control-next-icon"
                                                  aria-hidden="true"
                                                ></span>
                                                <span className="sr-only">
                                                  Next
                                                </span>
                                              </button>
                                            </div>
                                          ) : detail.data_type === "pdf" ? (
                                            // <img
                                            //   onClick={() =>
                                            //     handleFileClick(
                                            //       "pdf",
                                            //       detail.no_logo_image
                                            //     )
                                            //   }
                                            //   src={video} // Placeholder for PDF
                                            //   width="80px"
                                            //   height="80px"
                                            // />
                                            <div

                                              style={{  
                                                position: "relative",
                                                width: "100%",
                                                height: "auto",
                                              }}
                                            >
                                              {" "}
                                              {/* Adjust the height as needed */}
                                              <iframe

                                                allowFullScreen={true}  
                                                src={detail.no_logo_image}
                                                title="PDF Viewer"
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                  border: "none",
                                                  overflow: "hidden",
                                                }}
                                              />
                                              <div

                                                onClick={() =>  
                                                  handleFileClick(
                                                    "pdf",
                                                    detail.no_logo_image
                                                  )
                                                }
                                                style={{
                                                  position: "absolute",
                                                  width: "64%",
                                                  height: "71%",
                                                  top: 0,
                                                  left: "21px",
                                                  cursor: "pointer",
                                                  background:
                                                    "rgba(0, 0, 0, 0)", // This makes the div transparent
                                                  zIndex: 10, // This ensures the div is placed over the iframe
                                                }}
                                              ></div>
                                            </div>
                                          ) : detail.data_type === "mp4" ? (
                                            // <img
                                            //   onClick={() =>
                                            //     handleFileClick(
                                            //       "video",
                                            //       detail.no_logo_image
                                            //     )
                                            //   }
                                            //   src={video} // Placeholder for video
                                            //   width="80px"
                                            //   height="80px"
                                            // />
                                            <video
                                              className=""
                                              controls
                                              width="100%"
                                              height="auto"
                                            >
                                              <source
                                                src={detail.no_logo_image}
                                                type={`video/mp4`}
                                              />
                                              Your browser does not support the
                                              video tag.
                                            </video>

                                          ) : (
                                            <img
                                              src={video} // This case may need to be adjusted since it doesn't directly relate to no_logo_image
                                              width="80px"
                                              height="80px"
                                            />
                                          )}
                                        </div>

                                        <div className="summary_box col">
                                          <h4>
                                            <span>Campaign Purpose</span>
                                            {detail.campaign_purpose}
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span> Number Of Post</span>
                                            {detail.number_of_post}
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span>Numbar of Reach</span>
                                            {detail.number_of_reach}
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span>Number Of Impression</span>
                                            {detail.number_of_impression}
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span>Number Of Engagement</span>
                                            {detail.number_of_engagement}
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span>Number Of Views</span>
                                            {detail.number_of_views}
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span>Number Of Story Views</span>
                                            {detail.number_of_story_views}
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span>Operation Remark</span>
                                            {detail.operation_remark}
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span>Date Of Report</span>
                                            {dateConvert(detail.date_of_report)}
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span>Date Of Completion</span>
                                            {dateConvert(
                                              detail.date_of_completion
                                            )}
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span>Brand Category </span>
                                            {
                                              brandCategory.filter(
                                                (e) =>
                                                  e.category_id ==
                                                  detail.brand_category_id
                                              )[0]?.category_name
                                            }
                                          </h4>
                                        </div>
                                        <div className="summary_box col">
                                          <h4>
                                            <span>Brand Sub Category</span>
                                            {
                                              brandSubCatData?.filter(
                                                (e) =>
                                                  e.sub_category_id ==
                                                  detail.brand_sub_category_id
                                              )[0]?.sub_category_name
                                            }
                                          </h4>
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          style={{
            content: {
              alignContent: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              width: "50%",
              height: [enlargedFileType === "pdf" ? "100vh" : "auto"],

              // marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          {renderEnlargedContent()}
        </Modal>
      </div>
      <ExpendModal
        open={expendModalOpen}
        setOpen={setExpendModalOpen}
        rowData={rowData}
      />
    </>
  );
};
export default CaseStudyOperation;
