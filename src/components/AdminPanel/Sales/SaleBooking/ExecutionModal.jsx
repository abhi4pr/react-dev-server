import React, { useState } from "react";
import { useGlobalContext } from "../../../../Context/Context";
import { useGetAllBrandQuery } from "../../../Store/API/Sales/BrandApi";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
const DEBOUNCE_DELAY = 300;

const ExecutionModal = ({ loginUserId, closeModal, saleBookingData }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateTimeout, setStartDateTimeout] = useState(null); // Define startDateTimeout
  const [endDateTimeout, setEndDateTimeout] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [remarks, setRemarks] = useState("");

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

  console.log(saleBookingData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (campaignName.length < 5) {
      toastError("Campaign Name must be at least 5 characters long.");
      return;
    }
    try {
      await axios.post(`${baseUrl}sales/sales_booking_execution`, {
        sale_booking_id: saleBookingData?.sale_booking_id,
        record_service_id: saleBookingData?.record_service_id,
        start_date: startDate,
        end_date: endDate,
        execution_excel: execution_excel,
        execution_done_by: execution_done_by,
        execution_remark: execution_remark,
        commitment: commitment,
        execution_sent_date: execution_sent_date,
        created_by: loginUserId,
      });
      toastAlert("Sent to Execution");
      closeModal();
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
        bRand Name:{" "}
        {
          brandArray?.find((item) => item._id == saleBookingData?.brand_id)
            .instaBrandName
        }
        campaign Name: {saleBookingData?.campaign_name}
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
          />
        </div>
        {/* <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button> */}
        <button type="submit" className="btn cmnbtn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ExecutionModal;
