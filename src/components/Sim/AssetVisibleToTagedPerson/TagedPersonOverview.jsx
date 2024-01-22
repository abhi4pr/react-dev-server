import DataTable from "react-data-table-component";

const TagedPersonOverview = ({ filterData, hardRender, tabOne, tabTwo }) => {
  const columnsTab1 = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Request By",
      selector: (row) => row.req_by_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Request Date",
      selector: (row) => row.req_date?.split("T")?.[0],
      sortable: true,
      width: "150px",
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => row.status,
    //   sortable: true,
    // },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row?.asset_repair_request_status === "Requested" ? (
            <span className="badge badge-danger">Requested</span>
          ) : row.asset_repair_request_status === "Accept" ? (
            <span className="badge badge-success">Approved</span>
          ) : row.asset_repair_request_status === "Rejected" ? (
            <span className="badge badge-warning">Rejected</span>
          ) : row.asset_repair_request_status === "Recover" ? (
            <span className="badge badge-warning">Recoverd</span>
          ) : null}
        </>
      ),
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      sortable: true,
      width: "14%",
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
  ];
  const columnsTab2 = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Request By",
      selector: (row) => row.req_by_name,
      sortable: true,
    },
    {
      name: "Request Date",
      selector: (row) => row.req_date?.split("T")?.[0],
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      sortable: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => (
    //     <>
    //       {row?.asset_new_request_status === "Requested" ? (
    //         <span className="badge badge-danger">Requested</span>
    //       ) : row.asset_new_request_status === "Approved" ? (
    //         <span className="badge badge-success">Approved</span>
    //       ) : row.asset_new_request_status === "Rejected" ? (
    //         <span className="badge badge-warning">Rejected</span>
    //       ) : null}
    //     </>
    //   ),
    //   sortable: true,
    // },
  ];

  const activeColumns = tabOne ? columnsTab1 : columnsTab2;

  return (
    <>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Assets"
              columns={activeColumns}
              data={filterData}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              exportToCSV
              highlightOnHover
              subHeader
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TagedPersonOverview;
