import React from "react";
import Select from "react-select";

const DynamicSelect = ({ data, value, onChange, cols, lable, astric }) => {
  return (
    <div className={`form-group col-${cols}`}>
      <label className="form-label">
        {lable} {astric === true && <sup style={{ color: "red" }}>*</sup>}
      </label>
      <Select
        className=""
        options={data.map((option) => ({
          value: `${option}`,
          label: `${option}`,
        }))}
        value={{
          value: value,
          label: `${value}`,
        }}
        onChange={onChange}
        required={true}
      />
    </div>
  );
};

export default DynamicSelect;
