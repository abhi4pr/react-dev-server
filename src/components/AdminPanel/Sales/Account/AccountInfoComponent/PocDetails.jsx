import React, { useEffect, useState } from "react";
import { useGetSinglePOCQuery } from "../../../../Store/API/Sales/PointOfContactApi";

const PocDetails = ({ SingleAccount }) => {
  const {
    data: PocData,
    isLoading: PocLoading,
    error: PocError,
  } = useGetSinglePOCQuery(`${SingleAccount?.account_id}?_id=false`, {
    skip: !SingleAccount?.account_id,
  });

  return (
    <div className="pocdetails">
      <h2 className="mb-4" style={{ color: "var(--medium)" }}>
        POC
      </h2>

      <div className="row">
        {PocData?.map((poc, index) => (
          <div key={index} class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
            <div className="card w-100">
              <div className="card-header">
                <h4 className="card-title">POC ({index + 1})</h4>
              </div>
              <div className="card-body">
                <div className="account-detail">
                  <div className="detail-view">
                    <div className="details">
                      Name: <span>{poc.contact_name}</span>
                    </div>
                  </div>
                  <div className="detail-view">
                    <div className="details">
                      Contact Number: <span>{poc.contact_no}</span>
                    </div>
                  </div>
                  <div className="detail-view">
                    <div className="details">
                      Aternate contact Number:{" "}
                      <span>{poc.alternative_contact_no}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PocDetails;
