import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FcDownload } from "react-icons/fc";
import FormContainer from "../AdminPanel/FormContainer";
import UserNav from "../Pantry/UserPanel/UserNav";
import FieldContainer from "../AdminPanel/FieldContainer";
import imageIcon from "./image-icon.png";
import pdf from "./pdf-file.png";
import sheets from "./sheets.png";
import video from "./montage.png";
import DeleteButton from "../AdminPanel/DeleteButton";
import jwtDecode from "jwt-decode";
import Modal from "react-modal";
import { Autocomplete, Slider, TextField } from "@mui/material";
import { baseUrl } from "../../utils/config";

const DataBrandOverview = () => {
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

  const handleFileClick = (fileType, fileUrl) => {
    setEnlargedFileType(fileType);
    setEnlargedFileUrl(fileUrl);
    setIsModalOpen(true);
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
          // <Document file={enlargedFileUrl}>
          //   <Page pageNumber={1} />
          // </Document>
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

  async function getData() {
    await axios
      .get(baseUrl+"get_all_datas")
      .then((res) => {
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
          setData(filteredData);
        } else {
          setData(filteredData.filter((d) => d.created_by === userID));
        }
        setBackupData(filteredData);
      });

    axios
      .get(baseUrl+"get_all_data_categorys")
      .then((res) => setCategoryData(res.data.simcWithSubCategoryCount));

    axios
      .get(baseUrl+"get_all_data_brands")
      .then((res) => setBrandData(res.data));

    axios
      .get(baseUrl+"distinct_created_by")
      .then((res) => setEmployeeData(res.data.data));
    axios
      .get(baseUrl+"distinct_designed_by")
      .then((res) => setDesignedData(res.data.data));

    axios
      .get(baseUrl+"get_all_data_platforms")
      .then((res) => setPlatformData(res.data));
    axios

      .get(baseUrl+"get_all_data_content_types")
      .then((res) => setContentData(res.data));
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
      .delete(
        `${baseUrl}`+`delete_data_based_data/${brand_name}`
      )
      .then((res) => {
        getData();
      })
      .catch((error) => {
        console.error("Error deleting brand:", error);
      });
  };

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState("");
  // const handleImageClick = (imageUrl) => {
  //   setEnlargedImageUrl(imageUrl);
  //   setIsModalOpen(true);
  // };
  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setEnlargedImageUrl("");
  // };

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
                <Link to="/data-brand-dashboard">
                  <button type="button" className="btn btn-primary btn-sm">
                    Dashboard
                  </button>
                </Link>{" "}
                <Link to="/data-content-type">
                  <button type="button" className="btn btn-primary btn-sm">
                    Content Type
                  </button>
                </Link>
                <Link to="/data-platform">
                  <button type="button" className="btn btn-primary btn-sm">
                    Platform
                  </button>
                </Link>
                <Link to="/data-brand">
                  <button type="button" className="btn btn-primary btn-sm">
                    Brand
                  </button>
                </Link>
                <Link to="/data-brand-category">
                  <button type="button" className="btn btn-primary btn-sm">
                    Category
                  </button>
                </Link>
                <Link to="/data-brand-sub-category">
                  <button type="button" className="btn btn-primary btn-sm">
                    Sub Category
                  </button>
                </Link>
                <Link to="/data-brand-master">
                  <button type="button" className="btn btn-primary btn-sm">
                    Create Data
                  </button>
                </Link>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-body pb0 pb4">
                <div className="row thm_form">
                  {/* <FieldContainer
                    label="Category"
                    Tag="select"
                    fieldGrid={4}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {categoryData.map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.category_name}
                      </option>
                    ))}
                  </FieldContainer> */}

                  <Autocomplete
                  className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12"
                    id="combo-box-demo"
                    options={categoryData}
                    getOptionLabel={(option) => option.category_name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        variant="outlined"
                      />
                    )}
                    onChange={(e, value) => setSelectedCategory(value?._id)}
                  />
                  {/* <FieldContainer
                    label="Brand"
                    Tag="select"
                    fieldGrid={4}
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {brandData.map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.brand_name}
                      </option>
                    ))}
                  </FieldContainer> */}
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

                  {/* <FieldContainer
                    label="Content type"
                    Tag="select"
                    fieldGrid={4}
                    value={selectedContent}
                    onChange={(e) => setSelectedContent(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {contentData.map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.content_name}
                      </option>
                    ))}
                  </FieldContainer> */}
                  <Autocomplete
                  className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12"
                    id="combo-box-demo"
                    options={contentData}
                    getOptionLabel={(option) => option.content_name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Content Type"
                        variant="outlined"
                      />
                    )}
                    onChange={(e, value) => setSelectedContent(value?._id)}
                  />

                  {/* <FieldContainer
                    label="Platform"
                    Tag="select"
                    fieldGrid={4}
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {platformData.map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.platform_name}
                      </option>
                    ))}
                  </FieldContainer> */}
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

                  {/* <FieldContainer
                    label="Created By"
                    Tag="select"
                    fieldGrid={2}
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {employeeData.map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.user_name}
                      </option>
                    ))}
                  </FieldContainer> */}
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
                  {/* <FieldContainer
                    label="Designed By"
                    Tag="select"
                    fieldGrid={2}
                    value={designed}
                    onChange={(e) => setDesigned(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {designedData.map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.user_name}
                      </option>
                    ))}
                  </FieldContainer> */}
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
                    {/* <div className="form-group">
                      <label className="form-label">Search</label>
                      <input
                        className="form-control"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by brand name"
                      />
                    </div> */}
                    <TextField
                      id="outlined-basic"
                      label="Search"
                      variant="outlined"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by brand name"
                    />
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
                              <span>{detail.data_name}</span>
                            </h5>
                            <div className="summary_cardaction">
                              <Link to={`/data-brand-view/${detail.data_id}`}>
                                <button className="btn btn-warning btn-sm">
                                  View
                                </button>
                              </Link>
                              <Link to={`/data-brand-update/${detail.data_id}`}>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </Link>

                              <DeleteButton
                                endpoint="delete_data_based_data"
                                id={detail.data_name}
                                getData={getData}
                              />
                              {/* <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete"
                                onClick={() => deleteBrand(detail.data_name)}
                              >
                                <i className="bi bi-trash3"></i>
                              </button> */}
                            </div>
                          </div>
                          <div className="summary_cardbody">
                            <div className="d-flex">
                              <div className="documentCard_download">
                                <a href={detail.data_image} target="_bank" download>
                                  <FcDownload />
                                </a>
                              </div>
                            </div>
                            <div className="summary_cardrow flex-column">
                              {/* <div className="summary_box text-center ml-auto mr-auto">
                                {detail.data_type == "jpg" ||
                                detail.data_type == "png" ||
                                detail.data_type == "jpeg" ? (
                                  <img
                                    onClick={() =>
                                      handleImageClick(detail.data_image)
                                    }
                                    src={detail.data_image}
                                    width="100%"
                                    height="100%"
                                  />
                                ) : (
                                  <img
                                    src={imageIcon}
                                    width="80px"
                                    height="80px"
                                  />
                                )}
                              </div> */}
                              <div className="summary_box text-center ml-auto mr-auto">
                                {detail.data_type === "jpg" ||
                                detail.data_type === "png" ||
                                detail.data_type === "jpeg" ? (
                                  // <img
                                  //   onClick={() =>
                                  //     handleFileClick(
                                  //       "image",
                                  //       detail.data_image
                                  //     )
                                  //   }
                                  //   src={detail.data_image}
                                  //   width="100%"
                                  //   height="100%"
                                  // />
                                  // 'sasdf'

                                  // <div
                                  //   id="carouselExampleControls"
                                  //   className="carousel slide"
                                  //   data-ride="carousel"
                                  // >
                                  //   <div className="carousel-inner">
                                  //     {countData
                                  //       .filter(
                                  //         (item) =>
                                  //           item.data_name === detail.data_name
                                  //       )
                                  //       .map((filteredItem, index) => (
                                  //         <div
                                  //           key={index}
                                  //           className={`carousel-item ${
                                  //             index === 0 ? "active" : ""
                                  //           }`}
                                  //         >
                                  //           <img
                                  //             className="d-block w-100"
                                  //             src={filteredItem.data_image}
                                  //             alt={`Slide ${index + 1}`}
                                  //           />
                                  //         </div>
                                  //       ))}
                                  //   </div>

                                  //   <a
                                  //     className="carousel-control-prev"
                                  //     href="#carouselExampleControls"
                                  //     role="button"
                                  //     data-slide="prev"
                                  //   >
                                  //     <span
                                  //       className="carousel-control-prev-icon"
                                  //       aria-hidden="true"
                                  //     ></span>
                                  //     <span className="sr-only">Previous</span>
                                  //   </a>
                                  //   <a
                                  //     className="carousel-control-next"
                                  //     href="#carouselExampleControls"
                                  //     role="button"
                                  //     data-slide="next"
                                  //   >
                                  //     <span
                                  //       className="carousel-control-next-icon"
                                  //       aria-hidden="true"
                                  //     ></span>
                                  //     <span className="sr-only">Next</span>
                                  //   </a>
                                  // </div>

                                  <div
                                    id={`carouselExampleControls_${index}`}
                                    className="carousel slide"
                                    data-ride="carousel"
                                  >
                                    <div className="carousel-inner">
                                      {countData
                                        .filter(
                                          (item) =>
                                            item.data_name === detail.data_name
                                          //  && (item.data_type === "jpg" ||
                                          //   item.data_type === "png" ||
                                          //   item.data_type === "jpeg"
                                          //  )
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
                                              <img
                                                onClick={() =>
                                                  handleFileClick(
                                                    "pdf",
                                                    filteredItem.data_image
                                                  )
                                                }
                                                className="d-block w-100"
                                                src={pdf}
                                                alt={`Slide ${index + 1}`}
                                              />
                                            ) : filteredItem.data_type ===
                                              "mp4" ? (
                                              <img
                                                onClick={() =>
                                                  handleFileClick(
                                                    "video",
                                                    filteredItem.data_image
                                                  )
                                                }
                                                className="d-block w-100"
                                                src={video}
                                                alt={`Slide ${index + 1}`}
                                              />
                                            ) : (
                                              <img
                                                className="d-block w-100"
                                                src={video}
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
                                    src={video}
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
                                    src={video}
                                    width="80px"
                                    height="80px"
                                  />
                                ) : (
                                  <img src={video} width="80px" height="80px" />
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
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
        {/* <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              width: "50%",
              // marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <img
            src={enlargedImageUrl}
            alt="Enlarged Image"
            style={{ maxWidth: "100%", maxHeight: "atuo" }}
          />
        </Modal> */}

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
    </>
  );
};
export default DataBrandOverview;
