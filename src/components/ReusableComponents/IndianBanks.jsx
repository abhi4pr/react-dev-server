import React from "react";
import Select from "react-select";

const banks = [];

const IndianBanks = ({ onChange }) => {
  return (
    <div className="form-group col-3">
      <label className="form-label">Banks</label>
      <Select
        options={banks.map((bank) => ({ value: bank, label: bank }))}
        onChange={onChange}
        isClearable
        isSearchable
        required
      />
    </div>
  );
};

export default IndianBanks;
