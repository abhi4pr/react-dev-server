import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import Select from "react-select";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import { useGetAllBrandQuery } from "../../../Store/API/Sales/BrandApi";
// import ExcelToInputFields from "../../../ReusableComponents/ExcelToInputFields";
import { useGetAllAccountQuery } from "../../../Store/API/Sales/SalesAccountApi";
import CreateRecordServices from "../Account/CreateRecordServices";
import { useGetAllSaleServiceQuery } from "../../../Store/API/Sales/SalesServiceApi";
import { useGstDetailsMutation } from "../../../Store/API/Sales/GetGstDetailApi";
import { useGetSingleDocumentOverviewQuery } from "../../../Store/API/Sales/DocumentOverview";
import BrandRegistration from './BrandRegistration';  // Adjust the path as necessary
import {
  useAddSaleBookingMutation,
  useEditSaleBookingMutation,
  useGetIndividualSaleBookingQuery,
} from "../../../Store/API/Sales/SaleBookingApi";

import { useEditMultipleRecordServicesMutation, useGetSingleRecordServiceQuery } from "../../../Store/API/Sales/RecordServicesApi";
import { useGetAllCreditApprovalsQuery, useGetCreditApprovalDetailQuery } from "../../../Store/API/Sales/CreditApprovalApi";

const todayDate = new Date().toISOString().split("T")[0];

