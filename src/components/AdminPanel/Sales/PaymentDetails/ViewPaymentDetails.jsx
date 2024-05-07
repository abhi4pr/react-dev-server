import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import DataTable from "react-data-table-component";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { Link } from "react-router-dom";
import DeleteButton from "../../DeleteButton";

const ViewPaymentDetails = () => {
  const [paymentDetailsData, setPaymentDetailsData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");
  const [copiedRowId, setCopiedRowId] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}sales/getlist_payment_details`
      );
      setPaymentDetailsData(response.data.data);
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
    setPaymentDetailsData(result);
  }, [search]);

  const handleCopyDetails = (row) => {
    navigator.clipboard.writeText(row.details);
    setCopiedRowId(row._id);
  };

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => index + 1,
    },
    {
      name: "Mode Name",
      cell: (row) => row.title,
    },
    {
      name: "Details",
      cell: (row) => row.details,
    },
    {
      name: "GST Bank",
      cell: (row) => (row.gst_bank ? "GST" : "Non GST"),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <div
            className="icon-1"
            onClick={() => handleCopyDetails(row)}
            disabled={row._id === copiedRowId}
          >
            {row._id === copiedRowId ? (
              <i className="bi bi-clipboard2-check" />
            ) : (
              <i className="bi bi-clipboard" />
            )}
          </div>
          <Link to={`/admin/edit-payment-details/${row._id}`}>
            <div className="icon-1">
              <i className="bi bi-pencil" />
            </div>
          </Link>
          <DeleteButton
            endpoint="sales/delete_payment_details"
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
            link="/admin/create-payment-details"
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
              data={paymentDetailsData}
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

export default ViewPaymentDetails;
