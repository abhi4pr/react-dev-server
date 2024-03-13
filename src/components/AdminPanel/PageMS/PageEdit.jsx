import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate, useParams } from "react-router";
import Select from "react-select";
import './Tagcss.css';

const PageEdit = () => {
  const { toastAlert } = useGlobalContext();
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
  const [userData, setUserData] = useState([])
  const [closeBy, setCloseBy] = useState("")
  const [pageType, setPageType] = useState("");
  const [content, setContent] = useState("");
  const [ownerType, setOwnerType] = useState("")
  const [vendorData, setVendorData] = useState([])
  const [vendorId, setVendorId] = useState("")
  const [followCount, setFollowCount] = useState("")
  const [profileData, setProfileData] = useState([])
  const [profileId, setProfileId] = useState("")
  const [platformActive, setPlatformActive] = useState("");
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const { pageMast_id } = useParams();

  const PageLevels =  [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" }
  ];

  const PageStatus =  [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" }
  ];

  const PageTypes =  [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" }
  ];
  
  const Contents =  [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" }
  ];

  const getData = () => {
    axios.get(baseUrl + `getPageDetail/${pageMast_id}`).then((res) => {
      const data= res.data.data;
      // platform_price_id: platformPriceId,
      // pageMast_id: pageMastId,
      // vendorMast_id: vendorId,
      // price_type_id: priceTypeId,
      // price_cal_type: pricecalType,
      // variable_type: variableType,
      // price_fixed: priceFixed,
      // price_variable: priceVariable,
      // description: description,
  
      setPlatformId(data[0].platform_id);
      setPageName(data[0].page_user_name);
      console.log(data[0].page_user_name, "page_user_name")
      setLink(data[0].link);
      setCategoryId(data[0].page_catg_id);
      setTag(data.tag_category);
      setPageLevel(data[0].page_level);
      setPageStatus(data[0].page_status);
      setCloseBy(data[0].page_closed_by);
      setPageType(data[0].page_name_type);
      setContent(data[0].content_creation);
      setOwnerType(data[0].ownership_type);
      setVendorId(data[0].vendorMast_id);
      setFollowCount(data[0].followers_count);
      setProfileId(data[0].profile_type_id);
      setPlatformActive(data[0].platform_active_on);
      setRate(data[0].engagment_rate);
      setDescription(data[0].description);



    });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
        page_user_name: pageName,
        link: link,
        platform_id: platformId,
        page_catg_id: categoryId,
        tag_category: tag,
        page_level: pageLevel,
        page_status: pageStatus,
        page_closed_by: closeBy,
        page_name_type: pageType,
        content_creation: content,
        ownership_type: ownerType,
        vendorMast_id: vendorId,
        followers_count: followCount,
        profile_type_id: profileId,
        platform_active_on: platformActive,
        engagment_rate: rate,
        description: description,
        updated_by: userID,
    }   

    axios.put(baseUrl + `updatePage/${pageMast_id}`, payload).then(() => {
      setIsFormSubmitted(true);
      toastAlert("Submitted");
    });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/pms-page-overview" />;
  }

  function handleKeyDown(e){
    if (e.key === ',' && e.target.value.trim()) {
      e.preventDefault();
      setTag([...tag, e.target.value.trim()]);
      e.target.value = '';
    }
    console.log('ffffffffff',tag)
  }

  function removeTag(index){
      setTag(tag.filter((el, i) => i !== index))
  }

  return (
    <>
      <FormContainer
        mainTitle="Page Edit"
        title="Page Edit"
        handleSubmit={handleSubmit}
      >
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
                platformData.find((role) => role._id === platformId)?.platform_name || "",
            }}
            onChange={(e) => {
              setPlatformId(e.value);
            }}
          ></Select>
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

        {/* <FieldContainer
          label="Tag"
          value={tag}
          required={false}
          placeholder="Comma separated values"
          onChange={(e) => setTag(e.target.value.split(','))}
        /> */}

        <label className="form-label">
          Tags
        </label>
        <div className="tags-input-container">
            { tag?.map((tag, index) => (
              <div className="tag-item" key={index}>
                    <span className="text">{tag}</span>
                    <span className="close" onClick={() => removeTag(index)}>&times;</span>
                </div>
            )) }
            <input onKeyDown={handleKeyDown} type="text" className="tags-input" placeholder="comma separated values" />
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Page Level <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            name="page level"
            options={PageLevels}
            className="basic-multi-select"
            classNamePrefix="select"
            value={PageLevels.find(option => option.value === pageLevel)}
            onChange={(selectedOption) => setPageLevel(selectedOption.value)}
          />
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Page Status <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            name="page status"
            options={PageStatus}
            className="basic-multi-select"
            classNamePrefix="select"
            value={PageStatus.find(option => option.value == pageStatus)}
            onChange={(selectedOption)=> setPageStatus(selectedOption.value)}
          />
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Close by <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={userData.map((option) => ({
              value: option.user_id,
              label: option.user_name,
            }))}
            value={{
              value: closeBy,
              label:
                userData.find((role) => role.user_id === closeBy)
                  ?.user_name || "",
            }}
            onChange={(e) => {
              setCloseBy(e.value);
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
            className="basic-multi-select"
            classNamePrefix="select"
            value={PageTypes.find(option=>option.value == pageType)}
            onChange={(selectedOption)=> setPageType(selectedOption.value)}
          />
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Content Creation <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            name="Content creation"
            options={Contents}
            className="basic-multi-select"
            classNamePrefix="select"
            value={Contents.find(option => option.value == content)}
            onChange={(selectedOption)=> setContent(selectedOption.value)}
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
            Vendor <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={vendorData.map((option) => ({
              value: option.vendorMast_id,
              label: option.vendorMast_name,
            }))}
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
          label="Followers Count *"
          type="number"
          value={followCount}
          required={true}
          onChange={(e) => setFollowCount(e.target.value)}
        />

        <div className="form-group col-6">
          <label className="form-label">
            Profile Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={profileData.map((option) => ({
              value: option._id,
              label: option.profile_type,
            }))}
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

        <FieldContainer
          label="Platform active on *"
          value={platformActive}
          required={true}
          onChange={(e) => setPlatformActive(e.target.value)}
        />

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

      </FormContainer>
    </>
  );
};

export default PageEdit;