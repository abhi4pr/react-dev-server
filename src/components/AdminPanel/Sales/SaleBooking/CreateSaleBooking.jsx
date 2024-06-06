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
import { add, set } from "date-fns";
import {
  useAddSaleBookingMutation,
  useGetIndividualSaleBookingQuery,
} from "../../../Store/API/Sales/SaleBookingApi";
import { sl } from "date-fns/locale";

const todayDate = new Date().toISOString().split("T")[0];

const CreateSaleBooking = () => {
  const { editId, un_id } = useParams();

  const navigate = useNavigate();
  const { loginUserData } = useAPIGlobalContext();

  const userCreditLimit = loginUserData?.user_credit_limit;
  const [addsaledata, { isLoading: addsaleLoading, error: addsaleError }] =
    useAddSaleBookingMutation();
  const {
    data: allBrands,
    error: allBrandsError,
    isLoading: allBrandsLoading,
  } = useGetAllBrandQuery();

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
  // console.log(salesdata, "salesdata");
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
  const [description, setDescription] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState();
  const [creditApprovalList, setCreditApprovalList] = useState([]);
  const [selectedCreditApp, setSelectedCreditApp] = useState("");
  const [reasonCreditApproval, setReasonCreditApproval] = useState("");
  const [selectedReasonDays, setSelectedReasonDays] = useState(0);
  const [selectedReasonType, setSelectedReasonType] = useState("");
  const [balancePayDate, setBalancePayDate] = useState("");
  // const [executiveSelfCredit, setExecutiveSelfCredit] = useState(false);
  // const [excelFile, setExcelFile] = useState(null);
  const [incentiveCheck, setIncentiveCheck] = useState(false);
  const [recServices, setRecServices] = useState([]);
  const [gstAvailable, setGstAvailable] = useState();

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
  const {
    data: singleDocumentOverviewData,
    error: singleDocumentOverviewError,
    isLoading: singleDocumentOverviewLoading,
  } = useGetSingleDocumentOverviewQuery(`${selectedAccount}`, {
    skip: !selectedAccount,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const creditAppList = await axios.get(
          `${baseUrl}sales/getlist_reason_credit_approval`
        );
        setCreditApprovalList(creditAppList.data.data);
      } catch (error) {
        toastError(error);
      }
    };

    fetchData();
  }, []);

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
      setCampaignName(salesdata?.campaign_name);
      setSelectedAccount(salesdata?.account_id);
      setSelectedBrand(
        allBrands?.find((item) => item._id == salesdata?.brand_id)?.instaBrandId
      );
      setBookingDate(salesdata?.sale_booking_date?.split("T")[0]);
      setBaseAmount(salesdata?.base_amount);
      setAddGst(salesdata?.gst_status);
      setGstAmount(salesdata?.gst_amount);
      setNetAmount(salesdata?.campaign_amount);
      setDescription(salesdata?.description);
      setSelectedPaymentStatus(
        paymentStatusList.find(
          (item) => item.value == salesdata?.payment_credit_status
        )
      );
      setBalancePayDate(salesdata?.balance_payment_ondate?.split("T")[0]);
      setIncentiveCheck(
        salesdata?.incentive_status?.toLowerCase() == "no-incentive"
      );
      console.log(salesdata?.incentive_status?.toLowerCase() == "no-incentive");
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
      const formData = new FormData();
      formData.append("account_id", selectedAccount);
      formData.append("sale_booking_date", bookingDate);
      formData.append("base_amount", baseAmount);
      formData.append("gst_amount", gstAmount);
      formData.append("gst_status", gstAmount !== 0);
      formData.append("net_amount", netAmount);
      formData.append("campaign_amount", netAmount);
      formData.append("description", description);
      formData.append("campaign_name", campaignName);
      formData.append("payment_credit_status", selectedPaymentStatus?.value);
      formData.append(
        "credit_approval_status",
        selectedPaymentStatus?.label === "Use Credit Limit"
          ? "self_credit_used"
          : "pending"
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

      formData.append("balance_payment_ondate", balancePayDate);
      formData.append(
        "executive_self_credit",
        selectedPaymentStatus.label == "Use Credit Limit"
      );
      // if (excelFile) {
      //   formData.append("excel_file", excelFile);
      // }
      formData.append(
        "incentive_status",
        incentiveCheck ? "no-incentive" : "incentive"
      );

      formData.append("is_draft_save", draft);
      formData.append("managed_by", loginUserId);
      formData.append("created_by", loginUserId);
      formData.append("record_services", recServices);
      addsaledata(formData).unwrap();

      toastAlert("Sale Booking Created Successfully");
      navigate("/admin/view-sales-booking");
    } catch (error) {
      toastError(error);
    }
  };

  const handlePaymentStatusSelect = (selectedOption) => {
    setSelectedPaymentStatus(selectedOption);
  };

  const handleReasonCreditApp = (selectedOption) => {
    setSelectedCreditApp(selectedOption.value);
    setSelectedReasonDays(selectedOption.days);
    setSelectedReasonType(selectedOption.reasonType);
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
        excel_upload: null,
        excel_upload_url: "",
      },
    ]);
  };
  return (
    <div>
      <FormContainer mainTitle="Sale Booking" link={true} />
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Create</h5>
        </div>
        <div className="card-body row">
          <FieldContainer
            fieldGrid={4}
            astric
            label="Campaign Name"
            placeholder="Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
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
                      <span>{gstData?.data?.principal_place_of_business}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
          <CustomSelect
            fieldGrid={4}
            label="Brand"
            dataArray={allBrands}
            optionId="instaBrandId"
            optionLabel="instaBrandName"
            selectedId={selectedBrand}
            setSelectedId={setSelectedBrand}
            required
          />
          <div className="col-md-6 mt-2 flex-row gap-2">
            <button
              type="button"
              className="btn cmnbtn btn_sm btn-primary mt-4"
              onClick={() => openModal("brandCategory")}
            >
              +
            </button>
            <button
              type="button"
              className="btn cmnbtn btn_sm btn-primary mt-4"
              onClick={() => openModal("viewBrandCategory")}
            >
              <i className="bi bi-eye" />
            </button>
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
          <FieldContainer
            label="Description"
            placeholder="Description"
            fieldGrid={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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

          {selectedPaymentStatus?.value === "sent_for_credit_approval" && (
            <>
              <div className="form-group col-4">
                <label className="form-label">
                  Reason Credit Approval<sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={creditApprovalList.map((option) => ({
                    days: option.day_count,
                    value: option._id,
                    label: option.reason,
                    reasonType: option.reason_type,
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
              Sales Executive Credit Limit - {userCreditLimit} Total Used Sales
              Executive Credit Limit - 10000 Total Available Credit Limit -
              20000
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
        <button
          className="btn cmnbtn btn-primary"
          onClick={(e) => handleSubmit(e, !recServices.length > 0)}
        >
          {recServices.length > 0 ? "Submit" : "Save as Draft"}
        </button>
        <button
          className="btn cmnbtn btn-secondary"
          onClick={handleAddRecServices}
        >
          Add Record Service
        </button>
      </div>
    </div>
  );
};

export default CreateSaleBooking;
