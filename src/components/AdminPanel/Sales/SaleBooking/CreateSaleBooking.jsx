import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import Select from "react-select";

const todayDate = new Date().toISOString().split("T")[0];
const paymentStatusList = [
  {
    value: "sent_for_credit_approval",
    label: "Use Credit Limit",
  },
  {
    value: "sent_for_payment_approval",
    label: "Sent For Payment Approval",
  },
];

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
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [creditApprovalList, setCreditApprovalList] = useState([]);
  const [selectedCreditApp, setSelectedCreditApp] = useState("");
  const [reasonCreditApp, setReasonCreditApproval] = useState("");
  const [balancePayDate, setBalancePayDate] = useState("");
  const [executiveSelfCredit, setExecutiveSelfCredit] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [incentiveCheck, setIncentiveCheck] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerListRes = await axios.get(
          `${baseUrl}get_all_customer_mast`
        );
        const creditAppList = await axios.get(
          `${baseUrl}sales/getlist_reason_credit_approval`
        );
        setCreditApprovalList(creditAppList.data.data);
        setCustomerData(customerListRes.data.customerMastList);
      } catch (error) {
        toastError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (executiveSelfCredit) {
      setSelectedPaymentStatus(paymentStatusList[0]);
    } else {
      setSelectedPaymentStatus("");
    }
  }, [executiveSelfCredit]);

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
      const net = campaignAmount * 1.18;
      const netRound = net.toFixed(2);
      setNetAmount(netRound);
    } else {
      setNetAmount(campaignAmount);
    }
  }, [campaignAmount, addGst]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("customer_id", selectedCustomer);
      formData.append("sale_booking_date", bookingDate);
      formData.append("campaign_amount", campaignAmount);
      formData.append("gst_amount", gstAmount);
      formData.append("gst_status", gstAmount !== 0);
      formData.append("net_amount", netAmount);
      formData.append("description", description);
      formData.append("payment_credit_status", selectedPaymentStatus?.value);

      formData.append("balance_payment_date", balancePayDate);
      formData.append("executive_self_credit", executiveSelfCredit);
      if (excelFile) {
        formData.append("excel_file", excelFile);
      }
      formData.append(
        "incentive_status",
        incentiveCheck ? "no-incentive" : "incentive"
      );

      formData.append("managed_by", selectedCustomer);

      const response = await axios.post(
        `${baseUrl}sales/add_sales_booking`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSelectedCustomer("");
      setBookingDate(new Date().toISOString().split("T")[0]);
      setCampaignAmount(0);
      setGstAmount(0);
      setAddGst(false);
      setNetAmount(0);
      setDescription("");
      setSelectedPaymentStatus("");
      setSelectedCreditApp("");
      setReasonCreditApproval("");
      setBalancePayDate("");
      setExecutiveSelfCredit(false);
      setExcelFile(null);
      setIncentiveCheck(false);

      toastAlert(response.data.message);
    } catch (error) {
      toastError(error);
    }
  };

  const handlePaymentStatusSelect = (selectedOption) => {
    setSelectedPaymentStatus(selectedOption);
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
          placeholder="Enter amount here"
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
          placeholder="Description"
          fieldGrid={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="form-group col-3">
          <label className="form-label">
            Payment Status <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={paymentStatusList}
            value={selectedPaymentStatus}
            onChange={handlePaymentStatusSelect}
            required
          />
        </div>

        {selectedPaymentStatus?.value === "sent_for_credit_approval" && (
          <>
            <div className="form-group col-3">
              <label className="form-label">
                Reason Credit Approval<sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={[
                  ...creditApprovalList.map((option) => ({
                    value: option.day_count,
                    label: option.reason,
                  })),
                  { value: "own_reason", label: "Type your own" },
                ]}
                value={{
                  value: selectedCreditApp,
                  label:
                    selectedCreditApp === "own_reason"
                      ? "Type your own"
                      : creditApprovalList.find(
                          (item) => item.day_count == selectedCreditApp
                        )?.reason || "",
                }}
                onChange={(e) => setSelectedCreditApp(e.value)}
                required
              />
            </div>
            {selectedCreditApp === "own_reason" && (
              <FieldContainer
                label="Reason Credit Approval"
                fieldGrid={4}
                value={reasonCreditApp}
                onChange={(e) => setReasonCreditApproval(e.target.value)}
              />
            )}
          </>
        )}

        <FieldContainer
          label="Balance Payment Date"
          type="date"
          fieldGrid={4}
          value={balancePayDate}
          onChange={(e) => setBalancePayDate(e.target.value)}
        />
        {
          <div className="form-group">
            <input
              type="checkbox"
              value={executiveSelfCredit}
              onChange={(e) => setExecutiveSelfCredit(e.target.checked)}
            />
            <label>
              Sales Executive Credit Limit - 30000 Total Used Sales Executive
              Credit Limit - 10000 Total Available Credit Limit - 20000
            </label>
          </div>
        }

        <FieldContainer
          type="file"
          name="Image"
          accept=".xls, .xlsx"
          onChange={(e) => setExcelFile(e.target.files[0])}
          required={false}
        />
        <div className="form-group">
          <input
            type="checkbox"
            value={incentiveCheck}
            onChange={(e) => setIncentiveCheck(e.target.checked)}
          />
          <label>Invoice</label>
        </div>
      </FormContainer>
    </div>
  );
};

export default CreateSaleBooking;
