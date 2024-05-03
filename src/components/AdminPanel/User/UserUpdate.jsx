import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { AiOutlineReload } from "react-icons/ai";
import Select from "react-select";
import jwtDecode from "jwt-decode";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import IndianStates from "../../ReusableComponents/IndianStates";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ContactNumber from "../../ReusableComponents/ContactNumber";
import ContactNumberReact from "../../ReusableComponents/ContactNumberReact";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DocumentTab from "../../PreOnboarding/DocumentTab";
import { baseUrl } from "../../../utils/config";
import OccupationList from "../../../assets/js/OccupationList";
import familyRelationList from "../../../assets/js/familyRelationList";
import { ToastContainer } from "react-toastify";
import IndianBankList from "../../../assets/js/IndianBankList";

const castOption = ["General", "OBC", "SC", "ST"];
const colourOptions = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Spanish", label: "Spanish" },
  { value: "Mandarin", label: "Mandarin" },
  { value: "French", label: "French" },
  { value: "Arabic", label: "Arabic" },
  { value: "Bengali", label: "Bengali" },
  { value: "Russian", label: "Russian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Indonesian", label: "Indonesian" },
  { value: "Urdu", label: "Urdu" },
  { value: "German", label: "German" },
  { value: "Japanese", label: "Japanese" },
  { value: "Swahili", label: "Swahili" },
  { value: "Marathi", label: "Marathi" },
  { value: "Telugu", label: "Telugu" },
  { value: "Turkish", label: "Turkish" },
  { value: "Tamil", label: "Tamil" },
  { value: "Vietnamese", label: "Vietnamese" },
  { value: "Italian", label: "Italian" },
  { value: "Korean", label: "Korean" },
  { value: "Persian", label: "Persian" },
  { value: "Polish", label: "Polish" },
  { value: "Dutch", label: "Dutch" },
  { value: "Greek", label: "Greek" },
  { value: "Thai", label: "Thai" },
  { value: "Other", label: "Other" },
];

const initialFamilyDetailsGroup = {
  relation: "",
  name: "",
  DOB: "",
  contact: "",
  occupation: "",
  annual_income: "",
};

const familyDisplayFields = [
  "relation",
  "name",
  "DOB",
  "contact",
  "occupation",
  "annual_income",
];

const familyFieldLabels = {
  relation: "Relationship",
  name: "Full Name",
  DOB: "Date of Birth",
  contact: "Contact Number",
  occupation: "Occupation",
  annual_income: "Annual Income",
};

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

