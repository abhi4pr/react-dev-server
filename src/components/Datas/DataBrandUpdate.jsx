import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import { MdCancel } from "react-icons/md";
import pdf from "./pdf-file.png";
import sheets from "./sheets.png";
import video from "./montage.png";
import Select from "react-select";

const DataBrandUpdate = () => {
  const { toastAlert } = useGlobalContext();
  const [brand, setBrand] = useState("");
  const[brandName, setBrandName] = useState("")
  const [logo, setLogo] = useState([]);
  const [logos, setLogos] = useState([]);
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
  const [dataSubCategory, setDataSubCategory] = useState("");
  const [dataSubCategoryData, setDataSubCategoryData] = useState([]);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { id } = useParams();

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    axios
      .get(`http://34.93.221.166:3000/api/get_single_data/${id}`)
      .then((res) => {
        const fetchedData = res.data;
        const { data_name, upload_logo, remark, cat_name } = fetchedData;
        setBrand(data_name);
        setBrandName(data_name);
        // setLogo(upload_logo);
        // setRemark(remark);
        // setCategory(cat_name);
        // setBrandData(fetchedData);
      });
    
      axios
      .get("http://34.93.221.166:3000/api/get_all_data_categorys")
      .then((res) => {
        setCategoryData(res.data.simcWithSubCategoryCount);
      });

    axios
      .get("http://34.93.221.166:3000/api/get_all_data_platforms")
      .then((res) => {
        setPlateformData(res.data);
      });
    // axios
    //   .get("http://34.93.221.166:3000/api/get_all_data_Sub_categories")
    //   .then((res) => {
    //     setDataSubCategoryData(res.data);
    //   });
    axios
      .get("http://34.93.221.166:3000/api/get_all_data_content_types")
      .then((res) => {
        setContentTypeData(res.data);
      });
    axios
      .get("http://34.93.221.166:3000/api/get_all_data_brands")
      .then((res) => {
        setDataBrandData(res.data);
      });

    const today = new Date();
    const formattedDate = formatDate(today);
    setCurrentDate(formattedDate);
  }, [id]);

  useEffect(()=>{
    if(category){
      axios
      .get(`http://34.93.221.166:3000/api/get_single_data_from_sub_category/${category}`)
      .then((res) => {
        setDataSubCategoryData(res.data);
      });
    }
  },[category])

  const handleCategoryChange = (event, index) => {
    const { value } = event.target;
    setSelectedCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index] = value;
      return updatedCategories;
    });
  };

  const getCombinedData = async () => {
    if (brand) {
      axios
        .get(`http://34.93.221.166:3000/api/get_data_based_data_name/${brand}`)
        .then((res) => {
          setLogos(res.data);

          setCategory(res.data[0]?.cat_id)
          setDataSubCategory(res.data[0]?.sub_cat_id)
          setPlateform(res.data[0]?.platform_id)
          setContentType(res.data[0]?.content_type_id)
          setDataBrand(res.data[0]?.brand_id)
          setRemark(res.data[0]?.remark);
        });
    }
  };

  useEffect(() => {
    getCombinedData();
  }, [brand]);

  const removeImage = async (_id) => {
    if (_id == id) {
      setError("You can't delete default data type, try to delete data instead");
    } else {
      var data = await axios.delete(
        `http://34.93.221.166:3000/api/delete_data/${_id}`,
        null
      );
      if (data) {
        getCombinedData();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(`http://34.93.221.166:3000/api/edit_data_new`, {
      _id: id,
      data_name: brandName,
      remark: remark,
      updated_by: loginUserId,
      updated_at: new Date()
    });

    try {
      for (let i = 0; i < details.length; i++) {
        const formData = new FormData();
        formData.append("data_name", brandName);
        formData.append("cat_id", category);
        formData.append("sub_cat_id", dataSubCategory);
        formData.append("platform_id", platform);
        formData.append("brand_id", dataBrand);
        formData.append("content_type_id", contentType);
        formData.append("data_upload", details[i].file);
        formData.append("data_type", details[i].fileType);
        formData.append("size_in_mb", details[i].sizeInMB);
        formData.append("remark", remark);
        formData.append("created_by", loginUserId);

        await axios.post(
          "http://34.93.221.166:3000/api/add_data",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      setIsFormSubmitted(true);
      toastAlert("Data details updated");
      setBrand("");
      setLogo("");
      setImage("");
      setSize("");
      setRemark("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event) => {
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
    <>
      <div>
        <UserNav />
        <div className="section section_padding sec_bg h100vh">
          <div className="container">
            <FormContainer mainTitle="Data" title="Data" handleSubmit={handleSubmit}>
              <FieldContainer
                label="Name *"
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                // onBlur={handleContentBlur}
              />

              <FieldContainer
                label="Upload Data *"
                type="file"
                multiple
                accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*"
                onChange={handleFileChange}
                fieldGrid={6}
                required={false}
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
              <div className="form-group col-3">
                <label className="form-label">
                  Sub Category Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={dataSubCategoryData.map((opt) => ({
                    value: opt._id,
                    label: opt.data_sub_cat_name,
                  }))}
                  value={{
                    value: dataSubCategory,
                    label:
                      dataSubCategoryData.find(
                        (user) => user._id === dataSubCategory
                      )?.data_sub_cat_name || "",
                  }}
                  onChange={(e) => {
                    setDataSubCategory(e.value);
                  }}
                  required
                />
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

              <div className="summary_cards brand_img_list">
                {logos && logos.map((detail) => (
                  <div className="summary_card brand_img_item">
                    <div className="summary_cardrow brand_img_row">
                      <div className="col summary_box brand_img_box">
                        <img
                          className="brandimg_icon"
                          src={detail.data_image}
                        />
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Extension:</span>
                          {detail.data_type}
                        </h4>
                      </div>
                      {/* <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Resolution:</span>
                          {detail.size}
                        </h4>
                      </div> */}
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Size:</span>
                          {detail.size_in_mb}
                          {"MB"}
                        </h4>
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Data Category:</span>
                          {detail.category_name}
                        </h4>
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Date:</span>
                          {detail.created_at.split("T")[0]}
                        </h4>
                      </div>
                      <div className="col brand_img_box ml-auto mr-0 summary_box brand_img_delete">
                        <p>
                          {" "}
                          <MdCancel
                            onClick={() => removeImage(detail._id)}
                            style={{ cursor: "pointer" }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {details.map((detail, index) => (
                  <div className="summary_card brand_img_item">
                    <div className="summary_cardrow brand_img_row">
                    <div className="col summary_box brand_img_box col140">
                  {detail.fileType === "jpg" ||
                  detail.fileType === "jpeg" ||
                  detail.fileType === "png" ||
                  detail.fileType === "gif" ? (
                    <img
                      className="brandimg_icon"
                      src={URL.createObjectURL(images[index])}
                      alt={`Image ${index + 1}`}
                    />
                  ) : (
                    <div className="file_icon">
                      {renderFileIcon(detail.fileType)}
                    </div>
                  )}
                </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Extension:</span>
                          {detail.image_type}
                        </h4>
                      </div>
                      {/* <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Resolution:</span>
                          {detail.size}
                        </h4>
                      </div> */}
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Size:</span>
                          {detail.sizeInMB}
                          {"MB"}
                        </h4>
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Date:</span>
                          {currentDate}
                        </h4>
                      </div>
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

              <p>{error}</p>

              <FieldContainer
                label="Remark"
                Tag="textarea"
                rows="5"
                value={remark}
                required={false}
                onChange={(e) => setRemark(e.target.value)}
              />
            </FormContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataBrandUpdate;
