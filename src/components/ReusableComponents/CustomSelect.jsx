import React from "react";
import Select from "react-select";

const CustomSelect = ({
  fieldGrid = 4,
  label,
  dataArray,
  optionId,
  optionLabel,
  selectedId,
  setSelectedId,
  required,
}) => {
  return (
    <div className={`form-group col-${fieldGrid}`}>
      <label className="form-label">
        {label} {required && <sup className="form-error">*</sup>}
      </label>
      <Select
        options={dataArray?.map((option) => ({
          value: option[optionId],
          label: option[optionLabel],
        }))}
        value={
          dataArray?.find((option) => option[optionId] === selectedId)
            ? {
                value: selectedId,
                label: dataArray?.find(
                  (option) => option[optionId] === selectedId
                )?.[optionLabel],
              }
            : null
        }
        onChange={(e) => setSelectedId(e.value)}
        required={required}
      />
    </div>
  );
};

export default CustomSelect;
