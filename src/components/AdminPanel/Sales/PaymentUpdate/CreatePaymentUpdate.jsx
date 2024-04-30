import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import Select from "react-select";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate } from "react-router-dom";

const CreatePaymentUpdate = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const token = getDecodedToken();
  const loginUserId = token.id;
  const [saleBookingData, setSaleBookingData] = useState([]);
  const [selectedBookingData, setselectedBookingData] = useState(null);
  const [selectedSaleBooking, setSelectedSaleBooking] = useState(null);
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDetailData, setPaymentDetailData] = useState([]);
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState("");
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");

  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentType, setPaymentType] = useState("");
  const [paymentRefrenceNumber, setPaymentRefrenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const getData = async () => {
      const saleBookingRes = await axios.get(
        `${baseUrl}sales/get_all_sales_booking`
      );

      const payDetRes = await axios.get(
        `${baseUrl}sales/getlist_payment_details`
      );

      const payModeRes = await axios.get(
        `${baseUrl}sales/getlist_sale_payment_mode`
      );

      setSaleBookingData(saleBookingRes.data.data);
      setPaymentModeData(payModeRes.data.data);
      setPaymentDetailData(payDetRes.data.data);
    };
    getData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}sales/get_single_sales_booking/${selectedSaleBooking}`
        );
        const response = res.data.data;
        setselectedBookingData(response);
      } catch (error) {
        console.error("Error fetching Sales Booking");
      }
    };

    fetchData();
  }, [selectedSaleBooking]);

  console.log(selectedSaleBooking, "", selectedBookingData, "harshal");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("sale_booking_id", Number(selectedSaleBooking));
      formData.append("customer_id", Number(selectedBookingData?.customer_id));
      formData.append("payment_date", paymentDate);
      formData.append("payment_amount", paymentAmount);
      formData.append("payment_detail_id", selectedPaymentDetail);
      formData.append("payment_mode", selectedPaymentMode);
      formData.append("payment_screenshot", paymentScreenshot);
      formData.append("payment_ref_no", paymentRefrenceNumber);
      formData.append("remarks", remarks);
      formData.append("created_by", loginUserId);

      const response = await axios.post(
        `${baseUrl}sales/add_sales_booking_payment

      `,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toastAlert("Successfull", response.message);
      navigate("/admin/view-sales-booking");
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div>
      <FormContainer
        mainTitle="Payment Update"
        title="Creation"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-4">
          <label className="form-label">Sale Booking</label>
          <Select
            options={saleBookingData?.map((option) => ({
              value: option?.sale_booking_id,
              label: `${option?.customer_name} | ${DateISOtoNormal(
                option?.sale_booking_date
              )} | ${option?.campaign_amount}`,
            }))}
            value={{
              value: selectedSaleBooking,
              label: saleBookingData?.find(
                (item) => item?.sale_booking_id === selectedSaleBooking
              )
                ? `${
                    saleBookingData.find(
                      (item) => item.sale_booking_id === selectedSaleBooking
                    )?.customer_name
                  } | ${DateISOtoNormal(
                    saleBookingData.find(
                      (item) => item.sale_booking_id === selectedSaleBooking
                    )?.sale_booking_date
                  )} | ${
                    saleBookingData.find(
                      (item) => item.sale_booking_id === selectedSaleBooking
                    )?.campaign_amount
                  }`
                : "",
            }}
            onChange={(e) => setSelectedSaleBooking(e.value)}
            required
          />
        </div>
        <FieldContainer
          label="Payment Date"
          fieldGrid={4}
          type="date"
          astric
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
        <FieldContainer
          label="Payment Amount"
          fieldGrid={4}
          astric
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
        <div className="form-group col-4">
          <label className="form-label">Payment Detail</label>
          <Select
            options={paymentDetailData.map((option) => ({
              value: option?._id,
              label: option?.title,
            }))}
            value={{
              value: selectedPaymentDetail,
              label:
                paymentDetailData?.find(
                  (item) => item._id === selectedPaymentDetail
                )?.title || "",
            }}
            onChange={(e) => setSelectedPaymentDetail(e.value)}
            required
          />
        </div>
        <div className="form-group col-4">
          <label className="form-label">Payment Mode</label>
          <Select
            options={paymentModeData.map((option) => ({
              value: option?._id,
              label: option?.payment_mode_name,
            }))}
            value={{
              value: selectedPaymentMode,
              label:
                paymentModeData?.find(
                  (item) => item._id === selectedPaymentMode
                )?.payment_mode_name || "",
            }}
            onChange={(e) => setSelectedPaymentMode(e.value)}
            required
          />
        </div>

        <FieldContainer
          label="Payment Screenshot"
          fieldGrid={4}
          type="file"
          value={paymentScreenshot}
          onChange={(e) => setPaymentScreenshot(e.target.files)}
          required={false}
        />

        <FieldContainer
          label="Payment Refrence Number"
          type="number"
          fieldGrid={4}
          astric
          value={paymentRefrenceNumber}
          onChange={(e) => setPaymentRefrenceNumber(e.target.value)}
        />
        <FieldContainer
          label="Remarks"
          fieldGrid={4}
          astric
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </FormContainer>
    </div>
  );
};

export default CreatePaymentUpdate;
