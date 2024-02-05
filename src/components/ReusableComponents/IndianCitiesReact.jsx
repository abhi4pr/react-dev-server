import React, { useState, useEffect } from "react";
import Select from "react-select";
import { City } from "country-state-city";

const IndianCitiesReact = ({ selectedCity, onChange }) => {
  const [cities, setCities] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchedCities = City.getCitiesOfCountry("IN").map((city) => ({
      value: city.name,
      label: city.name,
    }));
    setCities(fetchedCities);
    if (selectedCity) {
      const cityOption = fetchedCities.find(
        (option) => option.label === selectedCity
      );
      setSelectedOption(cityOption);
    }
  }, [selectedCity]);

  const handleChange = (newValue) => {
    setSelectedOption(newValue);
    onChange(newValue ? newValue.value : "");
  };

  return (
    <div className="form-group col-6">
      <label className="form-label">
        City <sup style={{ color: "red" }}>*</sup>
      </label>
      <Select
        options={cities}
        value={selectedOption}
        onChange={handleChange}
        placeholder="City"
        isClearable
      />
    </div>
  );
};

export default IndianCitiesReact;
