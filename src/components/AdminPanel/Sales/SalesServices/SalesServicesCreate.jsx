import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { baseUrl } from "../../../../utils/config";
import DynamicSelect from "../DynamicSelectManualy";
import axios from "axios";
import { useGlobalContext } from "../../../../Context/Context";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const SalesServicesCreate = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { userID } = useAPIGlobalContext();
  const [servicename, setServiceName] = useState("");
  const [postType, setPostType] = useState("");
  const [excelUpload, setExcelUpload] = useState("");
  const [amount, setAmount] = useState("");
  const [numberHours, setNumberHours] = useState("");
  const [goal, setGoal] = useState("");
  const [day, setDay] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brandName, setBrandName] = useState("");
  const [hashTag, setHashTag] = useState("");
  const [individual, setIndividual] = useState("");
  const [numberOfCreators, setNumberOfCreators] = useState("");
  const [startEndDate, setStartEndDate] = useState("");
  const [perMonthAmount, setPerMonthAmount] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [remark, setRemark] = useState("");

  const PostTypeData = [
    "Story",
    "Post",
    "Both",
    "Comment",
    "Display",
    "Note",
    "No",
  ];
  const ExcelUploadData = ["Yes", "No"];
  const AmountData = ["Calculated", "Input"];
  const NumberHoursData = ["Yes", "No"];
  const GoalData = ["Yes", "No"];
  const DayData = ["Yes", "No"];
  const QuantityData = ["Yes", "No"];
  const BrandNameData = ["Yes", "No"];
  const HashtagData = ["Yes", "No"];
  const IndividualAmountData = ["Yes", "No"];
  const NumberOfCreatorData = ["Yes", "No"];
  const StartEndDateData = ["Yes", "No"];
  const PerMonthAmountData = ["Yes", "No"];
  const DeliverablesInfoData = ["Yes", "No"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!servicename || servicename == "") {
      return toastError("Service Name is Required");
    } else if (!postType || postType == "") {
      return toastError("Post Type is Required");
    } else if (!excelUpload || excelUpload == "") {
      return toastError("Excel Upload is Required");
    } else if (!amount || amount == "") {
      return toastError("Amount is Required");
    } else if (!numberHours || numberHours == "") {
      return toastError("Number Hours is Required");
    } else if (!goal || goal == "") {
      return toastError("Goal is Required");
    } else if (!day || day == "") {
      return toastError("Day is Required");
    } else if (!quantity || quantity == "") {
      return toastError("Quantity is Required");
    } else if (!brandName || brandName == "") {
      return toastError("Brand Name is Required");
    } else if (!hashTag || hashTag == "") {
      return toastError("hashTag is Required");
    } else if (!individual || individual == "") {
      return toastError("individual Status is Required");
    } else if (!numberOfCreators || numberOfCreators == "") {
      return toastError("Number Of Creators is Required");
    } else if (!startEndDate || startEndDate == "") {
      return toastError("Start End Date is Required");
    } else if (!perMonthAmount || perMonthAmount == "") {
      return toastError("Per Month Amount is Required");
    } else if (!startEndDate || startEndDate == "") {
      return toastError("Start End Date is Required");
    } else if (!deliverables || deliverables == "") {
      return toastError("Deliverables info is Required");
    }
    try {
      const response = await axios.post(
        baseUrl + `sales/add_sale_service_master`,
        {
          service_name: servicename,
          post_type: postType,
          is_excel_upload: excelUpload,
          amount_status: amount,
          no_of_hours_status: numberHours,
          goal_status: goal,
          day_status: day,
          quantity_status: quantity,
          brand_name_status: brandName,
          hashtag: hashTag,
          indiviual_amount_status: individual,
          no_of_creators: numberOfCreators,
          start_end_date_status: startEndDate,
          per_month_amount_status: perMonthAmount,
          deliverables_info: deliverables,
          remarks: remark,
          created_by: userID,
        }
      );

      toastAlert("Submited Succesfully");
      setServiceName("");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };
  if (isFormSubmitted) {
    return <Navigate to="/admin/sales-services-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Services"
        title="Services Creation"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Service Name"
          astric={true}
          fieldGrid={4}
          value={servicename}
          required={false}
          onChange={(e) => setServiceName(e.target.value)}
        />
        <DynamicSelect
          lable="Post Type"
          astric={true}
          data={PostTypeData}
          value={postType}
          cols={4}
          onChange={(e) => setPostType(e.value)}
        />
        <DynamicSelect
          lable="Excel Upload"
          astric={true}
          data={ExcelUploadData}
          value={excelUpload}
          cols={4}
          onChange={(e) => setExcelUpload(e.value)}
        />
        <DynamicSelect
          lable="Amount"
          astric={true}
          data={AmountData}
          value={amount}
          cols={4}
          onChange={(e) => setAmount(e.value)}
        />
        <DynamicSelect
          lable="Number Hours"
          astric={true}
          data={NumberHoursData}
          value={numberHours}
          cols={4}
          onChange={(e) => setNumberHours(e.value)}
        />
        <DynamicSelect
          lable="Goal"
          astric={true}
          data={GoalData}
          value={goal}
          cols={4}
          onChange={(e) => setGoal(e.value)}
        />
        <DynamicSelect
          lable="Day"
          astric={true}
          data={DayData}
          value={day}
          cols={4}
          onChange={(e) => setDay(e.value)}
        />
        <DynamicSelect
          lable="Quantity"
          astric={true}
          data={QuantityData}
          value={quantity}
          cols={4}
          onChange={(e) => setQuantity(e.value)}
        />
        <DynamicSelect
          lable="Brand Name"
          astric={true}
          data={BrandNameData}
          value={brandName}
          cols={4}
          onChange={(e) => setBrandName(e.value)}
        />
        <DynamicSelect
          lable="HasTag"
          astric={true}
          data={HashtagData}
          value={hashTag}
          cols={4}
          onChange={(e) => setHashTag(e.value)}
        />
        <DynamicSelect
          lable="Individual Amount"
          astric={true}
          data={IndividualAmountData}
          value={individual}
          cols={4}
          onChange={(e) => setIndividual(e.value)}
        />
        <DynamicSelect
          lable="Number Of Creators"
          astric={true}
          data={NumberOfCreatorData}
          value={numberOfCreators}
          cols={4}
          onChange={(e) => setNumberOfCreators(e.value)}
        />
        <DynamicSelect
          lable="Start End Date"
          astric={true}
          data={StartEndDateData}
          value={startEndDate}
          cols={4}
          onChange={(e) => setStartEndDate(e.value)}
        />
        <DynamicSelect
          lable="Per Month Amount"
          astric={true}
          data={PerMonthAmountData}
          value={perMonthAmount}
          cols={4}
          onChange={(e) => setPerMonthAmount(e.value)}
        />
        <DynamicSelect
          lable="Deliverables Info "
          astric={true}
          data={DeliverablesInfoData}
          value={deliverables}
          cols={4}
          onChange={(e) => setDeliverables(e.value)}
        />
        <FieldContainer
          label="Remark"
          Tag="textarea"
          fieldGrid={4}
          value={remark}
          required={false}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default SalesServicesCreate;
