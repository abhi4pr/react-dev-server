import React, { useMemo } from "react";
import FormContainer from "../../FormContainer";
import View from "./View/View";
import { useGetAllAccountQuery } from "../../../Store/API/Sales/SalesAccountApi";
import { Link } from "react-router-dom";
import { useGetAllAccountTypeQuery } from "../../../Store/API/Sales/SalesAccountTypeApi";
import { useGetAllCompanyTypeQuery } from "../../../Store/API/Sales/CompanyTypeApi";
import { useGetAllBrandCategoryTypeQuery } from "../../../Store/API/Sales/BrandCategoryTypeApi";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { useGlobalContext } from "../../../../Context/Context";

const SalesAccountOverview = () => {
  const {
    data: allAccount,
    error: allAccountError,
    isLoading: allAccountLoading,
  } = useGetAllAccountQuery();

  const {
    data: allAccountTypes,
    error: allAccountTypesError,
    isLoading: allAccountTypesLoading,
  } = useGetAllAccountTypeQuery();

  const {
    data: allBrandCatType,
    error: allBrandCatTypeError,
    isLoading: allBrandCatTypeLoading,
  } = useGetAllBrandCategoryTypeQuery();

  const {
    data: allCompanyType,
    error: allCompanyTypeError,
    isLoading: allCompanyTypeLoading,
  } = useGetAllCompanyTypeQuery();

  const isLoading =
    allAccountLoading ||
    allAccountTypesLoading ||
    allCompanyTypeLoading ||
    allBrandCatTypeLoading;

  const isError =
    allAccountError ||
    allAccountTypesError ||
    allCompanyTypeError ||
    allBrandCatTypeError;

  const { toastAlert, toastError } = useGlobalContext();

  if (allAccountError) {
    toastError(
      allAccountError.data?.message ||
        allAccountError.error ||
        "An error occurred"
    );
  }
  if (allAccountTypesError) {
    toastError(
      allAccountTypesError.data?.message ||
        allAccountTypesError.error ||
        "An error occurred"
    );
  }
  if (allCompanyTypeError) {
    toastError(
      allCompanyTypeError.data?.message ||
        allCompanyTypeError.error ||
        "An error occurred"
    );
  }
  if (allBrandCatTypeError) {
    toastError(
      allBrandCatTypeError.data?.message ||
        allBrandCatTypeError.error ||
        "An error occurred"
    );
  }
  const ViewSalesAccountColumns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
      showCol: true,
      sortable: true,
    },
    {
      key: "account_name",
      name: "Account Name",
      renderRowCell: (row) => row.account_name,
      width: 100,
      sortable: true,
    },
    {
      key: "description",
      name: "Description",
      renderRowCell: (row) => row.description,
      width: 200,
      sortable: true,
      showCol: true,
      editable: true,
      customEditElement: (row, index, setEditFlag, handelchange) => (
        <input
          type="text"
          onChange={(e) => handelchange(e)}
          placeholder={row.description}
        />
      ),
    },
    {
      key: "turn_over",
      name: "Turn Over",
      renderRowCell: (row) => row.turn_over,
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "website",
      name: "Website",
      renderRowCell: (row) => (
        <a href={row.website} target="_blank" rel="noopener noreferrer">
          {row.website}
        </a>
      ),
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "createdAt",
      name: "Created Date",
      renderRowCell: (row) => DateISOtoNormal(row.createdAt),
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "updatedAt",
      name: "Updated Date",
      renderRowCell: (row) => DateISOtoNormal(row.updatedAt),
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "AccountType",
      name: "Account Type",
      renderRowCell: (row) => {
        const accountType = allAccountTypes?.find(
          (accountType) => accountType._id === row.account_type_id
        );
        return accountType ? accountType.account_type_name : "NA";
      },
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "company_type_name",
      name: "Company Name",
      renderRowCell: (row) => {
        const companyType = allCompanyType?.find(
          (companyType) => companyType._id === row.company_type_id
        );
        return companyType ? companyType.company_type_name : "NA";
      },
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "Brand_type_name",
      name: "Brand Category Name",
      renderRowCell: (row) => {
        const brandType = allBrandCatType?.find(
          (brandCatType) => brandCatType._id === row.category_id
        );
        return brandType ? brandType.brandCategory_name : "NA";
      },
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "Action_edits",
      name: "Actions",
      renderRowCell: (row) => (
        <div className="flex-row">
          <Link to={`/admin/create-sales-account/${row._id}`}>
            <button className="icon-1">
              <i className="bi bi-pencil"></i>
            </button>
          </Link>
        </div>
      ),
      width: 100,
      sortable: true,
      showCol: true,
    },
  ];

  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Account Overview"} link={true} />
        </div>
        <div className="action_btns">
          <Link to={"/admin/create-sales-account/0"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Add account
            </button>
          </Link>
        </div>
      </div>
      <View
        columns={ViewSalesAccountColumns}
        data={allAccount}
        isLoading={isLoading}
        title={"Account Details"}
        rowSelectable={true}
        pagination={[5, 10, 15]}
      />
    </div>
  );
};

export default SalesAccountOverview;
