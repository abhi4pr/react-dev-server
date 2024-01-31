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
import {baseUrl} from '../../../utils/config'

const castOption = ["General", "OBC", "SC", "ST"];
const colourOptions = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Other", label: "Other" },
];

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

const UserUpdate = () => {
  const whatsappApi = WhatsappAPI();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { id } = useParams();
  const [username, setUserName] = useState("");

  const [roles, setRoles] = useState("");
  const [roledata, getRoleData] = useState([]);

  const [reportL1, setReportL1] = useState("");
  const [reportL2, setReportL2] = useState("");
  const [reportL3, setReportL3] = useState("");

  const [profile, setProfile] = useState([]);

  const [email, setEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);

  const [contact, setContact] = useState();
  const [personalContact, setPersonalContact] = useState();
  const [isValidcontact, setValidContact] = useState(true);
  const [isValidcontact1, setValidContact1] = useState(true);
  const [isContactTouched, setisContactTouched] = useState(false);
  const [isContactTouched1, setisContactTouched1] = useState(false);

  const [alternateContact, setAlternateContact] = useState(null);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [incomingPassword, setIncomingPassword] = useState("");

  const [jobType, setJobType] = useState("");
  const [sitting, setSitting] = useState();
  const [sittingValue, setSittingValue] = useState({});

  const [roomId, setRoomId] = useState("");
  const [refrenceData, setRefrenceData] = useState([]);

  const [department, setDepartment] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [usersData, getUsersData] = useState([]);

  const [designation, setDesignation] = useState("");
  const [designationData, setDesignationData] = useState([]);

  const [uid, setUID] = useState({ name: "sumit.jpg" });
  const [panUpload, setPanUpload] = useState("");
  const [highestUpload, setHighestUpload] = useState("");
  const [otherUpload, setOtherUpload] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [releavingDate, setReleavingDate] = useState("");
  const [salary, setSalary] = useState(0);
  const [incomingUserStatus, setIncomingUserStatus] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [tempLanguage, setTempLanguage] = useState([]);
  const [speakingLanguage, setSpeakingLanguage] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("Indian");

  const [age, setAge] = useState(0);

  const [FatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [maritialStatus, setMaritialStatus] = useState("");
  const [dateOfMarraige, setDateOfMarraige] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");

  // TDS State
  const [tdsApplicable, setTdsApplicable] = useState("No");
  const [tdsPercentage, setTdsPercentage] = useState(0);
  const [showTdsPercentage, setShowTdsPercentage] = useState(false);
  const [panNo, setPanNo] = useState("");
  const [uidNo, setUidNo] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [otherDocuments, setOtherDocuments] = useState();
  const [subDepartmentData, setSubDepartmentData] = useState([]);
  const [subDepartment, setSubDeparment] = useState([]);
  const [higestQualification, setHigestQualification] = useState("");
  const [isValidPAN, setIsValidPAN] = useState(true);
  const [isValidUID, setIsValidUID] = useState(true); // State to track UID validation
  const [defaultSeatData, setDefaultSeatData] = useState([]);

  const [uidImage, setUidImage] = useState("");
  const [panImage, setPanImage] = useState("");
  const [highestQualificationImage, setHighestQualificationImage] =
    useState("");
  const [otherImage, setOtherImage] = useState("");
  //SalaryFields
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [beneficiary, setBeneficiary] = useState("");

  const [familyDetails, setFamilyDetails] = useState([
    initialFamilyDetailsGroup,
  ]);
  const [educationDetails, setEducationDetails] = useState([
    initialEducationDetailsGroup,
  ]);

  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("");
  const [emergencyContact2, setEmergencyContact2] = useState();
  const [emergencyContactName2, setEmergencyContactName2] = useState("");
  const [emergencyContactRelation2, setEmergencyContactRelation2] =
    useState("");

  const [documentData, setDocumentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobTypeData, setJobTypeData] = useState([]);

  const [cast, setCast] = useState("");
  const { toastAlert, toastError } = useGlobalContext();

  const higestQualificationData = [
    "10th",
    "12th",
    "Diploma",
    "Graduation",
    "Post Graduation",
    "Other",
  ];
  // const jobTypeData = ["WFO", "WFH"];
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
  const tdsApplicableData = ["Yes", "No"];
  const statusData = ["Active", "Exit", "On Leave", "Resign"];
  const maritialStatusData = ["Married", "Unmarried"];
  const handlePANChange = (e) => {
    const inputPAN = e.target.value.toUpperCase();
    setPanNo(inputPAN);

    // Validate PAN when input changes
    const isValid = validatePAN(inputPAN);
    setIsValidPAN(isValid);
  };
  // Function to validate PAN
  const validatePAN = (pan) => {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panPattern.test(pan);
  };
  const handleUIDInputChange = (e) => {
    const inputUID = e.target.value;
    setUidNo(inputUID);

    // Validate Aadhaar number when input changes
    const isValid = validateAadhaarNumber(inputUID);
    setIsValidUID(isValid);
  };
  // Function to validate Aadhaar number (UID)
  const validateAadhaarNumber = (uid) => {
    // Aadhaar number format: 12 digits
    const uidPattern = /^\d{12}$/;
    return uidPattern.test(uid);
  };
  // const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  // useEffect(() => {
  //   const selectedOption = defaultSeatData?.find(
  //     (option) => option?.sitting_id === Number(sitting)
  //   );
  //   setRoomId(selectedOption);
  // }, [sitting, refrenceData, roomId]);

  useEffect(() => {
    if (department) {
      axios
        .get(
          `${baseUrl}`+`get_subdept_from_dept/${department}`
        )
        .then((res) => setSubDepartmentData(res.data));
    }
  }, [department]);

  useEffect(() => {
    if (tdsApplicable === "Yes") {
      setShowTdsPercentage(true);
    } else {
      setShowTdsPercentage(false);
    }
  }, [tdsApplicable]);

  useEffect(() => {
    const GetAllData = async () => {
      const AllRolesResposne = await axios.get(
        baseUrl+"get_all_roles"
      );

      const AllDepartmentResponse = await axios.get(
        baseUrl+"get_all_departments"
      );

      const RemainingSittingResponse = await axios.get(
        baseUrl+"not_alloc_sitting"
      );

      const AllSittingsResponse = await axios.get(
        baseUrl+"get_all_sittings"
      );

      const AllUsersResponse = await axios.get(
        baseUrl+"get_all_users"
      );

      const AllDesiResponse = await axios.get(
        baseUrl+"get_all_designations"
      );

      const AllJobTypesResponse = await axios.get(
        baseUrl+"get_all_job_types"
      );

      getRoleData(AllRolesResposne.data.data);
      getDepartmentData(AllDepartmentResponse.data);
      setJobTypeData(AllJobTypesResponse.data.data);
      setDesignationData(AllDesiResponse.data.data);
      getUsersData(AllUsersResponse.data.data);
      setDefaultSeatData(AllSittingsResponse.data.data);
      setRefrenceData(RemainingSittingResponse.data.data);
    };
    GetAllData();
  }, []);

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

  function getOtherDocument() {
    axios
      .get(`${baseUrl}`+`get_user_other_fields/${id}`)
      .then((res) => {
        setOtherDocuments(res.data.data);
      });
  }

  async function getDocuments() {
    const response = await axios.post(
      baseUrl+"get_user_doc",
      {
        user_id: id,
      }
    );
    setDocumentData(response.data.data);
  }

  useEffect(() => {
    getDocuments();
  }, [id]);

  useEffect(() => {
    axios
      .get(`${baseUrl}`+`get_single_user/${id}`)
      .then((res) => {
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
          pan,
          highest_upload,
          other_upload,
          joining_date,
          releaving_date,
          salary,
          SpokenLanguages,
          Gender,
          Nationality,
          DOB,
          user_status,
          Age,
          fatherName,
          motherName,
          Hobbies,
          BloodGroup,
          MartialStatus,
          DateOfMarriage,
          tbs_applicable,
          tds_per,
          pan_no,
          uid_no,
          spouse_name,
          sub_dept_id,
          highest_qualification_name,
          uid_url,
          pan_url,
          highest_upload_url,
          other_upload_url,
          bank_name,
          ifsc_code,
          beneficiary,
          account_no,
          permanent_city,
          permanent_address,
          permanent_state,
          permanent_pin_code,
          cast_type,
          alternate_contact,
          emergency_contact1,
          emergency_contact2,
          emergency_contact_person_name1,
          emergency_contact_person_name2,
          emergency_contact_relation1,
          emergency_contact_relation2,
        } = fetchedData;
        setPanNo(pan_no);
        setUidNo(uid_no);
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
        setUidImage(uid_url);
        setPanUpload(pan);
        setPanImage(pan_url);
        setHighestUpload(highest_upload);
        setHighestQualificationImage(highest_upload_url);
        setOtherUpload(other_upload);
        setOtherImage(other_upload_url);
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
        setFatherName(fatherName);
        setMotherName(motherName);
        setHobbies(Hobbies);
        setBloodGroup(BloodGroup);
        setMaritialStatus(MartialStatus);
        setDateOfMarraige(DateOfMarriage?.split("T")?.[0]);
        setTdsApplicable(tbs_applicable);
        setTdsPercentage(tds_per);
        setSubDeparment(sub_dept_id);
        setHigestQualification(highest_qualification_name);
        setBankName(bank_name);
        setIFSC(ifsc_code);
        setBeneficiary(beneficiary);
        setBankAccountNumber(account_no);
        setCity(permanent_city);
        setAddress(permanent_address);
        setState(permanent_state);
        setPincode(permanent_pin_code);
        setCast(cast_type);
        setAlternateContact(alternate_contact);
        setEmergencyContact(emergency_contact1);
        setEmergencyContact2(emergency_contact2);
        setEmergencyContactName(emergency_contact_person_name1);
        setEmergencyContactName2(emergency_contact_person_name2);
        setEmergencyContactRelation(emergency_contact_relation1);
        setEmergencyContactRelation2(emergency_contact_relation2);
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
    // setLoading(true)
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
    } else if (!emergencyContact || emergencyContact == "") {
      return toastError("Emergency Contact is Required");
    } else if (!emergencyContactName || emergencyContactName == "") {
      return toastError("Emergency Contact Name is Required");
    } else if (!emergencyContactRelation || emergencyContactRelation == "") {
      return toastError("Emergency Contact Relation is Required");
    } else if (!loginId || loginId == "") {
      return toastError("Login Id is Required");
    } else if (!password || password == "") {
      return toastError("Password is Required");
    } else if (!speakingLanguage || speakingLanguage == "") {
      return toastError("Speaking Language is Required");
    } else if (!gender || gender == "") {
      return toastError("Gender is Required");
    } else if (!nationality || nationality == "") {
      return toastError("Nationality is Required");
    } else if (!dateOfBirth || dateOfBirth == "") {
      return toastError("Date of Birth is Required");
    } else if (!FatherName || FatherName == "") {
      return toastError("Father Name is Required");
    } else if (!motherName || motherName == "") {
      return toastError("Mother Name is Required");
    } else if (!bloodGroup || bloodGroup == "") {
      return toastError("Blood Group is Required");
    } else if (
      !maritialStatus ||
      maritialStatus == "" ||
      maritialStatus.length == 0
    ) {
      return toastError("Maritial Status is Required");
    } else if (!address || address == "") {
      return toastError("Address is Required");
    } else if (!city || city == "") {
      return toastError("City is Required");
    } else if (!state || state == "") {
      return toastError("State/UT is Required");
    } else if (!pincode || pincode == "") {
      return toastError("Pincode should be 6 number long");
    } else if (!joiningDate || joiningDate == "") {
      return toastError("Joining Date is Required");
    } else if (!userStatus || userStatus == "") {
      return toastError("Status is Required");
    } else if (!bankName || bankName == "") {
      return toastError("Bank Name is Required");
    } else if (!bankAccountNumber || bankAccountNumber == "") {
      return toastError("Bank Account Number is Required");
    } else if (!username || username == "") {
      return toastError("User Name Error is required");
    }

    if (jobType == "WFO" && sitting == "") {
      return toastError("Sitting Error is required");
    }
    const formData = new FormData();
    formData.append("user_status", userStatus);
    formData.append("user_id", id);
    formData.append("user_name", username);
    formData.append("role_id", roles);
    formData.append("image", profile);
    formData.append("user_email_id", email);
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("user_contact_no", contact ? contact : "");
    formData.append("sitting_id", jobType === "WFH" ? 0 : Number(sitting));
    formData.append(
      "room_id",
      jobType === "WFH" || jobType === "WFHD" ? "1" : roomId.room_id
    );
    // console.log("room id he yha", roomId);
    // formData.append("room_id", roomId);
    formData.append("dept_id", department);
    formData.append("job_type", jobType);
    formData.append("personal_number", personalContact);
    formData.append("Personal_email", personalEmail);
    formData.append("alternate_contact", alternateContact);
    // console.log(reportL1, "report here");
    formData.append("report_L1", Number(reportL1));
    formData.append("report_L2", Number(reportL2));
    formData.append("report_L3", Number(reportL3));
    formData.append("user_designation", designation);

    formData.append("UID", uid);
    formData.append("pan", panUpload);
    formData.append("highest_upload", highestUpload);
    formData.append("other_upload", otherUpload);
    formData.append("joining_date", joiningDate);
    formData.append("releaving_date", releavingDate);
    formData.append("salary", Number(salary));

    formData.append("SpokenLanguages", speakingLanguage);
    formData.append("Gender", gender);

    formData.append("Nationality", nationality);
    formData.append("DOB", dateOfBirth);
    formData.append("Age", age);
    formData.append("FatherName", FatherName);
    formData.append("MotherName", motherName);
    formData.append("Hobbies", hobbies);
    formData.append("BloodGroup", bloodGroup);
    formData.append("MartialStatus", maritialStatus);
    formData.append("DateofMarriage", dateOfMarraige);
    formData.append("permanent_address", address);
    formData.append("permanent_city", city);
    formData.append("permanent_state", state);
    formData.append("permanent_pin_code", Number(pincode));

    formData.append("bank_name", bankName);
    formData.append("ifsc_code", IFSC);
    formData.append("account_no", bankAccountNumber);

    formData.append("tds_applicable", tdsApplicable);
    formData.append("tds_per", tdsPercentage);
    formData.append("pan_no", panNo);
    formData.append("uid_no", uidNo);

    //Emergency Contact fields
    formData.append("emergency_contact1", emergencyContact);
    formData.append("emergency_contact_person_name1", emergencyContactName);
    formData.append("emergency_contact_relation1", emergencyContactRelation);
    formData.append(
      "emergency_contact2",
      emergencyContact2 ? emergencyContact2 : ""
    );
    formData.append("emergency_contact_person_name2", emergencyContactName2);
    formData.append("emergency_contact_relation2", emergencyContactRelation2);

    // formData.append("spouse_name", spouseName);
    formData.append("sub_dept_id", subDepartment);
    formData.append("highest_qualification_name", higestQualification);
    formData.append("cast_type", cast);

    const formDataa = new FormData();
    if (personalEmail && personalContact) {
      setLoading(true);

      await axios
        .put(`${baseUrl}`+`update_user`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setLoading(false);
        })
        .catch(function (err) {
          setLoading(false);
          console.log(err);
        });

      if (reportL1 !== "") {
        axios
          .post(baseUrl+"add_send_user_mail", {
            email: email,
            subject: "User Registration",
            text: "A new user has been registered.",
            // attachment: selectedImage,
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
        } catch (error) {
          console.error("Error Updating Education details:", error);
        }
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
            const response = await axios.put(
              baseUrl+"update_user_doc",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } else {
            console.log(`No file uploaded for document ${document._id}`);
          }
        }
        toastAlert("Documents Updated");
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
        axios.put(
          `${baseUrl}`+`updateuserotherfielddata/${id}`,
          // {
          //   id:element.id,
          //   field_name: element.field_name,
          //   lastUpdatedBy: loginUserId,
          //   field_value: element.field_value,
          // }
          formDataa,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        formDataa.delete("id");
        formDataa.delete("field_name");
        formDataa.delete("lastupdated_by");
        formDataa.delete("field_value");
      }

      // console.log(uid, "yha uid hai put ke bad");
      // console.log(panUpload, "pan hai yha");
      // axios
      //   .post(baseUrl+"add_send_user_mail", {
      //     email: email,
      //     subject: "User Registration",
      //     text: "A new user has been registered.",
      //     attachment: profile,
      //     login_id: loginId,
      //     name: username,
      //     password: password,
      //   })
      //   .then((res) => {
      //     console.log("Email sent successfully:", res.data);
      //   })
      //   .catch((error) => {
      //     console.log("Failed to send email:", error);
      //   });
    } else {
      if (contact.length !== 10) {
        if (isValidcontact == false)
          toastError("Enter Phone Number in Proper Format");
      } else if (validEmail != true) {
        alert("Enter Valid Email");
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
    const newContact = event.target.value;
    setContact(newContact);

    if (newContact === "") {
      setValidContact(false);
    } else {
      setValidContact(/^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact));
    }
  }

  function handlePersonalContactChange(event) {
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
    return <Navigate to="/admin/user-overview" />;
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

  const generateLoginId = () => {
    const randomSuffix = Math.floor(Math.random() * 1000);
    const generatedLoginId = `${username}@${randomSuffix}`;
    setLoginId(generatedLoginId);
  };

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
    if (itemToRemove && itemToRemove.education_id) {
      try {
        await axios.delete(
          `${baseUrl}`+`delete_education/${itemToRemove.education_id}`
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
    "Personal",
    "Salary",
    "Documents",
    "Family Details",
    "Education Details",
    "Documents Update",
  ];

  const genralFields = (
    <>
      <FieldContainer
        label="Full Name"
        astric={true}
        fieldGrid={3}
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
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
        fieldGrid={3}
        required={false}
        value={email}
        onChange={handleEmailChange}
      />
      {!validEmail && <p style={{ color: "red" }}>*Please enter valid email</p>}
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
        label="Official Contact"
        type="number"
        fieldGrid={3}
        value={contact}
        required={true}
        onChange={handleContactChange}
        onBlur={handleContentBlur}
      />
      {(isContactTouched || contact?.length >= 10) && !isValidcontact && (
        <p style={{ color: "red" }}>*Please enter a valid Number</p>
      )}
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

      <ContactNumberReact
        label="Emergency Contact1"
        astric={true}
        parentComponentContact={emergencyContact}
        setParentComponentContact={setEmergencyContact}
      />

      <FieldContainer
        label="Emergency Contact 1 Person Name"
        astric={true}
        fieldGrid={3}
        value={emergencyContactName}
        onChange={(e) => setEmergencyContactName(e.target.value)}
      />

      <FieldContainer
        label="Emergency Contact 1 Person Relation"
        astric={true}
        fieldGrid={3}
        value={emergencyContactRelation}
        onChange={(e) => setEmergencyContactRelation(e.target.value)}
      />

      <ContactNumberReact
        label="Emergency Contact2"
        parentComponentContact={emergencyContact2}
        setParentComponentContact={setEmergencyContact2}
      />

      <FieldContainer
        label="Emergency Contact 2 Person Name"
        fieldGrid={3}
        value={emergencyContactName2}
        onChange={(e) => setEmergencyContactName2(e.target.value)}
      />

      <FieldContainer
        label="Emergency Contact 2 Person Relation"
        fieldGrid={3}
        value={emergencyContactRelation2}
        onChange={(e) => setEmergencyContactRelation2(e.target.value)}
      />

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
          Seat Number <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={refrenceData?.map((option) => ({
            value: `${option?.sitting_id}`,
            label: `${option?.sitting_ref_no} | ${option?.sitting_area}`,
          }))}
          value={sittingValue}
          onChange={(e) => {
            const selectedSittingId = e.value;
            setSitting(selectedSittingId);
            const selectedOption = refrenceData.find(
              (option) => option.sitting_id === Number(selectedSittingId)
            );
            setRoomId(selectedOption);
          }}
          required={false}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev + 1)}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </>
  );

  const salaryFields = (
    <>
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

      {(jobType === "WFH" || jobType === "WFHD") && (
        <>
          <FieldContainer
            label="Salary"
            type="number"
            fieldGrid={3}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <div className="form-group col-3">
            <label className="form-label">
              TDS Applicable<sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={tdsApplicableData?.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: tdsApplicable,
                label: tdsApplicable,
              }}
              onChange={(e) => {
                const selectedValue = e.value;
                setTdsApplicable(e.value);
                setShowTdsPercentage(selectedValue === "Yes");
              }}
              // required
            />
          </div>
          {showTdsPercentage && (
            <FieldContainer
              label="TDS Percentage"
              fieldGrid={3}
              type="number"
              value={tdsPercentage}
              required={false}
              onChange={(e) => setTdsPercentage(e.target.value)}
            />
          )}
        </>
      )}
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
      {userStatus == "Resign" && (
        <FieldContainer
          type="date"
          label="Date of Resign"
          fieldGrid={3}
          value={releavingDate}
          onChange={(e) => setReleavingDate(e.target.value)}
        />
      )}

      <FieldContainer
        label="Bank Name"
        astric={true}
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
      />
      <FieldContainer
        label="Bank Account Number"
        astric={true}
        value={bankAccountNumber}
        onChange={(e) => setBankAccountNumber(e.target.value)}
      />
      <FieldContainer
        label="IFSC"
        astric={true}
        value={IFSC}
        onChange={(e) => setIFSC(e.target.value.toUpperCase())}
      />
      <FieldContainer
        label="Beneficiary"
        value={beneficiary}
        onChange={(e) => setBeneficiary(e.target.value)}
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
      </div>
    </>
  );

  const documentsFields = (
    <>
      <FieldContainer
        label="UID Number"
        onChange={handleUIDInputChange}
        fieldGrid={5}
        type="text"
        required={false}
        value={uidNo}
      />

      <FieldContainer
        label="UID"
        onChange={(e) => setUID(e.target.files[0])}
        fieldGrid={5}
        type="file"
        required={false}
      />

      <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
        <div className="form-group download_btn">
          <label>&nbsp;</label>
          {uidImage && (
            <a href={uidImage} download>
              <i className="bi bi-cloud-arrow-down"></i> UID Download{" "}
            </a>
          )}
        </div>
      </div>
      <FieldContainer
        label="PAN Number"
        onChange={handlePANChange}
        fieldGrid={5}
        type="text"
        required={false}
        value={panNo}
      />

      <FieldContainer
        label="Pan Image"
        onChange={(e) => setPanUpload(e.target.files[0])}
        fieldGrid={5}
        type="file"
        required={false}
      />
      <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
        <div className="form-group download_btn">
          <label>&nbsp;</label>
          {panImage && (
            <a href={panImage} download>
              <i className="bi bi-cloud-arrow-down"></i> PAN Download{" "}
            </a>
          )}
        </div>
      </div>

      <div className="form-group col-5">
        <label className="form-label">Higest Qualification</label>
        <Select
          className=""
          options={higestQualificationData?.map((option) => ({
            value: `${option}`,
            label: `${option}`,
          }))}
          value={{
            value: higestQualification,
            label: `${higestQualification}`,
          }}
          onChange={(e) => {
            setHigestQualification(e.value);
          }}
          required
        />
      </div>
      <FieldContainer
        label="Highest Qualification"
        onChange={(e) => setHighestUpload(e.target.files[0])}
        fieldGrid={5}
        type="file"
        required={false}
      />
      <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
        <div className="form-group download_btn">
          <label>&nbsp;</label>
          {highestQualificationImage && (
            <a href={highestQualificationImage} download>
              <i className="bi bi-cloud-arrow-down"></i> Highest
              QualificationImage Download{" "}
            </a>
          )}
        </div>
      </div>
      <FieldContainer
        label="Other Image"
        onChange={(e) => setOtherUpload(e.target.files[0])}
        fieldGrid={10}
        type="file"
        required={false}
      />
      <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
        <div className="form-group download_btn">
          <label>&nbsp;</label>
          {otherImage && (
            <a href={otherImage} download>
              <i className="bi bi-cloud-arrow-down"></i> Highest
              QualificationImage Download{" "}
            </a>
          )}
        </div>
      </div>
      {!isValidPAN && <p style={{ color: "red" }}>Invalid PAN format</p>}
      {!isValidUID && (
        <p style={{ color: "red" }}>Invalid Aadhaar number format</p>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
      </div>

      {otherDocuments && (
        <div>
          <h3>Other Documents</h3>
          {otherDocuments?.map((item, index) => {
            return (
              <div key={index} className="d-flex ">
                <input
                  type="text"
                  className="form-control mt-2 col-6 me-2"
                  value={item.field_name}
                  onChange={(e) => otherDocumentNameChangeHandle(e, index)}
                />
                <input
                  className="form-control mt-2 col-6 "
                  label={item.field_name}
                  onChange={(e) => otherDocumentImageChangeHandler(e, index)}
                  type="file"
                  required={false}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  const personalFields = (
    <>
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

      <FieldContainer
        label="Nationality"
        astric={true}
        value={nationality}
        onChange={(e) => setNationality(e.target.value)}
      />

      <div className="from-group col-6">
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
      {dateOfBirth !== "" && <FieldContainer label="Age" value={age} />}
      <FieldContainer
        label="Father's Name"
        astric={true}
        value={FatherName}
        required={false}
        onChange={(e) => setFatherName(e.target.value)}
      />
      <FieldContainer
        label="Mother's Name"
        astric={true}
        value={motherName}
        required={false}
        onChange={(e) => setMotherName(e.target.value)}
      />
      <FieldContainer
        label="Hobbies"
        value={hobbies}
        required={false}
        onChange={(e) => setHobbies(e.target.value)}
      />
      <div className="form-group col-6">
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
      <div className="form-group col-6">
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
          value={spouseName}
          onChange={(e) => setSpouseName(e.target.value)}
          required={false}
        />
      )}
      {maritialStatus == "Married" && (
        <FieldContainer
          label="Date Of Marriage"
          type="date"
          value={dateOfMarraige}
          onChange={(e) => setDateOfMarraige(e.target.value)}
          required={false}
        />
      )}

      <FieldContainer
        label="Address"
        astric={true}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required={false}
      />
      <FieldContainer
        label="City"
        astric={true}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required={false}
      />
      <div className="form-group col-6">
        <IndianStates
          newValue={state}
          onChange={(option) => setState(option ? option.value : null)}
        />
      </div>
      <FieldContainer
        label="Pincode"
        astric={true}
        value={pincode}
        maxLength={6}
        onChange={(e) => setPincode(e.target.value)}
        required={false}
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
      </div>
    </>
  );

  const familyFields = (
    <>
      {familyDetails?.map((detail, index) => (
        <div key={index} mb={2}>
          <div className="row">
            {Object.keys(detail)?.map((key) => {
              if (familyDisplayFields.includes(key)) {
                return key === "DOB" ? (
                  <FieldContainer
                    key={key}
                    fieldGrid={3}
                    type="date"
                    name={key}
                    label="Date of Birth"
                    value={
                      key === "DOB" && detail[key]
                        ? detail[key].split("T")[0]
                        : detail[key]
                    }
                    onChange={(e) => handleFamilyDetailsChange(index, e)}
                  />
                ) : (
                  <FieldContainer
                    key={key}
                    fieldGrid={3}
                    name={key}
                    label={familyFieldLabels[key]}
                    value={detail[key]}
                    onChange={(e) => handleFamilyDetailsChange(index, e)}
                  />
                );
              }
              return null;
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

      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
      </div>
    </>
  );

  const educationFields = (
    <>
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
            onClick={handleAddEducationDetails}
            className="btn btn-outline-warning"
            type="button"
          >
            Add More Education Details
          </button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev - 1)}
        >
          <ArrowBackIosIcon />
        </button>
      </div>
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
        {activeAccordionIndex === 1 && personalFields}
        {activeAccordionIndex === 2 && salaryFields}
        {activeAccordionIndex === 3 && documentsFields}
        {activeAccordionIndex === 4 && familyFields}
        {activeAccordionIndex === 5 && educationFields}
        {activeAccordionIndex === 6 && documentFieldsNew}
      </FormContainer>
    </>
  );
};

export default UserUpdate;
