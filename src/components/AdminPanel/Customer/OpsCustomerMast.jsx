import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router";
import Select from "react-select";

const OpsCustomerMaster = () => {
  const {usersDataContext} = useGlobalContext()
  const { toastAlert, toastError  } = useGlobalContext();
  // console.log(userContextData , 'ok------------')
  // console.log(userContextData  , '------------context lalit')
  const [customerName, setCustomerName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [ownershipName, setOwnershipName] = useState("");
  const [industryName, setIndustryName] = useState("");
  const [accountOwnerName, setAccountOwnerName] = useState("");
  const [parentAccountName, setParentAccountName] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [primaryContactNo, setPrimaryContactNo] = useState("");
  const [alternativeNo, setAlternativeNo] = useState("");
  const [email, setEmail] = useState("");
  const [companySize, setCompanySize] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [website, setWebsite] = useState("");
  const [turnover, setTurnover] = useState("");
  const [establishmentYear, setEstablishmentYear] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [howManyOffices, setHowManyOffices] = useState("");
  const [companyPan, setCompanyPan] = useState("");
  const [panImage, setPanImage] = useState("");
  const [gstImage, setGstImage] = useState("");
  const [companyGst, setCompanyGst] = useState("");
  const [connectedOffice, setConnectedOffice] = useState("");
  const [connectedBillingStreet, setConnectedBillingStreet] = useState("");
  const [connectedBillingCity, setConnectedBillingCity] = useState("");
  const [connectedBillingState, setConnectedBillingState] = useState("");
  const [connectedBillingCountry, setConnectedBillingCountry] = useState("");
  const [headOffice, setHeadOffice] = useState("");
  const [headBillingStreet, setHeadBillingStreet] = useState("");
  const [headBillingCity, setHeadBillingCity] = useState("");
  const [headBillingState, setHeadBillingState] = useState("");
  const [headBillingCountry, setHeadBillingCountry] = useState("");
  const [description, setDescription] = useState("");
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [industryData,setIndustryData]=useState([]);

const [customersData, setCustomersData] = useState([]);
  const CustomerData = () => {
    axios.get(baseUrl + "get_all_customer_type") 
      .then((res) => {
        setCustomersData(res.data.data);
      });
  };

  useEffect(() => {
    CustomerData();
  }, []);

  const [accountsData, setAccountsData] = useState([]);
  const AccountData = () => {
    axios.get(baseUrl + "get_all_account_type") 
      .then((res) => {
        setAccountsData(res.data.data); 
      });
  };

  useEffect(() => {
    AccountData();
  }, []);

  const [ownershipsData, setOwnershipsData] = useState([]);
  const OwnershipData = () => {
    axios.get(baseUrl + "get_all_ownership")
      .then((res) => {
        setOwnershipsData(res.data.data);
       // setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    OwnershipData();
  }, []);

  const getIndustryInfo= ()=>{
    axios.get(baseUrl + "industry").then((res) => {
      setIndustryData(res.data.result
        )
console.log(res.data.result
  ,"ddddddd")
  
       });
  }
  useEffect(()=>{
    getIndustryInfo()
},[])


const getData = () => {
    axios.get(baseUrl + "get_all_customer_mast").then((res) => {
      setTypeData(res.data.data);
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
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    if (!panRegex.test(inputValue)) {
      toastError('Please enter a valid PAN number');
    } else{
      setCompanyPan(inputValue);

    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("customer_type_id", customerName);
    formData.append("account_type_id", accountName);
    formData.append("ownership_id", ownershipName);
    formData.append("industry_id", industryName);
    formData.append("account_owner_id", accountOwnerName);
    formData.append("parent_account_id", parentAccountName);
    formData.append("primary_contact_no", primaryContactNo);
    formData.append("alternative_no", alternativeNo);
    formData.append("company_size", companySize);
    formData.append("company_email", email);
    formData.append("website", website);
    formData.append("turn_over", turnover);
    formData.append("establishment_year", establishmentYear);
    formData.append("employees_Count", employeesCount);
    formData.append("how_many_offices", howManyOffices);
    formData.append("company_pan_no", companyPan);
    formData.append("pan_upload", panImage);
    formData.append("company_gst_no", companyGst);
    formData.append("gst_upload", gstImage);
    formData.append("connected_office", connectedOffice);
    formData.append("connected_billing_street", connectedBillingStreet);
    formData.append("connected_billing_city", connectedBillingCity);
    formData.append("connected_billing_state", connectedBillingState);
    formData.append("connected_billing_country", connectedBillingCountry);
    formData.append("head_office", headOffice);
    formData.append("head_billing_street", headBillingStreet);
    formData.append("head_billing_city", headBillingCity);
    formData.append("head_billing_state", headBillingState);
    formData.append("head_billing_country", headBillingCountry);
    formData.append("description", description);

    formData.append("created_by", userID);

    axios.post(baseUrl + "add_customer_mast", formData).then(() => {
      setIsFormSubmitted(true);
      toastAlert("Customer added successfully");
    });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/ops-customer-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Ops Customer Master"
        title="Ops Customer Master"
        handleSubmit={handleSubmit}
      >
        {/* <FieldContainer
          label="Customer Name *"
          value={customerName}
          required={true}
          onChange={(e) => setCustomerName(e.target.value)}
        /> */}
        <div className="form-group col-6">
          <label className="form-label">
            Customer Type Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={customersData.map((option) => ({
              value: option._id,
              label: option.customer_type_name,
            }))}
            value={{
              value: customerName,
              label:
              customersData?.find((cust) => cust._id === customerName)?.customer_type_name || "",
            }}
            onChange={(e) => {
              setCustomerName(e.value);
            }}
          ></Select>
        </div>

         
          <div className="form-group col-6">
          <label className="form-label">
            Account Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={accountsData.map((option) => ({
              value: option._id,
              label: option.account_type_name,
            }))}
            value={{
              value: accountName,
              label:
              accountsData?.find((acc) => acc._id === accountName)?.account_type_name || "",
            }}
            onChange={(e) => {
              setAccountName(e.value);
            }}
          ></Select>
        </div>


         <div className="form-group col-6">
          <label className="form-label">
            Ownership Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={ownershipsData.map((option) => ({
              value: option._id,
              label: option.ownership_name,
            }))}
            value={{
              value: ownershipName,
              label:
              ownershipsData?.find((own) => own._id === ownershipName)?.ownership_name || "",
            }}
            onChange={(e) => {
              setOwnershipName(e.value);
            }}
          ></Select>
        </div>


         {/* <FieldContainer
          label="Industry Name *"
          value={industryName}
          required={true}
          onChange={(e) => setIndustryName(e.target.value)}
        /> */}

         <div className="form-group col-6">
          <label className="form-label">
            Industry Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={industryData?.map((option) => ({
              value: option._id,
              label: option.name,
            }))}
            value={{
              value: industryName,
              label:
              industryData?.find((ind) => ind._id === industryName)?.name || "",
            }}
            onChange={(e) => {
              setIndustryName(e.value);
            }}
          ></Select>
        </div>


        
         <div className="form-group col-6">
          <label className="form-label">
            Account Owner Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={usersDataContext.map((option) => ({
              value: option.user_id,
              label: option.user_name,
            }))}
            value={{
              value: accountOwnerName,
              label:
              usersDataContext?.find((acc) => acc.user_id === accountOwnerName)?.user_name || "",
            }}
            onChange={(e) => {
              setAccountOwnerName(e.value);
            }}
          ></Select>
        </div>


          <FieldContainer
          label="Parent Account ID"
          value={parentAccountName}
          //required={true}
          type="number"
          onChange={(e) => setParentAccountName(e.target.value)}
        />


         <FieldContainer
          label="Company Size *"
          type="number"
          value={companySize}
          required={true}
          onChange={(e) => setCompanySize(e.target.value)}
        />


        <FieldContainer
          label="Primary Contact No. *"
          type="number"
          value={primaryContactNo}
          required={true}
          onChange={(e) => setPrimaryContactNo(e.target.value )}
        />

        <FieldContainer
          label="Alternate Mobile"
          type="number"
          value={alternativeNo}
          required={false}
          onChange={(e) => setAlternativeNo(e.target.value)}
        />

        <FieldContainer
          label="Email *"
          value={email}
          //required={true}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailIsInvalid && (
          <span style={{ color: "red", fontSize: "12px" }}>
            Please enter a valid email
          </span>
        )}

          <FieldContainer
          label="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <FieldContainer
          label="Turnover (in cr)"
          type="number"
          value={turnover}
          onChange={(e) => setTurnover(e.target.value)}
        />
        <FieldContainer
          label="Establishment Year"
          type="number"
          value={establishmentYear}
          onChange={(e) => setEstablishmentYear(e.target.value)}
        />
        <FieldContainer
          label="Employees Count"
          type="number"
          value={employeesCount}
          onChange={(e) => setEmployeesCount(e.target.value)}
        />
        
         <FieldContainer
          label="PAN"
          value={companyPan}
          required={false}
          onChange={(e) => setCompanyPan((e.target.value).toUpperCase())}
        />
        <FieldContainer
          type="file"
          label="PAN Image"
          onChange={(e) => setPanImage(e.target.files[0])}
        />

        <FieldContainer
          label="GST"
          value={companyGst}
          onChange={(e) => setCompanyGst((e.target.value).toUpperCase())}
        />
        <FieldContainer
          type="file"
          label="Gst Image"
          onChange={(e) => setGstImage(e.target.files[0])}
        />

          <FieldContainer
          label="How many offices?"
          type="number"
          value={howManyOffices}
          onChange={(e) => setHowManyOffices(e.target.value)}
        />

        <FieldContainer
        label="Connected Office"
        value={connectedOffice}
        onChange={(e) => setConnectedOffice(e.target.value)}
      />

      <FieldContainer
        label="Connected Billing Street"
        value={connectedBillingStreet}
        onChange={(e) => setConnectedBillingStreet(e.target.value)}
      />
      <FieldContainer
        label="Connected Billing City"
        value={connectedBillingCity}
        onChange={(e) => setConnectedBillingCity(e.target.value)}
      />
      <FieldContainer
        label="Connected Billing State"
        value={connectedBillingState}
        onChange={(e) => setConnectedBillingState(e.target.value)}
      />
      <FieldContainer
        label="Connected Billing Country"
        value={connectedBillingCountry}
        onChange={(e) => setConnectedBillingCountry(e.target.value)}
      />
      <FieldContainer
        label="Head Office"
        value={headOffice}
        onChange={(e) => setHeadOffice(e.target.value)}
      />
      <FieldContainer
        label="Head Billing Street"
        value={headBillingStreet}
        onChange={(e) => setHeadBillingStreet(e.target.value)}
      />
      <FieldContainer
        label="Head Billing City"
        value={headBillingCity}
        onChange={(e) => setHeadBillingCity(e.target.value)}
      />
      <FieldContainer
        label="Head Billing State"
        value={headBillingState}
        onChange={(e) => setHeadBillingState(e.target.value)}
      />
      <FieldContainer
        label="Head Billing Country"
        value={headBillingCountry}
        onChange={(e) => setHeadBillingCountry(e.target.value)}
      />
      <FieldContainer
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
     </FormContainer>
    </>
  );
};

export default OpsCustomerMaster;
