import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";

const ViewPaymentUpdate = () => {
  const [paymentUpdateData, setPaymentUpdateData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}sales/getlist_sales_booking_payment`
      );
      setPaymentUpdateData(response.data.data);
      setOriginalData(response.data.data);
    } catch (error) {
      console.error("Error fetching credit approval reasons:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  console.log(originalData);
  useEffect(() => {
    const result = originalData.filter((d) => {
      return d?.customer_name?.toLowerCase()?.includes(search?.toLowerCase());
    });
    setPaymentUpdateData(result);
  }, [search]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Customer name",
      cell: (row) => `${row.customer_name} | ${row.payment_date} | `,
    },
    {
      name: "Payment date",
      cell: (row) => row.payment_date.split("-").reverse().join("-"),
    },
    {
      name: "Sales Executive name",
      selector: (row) => row.created_by_name,
    },
    {
      name: "Payment amount",
      selector: (row) => row.payment_amount,
    },
    {
      name: "Payment mode",
      selector: (row) => row.payment_mode_name,
    },
    {
      name: "Payment view",
      // selector: (row) => row.payment_mode_name,
    },
    {
      name: "Bank Name",
      selector: (row) => row.Payment_Deatils.title,
    },
    {
      name: "Bank deatils",
      selector: (row) => row.Payment_Deatils.details,
    },
    {
      name: "Status",
      selector: (row) => row.payment_approval_status,
    },
    {
      name: "Refrence number",
      selector: (row) => row.payment_ref_no,
    },
    {
      name: "Payment request date",
      selector: (row) => DateISOtoNormal(row.createdAt),
    },
    {
      name: "Payment Update Date(Approved/Rejected/Other things): activate to sort column ascending",
      selector: (row) =>
        row.payment_approval_status !== "pending"
          ? DateISOtoNormal(row.updatedAt)
          : "N/A",
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/edit-sales-booking/${row.sale_booking_id}`}>
            <div className="icon-1">
              <i class="bi bi-pencil"></i>
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
            mainTitle="Payment Update"
            link="/admin/create-payment-update/0"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header sb">
          <div className="card-title">Payment Update Overview</div>
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
            data={paymentUpdateData}
            pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default ViewPaymentUpdate;
