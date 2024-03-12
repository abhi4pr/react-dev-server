import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { AiOutlineReload } from "react-icons/ai";
import { useGlobalContext } from "../../../Context/Context";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";
import imageTest2 from "../../../assets/img/product/Avtrar2.png";
import imageTest3 from "../../../assets/img/product/Avtrar3.png";
import imageTest14 from "../../../assets/img/product/Avtrar14.png";
import imageTest5 from "../../../assets/img/product/Avtrar5.png";
import imageTest6 from "../../../assets/img/product/Avtrar6.png";
import imageTest7 from "../../../assets/img/product/Avtrar7.png";
import imageTest8 from "../../../assets/img/product/Avtrar8.png";
import imageTest15 from "../../../assets/img/product/Avtar15.png";
import imageTest16 from "../../../assets/img/product/Avtar16.png";
import imageTest17 from "../../../assets/img/product/Avtar17.png";
import imageTest18 from "../../../assets/img/product/Avtar18.png";
import imageTest19 from "../../../assets/img/product/Avtar19.png";
import imageTest20 from "../../../assets/img/product/Avtar20.png";
import imageTest21 from "../../../assets/img/product/Avtar21.png";
import imageTest22 from "../../../assets/img/product/Avtar22.png";
import imageTest23 from "../../../assets/img/product/Avtar23.png";
import imageTest24 from "../../../assets/img/product/Avtar24.png";
import imageTest25 from "../../../assets/img/product/Avtar25.png";
import imageTest26 from "../../../assets/img/product/Avtar26.png";
import imageTest27 from "../../../assets/img/product/Avtar27.png";
import imageTest28 from "../../../assets/img/product/Avtar28.png";
import imageTest29 from "../../../assets/img/product/Avtar29.png";
import imageTest30 from "../../../assets/img/product/Avtar30.png";
import Select from "react-select";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import IndianStates from "../../ReusableComponents/IndianStates";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Autocomplete, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { baseUrl } from "../../../utils/config";
import familyRelationList from "../../../assets/js/familyRelationList";
import OccupationList from "../../../assets/js/OccupationList";
import IndianBankList from "../../../assets/js/IndianBankList";
import { ToastContainer } from "react-toastify";
import IndianStatesMui from "../../ReusableComponents/IndianStatesMui";
import EducationList from "../../../assets/js/EducationList";

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
  Relation: "",
  Name: "",
  DOB: "",
  Contact: "",
  Occupation: "",
  Income: "",
};

