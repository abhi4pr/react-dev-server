import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router";
import Select from "react-select";

const VendorMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [vendorName, setVendorName] = useState("");
  const [countryCode, setCountryCode] = useState("");
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
  const [typeData, setTypeData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [payData, setPayData] = useState([]);
  const [cycleData, setCycleData] = useState([]);
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [gstApplicable, setGstApplicable] = useState("No");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl + "getAllVendor").then((res) => {
      setTypeData(res.data.data);
    });

    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformData(res.data.data);
    });

    axios.get(baseUrl + "getAllPay").then((res) => {
      setPayData(res.data.data);
    });

    axios.get(baseUrl + "getAllPayCycle").then((res) => {
      setCycleData(res.data.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

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
    formData.append("vendorMast_name", vendorName);
    formData.append("country_code", countryCode);
    formData.append("mobile", mobile);
    formData.append("alternate_mobile", altMobile);
    formData.append("email", email);
    formData.append("personal_address", perAddress);
    formData.append("type_id", typeId);
    formData.append("platform_id", platformId);
    formData.append("payMethod_id", payId);
    formData.append("cycle_id", cycleId);
    formData.append("pan_no", pan);
    formData.append("upload_pan_image", panImage);
    formData.append("gst_no", gst);
    formData.append("upload_gst_image", gstImage);
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

    axios.post(baseUrl + "addVendorMast", formData).then(() => {
      setIsFormSubmitted(true);
      toastAlert("Submitted");
    });
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
        mainTitle="Vendor Master"
        title="Vendor Master"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Vendor Name *"
          value={vendorName}
          required={true}
          onChange={(e) => setVendorName(e.target.value)}
        />

        <FieldContainer
          label="Country Code *"
          value={countryCode}
          required={true}
          onChange={(e) => setCountryCode(e.target.value)}
        />

        <FieldContainer
          label="Mobile *"
          value={mobile}
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
          label="Email *"
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
            options={typeData.map((option) => ({
              value: option._id,
              label: option.type_name,
            }))}
            required={true}
            value={{
              value: typeId,
              label:
                typeData.find((role) => role._id === typeId)?.type_name || "",
            }}
            onChange={(e) => {
              setTypeId(e.value);
            }}
          ></Select>
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Platform <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformData.map((option) => ({
              value: option._id,
              label: option.platform_name,
            }))}
            required={true}
            value={{
              value: platformId,
              label:
                platformData.find((role) => role._id === platformId)
                  ?.platform_name || "",
            }}
            onChange={(e) => {
              setPlatformId(e.value);
            }}
          ></Select>
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Payment Method <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={payData.map((option) => ({
              value: option._id,
              label: option.payMethod_name,
            }))}
            required={true}
            value={{
              value: payId,
              label:
                payData.find((role) => role._id === payId)?.payMethod_name ||
                "",
            }}
            onChange={(e) => {
              setPayId(e.value);
            }}
          ></Select>
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Pay Cycle <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={cycleData.map((option) => ({
              value: option._id,
              label: option.cycle_name,
            }))}
            required={true}
            value={{
              value: cycleId,
              label:
                cycleData.find((role) => role._id === cycleId)?.cycle_name ||
                "",
            }}
            onChange={(e) => {
              setCycleId(e.value);
            }}
          ></Select>
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
              value={gst}
              required={false}
              onChange={(e) => setGst(e.target.value.toUpperCase())}
            />
            <FieldContainer
              type="file"
              label="Gst Image"
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
          onChange={(e) => setCompPin(e.target.value)}
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
        {panImage && (
          <img
            src={URL.createObjectURL(panImage)}
            alt="pan"
            style={{ width: "100px", height: "100px" }}
          />
        )}
        {gstImage && (
          <img
            src={URL.createObjectURL(gstImage)}
            alt="gst"
            style={{ width: "100px", height: "100px" }}
          />
        )}
      </FormContainer>
    </>
  );
};

export default VendorMaster;
