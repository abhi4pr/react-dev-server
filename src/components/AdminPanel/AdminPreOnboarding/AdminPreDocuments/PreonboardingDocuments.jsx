import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { useGlobalContext } from "../../../../Context/Context";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";

const selectOptions = [
  {
    value: "Low",
    label: "Low",
  },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "High",
    label: "High",
  },
];

const mandatoryOption = [
  {
    value: true,
    label: "Yes",
  },
  {
    value: false,
    label: "No",
  },
];

const PreonboardingDocuments = () => {
  const { toastAlert } = useGlobalContext();
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState("");
  const [period, setPeriod] = useState(null);
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [mandatory, setMandatory] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [jobTypeData, setJobTypeData] = useState([]);
  const [jobType, setJobType] = useState([]);

  useEffect(() => {
    async function getJobtTypes() {
      const jobTypeResponse = await axios.get(baseUrl + "get_all_job_types");
      setJobTypeData(jobTypeResponse.data.data);
    }
    getJobtTypes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + "add_doc", {
        doc_type: documentType,
        priority: priority,
        period: Number(period),
        description: description,
        isRequired: mandatory,
        doc_number: documentNumber,
        job_type: jobType,
      })
      .then(() => {
        setDocumentType("");
        setPeriod(null);
        setDescription("");
        setPriority(null);
        toastAlert("Document Created");
        navigate("/admin/preonboarding-documents-overview");
      });
  };
  return (
    <>
      <FormContainer
        mainTitle="Document"
        title="Document Master"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Document Type"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
        />
        <FieldContainer
          label="Period (days)"
          type="number"
          fieldGrid={3}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />

        <div className="form-group col-3">
          <label className="form-label">Priority</label>
          <Select
            value={selectOptions.find((option) => option.value === priority)}
            label={priority}
            options={selectOptions}
            onChange={(e) => setPriority(e.value)}
          />
        </div>

        <div className="form-group col-3">
          <label className="form-label">Mandatory</label>
          <Select
            value={mandatoryOption.find((option) => option.value === mandatory)}
            label={mandatory}
            options={mandatoryOption}
            onChange={(e) => setMandatory(e.value)}
          />
        </div>
        <FieldContainer
          fieldGrid={3}
          label="Document Number"
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
        />

        <FieldContainer
          Tag="textarea"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="form-group col-6">
          <label className="form-label">
            Job Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            isMulti
            options={jobTypeData?.map((option) => ({
              value: `${option.job_type}`,
              label: `${option.job_type}`,
            }))}
            value={jobType?.map((type) => ({
              value: type,
              label: type,
            }))}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions.map(
                (option) => option.value
              );
              setJobType(selectedValues);
            }}
            required
          />
        </div>
      </FormContainer>
    </>
  );
};

export default PreonboardingDocuments;
