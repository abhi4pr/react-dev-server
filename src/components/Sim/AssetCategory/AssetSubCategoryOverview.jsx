import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Link } from "react-router-dom";
// import { FaEdit } from "react-icons/fa";
import DeleteButton from "../../AdminPanel/DeleteButton";
import { useGlobalContext } from "../../../Context/Context";
import FormContainer from "../../AdminPanel/FormContainer";
import UserNav from "../../Pantry/UserPanel/UserNav";
import { FaEdit } from "react-icons/fa";

const AssetSubCategoryOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/get_all_asset_sub_category"
      );
      setFilterData(response.data);
      setData(response.data);
      console.log(response.data, "<------------sub cat");
    } catch (error) {
      toastAlert("Data not submitted", error.message);
      return null;
    }
  };
  useEffect(() => {
    const result = data.filter((d) => {
      return d.sub_category_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  useEffect(() => {
    getData();
  }, []);
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "10%",
      sortable: true,
    },

    {
      name: "Sub Category Name",
      selector: (row) => row.sub_category_name,
      sortable: true,
      width: "23%",
    },
    {
      name: "Category Name",
      selector: (row) => row.category_name,
      sortable: true,
      width: "23%",
    },
    {
      name: "In Warranty",
      selector: (row) => row.inWarranty,
      sortable: true,
      width: "23%",
    },

    // {
    //   name: "Description",
    //   selector: (row) => row.description,
    //   sortable: true,
    //   width: "23%",
    // },
    {
      name: "Action",
      width: "23%",

      cell: (row) => (
        <>
          <Link to={`/asset/subcategory-update/${row.sub_category_id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />
            </button>
          </Link>
          <DeleteButton
            endpoint="delete_asset_sub_category"
            id={row.sub_category_id}
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
                  mainTitle="Asset Sub Category"
                  link="/asset/subCategory"
                  submitButton={false}
                />
              </div>
              <div className="action_btns">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  <Link to="/asset/subCategory">Add</Link>
                </button>
              </div>
            </div>
            <div className="page_height">
              <div className="card mb-4">
                <div className="data_tbl table-responsive">
                  <DataTable
                    title="Sub Category Overview "
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

export default AssetSubCategoryOverview;
