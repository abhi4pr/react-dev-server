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
import { City } from "country-state-city";
import {baseUrl} from '../../../utils/config'

const onBoardStatus = 2;

const AdminPreOnboarding = () => {
  const offerLetter = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const jobTypeData = ["WFO", "WFH"];
  const tdsApplicableData = ["Yes", "No"];
  const genderData = ["Male", "Female", "Other"];

  const whatsappApi = WhatsappAPI();
  const { toastAlert, toastError } = useGlobalContext();

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [username, setUserName] = useState("");
  const [jobType, setJobType] = useState("");
  const [roles, setRoles] = useState("");
  const [reportL1, setReportL1] = useState("");
  const [reportL2, setReportL2] = useState("");
  const [reportL3, setReportL3] = useState("");
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [city, setCity] = useState("");

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

  const [designation, setDesignation] = useState("");
  const [sendLetter, setSendLetter] = useState({});
  const [uid, setUID] = useState("");
  const [panUpload, setPanUpload] = useState("");
  const [highestUpload, setHighestUpload] = useState("");
  const [otherUpload, setOtherUpload] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [releavingDate, setReleavingDate] = useState("");
  const [salary, setSalary] = useState("");
  const [designationData, setDesignationData] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [roledata, getRoleData] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  const [isRequired, setIsRequired] = useState({
    reportL1: false,
  });

  useEffect(() => {
    axios.get(baseUrl+"get_all_roles").then((res) => {
      getRoleData(res.data.data);
    });
    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        getDepartmentData(res.data);
      });
    axios
      .get(baseUrl+"get_all_designations")
      .then((res) => {
        setDesignationData(res.data.data);
      });

    axios.get(baseUrl+"get_all_users").then((res) => {
      getUsersData(res.data.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobType) {
      return toastError("Job Type is Required");
    } else if (!department || department == "") {
      return toastError("Department is Required");
    } else if (!designation || designation == "") {
      return toastError("Designatoin is Required");
    } else if (!gender || gender == "") {
      return toastError("Gender is Required");
    } else if (!reportL1 || reportL1 == "") {
      return toastError("Report Error Is Required");
    }
    const formData = new FormData();
    formData.append("created_by", loginUserId);
    formData.append("user_name", username);
    formData.append("role_id", roles);
    formData.append("image", selectedImage);
    formData.append("user_email_id", email);
    formData.append("permanent_city", city);
    formData.append("ctc", userCtc);
    formData.append(
      "offer_letter_send",
      sendLetter.value ? Boolean(sendLetter.value) : false
    );
    formData.append("annexure_pdf", annexurePdf);
    formData.append("tds_applicable", tdsApplicable);
    formData.append("tds_per", tdsPercentage);
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("user_contact_no", contact);
    formData.append("sitting_id", 183);
    formData.append("room_id", roomId);
    formData.append("dept_id", department);
    formData.append("Gender", gender);
    formData.append("job_type", jobType);
    formData.append("DOB", dateOfBirth);
    formData.append("personal_number", personalContact);
    formData.append("Personal_email", personalEmail);
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

    if (isValidcontact1 == true && validEmail == true) {
      try {
        const isLoginIdExists = usersData.some(
          (user) =>
            user.user_login_id.toLocaleLowerCase() ===
            loginId.toLocaleLowerCase()
        );
        if (isLoginIdExists) {
          alert("this login ID already exists");
        } else {
          await axios.post(baseUrl+"add_user", formData, {
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
            .post(baseUrl+"add_send_user_mail", {
              email: personalEmail,
              subject: "User Registration",
              text: "A new user has been onboard.",
              attachment: selectedImage,
              login_id: loginId,
              name: username,
              password: password,
            })
            .then((res) => {
              console.log("Email sent successfully:", res.data);
            })
            .then((res) => {
              if (res.status == 200) {
                toastAlert("User Registerd");
                setIsFormSubmitted(true);
              } else {
                toastError("Sorry User is Not Created, Please try again later");
              }
            })
            .catch((error) => {
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
          setCity("");
          setSendLetter("");
          setAnnexurePdf("");
          setPersonalEmail("");
          setJobType("");
          setReportL1("");
          setReportL2("");
          setReportL3("");
          setDesignation("");
          toastAlert("User Registerd");
          setIsFormSubmitted(true);
        }
      } catch (error) {
        console.log("Failed to submit form", error);
      }
    } else {
      if (contact.length !== 10) {
        if (isValidcontact == false)
          alert("Enter Phone Number in Proper Format");
      } else if (validEmail != true) {
        alert("Enter Valid Email");
      }
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

  function handleContactBlur() {
    setisContactTouched(true);
    if (contact.length < 10) {
      setValidContact(false);
    }
  }

  //personal Contact validation

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

  function handlePersonalContactBlur() {
    setisContactTouched1(true);
    if (personalContact.length < 10) {
      setValidContact1(false);
    }
  }

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

  const handleDateChange = (e) => {
    setDateOfBirth(e.target.value);
  };

  return (
    <>
      <FormContainer
        mainTitle="User"
        title="User Registration"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Full Name"
          fieldGrid={3}
          required
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />

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
          />
        </div>

        <div className="form-group col-3">
          <label className="form-label">
            Designation <sup style={{ color: "red" }}>*</sup>
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
              console.log(reportL1);
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

        <FieldContainer
          label="Email"
          type="email"
          fieldGrid={3}
          required
          value={email}
          onChange={handleEmailChange}
        />
        {!validEmail && (
          <p style={{ color: "red" }}>*Please enter valid email</p>
        )}
        <FieldContainer
          label="Personal Email"
          type="email"
          fieldGrid={3}
          required={false}
          value={personalEmail}
          onChange={handlePersonalEmailChange}
        />
        {!validPersonalEmail && (
          <p style={{ color: "red" }}>*Please enter valid email</p>
        )}
        <FieldContainer
          label=" City"
          type="text"
          fieldGrid={3}
          required={false}
          value={city}
          onChange={(e) => setCity(e.target.value)}
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
            required
          />
        </div>
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
        )}

        {jobType == "WFO" && (
          <FieldContainer
            label=" CTC"
            type="number"
            fieldGrid={3}
            required={false}
            value={userCtc}
            onChange={(e) => setUserCtc(e.target.value)}
          />
        )}

        {jobType == "WFO" && (
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
        )}

        {sendLetter.label == "Yes" && (
          <FieldContainer
            label="Annexure pdf"
            fieldGrid={3}
            type="file"
            onChange={(e) => setAnnexurePdf(e.target.files[0])}
            required={false}
          />
        )}

        <FieldContainer
          label="Contact"
          type="number"
          fieldGrid={3}
          value={contact}
          required={true}
          onChange={handleContactChange}
          onBlur={handleContactBlur}
        />
        {(isContactTouched || contact.length >= 10) && !isValidcontact && (
          <p style={{ color: "red" }}>*Please enter a valid Number</p>
        )}

        <FieldContainer
          label="Personal Contact"
          type="number"
          fieldGrid={3}
          value={personalContact}
          required={false}
          onChange={handlePersonalContactChange}
          onBlur={handlePersonalContactBlur}
        />
        {(isContactTouched1 || personalContact.length >= 10) &&
          !isValidcontact1 && (
            <p style={{ color: "red" }}>*Please enter a valid Number</p>
          )}

        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <div className="form-group">
            <label>Login ID</label>
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
            <label>Generate Password</label>
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
                roledata.find((role) => role.role_id === roles)?.Role_name ||
                "",
            }}
            onChange={(e) => {
              console.log(e.value);
              setRoles(e.value);
            }}
          ></Select>
        </div>

        <FieldContainer
          type="date"
          label="Joining Date"
          fieldGrid={3}
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
        />

        <FieldContainer
          label="DOB"
          type="date"
          required
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
      </FormContainer>
    </>
  );
};

export default AdminPreOnboarding;
