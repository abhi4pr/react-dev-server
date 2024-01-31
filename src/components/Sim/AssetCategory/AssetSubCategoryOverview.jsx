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
import Modal from "react-modal";
import { baseUrl } from "../../../utils/config";

const AssetSubCategoryOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get(
        baseUrl+"get_all_asset_sub_category"
      );
      setFilterData(response.data.data);
      setData(response.data.data);
    } catch (error) {
      toastAlert("Data not submitted", error.message);
      return null;
    }
  };
  useEffect(() => {
    const result = data.filter((d) => {
      return d.sub_category_nam?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  useEffect(() => {
    getData();
  }, []);

  const [totalAssets, setTotalAssets] = useState([]);
  const [assetModal, seAssetModel] = useState(false);
  const handleTotalasset = async (row) => {
    console.log("id : ", row);
    try {
      const response = await axios.get(
        `${baseUrl}`+`get_total_asset_in_category/${row}`
      );
      setTotalAssets(response.data.data);
      console.log(response.data.data, "data sub cat");
      seAssetModel(true);
    } catch (error) {
      console.log("total asset not working", error);
    }
  };
  const handleClosAssetCounteModal = () => {
    seAssetModel(false);
  };

  const handleAllocatedAsset = async (row) => {
    try {
      const response = await axios.get(
        `${baseUrl}`+`get_total_asset_in_category_allocated/${row}`
      );
      setTotalAssets(response.data.data);
      console.log(response.data, "sub categoy");
      seAssetModel(true);
    } catch (error) {
      console.log("total asset not working", error);
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
      name: "Available Asset",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleTotalasset(row.category_id)}
        >
          {row.available_assets_count}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Allocated Asset",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleAllocatedAsset(row.category_id)}
        >
          {row.allocated_assets_count}
        </button>
      ),
      sortable: true,
    },
    {
      name: "In Warranty",
      cell: (row) => row.inWarranty,
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
                  <Link to="/admin/asset-dashboard">Dashboard</Link>
                </button>
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
                      </>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={assetModal}
        onRequestClose={handleClosAssetCounteModal}
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
              onClick={handleClosAssetCounteModal}
            >
              X
            </button>
          </div>
          <h1></h1>
          <DataTable
            columns={[
              {
                name: "S.No",
                cell: (row, index) => <div>{index + 1}</div>,
                width: "10%",
              },
              { name: "Asset Name", selector: (row) => row.assetsName },
              { name: "Category Name", selector: (row) => row.category_name },
              {
                name: "Subcategory Name",
                selector: (row) => row.sub_category_name,
              },
              { name: "Status", selector: (row) => row.status },
              { name: "Asset Type", selector: (row) => row.asset_type },
              { name: "Asset ID", selector: (row) => row.asset_id },
            ]}
            data={totalAssets}
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

export default AssetSubCategoryOverview;
