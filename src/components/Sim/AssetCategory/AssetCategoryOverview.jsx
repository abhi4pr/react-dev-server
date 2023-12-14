import React, { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../../AdminPanel/DeleteButton";

const AssetCategoryOverview = () => {
  const { toastAlert } = useGlobalContext();

  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.category_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/get_all_asset_category"
      );
      setFilterData(response.data);
      setData(response.data);
    } catch (error) {
      toastAlert("Data not submitted", error.message);
      return null;
    }
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "10%",
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.category_name,
      sortable: true,
      width: "40%",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/asset-category-update/${row.category_id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          <DeleteButton
            endpoint="delete_asset_category"
            id={row.category_id}
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
                  mainTitle="Asset Category"
                  link="/asset-category-master"
                  submitButton={false}
                />
              </div>
              <div className="action_btns">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  <Link to="/asset-category-master">Add</Link>
                </button>
              </div>
            </div>
            <div className="page_height">
              <div className="card mb-4">
                <div className="data_tbl table-responsive">
                  <DataTable
                    title="User Overview"
                    columns={columns}
                    data={filterData}
                    fixedHeader
                    // pagination
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
                        {/* <button
                          className="btn btn-outline-success ml-2 btn-sm"
                          onClick={handleExport}
                        >
                          Export TO Excel
                        </button> */}
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

export default AssetCategoryOverview;
