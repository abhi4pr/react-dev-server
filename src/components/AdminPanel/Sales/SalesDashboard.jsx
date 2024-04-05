import React from "react";
import { Link } from "react-router-dom";
import FormContainer from "../FormContainer";

const SalesDashboard = () => {
  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Sales Dashboard"
            link="/admin/user"
            submitButton={false}
          />
        </div>
        <div className="action_btns">
          <Link to="/admin/sales-incentive-overview">
            <button type="button" className="btn btn-info btn-sm">
              Incentive Plan
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SalesDashboard;
