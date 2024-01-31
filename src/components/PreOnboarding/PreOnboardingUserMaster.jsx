import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import "./onboardcss/onboard_style.css";
import "./onboardcss/onboard_responsive.css";
import "./onboardcss/onboard_animate.min.css";
import profilepic from "../../assets/imgs/user/naruto.png";
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

import Modal from "react-modal";
import ExtendJoining from "./ExtendJoining";
import IndianStatesMui from "../ReusableComponents/IndianStatesMui";
import LetterTab from "./LetterTab";
import ContactNumber from "../ReusableComponents/ContactNumber";
import DocumentTab from "./DocumentTab";
import FAQTab from "./FAQTab";
import ReadyToOnboardContent from "./ReadyToOnboardContent";
import { City, State } from "country-state-city";
import IndianCitiesMui from "../ReusableComponents/IndianCitiesMui";
import GuardianFields from "./GuardianFields";
import FamilyFields from "./FamilyFieldsTest";
import EducationFields from "./EducationFields";
import CocTabPreonboarding from "./CocTabPreonboarding";
import { baseUrl } from "../../utils/config";

const LanguageList = ["English", "Hindi", "Other"];

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
};

const guardianDisplayFields = [
  "guardian_name",
  "guardian_contact",
  "guardian_address",
];

const guardianFieldLabels = {
  guardian_name: "Guardian Name",
  guardian_contact: "Guardian Contact",
  guardian_address: "Guardian Address",
};

//Family
const initialFamilyDetailsGroup = {
  name: "",
  DOB: "",
  contact: "",
  occupation: "",
  annual_income: "",
  relation: "",
};

const familyDisplayFields = [
  "name",
  "DOB",
  "contact",
  "occupation",
  "relation",
  "annual_income",
];

const familyFieldLabels = {
  name: "Full Name",
  DOB: "Date of Birth",
  contact: "Contact Number",
  occupation: "Occupation",
  annual_income: "Annual Income",
  relation: "Relationship",
};

//Education
const initialEducationDetailsGroup = {
  institute_name: "",
  from_year: "",
  to_year: "",
  percentage: "",
  stream: "",
  specialization: "",
  title: "",
};

const educationDispalyFields = [
  "institute_name",
  "from_year",
  "to_year",
  "percentage",
  "stream",
  "specialization",
  "title",
];

const educationFieldLabels = {
  institute_name: "Institute Name",
  from_year: "From Year",
  to_year: "To Year",
  percentage: "Percentage",
  stream: "Stream",
  specialization: "Specialization",
  title: "Title",
};

