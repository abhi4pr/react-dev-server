import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router";
import Select from "react-select";
import authBaseQuery from "../../../utils/authBaseQuery";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import {
  handleChangeVendorInfoModal,
  setModalType,
  setShowAddVendorModal,
} from "./../../Store/VendorMaster";
import AddVendorModal from "./AddVendorModal";
import {
  useGetAllVendorTypeQuery,
  useGetBankNameDetailQuery,
  useGetCountryCodeQuery,
  useGetPmsPayCycleQuery,
  useGetPmsPaymentMethodQuery,
  useGetPmsPlatformQuery,
  useGetVendorWhatsappLinkTypeQuery,
} from "../../Store/reduxBaseURL";

import VendorTypeInfoModal from "./VendorTypeInfoModal";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import { useParams } from "react-router";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IndianStatesMui from "../../ReusableComponents/IndianStatesMui";
import IndianCitiesMui from "../../ReusableComponents/IndianCitiesMui";
import { useGstDetailsMutation } from "../../Store/API/Sales/GetGstDetailApi";

const VendorMaster = () => {
  const { data: countryCodeData } = useGetCountryCodeQuery();

  const countries = countryCodeData?.data;

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const { _id } = useParams();
  const dispatch = useDispatch();
  const isVendorModalOpen = useSelector(
    (state) => state.vendorMaster.showVendorInfoModal
  );

  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [mobile, setMobile] = useState("");
  const [altMobile, setAltMobile] = useState("");
  const [email, setEmail] = useState("");
  // const [perAddress, setPerAddress] = useState("");
  const [pan, setPan] = useState("");
  const [panImage, setPanImage] = useState("");
  const [gstImage, setGstImage] = useState("");
  const [gst, setGst] = useState("");
  const [compName, setCompName] = useState("");
  const [compAddress, setCompAddress] = useState("");
  const [compCity, setCompCity] = useState("");
  const [compPin, setCompPin] = useState("");
  const [compState, setCompState] = useState("");
  const [limit, setLimit] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homePincode, setHomePincode] = useState("");
  const [otherCountry, setOtherCountry] = useState("");
  const [homeState, setHomeState] = useState("");
  const [typeId, setTypeId] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [payId, setPayId] = useState("");
  const [bankNameId, setBankNameId] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [gstApplicable, setGstApplicable] = useState("No");
  const [vendorCategory, setVendorCategory] = useState("Theme Page");
  const [whatsappLink, setWhatsappLink] = useState([]);

  const [docDetails, setDocDetails] = useState([]);
  const [sameAsPrevious, setSameAsPrevious] = useState(false);
  const [mobileValid, setMobileValid] = useState(false);

  const [getGstDetails, { dd, error, isLoading }] = useGstDetailsMutation();

  const [bankRows, setBankRows] = useState([
    {
      bank_name: "",
      account_type: "",
      account_number: "",
      ifcs: "",
      upi_id: "",
      registered_number: "",
    },
  ]);
  const [validator, setValidator] = useState({
    vendorName: false,
    countryCode: false,
    mobile: false,
    email: false,
    typeId: false,
    platformId: false,
    payId: false,
    cycleId: false,
    // type: false,
  });

  const [mandatoryFieldsEmpty, setMandatoryFieldsEmpty] = useState({
    mobile: false,
    altMobile: false,
  });

  const [isContactTouched1, setisContactTouched1] = useState(false);

  const { isLoading: typeLoading, data: typeData } = useGetAllVendorTypeQuery();

  const { data: platformData } = useGetPmsPlatformQuery();

  const { data } = useGetPmsPaymentMethodQuery();
  const payData = data?.data;

  const { data: cycleQueryData } = useGetPmsPayCycleQuery();

  const { data: whatsappLinkType } = useGetVendorWhatsappLinkTypeQuery();
  const cycleData = cycleQueryData?.data;

  const { data: bankNameData } = useGetBankNameDetailQuery();
  const bankName = bankNameData?.data;

  useEffect(() => {
    if (gst?.length === 15) {
      getGstDetails({ gstNo: gst, flag: 1 })
        .then((response) => {
          if (response?.data && response?.data?.success) {
            const { data } = response?.data;
            setCompName(data?.legal_business_name);
            setCompAddress(data?.principal_place_of_business?.split(",")?.[0]);
            const addressParts = data?.principal_place_of_business?.split(",");
            setCompCity(addressParts[2]);
            setCompPin(addressParts[7]);
            setCompState(addressParts[2]);
            setLimit("");
          } else {
            setCompName("");
            setCompAddress("");
            setCompCity("");
            setCompPin("");
            setCompState("");
            setLimit("");
          }
        })
        .catch((error) => {
          console.error("Error fetching GST details:", error);
        });
    }
  }, [gst, getGstDetails]);

  const handleRemarkChange = (i, value) => {
    const remark = [...whatsappLink];
    remark[i].remark = value;
    setWhatsappLink(remark);
  };

  const handleAddVendorTypeClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("Vendor"));
  };

  const handleInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("Vendor"));
  };

  const handleAddPlatformClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("Platform"));
  };

  const handlePlatformInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("Platform"));
  };

  const handleAddPaymentMethodClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("PaymentMethod"));
  };

  const handlePaymentMethodInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("PaymentMethod"));
  };

  const handleAddPayCycleClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("PayCycle"));
  };

  const handlePayCycleInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("PayCycle"));
  };
  // Bank Name:-=> {
  const handleAddBankNameClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("BankName"));
  };
  const handleBankNameInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("BankName"));
  };

  const handleAccountTypeChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].account_type = e.value;
    setBankRows(updatedRows);
  };

  const handleAccountNoChange = (e, i) => {
    if (e.target.value.length > 20) return;
    const updatedRows = [...bankRows];
    updatedRows[i].account_number = e.target.value;
    setBankRows(updatedRows);
  };

  const handleIFSCChange = (e, i) => {
    if (e.target.value.length > 11) return;
    const updatedRows = [...bankRows];
    updatedRows[i].ifcs = e.target.value;
    setBankRows(updatedRows);
  };

  const handleUPIidChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].upi_id = e.target.value;
    setBankRows(updatedRows);
  };

  const handleRegisteredMobileChange = (e, i) => {
    if (e.target.value.length > 10) {
      return;
    }
    const updatedRows = [...bankRows];
    updatedRows[i].registered_number = e.target.value;
    setBankRows(updatedRows);
  };

  const handleLinkChange = (index, newValue) => {
    let link = [...whatsappLink];
    link[index].link = newValue;
    setWhatsappLink(link);
  };

  const handleAddWhatsappGroupLinkTypeClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("WhatsappLinkType"));
  };

  const handleWhatsappGroupLinkTypeInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("WhatsappLinkType"));
  };

  useEffect(() => {
    if (_id) {
      axios.get(baseUrl + `v1/vendor/${_id}`).then((res) => {
        const data = res.data.data;
        setVendorName(data.vendor_name);
        setCountryCode(data.country_code);
        setMobile(data.mobile);
        setAltMobile(data.alternate_mobile);
        setEmail(data.email);
        // setPerAddress(data.personal_address);
        setPan(data.pan_no);
        setPanImage(data?.pan_image_url);
        setGstImage(data?.gst_image_url);
        setGst(data.gst_no);
        setCompName(data.company_name);
        setCompAddress(data.company_address);
        setCompCity(data.company_city);
        setCompPin(data.company_pincode);
        setCompState(data.company_state);
        setLimit(data.threshold_limit);
        setHomeAddress(data.home_address);
        setHomeCity(data.home_city);
        setHomeState(data.home_state);
        setTypeId(data.vendor_type);
        setPlatformId(data.vendor_platform);
        setPayId(data.payment_method);
        setCycleId(data.pay_cycle);
        setBankNameId(data.bank_name);
        setHomePincode(data.home_pincode);
        // setPanImglink(data.upload_pan_image);
        // setGstImage(data.upload_gst_image);
        // setBankName(data.bank_name);
        // setAccountType(data.account_type);
        // setAccountNo(data.account_no);
        // setIfscCode(data.ifsc_code);
        // setUpiId(data.upi_id);
        // setWhatsappLink(data.whatsapp_link);
        setVendorCategory(data.vendor_category);
      });

      axios
        .get(baseUrl + `v1/bank_details_by_vendor_id/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        })
        .then((res) => {
          const data = res.data.data;
          setBankRows(data);
        });

      axios
        .get(baseUrl + `v1/vendor_group_link_vendor_id/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        })
        .then((res) => {
          const data = res.data?.data;
          setWhatsappLink(data);
        });
    }
  }, [_id]);
  const addLink = () => {
    setWhatsappLink([
      ...whatsappLink,
      {
        link: "",
        remark: "",
        type: "",
      },
    ]);
  };
  const addDocDetails = () => {
    setDocDetails([
      ...docDetails,
      {
        docName: "",
        docNumber: "",
      },
    ]);
  };
  const handleDocNameChange = (index, newValue) => {
    let link = [...docDetails];
    link[index].link = newValue;
    setDocDetails(link);
  };
  const handleDocNumberChange = (i, value) => {
    const remark = [...docDetails];
    remark[i].docDetails = value;
    setDocDetails(remark);
  };
  const removedocLink = (index) => {
    return () => {
      const updatedLinks = docDetails?.filter((link, i) => i !== index);
      setDocDetails(updatedLinks);
    };
  };

  const handleAddBankInfoRow = () => {
    setBankRows([
      ...bankRows,
      {
        bank_name: "",
        account_type: "",
        account_number: "",
        ifcs: "",
        upi_id: "",
        registered_number: "",
      },
    ]);
  };
  const handleRemoveBankInfoRow = (index) => {
    return () => {
      const updatedRows = bankRows.filter((row, i) => i !== index);
      setBankRows(updatedRows);
    };
  };
  const removeLink = (index) => {
    return () => {
      const updatedLinks = whatsappLink?.filter((link, i) => i !== index);
      setWhatsappLink(updatedLinks);
    };
  };

  const handleMobileNumSet = (e) => {
    const newContact = e.target.value;

    if (newContact) {
      setValidator((prev) => ({ ...prev, mobile: false }));
    }

    if (newContact.length <= 10) {
      if (
        newContact === "" ||
        (newContact.length === 1 && parseInt(newContact) < 6)
      ) {
        setMobile("");
        setMobileValid(false);
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          mobile: true,
        });
      } else {
        setMobile(newContact);
        setMobileValid(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact)
        );
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          mobile: false,
        });
      }
    }
    setisContactTouched1(true);
    if (newContact.length < 10) {
      setMobileValid(false);
    }
  };
  const handleAlternateMobileNumSet = (e, setState) => {
    const newContact = e.target.value;
    if (newContact.length <= 10) {
      if (
        newContact === "" ||
        (newContact.length === 1 && parseInt(newContact) < 6)
      ) {
        setState("");
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          altMobile: true,
        });
      } else {
        setState(newContact);
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          altMobile: false,
        });
      }
    }
  };

  const handleEmailSet = (e, setState) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (e.target.value) {
      setValidator((prev) => ({ ...prev, email: false }));
    }
    setState(e.target.value);
    if (re.test(e.target.value) || e.target.value === "") {
      return setEmailIsInvalid(false);
    }
    return setEmailIsInvalid(true);
  };

  const handlePanChange = (e) => {
    if (e.target.value.length > 13) return;
    const inputValue = e.target.value.toUpperCase();
    setPan(inputValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorName || vendorName == "" || vendorName == null) {
      setValidator((prev) => ({ ...prev, vendorName: true }));
    }
    if (!countryCode) {
      setValidator((prev) => ({ ...prev, countryCode: true }));
    }
    if (!mobile) {
      setValidator((prev) => ({ ...prev, mobile: true }));
    }
    if (!email) {
      setValidator((prev) => ({ ...prev, email: true }));
    }

    if (!typeId) {
      setValidator((prev) => ({ ...prev, typeId: true }));
    }
    if (!platformId) {
      setValidator((prev) => ({ ...prev, platformId: true }));
    }
    if (!payId) {
      setValidator((prev) => ({ ...prev, payId: true }));
    }
    if (!cycleId) {
      setValidator((prev) => ({ ...prev, cycleId: true }));
    }

    if (emailIsInvalid) {
      toastError("Please enter a valid email");
      return;
    }
    // if (gstApplicable === "Yes" && !gst) {
    //   setValidator((prev) => ({ ...prev, gst: true }));
    // }
    if (
      !vendorName ||
      !countryCode ||
      !mobile ||
      !email ||
      !typeId ||
      !platformId ||
      !payId ||
      !cycleId
      // ||
      // (gstApplicable === "Yes" && !gst)
      // ||
      // (whatsappLink.length > 0 && !whatsappLink[0].link) ||
      // (whatsappLink.length > 0 && !whatsappLink[0].type)
    ) {
      toastError("Please fill all the mandatory fields");
      return;
    }
    // const formData = new FormData();
    // formData.append("vendor_name", vendorName);
    // formData.append("country_code", countryCode);
    // formData.append("mobile", mobile);
    // formData.append("alternate_mobile", altMobile);
    // formData.append("email", email);
    // formData.append("vendor_type", typeId);
    // formData.append("vendor_platform", platformId);
    // formData.append("payment_method", payId);
    // formData.append("pay_cycle", cycleId);
    // formData.append("pan_no", pan);
    // formData.append("pan_image", panImage);
    // formData.append("gst_no", gst);
    // formData.append("gst_image", gstImage);
    // formData.append("company_name", compName);
    // formData.append("company_address", compAddress);
    // formData.append("company_city", compCity);
    // formData.append("company_pincode", compPin);
    // formData.append("company_state", compState);
    // formData.append("threshold_limit", limit);
    // formData.append("home_address", homeAddress);
    // formData.append("home_city", homeCity);
    // formData.append("home_state", homeState);
    // formData.append("home_pincode", homePincode);
    // formData.append("created_by", userID);
    // formData.append("vendor_category", vendorCategory);
    const formData = {
      vendor_name: vendorName,
      country_code: countryCode,
      mobile: mobile,
      alternate_mobile: altMobile,
      email: email,
      vendor_type: typeId,
      vendor_platform: platformId,
      payment_method: payId,
      pay_cycle: cycleId,
      // pan_no: pan,
      // pan_image: panImage,
      // gst_no: gst,
      // gst_image: gstImage,
      company_name: compName,
      company_address: compAddress,
      company_city: compCity,
      company_pincode: compPin,
      company_state: compState,
      threshold_limit: limit,
      home_address: homeAddress,
      home_city: homeCity,
      home_state: homeState,
      home_pincode: homePincode,
      created_by: userID,
      vendor_category: vendorCategory,
      bank_details: JSON.stringify(bankRows),
    };
    // formData.append("bank_details", JSON.stringify(bankRows));
    // formData.append("vendorLinks", JSON.stringify(whatsappLink));

    if (!_id) {
      setIsFormSubmitting(true);
      await axios
        .post(baseUrl + "v1/vendor", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        })
        .then((res) => {
          setIsFormSubmitted(true);
          toastAlert("Data Submitted Successfully");
          isFormSubmitting(false);
          const resID = res.data.data._id;
          axios.post(baseUrl + `document_detail`, {
            vendor_id: resID,
            // document_name: docName,
            // document_no: docNumber,
            documnet: JSON.stringify(docDetails),
          });
        })
        .catch((err) => {
          toastError(err.message);
          setIsFormSubmitting(false);
        });
    } else {
      setIsFormSubmitting(true);
      const res = axios
        .put(baseUrl + `v1/vendor/${_id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        })
        .then(() => {
          toastAlert("Data Updated Successfully");
          setIsFormSubmitted(true);
          setIsFormSubmitting(false);
        })
        .catch((err) => {
          console.log(err);
          toastError(err.message);
          setIsFormSubmitting(false);
        });
    }
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setSameAsPrevious(checked);
    if (checked) {
      setCompAddress(homeAddress);
      // if (countryCode === "91") {
      setCompCity(homeCity);
      setCompState(homeState);
      setCompPin(homePincode);
    } else {
      setCompAddress("");
      setCompCity("");
      setCompPin("");
      setCompState("");
    }
  };

  const gstOptions = [
    {
      label: "Yes",
      value: "Yes",
    },
    {
      label: "No",
      value: "No",
    },
  ];

  // if (isFormSubmitted) {
  //   return <Navigate to="/admin/pms-vendor-overview" />;
  // }
  return (
    <>
      <FormContainer
        mainTitle={_id ? "Edit Vendor Master" : "Add Vendor Master"}
        link={true}
        title={_id ? "Edit Vendor Master" : "Vendor Details"}
        // handleSubmit={handleSubmit}
        submitButton={false}
      ></FormContainer>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Add Vendor Master</h5>
        </div>
        <div className="card-body pb4">
          <div className="row thm_form">
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Vendor Name "
                fieldGrid={12}
                value={vendorName}
                astric={true}
                required={true}
                onChange={(e) => {
                  setVendorName(e.target.value);
                  if (e.target.value) {
                    setValidator((prev) => ({ ...prev, vendorName: false }));
                  }
                }}
              />
              {validator.vendorName && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter vendor name
                </span>
              )}
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Vendor Category <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={["Theme Page", "Influencer"].map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  required={true}
                  value={{
                    value: vendorCategory,
                    label: vendorCategory,
                  }}
                  onChange={(e) => {
                    setVendorCategory(e.value);
                  }}
                ></Select>
                {validator.vendorCategory && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    Please select vendor category
                  </span>
                )}
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Mobile"
                fieldGrid={12}
                value={mobile}
                astric
                type="number"
                required={true}
                onChange={(e) => {
                  handleMobileNumSet(e);
                  // handleMobileValidate();
                }}
              />
              {validator.mobile && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter mobile number
                </span>
              )}
              {/* {mobileValid && (
        <div className="form-group col-6">
          <label className="form-label">
            Vendor Category <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={["Theme Page", "influencer"].map((option) => ({
              label: option,
              value: option,
            }))}
            required={true}
            value={{
              value: vendorCategory,
              label: vendorCategory,
            }}
            onChange={(e) => {
              setVendorCategory(e.value);
            }}
          ></Select>
          {validator.vendorCategory && (
            <span style={{ color: "red", fontSize: "12px" }}>
              Please select vendor category
            </span>
          )}
        </div>

        <div className="col-6">
          <FieldContainer
            label="Mobile"
            fieldGrid={12}
            value={mobile}
            astric
            type="number"
            required={true}
            onChange={(e) => {
              handleMobileNumSet(e);
              // handleMobileValidate();
            }}
          />
          {validator.mobile && (
            <span style={{ color: "red", fontSize: "12px" }}>
              Please enter mobile number
            </span>
          )}
          {/* {mobileValid && (
            <span style={{ color: "red", fontSize: "12px" }}>
              Please enter valid mobile number
            </span>
          )} */}
              {/* {
            <span style={{ color: "red", fontSize: "12px" }}>
              {mandatoryFieldsEmpty.mobile && "Please enter mobile number"}
            </span>
          } */}

              {
                <span style={{ color: "red", fontSize: "12px" }}>
                  {!validator.mobile &&
                    isContactTouched1 &&
                    !mobileValid &&
                    "Please enter valid mobile number"}
                </span>
              }
            </div>
            <div className="col-6">
              <FieldContainer
                label="Alternate Mobile"
                fieldGrid={12}
                value={altMobile}
                required={false}
                type="number"
                onChange={(e) => handleAlternateMobileNumSet(e, setAltMobile)}
              />
              {
                <span style={{ color: "red", fontSize: "12px" }}>
                  {mandatoryFieldsEmpty.altMobile &&
                    "Please enter alternate mobile"}
                </span>
              }
            </div>
            <div className="col-6">
              <FieldContainer
                label="Email"
                fieldGrid={12}
                astric
                value={email}
                required={true}
                type="email"
                onChange={(e) => handleEmailSet(e, setEmail)}
              />
              {emailIsInvalid && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter a valid email
                </span>
              )}
              {validator.email && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter email
                </span>
              )}
            </div>
            {/* <FieldContainer
          label="Personal Address"
          value={perAddress}
          required={false}
          onChange={(e) => setPerAddress(e.target.value)}
        /> */}

            <div className="form-group col-6">
              <label className="form-label">
                Vendor Type <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={
                  !typeLoading &&
                  typeData.data?.map((option) => ({
                    value: option._id,
                    label: option.type_name,
                  }))
                }
                required={true}
                value={{
                  value: typeId,
                  label:
                    (!typeLoading &&
                      typeData.data?.find((role) => role._id == typeId)
                        ?.type_name) ||
                    "",
                }}
                onChange={(e) => {
                  setTypeId(e.value);
                  if (e.value) {
                    setValidator((prev) => ({ ...prev, typeId: false }));
                  }
                }}
              />
              <IconButton
                onClick={handleAddVendorTypeClick}
                variant="contained"
                color="primary"
                aria-label="Add Vendor Type.."
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handleInfoClick}
                variant="contained"
                color="primary"
                aria-label="Vendor Type Info.."
              >
                <RemoveRedEyeIcon />
              </IconButton>
              {validator.typeId && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please select vendor type
                </span>
              )}
            </div>

            <div className="form-group col-6">
              <label className="form-label">
                Platform <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={platformData?.data?.map((option) => ({
                  value: option._id,
                  label: option.platform_name,
                }))}
                required={true}
                value={{
                  value: platformId,
                  label:
                    platformData?.data?.find((role) => role._id == platformId)
                      ?.platform_name || "",
                }}
                onChange={(e) => {
                  setPlatformId(e.value);
                  if (e.value) {
                    setValidator((prev) => ({ ...prev, platformId: false }));
                  }
                }}
              ></Select>

              <IconButton
                onClick={handleAddPlatformClick}
                variant="contained"
                color="primary"
                aria-label="Add Platform.."
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handlePlatformInfoClick}
                variant="contained"
                color="primary"
                aria-label="Platform Info.."
              >
                <RemoveRedEyeIcon />
              </IconButton>
              {validator.platformId && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please select platform
                </span>
              )}
            </div>

            <div className="form-group col-6">
              <label className="form-label">
                Payment Method <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={payData?.map((option) => ({
                  value: option._id,
                  label: option.payMethod_name,
                }))}
                required={true}
                value={{
                  value: payId,
                  label:
                    payData?.find((role) => role._id == payId)
                      ?.payMethod_name || "",
                }}
                onChange={(e) => {
                  setPayId(e.value);
                  // setShowBankName(e.value === "specific_payment_method_id"); // Set condition for showing bank name

                  if (e.value) {
                    setValidator((prev) => ({ ...prev, payId: false }));
                  }
                }}
              ></Select>

              <IconButton
                onClick={handleAddPaymentMethodClick}
                variant="contained"
                color="primary"
                aria-label="Add Payment Method.."
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handlePaymentMethodInfoClick}
                variant="contained"
                color="primary"
                aria-label="Payment Method Info.."
              >
                <RemoveRedEyeIcon />
              </IconButton>
              {validator.payId && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please select payment method
                </span>
              )}
            </div>

            {bankRows.map((row, i) => (
              <>
                {payId == "666856874366007df1dfacde" && (
                  <>
                    <div className="form-group col-6">
                      <label className="form-label">
                        Bank Name
                        {/* <sup style={{ color: "red" }}>*</sup> */}
                      </label>
                      <Select
                        options={bankName?.map((option) => ({
                          value: option._id,
                          label: option.bank_name,
                        }))}
                        required={true}
                        value={{
                          value: bankNameId,
                          label:
                            bankName?.find((role) => role._id == bankNameId)
                              ?.bank_name || "",
                        }}
                        onChange={(e) => {
                          setBankNameId(e.value);
                          if (e.value) {
                            setValidator((prev) => ({
                              ...prev,
                              bankNameId: false,
                            }));
                          }
                        }}
                      ></Select>

                      <IconButton
                        onClick={handleAddBankNameClick}
                        variant="contained"
                        color="primary"
                        aria-label="Add Bank Detail.."
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleBankNameInfoClick}
                        variant="contained"
                        color="primary"
                        aria-label="Bank Detail Info.."
                      >
                        <RemoveRedEyeIcon />
                      </IconButton>
                    </div>
                    <div className="form-group col-6">
                      <label className="form-label">Account Type</label>
                      <Select
                        options={["Savings", "Current"].map((option) => ({
                          label: option,
                          value: option,
                        }))}
                        required={true}
                        value={{
                          value: bankRows[i].account_type,
                          label: bankRows[i].account_type,
                        }}
                        onChange={(e) => {
                          handleAccountTypeChange(e, i);
                        }}
                      />
                    </div>
                    <FieldContainer
                      label="Account Number "
                      type="number"
                      maxLength={20}
                      max={20}
                      required={false}
                      value={bankRows[i].account_number}
                      onChange={(e) => handleAccountNoChange(e, i)}
                    />
                    <FieldContainer
                      required={false}
                      label="IFSC "
                      value={bankRows[i].ifcs}
                      onChange={(e) => handleIFSCChange(e, i)}
                    />
                  </>
                )}
                {payId == "666856754366007df1dfacd2" && (
                  <FieldContainer
                    required={false}
                    label="UPI ID "
                    value={bankRows[i].upi_id}
                    onChange={(e) => handleUPIidChange(e, i)}
                  />
                )}

                {(payId == "66681c3c4366007df1df1481" ||
                  payId == "666856624366007df1dfacc8") && (
                  <FieldContainer
                    label={"Registered Mobile Number"}
                    value={bankRows[i].registered_number}
                    required={false}
                    type="number"
                    onChange={(e) => handleRegisteredMobileChange(e, i)}
                  />
                )}
                {i > 0 && (
                  <IconButton
                    onClick={handleRemoveBankInfoRow(i)}
                    variant="contained"
                    color="error"
                  >
                    <RemoveCircleTwoToneIcon />
                  </IconButton>
                )}
              </>
            ))}
            <div className="row">
              <IconButton
                onClick={handleAddBankInfoRow}
                variant="contained"
                color="primary"
              >
                <AddCircleTwoToneIcon />
              </IconButton>
              {/* {bankRows.length > 1 && (
            <IconButton
              onClick={handleRemoveBankInfoRow}
              variant="contained"
              color="primary"
            >
              <RemoveCircleTwoToneIcon />
            </IconButton>
          )} */}
            </div>

            <div className="form-group col-6">
              <label className="form-label">
                Pay Cycle <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={cycleData?.map((option) => ({
                  value: option._id,
                  label: option.cycle_name,
                }))}
                required={true}
                value={{
                  value: cycleId,
                  label:
                    cycleData?.find((role) => role._id === cycleId)
                      ?.cycle_name || "",
                }}
                onChange={(e) => {
                  setCycleId(e.value);
                  if (e.value) {
                    setValidator((prev) => ({ ...prev, cycleId: false }));
                  }
                }}
              ></Select>
              <IconButton
                onClick={handleAddPayCycleClick}
                variant="contained"
                color="primary"
                aria-label="Add Pay Cycle.."
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handlePayCycleInfoClick}
                variant="contained"
                color="primary"
                aria-label="Pay Cycle Info.."
              >
                <RemoveRedEyeIcon />
              </IconButton>
              {validator.cycleId && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please select pay cycle
                </span>
              )}
            </div>

            <FieldContainer
              label="PAN"
              value={pan}
              cols={12}
              required={false}
              onChange={handlePanChange}
            />
            <div className="col-6 flex-row gap-2">
              <FieldContainer
                type="file"
                label="PAN Image"
                fieldGrid={panImage ? 10 : ""}
                required={false}
                onChange={(e) => setPanImage(e.target.files[0])}
              />

              {panImage && !_id && (
                <img
                  className="mt-4"
                  src={URL.createObjectURL(panImage)}
                  alt="pan"
                  style={{ width: "50px", height: "50px" }}
                />
              )}
              {panImage && _id && (
                <img
                  className="mt-4"
                  src={panImage}
                  alt="pan"
                  style={{ width: "50px", height: "50px" }}
                />
              )}
            </div>

            <div className="form-group col-6">
              <label className="form-label">GST Applicable</label>
              <Select
                options={gstOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                required={true}
                value={{
                  value: gstApplicable,
                  label:
                    gstOptions.find((role) => role.value === gstApplicable)
                      ?.label || "",
                }}
                onChange={(e) => {
                  setGstApplicable(e.value);
                }}
              ></Select>
            </div>

            {gstApplicable == "Yes" && (
              <>
                {" "}
                <FieldContainer
                  label="GST"
                  value={gst}
                  required={gstApplicable == "Yes" ? true : false}
                  onChange={(e) => setGst(e.target.value.toUpperCase())}
                />
                <div className="col-6 flex-row gap-2">
                  <FieldContainer
                    type="file"
                    label="GST Image"
                    fieldGrid={gstImage ? 10 : ""}
                    required={false}
                    onChange={(e) => setGstImage(e.target.files[0])}
                  />
                  {gstImage && !_id && (
                    <img
                      className="mt-4"
                      src={URL.createObjectURL(gstImage)}
                      alt="gst"
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}{" "}
                  {gstImage && _id && (
                    <img
                      className="mt-4"
                      src={gstImage}
                      alt="gst"
                      style={{ width: "100px", height: "100px" }}
                    />
                  )}
                </div>
              </>
            )}

            <div className="card-header">Personal Details</div>
            <div className="card-body row">
              <FieldContainer
                label="Home Address"
                value={homeAddress}
                required={false}
                onChange={(e) => setHomeAddress(e.target.value)}
              />
              <div className="form-group col-6">
                <label className="form-label">
                  Country Code
                  {/* <sup style={{ color: "red" }}>*</sup> */}
                </label>
                <Autocomplete
                  id="country-select-demo"
                  sx={{ width: 300 }}
                  options={countries}
                  required={true}
                  value={countries?.find(
                    (option) => option.phone === countryCode || null
                  )}
                  onChange={(e, val) => {
                    setCountryCode(val ? val.phone : null);
                    if (val ? val.phone : null) {
                      setValidator((prev) => ({ ...prev, countryCode: false }));
                    }
                  }}
                  autoHighlight
                  getOptionLabel={(option) =>
                    `+${option.phone} ${option.country_name}`
                  }
                  // getOptionLabel={(option) => option.phone}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      <img
                        loading="lazy"
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 1,
                          objectFit: "cover",
                          marginRight: 1,
                        }}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                      />
                      {option?.country_name} ({option?.code}) +{option?.phone}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      // value={countries?.find((option) => option.phone == countryCode)}
                      {...params}
                      // label="Choose a country"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
                {/* {validator.countryCode && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    Please select country code
                  </span>
                )} */}
              </div>
              {countryCode === "91" ? (
                <div className=" row">
                  <div className="form-group col-6">
                    <label className="form-label">Home State</label>
                    <IndianStatesMui
                      selectedState={homeState}
                      onChange={(option) =>
                        setHomeState(option ? option : null)
                      }
                    />
                  </div>
                  <div className="form-group col-6">
                    <label className="form-label">Home City</label>
                    <IndianCitiesMui
                      selectedState={homeState}
                      selectedCity={homeCity}
                      onChange={(option) => setHomeCity(option ? option : null)}
                    />
                  </div>
                </div>
              ) : (
                <FieldContainer
                  label="Country"
                  value={otherCountry}
                  required={false}
                  onChange={(e) => setOtherCountry(e.target.value)}
                />
              )}
              <FieldContainer
                label="PinCode"
                value={homePincode}
                maxLength={6}
                required={false}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) {
                    setHomePincode(value);
                  }
                }}
                // setHomePincode(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sameAsPrevious}
                    onChange={(e) => handleCheckboxChange(e)}
                    name="checked"
                    color="primary"
                  />
                }
                label="Same as Home Address"
              />
            </div>

            <div className="card-header">Company Details</div>
            <div className="card-body row">
              <FieldContainer
                label="Company Name"
                value={compName}
                required={false}
                onChange={(e) => setCompName(e.target.value)}
              />

              <FieldContainer
                label="Company Address"
                value={compAddress}
                required={false}
                onChange={(e) => setCompAddress(e.target.value)}
              />

              <FieldContainer
                label="Company City"
                value={compCity}
                required={false}
                onChange={(e) => setCompCity(e.target.value)}
              />

              <FieldContainer
                label="Company Pincode"
                value={compPin}
                required={false}
                maxLength={6}
                onChange={(e) => {
                  if (isNaN(e.target.value)) return;
                  setCompPin(e.target.value);
                }}
              />
              {/* <FieldContainer
                label="Company State"
                value={compState}
                required={false}
                onChange={(e) => setCompState(e.target.value)}
              /> */}
              <div className="form-group col-6 mt-3">
                <label htmlFor="">Company State</label>
                <IndianStatesMui
                  selectedState={compState}
                  onChange={(option) => setCompState(option ? option : null)}
                />
              </div>

              <FieldContainer
                label="Threshold Limit"
                value={limit}
                type="number"
                required={false}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>
            {whatsappLink?.map((link, index) => (
              <>
                <div className="col-6">
                  <FieldContainer
                    key={index}
                    fieldGrid={12}
                    label={`Whatsapp Link ${index + 1}`}
                    value={link.link}
                    required={true}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                  />
                </div>
                <div className="col-md-4 p0 mb16">
                  <FieldContainer
                    key={index.remark}
                    label={`Group Purpose`}
                    fieldGrid={12}
                    value={link.remark}
                    required={false}
                    onChange={(e) => handleRemarkChange(index, e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb16">
                  <div className="form-group m0">
                    <label className="form-label">Type</label>
                    <div className="input-group inputAddGroup">
                      <Select
                        className="w-100"
                        options={whatsappLinkType?.data?.map((option) => ({
                          label: option.link_type,
                          value: option._id,
                        }))}
                        required={true}
                        value={{
                          value: link.type,
                          label:
                            whatsappLinkType?.data?.find(
                              (role) => role._id === link.type
                            )?.link_type || "",
                        }}
                        onChange={(e) => {
                          let updatedLinks = [...whatsappLink];
                          updatedLinks[index].type = e.value;
                          setWhatsappLink(updatedLinks);
                        }}
                      />
                      {index == 0 && (
                        <>
                          {" "}
                          <IconButton
                            onClick={handleAddWhatsappGroupLinkTypeClick}
                            variant="contained"
                            color="primary"
                            aria-label="Add Pay Cycle.."
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            onClick={handleWhatsappGroupLinkTypeInfoClick}
                            variant="contained"
                            color="primary"
                            aria-label="Pay Cycle Info.."
                          >
                            <RemoveRedEyeIcon />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </div>
                </div>{" "}
                <div className="row">
                  <div className="col-12">
                    <div className="addBankRow">
                      <Button onClick={removeLink(index)}>
                        <IconButton variant="contained" color="error">
                          <RemoveCircleTwoToneIcon />
                        </IconButton>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="row thm_form"></div>
              </>
            ))}
          </div>
          <div className="row">
            <div className="col-12">
              <div className="addBankRow">
                <Button onClick={addLink}>
                  <IconButton variant="contained" color="primary">
                    <AddCircleTwoToneIcon />
                  </IconButton>
                  Add Whatsapp Link
                </Button>
              </div>
            </div>
          </div>

          {docDetails?.map((link, index) => (
            <>
              <div className="col-6">
                <FieldContainer
                  key={index}
                  fieldGrid={6}
                  label={`Document Name`}
                  value={link.docName}
                  // required={true}
                  onChange={(e) => handleDocNameChange(index, e.target.value)}
                />
              </div>
              <div className="col-md-4 p0 mb16">
                <FieldContainer
                  key={index.docNumber}
                  label={`Document Nubmer`}
                  fieldGrid={6}
                  value={link.docNumber}
                  // required={false}
                  onChange={(e) => handleDocNumberChange(index, e.target.value)}
                />
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="addBankRow">
                    <Button onClick={removedocLink(index)}>
                      <IconButton variant="contained" color="error">
                        <RemoveCircleTwoToneIcon />
                      </IconButton>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="row thm_form"></div>
            </>
          ))}
          <div className="row">
            <div className="col-12">
              <div className="addBankRow">
                <Button onClick={addDocDetails}>
                  <IconButton variant="contained" color="primary">
                    <AddCircleTwoToneIcon />
                  </IconButton>
                  Add Document
                </Button>
              </div>
            </div>
          </div>
          <div className="row thm_form"></div>
        </div>
        <div className="card-footer">
          <Stack direction="row" spacing={2}>
            <Button
              className="btn cmnbtn btn-primary"
              onClick={handleSubmit}
              variant="contained"
              disabled={isFormSubmitting}
            >
              {isFormSubmitting ? "Submitting..." : _id ? "Update" : "Submit"}
            </Button>
          </Stack>
        </div>
      </div>
      <AddVendorModal />
      {isVendorModalOpen && <VendorTypeInfoModal />}
    </>
  );
};

export default VendorMaster;
