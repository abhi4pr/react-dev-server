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
  useGetAllVendorQuery,
  useGetPmsPayCycleQuery,
  useGetPmsPaymentMethodQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";
import InfoIcon from "@mui/icons-material/Info";
import VendorTypeInfoModal from "./VendorTypeInfoModal";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import { useParams } from "react-router";

const countries = [
  { code: "AD", label: "Andorra", phone: "376" },
  {
    code: "AE",
    label: "United Arab Emirates",
    phone: "971",
  },
  { code: "AF", label: "Afghanistan", phone: "93" },
  {
    code: "AG",
    label: "Antigua and Barbuda",
    phone: "1-268",
  },
  { code: "AI", label: "Anguilla", phone: "1-264" },
  { code: "AL", label: "Albania", phone: "355" },
  { code: "AM", label: "Armenia", phone: "374" },
  { code: "AO", label: "Angola", phone: "244" },
  { code: "AQ", label: "Antarctica", phone: "672" },
  { code: "AR", label: "Argentina", phone: "54" },
  { code: "AS", label: "American Samoa", phone: "1-684" },
  { code: "AT", label: "Austria", phone: "43" },
  {
    code: "AU",
    label: "Australia",
    phone: "61",
    suggested: true,
  },
  { code: "AW", label: "Aruba", phone: "297" },
  { code: "AX", label: "Alland Islands", phone: "358" },
  { code: "AZ", label: "Azerbaijan", phone: "994" },
  {
    code: "BA",
    label: "Bosnia and Herzegovina",
    phone: "387",
  },
  { code: "BB", label: "Barbados", phone: "1-246" },
  { code: "BD", label: "Bangladesh", phone: "880" },
  { code: "BE", label: "Belgium", phone: "32" },
  { code: "BF", label: "Burkina Faso", phone: "226" },
  { code: "BG", label: "Bulgaria", phone: "359" },
  { code: "BH", label: "Bahrain", phone: "973" },
  { code: "BI", label: "Burundi", phone: "257" },
  { code: "BJ", label: "Benin", phone: "229" },
  { code: "BL", label: "Saint Barthelemy", phone: "590" },
  { code: "BM", label: "Bermuda", phone: "1-441" },
  { code: "BN", label: "Brunei Darussalam", phone: "673" },
  { code: "BO", label: "Bolivia", phone: "591" },
  { code: "BR", label: "Brazil", phone: "55" },
  { code: "BS", label: "Bahamas", phone: "1-242" },
  { code: "BT", label: "Bhutan", phone: "975" },
  { code: "BV", label: "Bouvet Island", phone: "47" },
  { code: "BW", label: "Botswana", phone: "267" },
  { code: "BY", label: "Belarus", phone: "375" },
  { code: "BZ", label: "Belize", phone: "501" },
  {
    code: "CA",
    label: "Canada",
    phone: "1",
    suggested: true,
  },
  {
    code: "CC",
    label: "Cocos (Keeling) Islands",
    phone: "61",
  },
  {
    code: "CD",
    label: "Congo, Democratic Republic of the",
    phone: "243",
  },
  {
    code: "CF",
    label: "Central African Republic",
    phone: "236",
  },
  {
    code: "CG",
    label: "Congo, Republic of the",
    phone: "242",
  },
  { code: "CH", label: "Switzerland", phone: "41" },
  { code: "CI", label: "Cote d'Ivoire", phone: "225" },
  { code: "CK", label: "Cook Islands", phone: "682" },
  { code: "CL", label: "Chile", phone: "56" },
  { code: "CM", label: "Cameroon", phone: "237" },
  { code: "CN", label: "China", phone: "86" },
  { code: "CO", label: "Colombia", phone: "57" },
  { code: "CR", label: "Costa Rica", phone: "506" },
  { code: "CU", label: "Cuba", phone: "53" },
  { code: "CV", label: "Cape Verde", phone: "238" },
  { code: "CW", label: "Curacao", phone: "599" },
  { code: "CX", label: "Christmas Island", phone: "61" },
  { code: "CY", label: "Cyprus", phone: "357" },
  { code: "CZ", label: "Czech Republic", phone: "420" },
  {
    code: "DE",
    label: "Germany",
    phone: "49",
    suggested: true,
  },
  { code: "DJ", label: "Djibouti", phone: "253" },
  { code: "DK", label: "Denmark", phone: "45" },
  { code: "DM", label: "Dominica", phone: "1-767" },
  {
    code: "DO",
    label: "Dominican Republic",
    phone: "1-809",
  },
  { code: "DZ", label: "Algeria", phone: "213" },
  { code: "EC", label: "Ecuador", phone: "593" },
  { code: "EE", label: "Estonia", phone: "372" },
  { code: "EG", label: "Egypt", phone: "20" },
  { code: "EH", label: "Western Sahara", phone: "212" },
  { code: "ER", label: "Eritrea", phone: "291" },
  { code: "ES", label: "Spain", phone: "34" },
  { code: "ET", label: "Ethiopia", phone: "251" },
  { code: "FI", label: "Finland", phone: "358" },
  { code: "FJ", label: "Fiji", phone: "679" },
  {
    code: "FK",
    label: "Falkland Islands (Malvinas)",
    phone: "500",
  },
  {
    code: "FM",
    label: "Micronesia, Federated States of",
    phone: "691",
  },
  { code: "FO", label: "Faroe Islands", phone: "298" },
  {
    code: "FR",
    label: "France",
    phone: "33",
    suggested: true,
  },
  { code: "GA", label: "Gabon", phone: "241" },
  { code: "GB", label: "United Kingdom", phone: "44" },
  { code: "GD", label: "Grenada", phone: "1-473" },
  { code: "GE", label: "Georgia", phone: "995" },
  { code: "GF", label: "French Guiana", phone: "594" },
  { code: "GG", label: "Guernsey", phone: "44" },
  { code: "GH", label: "Ghana", phone: "233" },
  { code: "GI", label: "Gibraltar", phone: "350" },
  { code: "GL", label: "Greenland", phone: "299" },
  { code: "GM", label: "Gambia", phone: "220" },
  { code: "GN", label: "Guinea", phone: "224" },
  { code: "GP", label: "Guadeloupe", phone: "590" },
  { code: "GQ", label: "Equatorial Guinea", phone: "240" },
  { code: "GR", label: "Greece", phone: "30" },
  {
    code: "GS",
    label: "South Georgia and the South Sandwich Islands",
    phone: "500",
  },
  { code: "GT", label: "Guatemala", phone: "502" },
  { code: "GU", label: "Guam", phone: "1-671" },
  { code: "GW", label: "Guinea-Bissau", phone: "245" },
  { code: "GY", label: "Guyana", phone: "592" },
  { code: "HK", label: "Hong Kong", phone: "852" },
  {
    code: "HM",
    label: "Heard Island and McDonald Islands",
    phone: "672",
  },
  { code: "HN", label: "Honduras", phone: "504" },
  { code: "HR", label: "Croatia", phone: "385" },
  { code: "HT", label: "Haiti", phone: "509" },
  { code: "HU", label: "Hungary", phone: "36" },
  { code: "ID", label: "Indonesia", phone: "62" },
  { code: "IE", label: "Ireland", phone: "353" },
  { code: "IL", label: "Israel", phone: "972" },
  { code: "IM", label: "Isle of Man", phone: "44" },
  { code: "IN", label: "India", phone: "91" },
  {
    code: "IO",
    label: "British Indian Ocean Territory",
    phone: "246",
  },
  { code: "IQ", label: "Iraq", phone: "964" },
  {
    code: "IR",
    label: "Iran, Islamic Republic of",
    phone: "98",
  },
  { code: "IS", label: "Iceland", phone: "354" },
  { code: "IT", label: "Italy", phone: "39" },
  { code: "JE", label: "Jersey", phone: "44" },
  { code: "JM", label: "Jamaica", phone: "1-876" },
  { code: "JO", label: "Jordan", phone: "962" },
  {
    code: "JP",
    label: "Japan",
    phone: "81",
    suggested: true,
  },
  { code: "KE", label: "Kenya", phone: "254" },
  { code: "KG", label: "Kyrgyzstan", phone: "996" },
  { code: "KH", label: "Cambodia", phone: "855" },
  { code: "KI", label: "Kiribati", phone: "686" },
  { code: "KM", label: "Comoros", phone: "269" },
  {
    code: "KN",
    label: "Saint Kitts and Nevis",
    phone: "1-869",
  },
  {
    code: "KP",
    label: "Korea, Democratic People's Republic of",
    phone: "850",
  },
  { code: "KR", label: "Korea, Republic of", phone: "82" },
  { code: "KW", label: "Kuwait", phone: "965" },
  { code: "KY", label: "Cayman Islands", phone: "1-345" },
  { code: "KZ", label: "Kazakhstan", phone: "7" },
  {
    code: "LA",
    label: "Lao People's Democratic Republic",
    phone: "856",
  },
  { code: "LB", label: "Lebanon", phone: "961" },
  { code: "LC", label: "Saint Lucia", phone: "1-758" },
  { code: "LI", label: "Liechtenstein", phone: "423" },
  { code: "LK", label: "Sri Lanka", phone: "94" },
  { code: "LR", label: "Liberia", phone: "231" },
  { code: "LS", label: "Lesotho", phone: "266" },
  { code: "LT", label: "Lithuania", phone: "370" },
  { code: "LU", label: "Luxembourg", phone: "352" },
  { code: "LV", label: "Latvia", phone: "371" },
  { code: "LY", label: "Libya", phone: "218" },
  { code: "MA", label: "Morocco", phone: "212" },
  { code: "MC", label: "Monaco", phone: "377" },
  {
    code: "MD",
    label: "Moldova, Republic of",
    phone: "373",
  },
  { code: "ME", label: "Montenegro", phone: "382" },
  {
    code: "MF",
    label: "Saint Martin (French part)",
    phone: "590",
  },
  { code: "MG", label: "Madagascar", phone: "261" },
  { code: "MH", label: "Marshall Islands", phone: "692" },
  {
    code: "MK",
    label: "Macedonia, the Former Yugoslav Republic of",
    phone: "389",
  },
  { code: "ML", label: "Mali", phone: "223" },
  { code: "MM", label: "Myanmar", phone: "95" },
  { code: "MN", label: "Mongolia", phone: "976" },
  { code: "MO", label: "Macao", phone: "853" },
  {
    code: "MP",
    label: "Northern Mariana Islands",
    phone: "1-670",
  },
  { code: "MQ", label: "Martinique", phone: "596" },
  { code: "MR", label: "Mauritania", phone: "222" },
  { code: "MS", label: "Montserrat", phone: "1-664" },
  { code: "MT", label: "Malta", phone: "356" },
  { code: "MU", label: "Mauritius", phone: "230" },
  { code: "MV", label: "Maldives", phone: "960" },
  { code: "MW", label: "Malawi", phone: "265" },
  { code: "MX", label: "Mexico", phone: "52" },
  { code: "MY", label: "Malaysia", phone: "60" },
  { code: "MZ", label: "Mozambique", phone: "258" },
  { code: "NA", label: "Namibia", phone: "264" },
  { code: "NC", label: "New Caledonia", phone: "687" },
  { code: "NE", label: "Niger", phone: "227" },
  { code: "NF", label: "Norfolk Island", phone: "672" },
  { code: "NG", label: "Nigeria", phone: "234" },
  { code: "NI", label: "Nicaragua", phone: "505" },
  { code: "NL", label: "Netherlands", phone: "31" },
  { code: "NO", label: "Norway", phone: "47" },
  { code: "NP", label: "Nepal", phone: "977" },
  { code: "NR", label: "Nauru", phone: "674" },
  { code: "NU", label: "Niue", phone: "683" },
  { code: "NZ", label: "New Zealand", phone: "64" },
  { code: "OM", label: "Oman", phone: "968" },
  { code: "PA", label: "Panama", phone: "507" },
  { code: "PE", label: "Peru", phone: "51" },
  { code: "PF", label: "French Polynesia", phone: "689" },
  { code: "PG", label: "Papua New Guinea", phone: "675" },
  { code: "PH", label: "Philippines", phone: "63" },
  { code: "PK", label: "Pakistan", phone: "92" },
  { code: "PL", label: "Poland", phone: "48" },
  {
    code: "PM",
    label: "Saint Pierre and Miquelon",
    phone: "508",
  },
  { code: "PN", label: "Pitcairn", phone: "870" },
  { code: "PR", label: "Puerto Rico", phone: "1" },
  {
    code: "PS",
    label: "Palestine, State of",
    phone: "970",
  },
  { code: "PT", label: "Portugal", phone: "351" },
  { code: "PW", label: "Palau", phone: "680" },
  { code: "PY", label: "Paraguay", phone: "595" },
  { code: "QA", label: "Qatar", phone: "974" },
  { code: "RE", label: "Reunion", phone: "262" },
  { code: "RO", label: "Romania", phone: "40" },
  { code: "RS", label: "Serbia", phone: "381" },
  { code: "RU", label: "Russian Federation", phone: "7" },
  { code: "RW", label: "Rwanda", phone: "250" },
  { code: "SA", label: "Saudi Arabia", phone: "966" },
  { code: "SB", label: "Solomon Islands", phone: "677" },
  { code: "SC", label: "Seychelles", phone: "248" },
  { code: "SD", label: "Sudan", phone: "249" },
  { code: "SE", label: "Sweden", phone: "46" },
  { code: "SG", label: "Singapore", phone: "65" },
  { code: "SH", label: "Saint Helena", phone: "290" },
  { code: "SI", label: "Slovenia", phone: "386" },
  {
    code: "SJ",
    label: "Svalbard and Jan Mayen",
    phone: "47",
  },
  { code: "SK", label: "Slovakia", phone: "421" },
  { code: "SL", label: "Sierra Leone", phone: "232" },
  { code: "SM", label: "San Marino", phone: "378" },
  { code: "SN", label: "Senegal", phone: "221" },
  { code: "SO", label: "Somalia", phone: "252" },
  { code: "SR", label: "Suriname", phone: "597" },
  { code: "SS", label: "South Sudan", phone: "211" },
  {
    code: "ST",
    label: "Sao Tome and Principe",
    phone: "239",
  },
  { code: "SV", label: "El Salvador", phone: "503" },
  {
    code: "SX",
    label: "Sint Maarten (Dutch part)",
    phone: "1-721",
  },
  {
    code: "SY",
    label: "Syrian Arab Republic",
    phone: "963",
  },
  { code: "SZ", label: "Swaziland", phone: "268" },
  {
    code: "TC",
    label: "Turks and Caicos Islands",
    phone: "1-649",
  },
  { code: "TD", label: "Chad", phone: "235" },
  {
    code: "TF",
    label: "French Southern Territories",
    phone: "262",
  },
  { code: "TG", label: "Togo", phone: "228" },
  { code: "TH", label: "Thailand", phone: "66" },
  { code: "TJ", label: "Tajikistan", phone: "992" },
  { code: "TK", label: "Tokelau", phone: "690" },
  { code: "TL", label: "Timor-Leste", phone: "670" },
  { code: "TM", label: "Turkmenistan", phone: "993" },
  { code: "TN", label: "Tunisia", phone: "216" },
  { code: "TO", label: "Tonga", phone: "676" },
  { code: "TR", label: "Turkey", phone: "90" },
  {
    code: "TT",
    label: "Trinidad and Tobago",
    phone: "1-868",
  },
  { code: "TV", label: "Tuvalu", phone: "688" },
  {
    code: "TW",
    label: "Taiwan",
    phone: "886",
  },
  {
    code: "TZ",
    label: "United Republic of Tanzania",
    phone: "255",
  },
  { code: "UA", label: "Ukraine", phone: "380" },
  { code: "UG", label: "Uganda", phone: "256" },
  {
    code: "US",
    label: "United States",
    phone: "1",
    suggested: true,
  },
  { code: "UY", label: "Uruguay", phone: "598" },
  { code: "UZ", label: "Uzbekistan", phone: "998" },
  {
    code: "VA",
    label: "Holy See (Vatican City State)",
    phone: "379",
  },
  {
    code: "VC",
    label: "Saint Vincent and the Grenadines",
    phone: "1-784",
  },
  { code: "VE", label: "Venezuela", phone: "58" },
  {
    code: "VG",
    label: "British Virgin Islands",
    phone: "1-284",
  },
  {
    code: "VI",
    label: "US Virgin Islands",
    phone: "1-340",
  },
  { code: "VN", label: "Vietnam", phone: "84" },
  { code: "VU", label: "Vanuatu", phone: "678" },
  { code: "WF", label: "Wallis and Futuna", phone: "681" },
  { code: "WS", label: "Samoa", phone: "685" },
  { code: "XK", label: "Kosovo", phone: "383" },
  { code: "YE", label: "Yemen", phone: "967" },
  { code: "YT", label: "Mayotte", phone: "262" },
  { code: "ZA", label: "South Africa", phone: "27" },
  { code: "ZM", label: "Zambia", phone: "260" },
  { code: "ZW", label: "Zimbabwe", phone: "263" },
];

