import React from "react";
import DataTable from "react-data-table-component";

const HrVisibleToHrOverview = ({ hrOverviewData }) => {
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      // width: "6%",
      sortable: true,
    },
    {
      name: "Request By",
      selector: (row) => row.asset_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Request Date",
      selector: (row) => row.asset_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Category",
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: (row) => row.sub_category_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Brand",
      selector: (row) => row.asset_brand_name,
      sortable: true,
    },
    {
      name: "Modal",
      selector: (row) => row.asset_modal_name,
      sortable: true,
    },
    {
      name: "Vendor Name",
      cell: (row) => (
        <button
          className="btn btn-warning btn-sm"
          onClick={() => handleVendorDetails(row.vendor_id)}
        >
          {row.vendor_name}
        </button>
      ),
      sortable: true,
      width: "150px",
    },

    {
      name: "In Warranty",
      selector: (row) => row.inWarranty,
      sortable: true,
    },
    {
      name: "Date Of Purchase",
      selector: (row) => row.dateOfPurchase?.split("T")?.[0],
      sortable: true,
      width: "150px",
    },
    {
      name: "Warranty Date",
      selector: (row) => row.warrantyDate?.split("T")?.[0],
      sortable: true,
      width: "150px",
    },
    {
      name: "Invoice",
      selector: (row) => (
        <>
          <a style={{ cursor: "pointer" }} href={row.invoiceCopy} download>
            <img
              style={{ width: "100px" }}
              src={row.invoiceCopy}
              alt="invoice copy"
            />
          </a>
        </>
      ),
      sortable: true,
    },
  ];
  return (
    <>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Repair Request Overview"
              columns={columns}
              data={hrOverviewData}
              fixedHeader
              //   pagination
              fixedHeaderScrollHeight="64vh"
              exportToCSV
              highlightOnHover
              subHeader
              //   subHeaderComponent={
              //     <>
              //       <input
              //         type="text"
              //         placeholder="Search here"
              //         className="w-50 form-control "
              //         value={search}
              //         onChange={(e) => setSearch(e.target.value)}
              //       />
              //     </>
              //   }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HrVisibleToHrOverview;
