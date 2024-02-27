import { IconButton, TextField } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const EducationFields = ({
  educationDetails,
  educationDispalyFields,
  educationFieldLabels,
  handleEducationDetailsChange,
  handleAddEducationDetails,
  handleRemoveEducationDetails,
}) => {
  return (
    <>
      {educationDetails?.map((detail, index) => (
        <div key={index} mb={2}>
          {/* <div className="row"> */}
          {educationDispalyFields.map((key) => {
            switch (key) {
              case "institute_name":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );

              case "from_year":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="date"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key]?.split("T")[0]}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );
              case "to_year":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="date"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key]?.split("T")[0]}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );

              case "percentage":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="number"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );

              case "stream":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );
              case "specialization":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );
              case "title":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );
            }
          })}
          {educationDetails?.length > 1 && (
            <IconButton onClick={() => handleRemoveEducationDetails(index)}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
        // </div>
      ))}
      <div className="row">
        <div className="col-12">
          <button
            type="button"
            onClick={handleAddEducationDetails}
            className="btn btn-outline-warning"
          >
            Add More Education Details
          </button>
        </div>
      </div>
    </>
  );
};

export default EducationFields;
