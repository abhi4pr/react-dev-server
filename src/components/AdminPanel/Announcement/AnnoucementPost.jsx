import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import Select from "react-select";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import TextEditor from "../../ReusableComponents/TextEditor";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";

const announcementForList = [
  { value: "yes", label: "All Employees" },
  { value: "no", label: "Only Selected Employees" },
];
const AnnoucementPost = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [announcementFor, setAnnouncementFor] = useState("");
  const [department, setDepartment] = useState([]);
  const [departmentdata, setDepartmentData] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [jobType, setJobType] = useState("");
  const [jobTypeData, setJobTypeData] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContect] = useState("");
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (announcementFor?.value === "no") {
      axios.get(baseUrl + "get_all_departments").then((res) => {
        setDepartmentData(res.data);
      });
      axios.get(baseUrl + "get_all_job_types").then((res) => {
        setJobTypeData(res.data.data);
      });
    }

    if (department.length > 0) {
      axios
        .get(
          baseUrl +
            `get_all_designations_by_deptId/${
              department[department.length - 1]
            }`
        )
        .then((res) => {
          const newDesignations = res.data.data;

          const updatedDesignationData = [
            ...new Set([...designationData, ...newDesignations]),
          ];
          setDesignationData(updatedDesignationData);
        });
    }
  }, [announcementFor, department]);

  const handleAttachmentSelect = (event) => {
    const files = event.target.files;

    setAttachments([...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("all_emp", announcementFor?.value);
    formData.append("dept_id", department);
    formData.append("desi_id", designation);
    formData.append("job_type", jobType);

    for (let i = 0; i < attachments.length; i++) {
      formData.append(`attachment`, attachments[i]);
    }

    formData.append("post_content", announcementContent);
    formData.append("post_subject", announcementTitle);
    formData.append("notify_by_user_email", false);
    formData.append("email_response", "lsfkj;aljf;lasfl");

    try {
      const response = await axios.post(
        // `${baseUrl}add_announcement`,
        `http://192.168.29.163:8080/api/add_announcement`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toastAlert(response.data.message);
    } catch (error) {
      toastError(response.data.message);
    }
  };

  return (
    <>
      <FormContainer
        title="Post"
        mainTitle="Announcement"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-3">
          <label className="form-label">
            Announcement for <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={announcementForList}
            value={announcementFor}
            onChange={(e) => {
              setAnnouncementFor(e);
            }}
            required
          />
        </div>

        {announcementFor?.value == "no" && (
          <>
            <div className="form-group col-3">
              <label className="form-label">
                Department Name <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={departmentdata.map((option) => ({
                  value: option.dept_id,
                  label: `${option.dept_name}`,
                }))}
                value={departmentdata
                  .filter((option) => department.includes(option.dept_id))
                  .map((option) => ({
                    value: option.dept_id,
                    label: option.dept_name,
                  }))}
                onChange={(e) => {
                  setDepartment(e.map((option) => option.value));
                }}
                isMulti
                required
              />
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
                value={designationData
                  .filter((option) => designation.includes(option.desi_id))
                  .map((option) => ({
                    value: option.desi_id,
                    label: option.desi_name,
                  }))}
                onChange={(e) => {
                  setDesignation(e.map((option) => option.value));
                }}
                isDisabled={!department.length}
                isMulti
                required
              />
            </div>

            <div className="form-group col-3">
              <label className="form-label">
                Job Type <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={jobTypeData.map((option) => ({
                  value: option.job_type,
                  label: `${option.job_type}`,
                }))}
                value={jobTypeData
                  .filter((option) => jobType.includes(option.job_type))
                  .map((option) => ({
                    value: option.job_type,
                    label: option.job_type,
                  }))}
                onChange={(e) => {
                  setJobType(e.map((option) => option.value));
                }}
                isMulti
                required
              />
            </div>
          </>
        )}

        <FieldContainer
          label="Title"
          type="text"
          placeholder="Enter title here"
          fieldGrid={12}
          required={true}
          value={announcementTitle}
          onChange={(e) => setAnnouncementTitle(e.target.value)}
        />

        <TextEditor
          value={announcementContent}
          onChange={setAnnouncementContect}
        />

        <div className="form-group col-3">
          <label className="form-label">
            Attachments <sup style={{ color: "red" }}>*</sup>
          </label>
          <input
            type="file"
            multiple
            onChange={handleAttachmentSelect}
            className="form-control"
          />
        </div>
      </FormContainer>
    </>
  );
};

export default AnnoucementPost;