const PreOnboardingUserMaster = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const whatsappApi = WhatsappAPI();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserName = decodedToken.name;
  const id = decodedToken.id;
  const { toastAlert } = useGlobalContext();

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
  const [hobbies, setHobbies] = useState("");
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
  const [permanentAddress, setPermanentAddress] = useState();
  const [permanentCity, setPermanentCity] = useState("");
  const [permanentState, setPermanentState] = useState("");
  const [permanentPincode, setPermanentPincode] = useState();

  //Current Address
  const [currentAddress, setCurrentAddress] = useState("");
  const [currentCity, setcurrentCity] = useState("");
  const [currentState, setcurrentState] = useState("");
  const [currentPincode, setcurrentPincode] = useState("");

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  //Extend Joining Date
  const [joingingExtendDate, setJoiningExtendDate] = useState("");
  const [joiningExtendReason, setJoiningExtendReason] = useState("");
  const [joingingExtendDocument, setJoiningExtendDocument] = useState(null);

  //contact
  const [emergencyContact, setEmergencyContact] = useState(null);

  //Guardian Fields
  // const [guardianName, setGuardianName] = useState("");
  // const [guardianContact, setGuardianContact] = useState("");
  // const [relationToGuardian, setRelationToGuardian] = useState("");
  // const [guardianAddress, setGuardianAddress] = useState("");

  //New Guardian Fields
  const [guardianDetails, setGuardianDetails] = useState([
    initialGuardianDetailsGroup,
  ]);

  //Family Fields
  const [familyDetails, setFamilyDetails] = useState([
    initialFamilyDetailsGroup,
  ]);

  //Education Fields
  const [educationDetails, setEducationDetails] = useState([
    initialEducationDetailsGroup,
  ]);

  //coc
  const [acceptCoc, setAcceptCoc] = useState(false);
  const [cocFlag, setCocFlag] = useState(false);

  const [showModal, setShowModal] = useState(true);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [nickName, setNickName] = useState("");
  const [getProfile, setGetProfile] = useState("");
  const [getNickName, setGetNickName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readyToOnboardModal, setReadyToOnboard] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [showMandotaryPer, setShowMandotaryPer] = useState(0);
  const [showNonMandotaryPer, setShowNonMandotaryPer] = useState(0);

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

  const fetchCOCData = async () => {
    try {
      const response = await axios.get(baseUrl+"newcoc");
      const data = response.data.data[1].coc_content;
      setCocData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    async function getGuardian() {
      const response = await axios.get(
        `${baseUrl}`+`get_single_guardian/${id}`
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
    setIsTourOpen(true);
    setReadyToOnboard(false);
    handleGetOnboard();
  };

  const openReactModal = () => {
    setIsModalOpen(true);
  };

  const closeReactModal = () => {
    setIsModalOpen(false);
  };

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
    const response = await axios.post(
      baseUrl+"get_user_doc",
      {
        user_id: id,
      }
    );
    setDocumentData(response.data.data);
  };

  useEffect(() => {
    const approveCount = documentData.filter(
      (item) => item.status == "Approved"
    ).length;

    const documentPercentageTemp = Math.ceil(
      (approveCount / documentData.length) * 100
    );

    setDocumentPercentage(documentPercentageTemp);

    const mandatoryCount = documentData.filter(
      (item) => item.document.isRequired == true
    ).length;

    const mandatoryFilledCount = documentData.filter(
      (item) => item.document.isRequired == true && item.doc_image
    ).length;

    const mandoatoryPercentageTemp = Math.ceil(
      (mandatoryFilledCount / mandatoryCount) * 100
    );
    setShowMandotaryPer(mandoatoryPercentageTemp);

    const nonMandatoryCount = documentData.filter(
      (item) => item.document.isRequired == false
    ).length;

    const nonMandatoryFilledCount = documentData.filter(
      (item) => item.document.isRequired == false && item.doc_image
    )?.length;

    const nonMandoatoryPercentageTemp = Math.ceil(
      (nonMandatoryFilledCount / nonMandatoryCount) * 100
    );
    setShowMandotaryPer(mandoatoryPercentageTemp);
    setShowNonMandotaryPer(nonMandoatoryPercentageTemp);
  }, [getDocuments]);

  const gettingData = () => {
    axios
      .get(`${baseUrl}`+`get_single_user/${id}`)
      .then((res) => {
        const fetchedData = res.data;

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
          emergency_contact,
          profileflag,
          image_url,
          nick_name,
          showOnboardingModal,
          image,
          coc_flag,
        } = fetchedData;
        setAllUserData(fetchedData);
        setUserName(user_name);
        setEmail(user_email_id);
        setPersonalEmail(PersonalEmail);
        setContact(user_contact_no);
        setPersonalContact(PersonalNumber);
        setPersonalEmail(PersonalEmail);
        setFatherName(fatherName);
        setMotherName(motherName);
        setHobbies(Hobbies);
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
        setEmergencyContact(emergency_contact);
        setGetProfile(image_url);
        setGetNickName(nick_name);
        {
          showOnboardingModal
            ? openReadyToOnboardModal()
            : !image && setShowImageSelector(true);
        }
        setCocFlag(coc_flag);
      });
  };
  useEffect(() => {
    gettingData();
    fetchCOCData();
    getDocuments();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("user_name", username);
    formData.append("user_email_id", email);
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("user_contact_no", Number(contact));
    formData.append("personal_number", personalContact);
    formData.append("Personal_email", personalEmail);
    formData.append("emergency_contact", Number(emergencyContact));

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
    formData.append("Hobbies", hobbies);
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
    await axios
      .put(`${baseUrl}`+`update_user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
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
      })
      .then(() => gettingData());

    //Posting/Update Guardian Details
    for (const elements of guardianDetails) {
      let payload = {
        user_id: id,
        guardian_name: elements.guardian_name,
        guardian_contact: elements.guardian_contact,
        guardian_address: elements.guardian_address,
      };
      if (elements.guardian_id) {
        payload.guardian_id = elements.guardian_id;
      }

      try {
        const response = await axios.put(
          baseUrl+"update_guardian",
          payload
        );
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
        const response = await axios.put(
          baseUrl+"update_family",
          payload
        );
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
        percentage: elements.percentage,
        stream: elements.stream,
        specialization: elements.specialization,
      };

      if (elements.education_id) {
        payload.education_id = elements.education_id;
      }
      try {
        const response = await axios.put(
          baseUrl+"update_education",
          payload
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error Updating Education details:", error);
      }
    }

    // After update send mail
    axios
      .post(baseUrl+"add_send_user_mail", {
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
  };

  useEffect(() => {
    async function getDetails() {
      const familyDataResponse = await axios.get(
        `${baseUrl}`+`get_single_family/${id}`
      );
      const educationDataResponse = await axios.get(
        `${baseUrl}`+`get_single_education/${id}`
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
    const updatedGuardianDetails = guardianDetails?.map((detail, idx) => {
      if (idx === index) {
        return { ...detail, [event.target.name]: event.target.value };
      }
      return detail;
    });
    setGuardianDetails(updatedGuardianDetails);
  };

  async function handleRemoveGuardianDetails(index) {
    const itemToRemove = guardianDetails[index];
    if (itemToRemove && itemToRemove.guardian_id) {
      try {
        await axios.delete(
          `${baseUrl}`+`delete_guardian/${itemToRemove.guardian_id}`
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
    const updatedFamilyDetails = familyDetails?.map((detail, idx) => {
      if (idx === index) {
        return { ...detail, [event.target.name]: event.target.value };
      }
      return detail;
    });
    setFamilyDetails(updatedFamilyDetails);
  };

  const handleRemoveFamilyDetails = async (index) => {
    const itemToRemove = familyDetails[index];
    if (itemToRemove && itemToRemove.family_id) {
      try {
        await axios.delete(
          `${baseUrl}`+`delete_family/${itemToRemove.family_id}`
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
    const updatedEducationDetails = educationDetails?.map((detail, i) => {
      if (i === index) {
        return { ...detail, [event.target.name]: event.target.value };
      }
      return detail;
    });
    setEducationDetails(updatedEducationDetails);
  };

  const handleRemoveEducationDetails = async (index) => {
    const itemToRemove = educationDetails[index];
    console.log(itemToRemove, "item to remove education");
    if (itemToRemove && itemToRemove.education_id) {
      try {
        await axios.delete(
          `${baseUrl}`+`delete_education/${itemToRemove.education_id}`
        );
        console.log(
          "Deleted Education detail from server:",
          itemToRemove.education_id
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
    setSpeakingLanguage(
      backendSpeakingLanguage ? backendSpeakingLanguage.split(",") : []
    );
  }, [backendSpeakingLanguage]);

  const handleLogOut = async (e) => {
    e.preventDefault();

    await axios.post(baseUrl+"log_out", {
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
    ["", null, 0]
  );

  function daysUntil(isoDateString) {
    const oneDay = 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const futureDate = new Date(isoDateString);

    const diffInTime = futureDate.getTime() - currentDate.getTime();

    return Math.ceil(diffInTime / oneDay);
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

    await axios.put(`${baseUrl}`+`update_user`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setShowModal(false);
    gettingData();
  };

  const handleCOC = async () => {
    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("coc_flag", true);

    await axios.put(`${baseUrl}`+`update_user`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toastAlert("Success");
    gettingData();
  };

  const handleGetOnboard = async () => {
    await axios.put(`${baseUrl}`+`update_user`, {
      user_id: id,
      showOnboardingModal: false,
    });
  };

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

  return (
    <>
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => {
          setIsTourOpen(false), setShowImageSelector(true);
        }}
      />

      <Modal
        className="Ready to Onboard"
        isOpen={readyToOnboardModal}
        onRequestClose={closeReadyToOnboardModal}
        contentLabel="Rocket Modal"
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

      <section className="section">
        <div className="page_wrapper">
          <div className="sidebar_wrapper">
            <div className="sidebar_header">
              <h2 onClick={() => setActiveTab(0)}>
                Home <i className="bi bi-house-fill" />
              </h2>
            </div>
            <div className="sidebar_items">
              <div
                className={`sidebar_itembox ${
                  activeTab == 1 ? "sidebar_item_active" : ""
                }`}
                id="sidebarFormBox"
                onClick={() => setActiveTab(1)}
              >
                {/* p-100 is percentage of document procedure */}
                <div
                  className={`progress-circle progressing p-${formFieldProgressPercentage}`}
                >
                  <div className="progress-circle-border">
                    <div className="left-half-circle" />
                    <div className="right-half-circle" />
                  </div>
                  <div className="progress-circle-content">
                    <i className="bi bi-journal-text" />
                  </div>
                </div>
                <h2>Form</h2>
                <h3>{formFieldProgressPercentage}%</h3>
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
                    className={`progress-circle progressing p-${documentPercentage}`}
                  >
                    <div className="progress-circle-border">
                      <div className="left-half-circle" />
                      <div className="right-half-circle" />
                    </div>
                    <div className="progress-circle-content">
                      <i className="bi bi-file-earmark-text" />
                    </div>
                  </div>
                  <h2 className="document_tab_name">Documents</h2>
                  <h3>{documentPercentage}%</h3>
                </div>
                <div className="sidebar_iteminfo">
                  <h3>
                    Mandotary <span>{showMandotaryPer}%</span>
                  </h3>
                  <h3>
                    Non Mandotary{" "}
                    <span>
                      {showNonMandotaryPer ? showNonMandotaryPer : 0}%
                    </span>
                  </h3>
                </div>
              </div>

              <div
                className={`sidebar_itembox  ${
                  activeTab == 3 ? "sidebar_item_active" : ""
                }`}
                id="sidebarPolicyBox"
                onClick={() => setActiveTab(3)}
              >
                <div className="progress-circle progressing p-26">
                  <div className="progress-circle-border">
                    <div className="left-half-circle" />
                    <div className="right-half-circle" />
                  </div>
                  <div className="progress-circle-content">
                    <i className="bi bi-book" />
                  </div>
                </div>
                <h2 className="policy_tab_name">Policy</h2>
              </div>

              <div
                className={`sidebar_itembox ${
                  activeTab == 7 ? "sidebar_item_active" : ""
                }`}
                id="sidebarLetterBox"
                onClick={() => setActiveTab(7)}
              >
                <div className="progress-circle progressing p-26">
                  <div className="progress-circle-border">
                    <div className="left-half-circle" />
                    <div className="right-half-circle" />
                  </div>
                  <div className="progress-circle-content">
                    <i className="bi bi-book" />
                  </div>
                </div>
                <h2 className="letter_tab_name">Letter</h2>
              </div>

              <div
                className={`sidebar_itembox ${
                  activeTab == 4 ? "sidebar_item_active" : ""
                }`}
                id="sidebarFaqBox"
                onClick={() => setActiveTab(4)}
              >
                <div className="progress-circle progressing p-100">
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
          </div>

          <div className="page_area">
            <div className="topnavbar">
              <div className="navbar_menu">
                <h3>
                  <span>{daysLeftCount}</span> days left to Join
                </h3>
              </div>
              <div className="user_box">
                <div className="user_name">
                  <h3>
                    <span>Welcome </span>
                    {getNickName}
                  </h3>
                </div>
                <div className="user_img">
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
            <div className="dashboard_body">
              <div className="dashboard_body_inner">
                {/* Welcome Screen Start */}
                {activeTab == 0 && (
                  <div className="welcome_board">
                    <div className="welcome_board_heading">
                      <h1>Welcome </h1>
                      <h2>{loginUserName}</h2>
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
                      <div className="imgtwo">
                        <img src={welcomeText} alt="welcome" />
                      </div>
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
                          <div className="board_form">
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
                                className="onboardModal"
                                isOpen={isModalOpen}
                                onRequestClose={closeReactModal}
                                contentLabel="Modal"
                                appElement={document.getElementById("root")}
                                shouldCloseOnOverlayClick={false}
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
                            <div className="form-group">
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
                                onChange={(e) => setFatherName(e.target.value)}
                              />
                            </div>

                            <div className="form-group form_select">
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={genderData}
                                // defaultValue={genderData[0]}
                                value={gender}
                                onChange={(e, newValue) => setGender(newValue)}
                                renderInput={(params) => (
                                  <TextField {...params} label="Gender" />
                                )}
                              />
                            </div>

                            <div className="from-group"></div>
                            {/* <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                name="father occupation "
                                placeholder="Father’s Occupation "
                              />
                            </div> */}
                            <div className="form-group">
                              <TextField
                                id="outlined-basic"
                                label="Mother Name"
                                variant="outlined"
                                type="text"
                                // className="form-control"
                                // name="mother name"
                                // placeholder="Mother Name"
                                value={motherName}
                                onChange={(e) => setMotherName(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <TextField
                                id="outlined-basic"
                                label="Hobbies"
                                variant="outlined"
                                type="text"
                                value={hobbies}
                                onChange={(e) => setHobbies(e.target.value)}
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
                                  <TextField {...params} label="Blood Group" />
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
                                    placeholder="Select languages"
                                  />
                                )}
                              />
                            </div>

                            <div className="form-group Muiform_date">
                              <TextField
                                id="outlined-basic"
                                label="Date Of Birth"
                                variant="outlined"
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <TextField
                                id="outlined-basic"
                                label="Nationality"
                                variant="outlined"
                                type="text"
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <ContactNumber
                                label="Emergency Contact"
                                parentComponentContact={emergencyContact}
                                setParentComponentContact={setEmergencyContact}
                              />
                            </div>

                            {/* <div className="form-group">
                              <TextField
                                id="outlined-basic"
                                label="Guardian Name"
                                variant="outlined"
                                type="text"
                                value={guardianName}
                                onChange={(e) =>
                                  setGuardianName(e.target.value)
                                }
                              />
                            </div>

                            <div className="form-group">
                              <ContactNumber
                                label="Guardian Contact"
                                parentComponentContact={guardianContact}
                                setParentComponentContact={setGuardianContact}
                              />
                            </div>

                            <div className="form-group">
                              <TextField
                                id="outlined-basic"
                                label="Relation With Guardian"
                                variant="outlined"
                                type="text"
                                value={relationToGuardian}
                                onChange={(e) =>
                                  setRelationToGuardian(e.target.value)
                                }
                              />
                            </div>
                            <div className="form-group">
                              <TextField
                                id="outlined-basic"
                                label="Guardian Address"
                                variant="outlined"
                                type="text"
                                value={guardianAddress}
                                onChange={(e) =>
                                  setGuardianAddress(e.target.value)
                                }
                              />
                            </div> */}
                            <GuardianFields
                              guardianDetails={guardianDetails}
                              guardianDisplayFields={guardianDisplayFields}
                              guardianFieldLabels={guardianFieldLabels}
                              handleGuardianDetailsChange={
                                handleGuardianDetailsChange
                              }
                              handleAddGuardianDetails={
                                handleAddGuardianDetails
                              }
                              handleRemoveGuardianDetails={
                                handleRemoveGuardianDetails
                              }
                            />

                            <FamilyFields
                              familyDetails={familyDetails}
                              familyDisplayFields={familyDisplayFields}
                              familyFieldLabels={familyFieldLabels}
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

                            {/* <FamilyFieldsTest
                              fieldDetails={fieldDetails}
                              setFieldDetails={setFieldDetails}
                            /> */}
                          </div>
                        </div>

                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                          <div className="board_form">
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
                                onChange={(e) =>
                                  setcurrentPincode(e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="board_form form_checkbox">
                            <label className="cstm_check">
                              Same as Current Addresss
                              <input
                                className="form-control"
                                type="checkbox"
                                checked={sameAsCurrent}
                                onChange={handleCheckboxChange}
                              />
                              <span className="checkmark"></span>
                            </label>
                          </div>

                          <div className="board_form">
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
                                  setPermanentState(option ? option : "")
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
                                key={permanentPincode}
                                required
                                id="outlined-basic"
                                label="Pincode"
                                variant="outlined"
                                type="text"
                                value={permanentPincode}
                                onChange={(e) =>
                                  setPermanentPincode(e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                          <div className="form-group ml-auto mr-auto text-center">
                            <button
                              className="btn btn_pill btn_cmn btn_white"
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
                                true
                              }
                            >
                              submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                {/* Form Screen End */}

                {/* Document Screen Start */}
                {activeTab == 2 && (
                  <DocumentTab
                    documentData={documentData}
                    setDocumentData={setDocumentData}
                    getDocuments={getDocuments}
                  />
                )}
                {/* Document Screen End */}

                {/* Policy Screen Start */}

                {/* {activeTab == 3 && (
                  <div className="policyarea">
                    <div className="thm_texthead">
                      <h2 className="text-center">Code of Conduct</h2>
                      <div className="thm_textarea">
                        <div className="thm_textbx">
                          <p>
                            As a team player, you are responsible to behave
                            appropriately at work. We outline our expectations
                            here. We can’t cover every single case of conduct,
                            but we trust you to always use your best judgment.
                            Always make decision in company’s best interest
                          </p>
                          <p>
                            Reach out to your manager or HR if you face any
                            issues or have any questions.
                          </p>
                        </div>
                        {renderList()}
                        {
                          <>
                            <div className="board_form form_checkbox">
                              <label className="cstm_check">
                                I accept Agreement
                                <input
                                  className="form-control"
                                  name="COC"
                                  type="checkbox"
                                  checked={acceptCoc}
                                  onChange={(e) =>
                                    setAcceptCoc(e.target.checked)
                                  }
                                />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                            <button
                              className="btn btn-primary"
                              onClick={handleCOC}
                            >
                              Accept
                            </button>
                          </>
                        }
                         <div className="thm_textbx">
                          <h3>A. Cyber security and digital devices</h3>
                          <p>
                            This section deals with all things digital at work.
                            We want to set some guidelines for using computers,
                            phones, our internet connection and social media to
                            ensure security and protect our assets.
                          </p>
                        </div>
                        <div className="thm_textbx">
                          <h3>(1) Internet usage</h3>
                          <p>
                            Our corporate internet connection is primarily for
                            business. But, you can occasionally use our
                            connection for personal purposes as long as they
                            don’t interfere with your job responsibilities.
                            Also, we expect you to temporarily halt personal
                            activities that slow down our internet connection.
                          </p>
                        </div> 
                      </div>
                      <div className="ml-auto mr-auto text-center"></div>
                    </div>
                  </div>c
                )} */}

                {/* COC SCREEN */}
                {activeTab == 3 && <CocTabPreonboarding cocData={cocData} />}
                {/* COC SCREEN */}

                {/* Policy Screen End */}

                {/* FAQ Screen Start */}
                {activeTab == 4 && <FAQTab />}
                {/* FAQ Screen End */}

                {activeTab == 5 && (
                  <form>
                    <div className="formarea">
                      {setAllUserData.joining_date_extend_status ==
                        "Approve" && <h1>Request is Accepted</h1>}
                      <div className="row spacing_lg">
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                          <div className="board_form">
                            <h2>
                              Extend Joining Date <span></span>
                            </h2>
                            <h3>
                              Your Current Joning Date is:{" "}
                              <span>{joiningDate}</span>
                            </h3>
                            <h3>
                              <span>{daysLeftCount}</span> days left to Join
                            </h3>
                            <div className="form-group">
                              <TextField
                                id="outlined-basic"
                                label="Extend To"
                                variant="outlined"
                                type="date"
                                value={joingingExtendDate}
                                onChange={(e) =>
                                  setJoiningExtendDate(e.target.value)
                                }
                              />
                            </div>

                            <div className="form-group">
                              <TextField
                                id="outlined-basic"
                                label="Reason"
                                variant="outlined"
                                type="text"
                                value={joiningExtendReason}
                                onChange={(e) =>
                                  setJoiningExtendReason(e.target.value)
                                }
                              />
                            </div>

                            <div className="form-group">
                              <ul className="doc_items_list">
                                <li
                                  className={
                                    joingingExtendDocument
                                      ? "doc_item doc_item_active"
                                      : "doc_item"
                                  }
                                >
                                  <p>Upload file</p>
                                  <input
                                    type="file"
                                    value=""
                                    onChange={(e) =>
                                      setJoiningExtendDocument(
                                        e.target.files[0]
                                      )
                                    }
                                  />
                                  <span
                                    className="delete"
                                    onClick={() =>
                                      setJoiningExtendDocument(null)
                                    }
                                  >
                                    <a href="#">
                                      <i className="bi bi-x-lg" />
                                    </a>
                                  </span>
                                </li>
                              </ul>
                            </div>

                            {/* <div className="form-group">
                              <input
                                type="file"
                                placeholder="upload file here"
                                value={joingingExtendDocument}
                                onChange={(e) =>
                                  setJoiningExtendDocument(e.target.files[0])
                                }
                              />
                            </div> */}
                          </div>
                        </div>
                        {allUserData?.joining_date_extend_status ==
                          "Reject" && (
                          <h1>
                            Request Rejected:{" "}
                            {allUserData?.joining_date_extend_reason}
                          </h1>
                        )}
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                          <div className="form-group ml-auto mr-auto text-center">
                            <button
                              className="btn btn_pill btn_cmn btn_white"
                              // onClick={handleJoiningExtend}
                            >
                              Request
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {activeTab == 7 && (
                  <LetterTab
                    allUserData={allUserData}
                    gettingData={gettingData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Dashboard Section End */}
      {/* Document Modal */}
      <div
        className="modal fade document_modal"
        id="documentModal"
        tabIndex={-1}
        aria-labelledby="documentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="documentModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn_pill btn_cmn btn_white"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile picture modal */}

      {showImageSelector && (
        <div
          className={`modal profileSetModal ${showModal ? "show" : ""}`}
          tabIndex={-1}
          role="dialog"
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body">
                <div>
                  {selectedImage && (
                    <div className="showImg">
                      <img src={imagePreview} alt="Selected" />
                    </div>
                  )}

                  <div className="chooseImg">
                    <div className="d-flex justify-content-between">
                      <h5>Choose Image:</h5>
                      <i
                        className="bi bi-x-circle-fill"
                        onClick={() => setShowImageSelector(true)}
                      />
                    </div>
                    <div className="chooseImgItem">
                      {images.map((image) => (
                        <img
                          key={image}
                          src={image}
                          // alt={imageName}
                          onClick={() => handleImageClick(image)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="formImg">
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <h5>Upload Image :</h5>
                        <input
                          className="form-control"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          required={false}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <h5>Nick Name :</h5>
                        <input
                          type="text"
                          className="form-control"
                          value={nickName}
                          onChange={(e) => setNickName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="alert_text">
                  <button
                    className="btn cmnbtn btn_success"
                    data-bs-dismiss="modal"
                    onClick={handleSubmitProfile}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreOnboardingUserMaster;
