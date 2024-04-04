import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";
import DeleteButton from "../../DeleteButton";

const SalesServicesOverview = () => {
  const navigate = useNavigate();
  const [hobbiesData, setHobbiesData] = useState([]);
  const [origionalData, setOrigionalData] = useState([]);
  const [search, setSearch] = useState("");
  const getData = async () => {
    try {
      const response = await axios.get(
        baseUrl + "sales/getlist_sale_service_master"
      );
      const data = response.data.data;
      console.log(data, "hello world");
      setHobbiesData(data);
      setOrigionalData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = origionalData.filter((d) => {
      return d.hobby_name?.toLowerCase().includes(search.toLowerCase());
    });
    setHobbiesData(result);
  }, [search]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Service Name",
      selector: (row) => row.service_name,
    },
    {
      name: "Action",

      cell: (row) => (
        <>
          <div class="btn-group">
            <button
              type="button"
              class=" icon-1 "
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fa-solid fa-ellipsis"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to={`/admin/update-sales-services/${row._id}`}>
                <button className="dropdown-item ">Edit</button>
              </Link>
              <DeleteButton
                endpoint="sales/delete_sale_service_master"
                id={row._id}
                getData={getData}
              />
            </div>
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Services"
            link="/admin/create-sales-services"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Services Overview"
              columns={columns}
              data={hobbiesData}
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

export default SalesServicesOverview;
