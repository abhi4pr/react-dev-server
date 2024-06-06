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
import { IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalType,
  setOpenShowAddModal,
  setOpenShowPageInfoModal,
} from "../../Store/PageMaster";
import PageAddMasterModal from "./PageAddMasterModal";
import {
  useGetAllPageCategoryQuery,
  useGetAllProfileListQuery,
} from "../../Store/PageBaseURL";
import PageInfoModal from "./PageInfoModal";
import {
  handleChangeVendorInfoModal,
  setShowAddVendorModal,
  setModalType as setVendorModalType,
} from "../../Store/VendorMaster";
import VendorTypeInfoModal from "./VendorTypeInfoModal";
import AddVendorModal from "./AddVendorModal";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";

const PageMaster = () => {
  const vendorInfoModalOpen = useSelector(
    (state) => state.vendorMaster.showVendorInfoModal
  );
  const pageInfoModlaOpen = useSelector(
    (state) => state.pageMaster.showInfoModal
  );
  const { toastAlert, toastError } = useGlobalContext();
  const [pageName, setPageName] = useState("");
  const [link, setLink] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [platformId, setPlatformId] = useState("");

  const [primary, setPrimary] = useState({ value: "No", label: "No" });

  const [categoryId, setCategoryId] = useState("");
  const [tag, setTag] = useState([]);
  const [pageLevel, setPageLevel] = useState("");
  const [pageStatus, setPageStatus] = useState("");
  const [userData, setUserData] = useState([]);
  const [closeBy, setCloseBy] = useState("");
  const [pageType, setPageType] = useState("");
  const [content, setContent] = useState("");
  const [ownerType, setOwnerType] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [followCount, setFollowCount] = useState("");
  const [profileId, setProfileId] = useState("");
  const [platformActive, setPlatformActive] = useState();
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [priceTypeList, setPriceTypeList] = useState([]);
  const [filterPriceTypeList, setFilterPriceTypeList] = useState([]);
  const [rateType, setRateType] = useState({ value: "Fixed", label: "Fixed" });
  const [variableType, setVariableType] = useState({
    value: "Per Thousand",
    label: "Per Thousand",
  });
  const [validateFields, setValidateFields] = useState({
    pageName: false,
    link: false,
    platformId: false,
    categoryId: false,
    pageLevel: false,
    pageStatus: false,
    closeBy: false,
    pageType: false,
    content: false,
    ownerType: false,
    vendorId: false,
    followCount: false,
    profileId: false,
    platformActive: false,
    rate: false,
    description: false,
    rateType: false,
    variableType: false,
    tag: false,
    primary: false,
  });

  const handleVariableTypeChange = (selectedOption) => {
    setVariableType(selectedOption);
  };
  const [rowCount, setRowCount] = useState([
    { page_price_type_id: "", price: "" },
  ]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const dispatch = useDispatch();

  const { data: profileData } = useGetAllProfileListQuery();

  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data || [];

  const { data: category } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];

  const { data: vendor } = useGetAllVendorQuery();

  const vendorData = vendor?.data || [];

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

  const handleAddProfileTypeClick = () => {
    dispatch(setOpenShowAddModal());
    dispatch(setModalType("Profile Type"));
  };

  const handleProfileTypeInfoClick = () => {
    dispatch(setOpenShowPageInfoModal());
    dispatch(setModalType("Profile Type Info"));
  };

  const handleAddPlatformClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setVendorModalType("Platform"));
  };

  const handlePlatformInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setVendorModalType("Platform"));
  };

  const handleOpenPageModal = (type) => {
    return () => {
      dispatch(setOpenShowAddModal());
      dispatch(setModalType(type));
    };
  };

  const handleOpenInfoModal = (type) => {
    return () => {
      dispatch(setOpenShowPageInfoModal());
      dispatch(setModalType(type));
    };
  };

  const getData = () => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUserData(res.data.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRateTypeChange = (selectedOption) => {
    setRateType(selectedOption);
  };

  const handlePrimaryChange = (selectedOption) => {
    setPrimary(selectedOption);
  };
  useEffect(() => {
    if (platformId) {
      setPriceTypeList([]);
      let priceData = platformData.find((role) => role._id == platformId)?._id;
      axios
        .get(baseUrl + `v1/pagePriceTypesForPlatformId/${priceData}`)
        .then((res) => {
          setPriceTypeList(res.data.data);
          setFilterPriceTypeList(res.data.data);
        });
    }
  }, [platformId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pageName === "") {
      setValidateFields((prev) => ({ ...prev, pageName: true }));
    }
    if (link === "") {
      setValidateFields((prev) => ({ ...prev, link: true }));
    }
    if (platformId === "") {
      setValidateFields((prev) => ({ ...prev, platformId: true }));
    }
    if (categoryId === "") {
      setValidateFields((prev) => ({ ...prev, categoryId: true }));
    }
    if (pageLevel === "") {
      setValidateFields((prev) => ({ ...prev, pageLevel: true }));
    }
    if (pageStatus === "") {
      setValidateFields((prev) => ({ ...prev, pageStatus: true }));
    }
    if (closeBy === "") {
      setValidateFields((prev) => ({ ...prev, closeBy: true }));
    }
    if (pageType === "") {
      setValidateFields((prev) => ({ ...prev, pageType: true }));
    }
    if (content === "") {
      setValidateFields((prev) => ({ ...prev, content: true }));
    }
    if (ownerType === "") {
      setValidateFields((prev) => ({ ...prev, ownerType: true }));
    }
    if (vendorId === "") {
      setValidateFields((prev) => ({ ...prev, vendorId: true }));
    }
    if (followCount === "") {
      setValidateFields((prev) => ({ ...prev, followCount: true }));
    }
    if (profileId === "") {
      setValidateFields((prev) => ({ ...prev, profileId: true }));
    }
    console.log(platformActive);
    if (platformActive?.length == 0 || platformActive == null) {
      setValidateFields((prev) => ({ ...prev, platformActive: true }));
    }
    if (rate === "") {
      setValidateFields((prev) => ({ ...prev, rate: true }));
    }
    if (description === "") {
      setValidateFields((prev) => ({ ...prev, description: true }));
    }
    if (rateType === "") {
      setValidateFields((prev) => ({ ...prev, rateType: true }));
    }
    if (tag.length == 0) {
      setValidateFields((prev) => ({ ...prev, tag: true }));
    }

    if (
      pageName === "" ||
      link === "" ||
      platformId === "" ||
      categoryId === "" ||
      pageLevel === "" ||
      pageStatus === "" ||
      closeBy === "" ||
      pageType === "" ||
      content === "" ||
      ownerType === "" ||
      vendorId === "" ||
      followCount === "" ||
      profileId === "" ||
      platformActive?.length == 0 ||
      rate === "" ||
      rateType === "" ||
      tag.length == 0 ||
      (rateType.value == "Variable" && variableType === "") ||
      rowCount.some((e) => e.page_price_type_id == "" || e.price == "")
    ) {
      return toastError("Please Fill All Required Fields");
    }

    const payload = {
      page_name: pageName,
      page_link: link,
      platform_id: platformId,
      page_category_id: categoryId,
      tags_page_category: tag.map((e) => e.value),
      preference_level: pageLevel,
      status: pageStatus == "Active" ? 1 : 0,
      page_closed_by: closeBy,
      page_name_type: pageType,
      content_creation: content,
      ownership_type: ownerType,
      vendor_id: vendorId,
      followers_count: followCount,
      page_profile_type_id: profileId,
      platform_active_on: platformActive.map((e) => e.value),
      engagment_rate: rate,
      description: description,
      created_by: userID,
      rate_type: rateType.value,
      variable_type: rateType.value == "Variable" ? variableType.value : null,
      page_price_multiple: rowCount,
      primary_pages: primary,
    };

    axios
      .post(baseUrl + "v1/pageMaster", payload)
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
    setRowCount((rowCount) => [
      ...rowCount,
      { page_price_type_id: "", price: "" },
    ]);
  };

  const handlePriceTypeChange = (e, index) => {
    const newRowCount = [...rowCount];
    newRowCount[index].page_price_type_id = e.value;
    setRowCount(newRowCount);
  };

  const handlePriceChange = (e, index) => {
    const newRowCount = [...rowCount];
    newRowCount[index].price = e.target.value;
    setRowCount(newRowCount);
  };

  const handleFilterPriceType = () => {
    let filteredData = priceTypeList.filter((row) => {
      // Check if row's page_price_type_id exists in priceTypeList
      return !rowCount.some(
        (e) => e.page_price_type_id == row.page_price_type_id
      );
    });
    setFilterPriceTypeList(filteredData);
  };

  return (
    <>
      <FormContainer
        mainTitle="Page Master"
        link={true}
        // handleSubmit={handleSubmit}
        submitButton={false}
      />
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Page Master</h5>
        </div>
        <div className="card-body pb4">
          <div className="row thm_form">
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Platform <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <Select
                    className="w-100"
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
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          platformId: false,
                        }));
                      }
                    }}
                  />
                  <IconButton
                    onClick={handleAddPlatformClick}
                    variant="contained"
                    color="primary"
                    aria-label="Add Platform.."
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handlePlatformInfoClick}
                    variant="contained"
                    color="primary"
                    aria-label="Platform Info.."
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
                {validateFields.platformId && (
                  <small style={{ color: "red" }}>Please select Platform</small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Profile Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <Select
                    className="w-100"
                    options={profileData?.data.map((option) => ({
                      value: option._id,
                      label: option.profile_type,
                    }))}
                    required={true}
                    value={{
                      value: profileId,
                      label:
                        profileData?.data.find((role) => role._id === profileId)
                          ?.profile_type || "",
                    }}
                    onChange={(e) => {
                      setProfileId(e.value);
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          profileId: false,
                        }));
                      }
                    }}
                  />
                  <IconButton
                    onClick={handleAddProfileTypeClick}
                    variant="contained"
                    color="primary"
                    aria-label="Add Profile Type.."
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleProfileTypeInfoClick}
                    variant="contained"
                    color="primary"
                    aria-label="Profile Type Info.."
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
                {validateFields.profileId && (
                  <small style={{ color: "red" }}>
                    Please select Profile Type
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Profile Status <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  name="page status"
                  options={PageStatus}
                  required={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={PageStatus.find(
                    (option) => option.value == pageStatus
                  )}
                  onChange={(selectedOption) => {
                    setPageStatus(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        pageStatus: false,
                      }));
                    }
                  }}
                />
                {validateFields.pageStatus && (
                  <small style={{ color: "red" }}>
                    Please select Profile Status
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Category <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <Select
                    className="w-100"
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
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          categoryId: false,
                        }));
                      }
                    }}
                  />
                  <IconButton
                    onClick={handleOpenPageModal("Category")}
                    variant="contained"
                    color="primary"
                    aria-label="Add Platform.."
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleOpenInfoModal("Category Info")}
                    variant="contained"
                    color="primary"
                    aria-label="Platform Info.."
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
                {validateFields.categoryId && (
                  <small style={{ color: "red" }}>Please select Category</small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
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
                  onChange={(e) => {
                    setTag(e);
                    if (e) {
                      setValidateFields((prev) => ({ ...prev, tag: false }));
                    }
                  }}
                ></Select>
                {validateFields.tag && (
                  <small style={{ color: "red" }}>Please select Tags</small>
                )}
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Page Name"
                fieldGrid={12}
                astric={true}
                value={pageName}
                required={true}
                onChange={(e) => {
                  setPageName(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({ ...prev, pageName: false }));
                  }
                }}
              />
              {validateFields.pageName && (
                <small style={{ color: "red" }}>Please Fill Page Name</small>
              )}
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                fieldGrid={12}
                label="Link"
                astric={true}
                value={link}
                required={true}
                onChange={(e) => {
                  setLink(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({ ...prev, link: false }));
                  }
                }}
              />
              {validateFields.link && (
                <small style={{ color: "red" }}>Please Fill Link</small>
              )}
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Followers Count"
                fieldGrid={12}
                astric={true}
                type="number"
                value={followCount}
                required={true}
                onChange={(e) => {
                  setFollowCount(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({
                      ...prev,
                      followCount: false,
                    }));
                  }
                }}
              />
              {validateFields.followCount && (
                <small style={{ color: "red" }}>
                  Please Fill Followers Count
                </small>
              )}
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Preference level <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  name="page level"
                  options={PageLevels}
                  required={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={PageLevels.find(
                    (option) => option.value === pageLevel
                  )}
                  onChange={(selectedOption) => {
                    setPageLevel(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        pageLevel: false,
                      }));
                    }
                  }}
                />
                {validateFields.pageLevel && (
                  <small style={{ color: "red" }}>
                    Please select Preference Level
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Ownership type"
                astric={true}
                fieldGrid={12}
                value={ownerType}
                required={true}
                onChange={(e) => {
                  setOwnerType(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({
                      ...prev,
                      ownerType: false,
                    }));
                  }
                }}
              />
              {validateFields.ownerType && (
                <small style={{ color: "red" }}>
                  Please Fill Ownership Type
                </small>
              )}
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Primary <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={["No", "Yes"].map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  required={true}
                  value={{
                    value: primary.value,
                    label: primary.label,
                  }}
                  onChange={handlePrimaryChange}
                />
                {validateFields.primary && (
                  <small style={{ color: "red" }}>
                    Please Fill Primary Type
                  </small>
                )}
              </div>
            </div>
            {/* <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Primary"
                astric={true}
                fieldGrid={12}
                value={primary}
                required={true}
                onChange={(e) => {
                  setPrimary(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({
                      ...prev,
                      primary: false,
                    }));
                  }
                }}
              />
              {validateFields.primary && (
                <small style={{ color: "red" }}>Please Fill Primary Type</small>
              )}
            </div> */}
            <div className="col-md-6 mb16">
              <div className="form-group m0">
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
                      userData.find((role) => role.user_id === closeBy)
                        ?.user_name || "",
                  }}
                  onChange={(e) => {
                    setCloseBy(e.value);
                    if (e.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        closeBy: false,
                      }));
                    }
                  }}
                ></Select>
                {validateFields.closeBy && (
                  <small style={{ color: "red" }}>Please select Close By</small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
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
                  onChange={(selectedOption) => {
                    setContent(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        content: false,
                      }));
                    }
                  }}
                />
                {validateFields.content && (
                  <small style={{ color: "red" }}>
                    Please select Content Creation
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
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
                    console.log(e);
                    if (e) {
                      setValidateFields((prev) => ({
                        ...prev,
                        platformActive: false,
                      }));
                    }
                  }}
                ></Select>
                {validateFields.platformActive && (
                  <small style={{ color: "red" }}>
                    Please select Platform Active On
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
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
                  onChange={(selectedOption) => {
                    setPageType(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        pageType: false,
                      }));
                    }
                  }}
                />
                {
                  validateFields.pageType && (
                    <small style={{ color: "red" }}>
                      Please select Page Name Type
                    </small>
                  ) // Page Name Type
                }
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Vendor <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={vendorData.map((option) => ({
                    value: option._id,
                    label: option.vendor_name,
                  }))}
                  required={true}
                  value={{
                    value: vendorId,
                    label:
                      vendorData.find((role) => role._id === vendorId)
                        ?.vendor_name || "",
                  }}
                  onChange={(e) => {
                    setVendorId(e.value);
                    if (e.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        vendorId: false,
                      }));
                    }
                  }}
                ></Select>
                {validateFields.vendorId && (
                  <small style={{ color: "red" }}>Please select Vendor</small>
                )}
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Engagement Rate"
                astric={true}
                type="number"
                fieldGrid={12}
                value={rate}
                required={true}
                onChange={(e) => {
                  setRate(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({ ...prev, rate: false }));
                  }
                }}
              />
              {validateFields.rate && (
                <small style={{ color: "red" }}>
                  Please Fill Engagement Rate
                </small>
              )}
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Description"
                fieldGrid={12}
                value={description}
                required={false}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
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
                    if (e.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        platformId: false,
                      }));
                    }
                  }}
                ></Select>
                {
                  validateFields.platformId && (
                    <small style={{ color: "red" }}>
                      Please select Platform
                    </small>
                  ) // Platform ID
                }
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
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
            </div>
            <div className="col-md-6 mb16">
              {rateType.label == "Variable" && (
                <div className="form-group m0">
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
            </div>
          </div>
          <div className="row thm_form pagePriceRow">
            {rowCount.map((row, index) => (
              <>
                <div className="col-md-6">
                  <div className="form-group m0">
                    <label className="form-label">
                      Price Type <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <div className="input-group inputAddGroup">
                      <Select
                        className="w-100"
                        options={filterPriceTypeList.map((option) => ({
                          value: option._id,
                          label: option.name,
                        }))}
                        required={true}
                        value={{
                          label: priceTypeList.find(
                            (role) =>
                              role._id === rowCount[index].page_price_type_id
                          )?.name,
                          value: rowCount[index].page_price_type_id,
                        }}
                        onChange={(e) => handlePriceTypeChange(e, index)}
                      />
                      <IconButton
                        onClick={handleOpenPageModal("Price Type")}
                        variant="contained"
                        color="primary"
                        aria-label="Add Price Type.."
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleOpenInfoModal("Price Type Info")}
                        variant="contained"
                        color="primary"
                        aria-label="Price Type Info.."
                      >
                        <InfoIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <div className="col p0">
                  <FieldContainer
                    label="Price"
                    fieldGrid={12}
                    astric={true}
                    required={true}
                    type="number"
                    onChange={(e) => handlePriceChange(e, index)}
                    value={rowCount[index].price}
                  />
                </div>
                <div className="col-md-1 text-center">
                  {index != 0 && (
                    <button
                      title="Remove"
                      className="btn tableIconBtn btn-outline-danger"
                      type="button"
                      onClick={() => {
                        setRowCount(
                          (prev) => prev.filter((e, i) => i !== index),
                          handleFilterPriceType()
                        );
                      }}
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
              </>
            ))}
            <button
              title="Add Price"
              type="button"
              onClick={addPriceRow}
              className="btn tableIconBtn btn-outline-primary w-auto"
            >
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
          <div className="row thm_form">
            <div className="col-md-6 mb16"></div>
            <div className="col-md-6 mb16"></div>
          </div>
        </div>
        <div className="card-footer">
          <Stack direction="row" spacing={2}>
            <button
              className="btn cmnbtn btn-primary"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </Stack>
        </div>
      </div>
      <PageAddMasterModal />
      <PageInfoModal />
      {vendorInfoModalOpen && <VendorTypeInfoModal />}
      <AddVendorModal />
    </>
  );
};

export default PageMaster;
