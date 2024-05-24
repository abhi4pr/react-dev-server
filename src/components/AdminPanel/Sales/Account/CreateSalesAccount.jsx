import React, { useState, useEffect } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import { useGetAllAccountTypeQuery } from "../../../Store/API/SalesAccountTypeApi";
import { useGetAllCompanyTypeQuery } from "../../../Store/API/CompanyTypeApi";
import { useGetAllBrandCategoryTypeQuery } from "../../../Store/API/BrandCategoryTypeApi";
import { useAddAccountMutation } from "../../../Store/API/SalesAccountApi";
import Modal from "react-modal";
import CreateBrandCategory from "./CreateBrandCategory";
import CreateAccountType from "./CreateAccountType";
import CreateCompanyType from "./CreateCompanyType";
import View from "./View/View";
import { ViewBrandCategoryColumns } from "./Columns/ViewBrandCategoryColumns";
import { ViewCompanyTypeColumns } from "./Columns/ViewCompanyTypeColumns";
import { ViewAccountTypeColumns } from "./Columns/ViewAccountTypeColumns";
const CreateSalesAccount = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const token = getDecodedToken();
  const loginUserId = token.id;

  const {
    data: allAccountTypes,
    error: allAccountTypesError,
    isLoading: allAccountTypesLoading,
    refetch: refetchAllAccountTypes,
  } = useGetAllAccountTypeQuery();

  const {
    data: allCompanyType,
    error: allCompanyTypeError,
    isLoading: allCompanyTypeLoading,
    refetch: refetchAllCompanyType,
  } = useGetAllCompanyTypeQuery();

  const {
    data: allBrandCatType,
    error: allBrandCatTypeError,
    isLoading: allBrandCatTypeLoading,
    refetch: refetchAllBrandCatType,
  } = useGetAllBrandCategoryTypeQuery();

  const [createSalesAccount, { isLoading, isSuccess, isError }] =
    useAddAccountMutation();

  const [accountName, setAccountName] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [website, setWebsite] = useState("");
  const [turnover, setTurnover] = useState("");
  const [officesCount, setOfficesCount] = useState("");
  const [connectedOffices, setConnectedOffices] = useState("");
  const [connectedBillingStreet, setConnectedBillingStreet] = useState("");
  const [connectedBillingCity, setConnectedBillingCity] = useState("");
  const [connectedBillingState, setConnectedBillingState] = useState("");
  const [connectedBillingCountry, setConnectedBillingCountry] = useState("");
  const [headOffice, setHeadOffice] = useState("");
  const [headBillingStreet, setHeadBillingStreet] = useState("");
  const [headBillingCity, setHeadBillingCity] = useState("");
  const [headBillingState, setHeadBillingState] = useState("");
  const [headBillingCountry, setHeadBillingCountry] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [description, setDescription] = useState("");
  const [accOwnerNameData, setAccOwnerNameData] = useState([]);
  const [modalContentType, setModalContentType] = useState(false);

  // State for POCs
  const [pocs, setPocs] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(`${baseUrl}get_all_sales_users_list`);
      setAccOwnerNameData(response.data);
    }
    getData();
  }, []);

  const handleAddPoc = () => {
    setPocs([
      ...pocs,
      {
        contact_name: "",
        contact_no: "",
        alternative_contact_no: "",
        email: "",
        department: "",
        designation: "",
        description: "",
      },
    ]);
  };

  const handlePocChange = (index, key, value) => {
    const updatedPocs = pocs.map((poc, pocIndex) =>
      pocIndex === index ? { ...poc, [key]: value } : poc
    );
    setPocs(updatedPocs);
  };

  console.log(pocs);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSalesAccount({
        account_name: accountName,
        account_type_id: selectedAccountType,
        company_type_id: selectedCompanyType,
        category_id: selectedCategory,
        account_owner_id: selectedOwner,
        website: website,
        turn_over: turnover,
        how_many_offices: officesCount,
        connected_office: connectedOffices,
        connect_billing_street: connectedBillingStreet,
        connect_billing_city: connectedBillingCity,
        connect_billing_state: connectedBillingState,
        connect_billing_country: connectedBillingCountry,
        head_office: headOffice,
        head_billing_street: headBillingStreet,
        head_billing_city: headBillingCity,
        head_billing_state: headBillingState,
        head_billing_country: headBillingCountry,
        pin_code: pinCode,
        company_email: companyEmail,
        description: description,
        created_by: loginUserId,
        account_poc: pocs, // Include POCs in the submission
      }).unwrap();

      // Reset all states
      setAccountName("");
      setSelectedAccountType(null);
      setSelectedCompanyType(null);
      setSelectedCategory(null);
      setSelectedOwner(null);
      setWebsite("");
      setTurnover("");
      setOfficesCount("");
      setConnectedOffices("");
      setConnectedBillingStreet("");
      setConnectedBillingCity("");
      setConnectedBillingState("");
      setConnectedBillingCountry("");
      setHeadOffice("");
      setHeadBillingStreet("");
      setHeadBillingCity("");
      setHeadBillingState("");
      setHeadBillingCountry("");
      setPinCode("");
      setCompanyEmail("");
      setDescription("");
      setPocs([]); // Reset POCs

      navigate("/admin/view-payment-details");
      toastAlert("Payment Details Updated");
    } catch (error) {
      toastError(error.message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toastAlert("Account created successfully!");
    } else if (isError) {
      toastError("Failed to create account.");
    }
  }, [isSuccess, isError]);

  const openModal = (contentType) => {
    setModalContentType(contentType);
  };

  const closeModal = () => {
    setModalContentType(null);
  };

  const renderModalContent = () => {
    switch (modalContentType) {
      case "brandCategory":
        return (
          <CreateBrandCategory
            loginUserId={loginUserId}
            closeModal={closeModal}
            refetchAllBrandCatType={refetchAllBrandCatType}
          />
        );
      case "accountType":
        return (
          <CreateAccountType
            loginUserId={loginUserId}
            closeModal={closeModal}
            refetchAllAccountTypes={refetchAllAccountTypes}
          />
        );
      case "companyType":
        return (
          <CreateCompanyType
            loginUserId={loginUserId}
            closeModal={closeModal}
            refetchAllCompanyType={refetchAllCompanyType}
          />
        );
      case "viewBrandCategory":
        return (
          <View
            title={"Brand Category View"}
            data={allBrandCatType}
            columns={ViewBrandCategoryColumns}
            isLoading={allBrandCatTypeLoading}
          />
        );
      case "viewCompanyType":
        return (
          <View
            title={"Company Type"}
            data={allCompanyType}
            columns={ViewCompanyTypeColumns}
            isLoading={allCompanyTypeLoading}
          />
        );
      case "viewAccountType":
        return (
          <View
            title={"Company Type"}
            data={allAccountTypes}
            columns={ViewAccountTypeColumns}
            isLoading={allAccountTypesLoading}
          />
        );
      default:
        return null;
    }
  };

  console.log(allAccountTypes);

  return (
    <div>
      <Modal
        className="salesModal"
        isOpen={modalContentType}
        onRequestClose={closeModal}
        contentLabel="modal"
        preventScroll={true}
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            height: "100vh",
          },
          content: {
            position: "absolute",
            minWidth: "max-content",
            width: "700px",
            top: "50px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            maxHeight: "650px",
          },
        }}
      >
        {renderModalContent()}
      </Modal>

      <FormContainer
        mainTitle="Accounts Master"
        title="Create"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Account Name"
          astric
          fieldGrid={4}
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Enter account name"
          required
        />

        <CustomSelect
          label="Account Type"
          dataArray={allAccountTypes}
          optionId="_id"
          optionLabel="account_type_name"
          selectedId={selectedAccountType}
          setSelectedId={setSelectedAccountType}
          required
        />
        <div className="col-md-4 mt-2 flex-row gap-2">
          <button
            type="button"
            className="btn cmn btn_sm btn btn-primary mt-4 "
            onClick={() => openModal("accountType")}
          >
            +
          </button>
          <button
            type="button"
            className="btn cmnbtn btn_sm btn-primary mt-4"
            onClick={() => openModal("viewAccountType")}
          >
            <i className="bi bi-eye" />
          </button>
        </div>

        <CustomSelect
          label="Company Type"
          dataArray={allCompanyType}
          optionId="_id"
          optionLabel="company_type_name"
          selectedId={selectedCompanyType}
          setSelectedId={setSelectedCompanyType}
          required
        />
        <div className="col-md-6 mt-2 flex-row gap-2">
          <button
            type="button"
            className="btn cmnbtn btn_sm btn-primary mt-4"
            onClick={() => openModal("companyType")}
          >
            +
          </button>
          <button
            type="button"
            className="btn cmnbtn btn_sm btn-primary mt-4"
            onClick={() => openModal("viewCompanyType")}
          >
            <i className="bi bi-eye" />
          </button>
        </div>

        <CustomSelect
          label="Category Name"
          dataArray={allBrandCatType}
          optionId="_id"
          optionLabel="brandCategory_name"
          selectedId={selectedCategory}
          setSelectedId={setSelectedCategory}
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

        <CustomSelect
          label="Account Owner Name"
          dataArray={accOwnerNameData}
          optionId="user_id"
          optionLabel="user_name"
          selectedId={selectedOwner}
          setSelectedId={setSelectedOwner}
          required
        />
        <FieldContainer
          label="Website"
          fieldGrid={4}
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Enter website"
        />
        <FieldContainer
          label="Turnover (in cr)"
          fieldGrid={4}
          value={turnover}
          onChange={(e) => setTurnover(e.target.value)}
          placeholder="Enter turnover in crores"
        />
        <FieldContainer
          label="How Many Offices"
          fieldGrid={4}
          value={officesCount}
          onChange={(e) => setOfficesCount(e.target.value)}
          placeholder="Enter number of offices"
        />
        <FieldContainer
          label="Connected Offices"
          fieldGrid={4}
          value={connectedOffices}
          onChange={(e) => setConnectedOffices(e.target.value)}
          placeholder="Enter connected offices"
        />
        <FieldContainer
          label="Connected Billing Street"
          fieldGrid={4}
          value={connectedBillingStreet}
          onChange={(e) => setConnectedBillingStreet(e.target.value)}
          placeholder="Enter connected billing street"
        />
        <FieldContainer
          label="Connected Billing City"
          fieldGrid={4}
          value={connectedBillingCity}
          onChange={(e) => setConnectedBillingCity(e.target.value)}
          placeholder="Enter connected billing city"
        />
        <FieldContainer
          label="Connected Billing State"
          fieldGrid={4}
          value={connectedBillingState}
          onChange={(e) => setConnectedBillingState(e.target.value)}
          placeholder="Enter connected billing state"
        />
        <FieldContainer
          label="Connected Billing Country"
          fieldGrid={4}
          value={connectedBillingCountry}
          onChange={(e) => setConnectedBillingCountry(e.target.value)}
          placeholder="Enter connected billing country"
        />
        <FieldContainer
          label="Head Office"
          fieldGrid={4}
          value={headOffice}
          onChange={(e) => setHeadOffice(e.target.value)}
          placeholder="Enter head office"
        />
        <FieldContainer
          label="Head Billing Street"
          fieldGrid={4}
          value={headBillingStreet}
          onChange={(e) => setHeadBillingStreet(e.target.value)}
          placeholder="Enter head billing street"
        />
        <FieldContainer
          label="Head Billing City"
          fieldGrid={4}
          value={headBillingCity}
          onChange={(e) => setHeadBillingCity(e.target.value)}
          placeholder="Enter head billing city"
        />
        <FieldContainer
          label="Head Billing State"
          fieldGrid={4}
          value={headBillingState}
          onChange={(e) => setHeadBillingState(e.target.value)}
          placeholder="Enter head billing state"
        />
        <FieldContainer
          label="Head Billing Country"
          fieldGrid={4}
          value={headBillingCountry}
          onChange={(e) => setHeadBillingCountry(e.target.value)}
          placeholder="Enter head billing country"
        />
        <FieldContainer
          label="Pin Code"
          fieldGrid={4}
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          placeholder="Enter pin code"
        />
        <FieldContainer
          label="Company Email"
          fieldGrid={4}
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          placeholder="Enter company email"
        />
        <FieldContainer
          label="Description"
          fieldGrid={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />

        <h5>Point of Contacts</h5>

        {pocs.map((poc, index) => (
          <div key={index} className="poc-container">
            <FieldContainer
              label="Contact Name"
              fieldGrid={4}
              value={poc.contact_name}
              onChange={(e) =>
                handlePocChange(index, "contact_name", e.target.value)
              }
              placeholder="Enter contact name"
              required
            />
            <FieldContainer
              label="Contact Number"
              fieldGrid={4}
              value={poc.contact_no}
              onChange={(e) =>
                handlePocChange(index, "contact_no", e.target.value)
              }
              placeholder="Enter contact number"
              required
            />
            <FieldContainer
              label="Alternative Contact Number"
              fieldGrid={4}
              value={poc.alternative_contact_no}
              onChange={(e) =>
                handlePocChange(index, "alternative_contact_no", e.target.value)
              }
              placeholder="Enter alternative contact number"
            />
            <FieldContainer
              label="Email"
              fieldGrid={4}
              value={poc.email}
              onChange={(e) => handlePocChange(index, "email", e.target.value)}
              placeholder="Enter email"
              required
            />
            <FieldContainer
              label="Department"
              fieldGrid={4}
              value={poc.department}
              onChange={(e) =>
                handlePocChange(index, "department", e.target.value)
              }
              placeholder="Enter department"
            />
            <FieldContainer
              label="Designation"
              fieldGrid={4}
              value={poc.designation}
              onChange={(e) =>
                handlePocChange(index, "designation", e.target.value)
              }
              placeholder="Enter designation"
            />
            <FieldContainer
              label="Description"
              fieldGrid={4}
              value={poc.description}
              onChange={(e) =>
                handlePocChange(index, "description", e.target.value)
              }
              placeholder="Enter description"
            />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAddPoc}
        >
          Add Point of Contact
        </button>
      </FormContainer>
    </div>
  );
};

export default CreateSalesAccount;
