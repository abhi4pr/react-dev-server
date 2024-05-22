import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import "./onboardcss/onboard_style.css";
import "./onboardcss/onboard_responsive.css";
import "./onboardcss/onboard_animate.min.css";
import profilepic from "../../assets/imgs/user/naruto.png";
import hourGlass from "../../assets/imgs/other/hourglass.gif";
import welcomeImage from "../../assets/imgs/other/welcome.png";
import welcomeText from "../../assets/imgs/other/welcometext.gif";
import Select from "react-select";
import { useGlobalContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import WhatsappAPI from "../WhatsappAPI/WhatsappAPI";
import Tour from "reactour";

import imageTest1 from "../../assets/img/product/Avtrar1.png";
import imageTest2 from "../../assets/img/product/Avtrar2.png";
import imageTest3 from "../../assets/img/product/Avtrar3.png";
import imageTest14 from "../../assets/img/product/Avtrar14.png";
import imageTest5 from "../../assets/img/product/Avtrar5.png";
import imageTest6 from "../../assets/img/product/Avtrar6.png";
import imageTest7 from "../../assets/img/product/Avtrar7.png";
import imageTest8 from "../../assets/img/product/Avtrar8.png";
import imageTest15 from "../../assets/img/product/Avtar15.png";
import imageTest16 from "../../assets/img/product/Avtar16.png";
import imageTest17 from "../../assets/img/product/Avtar17.png";
import imageTest18 from "../../assets/img/product/Avtar18.png";
import imageTest19 from "../../assets/img/product/Avtar19.png";
import imageTest20 from "../../assets/img/product/Avtar20.png";
import imageTest21 from "../../assets/img/product/Avtar21.png";
import imageTest22 from "../../assets/img/product/Avtar22.png";
import imageTest23 from "../../assets/img/product/Avtar23.png";
import imageTest24 from "../../assets/img/product/Avtar24.png";
import imageTest25 from "../../assets/img/product/Avtar25.png";
import imageTest26 from "../../assets/img/product/Avtar26.png";
import imageTest27 from "../../assets/img/product/Avtar27.png";
import imageTest28 from "../../assets/img/product/Avtar28.png";
import imageTest29 from "../../assets/img/product/Avtar29.png";
import imageTest30 from "../../assets/img/product/Avtar30.png";

// import rocketVideoLink from "../../assets/video/Rocket.mp4";
import rocketVideoLink from "../../assets/video/rocketAnimation.gif";
// import rocketAudioLink from "../../assets/video/RocketAudio.mpeg";

import Modal from "react-modal";
import ExtendJoining from "./ExtendJoining";
import IndianStatesMui from "../ReusableComponents/IndianStatesMui";
import LetterTab from "./LetterTab";
import ContactNumber from "../ReusableComponents/ContactNumber";
import DocumentTab from "./DocumentTab";
import FAQTab from "./FAQTab";
import ReadyToOnboardContent from "./ReadyToOnboardContent";
// import { City, State } from "country-state-city";
import IndianCitiesMui from "../ReusableComponents/IndianCitiesMui";
import GuardianFields from "./GuardianFields";
import FamilyFields from "./FamilyFields";
import EducationFields from "./EducationFields";
import CocTabPreonboarding from "./CocTabPreonboarding";
import { baseUrl } from "../../utils/config";
import ImageSelector from "./ImageSelector";
import RocketAnimation from "./RocketAnimation";
import { FormatName } from "../../utils/FormatName";
import Slider from "react-slick";

var settings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const LanguageList = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "Arabic",
  "Bengali",
  "Russian",
  "Urdu",
  "German",
  "Japanese",
  "Telugu",
  "Marathi",
  "Tamil",
  "Italian",
  "Punjabi",
  "Gujarati",
  "Other",
];
const nationalityData = ["Indian", "USA", "Uk"];

const bloodGroupData = [
  "A+ (A Positive)",
  "A- (A Negative)",
  "B+ (B Positive)",
  "B- (B Negative)",
  "AB+ (AB Positive)",
  "AB- (AB Negative)",
  "O+ (O Positive)",
  "O- (O Negative)",
];

const maritialStatusData = ["Single", "Married"]; //,"Divorced","Widowed","Separated"

const genderData = ["Male", "Female", "Other"];

//Guardian
const initialGuardianDetailsGroup = {
  guardian_name: "",
  guardian_contact: "",
  guardian_address: "",
  relation_with_guardian: "",
};

const guardianDisplayFields = [
  "guardian_name",
  "guardian_contact",
  "guardian_address",
  "relation_with_guardian",
];

const guardianFieldLabels = {
  guardian_name: "Guardian Name",
  guardian_contact: "Guardian Contact",
  guardian_address: "Guardian Address",
  relation_with_guardian: " Relation",
};

//Family
const initialFamilyDetailsGroup = {
  name: "",
  // DOB: "",
  contact: "",
  occupation: "",
  // annual_income: "",
  relation: "",
};

const familyDisplayFields = [
  "name",
  // "DOB",
  "contact",
  "occupation",
  "relation",
  // "annual_income",
];

const familyFieldLabels = {
  name: "Full Name",
  // DOB: "Date of Birth",
  contact: "Contact Number",
  occupation: "Occupation",
  // annual_income: "Annual Income",
  relation: "Relationship",
};

//Education
const initialEducationDetailsGroup = {
  title: "",
  institute_name: "",
  from_year: "",
  to_year: "",
  percentage: "",
  stream: "",
  specialization: "",
};

const educationDispalyFields = [
  "title",
  "institute_name",
  "from_year",
  "to_year",
  "percentage",
  "stream",
  "specialization",
];

const educationFieldLabels = {
  title: "Title",
  institute_name: "Institute Name",
  from_year: "From Year",
  to_year: "To Year",
  percentage: "Percentage",
  stream: "Stream",
  specialization: "Specialization",
};

