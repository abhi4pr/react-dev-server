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
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState("");
  const [period, setPeriod] = useState(null);
  const [priority, setPriority] = useState("");
  const [mandatory, setMandatory] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [jobType, setJobType] = useState([]);
  const [jobTypeData, setJobTypeData] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function getJobtTypes() {
      const jobTypeResponse = await axios.get(baseUrl + "get_all_job_types");
      setJobTypeData(jobTypeResponse.data.data);
    }
    getJobtTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(baseUrl + "add_doc", {
        doc_type: documentType,
        priority: priority,
        period: Number(period),
        description: description,
        isRequired: mandatory,
        doc_number: documentNumber,
        job_type: jobType,
      });

      setDocumentType("");
      setPeriod(null);
      setDescription("");
      setPriority(null);
      toastAlert("Document Created");
      navigate("/admin/preonboarding-documents-overview");
    } catch (error) {
      if (error) return toastError("Document Type Already Exists");
    }
  };
  return (
    <div>
      <FormContainer mainTitle="Document" link={true}></FormContainer>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h4>Document Master</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <FieldContainer
              label="Document Type"
              astric
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            />
            <FieldContainer
              label="Period (days)"
              astric
              type="number"
              fieldGrid={3}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <div className="form-group col-3">
              <label className="form-label">Priority</label>
              <sup style={{ color: "red" }}>*</sup>
              <Select
                value={selectOptions.find(
                  (option) => option.value === priority
                )}
                label={priority}
                options={selectOptions}
                onChange={(e) => setPriority(e.value)}
                required
              />
            </div>
            <div className="form-group col-3">
              <label className="form-label">
                Mandatory <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                value={mandatoryOption.find(
                  (option) => option.value === mandatory
                )}
                label={mandatory}
                options={mandatoryOption}
                onChange={(e) => setMandatory(e.value)}
                required
              />
            </div>
            <FieldContainer
              fieldGrid={3}
              label="Document Number"
              astric
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
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
            <FieldContainer
              Tag="textarea"
              astric
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button className="btn btn-primary  cmnbtn">Submit</button>
    </div>
  );
};

export default PreonboardingDocuments;
