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
            return key === "from_year" || key === "to_year" ? (
              <div className="form-group">
                <TextField
                  key={key}
                  fieldGrid={3}
                  type="date"
                  name={key}
                  label={educationFieldLabels[key]}
                  value={detail[key].split("T")[0]}
                  onChange={(e) => handleEducationDetailsChange(index, e)}
                />
              </div>
            ) : (
              <div className="form-group">
                <TextField
                  key={key}
                  fieldGrid={3}
                  name={key}
                  label={educationFieldLabels[key]}
                  value={detail[key] || ""}
                  onChange={(e) => handleEducationDetailsChange(index, e)}
                />
              </div>
            );
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
