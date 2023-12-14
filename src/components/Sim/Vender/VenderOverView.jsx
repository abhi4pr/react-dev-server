import { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../../AdminPanel/DeleteButton";

const VenderOverView = () => {
  const { toastAlert } = useGlobalContext();
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.vendor_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/get_all_vendor"
      );
      setFilterData(response.data);
      setData(response.data);
      console.log(response.data, "jgdfuigjdf");
    } catch (error) {
      toastAlert("Data not submitted", error.message);
      return null;
    }
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Vender Name",
      selector: (row) => row.vendor_name,
      sortable: true,
      width: "14%",
    },
    {
      name: "Vender Contect",
      selector: (row) => row.vendor_contact_no,
      sortable: true,
      width: "20%",
    },
    {
      name: " Email",
      selector: (row) => row.vendor_email_id,
      sortable: true,
      width: "18%",
    },
    {
      name: " Address",
      selector: (row) => row.vendor_address,
      sortable: true,
      width: "12%",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      width: "15%",
    },
    {
      name: "Action",
      width: "15%",

      cell: (row) => (
        <>
          <Link to={`/vendorUpdate/${row.vendor_id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          <DeleteButton
            endpoint="delete_vendor"
            id={row.vendor_id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <div>
        <UserNav />
        <div className="section section_padding sec_bg h100vh">
          <div className="container">
            <div className="action_heading">
              <div className="action_title">
                <FormContainer
                  mainTitle="Vendor Master"
                  link="/vendorMaster"
                  submitButton={false}
                />
              </div>
              <div className="action_btns">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  <Link to="/vendorMaster">Add</Link>
                </button>
              </div>
            </div>
            <div className="page_height">
              <div className="card mb-4">
                <div className="data_tbl table-responsive">
                  <DataTable
                    title="Vender Overview"
                    columns={columns}
                    data={filterData}
                    fixedHeader
                    pagination
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
          </div>
        </div>
      </div>
    </>
  );
};

export default VenderOverView;