const PreOnboardingUserMaster = () => {
  const [isShowRocket, setIsShowRocket] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const whatsappApi = WhatsappAPI();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserName = decodedToken.name;
  const id = decodedToken.id;
  const { toastAlert, toastError } = useGlobalContext();

  const [activeTab, setActiveTab] = useState(0);
  const [cocData, setCocData] = useState([]);

  const [allUserData, setAllUserData] = useState([]);
  const [username, setUserName] = useState("");

  const [email, setEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");

  const [contact, setContact] = useState("");
  const [personalContact, setPersonalContact] = useState("");

  const [backendSpeakingLanguage, setBackendSpeakingLanguage] = useState("");
  const [speakingLanguage, setSpeakingLanguage] = useState([]);

  const [joiningDate, setJoiningDate] = useState("");
  const [daysLeftToJoining, setDaysLeftToJoining] = useState("");

  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [FatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [hobbiesData, setHobbiesData] = useState([]);
  const [bloodGroup, setBloodGroup] = useState("");

  const [maritialStatus, setMaritialStatus] = useState("");
  const [dateOfMarraige, setDateOfMarraige] = useState("");
  const [spouseName, setSpouseName] = useState("");

  // Documents states
  const [XMarksheet, setXMarksheet] = useState(null);
  const [XMarksheetValidation, setXMarksheetValidation] = useState("Pending");

  const [XIIMarksheet, setXIIMarksheet] = useState(null);
  const [XIIMarksheetValidation, setXIIMarksheetValidation] =
    useState("Pending");

  const [underGraduationDoc, setUnderGraduationDoc] = useState(null);
  const [underGraduationDocValidation, setUnderGraduationDocValidation] =
    useState("Pending");

  const [uid, setUID] = useState(null);
  const [uidValidation, setUIDValidation] = useState("Pending");

  const [panUpload, setPanUpload] = useState(null);
  const [panUploadValidation, setPanUploadValidation] = useState("Pending");

  const [Passport, setPassport] = useState(null);
  const [PassportValidation, setPassportValidation] = useState("Pending");

  const [experienceDoc, setExperienceDoc] = useState(null);
  const [experienceDocValidation, setExperienceDocValidation] =
    useState("Pending");

  const [passbookCheque, setPassbookCheque] = useState(null);
  const [passbookChequeValidation, setPassbookChequeValidation] =
    useState("Pending");

  const [previousOfferLetter, setPreviousOfferLetter] = useState(null);
  const [previousOfferLetterValidation, setPreviousOfferLetterValidation] =
    useState("Pending");

  const [previousRelievingLetter, setPreviousRelievingLetter] = useState(null);
  const [
    previousRelievingLetterValidation,
    setPreviousRelievingLetterValidation,
  ] = useState("Pending");

  //Doucment Status
  const [documentData, setDocumentData] = useState([]);
  const [documentPercentage, setDocumentPercentage] = useState(0);

  //Permanent Address
  const [permanentAddress, setPermanentAddress] = useState("");
  const [permanentCity, setPermanentCity] = useState("");
  const [permanentState, setPermanentState] = useState("");
  const [permanentPincode, setPermanentPincode] = useState("");

  //Current Address
  const [currentAddress, setCurrentAddress] = useState("");
  const [currentCity, setcurrentCity] = useState("");
  const [currentState, setcurrentState] = useState("");
  const [currentPincode, setcurrentPincode] = useState("");

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  //contact
  const [emergencyContact, setEmergencyContact] = useState(null);

  //New Guardian Fields
  const [guardianDetails, setGuardianDetails] = useState([
    initialGuardianDetailsGroup,
  ]);
  const [guardianContactErrors, setGuardianContactErrors] = useState({});

  //Family Fields
  const [familyDetails, setFamilyDetails] = useState([
    initialFamilyDetailsGroup,
  ]);
  const [familyValidationErrors, setFamilyValidationErrors] = useState({});

  //Education Fields
  const [educationDetails, setEducationDetails] = useState([
    initialEducationDetailsGroup,
  ]);

  //coc
  const [acceptCoc, setAcceptCoc] = useState(false);
  const [cocFlag, setCocFlag] = useState(false);

  const [selectedImage, setSelectedImage] = useState();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [nickName, setNickName] = useState("");
  const [getProfile, setGetProfile] = useState("");
  const [getNickName, setGetNickName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readyToOnboardModal, setReadyToOnboard] = useState(false);
  const [designation, setDesignation] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  const [showMandotaryPer, setShowMandotaryPer] = useState(0);
  const [showNonMandotaryPer, setShowNonMandotaryPer] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFullNameChange = (event) => {
    // Extract the value from the event object
    let userName = event.target.value;

    // Remove extra white spaces and trim the userName
    // userName = userName.replace(/\s{2,}/g, ' ').trim();

    // Define a regular expression to match only letters
    const lettersOnly = /^[A-Za-z]+$/;

    // Split the userName into parts, correct each part, and join them back together
    const correctedNameParts = userName.split(" ").map((part) => {
      // Remove numbers and special characters from each part
      let filteredPart = part
        .split("")
        .filter((char) => char.match(lettersOnly))
        .join("");

      // Ensure the first letter is uppercase and the rest of the part is lowercase
      return (
        filteredPart.charAt(0).toUpperCase() +
        filteredPart.slice(1).toLowerCase()
      );
    });

    // Join the corrected parts back into a single string, ensuring only a single space between names
    // const correctedUserName = correctedNameParts.join(" ").trim();

    // Update the state with the validated and corrected user name
    setUserName(correctedNameParts.join(" "));
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
    // console.log(State.getStatesOfCountry("IN"));
    // console.log(City.getCitiesOfCountry("IN"));
    // console.log(City.getCitiesOfState("IN", "CT"));
  }, []);

  // const fetchCOCData = async () => {
  //   try {
  //     const response = await axios.get(
  //       baseUrl+"get_all_cocs"
  //     );
  //     const data = response.data;
  //     setCocData(data.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  // const newDate = new Date();
  // const currectDate = `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`;

  const fetchCOCData = async () => {
    try {
      const response = await axios.get(baseUrl + "latest_newcoc");

      setCocData(response.data.data[0].coc_content);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    async function getGuardian() {
      const response = await axios.get(
        `${baseUrl}` + `get_single_guardian/${id}`
      );
      setGuardianDetails(response.data.data);
    }
    if (id) getGuardian();
  }, [id]);

  // Step 1: Group data by display_sequence
  // const groupedData = cocData?.reduce((result, item) => {
  //   const displaySequence = item.display_sequence;
  //   if (!result[displaySequence]) {
  //     result[displaySequence] = [];
  //   }
  //   result[displaySequence].push(item);
  //   return result;
  // }, {});
  // Step 2: Render the list
  // const renderList = () => {
  //   return Object.entries(groupedData).map(([displaySequence, items]) => (
  //     <div className="thm_textbx" key={displaySequence}>
  //       <h3>
  //         {displaySequence} {items[0].heading}
  //       </h3>
  //       <p> {items[0].heading_desc}</p>
  //       {items.map((item, index) => (
  //         <div className="thm_textbx" key={index}>
  //           <h5>
  //             {item.sub_heading_sequence} {item.sub_heading}
  //           </h5>
  //           <p>{item.sub_heading_desc}</p>
  //         </div>
  //       ))}
  //       <p> {items[0].description}</p>
  //     </div>
  //   ));
  // };

  const openReadyToOnboardModal = () => {
    setReadyToOnboard(true);
  };

  const closeReadyToOnboardModal = () => {
    setReadyToOnboard(false);
  };

  const handleIamReady = () => {
    setReadyToOnboard(false);
    handleGetOnboard();
    openRocket();
  };

  const openRocket = () => {
    setIsShowRocket(true);
  };

  const closeRocket = () => {
    setIsShowRocket(false);
    openTour();
  };

  const openTour = () => {
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
    OpenImageSelector();
  };

  const OpenImageSelector = () => {
    setIsImageSelectorOpen(true);
  };

  const CloseImageSelector = () => {
    setIsImageSelectorOpen(false);
  };

  const openReactModal = () => {
    setIsModalOpen(true);
  };

  const closeReactModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isShowRocket && rocketVideoLink) {
      const timer = setTimeout(() => {
        closeRocket();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isShowRocket, closeRocket, rocketVideoLink]);

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setSameAsCurrent(checked);
    if (checked) {
      setPermanentAddress(currentAddress);
      setPermanentCity(currentCity);
      setPermanentState(currentState);
      setPermanentPincode(currentPincode);
    } else {
      setPermanentAddress("");
      setPermanentCity("");
      setPermanentState("");
      setPermanentPincode("");
    }
  };

  const getDocuments = async () => {
    const response = await axios.post(baseUrl + "get_user_doc", {
      user_id: id,
    });
    setDocumentData(response.data.data);
  };

  useEffect(() => {
    const MandatoryDocuments = documentData.filter(
      (doc) => doc.document.isRequired == true
    );

    const MandatoryDocumentsFilledCount = MandatoryDocuments.filter(
      (doc) => doc.file || doc.doc_image !== ""
    )?.length;

    const ManDocFilledPer = Math.ceil(
      (MandatoryDocumentsFilledCount / MandatoryDocuments?.length) * 100
    );
    setShowMandotaryPer(ManDocFilledPer);

    const nonManDocs = documentData.filter(
      (doc) => doc.document.isRequired == false
    );

    const nonMandatoryFilledCount = nonManDocs.filter(
      (item) => item.doc_image !== "" || item.file
    );

    const nonMandoatoryPercentageTemp = Math.ceil(
      (nonMandatoryFilledCount?.length / nonManDocs?.length) * 100
    );
    setShowNonMandotaryPer(nonMandoatoryPercentageTemp);
  }, [documentData]);

  useEffect(() => {
    // const approveCount = documentData.filter((doc) => doc.status == "Approved" ).length;
    const approveCount = documentData.filter(
      (doc) => doc.status == "Verification Pending"
    ).length;

    const documentPercentageTemp = Math.ceil(
      (approveCount / documentData.length) * 100
    );

    setDocumentPercentage(documentPercentageTemp);
  }, [getDocuments]);

  const gettingData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${id}`).then((res) => {
      const fetchedData = res.data;

      const preselectedHobbies = fetchedData?.Hobbies?.map((hobbyId) => ({
        value: hobbyId,
        label: hobbiesData?.find((hobby) => hobby?.hobby_id == hobbyId)
          ?.hobby_name,
      }));

      setHobbies(preselectedHobbies);
      const {
        user_name,
        user_email_id,
        PersonalEmail,
        user_contact_no,
        PersonalNumber,
        fatherName,
        motherName,
        Hobbies,
        Gender,
        BloodGroup,
        Nationality,
        SpokenLanguages,
        user_login_id,
        user_login_password,
        joining_date,
        DOB,
        MartialStatus,
        DateOfMarriage,
        spouse_name,
        tenth_marksheet_validate,
        twelveth_marksheet_validate,
        UG_Marksheet_validate,
        uid_validate,
        pan_validate,
        passport_validate,
        pre_expe_letter_validate,
        pre_off_letter_validate,
        pre_relieving_letter_validate,
        bankPassBook_Cheque_validate,
        permanent_address,
        permanent_city,
        permanent_state,
        permanent_pin_code,
        current_address,
        current_city,
        current_state,
        current_pin_code,
        emergency_contact1,
        image_url,
        nick_name,
        showOnboardingModal,
        image,
        coc_flag,
        designation_name,
      } = fetchedData;
      setDesignation(designation_name);
      setAllUserData(fetchedData);
      setUserName(user_name);
      setEmail(user_email_id);
      setPersonalEmail(PersonalEmail);
      setContact(user_contact_no);
      setPersonalContact(PersonalNumber);
      setPersonalEmail(PersonalEmail);
      setFatherName(fatherName);
      setMotherName(motherName);
      setGender(Gender);
      setBloodGroup(BloodGroup);
      {
        Nationality && setNationality(Nationality);
      }
      setBackendSpeakingLanguage(SpokenLanguages);
      setLoginId(user_login_id);
      setPassword(user_login_password);

      setJoiningDate(
        joining_date?.split("T")[0].split("-").reverse().join("-")
      );
      setDaysLeftToJoining(joining_date);
      setMaritialStatus(MartialStatus);
      setDateOfBirth(DOB?.split("T")?.[0]);
      setDateOfMarraige(DateOfMarriage);
      setSpouseName(spouse_name);
      {
        tenth_marksheet_validate !== "" &&
          setXMarksheetValidation(tenth_marksheet_validate);
      }
      {
        twelveth_marksheet_validate !== "" &&
          setXIIMarksheetValidation(twelveth_marksheet_validate);
      }
      {
        UG_Marksheet_validate !== "" &&
          setUnderGraduationDocValidation(UG_Marksheet_validate);
      }
      {
        uid_validate !== "" && setUIDValidation(uid_validate);
      }
      {
        pan_validate !== "" && setPanUploadValidation(pan_validate);
      }
      {
        passport_validate !== "" && setPassportValidation(passport_validate);
      }
      {
        pre_expe_letter_validate !== "" &&
          setExperienceDocValidation(pre_expe_letter_validate);
      }
      {
        pre_off_letter_validate !== "" &&
          setPreviousOfferLetterValidation(pre_off_letter_validate);
      }
      {
        pre_relieving_letter_validate !== "" &&
          setPreviousRelievingLetterValidation(pre_relieving_letter_validate);
      }
      {
        bankPassBook_Cheque_validate !== "" &&
          setPassbookChequeValidation(bankPassBook_Cheque_validate);
      }
      setPermanentAddress(permanent_address);
      setPermanentCity(permanent_city);
      setPermanentState(permanent_state);
      setPermanentPincode(permanent_pin_code);
      setCurrentAddress(current_address);
      setcurrentCity(current_city);
      setcurrentState(current_state);
      setcurrentPincode(current_pin_code);
      setEmergencyContact(emergency_contact1);
      setGetProfile(image_url);
      setGetNickName(nick_name);
      setProfileImage(image);
      {
        showOnboardingModal && openReadyToOnboardModal();
      }
      setCocFlag(coc_flag);
    });
  };

  useEffect(() => {
    gettingData();
  }, [hobbiesData]);

  useEffect(() => {
    fetchCOCData();
    getDocuments();
  }, [id]);

  // const handleHobbiesChange = (event, selectedOptions) => {
  //   setHobbies(selectedOptions || []);
  // };

  function validateAndCorrectUserName(userName) {
    userName = userName.replace(/\s{2,}/g, " ").trim();

    const lettersOnly = /^[A-Za-z]+$/;

    const correctedNameParts = userName.split(" ").map((part) => {
      let filteredPart = part
        .split("")
        .filter((char) => char.match(lettersOnly))
        .join("");

      return (
        filteredPart.charAt(0).toUpperCase() +
        filteredPart.slice(1).toLowerCase()
      );
    });

    const correctedUserName = correctedNameParts.join(" ");

    return correctedUserName.replace(/\s+/g, " ").trim();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("user_name", validateAndCorrectUserName(username));
    formData.append("user_email_id", email);
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("user_contact_no", Number(contact));
    formData.append("personal_number", personalContact);
    formData.append("Personal_email", personalEmail);
    formData.append("emergency_contact1", Number(emergencyContact));

    // document open ---------->
    formData.append("tenth_marksheet", XMarksheet);
    formData.append("twelveth_marksheet", XIIMarksheet);
    formData.append("UG_Marksheet", underGraduationDoc);
    formData.append("UID", uid);
    formData.append("pan", panUpload);
    formData.append("passport", Passport);
    formData.append("pre_expe_letter", experienceDoc);
    formData.append("pre_off_letter", previousOfferLetter);
    formData.append("pre_relieving_letter", previousRelievingLetter);
    formData.append("bankPassBook_Cheque", passbookCheque);
    // document close ---------->

    // document verification open----------->
    formData.append("tenth_marksheet_validate", XMarksheetValidation);
    formData.append("twelveth_marksheet_validate", XIIMarksheetValidation);
    formData.append("UG_Marksheet_validate", underGraduationDocValidation);
    formData.append("uid_validate", uidValidation);
    formData.append("pan_validate", panUploadValidation);
    formData.append("passport_validate", PassportValidation);
    formData.append("pre_expe_letter_validate", experienceDocValidation);
    formData.append("pre_off_letter_validate", previousOfferLetterValidation);
    formData.append(
      "pre_relieving_letter_validate",
      previousRelievingLetterValidation
    );
    formData.append("bankPassBook_Cheque_validate", passbookChequeValidation);
    // document verification close----------->

    formData.append(
      "joining_date",
      joiningDate?.split("-").reverse().join("-")
    );
    formData.append(
      "SpokenLanguages",
      speakingLanguage?.map((lang) => lang).join(", ")
    );
    formData.append("Gender", gender);
    formData.append("Nationality", nationality);
    formData.append("DOB", dateOfBirth);
    formData.append("fatherName", FatherName);
    formData.append("motherName", motherName);
    formData.append(
      "Hobbies",
      hobbies.map((hobby) => hobby.value)
    );
    formData.append("BloodGroup", bloodGroup);
    formData.append("MartialStatus", maritialStatus);
    formData.append("DateofMarriage", dateOfMarraige);
    formData.append("spouse_name", spouseName);

    //Permanent address ------------>
    formData.append("permanent_address", permanentAddress);
    formData.append("permanent_city", permanentCity);
    formData.append("permanent_state", permanentState);
    formData.append("permanent_pin_code", Number(permanentPincode));

    //Cuurent Addresss -------------->
    formData.append("current_address", currentAddress);
    formData.append("current_city", currentCity);
    formData.append("current_state", currentState);
    formData.append("current_pin_code", Number(currentPincode));

    formData.append("latitude", coordinates.latitude);
    formData.append("longitude", coordinates.longitude);

    formData.append("document_percentage", documentPercentage);
    formData.append("document_percentage_mandatory", showMandotaryPer);
    formData.append("document_percentage_non_mandatory", showNonMandotaryPer);

    await axios.put(`${baseUrl}` + `update_user`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    //Posting/Update Guardian Details
    for (const elements of guardianDetails) {
      let payload = {
        user_id: id,
        guardian_name: elements.guardian_name,
        guardian_contact: elements.guardian_contact,
        guardian_address: elements.guardian_address,
        relation_with_guardian: elements.relation_with_guardian,
      };
      if (elements.guardian_id) {
        payload.guardian_id = elements.guardian_id;
      }

      try {
        const response = await axios.put(baseUrl + "update_guardian", payload);
      } catch (error) {
        console.error("Error Update/Creating Guardian", error);
      }
    }

    //family
    for (const elements of familyDetails) {
      let payload = {
        user_id: id,
        name: elements.name,
        DOB: elements.DOB,
        relation: elements.relation,
        contact: elements.contact,
        occupation: elements.occupation,
        annual_income: elements.annual_income,
      };

      if (elements.family_id) {
        payload.family_id = elements.family_id;
      }
      try {
        const response = await axios.put(baseUrl + "update_family", payload);
      } catch (error) {
        console.error("Error updating family details:", error);
      }
    }

    //Education
    for (const elements of educationDetails) {
      let payload = {
        user_id: id,
        title: elements.title,
        institute_name: elements.institute_name,
        from_year: elements.from_year,
        to_year: elements.to_year,
        percentage: Number(elements.percentage),
        stream: elements.stream,
        specialization: elements.specialization,
      };

      if (elements.education_id) {
        payload.education_id = elements.education_id;
      }
      try {
        await axios.put(baseUrl + "update_education", payload);
      } catch (error) {
        console.error("Error Updating Education details:", error);
      }
    }

    setXIIMarksheet(null);
    setXIIMarksheet(null);
    setUnderGraduationDoc(null);
    setUID(null);
    setPanUpload(null);
    setPassport(null);
    setExperienceDoc(null);
    setPreviousOfferLetter(null);
    setPreviousRelievingLetter(null);
    setPassbookCheque(null);

    gettingData();
    setIsSubmitting(false);

    // After update send mail
    axios
      .post(baseUrl + "add_send_user_mail", {
        email: "lalit@creativefuel.io",
        subject: "User Pre Onboarding",
        text: "Pre Onboarding Data Update Successfully",
        attachment: "",
        login_id: loginId,
        name: username,
        password: password,
      })
      .then((res) => {
        console.log("Email sent successfully:", res.data);
      })
      .catch((error) => {
        console.log("Failed to send email:", error);
      });
    whatsappApi.callWhatsAPI("CF_Document_upload", "9826116769", username, [
      username,
    ]);

    toastAlert("User Update");
    // gettingData();
  };

  // useEffect(() => {
  //   if (isShowRocket) {
  //     setTimeout(() => {
  //       setIsShowRocket(false);
  //     }, 3000);
  //   }
  // }, [isShowRocket]);

  useEffect(() => {
    async function getDetails() {
      const familyDataResponse = await axios.get(
        `${baseUrl}` + `get_single_family/${id}`
      );
      const educationDataResponse = await axios.get(
        `${baseUrl}` + `get_single_education/${id}`
      );
      setFamilyDetails(familyDataResponse.data.data);
      setEducationDetails(educationDataResponse.data.data);
    }
    getDetails();
  }, [id]);

  //Guardian
  const handleAddGuardianDetails = () => {
    setGuardianDetails([
      ...guardianDetails,
      { ...initialGuardianDetailsGroup },
    ]);
  };

  const handleGuardianDetailsChange = (index, event) => {
    const { name, value } = event.target;

    const updatedGuardianDetails = guardianDetails?.map((detail, idx) => {
      if (idx === index) {
        return { ...detail, [name]: value };
      }
      return detail;
    });
    setGuardianDetails(updatedGuardianDetails);

    if (name === "guardian_contact") {
      const isValidPhoneNumber =
        value.length >= 10 &&
        /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(value);

      setGuardianContactErrors({
        ...guardianContactErrors,
        [index]: !isValidPhoneNumber,
      });
    }
  };

  async function handleRemoveGuardianDetails(index) {
    const itemToRemove = guardianDetails[index];
    if (itemToRemove && itemToRemove.guardian_id) {
      try {
        await axios.delete(
          `${baseUrl}` + `delete_guardian/${itemToRemove.guardian_id}`
        );
      } catch (error) {
        console.error("Error Deleting Guardian", error);
        return;
      }
    }

    const newGuardianDetails = guardianDetails.filter(
      (_, idx) => idx !== index
    );
    setGuardianDetails(newGuardianDetails);
  }

  //familyDetails
  const handleAddFamilyDetails = () => {
    setFamilyDetails([...familyDetails, { ...initialFamilyDetailsGroup }]);
  };

  const handleFamilyDetailsChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDetails = [...familyDetails];
    updatedDetails[index] = { ...updatedDetails[index], [name]: value };

    const errors = { ...familyValidationErrors };
    if (name === "contact") {
      if (!/^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(value)) {
        errors[`${name}-${index}`] =
          "Invalid contact number. Please enter a valid phone number.";
      } else {
        delete errors[`${name}-${index}`];
      }
    }

    setFamilyDetails(updatedDetails);
    setFamilyValidationErrors(errors);
  };

  const handleRemoveFamilyDetails = async (index) => {
    const itemToRemove = familyDetails[index];
    if (itemToRemove && itemToRemove.family_id) {
      try {
        await axios.delete(
          `${baseUrl}` + `delete_family/${itemToRemove.family_id}`
        );
        toastAlert("Details Deleted");
      } catch (error) {
        console.error("Error deleting family detail:", error);
        return;
      }
    }

    const newFamilyDetails = familyDetails.filter((_, idx) => idx !== index);
    setFamilyDetails(newFamilyDetails);
  };

  //EducationDetailsAdd
  const handleAddEducationDetails = () => {
    setEducationDetails([
      ...educationDetails,
      { ...initialEducationDetailsGroup },
    ]);
  };

  const handleEducationDetailsChange = (index, event) => {
    const { name, value } = event.target;
    const updatedEducationDetails = [...educationDetails];
    const detailToUpdate = updatedEducationDetails[index];

    if (name === "percentage" && value > 100) {
      return toastError("Can't input value greater than 100");
    }

    detailToUpdate[name] = value;

    if (name === "from_year" || name === "to_year") {
      const fromYear = detailToUpdate["from_year"]
        ? new Date(detailToUpdate["from_year"])
        : null;
      const toYear = detailToUpdate["to_year"]
        ? new Date(detailToUpdate["to_year"])
        : null;

      if (fromYear && toYear && fromYear > toYear) {
        return toastError("'From year' should not be greater than 'To year'");
      }
    }

    setEducationDetails(updatedEducationDetails);
  };

  const handleRemoveEducationDetails = async (index) => {
    const itemToRemove = educationDetails[index];
    if (itemToRemove && itemToRemove.education_id) {
      try {
        await axios.delete(
          `${baseUrl}` + `delete_education/${itemToRemove.education_id}`
        );
        toastAlert("Details Deleted");
      } catch (error) {
        console.error("Error Deleting Education Detail:", error);
        return;
      }
    }
    const newEducationDetails = educationDetails.filter((_, i) => i !== index);
    setEducationDetails(newEducationDetails);
  };

  // Password Auto Genrate
  const generatePassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let generatePassword = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatePassword += charset[randomIndex];
    }
    setPassword(generatePassword);
  };

  useEffect(() => {
    axios.get(`${baseUrl}get_all_hobbies`).then((res) => {
      setHobbiesData(res.data.data);
    });
  }, []);
  const filteredHobbyOption = hobbiesData
    .filter(
      (category) =>
        !hobbies.find((selected) => selected.value === category.hobby_id)
    )
    .map((category) => ({
      label: category.hobby_name,
      value: category.hobby_id,
    }));
  const categoryChangeHandler = (e, op) => {
    setHobbies(op);
  };

  useEffect(() => {
    setSpeakingLanguage(
      backendSpeakingLanguage ? backendSpeakingLanguage.split(",") : []
    );
  }, [backendSpeakingLanguage]);

  const handleLogOut = async (e) => {
    e.preventDefault();

    await axios.post(baseUrl + "log_out", {
      user_id: id,
    });

    sessionStorage.clear("token");
    navigate("/login");
  };

  const calculateProgressPercentage = (fieldsArray, excludeValues) => {
    const valuesToExclude = Array.isArray(excludeValues)
      ? excludeValues
      : [excludeValues];

    const filledFieldsCount = fieldsArray?.filter(
      (val) => !valuesToExclude.includes(val)
    ).length;

    const totalFields = fieldsArray?.length;
    const percentage = (filledFieldsCount / totalFields) * 100;
    return Math.ceil(percentage);
  };

  const filledFields = [
    username,
    personalEmail,
    personalContact,
    FatherName,
    gender,
    motherName,
    hobbies,
    bloodGroup,
    speakingLanguage,
    dateOfBirth,
    nationality,
    emergencyContact,
    permanentAddress,
    permanentCity,
    permanentState,
    permanentPincode,
    currentAddress,
    currentCity,
    currentState,
    currentPincode,
    joiningDate,
  ];

  const formFieldProgressPercentage = calculateProgressPercentage(
    filledFields,
    ["", null, 0, undefined]
  );

  function daysUntil(isoDateString) {
    const oneDay = 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const futureDate = new Date(isoDateString);

    const diffInTime = futureDate.getTime() - currentDate.getTime();

    const days = Math.ceil(diffInTime / oneDay);
    if (days < 0) return 0;
    return days;
  }

  const daysLeftCount = daysUntil(daysLeftToJoining);

  const images = [
    imageTest1,
    imageTest2,
    imageTest3,
    imageTest14,
    imageTest5,
    imageTest6,
    imageTest7,
    imageTest8,
    imageTest15,
    imageTest16,
    imageTest17,
    imageTest18,
    imageTest19,
    imageTest20,
    imageTest21,
    imageTest22,
    imageTest23,
    imageTest24,
    imageTest25,
    imageTest26,
    imageTest27,
    imageTest28,
    imageTest29,
    imageTest30,
  ];

  const handleImageClick = async (image) => {
    try {
      const response = await axios.get(image, {
        responseType: "arraybuffer",
      });

      setImagePreview(image);

      const blob = new Blob([response.data], { type: "image/jpeg" });
      setSelectedImage(blob);
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    setSelectedImage(file);
  };

  const handleSubmitProfile = async () => {
    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("image", selectedImage);
    formData.append("nick_name", nickName);
    formData.append("profileflag", 1);

    await axios.put(`${baseUrl}` + `update_user`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    CloseImageSelector();
    gettingData();
    // setTimeout(() => {
    //   gettingData();
    // }, 3000);
  };

  const handleCOC = async () => {
    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("coc_flag", true);

    await axios.put(`${baseUrl}` + `update_user`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toastAlert("Success");
    gettingData();
  };

  const handleGetOnboard = async () => {
    await axios.put(`${baseUrl}` + `update_user`, {
      user_id: id,
      showOnboardingModal: false,
      show_rocket: false,
    });
  };

  // position: window.innerWidth < 768 ? 'bottom' : 'right',
  const steps = [
    {
      selector: "#sidebarFormBox",
      content:
        "Complete the form by entering your personal details, including name, contact information, address, and any other required information.",
    },
    {
      selector: "#sidebarDocumentBox",
      content: "From here you can submit your documents.",
    },
    {
      selector: "#sidebarPolicyBox",
      content: "From here you can see company policies.",
    },
    {
      selector: "#sidebarLetterBox",
      content: "From here you can see your offer letter.",
    },
    {
      selector: "#sidebarFaqBox",
      content: "Here you can look for FAQ's",
    },
    {
      selector: ".user_logout",
      content: "From here you can logout",
    },
  ];

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth()).padStart(2, "0");
  const yyyy = today.getFullYear();

  const formattedDate = dd + "-" + mm + "-" + yyyy;

  return (
    <>
      <div className="mobileTourWrapper">
        <div className="mobileTourWrapperOverlay"></div>
        <div className="mobileTourArea"></div>
      </div>

      <Modal
        className="OnboardPrompt"
        isOpen={readyToOnboardModal}
        onRequestClose={closeReadyToOnboardModal}
        contentLabel="I am ready modal"
        preventScroll={true}
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          },
          content: {
            position: "absolute",
            width: "500px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
          },
        }}
        shouldCloseOnOverlayClick={false}
      >
        <ReadyToOnboardContent
          handleIamReady={handleIamReady}
          closeModal={closeReadyToOnboardModal}
        />
      </Modal>

      <Modal
        className="loaderRocket"
        isOpen={isShowRocket}
        onRequestClose={closeRocket}
        contentLabel="Rocket Modal"
        appElement={document.getElementById("root")}
        shouldCloseOnOverlayClick={false}
      >
        {/* <RocketAnimation
          isShowRocket={isShowRocket}
          closeRocket={closeRocket}
          videoLink={rocketVideoLink}
          audioLink={rocketAudioLink}
        /> */}
        {/* <video
          width="100%"
          height="100%"
          autoPlay
          playsInline
          onEnded={closeRocket}
        >
          <source src={rocketVideoLink} type="video/mp4" />
        </video> */}
        <img src={rocketVideoLink} alt="my-gif" />
      </Modal>

      <Tour steps={steps} isOpen={isTourOpen} onRequestClose={closeTour} />

      {/* Image Selector Modal  */}
      <Modal
        className="modal-dialog-centered modal-lg minHeightAuto"
        isOpen={isImageSelectorOpen}
        onRequestClose={CloseImageSelector}
        contentLabel="Image Selector"
        shouldCloseOnOverlayClick={true}
        appElement={document.getElementById("root")}
      >
        <ImageSelector
          imagePreview={imagePreview}
          handleImageClick={handleImageClick}
          nickName={nickName}
          images={images}
          setNickName={setNickName}
          handleImageUpload={handleImageUpload}
          handleSubmitProfile={handleSubmitProfile}
          selectedImage={selectedImage}
          CloseImageSelector={CloseImageSelector}
        />
      </Modal>
      {/* Image selector Modal Close */}

      <section className="section">
        <div className="page_wrapper">
          <div className="topnavbar">
            <div className="topnavbarLeft">
              <div className="sidebar_header">
                <h2 onClick={() => setActiveTab(0)}>
                  <i className="bi bi-house-fill" />
                </h2>
              </div>
            </div>
            <div className="topnavbarRight">
              <div className="navbar_menu">
                {/*    <div className="daysLeft">
                    <img src={hourGlass} alt="welcome" />
                    <h3>
                      <span>{daysLeftCount}</span> Days left to join
                    </h3>
                  </div>
                   */}
              </div>

              <div className="user_box">
                <div className="user_name">
                  <h3>
                    <span>Welcome </span>
                    {getNickName}
                  </h3>
                </div>
                <div className="user_img" onClick={OpenImageSelector}>
                  <img src={getProfile ? getProfile : imageTest1} alt="user" />
                </div>
                <div className="user_logout">
                  <div className="dropdown">
                    <a
                      className="dropdown-toggle"
                      id="onboarduserDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bi bi-power" />
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="onboarduserDropdown"
                    >
                      <a onClick={handleLogOut} className="dropdown-item">
                        Logout
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="page_wrapper_in">
            <div className="sidebar_wrapper">
              <div className="sidebar_wrapper_in">
                <div className="sidebar_items sidebar_items_desktop">
                  <div
                    className={`sidebar_itembox ${activeTab == 1 ? "sidebar_item_active" : ""
                      }`}
                    id="sidebarFormBox"
                    onClick={() => setActiveTab(1)}
                  >
                    {/* pp-100 is percentage of document procedure */}
                    <div
                      className={`progress-circle progressing pp-${formFieldProgressPercentage}`}
                    >
                      <div className="progress-circle-border">
                        <div className="left-half-circle" />
                        <div className="right-half-circle" />
                      </div>
                      <div className="progress-circle-content">
                        <i className="bi bi-journal-text" />
                      </div>
                    </div>
                    <div className="sidebar_itemboxText">
                      <h2>Form</h2>
                      <h3>{formFieldProgressPercentage}%</h3>
                    </div>
                  </div>
                  <div
                    className={`sidebar_itembox sidebar_itemboxCol ${activeTab == 2 ? "sidebar_item_active" : ""
                      }`}
                    id="sidebarDocumentBox"
                    onClick={() => setActiveTab(2)}
                  >
                    <div className="sidebar_itemboxColIn">
                      <div
                        className={`progress-circle progressing pp-${documentPercentage}`}
                      >
                        <div className="progress-circle-border">
                          <div className="left-half-circle" />
                          <div className="right-half-circle" />
                        </div>
                        <div className="progress-circle-content">
                          <i className="bi bi-file-richtext" />
                        </div>
                      </div>
                    </div>
                    <div className="sidebar_iteminfo">
                      <div className="pack" style={{ flexDirection: "row" }}>
                        <h2 className="document_tab_name">Documents</h2>
                        {/* <span>(verified)</span> */}
                        <h3>{documentPercentage}%</h3>
                      </div>
                      <h3>
                        {/* Mandatory <span>{showMandotaryPer}%</span> */}
                      </h3>
                      {/* <h3>
                        Non Mandatory{" "}
                        <span>
                          {showNonMandotaryPer ? showNonMandotaryPer : 0}%
                        </span>
                      </h3> */}
                    </div>
                  </div>
                  {/* {allUserData.offer_letter_send && ( */}
                  <div
                    className={`sidebar_itembox ${activeTab === 5 ? "sidebar_item_active" : ""
                      }`}
                    id="sidebarLetterBox"
                    onClick={() => setActiveTab(5)}
                  // style={{
                  //   opacity: joiningDate <= formattedDate ? 0.5 : 1,
                  //   // cursor: joiningDate <= formattedDate ? "not-allowed" : "pointer",
                  //   pointerEvents:
                  //     joiningDate <= formattedDate ? "none" : "auto",
                  // }}
                  >
                    <div className="progress-circle progressing pp-26">
                      <div className="progress-circle-border">
                        <div className="left-half-circle" />
                        <div className="right-half-circle" />
                      </div>
                      <div className="progress-circle-content">
                        <i className="bi bi-file-earmark-text" />
                      </div>
                    </div>
                    <h2 className="letter_tab_name">Offer Letter</h2>
                  </div>
                  {/* )} */}
                  <div
                    // className={`sidebar_itembox  ${
                    //   activeTab == 3 ? "sidebar_item_active" : ""
                    // }`}
                    className={`sidebar_itembox ${activeTab === 3 && documentPercentage < 90
                        ? "sidebar_item_active"
                        : ""
                      }`}
                    id="sidebarPolicyBox"
                    // style={{
                    //   pointerEvents: documentPercentage < 90 ? "none" : "auto",
                    //   opacity: documentPercentage < 90 ? 0.5 : 1,
                    // }}
                    onClick={() => setActiveTab(3)}
                  >
                    <div className="progress-circle progressing pp-100">
                      <div className="progress-circle-border">
                        <div className="left-half-circle" />
                        <div className="right-half-circle" />
                      </div>
                      <div className="progress-circle-content">
                        <i className="bi bi-book" />
                      </div>
                    </div>
                    <h2 className="policy_tab_name">
                      COC <small>Code of conduct</small>
                      <div className="cocInfo">
                        {documentPercentage < 90 && (
                          <p>Please complete Mandatory Document</p>
                        )}
                      </div>
                    </h2>
                  </div>
                  <div
                    className={`sidebar_itembox ${activeTab == 4 ? "sidebar_item_active" : ""
                      }`}
                    id="sidebarFaqBox"
                    onClick={() => setActiveTab(4)}
                  >
                    <div className="progress-circle progressing pp-100">
                      <div className="progress-circle-border">
                        <div className="left-half-circle" />
                        <div className="right-half-circle" />
                      </div>
                      <div className="progress-circle-content">
                        <i className="bi bi-question-circle" />
                      </div>
                    </div>
                    <h2>FAQ</h2>
                  </div>
                </div>
                <div className="sidebar_items_mobile">
                  <Slider {...settings}>
                    <div
                      className={`sidebar_itembox ${
                        activeTab == 1 ? "sidebar_item_active" : ""
                      }`}
                      id="sidebarFormBox"
                      onClick={() => setActiveTab(1)}
                    >
                      {/* pp-100 is percentage of document procedure */}
                      <div
                        className={`progress-circle progressing pp-${formFieldProgressPercentage}`}
                      >
                        <div className="progress-circle-border">
                          <div className="left-half-circle" />
                          <div className="right-half-circle" />
                        </div>
                        <div className="progress-circle-content">
                          <i className="bi bi-journal-text" />
                        </div>
                      </div>
                      <div className="sidebar_itemboxText">
                        <h2>Form</h2>
                        <h3>{formFieldProgressPercentage}%</h3>
                      </div>
                    </div>
                    <div
                      className={`sidebar_itembox sidebar_itemboxCol ${
                        activeTab == 2 ? "sidebar_item_active" : ""
                      }`}
                      id="sidebarDocumentBox"
                      onClick={() => setActiveTab(2)}
                    >
                      <div className="sidebar_itemboxColIn">
                        <div
                          className={`progress-circle progressing pp-${documentPercentage}`}
                        >
                          <div className="progress-circle-border">
                            <div className="left-half-circle" />
                            <div className="right-half-circle" />
                          </div>
                          <div className="progress-circle-content">
                            <i className="bi bi-file-richtext" />
                          </div>
                        </div>
                      </div>
                      <div className="sidebar_iteminfo">
                        <div className="pack" style={{ flexDirection: "row" }}>
                          <h2 className="document_tab_name">Documents</h2>
                          <span>(verified)</span>
                          <h3>{documentPercentage}%</h3>
                        </div>
                        <h3>
                          Mandatory <span>{showMandotaryPer}%</span>
                        </h3>
                        <h3>
                          Non Mandatory{" "}
                          <span>
                            {showNonMandotaryPer ? showNonMandotaryPer : 0}%
                          </span>
                        </h3>
                      </div>
                    </div>
                    {/* {allUserData.offer_letter_send && ( */}
                    <div
                      className={`sidebar_itembox ${
                        activeTab === 5 ? "sidebar_item_active" : ""
                      }`}
                      id="sidebarLetterBox"
                      onClick={() => setActiveTab(5)}
                      // style={{
                      //   opacity: joiningDate <= formattedDate ? 0.5 : 1,
                      //   // cursor: joiningDate <= formattedDate ? "not-allowed" : "pointer",
                      //   pointerEvents:
                      //     joiningDate <= formattedDate ? "none" : "auto",
                      // }}
                    >
                      <div className="progress-circle progressing pp-26">
                        <div className="progress-circle-border">
                          <div className="left-half-circle" />
                          <div className="right-half-circle" />
                        </div>
                        <div className="progress-circle-content">
                          <i className="bi bi-file-earmark-text" />
                        </div>
                      </div>
                      <h2 className="letter_tab_name">Offer Letter</h2>
                    </div>
                    {/* )} */}
                    <div
                      // className={`sidebar_itembox  ${
                      //   activeTab == 3 ? "sidebar_item_active" : ""
                      // }`}
                      className={`sidebar_itembox ${
                        activeTab === 3 && documentPercentage < 90
                          ? "sidebar_item_active"
                          : ""
                      }`}
                      id="sidebarPolicyBox"
                      // style={{
                      //   pointerEvents: documentPercentage < 90 ? "none" : "auto",
                      //   opacity: documentPercentage < 90 ? 0.5 : 1,
                      // }}
                      onClick={() => setActiveTab(3)}
                    >
                      <div className="progress-circle progressing pp-100">
                        <div className="progress-circle-border">
                          <div className="left-half-circle" />
                          <div className="right-half-circle" />
                        </div>
                        <div className="progress-circle-content">
                          <i className="bi bi-book" />
                        </div>
                      </div>
                      <h2 className="policy_tab_name">
                        COC <small>Code of conduct</small>
                        <div className="cocInfo">
                          {documentPercentage < 90 && (
                            <p>Please complete Mandatory Document</p>
                          )}
                        </div>
                      </h2>
                    </div>
                    <div
                      className={`sidebar_itembox ${
                        activeTab == 4 ? "sidebar_item_active" : ""
                      }`}
                      id="sidebarFaqBox"
                      onClick={() => setActiveTab(4)}
                    >
                      <div className="progress-circle progressing pp-100">
                        <div className="progress-circle-border">
                          <div className="left-half-circle" />
                          <div className="right-half-circle" />
                        </div>
                        <div className="progress-circle-content">
                          <i className="bi bi-question-circle" />
                        </div>
                      </div>
                      <h2>FAQ</h2>
                    </div>
                  </Slider>
                </div>
              </div>
            </div>
            <div className="page_area">
              <div className="dashboard_body">
                <div className="dashboard_body_inner">
                  {/* Welcome Screen Start */}

                  {activeTab == 0 && (
                    <div className="welcome_board">
                      <div className="welcome_board_heading">
                        <h1>Welcome </h1>
                        <h2>{loginUserName}</h2>
                        <h1>To start your onboarding please click the form</h1>
                      </div>
                      {/* <button
                      className="btn btn-success d-block w-100"
                      onClick={openModal}
                    >
                      Profile
                    </button> */}
                      <div className="welcome_board_img">
                        <div className="imgone">
                          <img src={welcomeImage} alt="welcome" />
                        </div>
                        {/* <div className="imgtwo">
                          <img src={welcomeText} alt="welcome" />
                        </div> */}
                      </div>
                    </div>
                  )}
                  {/* Welcome Screen End */}

                  {/* Form Screen Start */}
                  {activeTab == 1 && (
                    <form onSubmit={handleSubmit}>
                      <div className="formarea">
                        <div className="row spacing_lg">
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            <div className="board_form board_form_flex">
                              <h2>On-Boarding Form</h2>
                              <h3>
                                Your Current Joning Date is : &nbsp;
                                <span>{joiningDate}</span>
                                <button
                                  className="btn btn-primary extndBtn"
                                  type="button"
                                  onClick={openReactModal}
                                >
                                  Extend
                                </button>
                                <Modal
                                  className="onboardModal2"
                                  isOpen={isModalOpen}
                                  onRequestClose={closeReactModal}
                                  contentLabel="Modal"
                                  appElement={document.getElementById("root")}
                                  shouldCloseOnOverlayClick={true}
                                >
                                  <ExtendJoining
                                    gettingData={gettingData}
                                    id={id}
                                    loginId={loginId}
                                    username={username}
                                    password={password}
                                    currentJoiningDate={joiningDate}
                                    closeModal={closeReactModal}
                                  />
                                </Modal>
                              </h3>
                              {/* <div className="form-group">
                                <TextField
                                  id="outlined-basic"
                                  label="Full Name"
                                  variant="outlined"
                                  type="text"
                                  // className="form-control"
                                  name="name"
                                  // placeholder="Full Name"
                                  value={username}
                                  onChange={(e) => setUserName(e.target.value)}
                                />*/}
                              <div className="form-group">
                                <TextField
                                  id="outlined-basic"
                                  label="Full Name"
                                  variant="outlined"
                                  type="text"
                                  // className="form-control"
                                  name="name"
                                  // disabled
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={username}
                                  onChange={handleFullNameChange}
                                />
                              </div>

                              {/* <div className="form-group">
                              <TextField
                                id="outlined-basic"
                                label="Official Email"
                                variant="outlined"
                                type="email"
                                // className="form-control"
                                name="Official Email"
                                // placeholder="Official Email"
                                value={email}
                                onChange={handleEmailChange}
                              />
                              {!validEmail && (
                                <p className="validation_message error">
                                  *Please enter valid email
                                </p>
                              )}
                            </div> */}

                              <div className="form-group">
                                <TextField
                                  id="outlined-basic"
                                  label="Personal Email"
                                  variant="outlined"
                                  type="email"
                                  value={personalEmail}
                                  onChange={(e) =>
                                    setPersonalEmail(e.target.value)
                                  }
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              </div>

                              <div className="form-group">
                                <ContactNumber
                                  label="Personal Contact"
                                  setParentComponentContact={setPersonalContact}
                                  parentComponentContact={personalContact}
                                />
                              </div>

                              <div className="form-group">
                                <TextField
                                  id="outlined-basic"
                                  label="Father Name"
                                  variant="outlined"
                                  type="text"
                                  name="father Name"
                                  value={FatherName}
                                  onChange={(e) =>
                                    setFatherName(FormatName(e.target.value))
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <TextField
                                  id="outlined-basic"
                                  label="Mother Name"
                                  variant="outlined"
                                  type="text"
                                  value={motherName}
                                  onChange={(e) => {
                                    setMotherName(FormatName(e.target.value));
                                  }}
                                />
                              </div>

                              <div className="form-group form_select">
                                <Autocomplete
                                  disablePortal
                                  disabled
                                  id="combo-box-demo"
                                  options={genderData}
                                  // defaultValue={genderData[0]}
                                  value={gender}
                                  onChange={(e, newValue) =>
                                    setGender(newValue)
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} label="Gender" />
                                  )}
                                />
                              </div>

                              {/* <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                name="father occupation "
                                placeholder="Father’s Occupation "
                              />
                            </div> */}

                              <div className="form-group form_select">
                                <Autocomplete
                                  multiple
                                  id="combo-box-demo"
                                  options={filteredHobbyOption}
                                  getOptionLabel={(option) => option.label}
                                  InputLabelProps={{ shrink: true }}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Hobbie" />
                                  )}
                                  onChange={categoryChangeHandler}
                                  value={hobbies}
                                />
                              </div>

                              <div className="form-group form_select">
                                <Autocomplete
                                  disablePortal
                                  id="combo-box-demo"
                                  options={bloodGroupData}
                                  value={bloodGroup}
                                  onChange={(event, newValue) => {
                                    setBloodGroup(newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Blood Group"
                                    />
                                  )}
                                />
                              </div>

                              {maritialStatus === "Married  " && (
                                <div className="form-group">
                                  <TextField
                                    id="outlined-basic"
                                    label="Spouse Name"
                                    variant="outlined"
                                    type="text"
                                    value={spouseName}
                                    onChange={(e) =>
                                      setSpouseName(e.target.value)
                                    }
                                  />
                                </div>
                              )}
                              {maritialStatus == "Married" && (
                                <div className="form-group">
                                  <TextField
                                    id="outlined-basic"
                                    label="Date Of Marriage"
                                    variant="outlined"
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    type="date"
                                    value={dateOfMarraige}
                                    onChange={(e) =>
                                      setDateOfMarraige(e.target.value)
                                    }
                                  />
                                </div>
                              )}

                              <div className="form-group">
                                <Autocomplete
                                  multiple
                                  id="multi-select-autocomplete"
                                  options={LanguageList} // Use correct array for options
                                  value={speakingLanguage}
                                  onChange={(event, newValue) =>
                                    setSpeakingLanguage(newValue)
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Speaking Languages"
                                    />
                                  )}
                                />
                              </div>

                              <div className="form-group Muiform_date">
                                <TextField
                                  id="outlined-basic"
                                  label="Date Of Birth"
                                  variant="outlined"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  type="date"
                                  value={dateOfBirth}
                                  onChange={(e) =>
                                    setDateOfBirth(e.target.value)
                                  }
                                />
                              </div>
                              <div className="form-group">
                                {/* <TextField
                                  id="outlined-basic"
                                  label="Nationality"
                                  variant="outlined"
                                  type="text"
                                  value={nationality}
                                  onChange={(e) =>
                                    setNationality(e.target.value)
                                  }
                                /> */}

                                <Autocomplete
                                  options={nationalityData}
                                  value={nationality}
                                  readOnly
                                  onChange={(e, newValue) => {
                                    setNationality(newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Nationality "
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </div>

                              <div className="form-group">
                                <ContactNumber
                                  label="Emergency Contact"
                                  parentComponentContact={emergencyContact}
                                  setParentComponentContact={
                                    setEmergencyContact
                                  }
                                />
                              </div>

                              {/* <GuardianFields
                                guardianDetails={guardianDetails}
                                guardianDisplayFields={guardianDisplayFields}
                                guardianFieldLabels={guardianFieldLabels}
                                guardianContactErrors={guardianContactErrors}
                                handleGuardianDetailsChange={
                                  handleGuardianDetailsChange
                                }
                                handleAddGuardianDetails={
                                  handleAddGuardianDetails
                                }
                                handleRemoveGuardianDetails={
                                  handleRemoveGuardianDetails
                                }
                              /> */}

                              <FamilyFields
                                familyDetails={familyDetails}
                                familyDisplayFields={familyDisplayFields}
                                familyFieldLabels={familyFieldLabels}
                                familyValidationErrors={familyValidationErrors}
                                handleFamilyDetailsChange={
                                  handleFamilyDetailsChange
                                }
                                handleAddFamilyDetails={handleAddFamilyDetails}
                                handleRemoveFamilyDetails={
                                  handleRemoveFamilyDetails
                                }
                              />

                              <EducationFields
                                educationDetails={educationDetails}
                                educationDispalyFields={educationDispalyFields}
                                educationFieldLabels={educationFieldLabels}
                                handleEducationDetailsChange={
                                  handleEducationDetailsChange
                                }
                                handleAddEducationDetails={
                                  handleAddEducationDetails
                                }
                                handleRemoveEducationDetails={
                                  handleRemoveEducationDetails
                                }
                              />
                            </div>
                          </div>

                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            <div className="board_form board_form_flex">
                              <h2>Current Address</h2>
                              <div className="form-group">
                                <TextField
                                  id="outlined-basic"
                                  label="Current Address"
                                  variant="outlined"
                                  type="text"
                                  value={currentAddress}
                                  onChange={(e) =>
                                    setCurrentAddress(e.target.value)
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <IndianStatesMui
                                  selectedState={currentState}
                                  onChange={(option) =>
                                    setcurrentState(option ? option : null)
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <IndianCitiesMui
                                  selectedState={currentState}
                                  selectedCity={currentCity}
                                  onChange={(option) =>
                                    setcurrentCity(option ? option : null)
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <TextField
                                  required
                                  id="outlined-basic"
                                  label="Current Pincode"
                                  variant="outlined"
                                  type="text"
                                  value={currentPincode}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const cleanedValue = value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    if (cleanedValue.length <= 6) {
                                      setcurrentPincode(cleanedValue);
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            <div className="board_form form_checkbox">
                              <label className="cstm_check">
                                Permanent Address Same as Current Address
                                <input
                                  className="form-control"
                                  type="checkbox"
                                  checked={sameAsCurrent}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </div>

                            <div className="board_form board_form_flex">
                              <h2>Permanent Address</h2>

                              <div className="form-group">
                                <TextField
                                  required
                                  id="outlined-basic"
                                  label="Permanent Address"
                                  variant="outlined"
                                  type="text"
                                  value={permanentAddress}
                                  onChange={(e) =>
                                    setPermanentAddress(e.target.value)
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <IndianStatesMui
                                  selectedState={permanentState}
                                  onChange={(option) =>
                                    setPermanentState(option ? option : null)
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <IndianCitiesMui
                                  selectedState={permanentState}
                                  selectedCity={permanentCity}
                                  onChange={(option) =>
                                    setPermanentCity(option ? option : null)
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <TextField
                                  required
                                  id="outlined-basic"
                                  label="Permanent Pincode"
                                  variant="outlined"
                                  type="text"
                                  value={permanentPincode}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const cleanedValue = value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    if (cleanedValue.length <= 6) {
                                      setPermanentPincode(cleanedValue);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="form-group ml-auto mr-auto text-center">
                              <button
                                className="btn onboardBtn btn_primary"
                                onClick={handleSubmit}
                                type="button"
                                disabled={
                                  !currentAddress &&
                                  !currentState &&
                                  !permanentCity &&
                                  !currentPincode &&
                                  !permanentAddress &&
                                  !permanentState &&
                                  !permanentCity &&
                                  !permanentPincode &&
                                  isSubmitting &&
                                  true
                                }
                              >
                                {isSubmitting ? "Submitting...." : "Submit"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                  {/* Form Screen End */}

                  {activeTab == 2 && (
                    <DocumentTab
                      documentData={documentData}
                      setDocumentData={setDocumentData}
                      getDocuments={getDocuments}
                      showMandotaryPer={showMandotaryPer}
                      showNonMandotaryPer={showNonMandotaryPer}
                      id={id}
                    />
                  )}

                  {activeTab == 3 && <CocTabPreonboarding cocData={cocData} />}

                  {activeTab == 4 && (
                    <FAQTab username={username} designation={designation} />
                  )}

                  {activeTab == 5 && allUserData.offer_letter_send && (
                    <LetterTab
                      allUserData={allUserData}
                      gettingData={gettingData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Dashboard Section End */}
    </>
  );
};

export default PreOnboardingUserMaster;
