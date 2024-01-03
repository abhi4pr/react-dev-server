import React from "react";

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
          <div className="row">
            {educationDispalyFields.map((key) => {
              return key === "from_year" || key === "to_year" ? (
                <FieldContainer
                  key={key}
                  fieldGrid={3}
                  type="date"
                  name={key}
                  label={educationFieldLabels[key]}
                  value={detail[key].split("T")[0]}
                  onChange={(e) => handleEducationDetailsChange(index, e)}
                />
              ) : (
                <FieldContainer
                  key={key}
                  fieldGrid={3}
                  name={key}
                  label={educationFieldLabels[key]}
                  value={detail[key] || ""}
                  onChange={(e) => handleEducationDetailsChange(index, e)}
                />
              );
            })}
            {educationDetails?.length > 1 && (
              <IconButton onClick={() => handleRemoveEducationDetails(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}
      <div className="row">
        <div className="col-12">
          <button
            onClick={handleAddEducationDetails}
            className="btn btn-outline-warning"
            type="button"
          >
            Add More Education Details
          </button>
        </div>
      </div>
    </>
  );
};

export default EducationFields;
