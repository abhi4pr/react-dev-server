import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";

const RecordServices = () => {
  const [recordServiceData, setRecordServiceData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}sales/get_record_service_master`
      );
      setRecordServiceData(response.data.data);
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
      return (
        d?.sale_executive_by_name
          ?.toLowerCase()
          ?.includes(search?.toLowerCase()) ||
        d?.customer_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        d?.Salesservicemasters?.service_name
          ?.toLowerCase()
          ?.includes(search?.toLowerCase())
      );
    });
    setRecordServiceData(result);
  }, [search]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Sales Executive name",
      selector: (row) => row?.sale_executive_by_name,
    },
    {
      name: "Customer name",
      selector: (row) => row?.customer_name,
    },
    {
      name: "Booking Date",
      selector: (row) => {
        if (row?.Sales_Booking?.sale_booking_date)
          return DateISOtoNormal(row?.Sales_Booking?.sale_booking_date);
      },
    },
    {
      name: "Service name",
      selector: (row) => row?.Salesservicemasters?.service_name,
    },
    {
      name: "Campaign amount",
      selector: (row) => row?.Sales_Booking?.campaign_amount,
    },
    {
      name: "Sales booking amount",
      selector: (row) => row?.Sales_Booking?.service_taken_amount,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/wfhd-update/${row.user_id}`}>
            <div className="icon-1" title="Edit User">
              <i class="bi bi-pencil"></i>
            </div>
          </Link>
          <Link to={`/admin/wfhd-update/${row.user_id}`}>
            <div className="icon-1" title="Edit User">
              <i class="bi bi-eye"></i>
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
            mainTitle="Record Services"
            link="/admin/create-sales-booking"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header sb">
          <div className="card-title">Record Services Overview</div>
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
            data={recordServiceData}
            pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default RecordServices;
