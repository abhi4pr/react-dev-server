import React, { useState, useEffect } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { useGlobalContext } from "../../../../Context/Context";
import Select from "react-select";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {baseUrl} from '../../../../utils/config'

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
const PreonboardingDocumentsUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert } = useGlobalContext();
  const [documentType, setDocumentType] = useState("");
  const [period, setPeriod] = useState(null);
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}`+`get_doc/${id}`
      );
      const data = response.data.data;
      setDocumentType(data.doc_type);
      setPeriod(data.period);
      setPriority(data.priority);
      setDescription(data.description);
    } catch (error) {
      console.log("", error);
    }
  };
  console.log(id);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(baseUrl+"update_doc", {
        _id: id,
        doc_type: documentType,
        priority: priority,
        period: Number(period),
        description: description,
      })
      .then(() => {
        setDocumentType("");
        setPeriod(null);
        setDescription("");
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
            label={selectOptions.find((option) => option.value === priority)}
            options={selectOptions}
            onChange={(e) => setPriority(e.value)}
          />
        </div>
        <FieldContainer
          Tag="textarea"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default PreonboardingDocumentsUpdate;
