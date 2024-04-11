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

  const [isRequired, setIsRequired] = useState({
    reportL1: false,
  });

  const [lastUpdated, setLastUpdated] = useState("");

  const [attStatus, setAttStatus] = useState("");

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
          setJoiningDate(joining_date?.split("T")?.[0]);
          setDateOfBirth(DOB?.split("T")?.[0]);
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
    setSalary(monthlySalary);
    setLastUpdated("monthly");
  };

  // Handle change for Yearly Salary
  const handleYearlySalaryChange = (e) => {
    const yearlySalaryValue = e.target.value;
    setYearlySalary(yearlySalaryValue);
    setLastUpdated("yearly");
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
        });
    }
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobType) {
      return toastError("Job Type is Required");
    } else if (!designation || designation == "") {
      return toastError("Designatoin is Required");
    } else if (!gender || gender == "") {
      return toastError("Gender is Required");
    } else if (!reportL1 || reportL1 == "") {
      return toastError("Report manager Is Required");
    } else if (!personalContact || personalContact == "") {
      return toastError(
        "Personal Contact Is Required and should be equal to 10"
      );
    } else if (!personalEmail || personalEmail == "") {
      return toastError("Email is Required");
    } else if (!contact || contact == "") {
      return toastError(
        "Alternate Contact Is Required and should be equal to 10"
      );
    }

    const formData = new FormData();

    if (userUpdateID) {
      formData.append("user_id", userUpdateID);
    }
    formData.append("dept_id", department);
    formData.append("permanent_city", city);
    formData.append("created_by", loginUserId);
    formData.append("user_name", username);
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
      await axios
        .post(baseUrl + "add_user", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
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
    if (contact?.length < 10) {
      setValidContact(false);
    }
  }

  //personal Contact validation

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

  function handlePersonalContactBlur() {
    setisContactTouched1(true);
    if (personalContact.length < 10) {
      setValidContact1(false);
    }
  }

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
    }
  };

  return (
    <div className="master-card-css">
      <FormContainer
        mainTitle="WFHD Register"
        submitButton={false}
        link={"/admin/wfhd-overview"}
      />

      <div className="card body-padding">
        <div className="row">
          <FieldContainer
            label="Full Name *"
            fieldGrid={3}
            required
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />

          <div className="form-group col-3">
            <label className="form-label">
              Job Type <sup style={{ color: "red" }}>*</sup>
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
              required
              isDisabled={loginRole == 2}
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
                  designationData?.find((user) => user.desi_id === designation)
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
              }}
              onBlur={(e) => {
                !reportL1 &&
                  setIsRequired((prev) => {
                    return { ...prev, reportL1: true };
                  });
                reportL1 &&
                  setIsRequired((prev) => {
                    return { ...prev, reportL1: false };
                  });
              }}
            />
            {isRequired.reportL1 && (
              <p style={{ color: "red" }}>*Please select Report L1</p>
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
          <p style={{ color: "red" }}>*Please enter valid email</p>
        )} */}
          <FieldContainer
            label="Personal Email *"
            type="email"
            fieldGrid={3}
            required={false}
            value={personalEmail}
            onChange={handlePersonalEmailChange}
          />
          {!validPersonalEmail && (
            <p style={{ color: "red" }}>*Please enter valid email</p>
          )}
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
              City <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={cityData.map((city) => ({
                value: city.city_name,
                label: city.city_name,
              }))}
              onChange={(e) => setCity(e ? e.value : "")}
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
          </div>

          {/* {jobType === "WFH" && ( */}
          <>
            <FieldContainer
              // label="Salary"
              label="Monthly Salary *"
              type="number"
              fieldGrid={3}
              value={salary}
              // onChange={(e) => setSalary(e.target.value)}
              onChange={handleMonthlySalaryChange}
            />

            <FieldContainer
              // label="Salary"
              label="CTC *"
              type="number"
              fieldGrid={3}
              value={yearlySalary}
              // onChange={(e) => setYearlySalary(e.target.value)}
              onChange={handleYearlySalaryChange}
            />

            <div className="form-group col-3">
              <label className="form-label">
                TDS Applicable<sup style={{ color: "red" }}>*</sup>
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
              Letter send <sup style={{ color: "red" }}>*</sup>
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

          <FieldContainer
            label="Personal Contact *"
            type="number"
            fieldGrid={3}
            value={personalContact}
            required={false}
            onChange={handlePersonalContactChange}
            onBlur={handlePersonalContactBlur}
          />
          {(isContactTouched1 || personalContact?.length >= 10) &&
            !isValidcontact1 && (
              <p style={{ color: "red" }}>*Please enter a valid Number</p>
            )}

          <FieldContainer
            label="Alternate Contact *"
            type="number"
            fieldGrid={3}
            value={contact}
            required={false}
            onChange={handleContactChange}
            onBlur={handleContactBlur}
          />
          {/* {(isContactTouched || contact.length >= 10) && !isValidcontact && (
          <p style={{ color: "red" }}>*Please enter a valid Number</p>
        )} */}

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
                  required
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
          </div>

          {/* <div className="form-group col-3">
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
                roledata.find((role) => role.role_id === roles)?.Role_name ||
                "",
            }}
            onChange={(e) => {
              setRoles(e.value);
            }}
          ></Select>
        </div> */}

          <FieldContainer
            type="date"
            label="Joining Date *"
            fieldGrid={3}
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
          />

          <FieldContainer
            label="DOB *"
            fieldGrid={3}
            type="date"
            value={dateOfBirth}
            onChange={handleDateChange}
          />

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
              required
            />
          </div>
        </div>
        {/* <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12"> */}

        {/* </div> */}
      </div>
      <div className="form-group">
        <button
          type="button"
          className="btn btn-primary"
          style={{
            marginBottom: "12px",
            padding: "14px 28px 14px 28",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
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
  );
};

export default WFHDRegister;
