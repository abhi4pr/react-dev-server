import React from "react";
import { IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const GuardianFields = ({
  guardianDetails,
  guardianDisplayFields,
  guardianFieldLabels,
  handleGuardianDetailsChange,
  handleAddGuardianDetails,
  handleRemoveGuardianDetails,
}) => {
  return (
    <>
      {guardianDetails &&
        guardianDetails.map((detail, index) => (
          <div key={index}>
            {guardianDisplayFields.map((field) => (
              <div className="form-group" key={field}>
                <TextField
                  id={`outlined-${field}-${index}`}
                  variant="outlined"
                  type={field === "guardian_contact" ? "number" : "text"}
                  label={guardianFieldLabels[field]}
                  name={field}
                  key={index}
                  value={detail[field] || ""}
                  onChange={(e) => handleGuardianDetailsChange(index, e)}
                />
              </div>
            ))}
            {guardianDetails.length > 1 && (
              <IconButton onClick={() => handleRemoveGuardianDetails(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        ))}

      <button
        onClick={handleAddGuardianDetails}
        variant="contained"
        className="btn btn-outline-danger"
      >
        Add More Guardian Details
      </button>
    </>
  );
};

export default GuardianFields;
