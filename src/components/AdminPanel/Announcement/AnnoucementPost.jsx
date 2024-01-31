import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import {baseUrl} from '../../../utils/config'

const AnnouncementPost = () => {
  const { toastAlert } = useGlobalContext;

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserID = decodedToken.id;

  const [announcementFor, setAnnoucementFor] = useState(0);
  const [error, setError] = useState("");

  const [departmentData, setDepartmentData] = useState([]);
  const [department, setDepartment] = useState("");

  const [designation, setDesignation] = useState("");
  const [designationData, setDesignationData] = useState([]);

  const [heading, setHeading] = useState("");

  const [subHeading, setSubHeading] = useState("");
  const [content, setContent] = useState("");

  const [isFormSubmitted, setIsFormSubmited] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    axios
      .post(baseUrl+"annomastpost", {
        dept_id: department,
        desi_id: designation,
        onboard_status: announcementFor,
        heading: heading,
        sub_heading: subHeading,
        content: content,
        created_by: loginUserID,
      })
      .then(() => {
        setDepartment("");
        setDesignation("");
        setAnnoucementFor(0);
        setHeading("");
        setSubHeading("");
        setContent("");
        toastAlert("Form Submitted Success");
        setIsFormSubmited(true);
      })
      .catch((error) => {
        setError("An Error has Occurred while submitting the form");
        console.log(error);
      });
  };
  useEffect(() => {
    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        setDepartmentData(res.data);
      });

    axios
      .get(baseUrl+"get_all_designations")
      .then((res) => {
        setDesignationData(res.data.data);
      });
  }, []);
  if (isFormSubmitted) {
    return <Navigate to="/admin/sitting-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Annoucement"
        title="Annoucement here"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Annoucement For"
          Tag="select"
          value={announcementFor}
          onChange={(e) => setAnnoucementFor(e.target.value)}
        >
          <option value={0}>All</option>
          <option value={1}>Onboarded</option>
          <option value={2}>Pre Onboard</option>
        </FieldContainer>

        <FieldContainer
          label="Department"
          Tag="select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Choose</option>
          {departmentData.map((option) => (
            <option key={option.dept_id} value={option.dept_id}>
              {option.dept_name}
            </option>
          ))}
        </FieldContainer>

        <FieldContainer
          label="Designation"
          Tag="select"
          value={designation}
          required={false}
          onChange={(e) => setDesignation(e.target.value)}
        >
          <option selected disabled value="">
            Choose...
          </option>
          {designationData.map((option) => (
            <option key={option.desi_id} value={option.desi_id}>
              {option.desi_name}
            </option>
          ))}
        </FieldContainer>

        <FieldContainer
          label="Heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
        />

        <FieldContainer
          label="Subheading"
          value={subHeading}
          onChange={(e) => setSubHeading(e.target.value)}
        />

        <FieldContainer
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default AnnouncementPost;
