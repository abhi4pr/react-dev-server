



import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import FormContainer from "../FormContainer";
import DeleteButton from '../DeleteButton' 

const PageAssignment = () => {
  const [assignPage, setAssignPage] = useState([]);
  const [filterData, setFilterData] = useState('');
  const [search, setSearch] = useState("");
  const getData = async () => {
    try {
      const res = await axios.get(
        `http://192.168.1.33:8080/api/get_list_page_assignment`
      );
      setAssignPage(res?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    const result = assignPage.filter((d) => {
      return d.page_id_name?.toLowerCase().includes(search.toLowerCase()) ||
             d.assignment_to_name?.toLowerCase().includes(search.toLowerCase()) 
    });
    setFilterData(result)
  }, [search,filterData]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Page Name",
      selector: (row) => row.page_id_name,
    },
    {
      name: "User Name",
      selector: (row) => row.assignment_to_name,
    },
    {
      name: "Discription",
      selector: (row) => row.description,
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
              <Link 
              to={`/admin/update-pageAssignment/${row._id}`}
              >
                <button className="dropdown-item ">Edit</button>
              </Link>
              <DeleteButton
                endpoint="delete_page_assignment"
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
            mainTitle="Page Assignment"
            link="/admin/create-pageAssignment"
            buttonAccess={true}
            submitButton={true}
          />
        </div>
      </div>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Assignment Overview"
              columns={columns}
              data={filterData}
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

export default PageAssignment;

