import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import Select from "react-select";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import { useNavigate } from "react-router-dom";

const todayDate = new Date().toISOString().split("T")[0];

const CreateSaleBooking = () => {
  const navigate = useNavigate();
  const { loginUserData } = useAPIGlobalContext();

  const userCreditLimit = loginUserData?.user_credit_limit;
  const token = getDecodedToken();
  const loginUserId = token.id;
  const { toastAlert, toastError } = useGlobalContext();
  const [customerData, setCustomerData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerPart, setSelectedCustomerPart] = useState("");
  const [selectedCustomerData, setSelectedCustomerData] = useState([]);
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [baseAmount, setBaseAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [addGst, setAddGst] = useState(false);
  const [netAmount, setNetAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [creditApprovalList, setCreditApprovalList] = useState([]);
  const [selectedCreditApp, setSelectedCreditApp] = useState("");
  const [reasonCreditApproval, setReasonCreditApproval] = useState("");
  const [selectedReasonDays, setSelectedReasonDays] = useState(0);
  const [balancePayDate, setBalancePayDate] = useState(new Date());
  // const [executiveSelfCredit, setExecutiveSelfCredit] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [incentiveCheck, setIncentiveCheck] = useState(false);

  const paymentStatusList = [
    {
      value: "sent_for_credit_approval",
      label:
        userCreditLimit > netAmount
          ? `Use Credit Limit`
          : "Send For Credit Approval",
    },
    {
      value: "sent_for_payment_approval",
      label: "Sent For Payment Approval",
    },
  ];

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
    axios
      .get(`${baseUrl}get_customer_mast/${selectedCustomerPart}`)
      .then((res) => setSelectedCustomerData(res.data.data[0]));
  }, [selectedCustomerPart]);

  // useEffect(() => {
  //   if (executiveSelfCredit) {
  //     setSelectedPaymentStatus(paymentStatusList[0]);
  //   } else if (selectedPaymentStatus.label === "Sent For Payment Approval") {
  //     setSelectedPaymentStatus(paymentStatusList[1]);
  //   } else {
  //     setSelectedPaymentStatus("");
  //   }
  // }, [executiveSelfCredit]);

  // useEffect(() => {
  //   if (selectedPaymentStatus.label == "Use Credit Limit") {
  //     setExecutiveSelfCredit(true);
  //   } else {
  //     setExecutiveSelfCredit(false);
  //   }
  // }, [selectedPaymentStatus]);

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

  const handleGstChange = (e) => {
    setAddGst(e.target.checked);
    if (!e.target.checked) {
      setGstAmount(0);
    } else {
      const gst = baseAmount * 0.18;
      const gstRound = gst.toFixed(2);
      setGstAmount(gstRound);
    }
  };

  useEffect(() => {
    if (addGst) {
      const gst = baseAmount * 0.18;
      const gstRound = gst.toFixed(2);
      setGstAmount(gstRound);
      const net = baseAmount * 1.18;
      const netRound = net.toFixed(2);
      setNetAmount(netRound);
    } else {
      setNetAmount(baseAmount);
    }
  }, [baseAmount, addGst]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("customer_id", selectedCustomer);
      formData.append("sale_booking_date", bookingDate);
      formData.append("base_amount", baseAmount);
      formData.append("gst_amount", gstAmount);
      formData.append("gst_status", gstAmount !== 0);
      formData.append("net_amount", netAmount);
      formData.append("campaign_amount", netAmount);
      formData.append("description", description);

      formData.append("payment_credit_status", selectedPaymentStatus?.value);
      formData.append(
        "credit_approval_status",
        selectedPaymentStatus?.value === "sent_for_credit_approval"
          ? "manager_pending"
          : "self_credit_used"
      );
      formData.append(
        "booking_status",
        selectedPaymentStatus?.label === "Sent For Payment Approval"
          ? 0
          : selectedPaymentStatus?.value === "sent_for_credit_approval"
          ? 2
          : 3
      );

      reasonCreditApproval &&
        formData.append("reason_credit_approval", selectedCreditApp);
      formData.append(
        "reason_credit_approval_own_reason",
        reasonCreditApproval
      );

      formData.append("balance_payment_date", balancePayDate);
      formData.append(
        "executive_self_credit",
        selectedPaymentStatus.label == "Use Credit Limit"
      );
      if (excelFile) {
        formData.append("excel_file", excelFile);
      }
      formData.append(
        "incentive_status",
        incentiveCheck ? "no-incentive" : "incentive"
      );

      formData.append("managed_by", loginUserId);
      formData.append("created_by", loginUserId);
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
      setBaseAmount(0);
      setGstAmount(0);
      setAddGst(false);
      setNetAmount(0);
      setDescription("");
      setSelectedPaymentStatus("");
      setSelectedCreditApp("");
      setReasonCreditApproval("");
      setBalancePayDate("");
      // setExecutiveSelfCredit(false);
      setExcelFile(null);
      setIncentiveCheck(false);

      toastAlert(response.data.message);
      navigate("/admin/view-sales-booking");
    } catch (error) {
      toastError(error);
    }
  };

  const handlePaymentStatusSelect = (selectedOption) => {
    setSelectedPaymentStatus(selectedOption);
  };

  const handleCustomer = (e) => {
    setSelectedCustomer(e.value), setSelectedCustomerPart(e.id);
  };

  const handleReasonCreditApp = (selectedOption) => {
    setSelectedCreditApp(selectedOption.value);
    setSelectedReasonDays(selectedOption.days);
  };

  useEffect(() => {
    if (selectedReasonDays > 0) {
      const currentDate = new Date();
      const newDate = new Date(
        currentDate.setDate(currentDate.getDate() + selectedReasonDays)
      );
      setBalancePayDate(newDate.toISOString().split("T")[0]);
    }
  }, [selectedReasonDays]);

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
              id: option._id,
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
            onChange={(e) => {
              handleCustomer(e);
            }}
            required
          />
        </div>

        <div className="card">
          {selectedCustomerData && (
            <>
              {/* Customer Type: {selectedCustomerData?.Customer_type_data} */}
              Customer Name: {selectedCustomerData?.customer_name}
              {/* Company Name: {selectedCustomerData?.company_name} */}
              GST No.: {selectedCustomerData?.company_gst_no}
              Primary Contact: {selectedCustomerData?.primary_contact_no}
              AlterNate Number: {selectedCustomerData?.alternative_no}
              City: {selectedCustomerData?.connect_billing_city}
              State: {selectedCustomerData?.connect_billing_state}
              Country: {selectedCustomerData?.connect_billing_country}
              Website: {selectedCustomerData?.website}
            </>
          )}
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
          label="Base Amount"
          fieldGrid={4}
          placeholder="Enter amount here"
          astric={true}
          type="number"
          value={baseAmount}
          onChange={(e) => setBaseAmount(e.target.value)}
        />

        <div className="form-group">
          <input
            type="checkbox"
            id="addGst"
            checked={addGst}
            onChange={handleGstChange}
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
          label="Net / Campaign Amount"
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
                options={creditApprovalList.map((option) => ({
                  days: option.day_count,
                  value: option._id,
                  label: option.reason,
                }))}
                value={{
                  value: selectedCreditApp,
                  label:
                    creditApprovalList.find(
                      (item) => item?._id == selectedCreditApp
                    )?.reason || "",
                }}
                onChange={handleReasonCreditApp}
                required
              />
            </div>
            {console.log(selectedCreditApp)}
            {selectedCreditApp === "660e77d6d83f9cce30f8b783" && (
              <FieldContainer
                label="Reason Credit Approval"
                fieldGrid={4}
                value={reasonCreditApproval}
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
        {/* {selectedPaymentStatus.label == "Use Credit Limit" && ( */}
        <div className="form-group">
          {/* <input
            type="checkbox"
            value={executiveSelfCredit}
            onChange={(e) => setExecutiveSelfCredit(e.target.checked)}
            disabled={
              userCreditLimit < netAmount ||
              selectedPaymentStatus.label === "Sent For Payment Approval"
            }
            checked={executiveSelfCredit}
          /> */}
          <label>
            Sales Executive Credit Limit - {userCreditLimit} Total Used Sales
            Executive Credit Limit - 10000 Total Available Credit Limit - 20000
          </label>
        </div>
        {/* )} */}

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
          <label>No Incentive</label>
        </div>
      </FormContainer>
    </div>
  );
};

export default CreateSaleBooking;
