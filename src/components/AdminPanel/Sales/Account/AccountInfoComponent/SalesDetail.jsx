import { useGetSingleAccountTypeQuery } from "../../../../Store/API/Sales/SalesAccountTypeApi";
import { useGetSingleAccountSalesBookingQuery } from "../../../../Store/API/Sales/SalesAccountApi";
import { useGetSingleCompanyTypeQuery } from "../../../../Store/API/Sales/CompanyTypeApi";
import { useGetSingleBrandCategoryTypeQuery } from "../../../../Store/API/Sales/BrandCategoryTypeApi";
import FormContainer from "../../../FormContainer";

const SalesDetail = ({ SingleAccount }) => {
    const {
        data: SingleAccountType,
        error: SingleAccountTypeErr,
        isLoading: SingleAccountTypeLoading,
    } = useGetSingleAccountTypeQuery(SingleAccount?.account_type_id, {
        skip: !SingleAccount?.account_type_id,
    });

    const {
        data: SingleCompanyType,
        error: SingleCompanyTypeErr,
        isLoading: SingleCompanyTypeLoading,
    } = useGetSingleCompanyTypeQuery(SingleAccount?.company_type_id, {
        skip: !SingleAccount?.company_type_id,
    });

    const {
        data: SingleBrandCategoryType,
        error: SingleBrandCategoryTypeErr,
        isLoading: SingleBrandCategoryTypeLoading,
    } = useGetSingleBrandCategoryTypeQuery(SingleAccount?.category_id, {
        skip: !SingleAccount?.category_id,
    });

    const {
        data: SingleAccountSalesBooking,
        error: SingleAccountSalesBookingError,
        isLoading: SingleAccountSalesBookingLoading,
    } = useGetSingleAccountSalesBookingQuery(
        `${SingleAccount?.account_id}?_id=false`,
        { skip: !SingleAccount?.account_id }
    );

    return (
        <div className="salesdetails">
            <div className="card">
                <div className="card-body">
                    <FormContainer link={true} mainTitle={SingleAccount?.account_name} />
                    <div className="account-detail">
                        <div className="detail-view">
                            <div className="details">
                                Description:<span> {SingleAccount?.description}</span>
                            </div>
                        </div>
                        <div className="detail-view">
                            <div className="details">
                                Website:{" "}
                                <a href={SingleAccount?.website}>{SingleAccount?.website}</a>
                            </div>
                            <div className="details">
                                Turnover: <span>{SingleAccount?.turn_over}</span>
                            </div>
                            <div className="details">
                                Company Email:{" "}
                                <span>{SingleAccountSalesBooking?.company_email}</span>
                            </div>
                            <div className="details">
                                No. of Offices:{" "}
                                <span>{SingleAccountSalesBooking?.how_many_offices}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="card w-100">
                        <div className="card-header">
                            <h4 className="card-title">Account Type</h4>
                        </div>
                        <div className="card-body">
                            <div className="account-detail">
                                <div className="detail-view">
                                    <div className="details">
                                        Account Type:{" "}
                                        <span>{SingleAccountType?.account_type_name}</span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        Description: <span>{SingleAccountType?.description}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="card w-100">
                        <div className="card-header">
                            <h4 className="card-title">Company Type</h4>
                        </div>
                        <div className="card-body">
                            <div className="account-detail">
                                <div className="detail-view">
                                    <div className="details">
                                        Company Type:{" "}
                                        <span>{SingleCompanyType?.company_type_name}</span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        Description: <span>{SingleCompanyType?.description}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="card w-100">
                        <div className="card-header">
                            <h4 className="card-title">Brand Category Type</h4>
                        </div>
                        <div className="card-body">
                            <div className="account-detail">
                                <div className="detail-view">
                                    <div className="details">
                                        Brand Type:{" "}
                                        <span>{SingleBrandCategoryType?.Brand_type_name}</span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        Description:{" "}
                                        <span>{SingleBrandCategoryType?.description}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="card w-100">
                        <div className="card-header">
                            <h4 className="card-title"> Head Billing Address</h4>
                        </div>
                        <div className="card-body">
                            <div className="account-detail">
                                <div className="detail-view">
                                    <div className="details">
                                        Head Office:{" "}
                                        <span>{SingleAccountSalesBooking?.head_office}</span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        Street:{" "}
                                        <span>
                                            {SingleAccountSalesBooking?.head_billing_street}
                                        </span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        City:{" "}
                                        <span>{SingleAccountSalesBooking?.head_billing_city}</span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        State:{" "}
                                        <span>{SingleAccountSalesBooking?.head_billing_state}</span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        Country:{" "}
                                        <span>
                                            {SingleAccountSalesBooking?.head_billing_country}
                                        </span>
                                    </div>
                                </div>
                                {/* <div className="detail-view">
                                    <div className='details'>
                                        Pincode: <span>{SingleAccountSalesBooking?.pin_code}</span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="card w-100">
                        <div className="card-header">
                            <h4 className="card-title"> Connected Billing Address</h4>
                        </div>
                        <div className="card-body">
                            <div className="account-detail">
                                <div className="detail-view">
                                    <div className="details">
                                        Connected Office:{" "}
                                        <span>{SingleAccountSalesBooking?.connected_office}</span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        Street:{" "}
                                        <span>
                                            {SingleAccountSalesBooking?.connect_billing_street}
                                        </span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        City:{" "}
                                        <span>
                                            {SingleAccountSalesBooking?.connect_billing_city}
                                        </span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        State:{" "}
                                        <span>
                                            {SingleAccountSalesBooking?.connect_billing_state}
                                        </span>
                                    </div>
                                </div>
                                <div className="detail-view">
                                    <div className="details">
                                        Country:{" "}
                                        <span>
                                            {SingleAccountSalesBooking?.connect_billing_country}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesDetail;
