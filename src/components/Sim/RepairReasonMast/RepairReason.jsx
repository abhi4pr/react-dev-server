import React from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useGlobalContext } from "../../../Context/Context";

const RepairReason = () => {
  const { categoryDataContext } = useGlobalContext();
  const [reason, setReason] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalFilter, setModalFilter] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryNameUpdate, setCategoryNameUpdate] = useState("");
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryNameUpdate, setSubCategoryNameUpdate] = useState("");
  const [search, setSearch] = useState("");

  const [modalId, setModalId] = useState(0);
  const [reasonUpdate, setReasonUpdate] = useState("");

  // const [brandData, setBrandData] = useState([]);
  // async function getBrandData() {
  //   const res = await axios.get(
  //     "http://34.93.221.166:3000/api/get_all_asset_brands"
  //   );
  //   setBrandData(res.data.data);
  // }
  // useEffect(() => {
  //   getBrandData();
  // }, []);

  const getAllSubCategory = () => {
    if (categoryName) {
      axios
        .get(
          `http://34.93.221.166:3000/api/get_single_asset_sub_category/${categoryName}`
        )
        .then((res) => {
          setSubCategoryData(res.data);
        });
    }
  };
  useEffect(() => {
    getAllSubCategory();
  }, [categoryName]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Modal Name",
      selector: (row) => row.asset_modal_name,
      sortable: true,
    },
    {
      name: "Brand Name",
      selector: (row) => row.asset_brand_name,
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
            id={row.asset_modal_id}
            getData={getModalData}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://34.93.221.166:3000/api/add_asset_modal",
        {
          asset_modal_name: reason,
          asset_brand_id: categoryName,
        }
      );
      setReason("");
      setCategoryName("");
      getModalData();
    } catch (error) {
      console.log(error);
    }
  };
  async function getModalData() {
    const res = await axios.get(
      "http://34.93.221.166:3000/api/get_all_asset_modals"
    );
    setModalData(res.data);
    setModalFilter(res.data);
  }

  useEffect(() => {
    getModalData();
  }, []);

  const handleBrandData = (row) => {
    console.log(row, "data");
    setModalId(row.asset_modal_id);
    setReasonUpdate(row.asset_modal_name);
    setCategoryNameUpdate(row.asset_brand_id);
  };
  const handleModalUpdate = () => {
    console.log(modalId, "id");
    axios
      .put("http://34.93.221.166:3000/api/update_asset_modal", {
        asset_modal_id: modalId,
        asset_brand_id: categoryNameUpdate,
        asset_modal_name: reasonUpdate,
      })
      .then((res) => {
        getModalData();
      });
  };

  useEffect(() => {
    const result = modalData.filter((d) => {
      return d.asset_brand_name
        ?.toLowerCase()
        .match(search.toLocaleLowerCase());
    });
    setModalFilter(result);
  }, [search]);

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 10%" }}>
        <UserNav />

        <FormContainer
          mainTitle="Repair Reason"
          title="Add Reason"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="form-group col-6">
            <label className="form-label">
              Category Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={categoryDataContext.map((opt) => ({
                value: opt.category_id,
                label: opt.category_name,
              }))}
              value={{
                value: categoryName,
                label:
                  categoryDataContext.find(
                    (user) => user.category_id === categoryName
                  )?.category_name || "",
              }}
              onChange={(e) => {
                setCategoryName(e.value);
              }}
              required
            />
          </div>
          <div className="form-group col-6">
            <label className="form-label">
              Sub Category Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={subcategoryData.map((opt) => ({
                value: opt.sub_category_id,
                label: opt.sub_category_name,
              }))}
              value={{
                value: subCategoryName,
                label:
                  subcategoryData.find(
                    (user) => user.sub_category_id === subCategoryName
                  )?.sub_category_name || "",
              }}
              onChange={(e) => {
                setSubCategoryName(e.value);
              }}
              required
            />
          </div>
          {/* <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={categoryDataContext.map((cat) => ({
                    label: cat.category_name,
                    value: cat.category_id,
                  }))}
                  // value={assetsCategory}
                  onChange={(e, newvalue) => {
                    // if (newvalue != null) {
                    setAssetsCategory({
                      label: newvalue.label,
                      category_id: newvalue.value,
                    });
                    // console.log(newvalue, "there is new value");
                    if (assetsCategoryError) {
                      setAssetsCategoryError("");
                    }
                    // }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assets Category *"
                      error={!!assetsCategoryError}
                      helperText={assetsCategoryError}
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={subcategoryData.map((sub) => ({
                    label: sub.sub_category_name,
                    value: sub.sub_category_id,
                  }))}
                  value={subCategory}
                  onChange={(e, newvalue) => {
                    setSubCategory((pre) => ({
                      label: newvalue.label,
                      sub_category_id: newvalue.value,
                    }));
                    if (subcategoryError) {
                      setSubCategoryError("");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sub Category *"
                      error={!!subcategoryError}
                      helperText={subcategoryError}
                    />
                  )}
                />
              </div>
            </div> */}
        </FormContainer>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Repair Reason Overview"
              columns={columns}
              data={modalFilter}
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
                Reason Update
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
              <div className="form-group col-12">
                <label className="form-label">
                  Category Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={categoryDataContext.map((opt) => ({
                    value: opt.category_id,
                    label: opt.category_name,
                  }))}
                  value={{
                    value: categoryNameUpdate,
                    label:
                      categoryDataContext.find(
                        (user) => user.category_id === categoryNameUpdate
                      )?.category_name || "",
                  }}
                  onChange={(e) => {
                    setCategoryNameUpdate(e.value);
                  }}
                  required
                />
              </div>
              <div className="form-group col-12">
                <label className="form-label">
                  Sub Category Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={subcategoryData.map((opt) => ({
                    value: opt.sub_category_id,
                    label: opt.sub_category_name,
                  }))}
                  value={{
                    value: subCategoryNameUpdate,
                    label:
                      subcategoryData.find(
                        (user) => user.sub_category_id === subCategoryNameUpdate
                      )?.sub_category_name || "",
                  }}
                  onChange={(e) => {
                    setSubCategoryNameUpdate(e.value);
                  }}
                  required
                />
              </div>
              <FieldContainer
                label="Reason "
                fieldGrid={12}
                value={reasonUpdate}
                onChange={(e) => setReasonUpdate(e.target.value)}
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
                onClick={handleModalUpdate}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairReason;
