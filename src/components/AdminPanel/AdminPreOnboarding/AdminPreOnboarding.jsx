import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { AiOutlineReload } from "react-icons/ai";
import { useGlobalContext } from "../../../Context/Context";
import Select from "react-select";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
// import { City } from "country-state-city";
import { baseUrl } from "../../../utils/config";
import IndianCitiesReact from "../../ReusableComponents/IndianCitiesReact";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const onBoardStatus = 2;

const AdminPreOnboarding = () => {
  const offerLetter = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const [loading, setLoading] = useState(false);

  const jobTypeData = ["WFO", "WFH"];
  const tdsApplicableData = ["Yes", "No"];
  const genderData = ["Male", "Female", "Other"];

  const whatsappApi = WhatsappAPI();
  const { toastAlert, toastError } = useGlobalContext();

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [username, setUserName] = useState("");
  const [jobType, setJobType] = useState("WFO");
  const [roles, setRoles] = useState("");
  const [reportL1, setReportL1] = useState("");
  const [reportL2, setReportL2] = useState("");
  const [reportL3, setReportL3] = useState("");
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  // const [city, setCity] = useState("");

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
  const [loginResponse, setLoginResponse] = useState("");
  const [lastIndexUsed, setLastIndexUsed] = useState(-1);
  const [password, setPassword] = useState("");

  const [sitting, setSitting] = useState("");
  const [roomId, setRoomId] = useState("");

  const [department, setDepartment] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);

  const [usersData, getUsersData] = useState([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [sendLetter, setSendLetter] = useState({});
  const [uid, setUID] = useState("");
  const [panUpload, setPanUpload] = useState("");
  const [highestUpload, setHighestUpload] = useState("");
  const [otherUpload, setOtherUpload] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [releavingDate, setReleavingDate] = useState("");
  const [salary, setSalary] = useState("");
  const [designation, setDesignation] = useState("");
  const [designationData, setDesignationData] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [roledata, getRoleData] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [isRequired, setIsRequired] = useState({
    username: false,
    reportL1: false,
    sendLetter: false,
    role: false,
    gender: false,
    department: false,
    userCtc: false,
    loginId: false,
    personalEmail: false,
  });

  useEffect(() => {
    axios.get(baseUrl + "get_all_roles").then((res) => {
      getRoleData(res.data.data);
    });
    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });
    // axios.get(baseUrl + "get_all_designations").then((res) => {
    //   setDesignationData(res.data.data);
    // });

    axios.get(baseUrl + "get_all_users").then((res) => {
      getUsersData(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (department) {
      axios
        .get(baseUrl + `get_all_designations_by_deptId/${department}`)
        .then((res) => {
          setDesignationData(res.data.data);
          if (res.data.data.length > 0) {
            setDesignation(res.data.data[0]?.desi_id);
          }
        });
    }
  }, [department]);

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

    if (username == "") {
      setIsRequired((perv) => ({ ...perv, username: true }));
    }
    if (department == "") {
      setIsRequired((perv) => ({ ...perv, department: true }));
    }
    if (designation == "") {
      setIsRequired((perv) => ({ ...perv, designation: true }));
    }
    if (reportL1 == "") {
      setIsRequired((perv) => ({ ...perv, reportL1: true }));
    }
    if (userCtc == "") {
      setIsRequired((perv) => ({ ...perv, userCtc: true }));
    }
    if (roles == "") {
      setIsRequired((perv) => ({ ...perv, roles: true }));
    }
    if (joiningDate == "") {
      setIsRequired((perv) => ({ ...perv, joiningDate: true }));
    }
    if (dateOfBirth == "") {
      setIsRequired((perv) => ({ ...perv, dateOfBirth: true }));
    }
    if (gender == "") {
      setIsRequired((perv) => ({ ...perv, gender: true }));
    }
    if (loginId == "") {
      setIsRequired((perv) => ({ ...perv, loginId: true }));
    }
    if (personalEmail == "") {
      setIsRequired((perv) => ({ ...perv, personalEmail: true }));
    }

    if (!username) {
      return toastError("Fill the Mandatory fields");
    } else if (!jobType || jobType == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!department || department == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!designation || designation == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!reportL1 || reportL1 == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!personalEmail || personalEmail == "") {
      return toastError("Email is Required");
    } else if (!personalContact || personalContact == "") {
      return toastError("Contact Is Required and should be equal to 10");
    } else if (!loginId || loginId == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!password || password == "") {
      return toastError("Password is Required");
    } else if (!roles || roles == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!joiningDate || joiningDate == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!dateOfBirth || dateOfBirth == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!gender || gender == "") {
      return toastError("Fill the Mandatory fields");
    }

    const formData = new FormData();
    formData.append("created_by", loginUserId);
    formData.append("user_name", validateAndCorrectUserName(username));
    formData.append("role_id", roles);
    formData.append("image", selectedImage);
    formData.append("ctc", userCtc);
    formData.append("Age", Number(age));
    formData.append(
      "offer_letter_send",
      sendLetter.value ? Boolean(sendLetter.value) : false
    );
    formData.append("annexure_pdf", annexurePdf);
    formData.append("tds_applicable", tdsApplicable);
    formData.append("tds_per", tdsPercentage);
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("sitting_id", 183);
    formData.append("room_id", roomId);
    formData.append("dept_id", department);
    formData.append("Gender", gender);
    formData.append("job_type", jobType);
    formData.append("DOB", dateOfBirth);

    formData.append("user_contact_no", personalContact);
    formData.append("personal_number", personalContact);
    // formData.append("pe", personalContact);

    formData.append("user_email_id", personalEmail);
    formData.append("Personal_email", personalEmail);
    // formData.append("PersonalEmail", personalEmail);

    formData.append("report_L1", reportL1);
    formData.append("report_L2", reportL2);
    formData.append("report_L3", reportL3);
    formData.append("user_designation", designation);
    formData.append("UID", uid);
    formData.append("pan", panUpload);
    formData.append("highest_upload", highestUpload);
    formData.append("other_upload", otherUpload);
    formData.append("joining_date", joiningDate);
    formData.append("releaving_date", releavingDate);
    formData.append("salary", Number(salary));
    formData.append("onboard_status", onBoardStatus);

    // if (isValidcontact1 == true && validEmail == true) {
    try {
      const isLoginIdExists = usersData.some(
        (user) =>
          user.user_login_id.toLocaleLowerCase() === loginId.toLocaleLowerCase()
      );
      const contactNumberExists = usersData.some(
        (user) => user.user_contact_no == personalContact
      );

      const emailIdExists = usersData.some(
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
      } else {
        setLoading(true);
        await axios.post(baseUrl + "add_user", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        whatsappApi.callWhatsAPI(
          "Preonboarding Register",
          JSON.stringify(personalContact),
          username,
          [username, loginId, password, "http://jarvis.work/"]
        );
        axios
          .post(baseUrl + "add_send_user_mail", {
            email: personalEmail,
            subject: "User Registration",
            text: "A new user has been onboard.",
            attachment: selectedImage,
            login_id: loginId,
            name: username,
            password: password,
          })
          .then((res) => {
            // setLoading(true);
            console.log("Email sent successfully:", res.data);
          })
          .then((res) => {
            if (res.status == 200) {
              toastAlert("User Registered");
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
        setPersonalContact("");
        setSendLetter("");
        setAnnexurePdf("");
        setPersonalEmail("");
        setJobType("");
        setReportL1("");
        setReportL2("");
        setReportL3("");
        setDesignation("");
        toastAlert("User Registered");
        setIsFormSubmitted(true);
      }
    } catch (error) {
      console.log("Failed to submit form", error);
    } finally {
      setLoading(false);
    }
    // } else {
    //   if (contact.length !== 10) {
    //     if (isValidcontact == false)
    //       alert("Enter Phone Number in Proper Format");
    //   } else if (validEmail != true) {
    //     alert("Enter Valid Email");
    //   }
    // }
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

      if (newContact1 === "") {
        setValidContact(false);
      } else {
        setValidContact(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact1)
        );
      }
    }
  }

  function handleContactBlur() {
    setisContactTouched(true);
    if (contact.length < 10) {
      setValidContact(false);
    }
  }

  //personal Contact validation

  function handlePersonalContactChange(event) {
    if (event.target.value.length <= 10) {
      const newContact1 = event.target.value;
      setPersonalContact(newContact1);

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

  function handlePersonalContactBlur() {
    setisContactTouched1(true);
    if (personalContact.length < 10) {
      setValidContact1(false);
    }
  }

  if (isFormSubmitted) {
    return <Navigate to="/admin/pre-onboarding-overview" />;
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

  const handleLoginIdChange = (event) => {
    const selectedLoginId = event.target.value;
    setLoginId(selectedLoginId);
    if (selectedLoginId === "") {
      setIsRequired((prev) => ({ ...prev, loginId: true }));
    } else {
      setIsRequired((prev) => ({ ...prev, loginId: false }));
    }
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
      setIsRequired((prev) => ({ ...prev, dateOfBirth: true }));
    } else {
      setIsRequired((prev) => ({ ...prev, dateOfBirth: false }));
    }

    if (age < 15) {
      window.alert("Your age must be greater than 15 years.");
    } else {
      setDateOfBirth(selectedDate);
      setAge(age);
    }
  };

  const handleFullNameChange = (event) => {
    let userName = event.target.value;

    if (userName === "") {
      setIsRequired((prev) => ({ ...prev, username: true }));
    } else {
      setIsRequired((prev) => ({ ...prev, username: false }));
    }

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

    setUserName(correctedNameParts.join(" "));
  };

  return (
    <div>
      <FormContainer
        mainTitle="User"
        title="User Registration"
        handleSubmit={handleSubmit}
        submitButton={false}
        // loading={loading}
      >
        <div className="col-md-3">
          <FieldContainer
            label="Full Name"
            astric
            fieldGrid={3}
            value={username}
            onChange={handleFullNameChange}
          />
          <div className="">
            {isRequired.username && (
              <p className="form-error">Please enter Full Name</p>
            )}
          </div>
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
            isDisabled
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

              department !== "" &&
                setIsRequired((prev) => {
                  return { ...prev, department: true };
                });
              department &&
                setIsRequired((prev) => {
                  return { ...prev, department: false };
                });
            }}
          />
          <div className="">
            {isRequired.department && (
              <p className="form-error">Please enter Department</p>
            )}
          </div>
        </div>

        <div className="form-group col-3">
          <label className="form-label">
            Designation <sup className="form-error">*</sup>
          </label>
          <Select
            className=""
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

              designation !== "" &&
                setIsRequired((prev) => {
                  return { ...prev, designation: true };
                });
              designation &&
                setIsRequired((prev) => {
                  return { ...prev, designation: false };
                });
            }}
          />
          <div className="">
            {isRequired.designation && (
              <p className="form-error">Please enter Designation</p>
            )}
          </div>
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
              e.value &&
                setIsRequired((prev) => {
                  return { ...prev, reportL1: false };
                });

              reportL1 !== "" &&
                setIsRequired((prev) => {
                  return { ...prev, reportL1: true };
                });
              reportL1 &&
                setIsRequired((prev) => {
                  return { ...prev, reportL1: false };
                });
            }}
            // onBlur={(e) => {
            //   !reportL1 &&
            //     setIsRequired((prev) => {
            //       return { ...prev, reportL1: true };
            //     });
            //   reportL1 &&
            //     setIsRequired((prev) => {
            //       return { ...prev, reportL1: false };
            //     });
            // }}
          />
          {isRequired.reportL1 && (
            <p className="form-error">*Please select Report L1</p>
          )}
        </div>

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
            <p className="form-error">*Please select Personal Email</p>
          )}
        </div>
        <div className="col-md-3">
          <FieldContainer
            label="Personal Contact"
            astric
            type="number"
            fieldGrid={3}
            value={personalContact}
            required={false}
            onChange={handlePersonalContactChange}
            onBlur={handlePersonalContactBlur}
          />
          {(isContactTouched1 || personalContact.length >= 10) &&
            !isValidcontact1 && (
              <p className="form-error">*Please enter a valid Number</p>
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

        {jobType === "WFH" && (
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
        )}

        {/* {jobType == "WFO" && ( */}
        <div className="col-3">
          <FieldContainer
            label="Yearly CTC"
            astric
            type="number"
            fieldGrid={3}
            required={false}
            value={userCtc}
            onChange={(e) => {
              // setUserCtc(e.target.value);
              const value = e.target.value;
              // Limit input to 6 digits
              if (/^\d{0,6}$/.test(value)) {
                setUserCtc(value);
              }

              userCtc !== "" &&
                setIsRequired((prev) => {
                  return { ...prev, userCtc: true };
                });
              userCtc &&
                setIsRequired((prev) => {
                  return { ...prev, userCtc: false };
                });
            }}
          />
          {isRequired.userCtc && <p className="form-error">Please enter CTC</p>}
        </div>
        {/* )} */}

        {/* {jobType == "WFO" && (
          <div className="form-group col-3">
            <label className="form-label">
              Offer Letter Send <sup className="form-error">*</sup>
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
                setIsRequired((prev) => ({
                  ...prev,
                  sendLetter: !e.value, // Set to true if e.value is empty, false otherwise
                }));
              }}
              onBlur={() => {
                setIsRequired((prev) => ({
                  ...prev,
                  sendLetter: !sendLetter.value, // Set to true if sendLetter.value is empty, false otherwise
                }));
              }}
            />
            {isRequired.sendLetter && (
              <p className="form-error">*Please select a Letter</p>
            )}
          </div>
        )} */}

        {/* {sendLetter.label == "Yes" && (
          <div className="col-md-3">
            <FieldContainer
              label="Annexure pdf"
              fieldGrid={3}
              type="file"
              onChange={(e) => setAnnexurePdf(e.target.files[0])}
              required={false}
            />
          </div>
        )} */}

        {/* <FieldContainer
          label="Contact"
          type="number"
          fieldGrid={3}
          value={contact}
          required={true}
          onChange={handleContactChange}
          onBlur={handleContactBlur}
        />
        {(isContactTouched || contact.length >= 10) && !isValidcontact && (
          <p className="form-error">*Please enter a valid Number</p>
        )} */}
        {/* 
        <IndianCitiesReact
          selectedCity={city}
          onChange={setCity}
          fieldGrid={3}
        /> */}

        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <div className="form-group">
            <label>Login ID</label>
            <sup className="form-error">*</sup>
            <div className="input-group">
              <input
                className={`form-control ${
                  loginId
                    ? loginResponse === "login id available"
                      ? "login-success-border"
                      : "login-error-border"
                    : ""
                }`}
                value={loginId}
                disabled
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
            {isRequired.loginId && (
              <p className="form-error">*Please select a LoginId</p>
            )}
          </div>
        </div>

        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <div className="form-group">
            <label>Generate Password</label>
            <sup className="form-error">*</sup>
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
            Role <sup className="form-error">*</sup>
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
              // setIsRequired((prev) => ({
              //   ...prev,
              //   role: !e.value, // Set to true if e.value is empty (no selection), false otherwise
              // }));
              roles !== "" &&
                setIsRequired((prev) => {
                  return { ...prev, roles: true };
                });
              roles &&
                setIsRequired((prev) => {
                  return { ...prev, roles: false };
                });
            }}
          />
          {isRequired.roles && (
            <p className="form-error">*Please select a Role</p>
          )}
        </div>
        <div className="col-md-3">
          <label className="form-label">
            Joining Date <sup className="form-error">*</sup>
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={joiningDate}
              onChange={(e) => {
                setJoiningDate(e);
                if (e === "") {
                  setIsRequired((prev) => ({ ...prev, joiningDate: true }));
                } else {
                  setIsRequired((prev) => ({ ...prev, joiningDate: false }));
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          {isRequired.joiningDate && (
            <p className="form-error">*Please select a Joining Date</p>
          )}
        </div>
        {/* <FieldContainer
          type="date"
          astric
          label="Joining Date"
          required={false}
          fieldGrid={3}
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
        /> */}
        <div className="col-md-3">
          <label className="form-label">
            DOB <sup className="form-error">*</sup>
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dateOfBirth}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          {isRequired.dateOfBirth && (
            <p className="form-error">*Please select a DOB</p>
          )}
        </div>
        {/* <FieldContainer
          astric
          label="DOB"
          required={false}
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
              if (e === "") {
                setIsRequired((prev) => ({ ...prev, gender: true }));
              } else {
                setIsRequired((prev) => ({ ...prev, gender: false }));
              }
            }}
            required
          />
          {isRequired.gender && (
            <p className="form-error">*Please select a Gender</p>
          )}
        </div>
      </FormContainer>
      <div className="form-group">
        <button
          type="submit"
          className="btn cmnbtn  btn-primary"
          onClick={handleSubmit}
          disabled={loading}
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
  );
};

export default AdminPreOnboarding;
