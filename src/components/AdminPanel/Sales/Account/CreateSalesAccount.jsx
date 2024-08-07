import React, { useState, useEffect } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGetAllAccountTypeQuery } from "../../../Store/API/Sales/SalesAccountTypeApi";
import { useGetAllCompanyTypeQuery } from "../../../Store/API/Sales/CompanyTypeApi";
import { useGetAllBrandCategoryTypeQuery } from "../../../Store/API/Sales/BrandCategoryTypeApi";
import {
  useAddAccountMutation,
  useEditAccountMutation,
  useGetSingleAccountQuery,
} from "../../../Store/API/Sales/SalesAccountApi";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import Modal from "react-modal";
import CreateBrandCategory from "./CreateBrandCategory";
import CreateAccountType from "./CreateAccountType";
import CreateCompanyType from "./CreateCompanyType";
import View from "./View/View";
import { ViewBrandCategoryColumns } from "./Columns/ViewBrandCategoryColumns";
import { ViewCompanyTypeColumns } from "./Columns/ViewCompanyTypeColumns";
import { ViewAccountTypeColumns } from "./Columns/ViewAccountTypeColumns";
import PointOfContact from "./PointOfContact";
import DocumentUpload from "./DocumentUpload";
import {
  useEditDocumentMutation,
  useGetDocumentByIdQuery,
} from "../../../Store/API/Sales/AccountDocumentApi";
import {
  useEditPOCMutation,
  useGetSinglePOCQuery,
} from "../../../Store/API/Sales/PointOfContactApi";
import { useGetAllDocumentTypeQuery } from "../../../Store/API/Sales/DocumentTypeApi";
import Loader from "../../Finance/Loader/Loader";