const initialEducationDetailsGroup = {
  Title: "",
  Institute: "",
  From: "",
  To: "",
  Percentage: "",
  Stream: "",
  Specialization: "",
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

const UserMaster = () => {
  const whatsappApi = WhatsappAPI();
  const { toastAlert, toastError } = useGlobalContext();
  const [userResID, setUserResID] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Genral Information Tab-------------------Start------------------------------------
  // ---------------------Prsonal Info State Start
  const [username, setUserName] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [personalEmail, setPersonalEmail] = useState("");
  const [personalContact, setPersonalContact] = useState("");
  const [isValidcontact, setValidContact] = useState(false);
  const [isAlternateTouched1, setisAlternateTouched1] = useState(false);
  const [alternateContact, setAlternateContact] = useState("");
  const [isValidcontact3, setValidContact3] = useState(false);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [maritialStatus, setMaritialStatus] = useState("");
  const [dateOfMarraige, setDateOfMarraige] = useState("");
  const [spouseName, setSpouseName] = useState("");

  //---------------------Personal Info State End

  //--------------------Official Info State Start
  const [jobType, setJobType] = useState("");
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
  const [email, setEmail] = useState(""); //offical email
  const [validEmail, setValidEmail] = useState(true);
  const [contact, setContact] = useState(""); //official contact
  const [loginId, setLoginId] = useState("");
  const [lastIndexUsed, setLastIndexUsed] = useState(-1);

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Active");
  const [joiningDate, setJoiningDate] = useState("");
  const [sitting, setSitting] = useState("");
  const [roomId, setRoomId] = useState("");
  const [refrenceData, getRefrenceData] = useState([]); //This is a sitting api state

  //--------------------Official Info State End
  // Genral Information Tab-------------------End------------------------------------

  // Other Information Tab-------------------Start------------------------------------
  //--------------------Other Info State Start
  //Current Address
  const [cityData, setCityData] = useState([]);

  const [currentAddress, setCurrentAddress] = useState("");
  const [currentCity, setcurrentCity] = useState("");
  const [currentState, setcurrentState] = useState("");
  const [currentPincode, setcurrentPincode] = useState("");

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

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
  const [beneficiary, setBeneficiary] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [banktype, setBankType] = useState("");

  //--------------------Bank Info State End

  // Other Information Tab-------------------End------------------------------------

  //--------------------Family Info State Start
  // handleAddFamilyDetails define below this funciton
  //--------------------Family Info State End

  //--------------------Education Info State Start
  // handleEducationDetailsChange define below this funciton
  //--------------------Education Info State End

  const [reportL1Email, setReportL1Email] = useState([]);
  const [isValidcontact1, setValidContact1] = useState(false);
  const [isContactTouched, setisContactTouched] = useState(false);
  const [isContactTouched1, setisContactTouched1] = useState(false);

  const [usersData, getUsersData] = useState([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [uid, setUID] = useState("");

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [isGeneralSubmitted, setIsGeneralSubmitted] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [familyDetails, setFamilyDetails] = useState([
    initialFamilyDetailsGroup,
  ]);
  const [educationDetails, setEducationDetails] = useState([
    initialEducationDetailsGroup,
  ]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  // const [isAlternateTouched, setisAlternateTouched] = useState(false);
  // const [validAlternateContact, setValidAlternateContact] = useState(false);
  // const [validAlternateContact1, setValidAlternateContact1] = useState(false);

  const [familyValidationErrors, setFamilyValidationErrors] = useState({});

  const [mandatoryFieldsEmpty, setMandatoryFieldsEmpty] = useState({
    fullName: false,
    department: false,
    subDepartment: false,
    designation: false,
    reportL1: false,
    personalContact: false,
    personalEmail: false,
    alternateContact: false,
    loginId: false,
    password: false,
    spokenLanguage: false,
    profilePic: false,
    gender: false,
    nationality: false,
    DOB: false,
    bloodGroup: false,
    maritialStatus: false,
    currentAddress: false,
    currentCity: false,
    currentState: false,
    currentPincode: false,
    joiningDate: false,
    status: false,
    bankDetails: false,
    email: false,
    banktype: false,
  });
  const [jobTypeData, setJobTypeData] = useState([]);

  const [loading, setLoading] = useState(false);

  const higestQualificationData = [
    "10th",
    "12th",
    "Diploma",
    "Graduation",
    "Post Graduation",
    "Other",
  ];
  const bankTypeData = ["Permanent A/C", "Current A/C"];
  const statusData = ["Active", "Exit", "On Leave", "Resign"];
  const genderData = ["Male", "Female", "Other"];
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

  const castOption = ["General", "OBC", "SC", "ST"];
  const maritialStatusData = ["Single", "Married"]; //,"Divorced","Widowed","Separated"

  useEffect(() => {
    const test = tempLanguage?.map((option) => option.value).join();
    setSpeakingLanguage(test);
  }, [tempLanguage]);

  useEffect(() => {
    if (department) {
      axios
        .get(`${baseUrl}` + `get_subdept_from_dept/${department}`)
        .then((res) => setSubDepartmentData(res.data));
    }
  }, [department]);

  useEffect(() => {
    axios.get(baseUrl + "get_all_roles").then((res) => {
      getRoleData(res.data.data);
    });

    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });

    // axios.get(baseUrl + "not_alloc_sitting").then((res) => {
    //   getRefrenceData(res.data.data);
    // });

    axios.get(baseUrl + "get_all_users").then((res) => {
      getUsersData(res.data.data);
      // const userSitting = res.data.data.map((user) => user.sitting_id);
      // setAllUsersSittings(userSitting);
    });

    // axios.get(baseUrl + "get_all_designations").then((res) => {
    //   setDesignationData(res.data.data);
    // });

    axios.get(baseUrl + "get_all_job_types").then((res) => {
      setJobTypeData(res.data.data);
    });

    axios.get(baseUrl + "get_all_cities").then((res) => {
      setCityData(res.data.data);
    });
  }, []);

  useEffect(() => {
    axios.get(baseUrl + "get_all_hobbies").then((res) => {
      setHobbiesData(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (department) {
      axios
        .get(baseUrl + `get_all_designations_by_deptId/${department}`)
        .then((res) => {
          setDesignationData(res.data.data);
        });
    }
  }, [department]);
  // new-----------------------------------------------------
  const handleChange = (selectedOptions) => {
    setHobbies(selectedOptions || []);
  };

  const availableOptions = hobbiesData
    .filter(
      (option) =>
        !hobbies.some((selected) => selected.value === option.hobby_id)
    )
    .map((option) => ({
      value: option.hobby_id,
      label: option.hobby_name,
    }));

  const allUserData = () => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      const reportl1Email = res.data.data?.filter((d) => d.user_id == reportL1);
      setReportL1Email(reportl1Email[0]?.user_email_id);
    });
  };
  useEffect(() => {
    allUserData();
  }, [reportL1]);

  // login progress bar---------------------------------------------------------------------
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fields = [
      username,
      selectedImage,
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
      status,
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
      // toast.info(`Progress: ${progressPercentage}%`, { position: "top-right" });
    }
  }, [
    username,
    selectedImage,
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
    status,
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

  const handleSubmit = async (e) => {
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
    } else if (!roles || roles == "") {
      return toastError("Role is Required");
    } else if (!reportL1 || reportL1 == "") {
      return toastError("Report L1 Is Required");
    } else if (!personalEmail || personalEmail == "") {
      return toastError("Personal Email is Required");
    } else if (
      !personalContact ||
      personalContact == "" ||
      personalContact.length !== 10
    ) {
      return toastError("Personal Contact is Required and  must be 10 digits");
    } else if (
      !alternateContact ||
      alternateContact == "" ||
      alternateContact.length !== 10
    ) {
      return toastError("Alternate Contact is Required and  must be 10 digits");
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
    } else if (!status || status == "") {
      return toastError("Status is Required");
    } else if (!username || username == "") {
      return toastError("User Name Error is required");
    }

    const formData = new FormData();
    formData.append("created_by", loginUserId);
    // personal info payload Start
    formData.append("user_name", username);
    formData.append("image", selectedImage);
    formData.append("Personal_email", personalEmail);
    formData.append("personal_number", personalContact);
    formData.append("alternate_contact", alternateContact);
    formData.append("Gender", gender);
    formData.append("DOB", dateOfBirth);
    formData.append("Age", Number(age));
    formData.append("Nationality", nationality);
    formData.append("MartialStatus", maritialStatus);
    formData.append("DateofMarriage", dateOfMarraige);
    formData.append("spouse_name", spouseName);
    // personal info payload End

    //offcial info payload Start
    formData.append("job_type", jobType);
    formData.append("dept_id", department);
    formData.append("sub_dept_id", subDepartment);
    formData.append("user_designation", designation);
    formData.append("report_L1", reportL1);
    formData.append("report_L2", reportL2);
    formData.append("report_L3", reportL3);
    formData.append("role_id", roles);
    formData.append("user_email_id", personalEmail);
    formData.append("user_contact_no", personalContact);
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("user_status", status);
    formData.append("sitting_id", sitting);
    // formData.append(
    //   "room_id",
    //   jobType === "WFH" || jobType === "WFHD" ? "1" : roomId.room_id
    // );
    formData.append("room_id", 1);
    formData.append("joining_date", joiningDate);
    //offcial info payload End

    if (personalEmail && personalContact) {
      try {
        const isLoginIdExists = usersData.some(
          (user) =>
            user.user_login_id.toLocaleLowerCase() ===
            loginId.toLocaleLowerCase()
        );
        const contactNumberExists = usersData.some(
          (user) => user.personal_number == contact
        );

        const emailIdExists = usersData.some(
          (user) =>
            user.Personal_email?.toLocaleLowerCase() ==
            email?.toLocaleLowerCase()
        );

        if (isLoginIdExists) {
          alert("this login ID already exists");
        } else if (contactNumberExists) {
          alert("Official Contact Already Exists");
        } else if (emailIdExists) {
          alert("Official Email Already Exists");
        } else {
          setIsLoading(true);
          const response = await axios
            .post(baseUrl + "add_user_for_general_information", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })

            .then((res) => {
              if (res.status == 200) {
                const userResponseID = res.data.simv.user_id;
                setUserResID(userResponseID);
                setIsFormSubmitted(true);
                toastAlert("User Registerd");
                setIsLoading(false);
              } else {
                toastError("Sorry User is Not Created, Please try again later");
                setIsLoading(false);
              }
              setIsGeneralSubmitted(true);
              setActiveAccordionIndex((prev) => prev + 1);
            })
            .catch((err) => {
              toastError(err.message);
              setIsLoading(false);
            });

          axios
            .post(baseUrl + "add_send_user_mail", {
              email: email,
              subject: "User Registration",
              text: "A new user has been registered.",
              attachment: selectedImage,
              login_id: loginId,
              name: username,
              password: password,
              status: "onboarded",
            })
            .then((res) => {
              // console.log("Email sent successfully:", res.data);
            })
            .catch((error) => {
              // console.log("Failed to send email:", error);
            });

          if (reportL1 !== "") {
            axios
              .post(baseUrl + "add_send_user_mail", {
                email: email,
                subject: "User Registration",
                text: "A new user has been registered.",
                attachment: selectedImage,
                login_id: loginId,
                name: username,
                password: password,
                status: "reportTo",
                name2: reportL1Email,
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

          // for (const elements of documents) {
          //   axios.post(
          //     baseUrl + "add_user_other_field",
          //     { field_name: elements.name, field_value: elements.file },
          //     {
          //       headers: {
          //         "Content-Type": "multipart/form-data",
          //       },
          //     }
          //   );
          // }

          whatsappApi.callWhatsAPI(
            "user_register",
            JSON.stringify(personalContact),
            username,
            [username, loginId, password, "https://jarvis.work/"]
          );
          setFamilyDetails([initialFamilyDetailsGroup]);
          setEducationDetails([initialEducationDetailsGroup]);
        }
      } catch (error) {
        console.error("Failed to submit form", error);
      }
    } else {
      if (contact.length > 10) {
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
        baseUrl + `update_user_for_other_details/${userResID}`,
        {
          permanent_city: city?.value ? city.value : "",
          permanent_address: address,
          permanent_state: state,
          permanent_pin_code: Number(pincode),
          current_address: currentAddress,
          current_city: currentCity?.value ? currentCity.value : "",
          current_pin_code: Number(currentPincode),
          current_state: currentState,
          BloodGroup: bloodGroup,
          Hobbies: hobbies.map((hobby) => hobby.value),
          SpokenLanguages: speakingLanguage,
          cast_type: cast,
        }
      );
      toastAlert("Other Details Submitted");
      console.log("Update successful", response.data);
    } catch (error) {
      console.error(
        "Update failed",
        error.response ? error.response.data : error
      );
    }
  };
  const handleSubmitBank = async (e) => {
    e.preventDefault();
    if (!bankName || bankName == "") {
      return toastError("bank name is required");
    } else if (!bankAccountNumber || bankAccountNumber == "") {
      return toastError("bank account number is required");
    } else if (!IFSC || IFSC == "") {
      return toastError("IFSC is required");
    } else if (!banktype || banktype == "") {
      return toastError("Bank Type is required");
    }
    try {
      const response = await axios.put(
        baseUrl + `update_user_for_bank_details/${userResID}`,
        {
          // Bank info payload Start
          bank_name: bankName,
          account_no: bankAccountNumber,
          ifsc_code: IFSC,
          beneficiary: beneficiary,
          account_type: banktype,
          // Bank info payload End
        },
        toastAlert("Bank Details Submitted")
        // setActiveAccordionIndex((prev) => prev + 1)
      );
      console.log("Update successful", response.data);
    } catch (error) {
      console.error(
        "Update failed",
        error.response ? error.response.data : error
      );
    }
  };
  const handleSubmitFamily = () => {
    try {
      if (familyDetails[0].Name !== "") {
        for (const elements of familyDetails) {
          const response = axios.put(baseUrl + "update_family", {
            user_id: userResID,
            name: elements.Name,
            DOB: elements.DOB,
            relation: elements.Relation,
            contact: elements.Contact,
            occupation: elements.Occupation,
            annual_income: elements.Income,
          });
        }
      }
      toastAlert("Submit Family Details");
    } catch (error) {
      toastError(error);
    }
  };
  const handleSubmitEducation = () => {
    try {
      if (educationDetails[0].Title !== "") {
        for (const elements of educationDetails) {
          const response = axios.put(baseUrl + "update_education", {
            user_id: userResID,
            title: elements.Title,
            institute_name: elements.Institute,
            from_year: elements.From,
            to_year: elements.To,
            percentage: elements.Percentage,
            stream: elements.Stream,
            specialization: elements.Specialization,
          });
        }
      }
      toastAlert("Submite Euducation Details ");
    } catch (error) {
      toastError(error);
    }
  };

  if (isFormSubmitted) {
    // return <Navigate to="/admin/user-overview" />;
  }

  // Email Validation
  function handleEmailChange(e) {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail == "") {
      setValidEmail(false);
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setValidEmail(emailRegex.test(newEmail));
    }
  }
  const today = new Date().toISOString().split("T")[0];

  // Number validation
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
  function handleAlternateContactChange(event) {
    if (event.target.value.length <= 10) {
      const newContact1 = event.target.value;
      setAlternateContact(newContact1);

      if (newContact1 === "") {
        setValidContact3(false);
      } else {
        setValidContact3(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact1)
        );
      }
    }
  }

  function handleContentBlur(e, type) {
    setisContactTouched(true);
    setisContactTouched1(true);
    if (type == "personalContact") {
      if (personalContact == "" || personalContact == null) {
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          personalContact: true,
        });
      } else {
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          personalContact: false,
        });
      }
    }
    if (contact.length < 10) {
      setValidContact(false);
      setValidContact1(false);
    }
  }

  function handleAlternateBlur(e, type) {
    if (type == "alternateContact") {
      if (alternateContact == "" || alternateContact == null) {
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          alternateContact: true,
        });
      } else {
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          alternateContact: false,
        });
      }
    }
    setisAlternateTouched(true);
    setisAlternateTouched1(true);
    if (contact.length < 10) {
      setValidAlternateContact(false);
      setValidAlternateContact1(false);
    }
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
    if (generatePassword.length > 0) {
      setMandatoryFieldsEmpty({ ...mandatoryFieldsEmpty, password: false });
    }
  };

  const generateLoginId = () => {
    const userName = username.trim().toLowerCase().split(" ");
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
    if (generatedLoginId.length > 0) {
      setMandatoryFieldsEmpty({ ...mandatoryFieldsEmpty, loginId: false });
    }
  };

  const handleLoginIdChange = (event) => {
    const selectedLoginId = event.target.value;
    setLoginId(selectedLoginId);
  };

  const handleAccordionButtonClick = (index) => {
    // {
    setActiveAccordionIndex(index);
  };

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

  const handleImageClick = async (image) => {
    try {
      const response = await axios.get(image, {
        responseType: "arraybuffer", // Request the image as an array buffer
      });

      setImagePreview(image);

      const blob = new Blob([response.data], { type: "image/jpeg" });
      setSelectedImage(blob);
    } catch (error) {
      // console.error("Error loading image:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    setSelectedImage(file);
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

  function addMore() {
    setDocuments([...documents, { name: "", file: null }]);
  }
  function reomveField() {
    setDocuments(documents.slice(0, -1));
  }
  function handleDocumentName(index, value) {
    const updatedDocuments = [...documents];
    updatedDocuments[index].name = value;
    setDocuments(updatedDocuments);
  }
  function handleDocumentChange(index, file) {
    const updatedDocuments = [...documents];
    updatedDocuments[index].file = file;
    setDocuments(updatedDocuments);
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

    if (name === "Contact") {
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

  const handleRemoveFamilyDetails = (index) => {
    const newFamilyDetails = familyDetails.filter((_, idx) => idx !== index);
    setFamilyDetails(newFamilyDetails);
  };

  function handleLanguageSelect(selectedOption) {
    setTempLanguage(selectedOption);
  }

  //EducationDetailsAdd
  const handleAddEducationDetails = (e) => {
    e.preventDefault;
    setEducationDetails([
      ...educationDetails,
      { ...initialEducationDetailsGroup },
    ]);
  };

  const handleEducationDetailsChange = (index, e) => {
    const updatedEducationDetails = educationDetails.map((detail, i) => {
      if (i === index) {
        return { ...detail, [e.target.name]: e.target.value };
      }
      return detail;
    });
    setEducationDetails(updatedEducationDetails);
  };

  const handleRemoveEducationDetails = (index) => {
    const newEducationDetails = educationDetails.filter((_, i) => i !== index);
    setEducationDetails(newEducationDetails);
  };

  const isPersonalEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalEmail);

  const accordionButtons = ["General", "Others", "Education & Family"];

  const genralFields = (
    <>
      {/* Personal Info Inputs------------------------Start------------ */}
      <div className="personal_header">Personal Details</div>
      <div className=" col-3">
        <FieldContainer
          className="pb-1"
          label="Full Name"
          astric={true}
          fieldGrid={12}
          value={username}
          onChange={(e) => {
            const inputValue = e.target.value;
            // Validation for number presence
            const containsNumber = /\d/.test(inputValue);

            if (!containsNumber) {
              setUserName(inputValue);
              if (inputValue !== "") {
                setMandatoryFieldsEmpty((prevState) => ({
                  ...prevState,
                  fullName: false,
                }));
              }
            }
          }}
          onBlur={() => {
            if (username === "") {
              setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                fullName: true,
              }));
            } else {
              // Validation for number presence
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                fullName: false,
              });
            }
          }}
        />
        <div className="">
          {mandatoryFieldsEmpty.fullName && (
            <p style={{ color: "red" }}>Please enter Full Name</p>
          )}
        </div>
      </div>
      <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
        <div className="form-group">
          <label className="form-label"> </label>
          <button
            className="btn btn-success d-block w-100"
            data-bs-toggle="modal"
            data-bs-target="#transferModal"
          >
            Profile
          </button>

          {selectedImage && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                className="mt-1"
                src={imagePreview}
                alt="Selected"
                style={{
                  width: "120px",
                  height: "120px",
                  marginBottom: "10px",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="col-md-3">
        <FieldContainer
          label="Personal Email"
          astric={true}
          type="email"
          fieldGrid={12}
          required={false}
          value={personalEmail}
          onChange={(e) => setPersonalEmail(e.target.value)}
          onBlur={() => {
            if (personalEmail === "") {
              // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,personalEmail:true});
              return setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                personalEmail: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                personalEmail: false,
              });
            }
          }}
        />
        {!isPersonalEmailValid && personalEmail && (
          <p style={{ color: "red" }}>*Please enter valid email</p>
        )}

        {mandatoryFieldsEmpty.personalEmail && (
          <p style={{ color: "red" }}>Please enter Personal Email</p>
        )}
      </div>
      <div className="col-3">
        <FieldContainer
          label="Personal Contact"
          astric={true}
          type="number"
          fieldGrid={12}
          value={personalContact}
          required={false}
          onChange={handlePersonalContactChange}
          onBlur={(e) => handleContentBlur(e, "personalContact")}
        />
        {(isContactTouched1 || personalContact.length >= 10) &&
          !isValidcontact1 &&
          mandatoryFieldsEmpty.personalContact && (
            <p style={{ color: "red" }}>*Please enter a valid Number</p>
          )}
        {mandatoryFieldsEmpty.personalContact && (
          <p style={{ color: "red" }}>Please enter Personal Contact</p>
        )}
      </div>
      <div className="col-3">
        <FieldContainer
          label="Alternate Contact"
          astric={true}
          type="number"
          fieldGrid={12}
          value={alternateContact}
          required={false}
          onChange={handleAlternateContactChange}
          onBlur={(e) => handleAlternateBlur(e, "alternateContact")}
        />
        {(isAlternateTouched1 || alternateContact.length >= 10) &&
          !isValidcontact3 &&
          !mandatoryFieldsEmpty.alternateContact && (
            <p style={{ color: "red" }}>*Please enter a valid Number</p>
          )}
        {mandatoryFieldsEmpty.alternateContact && (
          <p style={{ color: "red" }}>Please enter Alternate Contact</p>
        )}
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Gender <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={genderData.map((option) => ({
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
          onBlur={() => {
            if (gender === "" || gender === null) {
              setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                gender: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                gender: false,
              });
            }
          }}
          required
        />
        {mandatoryFieldsEmpty.gender && (
          <p style={{ color: "red" }}>Please enter Gender</p>
        )}
      </div>
      <div className="from-group col-3" >
        <label className="form-label">
          DOB <sup style={{ color: "red" }}>*</sup>
        </label>
        <div className="pack" style={{position:"relative"}}>

        <input
          label="DOB"
          type="date"
          className="form-control"
          style={{ width: "100%" }}
          max={today}
          value={dateOfBirth}
          onChange={handleDateChange}
          />
         <div className="custom-btn-2" style={{
           
           pointereEvents: "none",
           position: "absolute",
           bottom: "7px",
           right: "5px",
           display: "flex",
           justifyContent: "center",
           alignItems: "center",
           fontSize: "16px",
           color:"var(--medium)",
           height: "34px",
           width: "42px",
           borderRadius: "0  12px 12px 0",
           borderLeft: "1px solid var(--border)",
           backgroundColor: "var(--white)"
           
          }}><i class="bi bi-calendar-week"></i></div>
          </div>
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
        onBlur={() => {
          if (
            nationality === "" ||
            nationality == null ||
            nationality.length == 0
          ) {
            setMandatoryFieldsEmpty((prevState) => ({
              ...prevState,
              nationality: true,
            }));
          } else {
            setMandatoryFieldsEmpty({
              ...mandatoryFieldsEmpty,
              nationality: false,
            });
          }
        }}
      />
      {mandatoryFieldsEmpty.nationality && (
        <p style={{ color: "red" }}>Please Enter Nationality</p>
      )}
      <div className="form-group col-3">
        <label className="form-label">
          Maritial Status <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={maritialStatusData.map((option) => ({
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
          onBlur={() => {
            if (maritialStatus === "" || maritialStatus === null) {
              setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                maritialStatus: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                maritialStatus: false,
              });
            }
          }}
          required={false}
        />
        {mandatoryFieldsEmpty.maritialStatus && (
          <p style={{ color: "red" }}>Please enter Maritial Status</p>
        )}
      </div>

      {maritialStatus === "Married" && (
        <FieldContainer
          label="Spouse Name"
          value={spouseName}
          fieldGrid={3}
          onChange={(e) => setSpouseName(e.target.value)}
          required={false}
        />
      )}
      {maritialStatus == "Married" && (
        <FieldContainer
          type="date"
          fieldGrid={3}
          label="Date Of Marraige"
          value={dateOfMarraige}
          onChange={(e) => setDateOfMarraige(e.target.value)}
          max={today}
          required={false}
        />
      )}

      {/* Personal Info Inputs------------------------End------------ */}

      {/* Official Info Inputs------------------------Start------------ */}
      <div className="personal_header">Official Details</div>
      <div className="form-group col-3">
        <label className="form-label">
          Job Type <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={jobTypeData.map((option) => ({
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
          onBlur={() => {
            if (jobType === "" || jobType === null) {
              return setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                jobType: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                jobType: false,
              });
            }
          }}
          required
        />
        <div className="">
          {mandatoryFieldsEmpty.jobType && (
            <p style={{ color: "red" }}>Please enter Job Type</p>
          )}
        </div>
      </div>

      <div className="form-group col-3">
        <label className="form-label">
          Department Name <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={departmentdata.map((option) => ({
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
          onBlur={() => {
            if (department === "" || department === null) {
              return setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                department: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                department: false,
              });
            }
          }}
          required
        />
        <div className="">
          {mandatoryFieldsEmpty.department && (
            <p style={{ color: "red" }}>Please enter Department</p>
          )}
        </div>
      </div>

      <div className="form-group col-3">
        <label className="form-label">
          Sub Department <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={subDepartmentData.map((option) => ({
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
          onBlur={() => {
            if (
              subDepartmentData === "" ||
              subDepartmentData === null ||
              subDepartmentData.length === 0
            ) {
              return setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                subDepartment: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                subDepartment: false,
              });
            }
          }}
          required
        />
        <div className="">
          {mandatoryFieldsEmpty.subDepartment && (
            <p style={{ color: "red" }}>Please enter Sub Department</p>
          )}
        </div>
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Designation <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={designationData.map((option) => ({
            value: option.desi_id,
            label: `${option.desi_name}`,
          }))}
          value={{
            value: designation,
            label:
              designationData.find((user) => user.desi_id === designation)
                ?.desi_name || "",
          }}
          onChange={(e) => {
            setDesignation(e.value);
          }}
          onBlur={() => {
            if (designation === "" || designation === null) {
              return setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                designation: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                designation: false,
              });
            }
          }}
          required
        />
        <div className="">
          {mandatoryFieldsEmpty.designation && (
            <p style={{ color: "red" }}>Please enter Designation</p>
          )}
        </div>
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Report L1 <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={usersData.map((option) => ({
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
          onBlur={() => {
            if (reportL1 === "" || reportL1 === null) {
              return setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                reportL1: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                reportL1: false,
              });
            }
          }}
          required
        />
        <div className="">
          {mandatoryFieldsEmpty.reportL1 && (
            <p style={{ color: "red" }}>Please enter Report L1</p>
          )}
        </div>
      </div>

      <div className="form-group col-3">
        <label className="form-label">Report L2</label>
        <Select
          className=""
          options={usersData.map((option) => ({
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
          options={usersData.map((option) => ({
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
        fieldGrid={3}
        value={email}
        onChange={handleEmailChange}
        onBlur={() => {
          if (email === "") {
            // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,personalEmail:true});
            return setMandatoryFieldsEmpty((prevState) => ({
              ...prevState,
              email: true,
            }));
          } else {
            setMandatoryFieldsEmpty({
              ...mandatoryFieldsEmpty,
              email: false,
            });
          }
        }}
      />
      {!validEmail && <p style={{ color: "red" }}>*Please enter valid email</p>}

      <FieldContainer
        label="Official Contact"
        type="number"
        fieldGrid={3}
        value={contact}
        required={true}
        onChange={handleContactChange}
        onBlur={handleContentBlur}
      />
      {(isContactTouched || contact.length >= 10) && !isValidcontact && (
        <p style={{ color: "red" }}>*Please enter a valid Number</p>
      )}
      <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
        <div className="form-group">
          <label>
            Login ID <sup style={{ color: "red" }}>*</sup>
          </label>
          <div className="input-group">
            <input
              className="form-control"
              value={loginId}
              onChange={handleLoginIdChange}
              onBlur={() => {
                if (loginId === "") {
                  return setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    loginId: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    loginId: false,
                  });
                }
              }}
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
        {mandatoryFieldsEmpty.loginId && (
          <p style={{ color: "red" }}>Please enter Login ID</p>
        )}
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
              onBlur={() => {
                if (password === "") {
                  return setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    password: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    password: false,
                  });
                }
              }}
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
        {mandatoryFieldsEmpty.password && (
          <p style={{ color: "red" }}>Please enter Password</p>
        )}
      </div>
      <div className="form-group col-3">
        <label className="form-label">
          Status <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={statusData.map((option) => ({
            value: `${option}`,
            label: `${option}`,
          }))}
          value={{
            value: status,
            label: `${status}`,
          }}
          onChange={(e) => {
            setStatus(e.value);
          }}
          onBlur={() => {
            if (status === "" || status === null) {
              return setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                status: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                status: false,
              });
            }
          }}
          required
        />
        {mandatoryFieldsEmpty.status && (
          <p style={{ color: "red" }}>Please enter Status</p>
        )}
      </div>
      <div className="from-group col-3" >
        <label className="form-label">
          Joining Date <sup style={{ color: "red" }}>*</sup>
        </label>
        <div className="pack" style={{position:"relative"}}>

        <input
          type="date"
          className="form-control"
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
          />
         <div className="custom-btn-2"><i class="bi bi-calendar-week" style={{
           
           pointereEvents: "none",
           position: "absolute",
           bottom: "7px",
           right: "5px",
           display: "flex",
           justifyContent: "center",
           alignItems: "center",
           fontSize: "16px",
           color:"var(--medium)",
           height: "34px",
           width: "42px",
           borderRadius: "0  12px 12px 0",
           borderLeft: "1px solid var(--border)",
           backgroundColor: "var(--white)"
           
          }}></i></div>
          </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {/* <button
          type="button"
          className="btn btn-primary mr-2"
          onClick={handleSubmit}
        >
          Submit & Next
        </button> */}
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isLoading}
          style={{ width: "20%", marginLeft: "1%" }}
        >
          {isLoading ? "Please wait submiting..." : "Submit"}
        </button>
      </div>

      {/* Official Info Inputs------------------------End------------ */}

      {/* Transfer Modal Start  Profile Modal*/}
      <div
        className="modal fade alert_modal transfer_modal "
        id="transferModal"
        tabIndex={-1}
        aria-labelledby="transferModalLabel"
        aria-hidden="true"
        style={{ marginLeft: "7%" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div>
                {selectedImage && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={imagePreview}
                      alt="Selected"
                      style={{
                        width: "150px",
                        height: "80px",
                        marginBottom: "10px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                )}

                <div>
                  <h5>Choose Image:</h5>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {images.map((image) => (
                      <img
                        key={image}
                        src={image}
                        // alt={imageName}
                        style={{
                          width: "80px",
                          height: "80px",
                          margin: "5px",
                          cursor: "pointer",
                          borderRadius: "50%",
                        }}
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h5>Upload Image:</h5>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required={false}
                  />
                </div>
              </div>
              <div className="alert_text">
                <button
                  className="btn cmnbtn btn_success"
                  data-bs-dismiss="modal"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {jobType == "WFO" && (
        <div className="form-group col-3">
          <label className="form-label">
            Seat Number <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={refrenceData.map((option) => ({
              value: `${option?.sitting_id}`,
              label: `${option?.sitting_ref_no} | ${option?.sitting_area}`,
            }))}
            value={{
              value: `${sitting ? sitting : ""}`,
              label: `${roomId?.sitting_ref_no ? roomId?.sitting_ref_no : ""} ${
                roomId ? "|" : ""
              } ${roomId?.sitting_area ? roomId?.sitting_area : ""}`,
            }}
            onChange={(e) => {
              const selectedSittingId = e.value;
              setSitting(selectedSittingId);
              const selectedOption = refrenceData.find(
                (option) => option.sitting_id === Number(selectedSittingId)
              );
              setRoomId(selectedOption);
            }}
            required={true}
          />
        </div>
      )} */}
    </>
  );

  const othersFields = (
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
          onBlur={() => {
            if (currentAddress === "") {
              // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,address:true});
              return setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                currentAddress: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                currentAddress: false,
              });
            }
          }}
          required={false}
        />
        {mandatoryFieldsEmpty.currentAddress && (
          <p style={{ color: "red" }}>Please enter Address</p>
        )}
        <div className="form-group col-4">
          <label className="form-label">
            Current City <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={cityData.map((city) => ({
              value: city.city_name,
              label: city.city_name,
            }))}
            onChange={setcurrentCity}
            // onBlur={() => {
            //   if (city === "") {
            //     // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,city:true});
            //     return setMandatoryFieldsEmpty((prevState) => ({
            //       ...prevState,
            //       city: true,
            //     }));
            //   } else {
            //     setMandatoryFieldsEmpty({
            //       ...mandatoryFieldsEmpty,
            //       city: false,
            //     });
            //   }
            // }}
            required={true}
            value={currentCity}
            placeholder="Select a city..."
            isClearable
          />
          {mandatoryFieldsEmpty.city && (
            <p style={{ color: "red" }}>Please enter City</p>
          )}
        </div>

        <div className="form-group col-4">
          <IndianStates
            onBlur={() => {
              if (currentState === "") {
                // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,state:true});
                return setMandatoryFieldsEmpty((prevState) => ({
                  ...prevState,
                  state: true,
                }));
              } else {
                setMandatoryFieldsEmpty({
                  ...mandatoryFieldsEmpty,
                  state: false,
                });
              }
            }}
            onChange={(option) => setcurrentState(option ? option.value : null)}
          />
          {mandatoryFieldsEmpty.state && (
            <p style={{ color: "red" }}>Please enter State</p>
          )}
        </div>

        <FieldContainer
          label="Current Pincode"
          type="number"
          astric={true}
          fieldGrid={4}
          maxLength={6}
          // placeholder="123456"
          value={currentPincode}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,6}$/.test(value)) {
              setcurrentPincode(value);
            }
          }}
          onBlur={() => {
            if (currentPincode === "") {
              // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,pincode:true});
              return setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                currentPincode: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                currentPincode: false,
              });
            }
          }}
          required={false}
        />
        {mandatoryFieldsEmpty.currentPincode && (
          <p style={{ color: "red" }}>Please enter Pincode</p>
        )}
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

      <hr className="mb-2" />
      <FieldContainer
        label="Address"
        fieldGrid={12}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        // onBlur={() => {
        //   if (address === "") {
        //     return setMandatoryFieldsEmpty((prevState) => ({
        //       ...prevState,
        //       address: true,
        //     }));
        //   } else {
        //     setMandatoryFieldsEmpty({
        //       ...mandatoryFieldsEmpty,
        //       address: false,
        //     });
        //   }
        // }}
        required={false}
      />
      {/* {mandatoryFieldsEmpty.address && (
        <p style={{ color: "red" }}>Please enter Address</p>
      )} */}
      <div className="form-group col-4">
        <label className="form-label">City</label>
        <Select
          options={cityData.map((city) => ({
            value: city.city_name,
            label: city.city_name,
          }))}
          onChange={setCity}
          // onBlur={() => {
          //   if (city === "") {
          //     // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,city:true});
          //     return setMandatoryFieldsEmpty((prevState) => ({
          //       ...prevState,
          //       city: true,
          //     }));
          //   } else {
          //     setMandatoryFieldsEmpty({
          //       ...mandatoryFieldsEmpty,
          //       city: false,
          //     });
          //   }
          // }}
          required={true}
          value={city}
          placeholder="Select a city..."
          isClearable
        />
        {/* {mandatoryFieldsEmpty.city && (
          <p style={{ color: "red" }}>Please enter City</p>
        )} */}
      </div>
      <div className="form-group col-4">
        <IndianStates
          // onBlur={() => {
          //   if (state === "") {
          //     return setMandatoryFieldsEmpty((prevState) => ({
          //       ...prevState,
          //       state: true,
          //     }));
          //   } else {
          //     setMandatoryFieldsEmpty({
          //       ...mandatoryFieldsEmpty,
          //       state: false,
          //     });
          //   }
          // }}
          onChange={(option) => setState(option ? option.value : null)}
          newValue={state}
        />

        {/* {mandatoryFieldsEmpty.state && (
          <p style={{ color: "red" }}>Please enter State</p>
        )} */}
      </div>
      <FieldContainer
        label="Pincode"
        type="number"
        fieldGrid={4}
        maxLength={6}
        value={pincode}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,6}$/.test(value)) {
            setPincode(value);
          }
        }}
        // onBlur={() => {
        //   if (pincode === "") {
        //     // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,pincode:true});
        //     return setMandatoryFieldsEmpty((prevState) => ({
        //       ...prevState,
        //       pincode: true,
        //     }));
        //   } else {
        //     setMandatoryFieldsEmpty({
        //       ...mandatoryFieldsEmpty,
        //       pincode: false,
        //     });
        //   }
        // }}
        required={false}
      />
      {/* {mandatoryFieldsEmpty.pincode && (
        <p style={{ color: "red" }}>Please enter Pincode</p>
      )} */}
      <div className="form-group col-3">
        <label className="form-label">
          Blood Group <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={bloodGroupData.map((option) => ({
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
          onBlur={() => {
            if (
              bloodGroup === "" ||
              bloodGroup === null ||
              bloodGroup.length === 0
            ) {
              setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                bloodGroup: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                bloodGroup: false,
              });
            }
          }}
          required={false}
        />

        {mandatoryFieldsEmpty.bloodGroup && (
          <p style={{ color: "red" }}>Please enter Blood Group</p>
        )}
      </div>
      <div className="form-group col-3">
        <label className="form-label">Hobbies</label>
        <Select
          isMulti
          options={availableOptions}
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
          onBlur={() => {
            if (
              tempLanguage === "" ||
              tempLanguage === null ||
              tempLanguage.length === 0
            ) {
              return setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                language: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                language: false,
              });
            }
          }}
        />
        {mandatoryFieldsEmpty.language && (
          <p style={{ color: "red" }}>Please enter Languages</p>
        )}
      </div>
      <div className="form-group col-3">
        <label className="form-label">Category</label>
        <Select
          className=""
          options={castOption.map((option) => ({
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
          onBlur={() => {
            if (cast === "" || cast === null) {
              setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                cast: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                cast: false,
              });
            }
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
          onBlur={() => {
            setMandatoryFieldsEmpty((prevState) => ({
              ...prevState,
              bankName: !bankName,
            }));
          }}
          required
        />
        {mandatoryFieldsEmpty.bankName && (
          <p style={{ color: "red" }}>Please enter Bank Name</p>
        )}
      </div>

      <div className="form-group col-3">
        <label className="form-label">
          Bank Type <sup style={{ color: "red" }}>*</sup>
        </label>
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
            setBankType(e.value);
          }}
          onBlur={() => {
            if (banktype === "" || banktype === null) {
              setMandatoryFieldsEmpty((prevState) => ({
                ...prevState,
                banktype: true,
              }));
            } else {
              setMandatoryFieldsEmpty({
                ...mandatoryFieldsEmpty,
                banktype: false,
              });
            }
          }}
          required
        />
        {mandatoryFieldsEmpty.banktype && (
          <p style={{ color: "red" }}>Please enter Bank Type</p>
        )}
      </div>

      <FieldContainer
        label="Bank Account Number"
        astric={true}
        fieldGrid={3}
        value={bankAccountNumber}
        onChange={(e) => setBankAccountNumber(e.target.value)}
        onBlur={() => {
          if (bankAccountNumber === "") {
            // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,bankAccountNumber:true});
            return setMandatoryFieldsEmpty((prevState) => ({
              ...prevState,
              bankAccountNumber: true,
            }));
          } else {
            setMandatoryFieldsEmpty({
              ...mandatoryFieldsEmpty,
              bankAccountNumber: false,
            });
          }
        }}
      />
      {mandatoryFieldsEmpty.bankAccountNumber && (
        <p style={{ color: "red" }}>Please enter Bank Account Number</p>
      )}
      <FieldContainer
        astric={true}
        label="IFSC"
        value={IFSC}
        onChange={(e) => setIFSC(e.target.value.toUpperCase())}
        onBlur={() => {
          if (IFSC === "") {
            // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,IFSC:true});
            return setMandatoryFieldsEmpty((prevState) => ({
              ...prevState,
              IFSC: true,
            }));
          } else {
            setMandatoryFieldsEmpty({
              ...mandatoryFieldsEmpty,
              IFSC: false,
            });
          }
        }}
      />
      {mandatoryFieldsEmpty.IFSC && (
        <p style={{ color: "red" }}>Please enter IFSC</p>
      )}
      <FieldContainer
        label="Beneficiary"
        value={beneficiary}
        onChange={(e) => setBeneficiary(e.target.value)}
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
    </>
  );

  const educationFamilyFieald = (
    <>
      {/* Family Info Inputs------------------------Start------------ */}
      <div className="personal_header">Family Details</div>
      {familyDetails.map((detail, index) => (
        <div key={index} mb={2}>
          <div className="row">
            {Object.keys(detail).map((key) => {
              switch (key) {
                case "DOB":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={2}
                      type="date"
                      name={key}
                      label="Date of Birth"
                      value={detail[key]}
                      onChange={(e) => handleFamilyDetailsChange(index, e)}
                    />
                  );
                case "Relation":
                  return (
                    <div className="form-group col-2">
                      <label className="form-label">Relation</label>
                      <Select
                        label="Relation"
                        placeholder="Select Relation"
                        className=""
                        options={familyRelationList}
                        name={key}
                        value={
                          familyRelationList.find(
                            (option) => option.value === detail.Relation
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          handleFamilyDetailsChange(index, {
                            target: {
                              name: key,
                              value: selectedOption ? selectedOption.value : "",
                            },
                          })
                        }
                        isClearable={true}
                        isSearchable={true}
                      />
                    </div>
                  );
                case "Occupation":
                  return (
                    <div className="form-group col-2">
                      <label className="form-label">Occupation</label>
                      <Select
                        label="Occupation"
                        placeholder="Select Occupation"
                        className=""
                        options={OccupationList}
                        name={key}
                        value={
                          OccupationList.find(
                            (option) => option.value === detail.Occupation
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          handleFamilyDetailsChange(
                            index,
                            {
                              target: {
                                name: key,
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                              },
                            },
                            true
                          )
                        }
                        isClearable={true}
                        isSearchable={true}
                      />
                    </div>
                  );

                case "Contact":
                  return (
                    <>
                      <FieldContainer
                        key={key}
                        fieldGrid={2}
                        type="number"
                        name={key}
                        label={key}
                        placeholder={key}
                        value={detail[key]}
                        onChange={(e) => handleFamilyDetailsChange(index, e)}
                      />
                      {familyValidationErrors[`Contact-${index}`] && (
                        <span style={{ color: "red" }}>
                          {familyValidationErrors[`Contact-${index}`]}
                        </span>
                      )}
                    </>
                  );

                case "Income":
                  return (
                    <FieldContainer
                      key={key}
                      type="number"
                      fieldGrid={2}
                      name={key}
                      label={key}
                      placeholder={key}
                      value={detail[key]}
                      onChange={(e) => handleFamilyDetailsChange(index, e)}
                    />
                  );

                default:
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={2}
                      name={key}
                      label={key}
                      placeholder={key}
                      value={detail[key]}
                      onChange={(e) => handleFamilyDetailsChange(index, e)}
                    />
                  );
              }
            })}
            {familyDetails.length > 1 && (
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

      {/* Education Info Inputs------------------------Start------------ */}
      <div className="personal_header">Education Details</div>
      {educationDetails.map((detail, index) => (
        <div key={index} mb={2}>
          <div className="row">
            {Object.keys(detail).map((key) =>
              key === "From" || key === "To" ? (
                <FieldContainer
                  key={key}
                  fieldGrid={3}
                  type="date"
                  name={key}
                  required={false}
                  label={key}
                  value={detail[key]}
                  onChange={(e) => handleEducationDetailsChange(index, e)}
                />
              ) : (
                // <div className="form-group col-2">
                //   <label className="form-label">Relation</label>
                //   <Select
                //     label="Title"
                //     placeholder="Select Relation"
                //     className=""
                //     options={familyRelationList}
                //     name={key}
                //     value={
                //       higestQualificationData.find(
                //         (option) => option.value === detail.Relation
                //       ) || null
                //     }
                //     onChange={(selectedOption) =>
                //       handleFamilyDetailsChange(index, {
                //         target: {
                //           name: key,
                //           value: selectedOption ? selectedOption.value : "",
                //         },
                //       })
                //     }
                //     isClearable={true}
                //     isSearchable={true}
                //   />
                // </div>
                <FieldContainer
                  key={key}
                  fieldGrid={3}
                  name={key}
                  required={false}
                  label={key}
                  value={detail[key]}
                  onChange={(e) => handleEducationDetailsChange(index, e)}
                />
              )
            )}
            {educationDetails.length > 1 && (
              <IconButton onClick={() => handleRemoveEducationDetails(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}
      {/* {educationDetails?.map((detail, index) => (
        <div key={index} mb={2}>
          <div className="row">
            {educationDispalyFields.map((key) => {
              switch (key) {
                case "institute_name":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );

                case "from_year":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="date"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key]?.split("T")[0]}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );
                case "to_year":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="date"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key]?.split("T")[0]}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );

                case "percentage":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="number"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );

                case "stream":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );
                case "specialization":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );
                case "title":
                  return (
                    <div>
                      <Autocomplete
                        key={key}
                        name={key}
                        options={EducationList}
                        getOptionLabel={(option) => option.label}
                        value={EducationList.find(
                          (option) => option.value === detail[key]
                        )}
                        onChange={(e, newValue) => {
                          handleEducationDetailsChange(index, {
                            target: {
                              name: key,
                              value: newValue ? newValue.value : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Standard"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </div>
                  );
              }
            })}
            {educationDetails?.length > 1 && (
              <IconButton onClick={() => handleRemoveEducationDetails(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))} */}
      <div className="row">
        <div className="col-12">
          <button
            type="button"
            onClick={(e) => handleAddEducationDetails(e)}
            variant="contained"
            className="btn btn-outline-primary me-2"
          >
            Add More Education Details
          </button>
        </div>
      </div>
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

      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev - 1)}
        >
          <ArrowBackIosIcon />
        </button>
      </div> */}
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
        mainTitle="User"
        title="User Registration"
        // handleSubmit={handleSubmit}
        submitButton={false}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        loading={loading}
      >
        {activeAccordionIndex === 0 && genralFields}
        {/* {activeAccordionIndex === 1 && othersFields}
        {activeAccordionIndex === 2 && educationFamilyFieald} */}
        {isGeneralSubmitted && activeAccordionIndex === 1 && othersFields}
        {isGeneralSubmitted &&
          activeAccordionIndex === 2 &&
          educationFamilyFieald}
      </FormContainer>
    </>
  );
};

export default UserMaster;
