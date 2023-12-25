import React, { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../../AdminPanel/DeleteButton";
import Modal from "react-modal";

const AssetCategoryOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  // const [selectedRow, setSelectedRow] = useState(null);

  // Modal State
  const [catId, setCatId] = useState(0);
  const [categoryName, setCategoryName] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [totalAssets, setTotalAssets] = useState([]);

  //Asset Count Modal
  const [assetModal, seAssetModel] = useState(false);

  const handleTotalasset = async (row) => {
    try {
      const response = await axios.get(
        `http://34.93.221.166:3000/api/get_total_asset_in_category/${row}`
      );
      setTotalAssets(response.data.data);
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
        `http://34.93.221.166:3000/api/get_total_asset_in_category_allocated/${row}`
      );
      setTotalAssets(response.data.data);
      seAssetModel(true);
    } catch (error) {
      console.log("total asset not working", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://34.93.221.166:3000/api/add_asset_sub_category",
        {
          sub_category_name: subCategoryName,
          category_id: catId,
          // description: description,
          // created_by: loginUserId,
        }
      );
      getData();
      toastAlert("Data posted successfully!");
    } catch (error) {
      toastAlert(error.message);
    }
  };

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

  const handleRowClick = (row) => {
    setCategoryName(row.category_name);
    setCatId(row.category_id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
    },
    {
      name: "Subcat",
      cell: (row) => (
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => handleRowClick(row)}
        >
          Add Sub
        </button>
      ),
    },
    {
      name: "Sub Category Name",
      selector: (row) => row.sub_category_name,
      sortable: true,
    },
    {
      name: "Available Asset",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleTotalasset(row.category_id)}
        >
          {totalAssets?.length}
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
          {totalAssets?.length}
        </button>
      ),
      sortable: true,
    },
    // {
    //   name: "Description",
    //   selector: (row) => row.description,
    //   sortable: true,
    // },

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
                  <Link to="/asset/subCategory/overview">Sub Category</Link>
                </button>
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
                    title="Asset Categroy"
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
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
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
              onClick={handleCloseModal}
            >
              X
            </button>
          </div>
          <FormContainer
            mainTitle="Sub Category"
            title="create SubCategory "
            handleSubmit={handleSubmit}
            buttonAccess={false}
          >
            <FieldContainer
              label="Sub Category"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
            />

            <FieldContainer
              disabled
              label="Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </FormContainer>
        </div>
        {/* )} */}
      </Modal>
      {/* Total no of asset */}

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
          <h1>hello worl</h1>
          <DataTable
            columns={[
              {
                name: "S.No",
                cell: (row, index) => <div>{index + 1}</div>,
                width: "10%",
              },
              { name: "Asset Name", selector: "assetsName" },
              { name: "Category Name", selector: "category_name" },
              { name: "Subcategory Name", selector: "sub_category_name" },
              { name: "Status", selector: "status" },
              { name: "Asset Type", selector: "asset_type" },
              { name: "Asset ID", selector: "asset_id" },
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

export default AssetCategoryOverview;
