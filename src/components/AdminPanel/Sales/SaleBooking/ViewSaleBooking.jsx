import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";

const ViewSaleBooking = () => {
  const [saleBookingData, setSaleBookingData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(`${baseUrl}sales/get_all_sales_booking`);
      setSaleBookingData(response.data.data);
      setOriginalData(response.data.data);
    } catch (error) {
      console.error("Error fetching credit approval reasons:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = originalData.filter((d) => {
      return d?.customer_name?.toLowerCase()?.includes(search?.toLowerCase());
    });
    setSaleBookingData(result);
  }, [search]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Customer name",
      cell: (row) => row.customer_name,
    },
    {
      name: "Sales Executive name",
      selector: (row) => row.created_by_name,
    },
    {
      name: "Booking Date",
      selector: (row) => DateISOtoNormal(row.sale_booking_date),
    },
    {
      name: "Campaign Amount / Net Amount",
      selector: (row) => row.campaign_amount + "₹",
    },
    {
      name: "Paid Amount",
      // selector: (row) => console.log(row),
    },
    {
      name: "Base Amount",
      selector: (row) => row.base_amount,
    },
    {
      name: "GST Amount",
      selector: (row) => row.gst_amount + "₹",
    },
    {
      name: "Refund Amount",
    },
    {
      name: "Service Taken Amount",
      selector: (row) => row.service_taken_amount + "₹",
    },
    {
      name: "Service Balance Amount",
    },
    {
      name: "Incentive",
      selector: (row) => (row.incentive_status === "incentive" ? "Yes" : "No"),
    },
    {
      name: "Execution Running Status",
    },
    {
      name: "Invoice Download",
    },
    {
      name: "Open Status",
      selector: (row) => row.booking_status_name,
      width: "250px",
    },
    {
      name: "Approve or Reject Reason",
    },
    {
      name: "Refund Reasons",
    },
    {
      name: "Booking Date Created",
      selector: (row) => DateISOtoNormal(row.createdAt),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/create-sales-booking/${row.sale_booking_id}`}>
            <div className="icon-1">
              <i class="bi bi-pencil"></i>
            </div>
            <div className="icon-1">
              <i class="bi bi-update"></i>
            </div>
          </Link>
        </>
      ),
    },
  ];
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Sales Booking"
            link="/admin/create-sales-booking/0"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header sb">
          <div className="card-title">Sale Booking Overview</div>
          <input
            type="text"
            placeholder="Search here"
            className="w-25 form-control "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body">
          <DataTable
            columns={columns}
            data={saleBookingData}
            pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default ViewSaleBooking;
