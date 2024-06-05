import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";
import { useGetAllSaleBookingQuery, useGetSalesBookingPaymentDetailQuery } from "../../../Store/API/Sales/SaleBookingApi";
import View from "../Account/View/View";
import { useGetAllAccountQuery } from "../../../Store/API/Sales/SalesAccountApi";

const ViewSaleBooking = () => {
  const {
    data: allSaleBooking,
    error: allSalebBookingError,
    isLoading: allSaleBookingLoading,
  } = useGetAllSaleBookingQuery();
  const {
    data: allAccount,
    error: allAccountError,
    isLoading: allAccountLoading
  } = useGetAllAccountQuery()
  const {
    data: allSalesBookingPaymentDetail,
    error: allSalesBookingPaymentDetailError,
    isLoading: allSalesBookingPaymentDetailLoading
  } = useGetSalesBookingPaymentDetailQuery();
  console.log(allSalesBookingPaymentDetail);
  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => <div>{index + 1}</div>,
      width: 20,
      showCol: true,
    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      showCol: true,
      width: 100,
    },
    {
      key: "customer_name",
      name: "Account name",
      renderRowCell: (row) => (
        allAccount?.find((account) => account.account_id === row.account_id)?.account_name
      ),
      showCol: true,
      width: 100,
    },
    {
      key: "created_by_name",
      name: "Sales Executive name",
      showCol: true,
      width: 100,
    },
    {
      key: "sale_booking_date",
      name: "Booking Date",
      renderRowCell: (row) => DateISOtoNormal(row.sale_booking_date),

      showCol: true,
      width: 100,
    },
    {
      key: "campaign_amount",
      name: "Campaign Amount / Net Amount",
      renderRowCell: (row) => row.campaign_amount + "₹",
      showCol: true,
      width: 100,
    },

    {
      key: "base_amount",
      name: "Base Amount",
      renderRowCell: (row) => row.base_amount + "₹",
      showCol: true,
      width: 100,
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      renderRowCell: (row) => row.gst_amount + "₹",
      showCol: true,
      width: 100,
    },

    {
      key: "service_taken_amount",
      name: "Service Taken Amount",
      renderRowCell: (row) => row.service_taken_amount + "₹",
      showCol: true,
      width: 100,
    },

    {
      key: "incentive_status",
      name: "Incentive",
      renderRowCell: (row) =>
        row.incentive_status === "incentive" ? "Yes" : "No",
      showCol: true,
      width: 100,
    },

    {
      key: "createdAt",
      name: "Booking Date Created",
      renderRowCell: (row) => DateISOtoNormal(row.createdAt),
      showCol: true,
      width: 100,
    },
    {
      key: "sale_booking_id",
      name: "Action",
      width: 100,
      renderRowCell: (row) => (
        <>
          <Link to={`/admin/create-sales-booking/${row.sale_booking_id}/${row._id}`}>
            <div className="icon-1">
              <i class="bi bi-pencil"></i>
            </div>
          </Link>

        </>
      ),
      showCol: true,
    },
  ];

  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Sale Bookings Overview"} link={true} />
        </div>
        <div className="action_btns">
          <Link to={"/admin/sales-account-overview"}>
            <button className="btn cmnbtn btn-primary btn_sm">Accounts</button>
          </Link>
          <Link to={"/admin/create-sales-booking"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Create Sale Booking
            </button>
          </Link>
        </div>
      </div>
      <View
        columns={columns}
        data={allSaleBooking}
        isLoading={allSaleBookingLoading || allAccountLoading || allSalesBookingPaymentDetailLoading}
        title={"Sale Booking"}
        // rowSelectable={true}
        pagination={[5, 10, 15]}
      />
    </div>
  );
};

export default ViewSaleBooking;
