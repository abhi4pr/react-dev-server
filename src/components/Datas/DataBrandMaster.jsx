import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import pdf from "./pdf-file.png";
import sheets from "./sheets.png";
import video from "./montage.png";
import Select from "react-select";
import ImgDialogBox from "./ImgDialogBox";
import { Add, CloseTwoTone } from "@mui/icons-material";
import {baseUrl} from '../../utils/config'

const DataBrandMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [subCatData, setSubCategoryData] = useState([]);
  const [fileDetails, setFileDetails] = useState([]);
  const [brand, setBrand] = useState("");
  const [logo, setLogo] = useState([]);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [remark, setRemark] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [images, setImages] = useState([]);
  const [details, setDetails] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [platform, setPlateform] = useState("");
  const [platformData, setPlateformData] = useState([]);
  const [contentType, setContentType] = useState("");
  const [contentTypeData, setContentTypeData] = useState([]);
  const [dataBrand, setDataBrand] = useState("");
  const [dataBrandData, setDataBrandData] = useState([]);
  // const [dataSubCategory, setDataSubCategory] = useState([]);
  const [dataSubCategory, setDataSubCategory] = useState([]);
  const [dataSubCategoryData, setDataSubCategoryData] = useState([]);
  const [designedBy, setDesignedBy] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openReviewDisalog, setOpenReviewDisalog] = useState({
    open: false,
    image: "",
    detail: {},
  });
  const [files, setFiles] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    axios.get(baseUrl+"get_all_users").then((res) => {
      const allUsers = res.data.data;
      const filteredUsers = allUsers.filter((user) => user.dept_id == 49);
      setEmployeeData(filteredUsers);
    });

    axios
      .get(baseUrl+"get_all_data_platforms")
      .then((res) => {
        setPlateformData(res.data);
      });
    axios
      .get(baseUrl+"get_all_data_content_types")
      .then((res) => {
        setContentTypeData(res.data);
      });
    axios
      .get(baseUrl+"get_all_data_brands")
      .then((res) => {
        setDataBrandData(res.data);
      });
  }, []);

  useEffect(() => {
    if (category) {
      axios
        .get(
          `${baseUrl}`+`get_single_data_from_sub_category/${category}`
        )
        .then((res) => {
          setDataSubCategoryData(res.data);
        });
    }
  }, [category]);

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_data_categorys")
      .then((res) => setCategoryData(res.data.simcWithSubCategoryCount));

    const today = new Date();
    const formattedDate = formatDate(today);
    setCurrentDate(formattedDate);
  }, []);

  const handleCategoryChange = (event, index) => {
    const { value } = event.target;
    setSelectedCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index] = value;
      return updatedCategories;
    });
  };

  useEffect(() => {
    console.log(details);
  }, [details]);

  const handleSubmit = async (e) => {
    if (category == "") {
      toastError("Category is required");
    } else if (dataSubCategory == "") {
      toastError("Sub category is required");
    } else if (platform == "") {
      toastError("Platform is required");
    } else if (contentType == "") {
      toastError("Content type is required");
    } else if (dataBrand == "") {
      toastError("Brand is required");
    } else if (designedBy == "") {
      toastError("Designer is required");
    }
    e.preventDefault();
    try {
      if (
        category &&
        platform &&
        contentType &&
        dataBrand &&
        brand &&
        dataSubCategory &&
        designedBy
      ) {
        setIsLoading(true);
      }
      for (let i = 0; i < details.length; i++) {
        console.log(dataSubCategory);
        const formData = new FormData();
        formData.append("data_name", brand);
        formData.append("cat_id", category);
        // formData.append("sub_cat_id", dataSubCategory.map(e=>e));
        formData.append("sub_cat_id", dataSubCategory);
        formData.append("platform_id", platform);
        formData.append("brand_id", dataBrand);
        formData.append("content_type_id", contentType);
        formData.append("data_upload", details[i].file);
        formData.append("data_type", details[i].fileType);
        // formData.append("size", details[i].size);
        formData.append("size_in_mb", details[i].sizeInMB);
        formData.append("remark", remark);
        formData.append("created_by", userID);
        formData.append("designed_by", designedBy);

        await axios.post(baseUrl+"add_data", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setIsFormSubmitted(true);
      toastAlert("Data uploaded");
      setBrand("");
      setLogo("");
      setImage("");
      setSize("");
      setRemark("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading state to false after API call completes
    }
  };

  const delteRowData = (index) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  const handleFileChange = (event) => {
    setFileDetails((prev) => [...prev, event.target.files]);
    const files = Array.from(event.target.files);
    setImages(files);

    const details = files.map((file) => {
      const { name, size } = file;
      const sizeInMB = (size / (1024 * 1024)).toFixed(2);
      const fileType = name.split(".").pop().toLowerCase();

      if (
        fileType === "jpg" ||
        fileType === "jpeg" ||
        fileType === "png" ||
        fileType === "gif"
      ) {
        // It's an image
        const img = new Image();
        img.src = URL.createObjectURL(file);
        return new Promise((resolve) => {
          img.onload = () => {
            const { naturalHeight, naturalWidth } = img;
            resolve({
              name,
              file,
              fileType,
              size: `${naturalHeight}x${naturalWidth}`,
              sizeInMB: `${sizeInMB}`,
            });
          };
        });
      } else {
        // For other file types like PDF, video, Excel
        return Promise.resolve({
          name,
          file,
          fileType,
          size: "N/A", // Size is not applicable in the same way as for images
          sizeInMB: `${sizeInMB}`,
        });
      }
    });

    Promise.all(details).then((detailsArray) => {
      setDetails(detailsArray);
    });
  };

  if (isFormSubmitted) {
    return <Navigate to="/data-brand-overview" />;
  }

  const renderFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <img src={pdf} alt="PDF" style={{ width: "32%" }} />;
      case "mp4":
        return <img src={video} alt="PDF" style={{ width: "32%" }} />;
      case "xls":
      case "xlsx":
        return <img src={sheets} alt="Excel" style={{ width: "32%" }} />;
      default:
        return <i className="fa fa-file"></i>;
    }
  };

  return (
    <div style={{ width: "80%", margin: "0 0 0 10%" }}>
      <UserNav />
      <FormContainer
        mainTitle="Data"
        title="Data"
        handleSubmit={handleSubmit}
        submitButton={false}
      >
        <FieldContainer
          label="Name *"
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required={true}
        />

        <FieldContainer
          label="Upload Data *"
          type="file"
          multiple
          accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*"
          onChange={handleFileChange}
          fieldGrid={6}
          required={true}
        />

        <div className="form-group col-3">
          <label className="form-label">
            Category Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={categoryData.map((opt) => ({
              value: opt._id,
              label: opt.category_name,
            }))}
            value={{
              value: category,
              label:
                categoryData.find((user) => user._id === category)
                  ?.category_name || "",
            }}
            onChange={(e) => {
              setCategory(e.value);
            }}
            required
          />
        </div>
        <div className="col-1 mt-4">
          <Link
            title="Add Category"
            className="btn btn-sm btn-primary"
            to="/data-brand-category"
          >
            <Add />
          </Link>
        </div>
        <div className="form-group col-3">
          <label className="form-label">
            Sub Category Name <sup style={{ color: "red" }}>*</sup>
          </label>
          {/* <Select
    options={dataSubCategoryData.map((opt) => ({
        value: opt._id,
        label: opt.data_sub_cat_name,
    }))}
    isMulti={true}
    value={
        dataSubCategoryData
            .filter(opt => dataSubCategory.includes(opt._id))
            .map(opt => ({ value: opt._id, label: opt.data_sub_cat_name }))
    }
    onChange={(selectedOptions) => {
        setDataSubCategory(selectedOptions.map(opt => opt.value));
    }}
    required
/> */}

<Select
            options={dataSubCategoryData.map((opt) => ({
              value: opt._id,
              label: opt.data_sub_cat_name,
            }))}
            value={{
              value: dataSubCategory,
              label:
                dataSubCategoryData.find((user) => user._id === dataSubCategory)
                  ?.data_sub_cat_name || "",
            }}
            onChange={(e) => {
              setDataSubCategory(e.value);
            }}
            required
          />

        </div>
        <div className="col-1 mt-4">
          <Link
            title="Add Sub Category"
            className="btn btn-sm btn-primary"
            to="/data-brand-sub-category"
          >
            <Add />
          </Link>
        </div>
        <div className="form-group col-3">
          <label className="form-label">
            Platform Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformData.map((opt) => ({
              value: opt._id,
              label: opt.platform_name,
            }))}
            value={{
              value: platform,
              label:
                platformData.find((user) => user._id === platform)
                  ?.platform_name || "",
            }}
            onChange={(e) => {
              setPlateform(e.value);
            }}
            required
          />
        </div>
        <div className="form-group col-3">
          <label className="form-label">
            Content Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={contentTypeData.map((opt) => ({
              value: opt._id,
              label: opt.content_name,
            }))}
            value={{
              value: contentType,
              label:
                contentTypeData.find((user) => user._id === contentType)
                  ?.content_name || "",
            }}
            onChange={(e) => {
              setContentType(e.value);
            }}
            required
          />
        </div>
        <div className="form-group col-3">
          <label className="form-label">
            Brand <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={dataBrandData.map((opt) => ({
              value: opt._id,
              label: opt.brand_name,
            }))}
            value={{
              value: dataBrand,
              label:
                dataBrandData.find((user) => user._id === dataBrand)
                  ?.brand_name || "",
            }}
            onChange={(e) => {
              setDataBrand(e.value);
            }}
            required
          />
        </div>

        <div className="form-group col-3">
          <label className="form-label">
            Designed by <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={employeeData.map((opt) => ({
              value: opt.user_id,
              label: opt.user_name,
            }))}
            value={{
              value: designedBy,
              label:
                employeeData.find((user) => user.user_id === designedBy)
                  ?.user_name || "",
            }}
            onChange={(e) => {
              setDesignedBy(e.value);
            }}
            required
          />
        </div>

        <div className="summary_cards brand_img_list">
          {details.map((detail, index) => (
            <div key={index} className="summary_card brand_img_item">
              <div className="summary_cardrow brand_img_row">
                <div className="col summary_box brand_img_box col140">
                  {detail.fileType === "jpg" ||
                  detail.fileType === "jpeg" ||
                  detail.fileType === "png" ||
                  detail.fileType === "gif" ? (
                    images[index] && (
                      <img
                        onClick={() =>
                          setOpenReviewDisalog({
                            open: true,
                            image: URL.createObjectURL(images[index]),
                            detail: detail,
                          })
                        }
                        className="brandimg_icon"
                        src={URL.createObjectURL(images[index])}
                        alt={`Image ${index + 1}`}
                      />
                    )
                  ) : (
                    <div
                      className="file_icon"
                      onClick={() =>
                        setOpenReviewDisalog({
                          open: true,
                          image: URL.createObjectURL(images[index]),
                          detail: detail,
                        })
                      }
                    >
                      {renderFileIcon(detail.fileType)}
                    </div>
                  )}
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Extension:</span>
                    {detail.fileType}
                  </h4>
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Size:</span>
                    {detail.sizeInMB}
                    {"MB"}
                  </h4>
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Date:</span>
                    {currentDate}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    delteRowData(index);
                  }}
                  className="btn btn-sm btn-dengor me-2"
                >
                  <CloseTwoTone />
                </button>
                {/* <div className="col summary_box brand_img_box">
                  <FieldContainer
                    label={`Data Category`}
                    fieldGrid={12}
                    Tag="select"
                    value={selectedCategories[index] || ""}
                    onChange={(e) => handleCategoryChange(e, index)}
                  >
                    <option value="">Please select</option>
                    {categoryData.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.cat_name}
                      </option>
                    ))}
                  </FieldContainer>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        <FieldContainer
          label="Remark"
          Tag="textarea"
          rows="3"
          value={remark}
          required={false}
          onChange={(e) => setRemark(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
          style={{ width: "20%", marginLeft: "1%" }}
        >
          {isLoading ? "Please wait data uploading..." : "Submit"}
        </button>
      </FormContainer>
      {openReviewDisalog.open && (
        <ImgDialogBox
          openReviewDisalog={openReviewDisalog}
          setOpenReviewDisalog={setOpenReviewDisalog}
        />
      )}{" "}
    </div>
  );
};

export default DataBrandMaster;
