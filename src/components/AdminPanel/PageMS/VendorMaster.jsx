import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router";
import Select from "react-select";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


const VendorMaster = () => {
  const {
    data: countryCodeData,
    error: countryCodeError,
    isLoading: countryCodeLoading,
  }= useGetCountryCodeQuery();

  const countries = countryCodeData?.data;
  const { _id } = useParams();
  const dispatch = useDispatch();
  const isVendorModalOpen = useSelector(
    (state) => state.vendorMaster.showVendorInfoModal
  );

  const { toastAlert, toastError } = useGlobalContext();
  const [vendorName, setVendorName] = useState("");
  const [countryCode, setCountryCode] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [mobile, setMobile] = useState("");
  const [altMobile, setAltMobile] = useState("");
  const [email, setEmail] = useState("");
  const [perAddress, setPerAddress] = useState("");
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
  const [homeState, setHomeState] = useState("");
  const [typeId, setTypeId] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [payId, setPayId] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [gstApplicable, setGstApplicable] = useState("No");
  const [vendorCategory, setVendorCategory] = useState("Theme Page");
  const [whatsappLink, setWhatsappLink] = useState([]);
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

  const {
    isLoading: typeLoading,
    error: typeError,
    data: typeData,
  } = useGetAllVendorTypeQuery();

  const {
    isLoading: platformLoading,
    error: platformError,
    data: platformData,
  } = useGetPmsPlatformQuery();

  const {
    isLoading: payLoading,
    error: payError,
    data,
  } = useGetPmsPaymentMethodQuery();
  const payData = data?.data;

  const {
    isLoading: cycleLoading,
    error: cycleError,
    data: cycleQueryData,
  } = useGetPmsPayCycleQuery();

  const {
    isLoading,
    error,
    data: whatsappLinkType,
  } = useGetVendorWhatsappLinkTypeQuery();

  const cycleData = cycleQueryData?.data;

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

  const handleBankNameChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].bank_name = e.target.value;
    setBankRows(updatedRows);
  };

  const handleAccountTypeChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].account_type = e.value;
    setBankRows(updatedRows);
  };

  const handleAccountNoChange = (e, i) => {
    if(e.target.value.length > 20) return;
    const updatedRows = [...bankRows];
    updatedRows[i].account_number = e.target.value;
    setBankRows(updatedRows);
  };

  const handleIFSCChange = (e, i) => {
    if(e.target.value.length > 11) return;
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
        setPerAddress(data.personal_address);
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

      axios.get(baseUrl + `v1/bank_details_by_vendor_id/${_id}`).then((res) => {
        const data = res.data.data;
        setBankRows(data);
      });

      axios.get(baseUrl + `v1/vendor_group_link_vendor_id/${_id}`).then((res) => {
        const data = res.data?.data ;
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
      const updatedLinks = whatsappLink.filter((link, i) => i !== index);
      setWhatsappLink(updatedLinks);
    };
  };

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const handleMobileNumSet = (e, setState) => {
    const re = /^[0-9\b]+$/;
    if (
      e.target.value === "" ||
      (re.test(e.target.value) && e.target.value.length <= 10)
    ) {
      setState(e.target.value);
    }
  };

  const handleEmailSet = (e, setState) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setState(e.target.value);
    if (re.test(e.target.value) || e.target.value === "") {
      return setEmailIsInvalid(false);
    }
    return setEmailIsInvalid(true);
  };

  const handlePanChange = (e) => {
    if(e.target.value.length > 13) return;
    const inputValue = e.target.value.toUpperCase();
    // Validate PAN format
    // const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    // if (!panRegex.test(inputValue)) {
    //   toastError('Please enter a valid PAN number');
    // } else{
    setPan(inputValue);

    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vendorName) {
      toastError("Please enter vendor name");
      return;
    } else if (!countryCode) {
      toastError("Please enter country code");
      return;
    } else if (!mobile) {
      toastError("Please enter mobile number");
      return;
    } else if (!email) {
      toastError("Please enter email");
      return;
    } else if (!typeId) {
      toastError("Please select vendor type");
      return;
    } else if (!platformId) {
      toastError("Please select platform");
      return;
    } else if (!payId) {
      toastError("Please select payment method");
      return;
    } else if (!cycleId) {
      toastError("Please select pay cycle");
      return;
    }
    const formData = new FormData();
    formData.append("vendor_name", vendorName);
    formData.append("country_code", countryCode);
    formData.append("mobile", mobile);
    formData.append("alternate_mobile", altMobile);
    formData.append("email", email);
    formData.append("personal_address", perAddress);
    formData.append("vendor_type", typeId);
    formData.append("vendor_platform", platformId);
    formData.append("payment_method", payId);
    formData.append("pay_cycle", cycleId);
    formData.append("pan_no", pan);
    formData.append("pan_image", panImage);
    formData.append("gst_no", gst);
    formData.append("gst_image", gstImage);
    formData.append("company_name", compName);
    formData.append("company_address", compAddress);
    formData.append("company_city", compCity);
    formData.append("company_pincode", compPin);
    formData.append("company_state", compState);
    formData.append("threshold_limit", limit);
    formData.append("home_address", homeAddress);
    formData.append("home_city", homeCity);
    formData.append("home_state", homeState);
    formData.append("created_by", userID);
    formData.append("vendor_category", vendorCategory);
    formData.append("bank_details", JSON.stringify(bankRows));
    formData.append("vendorLinks", JSON.stringify(whatsappLink));

    if (!_id) {
      axios.post(baseUrl + "v1/vendor", formData).then(() => {
        setIsFormSubmitted(true);
        toastAlert("Submitted");
      });
    } else {
      axios.put(baseUrl + `v1/vendor/${_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(() => {
        toastAlert("Updated");
        setIsFormSubmitted(true);

      }).catch((err) => {
        console.log(err);
        toastError(err.message);
      });

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

  if (isFormSubmitted) {
    return <Navigate to="/admin/pms-vendor-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle={_id ? "Edit Vendor Master" : "Add Vendor Master"}
        title={_id ? "Edit Vendor Master" : "Add Vendor Master"}
        handleSubmit={handleSubmit}
        
      >
        <FieldContainer
          label="Vendor Name "
          value={vendorName}
          astric={true}
          required={true}
          onChange={(e) => setVendorName(e.target.value)}
        />

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
        </div>

        {/* <FieldContainer
          label="Country Code *"
          value={countryCode}
          required={true}
          type="number"
          onChange={(e) => setCountryCode(e.target.value)}
        /> */}
        <div className="form-group col-6">
          <label className="form-label">
            Country Code <sup style={{ color: "red" }}>*</sup>
          </label>
          <Autocomplete
            id="country-select-demo"
            sx={{ width: 300 }}
            options={countries}
            required={true}
            value={countries?.find((option) => option.phone == countryCode)}
            onChange={(e, val) => {
              setCountryCode(val ? val.phone : null);
            }}
            autoHighlight
            getOptionLabel={(option) => option.phone}
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
        </div>

        <FieldContainer
          label="Mobile"
          value={mobile}
          astric
          required={true}
          onChange={(e) => handleMobileNumSet(e, setMobile)}
        />

        <FieldContainer
          label="Alternate Mobile"
          value={altMobile}
          required={false}
          onChange={(e) => handleMobileNumSet(e, setAltMobile)}
        />

        <FieldContainer
          label="Email"
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

        <FieldContainer
          label="Personal Address"
          value={perAddress}
          required={false}
          onChange={(e) => setPerAddress(e.target.value)}
        />

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
                payData?.find((role) => role._id == payId)?.payMethod_name ||
                "",
            }}
            onChange={(e) => {
              setPayId(e.value);
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
        </div>

        {bankRows.map((row, i) => (
          <>
            <FieldContainer
              label="Bank Name "
              required={false}
              value={bankRows[i].bank_name}
              onChange={(e) => handleBankNameChange(e, i)}
            />

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

            <FieldContainer
              required={false}
              label="UPI ID "
              value={bankRows[i].upi_id}
              onChange={(e) => handleUPIidChange(e, i)}
            />

            <FieldContainer
              label={"Registered Mobile Number"}
              value={bankRows[i].registered_number}
              required={false}
              type="number"
              onChange={(e) => handleRegisteredMobileChange(e, i)}
            />

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
                cycleData?.find((role) => role._id === cycleId)?.cycle_name ||
                "",
            }}
            onChange={(e) => {
              setCycleId(e.value);
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
        </div>

        <FieldContainer
          label="PAN"
          value={pan}
          required={false}
          onChange={handlePanChange}
        />
        <FieldContainer
          type="file"
          label="PAN Image"
          // value={panImage}
          required={false}
          onChange={(e) => setPanImage(e.target.files[0])}
        />

        <div className="form-group col-6">
          <label className="form-label">
            GST Applicable<sup style={{ color: "red" }}>*</sup>
          </label>
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
              astric
              value={gst}
              required={gstApplicable == "Yes" ? true : false}
              onChange={(e) => setGst(e.target.value.toUpperCase())}
            />
            <FieldContainer
              type="file"
              label="GST Image"
              // value={gstImage}
              required={false}
              onChange={(e) => setGstImage(e.target.files[0])}
            />
          </>
        )}

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
          onChange={(e) =>{if(isNaN(e.target.value))return; setCompPin(e.target.value)}}
        />

        <FieldContainer
          label="Company State"
          value={compState}
          required={false}
          onChange={(e) => setCompState(e.target.value)}
        />

        <FieldContainer
          label="Threshold Limit"
          value={limit}
          type="number"
          required={false}
          onChange={(e) => setLimit(e.target.value)}
        />

        <FieldContainer
          label="Home Address"
          value={homeAddress}
          required={false}
          onChange={(e) => setHomeAddress(e.target.value)}
        />

        <FieldContainer
          label="Home City"
          value={homeCity}
          required={false}
          onChange={(e) => setHomeCity(e.target.value)}
        />

        <FieldContainer
          label="Home State"
          value={homeState}
          required={false}
          onChange={(e) => setHomeState(e.target.value)}
        />
        {panImage && !_id && (
          <img
            src={URL.createObjectURL(panImage)}
            alt="pan"
            style={{ width: "100px", height: "100px" }}
          />
        )}
        {gstImage && !_id && (
          <img
            src={URL.createObjectURL(gstImage)}
            alt="gst"
            style={{ width: "100px", height: "100px" }}
          />
        )}

        {panImage && _id && (
          <img
            src={panImage}
            alt="pan"
            style={{ width: "100px", height: "100px" }}
          />
        )}
        {gstImage && _id && (
          <img
            src={gstImage}
            alt="gst"
            style={{ width: "100px", height: "100px" }}
          />
        )}

        {whatsappLink?.map((link, index) => (
          <>
            <FieldContainer
              key={index}
              label={`Whatsapp Link ${index + 1}`}
              value={link.link}
              required={false}
              onChange={(e) => handleLinkChange(index, e.target.value)}
            />
            <FieldContainer
              key={index.remark}
              label={`Group Purpose`}
              value={link.remark}
              required={false}
              onChange={(e) => handleRemarkChange(index, e.target.value)}
            />

            <div className="form-group col-6">
              <label className="form-label">
                Type <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                // options={["Execution", "Payment"].map((option) => ({
                //   label: option,
                //   value: option,
                // }))}
                options={whatsappLinkType?.data?.map((option) => ({
                  label: option.link_type,
                  value: option._id,
                }))}
                required={true}
                // value={{
                //   value: link.link_type,
                //   label: link._id,
                // }}
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

            {index > 0 && (
              // <Button onClick={removeLink(index)}  icon />

              <IconButton
                size="small"
                sx={{
                  display: "inline",
                }}
                onClick={removeLink(index)}
                color="secondary"
                aria-label="add an alarm"
              >
                <CloseIcon />
              </IconButton>
            )}
          </>
        ))}
        <Button onClick={addLink}>ADD Link</Button>
      </FormContainer>
      <AddVendorModal />
      {isVendorModalOpen && <VendorTypeInfoModal />}
    </>
  );
};

export default VendorMaster;
