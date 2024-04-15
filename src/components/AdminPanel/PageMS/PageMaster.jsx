import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router";
import Select from "react-select";
import "./Tagcss.css";

const PageMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [pageName, setPageName] = useState("");
  const [link, setLink] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [platformData, setPlatformData] = useState([]);
  const [platformId, setPlatformId] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [tag, setTag] = useState([]);
  const [pageLevel, setPageLevel] = useState("");
  const [pageStatus, setPageStatus] = useState("");
  const [userData, setUserData] = useState([]);
  const [closeBy, setCloseBy] = useState("");
  const [pageType, setPageType] = useState("");
  const [content, setContent] = useState("");
  const [ownerType, setOwnerType] = useState("");
  const [vendorData, setVendorData] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [followCount, setFollowCount] = useState("");
  const [profileData, setProfileData] = useState([]);
  const [profileId, setProfileId] = useState("");
  const [platformActive, setPlatformActive] = useState();
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [priceTypeList, setPriceTypeList] = useState([]);
  const [filterPriceTypeList, setFilterPriceTypeList] = useState([]);
  const [priceTypeId, setPriceTypeId] = useState([]);
  const [rateType, setRateType] = useState({ value: "Fixed", label: "Fixed" });
  const [variableType, setVariableType] = useState({
    value: "Per Thousand",
    label: "Per Thousand",
  });
  const [price, setPrice] = useState();

  const handleVariableTypeChange = (selectedOption) => {
    setVariableType(selectedOption);
  };
  const [rowCount, setRowCount] = useState([{ price_type_id: "", price: "" }]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const PageLevels = [
    { value: "Level 1 (High)", label: "Level 1 (High)" },
    { value: "Level 2 (Medium)", label: "Level 2 (Medium)" },
    { value: "Level 3 Level 3 (Low)", label: "Level 3 Level 3 (Low)" },
  ];

  const PageStatus = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const PageTypes = [
    { value: "Clear", label: "Clear" },
    { value: "Shreddy", label: "Shreddy" },
  ];

  const Contents = [
    { value: "Own", label: "Own" },
    { value: "CF", label: "CF" },
  ];

  const getData = () => {
    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformData(res.data.data);
    });

    axios.get(baseUrl + "getPageCatgList").then((res) => {
      setCategoryData(res.data.data);
    });

    axios.get(baseUrl + "get_all_users").then((res) => {
      setUserData(res.data.data);
    });

    axios.get(baseUrl + "vendorAllData").then((res) => {
      setVendorData(res.data.tmsVendorkMastList);
    });

    axios.get(baseUrl + "getProfileList").then((res) => {
      setProfileData(res.data.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  // const handlePriceTypeChange = (selectedOption) => {
  //   console.log(selectedOption, "selectedOption");
  //   setPriceTypeList( //filtering out the selected option from the list
  //     (prev) =>
  //       prev.filter((e) => !(e.value == selectedOption.value))
  //   );
  //   setPriceTypeId(selectedOption);
  // };

  const handleRateTypeChange = (selectedOption) => {
    setRateType(selectedOption);
  };
  useEffect(() => {
    if (platformId) {
      setPriceTypeId([]);
      setPriceTypeList([]);
      let priceData = platformData.find((role) => role._id == platformId)?._id;
      axios.get(baseUrl + `data/${priceData}`).then((res) => {
        setPriceTypeList(res.data.data);
        setFilterPriceTypeList(res.data.data);
      });
    }
  }, [platformId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pageName === "") {
      toastError("Please Fill Page Name");
      return;
    } else if (link === "") {
      toastError("Please Fill Link");
      return;
    } else if (platformId === "") {
      toastError("Please Fill Platform ID");
      return;
    } else if (categoryId === "") {
      toastError("Please Fill Category");
      return;
    } else if (pageLevel === "") {
      toastError("Please Fill Page Level");
      return;
    } else if (pageStatus === "") {
      toastError("Please Fill Page Status");
      return;
    } else if (closeBy === "") {
      toastError("Please Fill Close By");
      return;
    } else if (pageType === "") {
      toastError("Please Fill Page Name Type");
      return;
    } else if (content === "") {
      toastError("Please Fill Content Creation");
      return;
    } else if (ownerType === "") {
      toastError("Please Fill Ownership Type");
      return;
    } else if (vendorId === "") {
      toastError("Please Fill Vendor");
      return;
    } else if (followCount === "") {
      toastError("Please Fill Followers Count");
      return;
    } else if (profileId === "") {
      toastError("Please Fill Profile Type");
      return;
    } else if (platformActive === "") {
      toastError("Please Fill Platform Active On");
      return;
    } else if (rate === "") {
      toastError("Please Fill Engagement Rate");
      return;
    }
    // return console.log(tag, "Tags....");

    const payload = {
      page_user_name: pageName,
      link: link,
      platform_id: platformId,
      page_catg_id: categoryId,
      tag_category: tag.map(e => e.value),
      page_level: pageLevel,
      page_status: pageStatus,
      page_closed_by: closeBy,
      page_name_type: pageType,
      content_creation: content,
      ownership_type: ownerType,
      vendorMast_id: vendorId,
      followers_count: followCount,
      profile_type_id: profileId,
      platform_active_on: platformActive.map((e) => e.value),
      engagment_rate: rate,
      description: description,
      created_by: userID,

      price_cal_type: rateType.value,
      // price_type_id: priceTypeId.map((e) => e.value),
      variable_type: rateType.value == "Variable" ? variableType.value : null,
      // purchase_price: +price,
      purchase_price: rowCount,
    };

    axios
      .post(baseUrl + "addPageMast", payload)
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert("Submitted");
      })
      .catch((error) => {
        toastError(error.response.data.message);
      });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/pms-page-overview" />;
  }

  const addPriceRow = () => {
    setRowCount((rowCount) => [...rowCount, { price_type_id: "", price: "" }]);
  };

  const handlePriceTypeChange = (e, index) => {
    setPriceTypeId(e.value);
    rowCount[index].price_type_id = e.value;
    handleFilterPriceType();
  };

  const handlePriceChange = (e, index) => {
    setPrice(() => e.target.value);
    rowCount[index].price = e.target.value;
  };

  const handleFilterPriceType = () => {
    let filteredData = priceTypeList.filter((row) => {
      // Check if row's price_type_id exists in priceTypeList
      return !rowCount.some((e) => e.price_type_id == row.price_type_id);
    });
    console.log(filteredData, "filteredData");
    setFilterPriceTypeList(filteredData);
  };

  return (
    <>
      <FormContainer
        mainTitle="Page Master"
        title="Page Master"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-6">
          <label className="form-label">
            Platform <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformData.map((option) => ({
              value: option._id,
              label: option.platform_name,
            }))}
            required={true}
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
        <div className="form-group col-6">
          <label className="form-label">
            Profile Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={profileData.map((option) => ({
              value: option._id,
              label: option.profile_type,
            }))}
            required={true}
            value={{
              value: profileId,
              label:
                profileData.find((role) => role._id === profileId)
                  ?.profile_type || "",
            }}
            onChange={(e) => {
              setProfileId(e.value);
            }}
          ></Select>
        </div>
        <div className="form-group col-6">
          <label className="form-label">
            Profile Status <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            name="page status"
            options={PageStatus}
            required={true}
            className="basic-multi-select"
            classNamePrefix="select"
            value={PageStatus.find((option) => option.value == pageStatus)}
            onChange={(selectedOption) => setPageStatus(selectedOption.value)}
          />
        </div>
        <div className="form-group col-6">
          <label className="form-label">
            Category <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={categoryData.map((option) => ({
              value: option._id,
              label: option.page_category,
            }))}
            required={true}
            value={{
              value: categoryId,
              label:
                categoryData.find((role) => role._id === categoryId)
                  ?.page_category || "",
            }}
            onChange={(e) => {
              setCategoryId(e.value);
            }}
          ></Select>
        </div>
        {/* <label className="form-label">Tags</label>
        <div className="tags-input-container">
          {tag.map((tag, index) => (
            <div className="tag-item" key={index}>
              <span className="text">{tag}</span>
              <span className="close" onClick={() => removeTag(index)}>
                &times;
              </span>
            </div>
          ))}
          <input
            onKeyDown={handleKeyDown}
            type="text"
            className="tags-input"
            placeholder="comma separated values"
          />
        </div> */}

        <div className="form-group col-6">
          <label className="form-label">
            Tags <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            isMulti
            options={categoryData.map((option) => ({
              value: option._id,
              label: option.page_category,
            }))}
            required={true}
            value={tag}
            onChange={(e) => setTag(e)}
          ></Select>
        </div>
        <FieldContainer
          label="Page Name *"
          value={pageName}
          required={true}
          onChange={(e) => setPageName(e.target.value)}
        />
        <FieldContainer
          label="Link *"
          value={link}
          required={true}
          onChange={(e) => setLink(e.target.value)}
        />
        <FieldContainer
          label="Followers Count *"
          type="number"
          value={followCount}
          required={true}
          onChange={(e) => setFollowCount(e.target.value)}
        />
        {/* <FieldContainer
          label="Tag"
          value={tag}
          required={false}
          placeholder="Comma separated values"
          onChange={(e) => setTag(e.target.value.split(','))}
        /> */}
        <div className="form-group col-6">
          <label className="form-label">
            Preference level <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            name="page level"
            options={PageLevels}
            required={true}
            className="basic-multi-select"
            classNamePrefix="select"
            value={PageLevels.find((option) => option.value === pageLevel)}
            onChange={(selectedOption) => setPageLevel(selectedOption.value)}
          />
        </div>
        <FieldContainer
          label="Ownership type *"
          value={ownerType}
          required={true}
          onChange={(e) => setOwnerType(e.target.value)}
        />
        <div className="form-group col-6">
          <label className="form-label">
            Close by <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={userData.map((option) => ({
              value: option.user_id,
              label: option.user_name,
            }))}
            required={true}
            value={{
              value: closeBy,
              label:
                userData.find((role) => role.user_id === closeBy)?.user_name ||
                "",
            }}
            onChange={(e) => {
              setCloseBy(e.value);
            }}
          ></Select>
        </div>
        <div className="form-group col-6">
          <label className="form-label">
            Content Creation <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            name="Content creation"
            options={Contents}
            required={true}
            className="basic-multi-select"
            classNamePrefix="select"
            value={Contents.find((option) => option.value == content)}
            onChange={(selectedOption) => setContent(selectedOption.value)}
          />
        </div>
        {/* <FieldContainer
          label="Platform active on *"
          value={platformActive}
          required={true}
          onChange={(e) => setPlatformActive(e.target.value)}
        /> */}

        {/* <div className="form-group col-6">
          <label className="form-label">
            Platform Active On <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformData.map((option) => ({
              value: option._id,
              label: option.platform_name,
            }))}
            isMulti
            // value={{
            //   value: platformActive,
            //   label:
            //     platformData.find((role) => role._id === platformId)
            //       ?.platform_name || "",
            // }}
            value={platformData.filter((e) => platformActive.includes(e._id)) || {}}
            // onChange={(e) => {
            //   setPlatformActive(e.value);
            // }}

            onChange={(e) => {
              setPlatformActive(e.map((e) => e._id));
            }}

          ></Select>
        </div> */}

        <div className="form-group col-6">
          <label className="form-label">
            Platform Active On <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            required={true}
            options={platformData.map((option) => ({
              value: option._id,
              label: option.platform_name,
            }))}
            isMulti
            value={platformActive}
            onChange={(e) => {
              setPlatformActive(e);
            }}
          ></Select>
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Page Name Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            name="page name type"
            options={PageTypes}
            required={true}
            className="basic-multi-select"
            classNamePrefix="select"
            value={PageTypes.find((option) => option.value == pageType)}
            onChange={(selectedOption) => setPageType(selectedOption.value)}
          />
        </div>
        <div className="form-group col-6">
          <label className="form-label">
            Vendor <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={vendorData.map((option) => ({
              value: option.vendorMast_id,
              label: option.vendorMast_name,
            }))}
            required={true}
            value={{
              value: vendorId,
              label:
                vendorData.find((role) => role.vendorMast_id === vendorId)
                  ?.vendorMast_name || "",
            }}
            onChange={(e) => {
              setVendorId(e.value);
            }}
          ></Select>
        </div>
        <FieldContainer
          label="Engagement Rate *"
          type="number"
          value={rate}
          required={true}
          onChange={(e) => setRate(e.target.value)}
        />
        <FieldContainer
          label="Description"
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>Purchase Price</div>
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
        {/* <div className="form-group col-6 row">
          <label className="form-label">
            Price Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={priceTypeList.map((option) => ({
              value: option.price_type_id,
              label: option.PMS_Platforms_data.price_type,
            }))}
            required={true}
            value={{
              value: priceTypeId,
              label:
                priceTypeList.find((role) => role.price_type_id === priceTypeId)
                  ?.PMS_Platforms_data.price_type || "",
            }}
            onChange={handlePriceTypeChange}
          />
        </div> */}

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

        <div className="col-12 row">
          {rowCount.map((row, index) => (
            <>
              {" "}
              <div className="form-group col-5 row">
                <label className="form-label">
                  Price Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={filterPriceTypeList.map((option) => ({
                    value: option.price_type_id,
                    label: option.price_type,
                  }))}
                  required={true}
                  value={{
                    label: priceTypeList.find(
                      (role) =>
                        role.price_type_id === rowCount[index].price_type_id
                    )?.price_type,
                    value: rowCount[index].price_type_id,
                  }}
                  onChange={(e) => handlePriceTypeChange(e, index)}
                />
              </div>
              <FieldContainer
                label=" Price *"
                required={true}
                type="number"
                onChange={(e) => handlePriceChange(e, index)}
                value={rowCount[index].price}
              />
              {index != 0 && (
                <button
                  className="btn btn-sm btn-danger mt-4 ml-2  col-1 mb-3"
                  type="button"
                  onClick={() => {
                    setRowCount(
                      (prev) => prev.filter((e, i) => i !== index),
                      handleFilterPriceType()
                    );
                  }}
                >
                  Remove
                </button>
              )}
            </>
          ))}
          <div className="text-center">
            <button
              type="button"
              onClick={addPriceRow}
              className="btn btn-sm btn-primary"
            >
              Add Price
            </button>
          </div>
        </div>
      </FormContainer>
    </>
  );
};

export default PageMaster;