const CreateSalesAccount = () => {
  const { id } = useParams();
  const { toastAlert, toastError } = useGlobalContext();
  const normalToken = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const token = getDecodedToken();
  const loginUserId = token.id;

  const {
    data: allAccountTypes,
    error: allAccountTypesError,
    isLoading: allAccountTypesLoading,
  } = useGetAllAccountTypeQuery();

  const {
    data: allCompanyType,
    error: allCompanyTypeError,
    isLoading: allCompanyTypeLoading,
  } = useGetAllCompanyTypeQuery();

  const {
    data: allBrandCatType,
    error: allBrandCatTypeError,
    isLoading: allBrandCatTypeLoading,
  } = useGetAllBrandCategoryTypeQuery();

  const {
    data: allDocType,
    error: allDocTypeError,
    isLoading: allDocTypeLoading,
  } = useGetAllDocumentTypeQuery();

  const [
    createSalesAccount,
    {
      isLoading: isCreateSalesLoading,
      isSuccess: isAccountCreationSuccess,
      isError: isAccountCreationError,
    },
  ] = useAddAccountMutation();

  const { data: singleAccountData, isLoading: accountDataLoading } =
    useGetSingleAccountQuery(id, {
      skip: !id,
    });

  const [accountName, setAccountName] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [website, setWebsite] = useState("");
  const [turnover, setTurnover] = useState("");
  const [officesCount, setOfficesCount] = useState("");
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
  const [pinCode, setPinCode] = useState(null);
  const [companyEmail, setCompanyEmail] = useState(null);
  const [description, setDescription] = useState(null);
  const [accOwnerNameData, setAccOwnerNameData] = useState([]);
  const [modalContentType, setModalContentType] = useState(false);
  const [fillHeadFields, setFillHeadFields] = useState(false);

  const [pocs, setPocs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [accountId, setAccountId] = useState();

  const [updateSalesAccount, { isLoading: editAccountLoading }] =
    useEditAccountMutation();

  //get Documents with account_id
  const { data: singleAccountDocuments, isLoading: DocumentsLoading } =
    useGetDocumentByIdQuery(accountId, { skip: !accountId });

  //get POC with account_id
  const { data: singlePoc, isLoading: pocLoading } = useGetSinglePOCQuery(
    accountId,
    {
      skip: !accountId,
    }
  );

  //update POC
  const [updatePocs, { isLoading: editPocLoading }] = useEditPOCMutation();

  //update Document
  const [updateDocs, { isLoading: editDocumentLoading }] =
    useEditDocumentMutation(accountId, {
      skip: !accountId,
    });

  useEffect(() => {
    async function getData() {
      const response = await axios.get(`${baseUrl}get_all_sales_users_list`);
      setAccOwnerNameData(response.data);
    }
    getData();
  }, []);

  useEffect(() => {
    if (id && singleAccountData) {
      const {
        account_name,
        account_type_id,
        company_type_id,
        category_id,
        account_owner_id,
        website,
        turn_over,
        description,
      } = singleAccountData;

      setAccountId(singleAccountData?.account_id);
      setAccountName(account_name);
      setSelectedAccountType(account_type_id);
      setSelectedCompanyType(company_type_id);
      setSelectedCategory(category_id);
      setSelectedOwner(account_owner_id);
      setWebsite(website);
      setTurnover(turn_over);
      setDescription(description);

      async function getBilling() {
        const response = await axios.get(
          `${baseUrl}/accounts/get_single_account_billing/${singleAccountData.account_id}?_id=false`,
          {
            headers: {
              Authorization: `Bearer ${normalToken}`,
            },
          }
        );
        const {
          company_email,
          how_many_offices,
          connected_office,
          connect_billing_street,
          connect_billing_city,
          connect_billing_state,
          connect_billing_country,
          head_office,
          head_billing_street,
          head_billing_city,
          head_billing_state,
          head_billing_country,
          pin_code,
        } = response.data.data;
        setCompanyEmail(company_email);
        setOfficesCount(how_many_offices);
        setConnectedOffice(connected_office);
        setConnectedBillingStreet(connect_billing_street);
        setConnectedBillingCity(connect_billing_city);
        setConnectedBillingState(connect_billing_state);
        setConnectedBillingCountry(connect_billing_country);
        setHeadOffice(head_office);
        setHeadBillingStreet(head_billing_street);
        setHeadBillingCity(head_billing_city);
        setHeadBillingState(head_billing_state);
        setHeadBillingCountry(head_billing_country);
        setPinCode(pin_code);
      }

      getBilling();
    }
  }, [id, singleAccountData]);

  useEffect(() => {
    setPocs(singlePoc);
    setDocuments(singleAccountDocuments);
  }, [accountId, singlePoc, singleAccountDocuments]);

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

  const handleAddDocument = () => {
    setDocuments([
      ...documents,
      {
        file: null,
        document_master_id: "",
        document_no: "",
      },
    ]);
  };

  const handleCheckboxChange = () => {
    setFillHeadFields(!fillHeadFields);
    if (!fillHeadFields) {
      setHeadOffice(connectedOffice);
      setHeadBillingStreet(connectedBillingStreet);
      setHeadBillingCity(connectedBillingCity);
      setHeadBillingState(connectedBillingState);
      setHeadBillingCountry(connectedBillingCountry);
    } else {
      setHeadOffice("");
      setHeadBillingStreet("");
      setHeadBillingCity("");
      setHeadBillingState("");
      setHeadBillingCountry("");
    }
  };

  function isValidEmail(email) {
    if (!email) return true;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  function isValidPinCode(pinCode) {
    if (!pinCode) return true;
    const regex = /^\d{6}$/;
    return regex.test(pinCode);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payloads = {
      account_name: accountName,
      account_type_id: selectedAccountType,
      company_type_id: selectedCompanyType,
      category_id: selectedCategory,
      account_owner_id: selectedOwner,
      website: website,
      turn_over: turnover,
      how_many_offices: officesCount,
      connected_office: connectedOffice,
      connect_billing_street: connectedBillingStreet,
      connect_billing_city: connectedBillingCity,
      connect_billing_state: connectedBillingState,
      connect_billing_country: connectedBillingCountry,
      head_office: headOffice,
      head_billing_street: headBillingStreet,
      head_billing_city: headBillingCity,
      head_billing_state: headBillingState,
      head_billing_country: headBillingCountry,
      description: description,
      created_by: loginUserId,
      account_poc: pocs,
      account_documents: documents,
      company_email: companyEmail,
      pin_code: Number(pinCode),
    };

    if (id == 0) {
      payloads.account_poc = pocs;
      payloads.account_documents = documents;
    }

    try {
      if (id == 0) {
        await createSalesAccount(payloads).unwrap();
      } else {
        await updateSalesAccount({ ...payloads, id: id }).unwrap();
        await updateDocs({
          account_documents: documents,
          updated_by: loginUserId,
          id: accountId,
        }).unwrap();
        await updatePocs({
          account_poc: pocs,
          updated_by: loginUserId,
          id: accountId,
        }).unwrap();
      }

      setAccountName("");
      setSelectedAccountType(null);
      setSelectedCompanyType(null);
      setSelectedCategory(null);
      setSelectedOwner(null);
      setWebsite("");
      setTurnover("");
      setOfficesCount("");
      setConnectedOffice("");
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
      setPocs([]);
      setDocuments([]);

      navigate("/admin/sales-account-overview");
      toastAlert("Payment Details Updated");
    } catch (error) {
      toastError(error.message);
    }
  };

  useEffect(() => {
    if (isAccountCreationSuccess) {
      toastAlert("Account created successfully!");
    } else if (isAccountCreationError) {
      toastError("Failed to create account.");
    }
  }, [isAccountCreationSuccess, isAccountCreationError]);

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
          />
        );
      case "accountType":
        return (
          <CreateAccountType
            loginUserId={loginUserId}
            closeModal={closeModal}
          />
        );
      case "companyType":
        return (
          <CreateCompanyType
            loginUserId={loginUserId}
            closeModal={closeModal}
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
  if (
    allAccountTypesLoading ||
    allCompanyTypeLoading ||
    allBrandCatTypeLoading ||
    allDocTypeLoading ||
    isCreateSalesLoading ||
    accountDataLoading ||
    editAccountLoading ||
    DocumentsLoading ||
    pocLoading ||
    editPocLoading ||
    editDocumentLoading
  )
    return <Loader />;
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

            maxWidth: "900px",
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

      <FormContainer mainTitle="Accounts Master" link={true} />
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Account Detail</h5>
        </div>
        <div className="card-body row">
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
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Details</h3>
        </div>
        <div className="card-body row">
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
            required
          />

          <FieldContainer
            label="Turnover (in cr)"
            type="number"
            fieldGrid={4}
            value={turnover}
            onChange={(e) => setTurnover(e.target.value)}
            placeholder="Enter turnover in crores"
          />

          <div className="col-4">
            <FieldContainer
              label="Company Email"
              astric
              type="email"
              fieldGrid={4}
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              placeholder="Enter company email"
              required
            />
            {!isValidEmail(companyEmail) && (
              <div className="form-error">Please Enter Valid Email</div>
            )}
          </div>

          <FieldContainer
            label="How Many Offices"
            fieldGrid={4}
            value={officesCount}
            onChange={(e) => setOfficesCount(e.target.value)}
            placeholder="Enter number of offices"
          />
          <div className="col-4">
            <FieldContainer
              label="Pin Code"
              type="number"
              fieldGrid={4}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="Enter pin code"
            />
            {!isValidPinCode(pinCode) && (
              <div className="form-error">Please Enter Valid Pin Code</div>
            )}
          </div>

          <FieldContainer
            label="Description"
            astric
            fieldGrid={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          />
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Connected Address</h3>
        </div>
        <div className="card-body row">
          <FieldContainer
            label="Connected Office"
            fieldGrid={4}
            value={connectedOffice}
            onChange={(e) => setConnectedOffice(e.target.value)}
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
        </div>
      </div>
      <div className="card">
        <div className="card-header sb">
          <h3 className="card-title">Head Address</h3>
          <label className="card-title">
            <input
              type="checkbox"
              className="form-check-input"
              checked={fillHeadFields}
              onChange={handleCheckboxChange}
            />
            <p className="mt-1 ml-2"> Same as Connected Office</p>
          </label>
        </div>
        <div className="card-body row">
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
        </div>
      </div>
      <PointOfContact pocs={pocs} setPocs={setPocs} />
      <DocumentUpload
        documents={documents}
        setDocuments={setDocuments}
        documentTypes={allDocType}
      />
      <div className="flex-row sb mb-3">
        <button
          className="btn cmnbtn btn-primary"
          disabled={isCreateSalesLoading}
          onClick={handleSubmit}
        >
          {!isCreateSalesLoading ? "Submit" : "Submitting"}
        </button>
        <button
          className="btn cmnbtn btn-warning"
          onClick={() => handleAddPoc()}
        >
          Add Point of Contact
        </button>

        <button
          type="button"
          className="btn cmnbtn btn-warning"
          onClick={handleAddDocument}
        >
          Add Document
        </button>
      </div>
    </div>
  );
};

export default CreateSalesAccount;
