import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router";
import { useParams } from "react-router-dom";
import Select from "react-select";

const VendorEdit = () => {
  const [cycleName, setCycleName] = useState("");
  const [description, setDescription] = useState("");

  const { toastAlert } = useGlobalContext();
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

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const { _id } = useParams();
  const getData = () => {
    axios.get(baseUrl + "vendorAllData").then((res) => {
      console.log(_id, "id");
      console.log(
        res.data.tmsVendorkMastList.filter((e) => e._id === _id),
        "data"
      );
      const data = res.data.tmsVendorkMastList.filter((e) => e._id === _id);
      setVendorName(data[0].vendorMast_name);
      setCountryCode(data[0].country_code);
      setMobile(data[0].mobile);
      setAltMobile(data[0].alternate_mobile);
      setEmail(data[0].email);
      setPerAddress(data[0].personal_address);
      setPan(data[0].pan);
      setPanImage(data[0].upload_pan_image);
      setGstImage(data[0].upload_gst_image);
      setGst(data[0].gst);
      setCompName(data[0].comapny_name);
      setCompAddress(data[0].company_address);
      setCompCity(data[0].company_city);
      setCompPin(data[0].company_pincode);
      setCompState(data[0].company_state);
      setLimit(data[0].threshold_limit);
      setHomeAddress(data[0].home_address);
      setHomeCity(data[0].home_city);
      setHomeState(data[0].home_state);
      setTypeId(data[0].type_id);
      setPlatformId(data[0].platform_id);
      setPayId(data[0].payMethod_id);
      setCycleId(data[0].cycle_id);
      // setTypeData(res.data.tmsVendorTypeList)
      // setPlatformData(res.data.tmsVendorPlatformList)
      // setPayData(res.data.tmsVendorPayList)
      // setCycleData(res.data.tmsVendorCycleList)
    });

    axios.get(baseUrl + "getAllVendor").then((res) => {
      setTypeData(res.data.data);
    });

    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformData(res.data.data);
      console.log(platformId, "platformId");
      console.log(
        res.data.data.filter((e) => e._id),
        "platform"
      );
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

  const handleSubmit = (e) => {
    const formData = new FormData();
    formData.append("vendorMast_name", vendorName);
    formData.append("country_code", countryCode);
    formData.append("mobile", mobile);
    formData.append("alternate_mobile", altMobile);
    formData.append("email", email);
    formData.append("personal_address", perAddress);
    formData.append("pan", pan);
    formData.append("upload_pan_image", panImage);
    formData.append("upload_gst_image", gstImage);
    formData.append("gst", gst);
    formData.append("comapny_name", compName);
    formData.append("company_address", compAddress);
    formData.append("company_city", compCity);
    formData.append("company_pincode", compPin);
    formData.append("company_state", compState);
    formData.append("threshold_limit", limit);
    formData.append("home_address", homeAddress);
    formData.append("home_city", homeCity);
    formData.append("home_state", homeState);
    formData.append("type_id", typeId);
    formData.append("platform_id", platformId);
    formData.append("payMethod_id", payId);
    formData.append("cycle_id", cycleId);
    formData.append("created_by", userID);
    
    e.preventDefault();
    axios
      .put(baseUrl + `updateVendorMast/${_id}`, formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert("Submitted");
        setCycleName("");
        setDescription("");
        getData();
      });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/pms-vendor-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Vendor Edit"
        title="Vendor Edit"
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
          onChange={(e) => setMobile(e.target.value)}
        />

        <FieldContainer
          label="Alternate Mobile"
          value={altMobile}
          required={false}
          onChange={(e) => setAltMobile(e.target.value)}
        />

        <FieldContainer
          label="Email *"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />

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
            options={typeData?.map((option) => ({
              value: option._id,
              label: option.type_name,
            }))}
            value={{
              value: typeId,
              label:
                typeData?.find((role) => role._id === typeId)?.type_name || "",
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
          onChange={(e) => setPan(e.target.value)}
        />
        <FieldContainer
          type="file"
          label="PAN Image"
          // value={panImage.files}
          // value={panImage}
          required={false}
          onChange={(e) => setPanImage(e.target.files[0])}
        />

        <FieldContainer
          label="GST"
          value={gst}
          required={false}
          onChange={(e) => setGst(e.target.value)}
        />
        <FieldContainer
          type="file"
          label="Gst Image"
          // value={gstImage}
          required={false}
          onChange={(e) => setGstImage(e.target.files[0])}
        />

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
      </FormContainer>
    </>
  );
};

export default VendorEdit;
