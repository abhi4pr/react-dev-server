import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { AiOutlineReload } from "react-icons/ai";
import Select from "react-select";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import WhatsappAPI from "../../../WhatsappAPI/WhatsappAPI";
import { baseUrl } from "../../../../utils/config";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

const onBoardStatus = 1;

const WFHDRegister = ({ userUpdateID }) => {
  const offerLetter = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const [loading, setLoading] = useState(false);

  const jobTypeData = ["WFHD", "WFO", "WFH"];
  const tdsApplicableData = ["Yes", "No"];
  const genderData = ["Male", "Female", "Other"];

  const whatsappApi = WhatsappAPI();
  const { toastAlert, toastError } = useGlobalContext();

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const deptID = decodedToken.dept_id;
  const loginRole = decodedToken.role_id;

  const [username, setUserName] = useState("");
  const [jobType, setJobType] = useState("WFHD");
  const [roles, setRoles] = useState("");
  const [reportL1, setReportL1] = useState("");
  const [reportL2, setReportL2] = useState("");
  const [reportL3, setReportL3] = useState("");
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);

  const [city, setCity] = useState("");
  const [cityData, setCityData] = useState([]);

  const [personalEmail, setPersonalEmail] = useState("");
  const [validPersonalEmail, setValidPersonalEmail] = useState(true);

  const [annexurePdf, setAnnexurePdf] = useState("");

  //TDS fields
  const [tdsApplicable, setTdsApplicable] = useState("No");
  const [tdsPercentage, setTdsPercentage] = useState(0);
  const [showTdsPercentage, setShowTdsPercentage] = useState(false);

  const [contact, setContact] = useState("");
  const [personalContact, setPersonalContact] = useState("");

  const [userCtc, setUserCtc] = useState("");

  const [isValidcontact, setValidContact] = useState(false);
  const [isValidcontact1, setValidContact1] = useState(false);
  const [isContactTouched, setisContactTouched] = useState(false);
  const [isContactTouched1, setisContactTouched1] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const [sitting, setSitting] = useState("");
  const [roomId, setRoomId] = useState("");

  const [department, setDepartment] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);

  const [usersData, getUsersData] = useState([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [loginResponse, setLoginResponse] = useState("");

  const [designation, setDesignation] = useState("");
  const [sendLetter, setSendLetter] = useState({});
  const [joiningDate, setJoiningDate] = useState("");
  const [releavingDate, setReleavingDate] = useState("");
  const [salary, setSalary] = useState("");
  const [yearlySalary, setYearlySalary] = useState("");

  const [lastIndexUsed, setLastIndexUsed] = useState(-1);

  const [designationData, setDesignationData] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  //   const [roledata, getRoleData] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  const [lastUpdated, setLastUpdated] = useState("");

  const [attStatus, setAttStatus] = useState("");

  const [isRequired, setIsRequired] = useState({
    username: false,
    department: false,
    reportL1: false,
    personalEmail: false,
    city: false,
    salary: false,
    personalContact: false,
    contact: false,
    loginId: false,
    password: false,
    joiningDate: false,
    gender: false,
    dateOfBirth: false,
  });

  useEffect(() => {
    if (userUpdateID)
      axios
        .get(`${baseUrl}` + `get_single_user/${userUpdateID}`)
        .then((res) => {
          const fetchedData = res.data;
          const {
            user_name,
            user_email_id,
            user_login_id,
            user_login_password,
            user_designation,
            sitting_id,
            permanent_city,
            ctc,
            room_id,
            dept_id,
            Report_L1,
            Report_L2,
            Report_L3,
            PersonalEmail,
            joining_date,
            salary,
            Gender,
            DOB,
            tbs_applicable,
            tds_per,
            alternate_contact,
            PersonalNumber,
            att_status,
          } = fetchedData;

          // console.log(Report_L2, "come to l2");

          setUserName(user_name);
          setDepartment(dept_id);
          setDesignation(user_designation);
          setCity(permanent_city);
          setReportL1(Report_L1);
          setSalary(salary);
          setLoginId(user_login_id);
          // setJoiningDate(joining_date?.split("T")?.[0]);
          // setDateOfBirth(DOB?.split("T")?.[0]);
          setYearlySalary(ctc);
          setGender(Gender);
          setReportL2(Report_L2);
          setReportL3(Report_L3);
          setTdsApplicable(tbs_applicable);
          setTdsPercentage(tds_per);
          setPersonalEmail(user_email_id);
          setContact(alternate_contact);
          setPersonalContact(PersonalNumber);
          setEmail(user_email_id);
          setPassword(user_login_password);
          setSitting(sitting_id);
          setRoomId(room_id);
          setAttStatus(att_status);
        });
  }, [userUpdateID]);

  useEffect(() => {
    setDepartment(deptID);
  }, [deptID]);

  useEffect(() => {
    // console.log(reportL2, "report l2");
  }, [reportL2]);

  // Handle change for Monthly Salary
  const handleMonthlySalaryChange = (e) => {
    const monthlySalary = e.target.value;

    if (monthlySalary === "") {
      setIsRequired((prev) => ({
        ...prev,
        salary: true,
      }));
    } else {
      setIsRequired((prev) => ({
        ...prev,
        salary: false,
      }));
    }

    setSalary(monthlySalary);
    setLastUpdated("monthly");
  };

  // Handle change for Yearly Salary
  const handleYearlySalaryChange = (e) => {
    const yearlySalaryValue = e.target.value;
    setYearlySalary(yearlySalaryValue);
    setLastUpdated("yearly");

    if (yearlySalaryValue === "") {
      setIsRequired((prev) => ({
        ...prev,
        salary: true,
      }));
    } else {
      setIsRequired((prev) => ({
        ...prev,
        salary: false,
      }));
    }
  };

  // Update Yearly Salary when Monthly Salary changes
  useEffect(() => {
    if (lastUpdated === "monthly") {
      const yearly = salary * 12;
      setYearlySalary(yearly.toString());
    }
  }, [salary, lastUpdated]);

  // Update Monthly Salary when Yearly Salary changes
  useEffect(() => {
    if (lastUpdated === "yearly") {
      const monthly = yearlySalary / 12;
      setSalary(monthly.toString());
    }
  }, [yearlySalary, lastUpdated]);

  useEffect(() => {
    if (lastUpdated === "yearly") {
      const monthly = Math.round(yearlySalary / 12);
      setSalary(monthly.toString()); // Now sets the salary to a rounded figure
    }
  }, [yearlySalary, lastUpdated]);

  useEffect(() => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });

    axios.get(baseUrl + "get_all_users").then((res) => {
      getUsersData(res.data.data);
    });

    axios.get(baseUrl + "get_all_cities").then((res) => {
      setCityData(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (department) {
      axios
        .get(baseUrl + `get_all_designations_by_deptId/${department}`)
        .then((res) => {
          setDesignationData(res.data.data);
          // Set the default designation to the first option
          if (res.data.data.length > 0) {
            setDesignation(res.data.data[0].desi_id);
          }
        });
    }
  }, [department]);

  function validateAndCorrectUserName(userName) {
    // Remove extra white spaces and trim the userName
    userName = userName.replace(/\s{2,}/g, " ").trim();

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
        filteredPart.charAt(0)?.toUpperCase() +
        filteredPart.slice(1)?.toLowerCase()
      );
    });

    // Join the corrected parts back into a single string
    const correctedUserName = correctedNameParts.join(" ");

    // return correctedUserName;
    return correctedUserName.replace(/\s+/g, " ").trim();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username == "") {
      setIsRequired((perv) => ({ ...perv, username: true }));
    }
    if (department == "") {
      setIsRequired((perv) => ({ ...perv, department: true }));
    }
    if (reportL1 == "") {
      setIsRequired((perv) => ({ ...perv, reportL1: true }));
    }
    if (personalEmail == "") {
      setIsRequired((perv) => ({ ...perv, personalEmail: true }));
    }
    if (city == "") {
      setIsRequired((perv) => ({ ...perv, city: true }));
    }
    if (salary == "") {
      setIsRequired((perv) => ({ ...perv, salary: true }));
    }
    if (personalContact == "") {
      setIsRequired((perv) => ({ ...perv, personalContact: true }));
    }
    if (contact == "") {
      setIsRequired((perv) => ({ ...perv, contact: true }));
    }
    if (salary == "") {
      setIsRequired((perv) => ({ ...perv, salary: true }));
    }
    if (loginId == "") {
      setIsRequired((perv) => ({ ...perv, loginId: true }));
    }
    if (password == "") {
      setIsRequired((perv) => ({ ...perv, password: true }));
    }
    if (joiningDate == "") {
      setIsRequired((perv) => ({ ...perv, joiningDate: true }));
    }
    if (gender == "") {
      setIsRequired((perv) => ({ ...perv, gender: true }));
    }
    if (dateOfBirth == "") {
      setIsRequired((perv) => ({ ...perv, dateOfBirth: true }));
    }

    if (!jobType) {
      return toastError("Fill Required Field");
    } else if (!designation || designation == "") {
      return toastError("Fill Required Field");
    } else if (!gender || gender == "") {
      return toastError("Fill Required Field");
    } else if (!reportL1 || reportL1 == "") {
      return toastError("Fill Required Field");
    } else if (!personalContact || personalContact == "") {
      return toastError(
        "Personal Contact Is Required and should be equal to 10"
      );
    } else if (!personalEmail || personalEmail == "") {
      return toastError("Fill Required Field");
    } else if (!contact || contact == "") {
      return toastError(
        "Alternate Contact Is Required and should be equal to 10"
      );
    }

    const payload = {
      dept_id: department,
      permanent_city: city,
      created_by: loginUserId,
      user_name: validateAndCorrectUserName(username),
      role_id: 4,
      image: selectedImage,
      ctc: Number(yearlySalary),
      offer_letter_send: sendLetter.value ? Boolean(sendLetter.value) : false,
      tds_applicable: tdsApplicable,
      tds_per: tdsPercentage,
      user_login_id: loginId,
      user_login_password: password,
      sitting_id: 183,
      room_id: 1,
      Gender: gender,
      job_type: jobType,
      DOB: dateOfBirth,
      alternate_contact: contact,
      personal_number: personalContact,
      user_contact_no: personalContact,
      user_email_id: personalEmail,
      att_status: attStatus || "registered",
      year_salary: Number(yearlySalary),
      salary: Number(salary),
      report_L1: reportL1,
      report_L2: reportL2,
      report_L3: reportL3,
      user_designation: designation,
      joining_date: joiningDate,
      releaving_date: releavingDate,
      onboard_status: onBoardStatus,
    };

    const formData = new FormData();

    if (userUpdateID) {
      formData.append("user_id", userUpdateID);
    }
    formData.append("dept_id", department);
    formData.append("permanent_city", city);
    formData.append("created_by", loginUserId);
    formData.append("user_name", validateAndCorrectUserName(username));
    formData.append("role_id", 4);
    formData.append("image", selectedImage);
    // formData.append("permanent_city", city?.value ? city.value : "");
    formData.append("ctc", Number(yearlySalary));
    formData.append(
      "offer_letter_send",
      sendLetter.value ? Boolean(sendLetter.value) : false
    );
    // formData.append("annexure_pdf", annexurePdf);
    formData.append("tds_applicable", tdsApplicable);
    formData.append("tds_per", tdsPercentage);
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("sitting_id", 183);
    formData.append("room_id", 1);
    // formData.append("dept_id", department);
    formData.append("Gender", gender);
    formData.append("job_type", jobType);
    formData.append("DOB", dateOfBirth);

    // formData.append("personal_number", personalContact);
    formData.append("alternate_contact", contact); //contact all replace to alternate contact
    formData.append("personal_number", personalContact);
    formData.append("user_contact_no", personalContact);

    // formData.append("user_email_id", email);
    // formData.append("Personal_email", personalEmail);
    formData.append("user_email_id", personalEmail);

    formData.append("att_status", attStatus || "registered");

    formData.append("year_salary", Number(yearlySalary));
    formData.append("salary", Number(salary));

    formData.append("report_L1", reportL1);
    formData.append("report_L2", reportL2);
    formData.append("report_L3", reportL3);
    formData.append("user_designation", designation);
    formData.append("joining_date", joiningDate);
    formData.append("releaving_date", releavingDate);
    formData.append("onboard_status", onBoardStatus);

    // if (isValidcontact1 == true && validEmail == true) {

    try {
      if (!userUpdateID) {
        setLoading(true);
        const isLoginIdExists = usersData.some(
          (user) =>
            user.user_login_id?.toLocaleLowerCase() ===
            loginId?.toLocaleLowerCase()
        );
        const contactNumberExists = usersData?.some(
          (user) => user.personal_contact == personalContact
        );

        const emailIdExists = usersData?.some(
          (user) =>
            user.user_email_id?.toLocaleLowerCase() ==
            personalEmail?.toLocaleLowerCase()
        );

        if (isLoginIdExists) {
          alert("this login ID already exists");
        } else if (contactNumberExists) {
          alert(" Contact Already Exists");
        } else if (emailIdExists) {
          alert(" Email Already Exists");
        }
      } else {
        setLoading(true);

        if (userUpdateID) {
          await axios
            .put(`${baseUrl}` + `update_user`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {
              setIsFormSubmitted(true);
            });
          return;
        }
      }
      await axios.post(baseUrl + "add_user", payload, {}).then(() => {
        setIsFormSubmitted(true);
      });

      whatsappApi.callWhatsAPI(
        "Preonboarding Register",
        JSON.stringify(personalContact),
        username,
        [username, loginId, password, "http://jarvis.work/"]
      );
      await axios
        .post(baseUrl + "add_send_user_mail", {
          email: personalEmail,
          subject: "User Registration",
          text: "A new user has been onboard.",
          attachment: selectedImage,
          login_id: loginId,
          name: username,
          password: password,
          status: "onboarded",
        })
        .then((res) => {
          // setLoading(true);
          console.log("Email sent successfully:", res.data);
        })
        .then((res) => {
          if (res.status == 200) {
            toastAlert("User Registerd");
            setIsFormSubmitted(true);
            setLoading(false);
          } else {
            setLoading(false);
            toastError("Sorry User is Not Created, Please try again later");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("Failed to send email:", error);
        });

      setUserName("");
      setRoles("");
      setEmail("");
      setLoginId("");
      setContact("");
      setPersonalContact("");
      setUserCtc("");
      setPassword("");
      setDepartment("");
      setSitting("");
      setRoomId("");
      setCity("");
      setSendLetter("");
      setAnnexurePdf("");
      setPersonalEmail("");
      setReportL1("");
      setReportL2("");
      setReportL3("");
      setDesignation("");
      toastAlert("User Registerd");
      setIsFormSubmitted(true);
    } catch (error) {
      console.log("Failed to submit form", error);
    } finally {
      setLoading(false);
    }
  };

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
  function handlePersonalEmailChange(e) {
    const newEmail = e.target.value;
    setPersonalEmail(newEmail);

    if (personalEmail === "") {
      setIsRequired((prev) => ({ ...prev, personalEmail: true }));
    } else {
      setIsRequired((prev) => ({ ...prev, personalEmail: false }));
    }

    if (newEmail == "") {
      setValidPersonalEmail(false);
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setValidPersonalEmail(emailRegex.test(newEmail));
    }
  }

  //user Contact validation
  function handleContactChange(event) {
    if (event.target.value.length <= 10) {
      const newContact1 = event.target.value;
      setContact(newContact1);

      setisContactTouched(true);
      if (contact?.length < 10) {
        setValidContact(false);
      }
      if (newContact1 === "") {
        setIsRequired((prev) => ({
          ...prev,
          contact: true,
        }));
      } else {
        setIsRequired((prev) => ({
          ...prev,
          contact: false,
        }));
      }

      if (
        newContact1 === "" ||
        (newContact1.length === 1 && parseInt(newContact1) < 6)
      ) {
        setContact("");
      } else {
        setContact(newContact1);
      }

      if (newContact1 === "") {
        setValidContact(false);
      } else {
        setValidContact(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact1)
        );
      }
    }
  }

  // function handleContactBlur() {
  //   setisContactTouched(true);
  //   if (contact?.length < 10) {
  //     setValidContact(false);
  //   }
  // }

  //personal Contact validation

  function handlePersonalContactChange(event) {
    if (event.target.value.length <= 10) {
      const newContact1 = event.target.value;
      setPersonalContact(newContact1);

      setisContactTouched1(true);
      if (personalContact.length < 10) {
        setValidContact1(false);
      }
      if (newContact1 === "") {
        setIsRequired((prev) => ({
          ...prev,
          personalContact: true,
        }));
      } else {
        setIsRequired((prev) => ({
          ...prev,
          personalContact: false,
        }));
      }

      if (
        newContact1 === "" ||
        (newContact1.length === 1 && parseInt(newContact1) < 6)
      ) {
        setPersonalContact("");
      } else {
        setPersonalContact(newContact1);
      }

      if (newContact1 === "") {
        setValidContact1(false);
      } else {
        setValidContact1(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact1)
        );
      }
    }
  }

  // function handlePersonalContactBlur() {
  //   setisContactTouched1(true);
  //   if (personalContact.length < 10) {
  //     setValidContact1(false);
  //   }
  // }

  if (isFormSubmitted) {
    return <Navigate to="/admin/wfhd-overview" />;
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
      setIsRequired({ ...isRequired, password: false });
    }
  };

  const generateLoginId = async () => {
    const userName = username.trim()?.toLowerCase().split(" ");

    // Extracting last 4 and 6 digits from personal contact
    const personalContactLast4 = personalContact.slice(-4);
    const personalContactLast6 = personalContact.slice(-6);

    // Define login ID options
    let loginIdOptions = [
      userName[0], // lalit
      userName.join("."), // lalit.gour
      userName[0] + personalContactLast4, // lalit5413
      userName[0] + personalContactLast6, // lalit815413
    ];

    if (userName.length > 1) {
      loginIdOptions.push(
        userName[0].charAt(0) + userName[1], // lgour
        userName.join("") // lalitgour
      );
    }

    const nextIndex = (lastIndexUsed + 1) % loginIdOptions.length;
    setLastIndexUsed(nextIndex);
    let generatedLoginId = loginIdOptions[nextIndex];

    // Check if the generated login ID already exists
    const response = await axios.post(baseUrl + `check_login_exist`, {
      user_login_id: generatedLoginId,
    });

    if (response.data.message === "login id not available") {
      // If login ID already exists, find the next available one
      let index = 1;
      while (true) {
        const nextGeneratedLoginId = `${generatedLoginId}_${index}`;
        const checkExistenceResponse = await axios.post(
          baseUrl + `check_login_exist`,
          {
            user_login_id: nextGeneratedLoginId,
          }
        );
        if (checkExistenceResponse.data.message === "login id available") {
          generatedLoginId = nextGeneratedLoginId;
          break;
        }
        index++;
      }
    }

    setLoginId(generatedLoginId);
    setLoginResponse(response.data.message);

    if (generatedLoginId?.length > 0) {
      setIsRequired((prev) => ({ ...prev, loginId: false }));
    }
  };

  const handleLoginIdChange = (event) => {
    const selectedLoginId = event.target.value;
    if (selectedLoginId == "") {
      setIsRequired((prev) => ({ ...prev, loginId: true }));
    } else {
      setIsRequired((prev) => ({ ...prev, loginId: false }));
    }
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
    const selectedDate = e;
    const age = calculateAge(selectedDate);
    if (selectedDate === "") {
      setIsRequired((prev) => ({
        ...prev,
        dateOfBirth: true,
      }));
    } else {
      setIsRequired((prev) => ({
        ...prev,
        dateOfBirth: false,
      }));
    }

    if (age < 15) {
      window.alert("Your age must be greater than 15 years.");
    } else {
      setDateOfBirth(selectedDate);
    }
  };
  const disableFutureDates = (date) => {
    return dayjs(date).isAfter(dayjs(), "day");
  };

  const handleFullNameChange = (event) => {
    let userName = event.target.value;

    if (userName === "") {
      setIsRequired((prev) => ({ ...prev, username: true }));
    } else {
      setIsRequired((prev) => ({ ...prev, username: false }));
    }

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

  return (
    <div>
      <FormContainer
        mainTitle="WFHD Register"
        submitButton={false}
        link={"/admin/wfhd-overview"}
      />
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">WFHD Registration</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <FieldContainer
                label="Full Name"
                astric
                fieldGrid={3}
                required
                value={username}
                onChange={handleFullNameChange}
              />
              {isRequired.username && (
                <p className="form-error">Please Enter Full Name</p>
              )}
            </div>

            <div className="form-group col-3">
              <label className="form-label">
                Job Type <sup className="form-error">*</sup>
              </label>
              <Select
                className=""
                options={jobTypeData.map((option) => ({
                  value: `${option}`,
                  label: `${option}`,
                }))}
                value={{
                  value: jobType,
                  label: `${jobType}`,
                }}
                onChange={(e) => {
                  setJobType(e.value);
                }}
                isDisabled={true}
                required
              />
            </div>

            <div className="form-group col-3">
              <label className="form-label">
                Department Name <sup className="form-error">*</sup>
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
                  const selectedDepartment = e.value;
                  if (selectedDepartment === "") {
                    setIsRequired((prev) => ({
                      ...prev,
                      department: true,
                    }));
                  } else {
                    setIsRequired((prev) => ({
                      ...prev,
                      department: false,
                    }));
                  }
                }}
                required
                isDisabled={loginRole == 2}
              />
              {isRequired.department && (
                <p className="form-error">Please Enter Department</p>
              )}
            </div>

            <div className="form-group col-3">
              <label className="form-label">
                Designation <sup className="form-error">*</sup>
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
                    designationData?.find(
                      (user) => user.desi_id === designation
                    )?.desi_name || "",
                }}
                onChange={(e) => {
                  setDesignation(e.value);
                }}
                required
              />
            </div>

            <div className="form-group col-3">
              <label className="form-label">
                Report L1 <sup className="form-error">*</sup>
              </label>
              <Select
                required={true}
                className=""
                options={usersData.map((option) => ({
                  value: option.user_id,
                  label: `${option.user_name}`,
                }))}
                value={{
                  value: reportL1,
                  label:
                    usersData.find((user) => user.user_id === reportL1)
                      ?.user_name || "",
                }}
                onChange={(e) => {
                  setReportL1(e.value);
                  const selectedReport = e.value;
                  if (selectedReport === "") {
                    setIsRequired((prev) => ({
                      ...prev,
                      reportL1: true,
                    }));
                  } else {
                    setIsRequired((prev) => ({
                      ...prev,
                      reportL1: false,
                    }));
                  }
                }}
              />
              {isRequired.reportL1 && (
                <p className="form-error">*Please select Report L1</p>
              )}
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
                    usersData.find((user) => user.user_id === reportL2)
                      ?.user_name || "",
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
                    usersData.find((user) => user.user_id === reportL3)
                      ?.user_name || "",
                }}
                onChange={(e) => {
                  setReportL3(e.value);
                }}
                required={false}
              />
            </div>

            {/* <FieldContainer
          label="Email"
          type="email"
          fieldGrid={3}
          required
          value={email}
          onChange={handleEmailChange}
        />
        {!validEmail && (
          <p  className="form-error">*Please enter valid email</p>
        )} */}
            <div className="col-md-3">
              <FieldContainer
                label="Personal Email"
                type="email"
                astric
                fieldGrid={3}
                required={false}
                value={personalEmail}
                onChange={handlePersonalEmailChange}
              />
              {!validPersonalEmail && (
                <p className="form-error">*Please enter valid email</p>
              )}
              {isRequired.personalEmail && (
                <p className="form-error">Please select Personal Email</p>
              )}
            </div>
            {/* <FieldContainer
          label=" City"
          type="text"
          fieldGrid={3}
          required={false}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        /> */}
            <div className="form-group col-3">
              <label className="form-label">
                City <sup className="form-error">*</sup>
              </label>
              <Select
                options={cityData.map((city) => ({
                  value: city.city_name,
                  label: city.city_name,
                }))}
                onChange={(e) => {
                  setCity(e ? e.value : "");

                  const selectCity = e.value;
                  if (selectCity === "") {
                    setIsRequired((prev) => ({
                      ...prev,
                      city: true,
                    }));
                  } else {
                    setIsRequired((prev) => ({
                      ...prev,
                      city: false,
                    }));
                  }
                }}
                required={true}
                // value={city}
                value={{
                  value: city,
                  label:
                    cityData.find((gotCity) => gotCity.city_name == city)
                      ?.city_name || "",
                }}
                placeholder="Select a city..."
                isClearable
              />
              {isRequired.city && (
                <p className="form-error">Please select City</p>
              )}
            </div>

            {/* {jobType === "WFH" && ( */}
            <>
              <div className="form-group col-3">
                <FieldContainer
                  label="Monthly Salary"
                  astric
                  type="number"
                  fieldGrid={3}
                  value={salary}
                  onChange={handleMonthlySalaryChange}
                />
                {isRequired.salary && (
                  <p className="form-error">Please Enter Monthly Salary</p>
                )}
              </div>

              <div className="form-group col-3">
                <FieldContainer
                  label="CTC"
                  astric
                  type="number"
                  fieldGrid={3}
                  value={yearlySalary}
                  onChange={handleYearlySalaryChange}
                />
                {isRequired.salary && (
                  <p className="form-error">Please Enter CTC</p>
                )}
              </div>

              <div className="form-group col-3">
                <label className="form-label">
                  TDS Applicable<sup className="form-error">*</sup>
                </label>
                <Select
                  className=""
                  options={tdsApplicableData.map((option) => ({
                    value: `${option}`,
                    label: `${option}`,
                  }))}
                  value={{
                    value: tdsApplicable,
                    label: `${tdsApplicable}`,
                  }}
                  onChange={(e) => {
                    const selectedValue = e.value;
                    setTdsApplicable(e.value);
                    setShowTdsPercentage(selectedValue === "Yes");
                  }}
                  required={false}
                />
              </div>
              {showTdsPercentage && (
                <FieldContainer
                  label="TDS Percentage"
                  fieldGrid={3}
                  type="number"
                  value={tdsPercentage}
                  onChange={(e) => setTdsPercentage(e.target.value)}
                  required={false}
                />
              )}
            </>
            {/* )} */}

            {/* {jobType == "WFHD" && ( */}
            {/* <FieldContainer
          label=" CTC *"
          type="number"
          fieldGrid={3}
          required={true}
          value={userCtc}
          onChange={(e) => setUserCtc(e.target.value)}
        /> */}
            {/* )} */}

            {/* {jobType == "WFO" && (
          <div className="form-group col-3">
            <label className="form-label">
              Letter send <sup  className="form-error">*</sup>
            </label>
            <Select
              options={offerLetter.map((option) => ({
                value: `${option.value}`,
                label: `${option.label}`,
              }))}
              value={{
                value: sendLetter.value,
                label: sendLetter.label || "", // Fallback to empty string if label is undefined
              }}
              onChange={(e) => {
                setSendLetter(e);
              }}
              required
            />
          </div>
        )} */}

            {/* {sendLetter.label == "Yes" && (
          <FieldContainer
            label="Annexure pdf"
            fieldGrid={3}
            type="file"
            onChange={(e) => setAnnexurePdf(e.target.files[0])}
            required={false}
          />
        )} */}
            <div className="col-md-3">
              <FieldContainer
                label="Personal Contact"
                astric
                type="number"
                fieldGrid={3}
                value={personalContact}
                required={false}
                onChange={handlePersonalContactChange}
                // onBlur={handlePersonalContactBlur}
              />
              {(isContactTouched1 || personalContact?.length >= 10) &&
                !isValidcontact1 && (
                  <p className="form-error">*Please enter a valid Number</p>
                )}
              {isRequired.personalContact && (
                <p className="form-error">Please Enter Personal Contact</p>
              )}
            </div>

            <div className="form-group col-3">
              <FieldContainer
                label="Alternate Contact "
                type="number"
                astric
                fieldGrid={3}
                value={contact}
                required={false}
                onChange={handleContactChange}
                // onBlur={handleContactBlur}
              />
              {(isContactTouched || contact?.length >= 10) &&
                !isValidcontact && (
                  <p className="form-error">*Please enter a valid Number</p>
                )}
              {isRequired.contact && (
                <p className="form-error">Please Enter Alternate Contact</p>
              )}
            </div>

            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <div className="form-group">
                {/* <p
                  className={
                    loginResponse === "login id available"
                      ? "login-success1"
                      : "login-error1"
                  }
                >
                  {loginResponse}
                </p> */}

                <label>
                  Login ID <sup className="form-error">*</sup>
                </label>
                <div className="input-group">
                  <input
                    className="form-control"
                    // className={`form-control ${
                    //   loginId
                    //     ? loginResponse === "login id available"
                    //       ? "login-success-border"
                    //       : "login-error-border"
                    //     : ""
                    // }`}
                    value={loginId}
                    disabled
                    required
                    onChange={handleLoginIdChange}
                    onBlur={() => {
                      if (loginId === "") {
                        return setIsRequired((prev) => ({
                          ...prev,
                          loginId: true,
                        }));
                      } else {
                        setIsRequired((prev) => ({
                          ...prev,
                          loginId: false,
                        }));
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
                {isRequired.loginId && (
                  <p className="form-error">Please select a LoginId</p>
                )}
              </div>
            </div>

            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <div className="form-group">
                <label>
                  Generate Password <sup className="form-error">*</sup>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={password}
                    required
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
              {isRequired.password && (
                <p className="form-error">Please select a Password</p>
              )}
            </div>

            {/* <div className="form-group col-3">
          <label className="form-label">
            Role <sup  className="form-error">*</sup>
          </label>
          <Select
            options={roledata.map((option) => ({
              value: option.role_id,
              label: option.Role_name,
            }))}
            value={{
              value: roles,
              label:
                roledata.find((role) => role.role_id === roles)?.Role_name ||
                "",
            }}
            onChange={(e) => {
              setRoles(e.value);
            }}
          ></Select>
        </div> */}

            {/* <FieldContainer
              type="date"
              label="Joining Date "
              astric
              fieldGrid={3}
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            /> */}
            <div className="col-md-3">
              <label className="form-label">
                Joining Date <sup style={{ color: "red" }}>*</sup>
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={joiningDate}
                  onChange={(e) => {
                    setJoiningDate(e);
                    const selectJoiningDate = e;
                    if (selectJoiningDate === "") {
                      setIsRequired((prev) => ({
                        ...prev,
                        joiningDate: true,
                      }));
                    } else {
                      setIsRequired((prev) => ({
                        ...prev,
                        joiningDate: false,
                      }));
                    }
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              {isRequired.joiningDate && (
                <p className="form-error">Please Enter Joining Date</p>
              )}
            </div>
            <div className="col-md-3">
              <label className="form-label">
                DOB <sup style={{ color: "red" }}>*</sup>
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dateOfBirth}
                  onChange={handleDateChange}
                  shouldDisableDate={disableFutureDates}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              {isRequired.dateOfBirth && (
                <p className="form-error">Please Enter DOB</p>
              )}
            </div>

            {/* <FieldContainer
              label="DOB "
              astric
              fieldGrid={3}
              type="date"
              value={dateOfBirth}
              onChange={handleDateChange}
            /> */}

            <div className="form-group col-3">
              <label className="form-label">
                Gender <sup className="form-error">*</sup>
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
                  const selectGender = e.value;
                  if (selectGender === "") {
                    setIsRequired((prev) => ({
                      ...prev,
                      gender: true,
                    }));
                  } else {
                    setIsRequired((prev) => ({
                      ...prev,
                      gender: false,
                    }));
                  }
                }}
                required
              />
              {isRequired.gender && (
                <p className="form-error">Please Enter Gender</p>
              )}
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button
            type="button"
            className="btn cmnbtn btn-primary"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Submitting" : "Submit"}
            {loading ? (
              <i className="bi bi-arrow-clockwise"></i>
            ) : (
              <i className="bi bi-arrow-right"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WFHDRegister;
