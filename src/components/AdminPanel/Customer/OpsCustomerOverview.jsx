import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import axios from "axios";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";
import { FaUserPlus } from 'react-icons/fa';

const OpsCustomerOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  
 
  function getData() {
    axios.get(baseUrl + "get_all_customer_mast").then((res) => {
        //console.log(res.data.customerMastList, "rrrr")
        setData(res.data.customerMastList);
      setFilterData(res.data.customerMastList);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas?.filter((d) => {
      return (
        d.customer_type_id?.toLowerCase().includes(search.toLowerCase()) ||
        d.account_type_id?.toLowerCase().includes(search.toLowerCase()) ||
        d.ownership_id?.toLowerCase().includes(search.toLowerCase()) ||
        d.industry_id?.toLowerCase().includes(search.toLowerCase()) ||
        d.account_owner_id?.toLowerCase().includes(search.toLowerCase()) 

        );
    });
    setFilterData(result);
  }, [search]);
  

  const columns = [
    {
        name: "S.No",
        cell: (row, index) => <div>{index + 1}</div>,
        width: "5%",
        sortable: true,
      },
      {
        name: "Customer Name",
        selector: (row) => row.Customer_type_data.customer_type_name,
        sortable: true,
      },
      {
        name: "Account Name",
        selector: (row) => row.Account_type_data.account_type_name,
        sortable: true,
      },
      {
        name: "Ownership Name",
        selector: (row) => row.Ownership_data.ownership_name,  
        sortable: true,
      },
      {
        name: "Industry Name",
        selector: (row) => row.Industry_data.industry_name,  
        sortable: true,
      },
      {
        name: "Account Owner Name",
        selector: (row) => row.account_owner_id,
        sortable: true,
      },
     
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/customer-cont-master/`}>
          <button title="Add Contact" className="btn btn-outline-success btn-sm ml-2">
            <FaUserPlus />
          </button>
           </Link>
              
              <Link to={`/admin/ops-customer-update/${row.customer_type_id}`}>
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button"
                >
                <FaEdit />
                </button>
              </Link>
          
              <DeleteButton
                endpoint="customer_delete"
                id={row.customer_id}
                getData={getData}
              />
            </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  return (
    <>

       <Link to={`/admin/ops-customer-mast`}>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{marginBottom:'10px'}}
        >
        Add Customer
        </button>
      </Link>
      
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Ops Customer Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
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

export default OpsCustomerOverview;
