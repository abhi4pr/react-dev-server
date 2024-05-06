import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import DataTable from "react-data-table-component";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { Link } from "react-router-dom";
import DeleteButton from "../../DeleteButton";

const ViewPaymentMode = () => {
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}sales/getlist_sale_payment_mode`
      );
      setPaymentModeData(response.data.data);
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
      return d.reason?.toLowerCase().includes(search.toLowerCase());
    });
    setPaymentModeData(result);
  }, [search]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => index + 1,
    },
    {
      name: "Mode Name",
      cell: (row) => row.payment_mode_name,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link to={`/admin/edit-payment-mode/${row._id}`}>
            <div className="icon-1">
              <i className="bi bi-pencil" />
            </div>
          </Link>
          <DeleteButton
            endpoint="sales/delete_sale_payment_mode"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Payment Mode"
            link="/admin/create-payment-mode"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Payment Mode Overview"
              columns={columns}
              data={paymentModeData}
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

export default ViewPaymentMode;
