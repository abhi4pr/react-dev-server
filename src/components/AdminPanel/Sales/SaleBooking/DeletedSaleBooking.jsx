import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";

const DeletedSaleBooking = () => {
  const [deletedSaleBookingData, setDeletedSaleBookingData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}sales/get_all_new_deleted_data`
      );
      setDeletedSaleBookingData(response.data.data);
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
    setDeletedSaleBookingData(result);
  }, [search]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Customer name",
      selector: (row) => row.customer_name,
    },
    {
      name: "Campaign amount/Net Amount",
      selector: (row) => row?.campaign_amount,
    },
    {
      name: "Base amount",
      selector: (row) => row?.base_amount,
    },
    {
      name: "GST amount",
      selector: (row) => row?.gst_amount,
    },
    {
      name: "Incentive",
      selector: (row) => (row?.incentive_status == "incentive" ? "Yes" : "No"),
    },
    {
      name: "Booking Date Created",
      selector: (row) =>
        ` ${DateISOtoNormal(row.createdAt)} ${new Date(
          row.createdAt
        ).toLocaleTimeString("en-US", { hour12: false })}`,
    },
  ];
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Deleted Sale Booking"
            link="/admin/create-sales-booking"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header sb">
          <div className="card-title">Deleted Sale Booking Overview</div>
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
            data={deletedSaleBookingData}
            pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default DeletedSaleBooking;
