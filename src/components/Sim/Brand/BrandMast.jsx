import React from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { baseUrl } from "../../../utils/config";

const BrandMast = () => {
  const [brandName, setBrandName] = useState("");
  const [brnadData, setBrandData] = useState([]);
  const [Brnadfilter, setBrnadFilter] = useState([]);
  const [search, setSearch] = useState("");

  const [brandId, setBrandId] = useState(0);
  const [brandNameUpdate, setBrandNameUpdate] = useState("");

  const [totalAssets, setTotalAssets] = useState([]);
  //Asset Count Modal
  const [assetModal, seAssetModel] = useState(false);

  const handleTotalasset = async (row) => {
    try {
      const response = await axios.get(
        `${baseUrl}`+`get_total_asset_in_category/${row}`
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
        `${baseUrl}`+`get_total_asset_in_category_allocated/${row}`
      );
      setTotalAssets(response.data.data);
      seAssetModel(true);
    } catch (error) {
      console.log("total asset not working", error);
    }
  };
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Brnad Name",
      selector: (row) => row.asset_brand_name,
      sortable: true,
    },
    {
      name: "Available Asset",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleTotalasset(row._id)}
        >
          {row.total_available_asset}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Allocated Asset",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleAllocatedAsset(row._id)}
        >
          {row.total_allocated_asset}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Add Modal",
      cell: (row) => (
        <>
          <Link to="/modal-mast">
            <button className="btn btn-outline-success">Add Modal</button>
          </Link>
        </>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#exampleModal"
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleBrandData(row)}
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="delete_asset_brand"
            id={row.asset_brand_id}
            getData={getBrandData}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isBrandExist = brnadData.some(
        (d) => d.asset_brand_name === brandName
      );
      if (isBrandExist) {
        alert("Brand already Exists");
      } else {
        const response = await axios.post(
          baseUrl+"add_asset_brand",
          {
            asset_brand_name: brandName,
          }
        );
        setBrandName("");
        getBrandData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function getBrandData() {
    const res = await axios.get(
      baseUrl+"get_all_asset_brands"
    );
    setBrandData(res.data.data);
    setBrnadFilter(res.data.data);
  }

  useEffect(() => {
    getBrandData();
  }, []);

  const handleBrandData = (row) => {
    setBrandId(row.asset_brand_id);
    setBrandNameUpdate(row.asset_brand_name);
  };
  const handleBrandUpdate = () => {
    axios
      .put(baseUrl+"update_asset_brand", {
        asset_brand_id: brandId,
        asset_brand_name: brandNameUpdate,
      })
      .then((res) => {
        getBrandData();
      });
  };

  useEffect(() => {
    const result = brnadData.filter((d) => {
      return d.asset_brand_name.toLowerCase().match(search.toLocaleLowerCase());
    });
    setBrnadFilter(result);
  }, [search]);

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 10%" }}>
        <UserNav />

        <FormContainer
          mainTitle="Brand"
          title="Add Brand"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            label="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </FormContainer>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Brand Overview"
              columns={columns}
              data={Brnadfilter}
              fixedHeader
              // pagination
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
      </div>
      {/* Update  */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Brand Update
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Brand Name"
                fieldGrid={12}
                value={brandNameUpdate}
                onChange={(e) => setBrandNameUpdate(e.target.value)}
              ></FieldContainer>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleBrandUpdate}
                data-dismiss="modal"
              >
                Save changes
              </button>
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
    </div>
  );
};

export default BrandMast;
