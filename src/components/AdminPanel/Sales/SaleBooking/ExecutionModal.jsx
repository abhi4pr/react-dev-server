import React, { useState } from "react";
import { useGlobalContext } from "../../../../Context/Context";
import { useGetAllBrandQuery } from "../../../Store/API/Sales/BrandApi";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
const DEBOUNCE_DELAY = 300;

const ExecutionModal = ({ loginUserId, closeModal }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateTimeout, setStartDateTimeout] = useState(null); // Define startDateTimeout
  const [endDateTimeout, setEndDateTimeout] = useState(null);
  const [brandName, setBrandName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState();
  const [campaignName, setCampaignName] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  //   const [addAccountType, { isLoading, isSuccess, isError }] =
  //     useAddAccountTypeMutation();

  const { data: brandArray } = useGetAllBrandQuery();
  const handleStartDateChange = (e) => {
    // Debounce the event handler
    clearTimeout(startDateTimeout);
    const newStartDate = e.target.value;
    setStartDateTimeout(
      setTimeout(() => setStartDate(newStartDate), DEBOUNCE_DELAY)
    );
  };

  const handleEndDateChange = (e) => {
    // Debounce the event handler
    clearTimeout(endDateTimeout);
    const newEndDate = e.target.value;
    setEndDateTimeout(setTimeout(() => setEndDate(newEndDate), DEBOUNCE_DELAY));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (campaignName.length < 5) {
      toastError("Campaign Name must be at least 5 characters long.");
      return;
    }
    try {
      // Your form submission logic here
      // Example: await addAccountType({ ... });
      // Reset form fields after submission
      setStartDate("");
      setEndDate("");
      setBrandName("");
      setCampaignName("");
      setExcelFile(null);
      setRemarks("");
      closeModal();
      toastAlert("Campaign created successfully");
    } catch (err) {
      console.error("Failed to create campaign:", err);
      toastError("Failed to create campaign");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="start_date">Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={handleStartDateChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="end_date">End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={handleEndDateChange}
            className="form-control"
            required
          />
        </div>
        <CustomSelect
          fieldGrid={12}
          label="Brand"
          dataArray={brandArray}
          optionId="instaBrandId"
          optionLabel="instaBrandName"
          selectedId={selectedBrand}
          setSelectedId={setSelectedBrand}
          required
        />

        <div className="form-group">
          <label htmlFor="campaign_name">Campaign Name:</label>
          <input
            type="text"
            id="campaign_name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="form-control"
            required
          />
          {campaignName.length < 5 && (
            <small className="text-danger">
              Campaign Name must be at least 5 characters long.
            </small>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="excel_file">Upload Excel File:</label>
          <input
            type="file"
            id="excel_file"
            onChange={(e) => setExcelFile(e.target.files[0])}
            className="form-control-file"
          />
        </div>
        <div className="form-group">
          <label htmlFor="remarks">Remarks:</label>
          <textarea
            id="remarks"
            value={remarks}
            placeholder="remarks"
            onChange={(e) => setRemarks(e.target.value)}
            className="form-control"
            rows="4"
            cols="50"
          ></textarea>
        </div>
        {/* <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button> */}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ExecutionModal;
