import React from "react";
import { useParams } from "react-router-dom";
import { useGetIndividualSaleBookingQuery } from "../../../../Store/API/Sales/SaleBookingApi";

const SalesBookingDetails = () => {
  const account = useParams();
  const {
    data: SalesData,
    error: SalesError,
    isLoading: SalesLoading,
  } = useGetIndividualSaleBookingQuery(account.id);

  return (
    <div className="SalesBookingDetail">
      <h2 className="mb-4" style={{ color: "var(--medium)" }}>
        SalesBookingDetails
      </h2>
      {/* <div className="row">
        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
          <div className="card w-100">
            <div className="card-header">
              <h4 className="card-title">{lol?.data?.campaign_name}</h4>
            </div>
            <div className="card-body">
              <div className="account-detail">
                <div className="detail-view">
                  <div className="details">
                    Campaign Name: <span>{lol?.data?.campaign_name}</span>
                  </div>
                </div>
                <div className="detail-view">
                  <div className="details">
                    Campaign Amount: <span>{lol?.data?.campaign_amount}</span>
                  </div>
                </div>
                <div className="detail-view">
                  <div className="details">
                    Description: <span>{lol?.data?.description}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SalesBookingDetails;
