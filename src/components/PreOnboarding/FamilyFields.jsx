import React from "react";
import { IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const FamilyFields = ({
  familyDetails,
  familyDisplayFields,
  familyFieldLabels,
  handleFamilyDetailsChange,
  handleAddFamilyDetails,
  handleRemoveFamilyDetails,
}) => {
  return (
    <>
      {familyDetails?.map((detail, index) => (
        <div key={index} mb={2}>
          <div className="row">
            {Object.keys(detail).map((key) => {
              if (familyDisplayFields.includes(key)) {
                return key === "DOB" ? (
                  <FieldContainer
                    key={key}
                    fieldGrid={3}
                    type="date"
                    name={key}
                    label="Date of Birth"
                    value={
                      key === "DOB" && detail[key]
                        ? detail[key].split("T")[0]
                        : detail[key]
                    }
                    onChange={(e) => handleFamilyDetailsChange(index, e)}
                  />
                ) : (
                  <FieldContainer
                    key={key}
                    fieldGrid={3}
                    name={key}
                    label={familyFieldLabels[key]}
                    value={detail[key]}
                    onChange={(e) => handleFamilyDetailsChange(index, e)}
                  />
                );
              }
              return null;
            })}
            {familyDetails?.length > 1 && (
              <IconButton onClick={() => handleRemoveFamilyDetails(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}

      <div className="row">
        <div className="col-12">
          <button
            onClick={handleAddFamilyDetails}
            variant="contained"
            className="btn btn-outline-primary me-2"
          >
            Add More Family Details
          </button>
        </div>
      </div>
    </>
  );
};

export default FamilyFields;