const CreateSaleBooking = () => {
  const { editId, un_id } = useParams();

  const navigate = useNavigate();
  const { loginUserData } = useAPIGlobalContext();
  const {
    data: recordServiceData,
    error: recordServiceError,
    isLoading: recordServiceLoading,
    refetch: recordServiceRefetch,
  } = useGetSingleRecordServiceQuery(editId, { skip: !editId });
  const userCreditLimit = loginUserData?.user_credit_limit;
  const [addsaledata, { isLoading: addsaleLoading, error: addsaleError }] = useAddSaleBookingMutation();
  const [updateRecordServices, { isLoading: updateRecordServicesLoading, error: updateRecordServicesError }] = useEditMultipleRecordServicesMutation();
  const {
    data: allBrands,
    error: allBrandsError,
    isLoading: allBrandsLoading,
  } = useGetAllBrandQuery();
  const [updateSalesBooking, { isLoading: updateSalesBookingLoading, error: updateSalesBookingError }] = useEditSaleBookingMutation();
  const {
    data: allAccounts,
    error: allAccoutsError,
    isLoading: allAccountLoading,
  } = useGetAllAccountQuery();

  const {
    data: salesdata,
    error: salesError,
    isLoading: salesLoading,
  } = useGetIndividualSaleBookingQuery(`${un_id}`, { skip: !un_id });
  const { data: serviceTypes } = useGetAllSaleServiceQuery();

  const [getGst, { data: gstData, isLoading: gstLoading, error: gstError }] =
    useGstDetailsMutation();
  const token = getDecodedToken();
  const loginUserId = token.id;
  const { toastAlert, toastError } = useGlobalContext();
  const [campaignName, setCampaignName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [baseAmount, setBaseAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [addGst, setAddGst] = useState(false);
  const [netAmount, setNetAmount] = useState(0);
  const [campaignList, setCampaignList] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState();
  const [creditApprovalList, setCreditApprovalList] = useState([]);
  const [selectedCreditApp, setSelectedCreditApp] = useState("");
  const [reasonCreditApproval, setReasonCreditApproval] = useState("");
  const [selectedReasonDays, setSelectedReasonDays] = useState(0);
  const [selectedReasonType, setSelectedReasonType] = useState("");
  const [balancePayDate, setBalancePayDate] = useState("");
  // const [executiveSelfCredit, setExecutiveSelfCredit] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [incentiveCheck, setIncentiveCheck] = useState(false);
  const [recServices, setRecServices] = useState([]);
  const [gstAvailable, setGstAvailable] = useState();

  const paymentStatusList = [
    // {
    //   value: "sent_for_credit_approval",
    //   label:
    //     userCreditLimit > netAmount
    //       ? `Use Credit Limit`
    //       : "Send For Credit Approval",
    // },
    {
      value: "sent_for_payment_approval",
      label: "Sent For Payment Approval",
    },
    {
      value: "self_credit_used",
      label: "Use Self Credit",
    },
  ];
  const {
    data: singleDocumentOverviewData,
    error: singleDocumentOverviewError,
    isLoading: singleDocumentOverviewLoading,
  } = useGetSingleDocumentOverviewQuery(`${selectedAccount}`, {
    skip: !selectedAccount,
  });

  const {
    data: allCreditApprovals,
    error: allCreditApprovalsError,
    isLoading: allCreditApprovalsLoading,
  } = useGetAllCreditApprovalsQuery()
  useEffect(() => {

    const fetchcampaign = async () => {
      try {
        const campaignList = await axios.get(`${baseUrl}exe_campaign_name_wise`);
        setCampaignList(campaignList.data.data);
      } catch (error) {
        toastError(error);
      }
    };


    fetchcampaign();

    setCreditApprovalList(allCreditApprovals);
  }, []);
  console.log(allCreditApprovals, "allCreditApprovals");

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
    if (editId) {
      setCampaignName(salesdata?.campaign_id);
      setSelectedAccount(salesdata?.account_id);
      setSelectedBrand(
        salesdata?.brand_id
      );
      setBookingDate(salesdata?.sale_booking_date?.split("T")[0]);
      setBaseAmount(salesdata?.base_amount);
      setAddGst(salesdata?.gst_status);
      setGstAmount(salesdata?.gst_amount);
      setNetAmount(salesdata?.campaign_amount);

      setSelectedPaymentStatus(
        paymentStatusList.find(
          (item) => item.value == salesdata?.payment_credit_status
        )
      );
      setBalancePayDate(salesdata?.balance_payment_ondate?.split("T")[0]);
      setIncentiveCheck(
        salesdata?.incentive_status?.toLowerCase() == "no-incentive"
      );
      setRecServices(recordServiceData);
    }
  }, [salesdata]);

  useEffect(() => {
    if (
      singleDocumentOverviewData?.data?.length > 0 &&
      !singleDocumentOverviewLoading
    ) {
      setGstAvailable(
        singleDocumentOverviewData?.data?.find(
          (item) => item.document_name.toLowerCase() == "gst no."
        )?.document_no
      );
    }
  }, [
    selectedAccount,
    singleDocumentOverviewData,
    singleDocumentOverviewLoading,
  ]);
  useEffect(() => {
    if (gstAvailable !== undefined)
      getGst({
        flag: 1,
        gstNo: gstAvailable,
      }).unwrap();
  }, [gstAvailable]);
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

  const handleSubmit = async (e, draft) => {
    e.preventDefault();
    try {


      // Create FormData instance
      const formData = new FormData();
      formData.append("account_id", selectedAccount);
      formData.append("sale_booking_date", bookingDate);
      formData.append("base_amount", baseAmount);
      formData.append("gst_amount", gstAmount);
      formData.append("gst_status", gstAmount !== 0);
      formData.append("net_amount", netAmount);
      formData.append("campaign_amount", netAmount);
      formData.append("campaign_name", campaignList.find((item) => item._id == campaignName)?.exe_campaign_name || "");
      formData.append("campaign_id", campaignName);
      formData.append("payment_credit_status", selectedPaymentStatus?.value || "");
      formData.append(
        "credit_approval_status",
        selectedPaymentStatus?.value === "self_credit_used"
          ? "self_credit_used"
          : "pending"
      );
      if (reasonCreditApproval) {
        formData.append("reason_credit_approval", selectedCreditApp);
        formData.append("reason_credit_approval_own_reason", reasonCreditApproval);
      }
      formData.append("brand_id", selectedBrand || "");

      formData.append("balance_payment_ondate", balancePayDate);
      formData.append(
        "incentive_status",
        incentiveCheck ? "no-incentive" : "incentive"
      );
      formData.append("is_draft_save", draft);

      if (editId === undefined) {
        // For creating a new sale booking
        formData.append("created_by", loginUserId);
        formData.append("record_services", JSON.stringify(recServices));

        await addsaledata(formData).unwrap();
      } else {
        // For updating an existing sale booking
        formData.append("updated_by", loginUserId);


        // Convert FormData to an object for updating
        const formDataObj = {};
        formData.forEach((value, key) => {
          formDataObj[key] = value;
        });



        await updateSalesBooking({ ...formDataObj, id: un_id }).unwrap();
        await updateRecordServices({ id: editId, record_services: recServices, updated_by: loginUserId }).unwrap();
      }

      toastAlert("Sale Booking Created Successfully");
      navigate("/admin/view-sales-booking");
    } catch (error) {
      toastError(
        error.message || "An error occurred while creating the sale booking."
      );
    }
  };


  const handlePaymentStatusSelect = (selectedOption) => {
    setSelectedPaymentStatus(selectedOption);
  };

  const handleReasonCreditApp = (selectedOption) => {
    setSelectedCreditApp(selectedOption.value);
    setSelectedReasonDays(selectedOption.days);
    setSelectedReasonType(selectedOption.reasonType);
    setReasonCreditApproval("");
  };
  console.log(selectedReasonDays, "selectedReasonDays", selectedCreditApp, "selectedCreditApp", selectedReasonType, "selectedReasonType", reasonCreditApproval, "reasonCreditApproval");
  useEffect(() => {
    if (selectedReasonDays > 0) {
      const currentDate = new Date();
      const newDate = new Date(
        currentDate.setDate(currentDate.getDate() + selectedReasonDays)
      );
      setBalancePayDate(newDate.toISOString().split("T")[0]);
    }
  }, [selectedReasonDays]);

  const handleAddRecServices = () => {
    setRecServices([
      ...recServices,
      {
        sale_booking_id: "",
        sales_service_master_id: "",
        amount: "",
        no_of_hours: "",
        goal: "",
        day: "",
        quantity: "",
        brand_name: "",
        hashtag: "",
        individual_amount: "",
        start_date: "",
        end_date: "",
        per_month_amount: "",
        no_of_creators: "",
        deliverables_info: "",
        remarks: "",
        excel_upload: "",

        created_by: loginUserId,
      },
    ]);
  };
  return (
    <>
      <FormContainer mainTitle="Sale Booking" link={true} />
      <form onSubmit={(e) => handleSubmit(e, !recServices.length > 0)}>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Create</h5>
          </div>
          <div className="card-body row">
            {/* <FieldContainer
              fieldGrid={4}
              astric
              label="Campaign Name"
              placeholder="Campaign Name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            /> */}
            <CustomSelect
              fieldGrid={4}
              label="Campaign Name"
              dataArray={campaignList}
              optionId="_id"
              optionLabel="exe_campaign_name"
              selectedId={campaignName}
              setSelectedId={setCampaignName}
              required
            />
            <CustomSelect
              fieldGrid={4}
              label="Accounts"
              dataArray={allAccounts}
              optionId="account_id"
              optionLabel="account_name"
              selectedId={selectedAccount}
              setSelectedId={setSelectedAccount}
              required
            />
            {gstAvailable && (
              <div className="col-4">
                <div className="card gstinfo-card">
                  {gstLoading && <p>Loading...</p>}
                  {!gstLoading && (
                    <>
                      <p>
                        {" "}
                        Company Name:{" "}
                        <span>{gstData?.data?.legal_business_name}</span>
                      </p>

                      <p>
                        GST No.: <span>{gstData?.data?.gstin}</span>
                      </p>

                      <p>
                        Address:
                        <span>
                          {gstData?.data?.principal_place_of_business}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
            <div className="col-4 flex-row gap-2">
              <CustomSelect
                fieldGrid={10}
                label="Brand"
                dataArray={allBrands}
                optionId="_id"
                optionLabel="instaBrandName"
                selectedId={selectedBrand}
                setSelectedId={setSelectedBrand}
                required
              />
              <div className="col-1 mt-4 flex-row gap-1">
                <div className="mt-2">

                  <BrandRegistration userID={
                    loginUserId
                  } />
                </div>
              </div>
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
            <div className="col-4">
              <FieldContainer
                label="Base Amount"
                fieldGrid={12}
                placeholder="Enter amount here"
                astric={true}
                type="number"
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
              />

              <div className="form-group ml-4 sb form-sub">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="addGst"
                  checked={addGst}
                  onChange={handleGstChange}
                />
                <label className="mt-3  " htmlFor="addGst">
                  +18% GST
                </label>
                {addGst && (
                  <div className="flex-col gap-1 ">
                    <p>Gst Amount: Rs.{gstAmount}</p>
                    <p>Net / Campaign Amount: Rs.{netAmount}</p>
                  </div>
                )}
              </div>
            </div>

            {/* {addGst &&
              <>
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
              </>

            } */}

            <div className="form-group col-4">
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

            {selectedPaymentStatus?.value === "self_credit_used" && (
              <>
                <div className="form-group col-4">
                  <label className="form-label">
                    Reason Credit Approval<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={creditApprovalList?.map((option) => ({
                      days: option.day_count,
                      value: option._id,
                      label: option.reason,
                      reasonType: option.reason_type,
                    }))}
                    value={{
                      value: selectedCreditApp,
                      label:
                        creditApprovalList?.find(
                          (item) => item?._id == selectedCreditApp
                        )?.reason || "",
                    }}
                    onChange={handleReasonCreditApp}
                    required
                  />
                </div>
                {selectedReasonType === "own_reason" && (
                  <FieldContainer
                    label="Reason Credit Approval"
                    fieldGrid={4}
                    value={reasonCreditApproval}
                    onChange={(e) => setReasonCreditApproval(e.target.value)}
                  />
                )}
              </>
            )}
            <div className="col-4 ">
              <FieldContainer
                label="Balance Payment Date"
                type="date"
                fieldGrid={12}
                value={balancePayDate}
                onChange={(e) => setBalancePayDate(e.target.value)}
              />
            </div>
            {/* {selectedPaymentStatus.label == "Use Credit Limit" && ( */}
            <div className="form-group mt-4">
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
                Sales Executive Credit Limit - {userCreditLimit} Total Used
                Sales Executive Credit Limit - 10000 Total Available Credit
                Limit - 20000
              </label>
            </div>
            {/* )} */}

            {/* <FieldContainer
          type="file"
          name="Image"
          fieldGrid={4}
          accept=".xls, .xlsx"
          onChange={(e) => setExcelFile(e.target.files[0])}
          required={false}
        /> */}
            <div className="form-group col-12 mt-2 mr-2 pl-4">
              <input
                className="form-check-input "
                type="checkbox"
                checked={incentiveCheck}
                onChange={(e) => setIncentiveCheck(e.target.checked)}
              />

              <label className="mr-2"> No Incentive</label>
            </div>
          </div>
        </div>

        <CreateRecordServices
          records={recServices}
          setRecords={setRecServices}
          serviceTypes={serviceTypes}
        />
        {/* <ExcelToInputFields /> */}
        <div className="flex-row sb mb-3">
          <button className="btn cmnbtn btn-primary" type="submit">
            {recServices?.length > 0 ? "Submit" : "Save as Draft"}
          </button>
          <button
            className="btn cmnbtn btn-secondary"
            onClick={handleAddRecServices}
          >
            Add Record Service
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateSaleBooking;
