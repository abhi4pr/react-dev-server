import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";
import { useGetAllSaleBookingQuery } from "../../../Store/API/Sales/SaleBookingApi";
import View from "../Account/View/View";

const ViewSaleBooking = () => {
  const {
    data: allSaleBooking,
    error: allSalebBookingError,
    isLoading: allSaleBookingLoading,
  } = useGetAllSaleBookingQuery();

  // useEffect(() => {
  //   const result = allSaleBooking?.filter((d) => {
  //     return d?.customer_name?.toLowerCase()?.includes(search?.toLowerCase());
  //   });
  //   setSaleBookingData(result);
  // }, [search]);

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => <div>{index + 1}</div>,
      width: 20,
      showCol: true,
    },
    {
      key: "customer_name",
      name: "Customer name",
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
      name: "Paid Amount",
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
      name: "Refund Amount",
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
      name: "Service Balance Amount",
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
      name: "Execution Running Status",
      showCol: true,
      width: 100,
    },
    {
      name: "Invoice Download",
      showCol: true,
      width: 100,
    },
    {
      key: "booking_status_name",
      name: "Open Status",
      showCol: true,
      width: 100,
    },
    {
      key: "",
      name: "Approve or Reject Reason",
      showCol: true,
      width: 100,
    },
    {
      name: "Refund Reasons",
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
          <Link to={`/admin/create-sales-booking/${row.sale_booking_id}`}>
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
          <FormContainer mainTitle={"Account Overview"} link={true} />
        </div>
        <div className="action_btns">
          <Link to={"/admin/create-sales-booking/0"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Add account
            </button>
          </Link>
        </div>
      </div>
      <View
        columns={columns}
        data={allSaleBooking}
        isLoading={allSaleBookingLoading}
        title={"Sale Booking"}
        // rowSelectable={true}
        pagination={[5, 10, 15]}
      />
    </div>
  );
};

export default ViewSaleBooking;
