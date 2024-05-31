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
import { Controller, useForm } from "react-hook-form";

const VendorMaster = () => {
  const {
    register,
    formState: { errors },
    handleSubmit: handleFormSubmit,
    control,
    watch,
  } = useForm({
    mode: "onChange",
  });
  const {
    data: countryCodeData,
    error: countryCodeError,
    isLoading: countryCodeLoading,
  } = useGetCountryCodeQuery();

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

      axios
        .get(baseUrl + `v1/vendor_group_link_vendor_id/${_id}`)
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
    if (e.target.value.length > 13) return;
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
      axios
        .put(baseUrl + `v1/vendor/${_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          toastAlert("Updated");
          setIsFormSubmitted(true);
        })
        .catch((err) => {
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
          onChange={(e) => {
            if (isNaN(e.target.value)) return;
            setCompPin(e.target.value);
          }}
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

      <FormControl component={"form"} onSubmit={handleSubmit}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <TextField
              label="Vendor Name"
              variant="outlined"
              {...register("vendor_name", {
                required: "Vendor Name is required",
                maxLength: {
                  value: 50,
                  message: "Vendor Name should not exceed 50 characters",
                },
                minLength: {
                  value: 3,
                  message: "Vendor Name should have atleast 3 characters",
                },
              })}
              error={errors.vendor_name ? true : false}
              helperText={errors.vendor_name ? errors.vendor_name.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="vendor_category"
              control={control}
              defaultValue=""
              rules={{ required: "Vendor Category is required" }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={["Theme Page", "influencer"]}
                  getOptionLabel={(option) => option}
                  value={value}
                  onChange={(_, data) => onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vendor Category"
                      required
                      error={!!errors.vendor_category}
                      helperText={
                        errors.vendor_category
                          ? errors.vendor_category.message
                          : ""
                      }
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              id="country-select-demo"
              label="Country Code"
              sx={{ width: 300 }}
              options={countries}
              required={true}
              value={countries?.find((option) => option.phone == countryCode)}
              // onChange={(e, val) => {
              //   setCountryCode(val ? val.phone : null);
              // }}
              {...register("country_code", {
                required: "Country Code is required",
              })}
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
              helperText={
                errors.country_code ? errors.country_code.message : ""
              }
              error={errors.country_code ? true : false}
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
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Mobile"
              variant="outlined"
              {...register("mobile", {
                required: "Mobile is required",
                maxLength: {
                  value: 10,
                  message: "Mobile should not exceed 10 characters",
                },
                minLength: {
                  value: 10,
                  message: "Mobile should have atleast 10 characters",
                },
              })}
              error={errors.mobile ? true : false}
              helperText={errors.mobile ? errors.mobile.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Alternate Mobile"
              variant="outlined"
              {...register("alternate_mobile", {
                maxLength: {
                  value: 10,
                  message: "Alternate Mobile should not exceed 10 characters",
                },
                minLength: {
                  value: 10,
                  message: "Alternate Mobile should have atleast 10 characters",
                },
              })}
              error={errors.alternate_mobile ? true : false}
              helperText={
                errors.alternate_mobile ? errors.alternate_mobile.message : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              variant="outlined"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
              error={errors.email ? true : false}
              helperText={errors.email ? errors.email.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Personal Address"
              variant="outlined"
              {...register("personal_address")}
              error={errors.personal_address ? true : false}
              helperText={
                errors.personal_address ? errors.personal_address.message : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="typeId"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={!typeLoading ? typeData.data : []}
                  getOptionLabel={(option) => option.type_name}
                  getOptionSelected={(option, value) => option._id === value}
                  value={
                    !typeLoading
                      ? typeData.data.find((role) => role._id === value)
                      : null
                  }
                  onChange={(_, data) => onChange(data?._id)}
                  renderInput={(params) => (
                    <TextField label="Vendor Type" {...params} required />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="platformId"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={platformData?.data}
                  getOptionLabel={(option) => option.platform_name}
                  getOptionSelected={(option, value) => option._id === value}
                  value={platformData?.data.find((role) => role._id === value)}
                  onChange={(_, data) => onChange(data?._id)}
                  renderInput={(params) => (
                    <TextField label="Platform" {...params} required />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="payId"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={payData}
                  getOptionLabel={(option) => option.payMethod_name}
                  getOptionSelected={(option, value) => option._id === value}
                  value={payData.find((role) => role._id === value)}
                  onChange={(_, data) => onChange(data?._id)}
                  renderInput={(params) => (
                    <TextField label="Payment Method" {...params} required />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Bank Name"
              variant="outlined"
              {...register("bank_name", {
                maxLength: {
                  value: 50,
                  message: "Bank Name should not exceed 50 characters",
                },
              })}
              error={errors.bank_name ? true : false}
              helperText={errors.bank_name ? errors.bank_name.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={["Savings", "Current"].map((option) => ({
                label: option,
                value: option,
              }))}
              required={true}
              {...register("account_type", {
                required: "Account Type is required",
              })}
              renderInput={(params) => (
                <TextField {...params} label="Account Type" required />
              )}
              error={errors.account_type ? true : false}
              helperText={
                errors.account_type ? errors.account_type.message : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Account Number"
              variant="outlined"
              {...register("account_no", {
                maxLength: {
                  value: 20,
                  message: "Account Number should not exceed 20 characters",
                },
              })}
              error={errors.account_no ? true : false}
              helperText={errors.account_no ? errors.account_no.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="IFSC"
              variant="outlined"
              {...register("ifsc", {
                maxLength: {
                  value: 11,
                  message: "IFSC should not exceed 11 characters",
                },
              })}
              error={errors.ifsc ? true : false}
              helperText={errors.ifsc ? errors.ifsc.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="UPI ID"
              variant="outlined"
              {...register("upi_id", {
                maxLength: {
                  value: 50,
                  message: "UPI ID should not exceed 50 characters",
                },
              })}
              error={errors.upi_id ? true : false}
              helperText={errors.upi_id ? errors.upi_id.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Registered Mobile Number"
              variant="outlined"
              {...register("registered_number", {
                maxLength: {
                  value: 10,
                  message:
                    "Registered Mobile Number should not exceed 10 characters",
                },
              })}
              error={errors.registered_number ? true : false}
              helperText={
                errors.registered_number ? errors.registered_number.message : ""
              }
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="cycleId"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={cycleData}
                  getOptionLabel={(option) => option.cycle_name}
                  getOptionSelected={(option, value) => option._id === value}
                  value={cycleData.find((role) => role._id === value)}
                  onChange={(_, data) => onChange(data?._id)}
                  renderInput={(params) => (
                    <TextField label="Pay Cycle" {...params} required />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="PAN"
              variant="outlined"
              {...register("pan", {
                maxLength: {
                  value: 13,
                  message: "PAN should not exceed 13 characters",
                },
              })}
              error={errors.pan ? true : false}
              helperText={errors.pan ? errors.pan.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="PAN Image"
              variant="outlined"
              {...register("pan_image")}
              error={errors.pan_image ? true : false}
              helperText={errors.pan_image ? errors.pan_image.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="gst"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Autocomplete
                  options={["Yes", "No"]}
                  getOptionLabel={(option) => option}
                  value={value}
                  onChange={(_, data) => onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="GST Applicable"
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              )}
            />
          </Grid>
          {watch("gst") == "Yes" && (
            <>
              <Grid item xs={6}>
                <TextField
                  label="GST"
                  variant="outlined"
                  {...register("gst", {
                    maxLength: {
                      value: 15,
                      message: "GST should not exceed 15 characters",
                    },
                  })}
                  error={errors.gst ? true : false}
                  helperText={errors.gst ? errors.gst.message : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="gst-image-upload"
                  type="file"
                  {...register("gst_image")}
                />
                <label htmlFor="gst-image-upload">
                  <Button variant="contained" component="span">
                    Upload GST Image
                  </Button>
                </label>
                {errors.gst_image && <p>{errors.gst_image.message}</p>}
              </Grid>
            </>
          )}

          <Grid item xs={6}>
            <TextField
              label="Company Name"
              variant="outlined"
              {...register("company_name", {
                maxLength: {
                  value: 50,
                  message: "Company Name should not exceed 50 characters",
                },
              })}
              error={errors.company_name ? true : false}
              helperText={
                errors.company_name ? errors.company_name.message : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Company Address"
              variant="outlined"
              {...register("company_address")}
              error={errors.company_address ? true : false}
              helperText={
                errors.company_address ? errors.company_address.message : ""
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Company City"
              variant="outlined"
              {...register("company_city")}
              error={errors.company_city ? true : false}
              helperText={
                errors.company_city ? errors.company_city.message : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Company Pincode"
              variant="outlined"
              {...register("company_pincode", {
                maxLength: {
                  value: 6,
                  message: "Company Pincode should not exceed 6 characters",
                },
              })}
              error={errors.company_pincode ? true : false}
              helperText={
                errors.company_pincode ? errors.company_pincode.message : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Company State"
              variant="outlined"
              {...register("company_state")}
              error={errors.company_state ? true : false}
              helperText={
                errors.company_state ? errors.company_state.message : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Threshold Limit"
              variant="outlined"
              {...register("threshold_limit")}
              error={errors.threshold_limit ? true : false}
              helperText={
                errors.threshold_limit ? errors.threshold_limit.message : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Home Address"
              variant="outlined"
              {...register("home_address")}
              error={errors.home_address ? true : false}
              helperText={
                errors.home_address ? errors.home_address.message : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Home City"
              variant="outlined"
              {...register("home_city")}
              error={errors.home_city ? true : false}
              helperText={errors.home_city ? errors.home_city.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Home State"
              variant="outlined"
              {...register("home_state")}
              error={errors.home_state ? true : false}
              helperText={errors.home_state ? errors.home_state.message : ""}
            />
          </Grid>

          {whatsappLink?.map((link, index) => (
            <Stack direction={'row'} spacing={2} key={index}>
              <FormControl fullWidth>
                <Controller
                  name={`whatsappLink[${index}].link`}
                  control={control}
                  defaultValue={link.link}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Whatsapp Link ${index + 1}`}
                      required={false}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <Controller
                  name={`whatsappLink[${index}].remark`}
                  control={control}
                  defaultValue={link.remark}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Group Purpose`}
                      required={false}
                    />
                  )}
                />
              </FormControl>

              <Grid item xs={6}>
                <Controller
                  name={`whatsappLink[${index}].type`}
                  control={control}
                  defaultValue={link.type}
                  render={({ field }) => (
                    <Autocomplete
                      options={whatsappLinkType?.data}
                      getOptionLabel={(option) => option.link_type}
                      getOptionSelected={(option, value) =>
                        option._id === value
                      }
                      value={whatsappLinkType?.data.find(
                        (role) => role._id === link.type
                      )}
                      onChange={(_, data) => field.onChange(data?._id)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Type"
                          required
                          error={!!errors.whatsappLink?.[index]?.type}
                          helperText={
                            errors.whatsappLink?.[index]?.type?.message
                          }
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {index === 0 && (
                <div>
                  <IconButton
                    onClick={handleAddWhatsappGroupLinkTypeClick}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleWhatsappGroupLinkTypeInfoClick}
                    color="primary"
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>
                </div>
              )}

              {index > 0 && (
                <IconButton
                  size="small"
                  onClick={() => removeLink(index)}
                  color="secondary"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Stack>
          ))}
          <Button onClick={addLink}>ADD Link</Button>

          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </FormControl>
    </>
  );
};

export default VendorMaster;
