import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";

const ViewSaleBooking = () => {
  const [saleBookingData, setSaleBookingData] = useState([]);
  const [origionalData, setOrigionalData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(`${baseUrl}sales/get_all_sales_booking`);
      setSaleBookingData(response.data.data);
      setOrigionalData(response.data.data);
    } catch (error) {
      console.error("Error fetching credit approval reasons:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = origionalData.filter((d) => {
      return d?.reason?.toLowerCase().includes(search.toLowerCase());
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
      selector: (row) => console.log(row),
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
      name: "Refund Amount Files",
    },
    {
      name: "Service Taken Count",
    },
    {
      name: "Service Taken Amount",
      selector: (row) => row.service_taken_amount + "₹",
    },
    {
      name: "Service Balance Amount",
    },
    {
      name: "Has Incentive",
      selector: (row) => row.incentive_status,
    },
    {
      name: "Execution Running Status",
    },
    {
      name: "Invoice Download",
    },
    {
      name: "Open Status",
    },
    {
      name: "Approve or Reject Reason",
    },
    {
      name: "Refund Reasons",
    },
    {
      name: "Badge Achievement",
    },
    {
      name: "Booking Date Created",
    },
  ];
  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Sales Booking"
            link="/admin/create-sales-booking"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Services Overview"
              columns={columns}
              data={saleBookingData}
              fixedHeader
              pagination
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSaleBooking;
