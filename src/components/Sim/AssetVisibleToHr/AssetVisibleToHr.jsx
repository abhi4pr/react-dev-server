import { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import DataTable from "react-data-table-component";
import axios from "axios";
import Modal from "react-modal";

const AssetVisibleToHr = () => {
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [vendorData, setVendorData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.asset_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.29.115:3000/api/show_asset_hr_data"
      );
      setFilterData(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVendorDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://34.93.221.166:3000/api/get_single_vendor/${id}`
      );
      setVendorData([response.data.data]);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

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
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Repair Request To Hr"
            link="/vendorMaster"
            submitButton={false}
          />
        </div>
      </div>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Repair Request Overview"
              columns={columns}
              data={filterData}
              fixedHeader
              //   pagination
              fixedHeaderScrollHeight="64vh"
              exportToCSV
              highlightOnHover
              subHeader
              subHeaderComponent={
                <>
                  <input
                    type="text"
                    placeholder="Search here"
                    className="w-50 form-control "
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </>
              }
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpenModal}
        onRequestClose={handleModalClose}
        style={{
          content: {
            width: "80%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {/* {selectedRow && ( */}
        <div>
          <div className="d-flex justify-content-between mb-2">
            {/* <h2>Department: {selectedRow.dept_name}</h2> */}

            <button
              className="btn btn-success float-left"
              onClick={handleModalClose}
            >
              X
            </button>
          </div>
          <h3>Vendor Details</h3>
          <DataTable
            columns={[
              {
                name: "S.No",
                cell: (row, index) => <div>{index + 1}</div>,
                width: "10%",
              },
              { name: "Vendor Name", selector: "vendor_name" },
              { name: "Type", selector: "vendor_type" },
              { name: "Email", selector: "vendor_email_id" },
              { name: "Contact No", selector: "vendor_contact_no" },
              { name: "Secondary Contact", selector: "secondary_contact_no" },
              { name: "Address", selector: "vendor_address" },
            ]}
            data={vendorData}
            highlightOnHover
            subHeader
            // subHeaderComponent={
            //   <input
            //     type="text"
            //     placeholder="Search..."
            //     className="w-50 form-control"
            //     value={modalSearch}
            //     onChange={(e) => setModalSearch(e.target.value)}
            //   />
            // }
          />
        </div>
        {/* )} */}
      </Modal>
    </>
  );
};

export default AssetVisibleToHr;