const UserUpdate = () => {
  const whatsappApi = WhatsappAPI();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { id } = useParams();
  const [usersData, getUsersData] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toastAlert, toastError } = useGlobalContext();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  // Genral Information Tab-------------------Start------------------------------------
  // ---------------------Prsonal Info State Start
  const [username, setUserName] = useState("");
  const [profile, setProfile] = useState([]);
  const [personalEmail, setPersonalEmail] = useState("");
  const [personalContact, setPersonalContact] = useState();
  const [alternateContact, setAlternateContact] = useState(null);
  const [isValidcontact1, setValidContact1] = useState(true);
  const [isContactTouched, setisContactTouched] = useState(false);
  const [isContactTouched1, setisContactTouched1] = useState(false);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("Indian");
  const [maritialStatus, setMaritialStatus] = useState("");
  const [dateOfMarraige, setDateOfMarraige] = useState("");
  const [spouseName, setSpouseName] = useState("");
  //---------------------Personal Info State End

  //--------------------Official Info State Start
  const [jobType, setJobType] = useState("");
  const [jobTypeData, setJobTypeData] = useState([]);
  const [department, setDepartment] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);
  const [subDepartmentData, setSubDepartmentData] = useState([]);
  const [subDepartment, setSubDeparment] = useState([]);
  const [designation, setDesignation] = useState("");
  const [designationData, setDesignationData] = useState([]);
  const [reportL1, setReportL1] = useState("");
  const [reportL2, setReportL2] = useState("");
  const [reportL3, setReportL3] = useState("");
  const [roles, setRoles] = useState("");
  const [roledata, getRoleData] = useState([]);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [contact, setContact] = useState();
  const [isValidcontact, setValidContact] = useState(true);
  const [loginId, setLoginId] = useState("");
  const [loginResponse, setLoginResponse] = useState("");
  const [lastIndexUsed, setLastIndexUsed] = useState(-1);
  const [password, setPassword] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [sitting, setSitting] = useState();
  const [sittingValue, setSittingValue] = useState({});
  const [roomId, setRoomId] = useState("");
  const [refrenceData, setRefrenceData] = useState([]);

  //--------------------Official Info State End
  // Genral Information Tab-------------------End------------------------------------

  // Other Information Tab-------------------Start------------------------------------
  //--------------------Other Info State Start
  const [city, setCity] = useState("");
  const [cityData, setCityData] = useState([]);

  const [currentAddress, setCurrentAddress] = useState("");
  const [currentCity, setcurrentCity] = useState("");
  const [currentState, setcurrentState] = useState("");
  const [currentPincode, setcurrentPincode] = useState("");

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [hobbiesData, setHobbiesData] = useState([]);
  const [tempLanguage, setTempLanguage] = useState([]);
  const [speakingLanguage, setSpeakingLanguage] = useState("");
  const [cast, setCast] = useState("");

  //--------------------Other Info State End

  //--------------------Bank Info State Start
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [banktype, setAccountType] = useState("");

  //--------------------Bank Info State End
  // Other Information Tab-------------------End------------------------------------

  //--------------------Family Info State Start
  const [familyDetails, setFamilyDetails] = useState([
    initialFamilyDetailsGroup,
  ]);
  const [familyValidationErrors, setFamilyValidationErrors] = useState({});
  // handleAddFamilyDetails define below this funciton
  //--------------------Family Info State End

  //--------------------Education Info State Start
  const [educationDetails, setEducationDetails] = useState([
    initialEducationDetailsGroup,
  ]);

  // handleEducationDetailsChange define below this funciton
  //--------------------Education Info State End

  // Document Information Tab-------------------Start------------------------------------
  const [documentData, setDocumentData] = useState([]);

  // Document Information Tab-------------------End------------------------------------

  const [incomingPassword, setIncomingPassword] = useState("");
  const [uid, setUID] = useState({ name: "sumit.jpg" });
  const [releavingDate, setReleavingDate] = useState("");
  const [salary, setSalary] = useState(0);
  const [incomingUserStatus, setIncomingUserStatus] = useState("");

  const [otherDocuments, setOtherDocuments] = useState();
  const [higestQualification, setHigestQualification] = useState("");
  const [defaultSeatData, setDefaultSeatData] = useState([]);

  const higestQualificationData = [
    "10th",
    "12th",
    "Diploma",
    "Graduation",
    "Post Graduation",
    "Other",
  ];
  const bankTypeData = ["Saving A/C", "Current A/C", "Salary A/C"];
  const genderData = ["Male", "Female", "Other"];

  const familyRelations = [
    "Brother",
    "Sister",
    "Mother",
    "Father",
    "Son",
    "Daughter",
    "Aunt",
    "Uncle",
    "Cousin",
    "Grandmother",
    "Grandfather",
    "Nephew",
    "Niece",
    "Stepmother",
    "Stepfather",
    "Stepson",
    "Stepdaughter",
    "Half-brother",
    "Half-sister",
    // Add more relations as needed
  ];

  const bloodGroupData = [
    "A+ (A Positive)",
    "A- (A Negetive)",
    "B+ (B Positive)",
    "B- (B Negetive)",
    "AB+ (AB Positive)",
    "AB- (AB Negetive)",
    "O+ (O Positive)",
    "O- (O Negetive)",
  ];
  const statusData = ["Active", "Exit", "PreOnboard"];
  const maritialStatusData = ["Married", "Unmarried"];

  // login progress bar---------------------------------------------------------------------
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fields = [
      username,
      personalEmail,
      personalContact,
      alternateContact,
      gender,
      dateOfBirth,
      age,
      nationality,
      maritialStatus,
      jobType,
      department,
      designation,
      reportL1,
      reportL2,
      reportL3,
      roles,
      email,
      contact,
      loginId,
      password,
      userStatus,
      joiningDate,
      currentAddress,
      currentCity,
      currentState,
      currentState,
      currentPincode,
      address,
      city,
      state,
      pincode,
      bloodGroup,
      hobbies,
      speakingLanguage,
      cast,
      bankName,
      bankAccountNumber,
      beneficiary,
      IFSC,
      banktype,
    ];
    const filledFields = fields.filter((field) => field).length;
    const progressPercentage = (filledFields / fields.length) * 100;
    setProgress(progressPercentage);

    // Display toast notifications at specific milestones
    const milestones = [25, 50, 75, 100];
    if (milestones.includes(progressPercentage)) {
    }
  }, [
    username,
    personalEmail,
    personalContact,
    alternateContact,
    gender,
    dateOfBirth,
    age,
    nationality,
    maritialStatus,
    jobType,
    department,
    designation,
    reportL1,
    reportL2,
    reportL3,
    roles,
    email,
    contact,
    loginId,
    password,
    userStatus,
    joiningDate,
    currentAddress,
    currentCity,
    currentState,
    currentState,
    currentPincode,
    address,
    city,
    state,
    pincode,
    bloodGroup,
    hobbies,
    speakingLanguage,
    cast,
    bankName,
    bankAccountNumber,
    beneficiary,
    IFSC,
    banktype,
  ]);

  useEffect(() => {
    if (department) {
      axios
        .get(`${baseUrl}` + `get_subdept_from_dept/${department}`)
        .then((res) => setSubDepartmentData(res.data));
    }
  }, [department]);

  useEffect(() => {
    if (department) {
      axios
        .get(baseUrl + `get_all_designations_by_deptId/${department}`)
        .then((res) => {
          setDesignationData(res.data.data);
        });
    }
  }, [department]);

  useEffect(() => {
    const GetAllData = async () => {
      const AllRolesResposne = await axios.get(baseUrl + "get_all_roles");

      const AllDepartmentResponse = await axios.get(
        baseUrl + "get_all_departments"
      );

      const RemainingSittingResponse = await axios.get(
        baseUrl + "not_alloc_sitting"
      );

      const AllSittingsResponse = await axios.get(baseUrl + "get_all_sittings");

      const AllUsersResponse = await axios.get(baseUrl + "get_all_users");

      const AllJobTypesResponse = await axios.get(
        baseUrl + "get_all_job_types"
      );

      getRoleData(AllRolesResposne.data.data);
      getDepartmentData(AllDepartmentResponse.data);
      setJobTypeData(AllJobTypesResponse.data.data);
      getUsersData(AllUsersResponse.data.data);
      setDefaultSeatData(AllSittingsResponse.data.data);
      setRefrenceData(RemainingSittingResponse.data.data);
    };
    GetAllData();
  }, []);

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

  function getOtherDocument() {
    axios.get(`${baseUrl}` + `get_user_other_fields/${id}`).then((res) => {
      setOtherDocuments(res.data.data);
    });
  }

  async function getCitiesData() {
    axios.get(baseUrl + "get_all_cities").then((res) => {
      setCityData(res.data.data);
    });
  }

  async function getDocuments() {
    const response = await axios.post(baseUrl + "get_user_doc", {
      user_id: id,
    });
    setDocumentData(response.data.data);
  }

  useEffect(() => {
    getCitiesData();
    getDocuments();
  }, [id]);

  //  -------------------------------------------------------hobbie multiselect logic start--------------------------------------------------------
  useEffect(() => {
    axios.get(`${baseUrl}get_all_hobbies`).then((res) => {
      const formattedHobbies = res.data.data.map((hobby) => ({
        value: hobby.hobby_id,
        label: hobby.hobby_name,
      }));
      setHobbiesData(formattedHobbies);
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}get_single_user/${id}`);
        const fetchedData = response.data;

        const preselectedHobbies = fetchedData?.Hobbies?.map((hobbyId) => ({
          value: hobbyId,
          label:
            hobbiesData?.find((hobby) => hobby?.value === hobbyId)?.label ||
            hobbyId.toString(),
        }));
        setHobbies(preselectedHobbies);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [id, hobbiesData]);

  const handleChange = (selectedOptions) => {
    setHobbies(selectedOptions || []);
  };
  // -----------------------------------------------------------------------------hobby logic END------------------------------------------------------------

  useEffect(() => {
    axios.get(`${baseUrl}` + `get_single_user/${id}`).then((res) => {
      const fetchedData = res.data;
      const {
        user_name,
        role_id,
        user_email_id,
        user_contact_no,
        user_login_id,
        user_login_password,
        sitting_id,
        room_id,
        dept_id,
        job_type,
        Report_L1,
        Report_L2,
        Report_L3,
        PersonalEmail,
        PersonalNumber,
        user_designation,
        UID,
        joining_date,
        releaving_date,
        salary,
        SpokenLanguages,
        Gender,
        Nationality,
        DOB,
        user_status,
        Age,
        Hobbies,
        BloodGroup,
        MartialStatus,
        DateOfMarriage,
        spouse_name,
        sub_dept_id,
        bank_name,
        ifsc_code,
        beneficiary,
        account_no,
        account_type,
        permanent_city,
        permanent_address,
        permanent_state,
        permanent_pin_code,
        current_address,
        current_city,
        current_state,
        current_pin_code,
        cast_type,
        alternate_contact,
      } = fetchedData;
      setSpouseName(spouse_name);
      setUserName(user_name);
      setUserStatus(user_status);
      setIncomingUserStatus(user_status);
      setEmail(user_email_id);
      setLoginId(user_login_id);
      setContact(user_contact_no);
      setPassword(user_login_password);
      setIncomingPassword(user_login_password);
      setRoles(role_id);
      setDepartment(dept_id);
      setSitting(sitting_id);
      setRoomId(room_id);
      setPersonalContact(PersonalNumber);
      setPersonalEmail(PersonalEmail);
      setJobType(job_type);
      setReportL1(Report_L1);
      setReportL2(Report_L2);
      setReportL3(Report_L3);
      setDesignation(user_designation);
      setUID(UID);

      setJoiningDate(joining_date?.split("T")?.[0]);
      setReleavingDate(releaving_date?.split("T")?.[0]);
      setSalary(salary);
      let lang = SpokenLanguages.split(",");
      let modifiedLang = lang
        ?.filter((item) => item.trim() !== "")
        ?.map((item) => ({ value: item, label: item }));
      setTempLanguage(modifiedLang);
      setGender(Gender);
      setNationality(Nationality);
      setDateOfBirth(DOB.split("T")?.[0]);
      setAge(Age);
      setHobbies(Hobbies);
      setBloodGroup(BloodGroup);
      setMaritialStatus(MartialStatus);
      setDateOfMarraige(DateOfMarriage?.split("T")?.[0]);
      setSubDeparment(sub_dept_id);
      setBankName(bank_name);
      setIFSC(ifsc_code);
      setAccountType(account_type);
      setBankAccountNumber(account_no);
      setBeneficiary(beneficiary);
      setCity(permanent_city);
      setAddress(permanent_address);
      setState(permanent_state);
      setPincode(permanent_pin_code);
      setCurrentAddress(current_address);
      setcurrentCity(current_city);
      setcurrentState(current_state);
      setcurrentPincode(current_pin_code);
      setCast(cast_type);
      setAlternateContact(alternate_contact);
    });

    getOtherDocument();
  }, [id]);

  useEffect(() => {
    const InitialSitting = defaultSeatData?.find(
      (object) => object.sitting_id == sitting
    );

    setRefrenceData((prev) => [InitialSitting, ...prev]);
  }, [defaultSeatData]);

  useEffect(() => {
    const SelectedSitting = refrenceData?.find(
      (object) => object?.sitting_id == sitting
    );
    const updatedSitting = {
      value: SelectedSitting?.sitting_id,
      label: `${SelectedSitting?.sitting_ref_no} | ${SelectedSitting?.sitting_area}`,
    };

    setSittingValue(updatedSitting);
  }, [sitting, refrenceData]);

  const handleSubmit = async (e) => {
    // setLoading(true);
    e.preventDefault();
    if (!jobType) {
      return toastError("Job Type is Required");
    } else if (!department || department == "") {
      return toastError("Department is Required");
    } else if (
      !subDepartment ||
      subDepartment == "" ||
      subDepartment.length === 0
    ) {
      return toastError("Sub Department is Required");
    } else if (!designation || designation == "") {
      return toastError("Designatoin is Required");
    } else if (!reportL1 || reportL1 == "") {
      return toastError("Report L1 Is Required");
    } else if (!personalEmail || personalEmail == "") {
      return toastError("Personal Email is Required");
    } else if (!personalContact || personalContact == "") {
      return toastError("Personal Contact is Required");
    } else if (!alternateContact || alternateContact == "") {
      return toastError("Alternate Contact is Required");
    } else if (!loginId || loginId == "") {
      return toastError("Login Id is Required");
    } else if (!password || password == "") {
      return toastError("Password is Required");
    } else if (!gender || gender == "") {
      return toastError("Gender is Required");
    } else if (!nationality || nationality == "") {
      return toastError("Nationality is Required");
    } else if (!dateOfBirth || dateOfBirth == "") {
      return toastError("Date of Birth is Required");
    } else if (
      !maritialStatus ||
      maritialStatus == "" ||
      maritialStatus.length == 0
    ) {
      return toastError("Maritial Status is Required");
    } else if (!joiningDate || joiningDate == "") {
      return toastError("Joining Date is Required");
    } else if (!userStatus || userStatus == "") {
      return toastError("Status is Required");
    } else if (!username || username == "") {
      return toastError("User Name Error is required");
    }
    const formData = new FormData();
    //personal info payload Start
    // formData.append("user_id", id);
    formData.append("user_name", username);
    formData.append("image", profile);
    formData.append("Personal_email", personalEmail);
    formData.append("personal_number", personalContact);
    formData.append("alternate_contact", alternateContact);
    formData.append("Gender", gender);
    formData.append("DOB", dateOfBirth);
    formData.append("Age", age);
    formData.append("Nationality", nationality);
    formData.append("MartialStatus", maritialStatus);
    formData.append("DateofMarriage", dateOfMarraige);
    formData.append("spouse_name", spouseName);
    //personal info payload End

    //offcial info payload Start
    formData.append("job_type", jobType);
    formData.append("dept_id", department);
    formData.append("sub_dept_id", subDepartment);
    formData.append("user_designation", designation);
    formData.append("report_L1", Number(reportL1));
    formData.append("report_L2", Number(reportL2));
    formData.append("report_L3", Number(reportL3));
    formData.append("role_id", roles);
    formData.append("user_email_id", email);
    formData.append("user_contact_no", contact ? contact : "");
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("user_status", userStatus);
    formData.append("sitting_id", jobType === "WFH" ? 0 : Number(sitting));
    formData.append(
      "room_id",
      jobType === "WFH" || jobType === "WFHD" ? "1" : 1 //roomId
    );
    formData.append("joining_date", joiningDate);
    // formData.append("room_id", roomId);

    //offcial info payload End

    // formData.append("UID", uid);
    // formData.append("releaving_date", releavingDate);
    // formData.append("salary", Number(salary));

    // formData.append("SpokenLanguages", speakingLanguage);

    // formData.append(
    //   "Hobbies",
    //   hobbies?.map((option) => option?.value)
    // );
    // formData.append("BloodGroup", bloodGroup);
    // formData.append("permanent_address", address);
    // formData.append("permanent_city", city);
    // formData.append("permanent_state", state);
    // formData.append("permanent_pin_code", Number(pincode));

    // formData.append("bank_name", bankName);
    // formData.append("ifsc_code", IFSC);
    // formData.append("account_no", bankAccountNumber);

    // formData.append("highest_qualification_name", higestQualification);
    // formData.append("cast_type", cast);
    formData.append("att_status", "document_upload");

    const formDataa = new FormData();
    if (personalEmail && personalContact) {
      setLoading(true);

      await axios
        .put(
          `${baseUrl}` + `update_user_for_general_information/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          setLoading(false);
        })
        .catch(function (err) {
          setLoading(false);
          console.error(err);
        });

      // new api ------------------------------------------------------
      await axios
        .post(baseUrl + "update_user_history", formData)
        .then((res) => {
          console.log("History sent successfully:", res);
        })
        .catch((error) => {
          console.log("Failed to send History:", error);
        });

      if (reportL1 !== "") {
        axios
          .post(baseUrl + "add_send_user_mail", {
            email: email,
            subject: "User Registration",
            text: "A new user has been registered.",
            login_id: loginId,
            name: username,
            password: password,
          })
          .then((res) => {
            // console.log("Email sent successfully:", res.data);
          })
          .catch((error) => {
            // console.log("Failed to send email:", error);
          });

        whatsappApi.callWhatsAPI(
          "Extend Date by User",
          JSON.stringify(personalContact),
          username,
          ["You have assinge Report L1", "ok"]
        );
      }

      const mandatoryDocTypes = ["10th", "12th", "Graduation"];

      const isMandatoryDocMissing = documentData.some(
        (doc) =>
          mandatoryDocTypes.includes(doc.document.doc_type) &&
          doc.doc_image &&
          doc.file
      );

      if (isMandatoryDocMissing) {
        toastAlert("Please fill all mandatory fields");
        return;
      } else {
        for (const document of documentData) {
          if (document.file) {
            let formData = new FormData();
            formData.append("doc_image", document.file);
            formData.append("_id", document._id);
            formData.append(
              "status",
              document.status == "Document Uploaded"
                ? "Verification Pending"
                : document.status
            );
            await axios.put(baseUrl + "update_user_doc", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          } else {
            console.log(`No file uploaded for document ${document._id}`);
          }
        }
        // toastAlert("Documents Updated");
        getDocuments();
      }

      if (incomingPassword !== password) {
        whatsappApi.callWhatsAPI(
          "User Password Update by Admin",
          contact,
          username,
          [loginId, password, "http://jarvis.work/"]
        );
      }

      if (incomingUserStatus !== userStatus) {
        whatsappApi.callWhatsAPI("User Status Change", contact, username, [
          username,
          userStatus,
        ]);
      }

      toastAlert("User Update");
      setIsFormSubmitted(true);

      for (const element of otherDocuments) {
        formDataa.append("id", element.id);
        formDataa.append("field_name", element.field_name);
        formDataa.append("lastupdated_by", loginUserId);
        formDataa.append("field_value", element.field_value);
        axios.put(`${baseUrl}` + `updateuserotherfielddata/${id}`, formDataa, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        formDataa.delete("id");
        formDataa.delete("field_name");
        formDataa.delete("lastupdated_by");
        formDataa.delete("field_value");
      }
    } else {
      if (contact.length !== 10) {
        if (isValidcontact == false)
          toastError("Enter Phone Number in Proper Format");
      } else if (validEmail != true) {
        alert("Enter Valid Email");
      }
    }
  };

  const handleSubmitOtherDetails = async (e) => {
    e.preventDefault();
    if (!currentAddress || currentAddress == "") {
      return toastError("Current Address is required");
    } else if (!currentCity || currentCity == "") {
      return toastError("Current city is required");
    } else if (!currentState || currentState == "") {
      return toastError("Current state is required");
    } else if (!currentPincode || currentPincode == "") {
      return toastError("Current Pincode is required");
    }
    try {
      const response = await axios.put(
        baseUrl + `update_user_for_other_details/${id}`,
        {
          permanent_city: city,
          permanent_address: address,
          permanent_state: state,
          permanent_pin_code: Number(pincode),
          current_address: currentAddress,
          current_city: currentCity,
          current_pin_code: Number(currentPincode),
          current_state: currentState,
          BloodGroup: bloodGroup,
          Hobbies: hobbies.map((hobby) => hobby.value),
          SpokenLanguages: speakingLanguage,
          cast_type: cast,
        }
      );
      toastAlert("Other Details Update");
      console.log("Update successful", response.data);
    } catch (error) {
      console.error(
        "Update failed",
        error.response ? error.response.data : error
      );
    }
  };
  const [bankProveImage, setBankProveImage] = useState(null);
  const handleSubmitBank = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bank_name", bankName);
    formData.append("account_no", bankAccountNumber);
    formData.append("ifsc_code", IFSC);
    formData.append("beneficiary", beneficiary);
    formData.append("account_type", banktype);
    formData.append("bank_proof_image", bankProveImage);

    if (!bankName || bankName == "") {
      return toastError("bank name is required");
    } else if (!bankAccountNumber || bankAccountNumber == "") {
      return toastError("bank account number is required");
    } else if (!IFSC || IFSC == "" || IFSC.length < 11) {
      return toastError("IFSC is required and length must be 11 digit");
    } else if (!banktype || banktype == "") {
      return toastError("Bank Type is required");
    }
    try {
      const response = await axios.put(
        baseUrl + `update_user_for_bank_details/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Bank info payload Start
          // bank_name: bankName,
          // account_no: bankAccountNumber,
          // ifsc_code: IFSC,
          // beneficiary: beneficiary,
          // account_type: banktype,
          // Bank info payload End
        }
        // setActiveAccordionIndex((prev) => prev + 1)
      );
      toastAlert("Bank Details Update");
      console.log("Update successful", response.data);
    } catch (error) {
      console.error(
        "Update failed",
        error.response ? error.response.data : error
      );
    }
  };
  const handleSubmitFamily = () => {
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
        toastAlert("Family Details Update");
        const response = axios.put(baseUrl + "update_family", payload);
      } catch (error) {
        console.error("Error updating family details:", error);
      }
    }
  };
  const handleSubmitEducation = () => {
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
        toastAlert("Family Details Update");
        const response = axios.put(baseUrl + "update_education", payload);
      } catch (error) {
        console.error("Error Updating Education details:", error);
      }
    }
  };

  function handleLanguageSelect(selectedOption) {
    setTempLanguage(selectedOption);
  }

  useEffect(() => {
    const test = tempLanguage?.map((option) => option.value).join();
    setSpeakingLanguage(test);
  }, [tempLanguage]);
  function otherDocumentNameChangeHandle(e, index) {
    setOtherDocuments((prev) => {
      const newOtherDocuments = [...prev];
      newOtherDocuments[index] = {
        ...newOtherDocuments[index],
        field_name: e.target.value,
      };
      return newOtherDocuments;
    });
  }
  const otherDocumentImageChangeHandler = (e, index) => {
    otherDocuments[index] = {
      ...otherDocuments[index],
      field_value: e.target.files[0],
    };
  };
  const handleAccordionButtonClick = (index) => {
    // {
    setActiveAccordionIndex(index);
    //     alert("fill all the fields");
    // }
  };

  // Number validation
  function handleEmailChange(e) {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail === "") {
      setValidEmail(false);
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setValidEmail(emailRegex.test(newEmail));
    }
  }

  function handleContactChange(event) {
    if (event.target.value.length <= 10) {
      const newContact = event.target.value;
      setContact(newContact);

      if (newContact === "") {
        setValidContact(false);
      } else {
        setValidContact(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact)
        );
      }
    }
  }

  function handlePersonalContactChange(event) {
    if (event.target.value.length <= 10) {
      const newContact1 = event.target.value;
      setPersonalContact(newContact1);

      if (newContact1 === "") {
        setValidContact1(false);
      } else {
        setValidContact1(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact1)
        );
      }
    }
  }

  function handleContentBlur() {
    setisContactTouched(true);
    setisContactTouched1(true);
    if (contact.length < 10) {
      setValidContact(false);
      setValidContact1(false);
    }
  }

  // After form submittion navigate
  if (isFormSubmitted) {
    // return <Navigate to="/admin/user-overview" />;
  }

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

  const generateLoginId = async () => {
    const userName = username.trim().toLowerCase().split(" ");

    // Define login ID options
    const loginIdOptions = [
      userName[0], // loginIdOption1
      userName[0] + (userName[1] ? userName[1].charAt(0) : ""), // loginIdOption2
      (userName[0] ? userName[0].charAt(0) : "") + (userName[1] || ""), // loginIdOption3
      userName.join("."), // loginIdOption4
    ];
    const nextIndex = (lastIndexUsed + 1) % loginIdOptions.length;
    setLastIndexUsed(nextIndex);
    const generatedLoginId = loginIdOptions[nextIndex];
    setLoginId(generatedLoginId);

    await axios
      .post(baseUrl + `check_login_exist`, {
        user_login_id: loginId,
      })
      .then((res) => {
        setLoginResponse(res.data.message);
      });

    if (generatedLoginId?.length > 0) {
      setMandatoryFieldsEmpty({ ...mandatoryFieldsEmpty, loginId: false });
    }
  };
  // const generateLoginId = () => {
  //   const userName = username.trim().toLowerCase().split(" ");

  //   const loginIdOption1 = userName[0] + userName[1].charAt(0);

  //   const loginIdOption2 = userName[0].charAt(0) + userName[1];

  //   const loginIdOption3 = userName.join(".");

  //   // Randomly choose one of the options
  //   const randomIndex = Math.floor(Math.random() * 3);
  //   const generatedLoginId = [loginIdOption1, loginIdOption2, loginIdOption3][
  //     randomIndex
  //   ];

  //   setLoginId(generatedLoginId);

  //   if (generatedLoginId.length > 0) {
  //     setMandatoryFieldsEmpty({ ...mandatoryFieldsEmpty, loginId: false });
  //   }
  // };

  const handleLoginIdChange = (event) => {
    const selectedLoginId = event.target.value;
    setLoginId(selectedLoginId);
  };
  const calculateAge = (dob) => {
    const currentDate = new Date();
    const birthDate = new Date(dob);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const age = calculateAge(selectedDate);

    if (age < 15) {
      window.alert("Your age must be greater than 15 years.");
    } else {
      setDateOfBirth(selectedDate);
      setAge(age);
    }
  };

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

  const accordionButtons = [
    "General",
    "Other Details",
    "Education & Family",
    "Documents Update",
  ];

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setSameAsCurrent(checked);
    if (checked) {
      setAddress(currentAddress);
      setCity(currentCity);
      setState(currentState);
      setPincode(currentPincode);
    } else {
      setAddress("");
      setCity("");
      setState("");
      setPincode("");
    }
  };

  const genralFields = (
    <>
      <div className="personal_header">Personal Details</div>
      <FieldContainer
        label="Full Name"
        astric={true}
        fieldGrid={3}
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
      <FieldContainer
        label="Personal Email"
        astric={true}
        type="email"
        fieldGrid={3}
        required={false}
        value={personalEmail}
        onChange={(e) => setPersonalEmail(e.target.value)}
      />
      <FieldContainer
        label="Personal Contact "
        astric={true}
        type="number"
        fieldGrid={3}
        value={personalContact}
        required={false}
        onChange={handlePersonalContactChange}
        onBlur={handleContentBlur}
      />
      {isContactTouched1 && !isValidcontact1 && (
        <p style={{ color: "red" }}>*Please enter a valid Number</p>
      )}
      <ContactNumberReact
        astric={true}
        label="Alternate Contact"
        parentComponentContact={alternateContact}
        setParentComponentContact={setAlternateContact}
      />
      <div className="form-group col-3">
        <label className="form-label">
          Gender <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={genderData?.map((option) => ({
            value: `${option}`,
            label: `${option}`,
          }))}
          value={{
            value: gender,
            label: `${gender}`,
          }}
          onChange={(e) => {
            setGender(e.value);
          }}
          required
        />
      </div>
      <div className="from-group col-3">
        <label className="form-label">
          DOB <sup style={{ color: "red" }}>*</sup>
        </label>
        <input
          label="DOB"
          type="date"
          className="form-control"
          value={dateOfBirth}
          onChange={handleDateChange}
        />
      </div>
      {dateOfBirth !== "" && (
        <FieldContainer fieldGrid={3} label="Age" value={age} />
      )}
      <FieldContainer
        label="Nationality"
        astric={true}
        fieldGrid={3}
        value={nationality}
        onChange={(e) => setNationality(e.target.value)}
      />
      <div className="form-group col-3">
        <label className="form-label">
          Maritial Status <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={maritialStatusData?.map((option) => ({
            value: `${option}`,
            label: `${option}`,
          }))}
          value={{
            value: maritialStatus,
            label: `${maritialStatus}`,
          }}
          onChange={(e) => {
            setMaritialStatus(e.value);
          }}
          required={false}
        />
      </div>
      {maritialStatus == "Married" && (
        <FieldContainer
          label="Spouse Name"
          type="text"
          fieldGrid={3}
          value={spouseName}
          onChange={(e) => setSpouseName(e.target.value)}
          required={false}
        />
      )}
      {maritialStatus == "Married" && (
        <FieldContainer
          label="Date Of Marriage"
          type="date"
          fieldGrid={3}
          value={dateOfMarraige}
          onChange={(e) => setDateOfMarraige(e.target.value)}
          required={false}
        />
      )}
      {/* Other Info Inputs------------------------End------------ */}

      {/* Official Info Inputs------------------------Start------------ */}
      <div className="personal_header">Official Details</div>
      <div className="form-group col-3">
        <label className="form-label">
          Job Type <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={jobTypeData?.map((option) => ({
            value: `${option.job_type}`,
            label: `${option.job_type}`,
          }))}
          value={{
            value: jobType,
            label: `${jobType}`,
          }}
          onChange={(e) => {
            setJobType(e.value);
          }}
          required
        />
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Department Name <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={departmentdata?.map((option) => ({
            value: option.dept_id,
            label: `${option.dept_name}`,
          }))}
          value={{
            value: department,
            label:
              departmentdata.find((user) => user.dept_id === department)
                ?.dept_name || "",
          }}
          onChange={(e) => {
            setDepartment(e.value);
          }}
          required
        />
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Sub Department <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={subDepartmentData?.map((option) => ({
            value: option.id,
            label: `${option.sub_dept_name}`,
          }))}
          value={{
            value: subDepartmentData,
            label:
              subDepartmentData.find((user) => user.id === subDepartment)
                ?.sub_dept_name || "",
          }}
          onChange={(e) => {
            setSubDeparment(e.value);
          }}
          required
        />
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Designation <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={designationData?.map((option) => ({
            value: option.desi_id,
            label: `${option.desi_name}`,
          }))}
          value={{
            value: designation,
            label:
              designationData?.find((user) => user.desi_id == designation)
                ?.desi_name || "",
          }}
          onChange={(e) => {
            setDesignation(e.value);
          }}
          required
        />
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Report L1 <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={usersData?.map((option) => ({
            value: option.user_id,
            label: `${option.user_name}`,
          }))}
          value={{
            value: reportL1,
            label:
              usersData.find((user) => user.user_id === reportL1)?.user_name ||
              "",
          }}
          onChange={(e) => {
            setReportL1(e.value);
          }}
          required
        />
      </div>
      <div className="form-group col-3">
        <label className="form-label">Report L2</label>
        <Select
          className=""
          options={usersData?.map((option) => ({
            value: option.user_id,
            label: `${option.user_name}`,
          }))}
          value={{
            value: reportL2,
            label:
              usersData.find((user) => user.user_id === reportL2)?.user_name ||
              "",
          }}
          onChange={(e) => {
            setReportL2(e.value);
          }}
          required={false}
        />
      </div>

      <div className="form-group col-3">
        <label className="form-label">Report L3</label>
        <Select
          className=""
          options={usersData?.map((option) => ({
            value: option.user_id,
            label: `${option.user_name}`,
          }))}
          value={{
            value: reportL3,
            label:
              usersData.find((user) => user.user_id === reportL3)?.user_name ||
              "",
          }}
          onChange={(e) => {
            setReportL3(e.value);
          }}
          required={false}
        />
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Role <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={roledata.map((option) => ({
            value: option.role_id,
            label: option.Role_name,
          }))}
          value={{
            value: roles,
            label:
              roledata.find((role) => role.role_id === roles)?.Role_name || "",
          }}
          onChange={(e) => {
            setRoles(e.value);
          }}
        ></Select>
      </div>
      <FieldContainer
        label="Official Email"
        type="email"
        placeholder="Not Allocated"
        fieldGrid={3}
        required={false}
        value={email}
        onChange={handleEmailChange}
      />
      {!validEmail && <p style={{ color: "red" }}>*Please enter valid email</p>}

      <FieldContainer
        label="Official Contact"
        type="number"
        placeholder="Not Allocated"
        fieldGrid={3}
        value={contact}
        required={true}
        onChange={handleContactChange}
        onBlur={handleContentBlur}
      />
      {(isContactTouched || contact?.length >= 10) && !isValidcontact && (
        <p style={{ color: "red" }}>*Please enter a valid Number</p>
      )}
      <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
        <div className="form-group">
          <p
            className={
              loginResponse == "login id available"
                ? "login-success1"
                : "login-error1"
            }
          >
            {loginResponse}
          </p>
          <label>
            Login ID <sup style={{ color: "red" }}>*</sup>
          </label>
          <div className="input-group">
            <input
              className="form-control"
              value={loginId}
              onChange={handleLoginIdChange}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-primary"
                onClick={generateLoginId}
                type="button"
              >
                <AiOutlineReload />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
        <div className="form-group">
          <label>
            Generate Password <sup style={{ color: "red" }}>*</sup>
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-primary"
                onClick={generatePassword}
                type="button"
              >
                <i className="fa-solid fa-repeat"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Status <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={statusData?.map((option) => ({
            value: `${option}`,
            label: `${option}`,
          }))}
          value={{
            value: userStatus,
            label: `${userStatus}`,
          }}
          onChange={(e) => {
            setUserStatus(e.value);
          }}
          required
        />
      </div>
      <div className="from-group col-3">
        <label className="form-label">
          Joining Date <sup style={{ color: "red" }}>*</sup>
        </label>
        <input
          type="date"
          className="form-control"
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
        />
      </div>

      {/* {userStatus == "Resign" && (
        <FieldContainer
          type="date"
          label="Date of Resign"
          fieldGrid={3}
          value={releavingDate}
          onChange={(e) => setReleavingDate(e.target.value)}
        />
      )} */}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn btn-primary mr-2"
          onClick={handleSubmit}
        >
          Update
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev + 1)}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </>
  );
  {
    /* Official Info Inputs------------------------End------------ */
  }

  const otherFields = (
    <>
      {/* Other Info Inputs------------------------Start------------ */}
      <div className="personal_header">Other Details</div>
      {/* Current Address input-- */}

      <div className="row">
        <FieldContainer
          label="Current Address"
          fieldGrid={12}
          astric={true}
          value={currentAddress}
          onChange={(e) => setCurrentAddress(e.target.value)}
          required={false}
        />

        {console.log(banktype, "-------------bank type")}
        {console.log(city, "-------------parmanetnt city")}
        <div className="form-group col-4">
          <label className="form-label">
            Current City <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={cityData.map((city) => ({
              value: city.city_name,
              label: city.city_name,
            }))}
            onChange={(e) => setcurrentCity(e ? e.value : "")}
            required={true}
            // value={currentCity}
            value={{
              value: currentCity,
              label:
                cityData.find((gotCity) => gotCity.city_name == currentCity)
                  ?.city_name || "",
            }}
            placeholder="Select a city..."
            isClearable
          />
        </div>

        <div className="form-group col-4">
          <IndianStates
            newValue={currentState}
            onChange={(option) => setcurrentState(option ? option.value : null)}
          />
        </div>

        <FieldContainer
          label="Current Pincode"
          type="number"
          astric={true}
          fieldGrid={4}
          maxLength={6}
          value={currentPincode}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,6}$/.test(value)) {
              setcurrentPincode(value);
            }
          }}
          required={false}
        />
        {/*  Parmanent Address here------------ */}
        <div className="board_form form_checkbox">
          <label className="cstm_check" style={{ color: "red" }}>
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
      </div>
      <hr className="mb-3" />
      <FieldContainer
        label="Parmanent Address"
        fieldGrid={12}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required={false}
      />

      <div className="form-group col-4">
        <label className="form-label">Parmanent City</label>
        <Select
          options={cityData?.map((city) => ({
            value: city.city_name,
            label: city.city_name,
          }))}
          onChange={(e) => setCity(e ? e.value : "")}
          required={true}
          value={{
            value: city,
            label:
              cityData.find((gotCity) => gotCity.city_name == city)
                ?.city_name || "",
          }}
          placeholder="Select a city..."
          isClearable
        />
      </div>

      <div className="form-group col-4">
        <IndianStates
          newValue={state}
          onChange={(option) => setState(option ? option.value : null)}
        />
      </div>
      <FieldContainer
        label="Parmanent Pincode"
        type="number"
        value={pincode}
        fieldGrid={4}
        maxLength={6}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,6}$/.test(value)) {
            setPincode(value);
          }
        }}
        required={false}
      />

      <div className="form-group col-3">
        <label className="form-label">
          Blood Group <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={bloodGroupData?.map((option) => ({
            value: `${option}`,
            label: `${option}`,
          }))}
          value={{
            value: bloodGroup,
            label: `${bloodGroup}`,
          }}
          onChange={(e) => {
            setBloodGroup(e.value);
          }}
          required={false}
        />
      </div>
      <div className="form-group col-3">
        <label className="form-label">Hobbies</label>
        <Select
          isMulti
          options={hobbiesData}
          value={hobbies}
          onChange={handleChange}
          isClearable={true}
          classNamePrefix="select"
        />
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Spoken Languages <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          isMulti
          name="langauages"
          options={colourOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          value={tempLanguage}
          onChange={handleLanguageSelect}
          required={false}
        />
      </div>
      <div className="form-group col-3">
        <label className="form-label">Category</label>
        <Select
          className=""
          options={castOption?.map((option) => ({
            value: option,
            label: `${option}`,
          }))}
          value={{
            value: cast,
            label: cast,
          }}
          onChange={(e) => {
            setCast(e.value);
          }}
          required
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn btn-primary mr-2"
          onClick={handleSubmitOtherDetails}
        >
          Submit Other Details
        </button>
      </div>
      {/* Other Info Inputs------------------------End------------ */}

      {/* Bank Info Inputs------------------------Start------------ */}
      <div className="personal_header">Bank Details</div>
      {/* <FieldContainer
        label="Bank Name"
        astric={true}
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
      /> */}
      <div className="form-group col-6">
        <label className="form-label">
          Bank Name <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={IndianBankList}
          onChange={(selectedOption) => {
            setBankName(selectedOption ? selectedOption.value : null);
          }}
          isClearable
          isSearchable
          value={
            bankName
              ? IndianBankList.find((bank) => bank.value === bankName)
              : null
          }
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          required
        />
      </div>

      <div className="form-group col-3">
        <label className="form-label">
          Bank Type <sup style={{ color: "red" }}>*</sup>
        </label>
        {console.log(banktype, "----------account type")}
        <Select
          className=""
          options={bankTypeData.map((option) => ({
            value: `${option}`,
            label: `${option}`,
          }))}
          value={{
            value: banktype,
            label: `${banktype}`,
          }}
          onChange={(e) => {
            setAccountType(e.value);
          }}
          required
        />
      </div>
      <FieldContainer
        label="Bank Account Number"
        astric={true}
        fieldGrid={3}
        value={bankAccountNumber}
        onChange={(e) => setBankAccountNumber(e.target.value)}
      />
      <FieldContainer
        label="IFSC"
        astric={true}
        value={IFSC}
        // onChange={(e) => setIFSC(e.target.value.toUpperCase())}
        onChange={(e) => {
          const inputValue = e.target.value.toUpperCase();
          setIFSC(inputValue.slice(0, 11)); // Limiting the input to 11 characters
        }}
      />
      <FieldContainer
        label="Beneficiary"
        value={beneficiary}
        onChange={(e) => setBeneficiary(e.target.value)}
      />

      <FieldContainer
        label="Upload Proof *"
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          setBankProveImage(e.target.files[0]);
        }}
        fieldGrid={6}
        required={true}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn btn-primary mr-2"
          onClick={handleSubmitBank}
        >
          Submit Bank Details
        </button>
      </div>

      {/* Bank Info Inputs------------------------End------------ */}
    </>
  );

  const educationFamilyFieald = (
    <>
      <div className="personal_header">Family Details</div>
      {familyDetails?.map((detail, index) => (
        <div key={index} mb={2}>
          <div className="row">
            {Object.keys(detail)?.map((key) => {
              switch (key) {
                case "DOB":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={2}
                      type="date"
                      name={key}
                      label="Date of Birth"
                      value={
                        detail[key] ? detail[key].split("T")[0] : detail[key]
                      }
                      onChange={(e) => handleFamilyDetailsChange(index, e)}
                    />
                  );

                case "relation":
                  return (
                    <div className="form-group col-2">
                      <label className="form-label">
                        Relation <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        name={key}
                        value={familyRelationList.find(
                          (option) => option.value === detail[key]
                        )}
                        onChange={(selectedOption) =>
                          handleFamilyDetailsChange(index, {
                            target: {
                              name: key,
                              value: selectedOption ? selectedOption.value : "",
                            },
                          })
                        }
                        options={familyRelationList}
                        isClearable={true}
                        isSearchable={true}
                      />
                    </div>
                  );

                case "occupation":
                  return (
                    <div className="form-group col-2">
                      <label className="form-label">
                        Occupation <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        name={key}
                        value={OccupationList.find(
                          (option) => option.value === detail[key]
                        )}
                        onChange={(selectedOption) =>
                          handleFamilyDetailsChange(index, {
                            target: {
                              name: key,
                              value: selectedOption ? selectedOption.value : "",
                            },
                          })
                        }
                        options={OccupationList}
                        isClearable={true}
                        isSearchable={true}
                      />
                    </div>
                  );

                case "contact":
                  return (
                    <>
                      <FieldContainer
                        key={key}
                        type="number"
                        fieldGrid={2}
                        name={key}
                        label={familyFieldLabels[key]}
                        value={detail[key]}
                        onChange={(e) => handleFamilyDetailsChange(index, e)}
                      />
                      {familyValidationErrors[`contact-${index}`] && (
                        <span style={{ color: "red" }}>
                          {familyValidationErrors[`contact-${index}`]}
                        </span>
                      )}
                    </>
                  );

                case "annual_income":
                  return (
                    <FieldContainer
                      key={key}
                      type="number"
                      fieldGrid={2}
                      name={key}
                      label={familyFieldLabels[key]}
                      placeholder={familyFieldLabels[key]}
                      value={detail[key]}
                      onChange={(e) => handleFamilyDetailsChange(index, e)}
                    />
                  );

                default:
                  if (familyDisplayFields.includes(key)) {
                    return (
                      <FieldContainer
                        key={key}
                        fieldGrid={2}
                        name={key}
                        label={familyFieldLabels[key]}
                        value={detail[key]}
                        onChange={(e) => handleFamilyDetailsChange(index, e)}
                      />
                    );
                  }
              }
            })}
            {familyDetails?.length > 1 && (
              <IconButton onClick={() => handleRemoveFamilyDetails(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}

      <div className="row">
        <div className="col-12">
          <button
            onClick={handleAddFamilyDetails}
            variant="contained"
            className="btn btn-outline-primary me-2"
          >
            Add More Family Details
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn btn-primary mr-2"
          onClick={handleSubmitFamily}
        >
          Submit Family Details
        </button>
      </div>
      {/* Family Info Inputs------------------------End------------ */}

      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev - 1)}
        >
          <ArrowBackIosIcon />
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev + 1)}
        >
          <ArrowForwardIosIcon />
        </button>
      </div> */}

      {/* Education Info Inputs------------------------Start------------ */}
      <div className="personal_header">Education Details</div>
      {educationDetails?.map((detail, index) => (
        <div key={index} mb={2}>
          <div className="row">
            {educationDispalyFields?.map((key) => {
              return key === "from_year" || key === "to_year" ? (
                <FieldContainer
                  key={key}
                  fieldGrid={3}
                  type="date"
                  name={key}
                  label={educationFieldLabels[key]}
                  value={detail[key].split("T")[0]}
                  onChange={(e) => handleEducationDetailsChange(index, e)}
                />
              ) : (
                <FieldContainer
                  key={key}
                  fieldGrid={3}
                  name={key}
                  label={educationFieldLabels[key]}
                  value={detail[key] || ""}
                  onChange={(e) => handleEducationDetailsChange(index, e)}
                />
              );
            })}
            {educationDetails?.length > 1 && (
              <IconButton onClick={() => handleRemoveEducationDetails(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}
      <div className="row">
        <div className="col-12">
          <button
            type="button"
            onClick={handleAddEducationDetails}
            className="btn btn-outline-warning"
          >
            Add More Education Details
          </button>
        </div>
      </div>
      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev - 1)}
        >
          <ArrowBackIosIcon />
        </button>
      </div> */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn btn-primary mr-2"
          onClick={handleSubmitEducation}
        >
          Submit Education Details
        </button>
      </div>

      {/* Education Info Inputs------------------------End------------ */}
    </>
  );

  const documentFieldsNew = (
    <>
      <DocumentTab
        documentData={documentData}
        setDocumentData={setDocumentData}
        getDocuments={getDocuments}
        submitButton={false}
        normalUserLayout={true}
      />
    </>
  );
  return (
    <>
      <div className="mb-2 " style={{}}>
        <ToastContainer />
        <div
          style={{
            marginTop: 20,
            width: "100%",
            backgroundColor: "#ddd",
            borderRadius: "10px",
          }}
        >
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              backgroundColor: "blue",
              height: "20px",
              color: "white",
              borderRadius: "10px",
            }}
          >
            {progress.toFixed(0)}%
          </div>
        </div>
      </div>
      <FormContainer
        mainTitle="User Update"
        title="User Registration"
        handleSubmit={handleSubmit}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        loading={loading}
      >
        {activeAccordionIndex === 0 && genralFields}
        {activeAccordionIndex === 1 && otherFields}
        {activeAccordionIndex === 2 && educationFamilyFieald}
        {activeAccordionIndex === 3 && documentFieldsNew}
      </FormContainer>
    </>
  );
};

export default UserUpdate;