const VendorMaster = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const isVendorModalOpen = useSelector(
    (state) => state.vendorMaster.showVendorInfoModal
  );

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
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [gstApplicable, setGstApplicable] = useState("No");
  const [vendorCategory, setVendorCategory] = useState("Theme Page");
  const [whatsappLink, setWhatsappLink] = useState([]);
  const [bankRows, setBankRows] = useState([
    {
      bankName: "",
      accountType: "",
      accountNo: "",
      ifscCode: "",
      UPIid: "",
      registeredMobileNo: "",
    },
  ]);

  const {
    isLoading: typeLoading,
    error: typeError,
    data: typeData,
  } = useGetAllVendorQuery();

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
    updatedRows[i].bankName = e.target.value;
    setBankRows(updatedRows);
  };

  const handleAccountTypeChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].accountType = e.value;
    setBankRows(updatedRows);
  };

  const handleAccountNoChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].accountNo = e.target.value;
    setBankRows(updatedRows);
  };

  const handleIFSCChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].ifscCode = e.target.value;
    setBankRows(updatedRows);
  };

  const handleUPIidChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].UPIid = e.target.value;
    setBankRows(updatedRows);
  };

  const handleRegisteredMobileChange = (e, i) => {
    if (e.target.value.length > 10) {
      return;
    }
    const updatedRows = [...bankRows];
    updatedRows[i].registeredMobileNo = e.target.value;
    setBankRows(updatedRows);
  };

  const handleLinkChange = (index, newValue) => {
    let link = [...whatsappLink];
    link[index].link = newValue;
    setWhatsappLink(link);
  };

  if (_id) {
    axios.get(baseUrl + "vendorAllData").then((res) => {
      const data = res.data.tmsVendorkMastList.filter((e) => e._id === _id);
      setVendorName(data[0].vendorMast_name);
      setCountryCode(data[0].country_code);
      setMobile(data[0].mobile);
      setAltMobile(data[0].alternate_mobile);
      setEmail(data[0].email);
      setPerAddress(data[0].personal_address);
      setPan(data[0].pan_no);
      setPanImage(data[0]?.upload_pan_image);
      setGstImage(data[0].upload_gst_image);
      setGst(data[0].gst_no);
      setCompName(data[0].company_name);
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
      // setPanImglink(data[0].upload_pan_image);
      // setGstImglink(data[0].upload_gst_image);
      // setBankName(data[0].bank_name);
      // setAccountType(data[0].account_type);
      // setAccountNo(data[0].account_no);
      // setIfscCode(data[0].ifsc_code);
      // setUpiId(data[0].upi_id);
      setWhatsappLink(data[0].whatsapp_link);
      setVendorCategory(data[0].vendor_category);
    });
  }

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
        bankName: "",
        accountType: "",
        accountNo: "",
        ifscCode: "",
        UPIid: "",
        registeredMobileNo: "",
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
    // return console.log(bankRows);
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
    formData.append("vendor_category", vendorCategory);

    // sumit will give the update for bank and whatsapp link
    // formData.append("whatsapp_link", JSON.stringify(whatsappLink));

    // if (bankName) {
    //   formData.append("bank_name", bankName);
    //   formData.append("account_type", accountType);
    //   formData.append("account_no", accountNo);
    //   formData.append("ifsc_code", ifscCode);
    // }

    // if (upiId) {
    //   formData.append("upi_id", upiId);
    // }
    if (!_id) {
      axios.post(baseUrl + "addVendorMast", formData).then(() => {
        setIsFormSubmitted(true);
        toastAlert("Submitted");
      });
    } else {
      axios.put(baseUrl + `updateVendorMast/${_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
          label="Vendor Name *"
          value={vendorName}
          required={true}
          onChange={(e) => setVendorName(e.target.value)}
        />

        <div className="form-group col-6">
          <label className="form-label">
            Vendor Category <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={["Theme Page", "Influancer"].map((option) => ({
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
            // className=" col-6"
            onChange={(e, val) => {
              setCountryCode(val.phone);
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
                {option.label} ({option.code}) +{option.phone}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
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
                  typeData.data?.find((role) => role._id === typeId)
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
            <InfoIcon />
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
                platformData?.data?.find((role) => role._id === platformId)
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
            <InfoIcon />
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
                payData?.find((role) => role._id === payId)?.payMethod_name ||
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
            <InfoIcon />
          </IconButton>
        </div>

        {bankRows.map((row, i) => (
          <>
            <FieldContainer
              label="Bank Name "
              value={bankRows[i].bankName}
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
                  value: bankRows[i].accountType,
                  label: bankRows[i].accountType,
                }}
                onChange={(e) => {
                  handleAccountTypeChange(e, i);
                }}
              />
            </div>

            <FieldContainer
              label="Account Number "
              value={bankRows[i].accountNo}
              onChange={(e) => handleAccountNoChange(e, i)}
            />

            <FieldContainer
              label="IFSC "
              value={bankRows[i].ifscCode}
              onChange={(e) => handleIFSCChange(e, i)}
            />

            <FieldContainer
              label="UPI ID "
              value={bankRows[i].UPIid}
              onChange={(e) => handleUPIidChange(e, i)}
            />

            <FieldContainer
              label={"Registered Mobile Number"}
              value={bankRows[i].registeredMobileNo}
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
            <InfoIcon />
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
              label={`Remark`}
              value={link.remark}
              required={false}
              onChange={(e) => handleRemarkChange(index, e.target.value)}
            />

            <div className="form-group col-6">
              <label className="form-label">
                Type <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={["Execution", "Payment"].map((option) => ({
                  label: option,
                  value: option,
                }))}
                required={true}
                value={{
                  value: link.type,
                  label: link.type,
                }}
                onChange={(e) => {
                  let updatedLinks = [...whatsappLink];
                  updatedLinks[index].type = e.value;
                  setWhatsappLink(updatedLinks);
                }}
              ></Select>
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
