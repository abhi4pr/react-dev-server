import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";

const VendorOverview = () => {

  const [vendorTypes, setVendorTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([])

  const getData = () => {
    axios.get(baseUrl+"vendorAllData")
      .then((res) => {
        setVendorTypes(res.data.data);
        setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  },[])

  useEffect(() => {
    const result = vendorTypes.filter((d) => {
      return d.vendorMast_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendorMast_name,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
    },
    {
      name: "Email",
      selector: (row) => row.email
    },
    {
      name: "Home City",
      selector: (row) => row.home_city
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/pms-vendor-edit/${row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          <DeleteButton
            endpoint="deleteVendorMast"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  return (
    <>
      
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Vendor Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search Here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>

    </>
  );
};

export default VendorOverview;