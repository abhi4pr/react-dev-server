import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";

import { baseUrl } from "../../../utils/config";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import FieldContainer from "../FieldContainer";
import IndianBankList from "../../../assets/js/IndianBankList";
import IndianStates from "../../ReusableComponents/IndianStates";
import { useLocation } from "react-router-dom";
import titleimg from "/bg-img.png";
const WFHDBankUpdate = () => {
  const { user_id } = useParams();
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [cityData, setCityData] = useState([]);

  //--------------------Bank Info State Start
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [panNo, setPanNo] = useState("");
  const [isValidPAN, setIsValidPAN] = useState(true);
  //--------------------Bank Info State End

  //--------------------Address Info State Start
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [upi, setUpi] = useState("");
  //--------------------Address Info State End

  useEffect(() => {
    axios.get(baseUrl + "get_all_cities").then((res) => {
      setCityData(res.data.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}` + `get_single_user/${user_id}`).then((res) => {
      const fetchedData = res.data;
      const {
        bank_name,
        account_no,
        ifsc_code,
        permanent_city,
        permanent_address,
        permanent_state,
        beneficiary,
        permanent_pin_code,
        pan_no,
        upi_Id,
      } = fetchedData;

      setBankName(bank_name);
      setBankAccountNumber(account_no);
      setIFSC(ifsc_code);
      setCity(permanent_city);
      setAddress(permanent_address);
      setState(permanent_state);
      setBeneficiary(beneficiary);
      setPincode(permanent_pin_code);
      setPanNo(pan_no);
      setUpi(upi_Id);
    });
  }, []);

  const handleSubmit = async () => {
    if (!bankName || bankName == "") {
      return toastError("Bank Name is required");
    } else if (!bankAccountNumber || bankAccountNumber == "") {
      return toastError("Account Number is required");
    } else if (!IFSC || IFSC == "") {
      return toastError("IFSC is required");
    } else if (!city || city == "") {
      return toastError("City is required");
    } else if (!address || address == "") {
      return toastError("Address is required");
    } else if (!state || state == "") {
      return toastError("State is required");
    } else if (!pincode || pincode == "") {
      return toastError("Pincode is required");
    }
    try {
      const response = axios.put(baseUrl + "update_user", {
        user_id: user_id,
        bank_name: bankName,
        account_no: bankAccountNumber,
        ifsc_code: IFSC,
        beneficiary: beneficiary,
        permanent_city: city,
        permanent_address: address,
        permanent_state: state,
        permanent_pin_code: Number(pincode),
        pan_no: panNo,
        upi_Id: upi,
      });

      navigate("/admin/wfhd-overview");
      toastAlert("Details Updated");
    } catch (error) {
      console.error("Error submitting documents", error);
    } finally {
      console.log("");
    }
  };
  const handlePANChange = (e) => {
    const inputPAN = e.target.value.toUpperCase();
    setPanNo(inputPAN.slice(0, 10));

    // Validate PAN when input changes
    const isValid = validatePAN(inputPAN);
    setIsValidPAN(isValid);
  };
  // Function to validate PAN
  const validatePAN = (pan) => {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panPattern.test(pan);
  };
  const location = useLocation();
  const activeLink = location.pathname;
  return (
    <>
      <div className={`documentarea`}>
        <div className="document_box master-card-css">
          <div className="form-heading">
            <img className="img-bg" src={titleimg} alt="" width={160} />
            <div className="form_heading_title">
              <h1>Bank Details & Address</h1>
              <div className="pack">
                <i class="bi bi-house"></i>{" "}
                {activeLink.slice(1).charAt(0).toUpperCase() +
                  activeLink.slice(2)}
              </div>
            </div>
            {/* <Link to={`/admin/kra/${userId}`}>
            <button type="button" className="btn btn-outline-primary btn-sm">
              KRA
            </button>
          </Link> */}
          </div>
          <div className="card body-padding">
            <div className="row mt-5">
              <div className="form-group col-3">
                <label className="form-label">
                  Bank Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={IndianBankList}
                  onChange={(selectedOption) => {
                    setBankName(selectedOption ? selectedOption.value : null);
                  }}
                  isClearable
                  isSearchable
                  value={
                    bankName
                      ? IndianBankList.find((bank) => bank.value === bankName)
                      : null
                  }
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  required
                />
              </div>
              <FieldContainer
                label="Bank Account Number"
                astric={true}
                fieldGrid={3}
                maxLength={17}
                value={bankAccountNumber}
                // onChange={(e) => setBankAccountNumber(e.target.value)}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const onlyNumbers = /^[0-9]+$/;

                  if (onlyNumbers.test(inputValue) && inputValue.length <= 17) {
                    setBankAccountNumber(inputValue);
                  } else if (inputValue === "") {
                    setBankAccountNumber("");
                  }
                }}
              />
              <FieldContainer
                astric={true}
                label="IFSC"
                fieldGrid={3}
                value={IFSC}
                onChange={(e) => {
                  const inputValue = e.target.value.toUpperCase();
                  setIFSC(inputValue.slice(0, 11));
                }}
              />

              <div className="col-3">
                <FieldContainer
                  label="PAN No"
                  fieldGrid={3}
                  value={panNo}
                  onChange={handlePANChange}
                />
                {!isValidPAN && (
                  <span style={{ color: "red" }}>PAN is not valid</span>
                )}
              </div>
              {/* <FieldContainer
              label="Beneficiary"
              value={beneficiary}
              fieldGrid={3}
              onChange={(e) => setBeneficiary(e.target.value)}
            /> */}
              <FieldContainer
                label="Address"
                fieldGrid={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="form-group col-3">
                <IndianStates
                  newValue={state}
                  onChange={(option) => setState(option ? option.value : null)}
                />
              </div>
              <div className="form-group col-3">
                <label className="form-label">City</label>
                {/* <Select
                options={cityData.map((city) => ({
                  value: city.city_name,
                  label: city.city_name,
                }))}
                onChange={setCity}
                required={true}
                value={{
                  value: city,
                  label:
                  cityData.find((gotCity) => gotCity.city_name == city)
                  ?.city_name || "",
                }}
                placeholder="Select a city..."
                isClearable
              /> */}
                <Select
                  options={cityData?.map((city) => ({
                    value: city.city_name,
                    label: city.city_name,
                  }))}
                  onChange={(e) => setCity(e ? e.value : "")}
                  required={true}
                  value={{
                    value: city,
                    label:
                      cityData.find((gotCity) => gotCity.city_name == city)
                        ?.city_name || "",
                  }}
                  placeholder="Select a city..."
                  isClearable
                />
              </div>

              <FieldContainer
                label="Current Pincode"
                type="number"
                astric={true}
                fieldGrid={3}
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) {
                    setPincode(value);
                  }
                }}
              />
              <FieldContainer
                label="Upi Id"
                type="text"
                astric={false}
                fieldGrid={3}
                maxLength={6}
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WFHDBankUpdate;
