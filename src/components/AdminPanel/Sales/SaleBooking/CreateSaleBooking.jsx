import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import Select from "react-select";

const todayDate = new Date().toISOString().split("T")[0];
const CreateSaleBooking = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [customerData, setCustomerData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [campaignAmount, setCampaignAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [addGst, setAddGst] = useState(false);
  const [netAmount, setNetAmount] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get_all_customer_mast`);
        const res = response.data.customerMastList;
        setCustomerData(res);
      } catch (error) {
        toastError(error);
      }
    };
    fetchCustomers();
  }, []);

  const handleDateChange = (operation) => {
    const currentDate = new Date(bookingDate);
    const today = new Date();
    if (operation === "add" && currentDate < today) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      setBookingDate(nextDate.toISOString().split("T")[0]);
    } else if (operation === "subtract") {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      setBookingDate(prevDate.toISOString().split("T")[0]);
    }
  };

  const handleCheckboxChange = (e) => {
    setAddGst(e.target.checked);
    if (!e.target.checked) {
      setGstAmount(0);
    } else {
      const gst = campaignAmount * 0.18;
      const gstRound = gst.toFixed(2);
      setGstAmount(gstRound);
    }
  };

  useEffect(() => {
    if (addGst) {
      const gst = campaignAmount * 0.18;
      const gstRound = gst.toFixed(2);
      setGstAmount(gstRound);
      const net = campaignAmount * 0.82;
      const netRound = net.toFixed(2);
      setNetAmount(netRound);
    } else {
      setNetAmount(campaignAmount);
    }
  }, [campaignAmount, addGst]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}sales/add_reason_credit_approval`,
        {
          reason: reason,
          reason_type: "fixed",
        }
      );
      setReason("");
      setDayCount("");
      toastAlert(response.data.message);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div>
      <FormContainer
        mainTitle="Sale Booking"
        title="Creation"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-3">
          <label className="form-label">
            Customer Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={customerData.map((option) => ({
              value: option.customer_id,
              label: option.customer_name,
            }))}
            value={{
              value: selectedCustomer,
              label:
                customerData.find(
                  (item) => item.customer_id == selectedCustomer
                )?.customer_name || "",
            }}
            onChange={(e) => setSelectedCustomer(e.value)}
            required
          />
        </div>

        <FieldContainer
          label="Sale Booking Date"
          fieldGrid={4}
          astric={true}
          type="date"
          value={bookingDate}
          max={todayDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />
        <div>
          <button onClick={() => handleDateChange("subtract")}>-</button>
          <button
            onClick={() => handleDateChange("add")}
            disabled={bookingDate == todayDate}
          >
            +
          </button>
        </div>

        <FieldContainer
          label="Campaign Amount"
          fieldGrid={4}
          astric={true}
          type="number"
          value={campaignAmount}
          onChange={(e) => setCampaignAmount(e.target.value)}
        />

        <div className="form-group">
          <input
            type="checkbox"
            id="addGst"
            checked={addGst}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="addGst">+18% GST</label>
        </div>

        <FieldContainer
          label="GST Amount"
          fieldGrid={4}
          type="number"
          value={gstAmount}
          disabled={true}
        />
        <FieldContainer
          label="Net Amount"
          fieldGrid={4}
          type="number"
          value={netAmount}
          disabled={true}
        />
        <FieldContainer
          label="Description"
          fieldGrid={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>
    </div>
  );
};

export default CreateSaleBooking;
